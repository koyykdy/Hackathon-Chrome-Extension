const copyPasteHandler = {
  handleCopy: (slotNum) => {
    // save to slot num in permanent storage
    chrome.tabs.getCurrent(function(_tabId) {
      if(_tabId) {
        const SELECTION = window.getSelection().toString(); // <- some string from the window 'hello world'
        chrome.storage.local.set({slotNum: SELECTION}, function() {
          console.log(`Selection saved in slot ${slotNum}: `, SELECTION);
        });
      }
    });
  },
  handlePaste: (slotNum) => {
    // paste from slot num in permanent storage
  }
};
/**
  document.onmouseup = function() { 
    
  }
 */
// export default copyPasteHandler;