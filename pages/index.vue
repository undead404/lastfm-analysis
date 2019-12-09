<template>
  <div class="container">
    <div>
      <logo />
      <h1 class="title">lastfm-analysis</h1>
      <h2 class="subtitle">additional tools to analyse my last.fm profile</h2>
      <div class="links">
        <b-button @click="request" variant="primary">Request</b-button>
      </div>
      <div>{{ JSON.stringify(this.$store.state) }}</div>
    </div>
    <request-progress />
  </div>
</template>

<script>
import get from 'lodash/get';
import getLovedTracks from '~/utils/lastfm/user/getLovedTracks';
import Logo from '~/components/Logo.vue';
import RequestProgress from '~/components/RequestProgress';

export default {
  components: {
    Logo,
    RequestProgress,
  },
  data() {
    return {};
  },
  async created() {
    const username = get(this.$store.state, 'lastfm.username');
    this.$store.commit('requests/expect', 1);
    this.lovedTracks = await getLovedTracks(username);
    this.$store.commit('requests/success', 1);
  },
  methods: {
    async request() {
      const username = get(this.$store.state, 'lastfm.username');
      this.$store.commit('requests/expect', 1);
      this.$store.commit(
        'lastfm/registerLovedTracks',
        await getLovedTracks(username),
      );
      this.$store.commit('requests/success', 1);
    },
  },
};
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-bottom: 2rem;
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

.links {
  padding-top: 15px;
}
</style>
