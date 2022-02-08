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
    let url = `${this.baseURL}restaurants?`
    for (const [key, value] of Object.entries(search))  {
      url += `${key}=${value}&`
    }
    return fetch(url,{
      method: 'GET',
      withCredentials: true,
      headers: {
        'Authorization': sessionStorage.getItem('token')
      }
    })
    .then(function(resp){
      return resp.json()
    })
  }

  handleRestaurantSelection(dbId) {
    return fetch(`${this.baseURL}restaurants/${dbId}`,{
      method: 'GET',
      withCredentials: true,
      headers: {
        'Authorization': sessionStorage.getItem('token')
      }
    })
    .then(function(resp){
      return resp.json()
    })
  }

  destroyAllRestaurants() {
    fetch(`${this.baseURL}restaurants`,{
    method: 'DELETE',
    withCredentials: true,
    headers: {
      'Authorization': sessionStorage.getItem('token')
    }
    })
  }
}