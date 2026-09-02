document.addEventListener('DOMContentLoaded', function () {
  var burger = document.getElementById('siteNavBurger');
  var menu = document.getElementById('siteNavMenu');

  if (!burger || !menu) return;

  burger.addEventListener('click', function () {
    var expanded = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!expanded));
    burger.classList.toggle('is-active');
    menu.classList.toggle('is-active');
  });
});
