import replace from 'lodash/replace';
import toLower from 'lodash/toLower';
import trim from 'lodash/trim';
export default function normalizeTag(tag) {
  return trim(toLower(replace(tag, /[^a-zA-Z0-9]+/g, ' ')));
}
