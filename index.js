let loginDiv = document.getElementById('login')
let citySelectDiv = document.getElementById('select_city')
let selections = document.getElementById('selections')

loginDiv.addEventListener('submit', handleLoginSubmit)
citySelectDiv.addEventListener('submit', handleCitySubmit)

loginDiv.innerHTML += `
  <h3>Welcome!</h3>
  <form action="/home">
    <input type="text" name="" id="login_name" placeholder='enter name'>
    <button type="submit">Enter</button>
  </form>
`


function handleLoginSubmit(e) {
  e.preventDefault()
  let loginName = e.target.children[0].value
  fetch('http://localhost:3000/users',{
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(
      {
        name: loginName
      }
    )
  })
  .then(function(resp){
    return resp.json()
  })
  .then(function(user){
    console.log(user)
    renderMainPage(user)
  })
}

function renderMainPage(user) {
  loginDiv.remove()
  citySelectDiv.innerHTML += `
  <form action="/home">
    <input type="text" name="" id="login_name" placeholder='enter city'>
    <button type="submit">Enter</button>
  </form>
`
}

function handleCitySubmit (e) {
  citySelectDiv.innerHTML = ''
  selections.innerHTML += `
    
  `
}