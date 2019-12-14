import get from 'lodash/get';
import { LASTFM_API_KEY } from '../config';
import renderUrl from '~/utils/renderUrl';
import throttledFetch from '~/utils/throttledFetch';
const URL_TEMPLATE =
  'http://ws.audioscrobbler.com/2.0/?method=album.getTopTags&api_key={{apiKey}}&artist={{artist}}&album={{album}}&format=json';

export default async function getTopTags(artist, album) {
  if (!artist) {
    throw new Error('no artist provided');
  }
  if (!album) {
    throw new Error('no album provided');
  }
  const url = renderUrl(URL_TEMPLATE, {
    album,
    apiKey: LASTFM_API_KEY,
    artist,
  });
  const response = await throttledFetch(url);
  return get(await response.json(), 'toptags');
}
