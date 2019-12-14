import get from 'lodash/get';
import { LASTFM_API_KEY } from '../config';
import renderUrl from '~/utils/renderUrl';
import throttledFetch from '~/utils/throttledFetch';
const URL_TEMPLATE =
  'http://ws.audioscrobbler.com/2.0/?method=user.getLovedTracks&user={{username}}&api_key={{apiKey}}&format=json&page={{pageNum}}';

export default async function getLovedTracks(username, pageNum = 1) {
  if (!username) {
    throw new Error('no username provided');
  }
  const url = renderUrl(URL_TEMPLATE, {
    apiKey: LASTFM_API_KEY,
    pageNum,
    username,
  });
  const response = await throttledFetch(url);
  return get(await response.json(), 'lovedtracks');
}
