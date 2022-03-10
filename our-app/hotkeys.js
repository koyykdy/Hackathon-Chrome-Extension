// const copyPasteHandler = require('./copy-paste');
// import copyPasteHandler from 'copy-paste.js';

const copyPasteHandler = {
  handleCopy: (slotNum) => {
    // save to slot num in permanent storage
    async function getCurentTab() {
      let queryOptions = { active: true, currentWindow: true };
      let [tab] = await chrome.tabs.query(queryOptions);
      return tab;
    }
    getCurentTab().then((currentTab) => {
      function getSelection() {
        return window.getSelection().toString();
      }
  
      chrome.scripting.executeScript( 
        {
          target: {tabId: currentTab.id},
          func: getSelection 
        }, 
        (selection) => {
          const stringSelected = selection[0].result;
          const strSlotNum = String(slotNum);
          const setObj = {};
          setObj[strSlotNum] = stringSelected;
          chrome.storage.local.set(setObj, function() {
            chrome.storage.local.get(strSlotNum, (response) => {
              console.log(`Selection saved in slot ${slotNum}: ` + response[strSlotNum]);
            })
          });
        }
      );
    });
  },
  handlePaste: (slotNum) => {
    // paste from slot num in permanent storage
    const strSlotNum = String(slotNum);
    chrome.storage.local.get(strSlotNum, (response) => { // response = {slotNumber: 'string data'}
      const strResponse = response[strSlotNum];
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
          focusedEl.value += pasteText;
        }
    
        chrome.scripting.executeScript( 
          {
            args: [strResponse],
            target: {tabId: currentTab.id}, 
            func: pasteText
          }, 
          (returned) => {
            // console log that we successfully pasted what we did
            console.log(`Pasted text from ${slotNum}: ` + strResponse);
          }
        );
      });
    });
  }
};

chrome.commands.onCommand.addListener((command) => {
  switch (command) {
    case 'multi-copy1':
      copyPasteHandler.handleCopy(1);
      break;
    case 'multi-paste1':
      copyPasteHandler.handlePaste(1);
      break;
    case 'multi-copy2':
      copyPasteHandler.handleCopy(2);
      break;
    case 'multi-paste2':
      copyPasteHandler.handlePaste(2);
      break;
    // case 'multi-copy3':
    //   copyPasteHandler.handleCopy(3);
    //   break;
    // case 'multi-paste3':
    //   copyPasteHandler.handlePaste(3);
    //   break;
    // case 'multi-copy4':
    //   copyPasteHandler.handleCopy(4);
    //   break;
    // case 'multi-paste4':
    //   copyPasteHandler.handlePaste(4);
    //   break;
    default:
      console.log('ERROR: Unexpected command encountered!\n');
  }
  console.log(`Command: ${command}`); // -> 'multi-copy1' OR 'multi-paste1' OR ...
});


/**
 * 
  if (command === 'multi-copy1') { // handle multi-copy1
    copyPasteHandler.handleCopy(1);
  }
  if (command === 'multi-paste1') { // handle multi-paste1
    copyPasteHandler.handlePaste(1);
  }
  if (command === 'multi-copy2') { // handle multi-copy2
    copyPasteHandler.handleCopy(2);
  }
  if (command === 'multi-paste2') { // handle multi-paste2
    copyPasteHandler.handlePaste(2);
  }
  if (command === 'multi-copy3') { // handle multi-copy3
    copyPasteHandler.handleCopy(3);
  }
  if (command === 'multi-paste3') { // handle multi-paste3
    copyPasteHandler.handlePaste(3);
  }
  if (command === 'multi-copy4') { // handle multi-copy4
    copyPasteHandler.handleCopy(4);
  }
  if (command === 'multi-paste4') { // handle multi-paste4
    copyPasteHandler.handlePaste(4);
  }
 */

/**
 * ,
    "multi-copy3": {
      "suggested_key": {
        "default": "Alt+Shift+3",
        "mac": "Alt+Shift+3"
      },
      "description": "Copy currently selected text to slot 3"
    },
    "multi-paste3": {
      "suggested_key": {
        "default": "Alt+3",
        "mac": "Alt+3"
      },
      "description": "Paste text from slot 3"
    },
    "multi-copy4": {
      "suggested_key": {
        "default": "Alt+Shift+4",
        "mac": "Alt+Shift+4"
      },
      "description": "Copy currently selected text to slot 4"
    },
    "multi-paste4": {
      "suggested_key": {
        "default": "Alt+4",
        "mac": "Alt+4"
      },
      "description": "Paste text from slot 4"
    }
 */