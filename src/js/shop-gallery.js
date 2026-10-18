// Photo carousel for each merchandise card: arrows, indicator dots and touch swipe.
(function () {
  document.querySelectorAll('[data-shop-gallery]').forEach(function (gallery) {
    const slides = Array.from(gallery.querySelectorAll('[data-gallery-image]'));
    const main = gallery.querySelector('[data-gallery-main]');
    const dots = gallery.querySelector('.shop-gallery-dots');
    const prev = gallery.querySelector('.shop-gallery-prev');
    const next = gallery.querySelector('.shop-gallery-next');
    if (!main || !dots || !slides.length) return;
    let current = 0;
    const buttons = slides.map(function (_, i) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'shop-gallery-dot';
      button.setAttribute('aria-label', 'Show image ' + (i + 1) + ' of ' + slides.length);
      button.addEventListener('click', function () { show(i); });
      dots.appendChild(button);
      return button;
    });
    function show(index) {
      current = (index + slides.length) % slides.length;
      main.src = slides[current].dataset.galleryImage;
      main.alt = slides[current].dataset.galleryAlt || '';
      buttons.forEach(function (button, i) {
        button.classList.toggle('is-active', i === current);
        button.setAttribute('aria-current', i === current ? 'true' : 'false');
      });
    }
    prev.addEventListener('click', function () { show(current - 1); });
    next.addEventListener('click', function () { show(current + 1); });
    let touchStart = 0;
    gallery.addEventListener('touchstart', function (event) { touchStart = event.changedTouches[0].screenX; }, {passive:true});
    gallery.addEventListener('touchend', function (event) {
      const distance = event.changedTouches[0].screenX - touchStart;
      if (Math.abs(distance) > 45) show(current + (distance < 0 ? 1 : -1));
    }, {passive:true});
    show(0);
  });
})();
