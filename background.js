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
    "*://theguardian.com/*",
    "*://cnn.com/*",
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
// TODO: start timer
// TODO: store what tab is blocked so that when timer is pressed it updates

var block = true;

chrome.webRequest.onBeforeRequest.addListener(
  (page) => {
    if (block) {
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
    sendResponse({ response: "timer started" });
    block = false;
  }
});
