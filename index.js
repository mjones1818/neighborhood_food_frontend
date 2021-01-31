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
let navbar = document.getElementById('nav_header')
let searchBar = document.getElementById('restaurants')
let historyResults = document.getElementById('history-info')
let cuisinesArray = []
let cuisineObj = {}
let neighborhoodArray = []
let neighborhoodObj = {}
let userObj = {}
let neighborhoodCuisineObj = {}


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
navbar.addEventListener('click', handleNavBar)
historyResults.addEventListener('click', handleHistoryClick)

function handleLoginSubmit(e) {
  !!loginName.value ? loginName.value : loginName.value = userObj.name
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
    userObj = {}
    userObj = user
    loginName.value = ''
    document.body.classList.remove("showLoginForm");
    parseUserObj()
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
    populateNeighborhoodList(neighborhoods)
  })
  
 
}

function populateNeighborhoodList(neighborhoods) {
  neighborhoodsDropdown.innerHTML = ''
  neighborhoods.forEach(function(neighborhood){
    neighborhoodArray.push(neighborhood.name)
    // neighborhoodObj[neighborhood.name] = {entity_id: neighborhood.entity_id, db_id: neighborhood.id}
    neighborhoodObj[neighborhood.name] = {neighborhood }
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
  cuisinesDropdown.innerHTML = ''
  cuisines.forEach(function(cuisine){
    cuisinesArray.push(cuisine.name)
    cuisineObj[cuisine.name] = cuisine.cuisine_id
    cuisinesDropdown.innerHTML += `
    <option value=${cuisine.cuisine_id}>${cuisine.name} </option>
    `
  })
}

function fetchRestaurants(e, search={}) {
  if (!search.cuisine_id) {
    let neighborhoodSelection = neighborhoodsDropdown.options[neighborhoodsDropdown.selectedIndex]
    let cuisineSelection = cuisinesDropdown.options[cuisinesDropdown.selectedIndex]
    
    search['entity_id'] = neighborhoodSelection.value
    search['cuisine_id'] = cuisineSelection.value
  }
  let url = 'http://localhost:3000/restaurants?'
  for (const [key, value] of Object.entries(search))  {
    url += `${key}=${value}&`
  }
  fetch(url)
  .then(function(resp){
    return resp.json()
  })
  .then(function(restaurants){
    populateRestaurantList(restaurants)
  })
}

function populateRestaurantList(restaurants)  {
  restaurantResults.innerHTML = ''
  restaurants.forEach(function(restaurant){
    let classToAdd = ''
    if (userObj.user_restaurants.find(element => element.restaurant_id === restaurant.restaurant.db_id)) {
      classToAdd = 'visited'
    }
    restaurantResults.innerHTML += `
      <div data-id=${restaurant.restaurant.db_id} class='${classToAdd}'>
        <h3>${restaurant.restaurant.name}</h3>
        <p>Average cost for two people: $${restaurant.restaurant.average_cost_for_two}</p>
        Rating: ${restaurant.restaurant.user_rating.aggregate_rating}
      </div>
    `
    classToAdd = ''
  })
}


function handleRestaurantSelection(e) {
  let dbId = e.target.dataset.id
  if (!dbId) {
    dbId = e.target.parentElement.dataset.id
  }
  fetch(`http://localhost:3000/restaurants/${dbId}`)
  .then(function(resp){
    return resp.json()
  })
  .then(function(restaurant){
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
      <button id='like' data-id=${restaurant.id}>Like this Restaurant</button>
      <button id='go-back'>Go back</button>
  `
  if (userObj.user_restaurants.find(element => element.restaurant_id === restaurant.id)) {
    like()
  }
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
    fetchRestaurants()
  } else if (e.target.id === 'like') {
  
    let id = e.target.dataset.id
    likeRestaurant(id,userObj)
  }
}

function likeRestaurant(id,userObj) {
  fetch(`http://localhost:3000/users/${userObj.id}`,{
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(
      {
        restaurant_id: id
      }
    )
  })
  .then(function(resp){
    like()
    handleLoginSubmit()
    fetchRestaurants()
    //  parseUserObj()
  })
}

function like() {
  let like = document.getElementById('like')
  if (like.classList.contains('liked')) {
    like.classList.remove('liked')
    like.innerText = 'like this restaurant'
  } else {
    like.classList.add('liked')
    like.innerText = 'dislike this restaurant'
  }
}


function handleNavBar (e) {
  e.preventDefault()
  switch (e.target.parentElement.id) {
    case 'logout':
      logout()
      break;
    case 'home':
      home()
      break;
    case 'history' :  
      showHistory()
      break;
  }
}

function logout() {
  userObj = {}
  restaurantResults.innerHTML = ''
  historyResults.innerHTML = ''
  home()
  openLoginForm()
}

function home() {
  restaurantResults.innerHTML = ''
  // fetchNeighborhoodList()
  // fetchCuisineList()
  searchBar.style.visibility = 'visible'
  historyResults.innerHTML = ''
}

function showHistory() {
  //remove search buttons
  searchBar.style.visibility = 'hidden'
  restaurantResults.innerHTML = ''
  // iterate through neighborhoods
  let i = 1
  for (const [neighborhood, information] of Object.entries(neighborhoodObj)) {
    historyResults.innerHTML += `
    <div class='neighborhood'>
      <h3 data-entity-id='${information.neighborhood.entity_id}' data-db-id='${information.neighborhood.id}'>${neighborhood}</h3>
    </div>
    <div class='grid'>

    </div>
    `
    for (const[cuisine, id]of Object.entries(cuisineObj)) {
      let gridElements = document.getElementsByClassName('grid')
      let classToAdd = ''
      let neighborhoodId = gridElements[i].previousElementSibling.children[0].dataset.entityId
      let neighborhoodDbId = gridElements[i].previousElementSibling.children[0].dataset.dbId
      if (userObj.neighborhoodCuisines[neighborhoodDbId] && userObj.neighborhoodCuisines[neighborhoodDbId].includes(id)) {
        classToAdd = 'visited'
      }
      gridElements[i].innerHTML += `
        <div class='${classToAdd}' data-cuisine-id='${id}' data-entity-id='${neighborhoodId}'>
          <h4>${cuisine}</h4>
        </div>
      `
      classToAdd = ''
    }
    i += 1
  }
}

function parseUserObj() {
  delete userObj.neighborhoodCuisines
  neighborhoodCuisineObj = {}
  userObj.user_restaurants.forEach(function(user_restaurant){
    if (!neighborhoodCuisineObj[user_restaurant.restaurant.neighborhood_id]) {
      neighborhoodCuisineObj[user_restaurant.restaurant.neighborhood_id] = [user_restaurant.restaurant.cuisine_id]
    } else {
      neighborhoodCuisineObj[user_restaurant.restaurant.neighborhood_id].push(user_restaurant.restaurant.cuisine_id)
    } 
  })
  userObj['neighborhoodCuisines'] = neighborhoodCuisineObj
}


function handleHistoryClick(e) {
  let searchCriteria = e.target.dataset
  if (!searchCriteria['cuisineId']) {
    searchCriteria = e.target.parentElement.dataset

  }
  if (searchCriteria) {
    let fetchRestaurantsSeach = {}
    fetchRestaurantsSeach['cuisine_id'] = searchCriteria['cuisineId']
    fetchRestaurantsSeach['entity_id'] = searchCriteria['entityId']
    home()
    for (let i = 0; i < neighborhoodsDropdown.children.length; i++) {
      if (neighborhoodsDropdown.children[i].value === fetchRestaurantsSeach['entity_id']) {
        neighborhoodsDropdown.children[i].selected = true
      }
      if (cuisinesDropdown.children[i].value === fetchRestaurantsSeach['cuisine_id']) {
        cuisinesDropdown.children[i].selected = true
      }
    }
    fetchRestaurants('',fetchRestaurantsSeach)
  }
}