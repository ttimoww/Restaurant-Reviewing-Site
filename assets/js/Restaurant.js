class Restaurant{
  constructor(id, nm, rt, cr, pr){
    this.id = id,
    this.name = nm,
    this.rating = rt,
    this.coords = cr,
    this.photoReference = pr,
    this.hasMarker = false,
    this.hasView = false
  }

  /**
  * Write the restaurant to the page
  */
  writeToPage(){
    const $restaurant = $('<div>').addClass('restaurant').attr('restaurantID', `${this.id}`);
    const $info = $('<div>').addClass('info');
    $restaurant.append($info);
      const $infoContainer = $('<div>').addClass('info-container');
      $info.append($infoContainer);
        const $name = $('<h1>').html(`${this.name}`)
        $infoContainer.append($name);
        const $rating = $('<div>').addClass('outer-stars').append($('<div>').addClass('inner-stars').css('width', `${this.rating}%`));
        $infoContainer.append($rating);
        const $moreInfo = $('<p>').html('More info').click(function(){
          console.log('open more info');
        })
        $infoContainer.append($moreInfo);
    const $image = $('<div>').addClass('image');
    $restaurant.append($image);
    const photoReference = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${this.photoReference}&key=AIzaSyCm9kjnGPeQQepnDwcyhiiuGNUS_Xn_hfo`;
    const $imageContainer = $('<div>').addClass('image-container').css('background-image', `url(${photoReference})`);
    $image.append($imageContainer);

    $('.restaurants-container').append($restaurant);
    this.hasView = true;
  }

  /**
  * Delete the restaurant from the page
  */
  deleteFromPage(){
    $(`.restaurant[restaurantID='${this.id}']`).remove();
    this.hasView = false;
  }

  /**
  * Places an marker on the map based on restaurant's location and add it to the markers array
  */
  placeMarker() {
    const location = this.coords;
    this.marker = new google.maps.Marker({
      id: this.id,
      position: location,
      map: map
    });
    markers.push(this.marker);
    this.hasMarker = true;
  }

  /**
  * 1. Deletes the restaurant's markers
  * 2. Delete marker from array by creating new array without object to be removed
  */
  deleteMarker(){
    const that = this;
    function getMarkerObject(){
      for (var i = 0; i < markers.length; i++) {
        if(markers[i].id === that.id){
          return markers[i];
        }
      }
      return null;
    }

    try {
      getMarkerObject().setMap(null);
    } catch (e) {
      console.log(`Marker not deleted: restaurant had no marker`);
    }

    var markersNew = [];
    for (var i = 0; i < markers.length; i++) {
      if(markers[i].id !== that.id){
        markersNew.push(markers[i]);
      }
    }

    markers = markersNew;
    this.hasMarker = false;
  }
}
