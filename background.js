// Limit the requests for which events are
// triggered.
//
// This allos us to have our code being executed
// only when the following URLs are matched.
//
// ps.: if we were going to dynamically set the
//      URLs to be matched (used a configuration
//      page, for example) we'd then specify the
//      wildcard <all_urls> and then do the filtering
//      ourselves.
const filter = {
  // urls: ["*://twitter.com/*"],
  urls: [
    "*://news.ycombinator.com/*",
    "*://twitter.com/*",
    "*://www.bbc.com/*",
    "*://youtbe.com/*",
    "*://www.theguardian.com/*",
    "*://www.cnn.com/*",
  ],
};

// Extra flags for the `onBeforeRequest` event.
//
// Here we're specifying that we want our callback
// function to be executed synchronously such that
// the request remains blocked until the callback
// function returns (having our filtering taking
// effect).
const webRequestFlags = ["blocking"];

// Register our function that takes action when a request
// is initiated and matches the provided filter that we
// specified in the options.
//
// Because we outsourced the URL filtering to chrome itself
// all we need to do here is always cancel the request (as
// it matches the filter of unwanted webpages).
// TODO: store what tabs are blocked so that when timer is pressed it updates

var unblockSeconds = 10 * 60;
var resetInSeconds = 3 * 60 * 60;

chrome.webRequest.onBeforeRequest.addListener(
  (page) => {
    chrome.storage.sync.get(["blockAt"], function (result) {
      const { blockAt = 0 } = result;
      var secondsTillBlock = (blockAt - Date.now) / 1000;
      console.log(`Blocking in ${blockAt} seconds`);
      if (blockAt < Date.now()) {
        console.log("page blocked - " + page.url);
        chrome.tabs.update({ url: chrome.runtime.getURL("index.html") });
        return {
          cancel: true,
        };
      } else {
        return {
          cancel: false,
        };
      }
    });
  },
  filter,
  webRequestFlags
);

//TODO: Find out why not blocking - is it a twitter thing

// chrome.storage.sync.set({ yourBody: "myBody" }, function () {
//   alert("stored");
// });

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.startTimer) {
    var blockAt = Date.now() + unblockSeconds * 1000;
    var resetAt = Date.now() + resetInSeconds * 1000;
    chrome.storage.sync.set({ blockAt, resetAt }, function () {
      sendResponse({ response: `timer started at ${blockAt}` });
      console.log("Value is set to " + blockAt);
    });
  }
});
