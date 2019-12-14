export default function waitFor(timeInMilliseconds) {
  return new Promise(resolve => {
    setTimeout(resolve, timeInMilliseconds);
  });
}
