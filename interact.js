// function to start timer
startTimer = () => {
  chrome.runtime.sendMessage(
    {
      startTimer: true,
    },
    function () {
      alert("block timer started");
    }
  );
};

// When page loads do the following
window.addEventListener("load", (event) => {
  // assign the button
  var button = document.getElementById("startTimer");
  button.style.display = "none";
  chrome.storage.sync.get(["resetAt"], function (result) {
    const { resetAt = 0 } = result;
    if (resetAt < Date.now()) {
      button.style.display = "inline";
      // add the start timer function
      button.addEventListener(
        "click",
        () => {
          startTimer();
        },
        false
      );
    }
  });
});
