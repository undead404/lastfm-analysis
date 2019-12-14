import forEach from 'lodash/forEach';
import isArray from 'lodash/isArray';
import size from 'lodash/size';
import split from 'lodash/split';
import Vue from 'vue';
export default function setObservable(obj, path, value) {
  const parts = isArray(path) ? path : split(path, '.');
  let current = obj;
  let next;
  forEach(parts, (part, i) => {
    if (i === size(parts) - 1) {
      Vue.set(current, part, value);
    } else {
      next = current[part];
      if (!next) {
        next = Vue.observable({});
        Vue.set(current, part, next);
      }
      current = next;
    }
  });
}
