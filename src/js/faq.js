// FAQ Accordion and Search / Filter Logic

const FaqModule = {
  init() {
    this.bindEvents();
  },

  bindEvents() {
    // Accordion Toggle
    document.querySelectorAll('.faq-question-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');

        // Close other items in the same container for cleaner view
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

        if (!isOpen) {
          item.classList.add('open');
        }
      });
    });

    // Category Filter
    document.querySelectorAll('.faq-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.faq-cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const category = btn.getAttribute('data-category');
        this.filterCategory(category);
      });
    });

    // Search Box
    const searchInput = document.getElementById('faqSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchFaq(e.target.value.toLowerCase().trim());
      });
    }
  },

  filterCategory(category) {
    const items = document.querySelectorAll('.faq-item');
    items.forEach(item => {
      if (category === 'all' || item.getAttribute('data-category') === category) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  },

  searchFaq(query) {
    const items = document.querySelectorAll('.faq-item');
    items.forEach(item => {
      const qText = item.querySelector('.faq-question-text').textContent.toLowerCase();
      const aText = item.querySelector('.faq-answer').textContent.toLowerCase();
      if (!query || qText.includes(query) || aText.includes(query)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }
};

window.FaqModule = FaqModule;
