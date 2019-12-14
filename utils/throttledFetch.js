import fetch from 'node-fetch';
// import waitFor from './waitFor';

// const LIMIT = 100;
// const PERIOD = 100;
// let activeRequests = 0;

// setInterval(() => {
//   if (activeRequests <= 0) {
//     return;
//   }
//   if (activeRequests > LIMIT) {
//     activeRequests -= LIMIT;
//   }
// }, PERIOD);

export default fetch;

// export default async function throttledFetch(...args) {
//   // eslint-disable-next-line no-unmodified-loop-condition
//   while (activeRequests >= LIMIT) {
//     await waitFor(PERIOD);
//   }
//   return fetch(...args);
// }
