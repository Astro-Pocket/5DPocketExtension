//資料儲存中心
window.PocketData = {
  url: null,
  key: null,
  isLogin: false,
  urls: {
    save: 'save_article_tags',
    save_article:'save_article',
    save_tags:'save_tags',
    updateTags: '',
    login: 'login',
    logout: 'logout'
  },
  host: 'http://127.0.0.1:3000/api/v1/',
  tags: null,
  email: null,
  password: null,
}

//html內容
window.content = {
  flash: document.querySelector(".flash"),
  save: document.querySelector("#save"),
  spinner: document.querySelector(".spinner-border"),
  saving: document.querySelector(".saving"),
  admin: document.querySelector("#admin"),
  frame: document.querySelector("#frame"),
  account: document.querySelector("#account"),
  password: document.querySelector("#password"),
  logout: document.querySelector(".logout"),
  form: document.querySelector("form")
}

//沒登入的時候顯示帳號密碼的地方，登入狀態就顯示儲存tag的畫面
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
initialize();

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
  }).then( res => res.json()); //輸出成json
}

//進行登入
window.content.form.addEventListener("submit", function LoginJson(e) {
  e.preventDefault();
  window.PocketData.email = window.content.account.value;
  window.PocketData.password = window.content.password.value;
  postData(`${window.PocketData.host}${window.PocketData.urls.login}`, window.PocketData )
    .then( data => {
      localStorage.setItem("key", data["auth_token"]);
      if (data["message"] === "ok") {
        ToggleLoginUI(true);
      }
      // alert('觀迎登入5DPocket');
    })
    .catch( error => {
      // alert('帳號密碼錯誤!');
    });
});

//ToggleLoginUI，只要登入成功移除登入畫面、新增畫面，登出成功增加登入畫面、移除畫面
function ToggleLoginUI(isLogin) {
  if (isLogin) {
    window.content.admin.classList.add("displaynone");
    window.content.frame.classList.remove("displaynone");
    $(".js-tag-select").select2({
      multiple: true,
      tags: true,
      placeholder: "Add Tags",
    });
    SaveArticle();
  } else {
    localStorage.clear();
    window.content.admin.classList.remove("displaynone");
    window.content.frame.classList.add("displaynone");
    window.content.account.focus();
  }
}

//登出功能
window.content.logout.addEventListener("click", e => {
  logoutjson(e);
})

//LogoutTokenData
function getLogoutFormValues() {
  var logouttoken = localStorage.getItem("key");
  return { auth_token: logouttoken };
}

//LogoutTokenDataApi
function logoutjson(e) {
  e.preventDefault();
  postData(`${window.PocketData.host}${window.PocketData.urls.logout}`, getLogoutFormValues())
    .then( data => {
      console.log(data);
      ToggleLoginUI(false);
    }) // JSON from `resp.json()` call
    .catch( error => {
      console.log(error);
    });
}

// 進行儲存文章
function SaveArticle() {
  window.content.spinner.classList.remove("displaynone");
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    window.PocketData.url = tabs[0].url;
    window.PocketData.key = localStorage.getItem("key");
    postData(`${window.PocketData.host}${window.PocketData.urls.save_article}`, window.PocketData)
      .then( data => {
        window.content.flash.innerHTML = data["message"];
        window.content.spinner.classList.add("displaynone");
        window.content.saving.classList.add("displaynone");
        document.querySelector(".save").classList.remove("displaynone");
        setTimeout( () => {
          window.content.flash.classList.add("displaynone");
        }, 3000);
      })
      .catch( error => {
        console.log(error);
      });
  });
}

// 進行tags的動作
chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
  window.PocketData.url = tabs[0].url;
  window.PocketData.key = localStorage.getItem("key");
  window.content.save.addEventListener("click", () => {
    window.PocketData.tags = $("#settags").val();
    postData(`${window.PocketData.host}${window.PocketData.urls.save_tags}`, window.PocketData)
    .then( data => {
      window.content.flash.classList.remove("displaynone");
      window.content.flash.innerHTML = data["message"];
      setTimeout( () => {
        window.content.flash.classList.add("displaynone");
      }, 3000);
    });
  });
});