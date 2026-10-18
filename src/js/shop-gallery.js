// Independent merchandise gallery: does not change order or email handling.
document.addEventListener('click', function (event) {
  const button = event.target.closest('[data-gallery-image]');
  if (!button) return;
  const gallery = button.closest('[data-shop-gallery]');
  if (!gallery) return;
  const image = gallery.querySelector('[data-gallery-main]');
  if (!image) return;
  image.src = button.dataset.galleryImage;
  image.alt = button.dataset.galleryAlt || '';
  gallery.querySelectorAll('[data-gallery-image]').forEach(function (thumb) {
    const active = thumb === button;
    thumb.classList.toggle('is-active', active);
    thumb.setAttribute('aria-pressed', String(active));
  });
});
