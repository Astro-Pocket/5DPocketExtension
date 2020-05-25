const form = document.querySelector('form')
const account = document.querySelector('#account')
const password = document.querySelector('#password')

//初始化 localStorage 如果登入就不要初始化，有登出就初始化
function initialize(){
  if (localStorage.getItem('key') === "undefined" || 
    localStorage.getItem('key') === null ) 
  {
    ToggleLoginUI(false);
  } else {
    ToggleLoginUI(true);
  }
}
initialize()

//抓帳號密碼的值
function getLoginFormValue(){
  return {email: account.value, password: password.value}
}
//修改fetch預設方法
function postData(url, data){
  return fetch (url, {
    body: JSON.stringify(data),
    cache: 'no-cache',
    method: 'POST',
    redirect: 'follow',
    referrer: 'no-referrer',
    mode: 'cors',
    headers: {
      'user-agent': 'Mozilla/4.0 MDN Example',
      'content-type': 'application/json'
    }
  })
  .then(res => res.json()) //輸出成json
}
//進行登入
form.addEventListener('submit', function LoginJson(e){
  e.preventDefault();
  postData('http://127.0.0.1:3000/api/v1/login', getLoginFormValue())
  .then(
    function(data){
      localStorage.setItem('key', data['auth_token']);
      if (data['message'] === "ok"){
        ToggleLoginUI(true);
      }
      // alert('觀迎登入5DPocket');
    }
  )
  .catch( error => {
    // alert('帳號密碼錯誤!');
  })
})

//ToggleLoginUI，只要登入成功移除登入畫面、新增畫面，登出成功增加登入畫面、移除畫面
function ToggleLoginUI(isLogin) {
  let admin = document.getElementById('admin');
  let frame = document.getElementById('frame');
  if (isLogin) {
    admin.classList.add("displaynone");
    frame.classList.remove("displaynone");
  }
  else {
    localStorage.clear();
    admin.classList.remove("displaynone");
    frame.classList.add("displaynone");
  }
}
//登出功能
let logout = document.getElementById('logout');
logout.addEventListener('click', e => {
  logoutjson(e);
})
//LogoutTokenData
function getLogoutFormValues(){
  var logouttoken = localStorage.getItem('key');
  return { auth_token: logouttoken }
}
//LogoutTokenDataApi
function logoutjson(e){
  e.preventDefault();
  postData('http://127.0.0.1:3000/api/v1/logout',getLogoutFormValues())
    .then(
      function(data){
        console.log(data);
        ToggleLoginUI(false);
      }
    ) // JSON from `resp.json()` call
    .catch(
      error => {
        console.log(error)
      }
    )
}
// 進行抓網址的動作
document.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, tabs => {
    const url = tabs[0].url
    const key = localStorage.getItem('key')
    
    // 取得url&key的值
    function geturl() {
      return {url: url, key: key}
    }
    console.log(geturl())
    postData('http:127.0.0.1:3000/api/v1/save', geturl())
    .then(
      function(data) {
        console.log(data['message']);
      }
    )
  })
})