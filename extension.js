//資料庫管理中心
window.PocketData = {
  url: null,
  key: null,
  isLogin: false,
  urls: {
    save: 'save_article_tags',
    updateTags: '',
    login: 'login',
    logout: 'logout'
  },
  host: 'http://127.0.0.1:3000/api/v1/',
  tags: null,
}

// 開網頁focus到帳號輸入框上
document.querySelector("#account").focus();

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
initialize();

//抓帳號密碼的值
function getLoginFormValue() {
  const account = document.querySelector("#account");
  const password = document.querySelector("#password");
  return { email: account.value, password: password.value };
}
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
//進行登入
document.querySelector("form").addEventListener("submit", function LoginJson(e) {
  e.preventDefault();
  postData(`${window.PocketData.host}${window.PocketData.urls.login}`, getLoginFormValue())
    .then(function (data) {
      localStorage.setItem("key", data["auth_token"]);
      if (data["message"] === "ok") {
        ToggleLoginUI(true);
      }
      // alert('觀迎登入5DPocket');
    })
    .catch((error) => {
      // alert('帳號密碼錯誤!');
    });
});

//ToggleLoginUI，只要登入成功移除登入畫面、新增畫面，登出成功增加登入畫面、移除畫面
function ToggleLoginUI(isLogin) {
  let admin = document.getElementById("admin");
  let frame = document.getElementById("frame");
  if (isLogin) {
    admin.classList.add("displaynone");
    frame.classList.remove("displaynone");
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
  }
}
//登出功能
let logout = document.getElementById("logout");
logout.addEventListener("click", (e) => {
  logoutjson(e);
});
//LogoutTokenData
function getLogoutFormValues() {
  var logouttoken = localStorage.getItem("key");
  return { auth_token: logouttoken };
}
//LogoutTokenDataApi
function logoutjson(e) {
  e.preventDefault();
  postData(`${window.PocketData.host}${window.PocketData.urls.logout}`, getLogoutFormValues())
    .then(function (data) {
      console.log(data);
      ToggleLoginUI(false);
    }) // JSON from `resp.json()` call
    .catch((error) => {
      console.log(error);
    });
}
// 進行儲存文章
document.addEventListener("DOMContentLoaded", () => {
  const spinner = document.querySelector(".spinner-border");
  spinner.classList.remove("displaynone");
  const saving = document.querySelector(".saving");
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    const url = tabs[0].url;
    const key = localStorage.getItem("key");
    // 取得url&key的值
    function geturl() {
      return { url: url, key: key };
    }
    postData(`${window.PocketData.host}${window.PocketData.urls.saveArticle}`, geturl())
      .then((data) => {
        document.querySelector(".flash").innerHTML = data["message"];
        spinner.classList.add("displaynone");
        saving.classList.add("displaynone");
        document.querySelector(".save").classList.remove("displaynone");
        setTimeout(function () {
          document.querySelector(".flash").classList.add("displaynone");
        }, 3000);
      })
      .catch((error) => {
        console.log(error);
      });
  });
});
// 進行tags的動作
chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
  const url = tabs[0].url;
  const key = localStorage.getItem("key");
  document.querySelector("#save").addEventListener("click", () => {
    //取得url&key&tag
    function getdata() {
      return { url: url, key: key, tags: tags };
    }
    const tags = $("#settags").val();
    postData(`${window.PocketData.host}${window.PocketData.urls.savetags}`, getdata()).then((data) => {
      document.querySelector(".flash").classList.remove("displaynone");
      document.querySelector(".flash").innerHTML = data["message"];
    });
  });
});

// // 進行儲存文章即tags的動作
// chrome.tabs.query({ active: true,lastFocusedWindow: true}, tabs => {
//   window.PocketData.url = tabs[0].url
//   window.PocketData.key = localStorage.getItem('key')
//   document.querySelector('#save').addEventListener("click", () => {
//     window.PocketData.tags = $("#settags").val();
//     postData(`${window.PocketData.host}${window.PocketData.urls.save_article_tags}`, window.PocketData)
//       .then(data => {
        
//       })
//   })
// })