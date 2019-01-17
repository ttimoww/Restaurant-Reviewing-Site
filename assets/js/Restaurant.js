class Restaurant{
  constructor(id, nm, rt, cr, pr){
    this.id = id,
    this.name = nm,
    this.rating = rt,
    this.coords = cr,
    this.photoReference = pr,
    this.hasMarker = false,
    this.hasView = false,
    this.address,
    this.phoneNumber,
    this.website,
    this.reviews = []
  }

  /**
  * Write the restaurant to the page
  */
  writeToPage(){
    const that = this;
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
          that.openMoreInfo();
        })
        $infoContainer.append($moreInfo);
        const $showOnMap = $('<p>').html('Show on map').click(function(){
          that.showOnMap();
        })
        $infoContainer.append($showOnMap);
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
      map: map,
      animation: google.maps.Animation.DROP,
      show: function(){
        google.maps.Animation.DROP;
      }
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
    // function getMarkerObject(){
    //   for (var i = 0; i < markers.length; i++) {
    //     if(markers[i].id === that.id){
    //       return markers[i];
    //     }
    //   }
    //   return null;
    // }
    //
    // try {
    //   getMarkerObject().setMap(null);
    // } catch (e) {
    //   console.log(e + 'Can not delete marker');
    // }

    var markersNew = [];
    for (var i = 0; i < markers.length; i++) {
      if(markers[i].id !== that.id){
        markersNew.push(markers[i]);
      }
      else{
        markers[i].setMap(null);
      }
    }
    markers = markersNew;

    this.hasMarker = false;
  }

  showOnMap(){
    const that = this;
    if (this.marker.getAnimation() !== null) {
      this.marker.setAnimation(null);
    } else {
      this.marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function(){ that.marker.setAnimation(null); }, 1000);
    }
  }

  /**
  * Sets more info popup info to this restaurant
  * - Fetches place details from google places api
  */
  openMoreInfo(){
    const that = this;
    $('.more-info').fadeIn();

    function getAdditonalData(){
      const proxyurl = "https://cors-anywhere.herokuapp.com/";
      const req = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${that.id}&fields=formatted_address,formatted_phone_number,reviews,website&key=AIzaSyCm9kjnGPeQQepnDwcyhiiuGNUS_Xn_hfo`;
      var data = $.ajax({
        "async": true,
        "crossDomain": true,
        "url": proxyurl + req,
        "method": "GET"
      });

      $.when(data).done(function(data){
        var reviews = [];
        that.address = data.result.formatted_address;
        that.phonenumber = data.result.formatted_phone_number;
        that.website = data.result.website;
        for (var i = 0; i < data.result.reviews.length; i++) {
          const r1 = new Review(data.result.reviews[i].author_name, data.result.reviews[i].text, data.result.reviews[i].rating / 5 * 100, data.result.reviews[i].profile_photo_url);
          reviews.push(r1);
        }
        that.reviews = reviews;
        initWindow();
      })
    }

    function initWindow(){
      $('.review').remove();
      $('.error').css('display', 'none');
      $('#more-info-name').html(that.name);
      $('#more-info-address').html(that.address);
      $('#more-info-rating').css('width', `${that.rating}%`);
      $('#more-info-phonenumber').html(that.phonenumber);
      $('#more-info-website-anchor').attr('href', that.website);
      $('.more-info-container').fadeIn();
      $('#new-review-submit').unbind('click').click(function(){
        if(!$('#new-review-name').val() || !$('#new-review-review').val()){
          $('.error').css('display', 'block');
        }else{
          that.addReview();
        }
      });


      for (var i = 0; i < that.reviews.length; i++) {
        const $review = $('<div>').addClass('review');
        const $author = $('<div>').addClass('author');
        $review.append($author);
          const $profilePic = $('<div>').addClass('profile-pic').css('background-image', `url(${that.reviews[i].authorImage})`);
          $author.append($profilePic);
          const $h1Name = $('<h1>').html(that.reviews[i].authorName);
          $author.append($h1Name);
        const $rating = $('<div>').addClass('outer-stars').append($('<div>').addClass('inner-stars').css('width', `${that.reviews[i].rating}%`));
        $review.append($rating);
        const $pText = $('<p>').html(that.reviews[i].text);
        $review.append($pText);
        $('.reviews-container').append($review);
      }
    }

    if(typeof(this.address) === typeof(undefined)){
      getAdditonalData();
    }else{
      console.log('yo');
      initWindow();
    }
  }

  /**
  * Create new review object and add it to the array
  * Re-open the more info window for the restaurant
  */
  addReview(){
    const name = $('#new-review-name').val();
    const text = $('#new-review-review').val();
    const rating = $('#new-review-rating').val();
    const r1 = new Review(name, text, rating);
    this.reviews.unshift(r1);
    this.openMoreInfo();
  }
}
