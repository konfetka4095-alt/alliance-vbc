// Router Module for Switching Views and Subpages

const RouterModule = {
  views: ['home', 'programs', 'rep-teams', 'tryouts', 'about', 'coaches', 'locations', 'faq', 'contact'],
  currentView: 'home',

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  },

  handleRoute() {
    const hash = window.location.hash.replace('#', '') || 'home';
    const targetView = this.views.includes(hash) ? hash : 'home';
    this.navigate(targetView);
  },

  navigate(viewName) {
    this.currentView = viewName;

    // Toggle view containers
    this.views.forEach(v => {
      const el = document.getElementById(`view-${v}`);
      if (el) {
        if (v === viewName) {
          el.style.display = 'block';
          el.classList.add('active-view');
        } else {
          el.style.display = 'none';
          el.classList.remove('active-view');
        }
      }
    });

    // Update active nav links
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
      const target = link.getAttribute('href') ? link.getAttribute('href').replace('#', '') : '';
      if (target === viewName || (viewName === 'home' && (target === '' || target === 'home'))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

window.RouterModule = RouterModule;
