let loginDiv = document.getElementById('login')
let selections = document.getElementById('selections')
let loginButton = document.querySelector('#login-button')
let neighborhoodList = document.getElementById('neighborhood-list')
let cuisineList = document.getElementById('cuisine-list')

window.onload = (event) => {
  openLoginForm()
  fetchNeighborhoodList()
}

loginButton.addEventListener('click', handleLogin)

function handleLoginSubmit(e) {
  e.preventDefault()
  let loginName = e.target.children[0].value
  fetch('http://localhost:3000/users',{
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSONify(
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
  selections.innerHTML += `
  <form action="/home">
    <input type="text" name="" id="city_name" placeholder='enter city'>
    <button type="submit">Enter</button>
  </form>
`
}


function openLoginForm(){
  document.body.classList.add("showLoginForm");
}
function closeLoginForm(){
  document.body.classList.remove("showLoginForm");
}

function handleLogin(e) {
  closeLoginForm()
  let name = e.target.parentElement.previousElementSibling.children[1].value
}

function fetchNeighborhoodList (){
  
  fetch('http://localhost:3000/neighborhoods')
  .then(function(resp){
    return resp.json()
  })
  .then(function(neighborhoods){
    console.log(neighborhoods)
    populateNeighborhoodList(neighborhoods)
  })
  
 
}

function populateNeighborhoodList(neighborhoods) {
  neighborhoods.forEach(function(neighborhood){
    neighborhoodList.innerHTML += `
      <h4>${neighborhood.name}</h4>
    `
  })
}

function fetchCuisineList (){
  
  fetch('http://localhost:3000/cuisines')
  .then(function(resp){
    return resp.json()
  })
  .then(function(cuisines){
    console.log(cuisines)
    populateCuisineList(cuisines)
  })
  
 
}

function populateCuisineList(cuisines) {
  
  cuisines.forEach(function(cuisine){
    cuisineList.innerHTML += `
      <h4>${Cuisine.name}</h4>
    `
  })

}