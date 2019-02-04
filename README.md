# Launch your own restaurant review site
### JavaScript, jQuery, Google maps API, Google Places API, HTML5, CSS3, Sass


* A Google Maps map loaded with the Google Maps API
* The Google Maps map will focus immediately on the position of the user.
* A list of restaurants on the right side of the page that are within the area displayed on the map
* When you click on a marker, the restaurant on the right will stand out
* A filter tool allows the display of restaurants that have between X and Y stars
* Add a restaurant by clicking on a specific place on the map
* Use the Google search API to find restaurants in a particular display area.

### See the applicatiion here
https://debs-obrien.github.io/restaurant-reviews-OpenClassRooms-project-7

#### By Timo Wernars
January 2019

### Example Code
```javascript
/**
* Get restaurants in current view of the map
*/
$.get(req, function(data){
    $('#loading-restaurants').css('display', 'none');
    for (var i = 0; i < data.results.length; i++) {
      const id = data.results[i].place_id;
      const name = data.results[i].name;
      const rating = data.results[i].rating /5 * 100; //Convert rating to percentage
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
```
