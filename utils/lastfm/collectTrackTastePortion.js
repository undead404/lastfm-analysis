import forEach from 'lodash/forEach';
import get from 'lodash/get';
import has from 'lodash/has';
// import mapValues from 'lodash/mapValues';
import size from 'lodash/size';
// import sum from 'lodash/sum';
// import values from 'lodash/values';
import getTrackInfo from '~/utils/lastfm/track/getTrackInfo';
import getTrackTopTags from '~/utils/lastfm/track/getTrackTopTags';
import TAGS from '~/utils/lastfm/tags.json';
import normalizeTag from '~/utils/misc/normalizeTag';
import getAlbumTopTags from '~/utils/lastfm/album/getTopTags';
import getArtistTopTags from '~/utils/lastfm/artist/getTopTags';

function areTagsValuable(tags) {
  return size(tags) > 0;
}

export default async function getTrackTastePortion(
  artist,
  trackName,
  trackUts,
) {
  let tags;
  let album;
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
  if (!areTagsValuable) {
    return {};
  }
  return tags;
  // const tagsSum = sum(values(tags));
  // const currentUts = new Date().valueOf();
  // return mapValues(
  //   tags,
  //   (weight, tag) => weight / (tagsSum * (currentUts - trackUts)),
  // );
}
