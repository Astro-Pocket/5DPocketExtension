console.log('ready')
const account = document.querySelector('#account')
const password = document.querySelector('#password')
const form = document.querySelector('form')
form.addEventListener('submit',function(e){
  console.log(password.value)
  console.log(account.value)
  return { email: account.value, password: password.value}
})
