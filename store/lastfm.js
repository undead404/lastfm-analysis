import chunk from 'lodash/chunk';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import has from 'lodash/has';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';
import pick from 'lodash/pick';
import range from 'lodash/range';
import size from 'lodash/size';
import sum from 'lodash/sum';
import unionBy from 'lodash/unionBy';
import values from 'lodash/values';
import Vue from 'vue';
import createLogger from 'vuex/dist/logger';
import getNumber from '~/utils/misc/getNumber';
import getLovedTracks from '~/utils/lastfm/user/getLovedTracks';
import getTrackInfo from '~/utils/lastfm/track/getInfo';
import getTrackTopTags from '~/utils/lastfm/track/getTopTags';
import TAGS from '~/utils/lastfm/tags.json';
import normalizeTag from '~/utils/misc/normalizeTag';
import getAlbumTopTags from '~/utils/lastfm/album/getTopTags';
import getArtistTopTags from '~/utils/lastfm/artist/getTopTags';
import setObservable from '~/utils/setObservable';
function areTagsValuable(tags) {
  return size(tags) > 0;
}

export const actions = {
  async collectTaste({ commit, dispatch, state }) {
    commit('setBusy', true);
    const username = get(state, 'username');
    let lovedTracks = get(state, ['users', username, 'lovedTracks', 'data']);
    if (!lovedTracks) {
      await dispatch('fetchLovedTracks');
      lovedTracks = get(state, ['users', username, 'lovedTracks', 'data']);
    }
    commit(
      'expectRequests',
      get(state, ['users', username, 'lovedTracks', 'meta', 'total'], 0),
    );
    // return Promise.all(
    for (const lovedTracksChunk of chunk(lovedTracks, 50)) {
      await Promise.all(
        map(lovedTracksChunk, async lovedTrack => {
          const artist = get(lovedTrack, 'artist.name');
          const trackName = get(lovedTrack, 'name');
          const trackUts = get(lovedTrack, 'date.uts');
          const tastePortion = await dispatch('collectTrackTastePortion', {
            artist,
            trackName,
            trackUts,
          });
          commit('addTastePortion', tastePortion);
        }),
      );
      // await waitFor(1000);
    }
    commit('setBusy', false);
    commit('finishRequests');
    // );
  },
  async collectTrackTastePortion(
    { commit, state },
    { artist, trackName, trackUts } = {},
  ) {
    if (!artist) {
      throw new Error('no artist provided');
    }
    if (!trackName) {
      throw new Error('no trackName provided');
    }
    if (!trackUts) {
      throw new Error('no trackUts provided');
    }
    let tags;
    let album;
    // tags = get(state, ['tracks', artist, trackName]);
    if (!areTagsValuable(tags)) {
      const trackTopTagsData = await getTrackTopTags(artist, trackName);
      tags = {};
      forEach(get(trackTopTagsData, 'tag', []), tag => {
        const normalizedTag = normalizeTag(get(tag, 'name'));
        if (has(TAGS, normalizedTag)) {
          tags[normalizedTag] = get(tag, 'count', 0);
        }
      });
    }
    if (!areTagsValuable(tags)) {
      const trackInfo = await getTrackInfo(artist, trackName);
      const album = get(trackInfo, 'album.name');
      if (album) {
        const albumTopTags = await getAlbumTopTags(artist, album);
        tags = {};
        forEach(get(albumTopTags, 'tag', []), tag => {
          const normalizedTag = normalizeTag(get(tag, 'name'));
          if (has(TAGS, normalizedTag)) {
            tags[normalizedTag] = get(tag, 'count', 0);
          }
        });
      }
    }
    if (!areTagsValuable(tags)) {
      const artistTopTags = await getArtistTopTags(artist, album);
      tags = {};
      forEach(get(artistTopTags, 'tag', []), tag => {
        const normalizedTag = normalizeTag(get(tag, 'name'));
        if (has(TAGS, normalizedTag)) {
          tags[normalizedTag] = get(tag, 'count', 0);
        }
      });
    }
    commit('successRequests', 1);
    if (!areTagsValuable) {
      return {};
    }
    // if (!has(state, ['tracks', artist, trackName])) {
    //   commit('registerTrackTopTags', artist, trackName, tags);
    // }
    // return tags;
    const tagsSum = sum(values(tags));
    const currentUts = new Date().valueOf();
    return mapValues(
      tags,
      weight => weight / (tagsSum * (currentUts - trackUts)),
    );
  },
  async fetchLovedTracks({ commit, state }) {
    const username = get(state, 'username');
    commit('expectRequests', 1);
    const lovedTracksData = await getLovedTracks(username);
    commit('successRequests', 1);
    const totalPages = getNumber(lovedTracksData, ['@attr', 'totalPages'], 0);
    commit('registerLovedTracks', lovedTracksData);
    if (totalPages > 1) {
      commit('expectRequests', totalPages - 1);
      await Promise.all(
        map(range(2, totalPages + 1), async pageNum => {
          const data = await getLovedTracks(username, pageNum);
          commit('registerLovedTracks', data);
          commit('successRequests', 1);
          // await waitFor(1000);
        }),
      );
    }
  },
};
export const mutations = {
  addTastePortion(state, tastePortion) {
    const username = get(state, 'username');
    // const taste = clone(get(state, ['users', username, 'taste'], {}));
    // const taste = get(state, ['users', username, 'taste']);
    forEach(tastePortion, (weight, tag) => {
      // Vue.set(taste, tag, get(taste, tag, 0) + weight);
      setObservable(
        state,
        ['users', username, 'taste', tag],
        get(state, ['users', username, 'taste', tag], 0) + weight,
      );
    });
    // Vue.set(state, 'users', {
    //   ...get(state, 'users', {}),
    //   [username]: {
    //     ...get(state, ['users', username], {}),
    //     taste,
    //   },
    // });
    // state.users[username].taste = taste;
  },
  expectRequests(state, number) {
    const oldTotal = get(state, 'requestsTotal', 0);
    state.requestsTotal = oldTotal + number;
  },
  finishRequests(state) {
    state.requestsTotal = 0;
    state.requestsSuccessful = 0;
  },
  setBusy(state, value) {
    state.busy = !!value;
  },
  setUsername(state, newUsername) {
    Vue.set(state, 'username', newUsername);
  },
  successRequests(state, number) {
    const oldSuccessful = get(state, 'requestsSuccessful', 0);
    const oldTotal = get(state, 'requestsTotal', 0);
    if (oldSuccessful + number >= oldTotal) {
      state.requestsTotal = 0;
      state.requestsSuccessful = 0;
    } else {
      const newSuccessful = oldSuccessful + number;
      state.requestsSuccessful =
        oldTotal > newSuccessful ? newSuccessful : oldTotal;
    }
  },
  registerLovedTracks(state, lovedTracksData) {
    const total = getNumber(lovedTracksData, ['@attr', 'total'], 0);
    const totalPages = getNumber(lovedTracksData, ['@attr', 'totalPages'], 0);
    const username = get(lovedTracksData, '@attr.user');
    let users = get(state, 'users');
    if (!users) {
      users = Vue.observable({});
      Vue.set(state, 'users', users);
    }
    let user = get(users, username);
    if (!user) {
      user = Vue.observable({});
      setObservable(users, ['users', username], user);
    }
    // const user = find(get(state, 'users'), ['name', username]);
    const oldLovedTracks = get(
      state,
      ['users', username, 'lovedTracks', 'data'],
      [],
    );
    if (!get(user, 'lovedTracks.meta')) {
      setObservable(
        state,
        ['users', username, 'lovedTracks', 'meta'],
        Vue.observable({
          total,
          totalPages,
        }),
      );
    }
    const newLovedTracks = get(lovedTracksData, 'track');
    const lovedTracks = unionBy(
      oldLovedTracks,
      map(newLovedTracks, lovedTrack =>
        pick(lovedTrack, ['artist.name', 'date.uts', 'image', 'name']),
      ),
      lovedTrack => get(lovedTrack, 'date.uts'),
    );
    setObservable(
      state,
      ['users', username, 'lovedTracks', 'data'],
      lovedTracks,
    );
  },
  registerTrackTopTags(state, artist, trackName, tags) {
    setObservable(state, ['tracks', artist, trackName], tags);
  },
};
export const plugins = [createLogger()];

export function state() {
  return {
    busy: false,
    requestsSuccessful: 0,
    requestsTotal: 0,
    tracks: {},
    username: 'UNDEADUM',
    users: {
      UNDEADUM: {
        lovedTracks: [],
        taste: {},
      },
    },
    //   {
    //     lovedTracks: {
    //       data: [],
    //       meta: {
    //         total: 0,
    //         totalPages: 0,
    //       },
    //     },
    //     name: 'UNDEADUM',
    //   },
    // ],
  };
}
