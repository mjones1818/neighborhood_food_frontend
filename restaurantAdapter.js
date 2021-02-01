class RestaurantAdapter {
  constructor(url) {
    this.baseURL = url
  }

  fetchRestaurants(e, search={}) {
    if (!search.cuisine_id) {
      let neighborhoodSelection = neighborhoodsDropdown.options[neighborhoodsDropdown.selectedIndex]
      let cuisineSelection = cuisinesDropdown.options[cuisinesDropdown.selectedIndex]
      
      search['entity_id'] = neighborhoodSelection.value
      search['cuisine_id'] = cuisineSelection.value
    }
    let url = `${this.baseURL}/restaurants?`
    for (const [key, value] of Object.entries(search))  {
      url += `${key}=${value}&`
    }
    return fetch(url)
    .then(function(resp){
      return resp.json()
    })
  }

  handleRestaurantSelection(dbId) {
    return fetch(`${this.baseURL}restaurants/${dbId}`)
    .then(function(resp){
      return resp.json()
    })
  }
}