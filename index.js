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
let restaurantInfo = document.getElementById('restaurant-info')
let restaurantInfoPopup = document.getElementById('restaurant-info-popup')
let cuisinesArray = [] 
let userObj = {}
// let wordlist = cuisinesArray


openLoginForm()
fetchNeighborhoodList()
fetchCuisineList()

restaurantSearch.addEventListener('click', fetchRestaurants)
loginButton.addEventListener('click', handleLoginSubmit)
loginName.addEventListener('keyup', function(event){
  if (event.key == 'Enter') {
    handleLoginSubmit()
  }
})
restaurantResults.addEventListener('click', handleRestaurantSelection)
restaurantInfoPopup.addEventListener('click', handleRestaurantButtons)

function handleLoginSubmit(e) {
  fetch('http://localhost:3000/users',{
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(
      {
        name: loginName.value
      }
    )
  })
  .then(function(resp){
    return resp.json()
  })
  .then(function(user){
    userObj = user
    document.body.classList.remove("showLoginForm");
  })
}

function openLoginForm(){
  document.body.classList.add("showLoginForm");
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
  restaurantResults.innerHTML = ''
  restaurants.forEach(function(restaurant){
    restaurantResults.innerHTML += `
      <div data-id=${restaurant.restaurant.db_id}>
        <h3>${restaurant.restaurant.name}</h3>
        <p>Average cost for two people: $${restaurant.restaurant.average_cost_for_two}</p>
        Rating: ${restaurant.restaurant.user_rating.aggregate_rating}
      </div>
    `
  })
}


function handleRestaurantSelection(e) {
  
  let dbId = e.target.dataset.id
  fetch(`http://localhost:3000/restaurants/${dbId}`)
  .then(function(resp){
    return resp.json()
  })
  .then(function(restaurant){
    console.log(restaurant)
    populateRestaurantInfo(restaurant)
  })
  

}

function populateRestaurantInfo(restaurant){
  restaurantInfoPopup.innerHTML += `

      <h3>${restaurant.name}</h3>
      <h5>${restaurant.locality}</h5>
      <p>${restaurant.address}</p>
      Average cost for two: $${restaurant.average_cost_for_two} <br>
      <img src="${restaurant.thumb}"> <br>
      <button id='go-back'>Go back</button>
      <button id='like'>Like this Restaurant</button>

  `
  restaurantInfo.classList.add('restaurant-popup', 'popup')
  restaurantInfo.style.width = '50%'
  restaurantInfo.style.height = '60%'
  document.getElementsByClassName('popup-overlay')[0].style.display = 'block'
}


function handleRestaurantButtons(e) {
  if (e.target.id === 'go-back') {
    restaurantInfo.classList.remove('restaurant-popup', 'popup')
    document.getElementsByClassName('popup-overlay')[0].style.display = 'none'
    restaurantInfoPopup.innerHTML = ''
  }
}