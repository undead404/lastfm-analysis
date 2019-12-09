import get from 'lodash/get';
import set from 'lodash/set';
export const mutations = {
  expect(state, number) {
    const oldAll = get(state, 'all', 0);
    set(state, 'all', oldAll + number);
  },
  success(state, number) {
    const oldSuccessful = get(state, 'successful', 0);
    const oldAll = get(state, 'all', 0);
    if (oldSuccessful + number >= oldAll) {
      set(state, 'all', 0);
      set(state, 'successful', 0);
    } else {
      set(state, 'successful', oldSuccessful + number);
    }
  },
};
export function state() {
  return {};
}
