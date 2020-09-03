// function to start timer
startTimer = () => {
  chrome.runtime.sendMessage(
    {
      startTimer: true,
    },
    function () {
      alert("timer sent");
    }
  );
};

// When page loads do the following
window.addEventListener("load", (event) => {
  // assign the button
  var button = document.getElementById("startTimer");
  // add the start timer function
  button.addEventListener(
    "click",
    () => {
      startTimer();
    },
    false
  );
});
