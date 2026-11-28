// Router Module for Switching Views and Subpages

const RouterModule = {
  views: ['home', 'programs', 'adult-programs', 'camps', 'rep-teams', 'about', 'coaches', 'careers', 'shop', 'locations', 'faq', 'contact'],
  currentView: 'home',

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  },

  handleRoute() {
    const rawHash = decodeURIComponent(window.location.hash.slice(1)).replace(/^\/+|\/+$/g, '');
    const [hashPart, sectionPart] = rawHash.split('?');
    const hash = (hashPart || 'home').toLowerCase();
    const targetView = this.views.includes(hash) ? hash : 'home';
    this.navigate(targetView);
    // Route to a section inside a view without treating its ID as a new page.
    const targets = { 'tournament-register': 'adult-tournament-register', 'tournament': 'adult-tournament-details' };
    if (targetView === 'adult-programs' && targets[sectionPart]) {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        document.getElementById(targets[sectionPart])?.scrollIntoView({behavior:'smooth', block:'start'});
      }));
    }
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
