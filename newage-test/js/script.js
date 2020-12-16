$(document).ready(function(){
  // Add smooth scrolling to all links
  $("a").on('click', function(event) {

    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function(){
   
        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    } // End if
  });
});

$('.pill-set').slick({
  autoplay: false,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplaySpeed: 5000,
  prevArrow: false,
  nextArrow: false,
  dots: true,
  responsive:[
    {
      breakpoint:1140,
      settings:{
         slidesToShow: 3,
         slidesToScroll: 1,
      }
    },
    {
      breakpoint:1024,
      settings:{
         slidesToShow: 3,
         slidesToScroll: 1,
      }
    },
    {
      breakpoint:992,
      settings:{
         slidesToShow: 2,
         slidesToScroll: 1,
      }
    },
    {
      breakpoint:875,
      settings:{
         slidesToShow: 2,
         slidesToScroll: 1,
      }
    },
    {
      breakpoint:768,
      settings:{
         slidesToShow: 1,
         slidesToScroll: 1,
      }
    },
    {
      breakpoint:600,
      settings:{
         slidesToShow: 1,
         slidesToScroll: 1,
      }
    },
    {
    breakpoint:540,
      settings:{
         slidesToShow: 1,
         slidesToScroll: 1,
      }
    },

  ]
  });

  $('.slider').slick({
    infinite:true,
    slidesToShow:1,
    slidesToScroll:1,
    dots:true,
    prevArrow:$('.prev'),
    nextArrow:$('.next'),
  });
