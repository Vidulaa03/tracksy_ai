// Service worker — handles extension lifecycle events.
chrome.runtime.onInstalled.addListener(() => {
  console.log('Tracksy extension installed.');
});
