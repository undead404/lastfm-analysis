import get from 'lodash/get';
import toNumber from 'lodash/toNumber';
export default function(obj, path, defaultValue) {
  const value = get(obj, path, defaultValue);
  return toNumber(value);
}
