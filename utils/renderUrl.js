import mapValues from 'lodash/mapValues';
import strictUriEncode from 'strict-uri-encode';

import Mustache from 'mustache';
export default function renderUrl(template, params) {
  return Mustache.render(template, mapValues(params, strictUriEncode));
}
