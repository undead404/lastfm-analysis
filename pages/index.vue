<script>
import entries from 'lodash/entries';
import get from 'lodash/get';
import join from 'lodash/join';
import map from 'lodash/map';
import noop from 'lodash/noop';
import nth from 'lodash/nth';
import size from 'lodash/size';
import slice from 'lodash/slice';
import sortBy from 'lodash/sortBy';
import throttle from 'lodash/throttle';
import randomColor from 'randomcolor';
import Vue from 'vue';
import { mapActions } from 'vuex';
import Chart from '~/components/Chart';
import Logo from '~/components/Logo.vue';
import RequestProgress from '~/components/RequestProgress';
import hashtagize from '~/utils/hashtagize';
import prettifyTag from '~/utils/misc/prettifyTag';

const tagsColors = new Map();

function getTagColor(tagName) {
  if (!tagsColors.has(tagName)) {
    tagsColors.set(tagName, randomColor());
  }
  return tagsColors.get(tagName);
}

export default {
  components: {
    Chart,
    Logo,
    RequestProgress,
  },
  data() {
    return {
      taste: {},
      unwatch: noop,
      username: 'UNDEADUM',
    };
  },
  computed: {
    busy() {
      return get(this.$store.state, 'lastfm.busy');
    },
    chartData() {
      const tagsNames = map(this.tasteEntries, tag => prettifyTag(nth(tag, 0)));
      return {
        datasets: [
          {
            backgroundColor: map(tagsNames, getTagColor),
            data: map(this.tasteEntries, tag => nth(tag, 1)),
            label: 'Tags',
          },
        ],
        labels: tagsNames,
      };
    },
    hashtags() {
      return join(
        map(this.tasteEntries, ([tagName]) => `#${hashtagize(tagName)}`),
        ' ',
      );
    },
    shouldShowChart() {
      return size(this.tasteEntries) > 0;
    },
    tasteEntries() {
      const taste = this.taste || {};
      return slice(
        sortBy(entries(taste), ([, value]) => -value),
        0,
        10,
      );
    },
    user() {
      return get(this.$store.state, ['lastfm', 'users', this.username], {});
    },
  },
  watch: {
    username(newUsername) {
      this.$store.commit('lastfm/setUsername', newUsername);
      this.unwatch();
      this.unwatch = this.$store.watch(
        state => get(state, ['lastfm', 'users', newUsername, 'taste']),
        taste => {
          this.throttledSetTaste(taste);
        },
      );
    },
  },
  created() {
    this.unwatch = this.$store.watch(
      state => get(state, ['lastfm', 'users', this.username, 'taste']),
      taste => {
        this.throttledSetTaste(taste);
      },
    );
  },
  methods: {
    getTrackKey(track) {
      return get(track, 'date.uts');
    },
    request() {
      this.taste = Vue.observable({});
      this.collectTaste();
    },
    throttledSetTaste: throttle(function(taste) {
      this.taste = taste;
    }, 5000),
    ...mapActions({
      collectTaste: 'lastfm/collectTaste',
      fetchLovedTracks: 'lastfm/fetchLovedTracks',
    }),
  },
};
</script>

<style>
.main-container {
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  height: 100vh;
  margin: 0 auto;
  overflow: auto;
  padding-bottom: 2rem;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}
</style>

<template>
  <div class="main-container">
    <div class="header">
      <logo />
      <h1 class="title">lastfm-analysis</h1>
      <h2 class="subtitle">additional tools to analyse my last.fm profile</h2>
    </div>
    <b-form
      ><b-form-group
        id="input-group-1"
        label="Last.fm username:"
        label-for="username-input"
        description="Your username at Last.fm social network."
      >
        <b-form-input
          id="username-input"
          :disabled="busy"
          v-model="username"
          type="text"
          required
          placeholder="Username"
        ></b-form-input>
      </b-form-group>
      <div>
        <b-button :disabled="busy" @click="request" variant="primary"
          >Collect taste</b-button
        >
      </div>
    </b-form>
    <b-container v-if="hashtags">
      <div>{{ hashtags }}</div></b-container
    >
    <b-container v-if="shouldShowChart"
      ><Chart :chart-data="chartData" class="w-100"
    /></b-container>
    <request-progress />
  </div>
</template>
