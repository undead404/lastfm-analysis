<script>
import flow from 'lodash/flow';
import fpGet from 'lodash/fp/get';
import fpProperty from 'lodash/fp/property';
import last from 'lodash/last';
import get from 'lodash/get';
const getBiggestImageUrl = flow(fpGet('image'), last, fpProperty('#text'));
export default {
  props: {
    track: Object,
  },
  computed: {
    description() {
      return `${get(this.track, 'artist.name', 'Unknown artist')} - ${get(
        this.track,
        'name',
      )}`;
    },
    imageUrl() {
      return getBiggestImageUrl(this.track);
    },
    url() {
      return get(this.track, 'url');
    },
  },
};
</script>
<template>
  <b-card
    :title="description"
    :img-src="imageUrl"
    img-alt="Image"
    img-top
    tag="article"
    style="max-width: 20rem;"
    class="mb-2"
  >
    <b-card-text>
      {{ description }}
    </b-card-text>

    <b-button :href="url" variant="primary">Go to Last.fm</b-button>
  </b-card>
</template>
