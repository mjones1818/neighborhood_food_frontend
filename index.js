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
      <div data-id=>
        <h3>${restaurant.restaurant.name}</h3>
        <p>Average cost for two people: $${restaurant.restaurant.average_cost_for_two}</p>
        Rating: ${restaurant.restaurant.user_rating.aggregate_rating}
      </div>
    `
  })
}


function handleRestaurantSelection(e) {
  document.body.innerHTML += `
  <div class="center">
  </div>
  <div class="popup-overlay"></div>
  <div class="popup">
  <p>I'm baby organic pork belly tofu venmo, roof party seitan artisan portland. Sriracha typewriter microdosing truffaut. Food truck kale chips bitters, locavore stumptown fashion axe +1 snackwave. Hell of adaptogen bicycle rights man bun, craft beer +1 typewriter vinyl williamsburg four loko gentrify. You probably haven't heard of them tumblr tote bag photo booth tacos chicharrones quinoa microdosing wayfarers intelligentsia fashion axe poke pinterest tofu disrupt.

  Meggings letterpress listicle woke godard. You probably haven't heard of them affogato cloud bread, readymade brooklyn waistcoat viral. Try-hard pop-up live-edge, umami cray crucifix coloring book. Meh tattooed cornhole flannel keytar offal adaptogen lomo photo booth synth schlitz.</p>
  </div>
  `
  // openLoginForm()
}