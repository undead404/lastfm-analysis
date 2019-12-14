<script>
import get from 'lodash/get';
import { mapState } from 'vuex';
export default {
  computed: mapState({
    max(state) {
      return get(state, 'lastfm.requestsTotal', 0);
    },
    value(state) {
      return get(state, 'lastfm.requestsSuccessful', 0);
    },
  }),
};
</script>
<style scoped>
.progress {
  bottom: 0px;
  left: 0px;
  position: fixed;
}
</style>
<template>
  <b-progress
    :value="value"
    :max="max"
    v-if="max"
    animated
    class="w-100"
    height="2rem"
    show-progress
  />
</template>
