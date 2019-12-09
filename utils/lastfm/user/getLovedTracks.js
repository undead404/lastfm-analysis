import fetch from 'node-fetch';
import Mustache from 'mustache';
import { LASTFM_API_KEY } from '../config';
const URL_TEMPLATE =
  'http://ws.audioscrobbler.com/2.0/?method=user.getlovedtracks&user={{username}}&api_key={{apiKey}}&format=json&page={{pageNum}}';

export default async function getLovedTracks(username, pageNum = 1) {
  if (!username) {
    console.error('no username provided');
    return {};
  }
  const url = Mustache.render(URL_TEMPLATE, {
    apiKey: LASTFM_API_KEY,
    pageNum,
    username,
  });
  const response = await fetch(url);
  return response.json();
}
