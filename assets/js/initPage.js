const center = {lat:52.156113 , lng: 5.387827};
var restaurants = [];
var markers = []; //All the markers currently on the page
var map;

//Init Google map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: center,
    zoom: 15,
    disableDoubleClickZoom: true
  });

  /**
  * Event listeners on the google map
  *   - drag
  *   - zoom
  *   - onload
  *   - double click (add restaurant)
  */
  map.addListener('dragend', function(){
    getRestaurants();
  });
  map.addListener('zoom_changed', function(){
    getRestaurants();
  });
  google.maps.event.addListenerOnce(map, 'idle', function(){
    getRestaurants();
  });

  map.addListener('dblclick', function(e){
    newRestaurant(e.latLng);
  })
}

/**
* Calculates the radius of the current map view
* Returns: map radius in meters
*/
function getMapRadius(){
  var bounds = map.getBounds();
  var center = map.getCenter();
  if (bounds && center) {
    var ne = bounds.getNorthEast();
    // Calculate radius (in meters).
    return google.maps.geometry.spherical.computeDistanceBetween(center, ne);
  }
}

/**
* 1. Loop over curent restaurants
*   If they have marker or view, then delete
*/
function clearRestaurants(){

  for (var i = 0; i < restaurants.length; i++) {
    if(restaurants[i].hasView){restaurants[i].deleteFromPage();};
    if(restaurants[i].hasMarker){restaurants[i].deleteMarker();};
  }

  restaurants = [];
  markers = [];
}

/**
* Call google places API to get nearby restaurants
*/
function getRestaurants(){
  $('#loading-restaurants').css('display', 'block');
  clearRestaurants();
  const zoom = map.getZoom();
  const lat = map.getCenter().lat();
  const lng = map.getCenter().lng();
  const radius = getMapRadius() * 0.90;

  const minRating = $('.min-rating').html();
  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  const req = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=restaurant&key=AIzaSyCm9kjnGPeQQepnDwcyhiiuGNUS_Xn_hfo`;

  $.get(proxyurl + req, function(data){
    $('#loading-restaurants').css('display', 'none');
    for (var i = 0; i < data.results.length; i++) {
      const id = data.results[i].place_id;
      const name = data.results[i].name;
      const rating = data.results[i].rating /5 * 100; //Convert rating to %
      const coords = data.results[i].geometry.location;
      var photoReference;

      // Catch error if restaurant does not have any pictures
      try {
        photoReference = data.results[i].photos[0].photo_reference;
      } catch (e) {
        photoReference = null;
      }
      const r1 = new Restaurant(id, name, rating, coords, photoReference);
      if(r1.rating > $('.min-rating').html() / 5 * 100){
        r1.writeToPage();
        r1.placeMarker();
      }
      restaurants.push(r1);    }
  });
}
