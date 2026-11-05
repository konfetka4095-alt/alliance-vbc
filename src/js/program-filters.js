/* Alliance program browser filters — client-side only */
(function () {
  'use strict';
  function init() {
    const panel = document.getElementById('view-programs');
    const finder = document.getElementById('program-finder');
    if (!panel || !finder) return;
    const location = document.getElementById('program-location-filter');
    const type = document.getElementById('program-type-filter');
    const search = document.getElementById('program-search-filter');
    const count = document.getElementById('program-filter-count');
    const empty = document.getElementById('program-filter-empty');
    const cards = Array.from(panel.querySelectorAll('.program-detail-card'));
    function apply() {
      const loc = location.value;
      const kind = type.value;
      const term = search.value.trim().toLocaleLowerCase();
      let visible = 0;
      cards.forEach(function (card) {
        const matches = (loc === 'all' || card.dataset.programLocation === loc) &&
          (kind === 'all' || card.dataset.programCat === kind) &&
          (!term || card.textContent.toLocaleLowerCase().includes(term));
        card.hidden = !matches;
        if (matches) visible++;
      });
      count.textContent = visible + ' program' + (visible === 1 ? '' : 's') + ' found';
      empty.hidden = visible !== 0;
    }
    function reset() {
      location.value = 'all';
      type.value = 'all';
      search.value = '';
      apply();
    }
    location.addEventListener('change', apply);
    type.addEventListener('change', apply);
    search.addEventListener('input', apply);
    document.getElementById('program-filter-reset').addEventListener('click', reset);
    document.getElementById('program-filter-empty-reset').addEventListener('click', reset);
    apply();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
