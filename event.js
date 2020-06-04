//創右鍵菜單
chrome.contextMenus.create({
  "title": "Save To 5DPocket",
  "onclick": save,
  "contexts": [
    "page",
    "selection"
  ],
  "enabled": true
});
window.menuData = {
  url: null,
  key: null,
  host: 'http://127.0.0.1:3000/api/v1/',
  save: 'save_article'
}

function postData(url, data) {
  return fetch(url, {
    body: JSON.stringify(data),
    cache: "no-cache",
    method: "POST",
    redirect: "follow",
    referrer: "no-referrer",
    mode: "cors",
    headers: {
      "user-agent": "Mozilla/4.0 MDN Example",
      "content-type": "application/json",
    },
  }).then( res => res.json()); //輸出成json
}

function save(page){
  window.menuData.url = page.pageUrl
  window.menuData.key = localStorage.getItem('key')
  postData(`${window.menuData.host}${window.menuData.save}`,window.menuData)
    .then( data => {
      alert(data['message'])
    })
}