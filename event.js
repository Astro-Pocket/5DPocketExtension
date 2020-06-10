//創右鍵菜單
chrome.contextMenus.create({
  "title": "Save To 5DPocket",
  "onclick": save,
  "contexts": [
    "page",
    "selection",
    "image"
  ],
  "enabled": true
});

function save() {
  sendMessageToContentScript({ key: 'test', payload: 'Hi, this is a message from popup.js'}, response => {
    console.log('this is a message from content script', response)
})
}

function sendMessageToContentScript(message, callback) {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
          if (callback) {
              callback(response)
          }
      })
  })
}