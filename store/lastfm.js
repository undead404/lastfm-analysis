import find from 'lodash/find';
import get from 'lodash/get';
import set from 'lodash/set';
import unionBy from 'lodash/unionBy';
import getNumber from '~/utils/misc/getNumber';
export const mutations = {
  registerLovedTracks(state, lovedTracksData) {
    const total = getNumber(lovedTracksData, 'lovedtracks.@attr.total');
    const totalPages = getNumber(
      lovedTracksData,
      'lovedtracks.@attr.totalPages',
    );
    const username = get(lovedTracksData, 'lovedtracks.@attr.user');
    const user = find(get(state, 'users'), ['name', username]);
    const oldLovedTracks = get(user, 'lovedTracks.data', []);
    if (!get(user, 'lovedTracks.meta.total')) {
      set(user, 'lovedTracks.meta.total', total);
    }
    if (!get(user, 'lovedTracks.meta.totalPages')) {
      set(user, 'lovedTracks.meta.totalPages', totalPages);
    }
    const newLovedTracks = get(lovedTracksData, 'lovedtracks.track');
    const lovedTracks = unionBy(oldLovedTracks, newLovedTracks, lovedTrack =>
      get(lovedTrack, 'date.uts'),
    );
    set(user, 'lovedTracks.data', lovedTracks);
  },
};

export function state() {
  return {
    username: 'UNDEADUM',
    users: [
      {
        lovedTracks: {
          data: [],
          meta: {
            total: 0,
            totalPages: 0,
          },
        },
        name: 'UNDEADUM',
      },
    ],
  };
}
