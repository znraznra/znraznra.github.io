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
