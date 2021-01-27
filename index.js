let loginDiv = document.getElementById('login')
let selections = document.getElementById('selections')
let loginButton = document.querySelector('#login-button')
let neighborhoodList = document.getElementById('neighborhood-list')
let cuisineList = document.getElementById('cuisine-list')
let cuisinesDropdown = document.getElementById('cuisines')
let loginName = document.getElementById('name')
let neighborhoodsDropdown = document.getElementById('neighborhoods')
let restaurantSearch = document.getElementById('restaurant-search')
let restaurantResults = document.getElementById('restaurant-results')
let cuisinesArray = [] 
// let wordlist = cuisinesArray


openLoginForm()
fetchNeighborhoodList()
fetchCuisineList()

restaurantSearch.addEventListener('click', fetchRestaurants)
loginButton.addEventListener('click', handleLogin)
loginName.addEventListener('keyup', function(event){
  if (event.key == 'Enter') {
    handleLogin()
  }
})

// function handleLoginSubmit(e) {
//   e.preventDefault()
//   let loginName = e.target.children[0].value
//   fetch('http://localhost:3000/users',{
//     method: 'POST',
//     headers: {
//       "Content-Type": "application/json",
//       "Accept": "application/json"
//     },
//     body: JSONify(
//       {
//         name: loginName
//       }
//     )
//   })
//   .then(function(resp){
//     return resp.json()
//   })
//   .then(function(user){
//     console.log(user)
//     renderMainPage(user)
//   })
// }

// function renderMainPage(user) {
//   loginDiv.remove()
//   selections.innerHTML += `
//   <form action="/home">
//     <input type="text" name="" id="city_name" placeholder='enter city'>
//     <button type="submit">Enter</button>
//   </form>
// `
// }


function openLoginForm(){
  document.body.classList.add("showLoginForm");
}


function handleLogin(e) {
  
  let name = loginName.value
  document.body.classList.remove("showLoginForm");
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
    neighborhoodsDropdown.innerHTML += `
      <option value=${neighborhood.entity_id}>${neighborhood.name} </option>
    `
  })
}

function fetchCuisineList (){
  fetch('http://localhost:3000/cuisines')
  .then(function(resp){
    return resp.json()
  })
  .then(function(cuisines){
    populateCuisineList(cuisines)
  })
}

function populateCuisineList(cuisines) {
  cuisines.forEach(function(cuisine){
    cuisinesArray.push(cuisine.name)
    cuisinesDropdown.innerHTML += `
    <option value=${cuisine.cuisine_id}>${cuisine.name} </option>
    `
  })
}

function fetchRestaurants(e) {
  e.preventDefault()
  let search = {}
  let neighborhoodSelection = neighborhoodsDropdown.options[neighborhoodsDropdown.selectedIndex]
  let cuisineSelection = cuisinesDropdown.options[cuisinesDropdown.selectedIndex]
  
  search['entity_id'] = neighborhoodSelection.value
  search['cuisine_id'] = cuisineSelection.value
  
  let url = 'http://localhost:3000/restaurants?'
  for (const [key, value] of Object.entries(search))  {
    url += `${key}=${value}&`
  }
  fetch(url)
  .then(function(resp){
    return resp.json()
  })
  .then(function(restaurants){
    console.log(restaurants)
    populateRestaurantList(restaurants)
  })
}

function populateRestaurantList(restaurants)  {
  restaurants.forEach(function(restaurant){
    // debugger
    restaurantResults.innerHTML += `
      <h3>${restaurant.restaurant.name}</h3?
    `
  })
}