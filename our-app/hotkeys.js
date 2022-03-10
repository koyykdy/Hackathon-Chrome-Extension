
chrome.commands.onCommand.addListener((command) => {
  console.log(`Command: ${command}`); // -> 'multi-copy1' OR 'multi-paste1'
});