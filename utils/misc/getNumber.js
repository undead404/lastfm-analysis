import flow from 'lodash/flow';
import get from 'lodash/fp/get';
import toNumber from 'lodash/fp/toNumber';
export default flow(get, toNumber);
