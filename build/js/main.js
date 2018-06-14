$('.owl-carousel').owlCarousel({
  loop: true,
  margin: 0,
  dots: false,
  nav: true,
  loop: true,

  responsive: {
    0: {
      items: 1,
      nav: false
    },
    600: {
      items: 2,
      nav: true
    },
    1200: {
      items: 4,
      nav: true,
      loop: true
    }
  },
  navText: ['', '']
});

$('.owl-item:not(.cloned) .gallery').magnificPopup({
  type: 'image',
  gallery: {
    enabled: true
  }
});

$(function() {
  // Smooth Scrolling
  $('a[href*="#"]:not([href="#"])').click(function() {
    if (
      location.pathname.replace(/^\//, '') ==
        this.pathname.replace(/^\//, '') &&
      location.hostname == this.hostname
    ) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate(
          {
            scrollTop: target.offset().top
          },
          1000
        );
        return false;
      }
    }
  });
});

// ===== MAIN-NAV TOGGLER =====
document.querySelector('.main-nav-toggler').addEventListener('click', e => {
  document.querySelector('.main-nav').classList.toggle('active');
});

document.querySelectorAll('.main-nav.active .main-nav__link').forEach(link =>
  link.addEventListener('click', e => {
    document.querySelector('.main-nav').classList.remove('active');
    console.log(27);
  })
);
