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
    // console.log("inside handleCopy")
    async function getCurentTab() {
      let queryOptions = { active: true, currentWindow: true };
      let [tab] = await chrome.tabs.query(queryOptions);
      return tab;
    }
    // const currentTab = 
    getCurentTab().then((currentTab) => {
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
          const setObj = {};
          setObj[strSlotNum] = stringSelected;
          chrome.storage.local.set(setObj, function() {
            chrome.storage.local.get(strSlotNum, (response) => {
              // console.log(response);
              console.log(`Selection saved in slot ${slotNum}: ` + response[strSlotNum]);
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
    const strSlotNum = String(slotNum); // object = {'strSlotNum' : 'the stuff'}, object['1']
    chrome.storage.local.get(strSlotNum, (response) => { // response = {slotNumber: 'string data'}
      // do something with the response object
      const strResponse = response[strSlotNum];
      // console.log(`Accessing value saved in slot ${slotNum}: ` + strResponse); 
      // paste into the current tab where the user is selected, the strResponse
      // `document.querySelector(":focus").textContent += ${strResponse};`
      async function getCurentTab() {
        let queryOptions = { active: true, currentWindow: true };
        let [tab] = await chrome.tabs.query(queryOptions);
        return tab;
      }

      getCurentTab().then((currentTab) => {

        function pasteText(pasteText) {
          const focusedEl = document.activeElement;
          // console.log(focusedEl);
          focusedEl.value += pasteText;
        }
    
        chrome.scripting.executeScript( 
          {
            args: [strResponse],
            target: {tabId: currentTab.id}, 
            func: pasteText
          }, 
          (returned) => {
            /**
              window.addEventListener('focus', function(e) {
                  if (e.target.id) console.log(e.target.id)
              }, true);
             */
            // console log that we successfully pasted what we did
            console.log(`Pasted text from ${slotNum}: ` + strResponse);
          }
        );
      });
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