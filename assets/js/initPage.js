const center = {lat:48.856613 , lng: 2.352222};
var restaurants = [];
var markers = [];
var map;
var lastRestaurantID = 0;

//Init Google map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: center,
    zoom: 15,
    disableDoubleClickZoom: true,
    disableDefaultUI: true
  });

  infoWindow = new google.maps.InfoWindow;

  // Try HTML5 geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('Your location');
      infoWindow.open(map);
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

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
* Set (error)window on users location
*/
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ? 'Error: The Geolocation service failed.' : 'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
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
* Loop over curent restaurants
* If they have marker or view, then delete
*/
function clearRestaurants(){

  for (var i = 0; i < restaurants.length; i++) {
    if(restaurants[i].hasView){restaurants[i].deleteFromPage();};
    if(restaurants[i].hasMarker){restaurants[i].deleteMarker();};
  }

  restaurants = [];
  restaurants = [];
}

/**
* Call google places API to get nearby restaurants
* Create Restaurant object for each result
*/
function getRestaurants(){
  $('#loading-restaurants').css('display', 'block');
  clearRestaurants();

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
      restaurants.push(r1);
    }
  });
}

/**
*
*/
function newRestaurant(coords){
  $('.add-restaurant').fadeIn();
  $('#add-restaurant-submit').unbind('click').click(function(){
    const name = $('#add-restaurant-name').val();
    const address = $('#add-restaurant-address').val();
    const phonenumber = $('#add-restaurant-phonenumber').val();
    const website = $('#add-restaurant-website').val();

    if (!name || !address || !phonenumber || !website) {
      $('#add-restaurant-error').css('display', 'block');
    } else{
      const r1 = new Restaurant(lastRestaurantID, name, 0, coords);
      r1.address = address;
      r1.phonenumber = phonenumber;
      r1.website = website;
      r1.writeToPage();
      r1.placeMarker();
      restaurants.unshift(r1);
      $('.add-restaurant').fadeOut();
    }
  })
}
