// Initialize button with user's preferred color
let button = document.getElementById("button");

chrome.storage.sync.get("color", ({ color }) => {
  button.style.backgroundColor = color;
});

// When the button is clicked, inject setPageBackgroundColor into current page
button.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if(button.innerText === "ON") {
      button.innerText = "OFF"
    }
    else {
      button.innerText = "ON"
    }
    // chrome.scripting.executeScript({
    //   target: { tabId: tab.id },
    //   function: setPageBackgroundColor,
    // });
  });
  
  // The body of this function will be executed as a content script inside the
  // current page
  function setPageBackgroundColor() {
    chrome.storage.sync.get("color", ({ color }) => { // sync.get("color") -> {color: '#ffffff'} 
      document.body.style.backgroundColor = color;
    });
  }