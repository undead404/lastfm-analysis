import replace from 'lodash/replace';
import toLower from 'lodash/toLower';
import normalizeTag from './misc/normalizeTag';

export default function hashtagize(str) {
  return toLower(replace(normalizeTag(str), / /g, '_'));
}
