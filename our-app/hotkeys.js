// const copyPasteHandler = require('./copy-paste');
// import copyPasteHandler from 'copy-paste.js';

/**
  chrome.tabs.executeScript( {
    code: "window.getSelection().toString();"
  }, function(selection) {
    document.getElementById("output").value = selection[0];
  });

 */

/**
  async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }
 */

const copyPasteHandler = {
  handleCopy: (slotNum) => {
    // save to slot num in permanent storage
    console.log("inside handleCopy")
    async function getCurentTab() {
      let queryOptions = { active: true, currentWindow: true };
      let [tab] = await chrome.tabs.query(queryOptions);
      return tab;
    }
    // const currentTab = 
    getCurentTab().then((currentTab) => {
      console.log(currentTab);

      function getSelection() {
        return window.getSelection().toString();
      }
  
      // const currentTabId = getTabId(); // does this work???
  
      chrome.scripting.executeScript( 
        {
          target: {tabId: currentTab.id}, // <- ERROR: target object has no property 'tabId' ?????
          func: getSelection 
        }, 
        (selection) => {
          // console.log(selection); // <- [{frameId: [number], result: [string]}] // the result is the selected string from window.getSelection().toString();
          const stringSelected = selection[0].result;
          // console.log(typeof stringSelected);
          const strSlotNum = String(slotNum);
          chrome.storage.local.set({strSlotNum: stringSelected}, function() {
            chrome.storage.local.get([strSlotNum], (response) => {
              console.log(response);
              console.log(`Selection saved in slot ${slotNum}: `, stringSelected);
            })
          });
        }
      );
    }); // currentTab.id <- should be a thing that exists
    /**
      chrome.scripting.executeScript({
      target: {tabId: id, allFrames: true},
      files: ['content_scripts/cscript.js'],
      });
     */

    // chrome.tabs.getCurrent()
    // .then(function(tab) {
    //   console.log("inside chrome.tabs.getCurrent");
    //   console.log(tab);
    //   if(tab) {
    //     console.log("inside tabId");
    //     const SELECTION = window.getSelection().toString(); // <- some string from the window 'hello world'
    //     console.log(SELECTION);
    //     chrome.storage.local.set({slotNum: SELECTION}, function() {
    //       console.log(`Selection saved in slot ${slotNum}: `, SELECTION);
    //     });
    //   }
    // });
  },
  handlePaste: (slotNum) => {
    // paste from slot num in permanent storage
    const strSlotNum = String(slotNum);
    chrome.storage.local.get([strSlotNum], (response) => { // response = {slotNumber: 'string data'}
      // do something with the response object
      console.log(response); // [String(slotNum)]
    });
  }
};

chrome.commands.onCommand.addListener((command) => {
  if (String(command) === 'multi-copy1') { // then handle it
    copyPasteHandler.handleCopy(1);
  }
  if (command === 'multi-paste1') {// then handle it
    copyPasteHandler.handlePaste(1);
  }
  console.log(`Command: ${command}`); // -> 'multi-copy1' OR 'multi-paste1'
});