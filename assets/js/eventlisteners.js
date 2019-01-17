/**
* TRIGGER: Click on decrease button at filters
* 1. Decrease minimal Rating
* 2. Add restaurants (and markers) that match the filter
*/
$('.star-decrease').click(function(){
  var currentRating = parseInt($('.min-rating').html());
  if(currentRating > 0 ){
    currentRating -= 1;
    $('.min-rating').html(currentRating)
    const minRating = currentRating / 5 * 100;

    for (var i = 0; i < restaurants.length; i++) {
      if (restaurants[i].rating > minRating) {
        if(!restaurants[i].hasView){restaurants[i].writeToPage();}
        if(!restaurants[i].hasMarker){restaurants[i].placeMarker();}
      }
    }
  }
})

/**
* TRIGGER: Click on increase button at filters
* 1. Increase minimal Rating
* 2. Delete restaurants (and markers) that do not match filter
*/
$('.star-increase').click(function(){
  var currentRating = parseInt($('.min-rating').html());
  if(currentRating < 5 ){
    currentRating += 1;
    $('.min-rating').html(currentRating);
    const minRating = currentRating / 5 * 100;

    for (var i = 0; i < restaurants.length; i++) {
      if (restaurants[i].rating < minRating) {
        if(restaurants[i].hasView){restaurants[i].deleteFromPage();};
        if(restaurants[i].hasMarker){restaurants[i].deleteMarker();};
      }
    }
  }
})

/**
* TRIGGER: 'close' on popup
* 1. Hides the popup window for more info
*/
$('#close-more-info').click(function(){
  $('.more-info').fadeOut();
  $('.more-info-container').fadeOut();

})

/**
* TRIGGER: 'close' on popup
* 1. Hides the popup window for add restaurant
*/
$('#close-add-restaurant').click(function(){
  $('.add-restaurant').fadeOut();
})
