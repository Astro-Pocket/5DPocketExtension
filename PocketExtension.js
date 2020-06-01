//修改fetch預設方法
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
  }).then((res) => res.json()); //輸出成json
}

//初始化 localStorage 如果登入就不要初始化，有登出就初始化
function initialize() {
  if (
    localStorage.getItem("key") === "undefined" ||
    localStorage.getItem("key") === null
  ) {
    ToggleLoginUI(false);
  } else {
    ToggleLoginUI(true);
  }
}

//抓帳號密碼的值
function getLoginFormValue() {
  const account = document.querySelector("#account");
  const password = document.querySelector("#password");
  return { email: account.value, password: password.value };
}

//LogoutTokenData
function getLogoutFormValues() {
  var logouttoken = localStorage.getItem("key");
  return { auth_token: logouttoken };
}

//LogoutTokenDataApi
function logoutjson(e) {
  e.preventDefault();
  postData("http://127.0.0.1:3000/api/v1/logout", getLogoutFormValues())
    .then(function (data) {
      console.log(data);
      ToggleLoginUI(false);
    }) // JSON from `resp.json()` call
    .catch((error) => {
      console.log(error);
    });
}

//ToggleLoginUI，只要登入成功移除登入畫面、新增畫面，登出成功增加登入畫面、移除畫面
function ToggleLoginUI(isLogin) {
  let admin = document.getElementById("admin");
  let frame = document.getElementById("frame");
  if (isLogin) {
    admin.classList.add("displaynone");
    frame.classList.remove("displaynone");

    // 登出功能
    let logout = document.getElementById("logout");
    logout.addEventListener("click", logoutjson);

    // 使用select2
    $(".js-tag-select").select2({
      multiple: true,
      tags: true,
      placeholder: "Add Tags",
    });
  } else {
    localStorage.clear();
    admin.classList.remove("displaynone");
    frame.classList.add("displaynone");
    // 開網頁focus到帳號輸入框上
    document.querySelector("#account").focus();
  }
}

//資料庫管理中心
window.PocketData = {
  url: null,
  key: null,
  isLogin: false,
  localhost: 'http://127.0.0.1:3000/api/v1/',
  urls: {
    haveArticle: 'haveArticle',
    updateTags:'updateTags',
    ArticleAndTags:'ArticleAndTags',
  },
}

document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    window.PocketData['url'] = tabs[0].url
    postData(`${window.PocketData.localhost}${window.PocketData.urls[haveArticle]}`,window.PocketData(key,url))
  })
})