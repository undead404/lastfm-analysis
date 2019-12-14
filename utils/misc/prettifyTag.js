import get from 'lodash/get';
import normalizeTag from './normalizeTag';
import TAGS from '~/utils/lastfm/tags.json';
export default function prettifyTag(tag) {
  const normalizedTag = normalizeTag(tag);
  return get(TAGS, normalizedTag, normalizedTag);
}
