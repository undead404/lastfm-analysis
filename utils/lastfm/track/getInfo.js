import get from 'lodash/get';
import { LASTFM_API_KEY } from '../config';
import renderUrl from '~/utils/renderUrl';
import throttledFetch from '~/utils/throttledFetch';
const URL_TEMPLATE =
  'http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key={{apiKey}}&artist={{artist}}&track={{trackName}}&format=json';

export default async function getTrackInfo(artist, trackName) {
  if (!artist) {
    throw new Error('no artist provided');
  }
  if (!trackName) {
    throw new Error('no trackName provided');
  }
  const url = renderUrl(URL_TEMPLATE, {
    apiKey: LASTFM_API_KEY,
    artist,
    trackName,
  });
  const response = await throttledFetch(url);
  return get(await response.json(), 'track');
}
