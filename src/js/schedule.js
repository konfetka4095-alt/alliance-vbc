// Tryout Schedule & Age Category Calculator (Ontario Volleyball Association 2026-27 Standard)

const ScheduleModule = {
  ageData: {
    2014: { division: '12U Girls', dates: 'September 12 & 14, 2026', time: '6:00 PM – 7:30 PM', court: 'Court 1 - Thornhill Gym' },
    2015: { division: '12U Girls', dates: 'September 12 & 14, 2026', time: '6:00 PM – 7:30 PM', court: 'Court 1 - Thornhill Gym' },
    2016: { division: '12U Girls', dates: 'September 12 & 14, 2026', time: '6:00 PM – 7:30 PM', court: 'Court 1 - Thornhill Gym' },
    2013: { division: '13U Girls', dates: 'September 13 & 15, 2026', time: '6:00 PM – 8:00 PM', court: 'Court 2 - Thornhill Gym' },
    2012: { division: '14U Girls', dates: 'September 16 & 18, 2026', time: '6:30 PM – 8:30 PM', court: 'Court 1 - Thornhill Gym' },
    2011: { division: '15U Girls', dates: 'September 17 & 19, 2026', time: '7:00 PM – 9:00 PM', court: 'Court 2 - Thornhill Gym' },
    2010: { division: '16U (Special Invitation)', dates: 'September 20, 2026', time: '7:30 PM – 9:30 PM', court: 'Main Gym' }
  },

  init() {
    this.bindEvents();
  },

  bindEvents() {
    const calcBtn = document.getElementById('calcAgeBtn');
    const calcInput = document.getElementById('calcBirthYear');

    if (calcBtn && calcInput) {
      calcBtn.addEventListener('click', () => this.calculateCategory(calcInput.value));
      calcInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.calculateCategory(calcInput.value);
      });
    }

    // Filter Tryouts Table
    document.querySelectorAll('.schedule-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.schedule-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        this.filterTable(filter);
      });
    });
  },

  calculateCategory(yearStr) {
    const year = parseInt(yearStr, 10);
    const resultBox = document.getElementById('calcResultBox');
    if (!resultBox) return;

    if (!year || year < 2008 || year > 2018) {
      resultBox.innerHTML = `
        <div style="color: #f87171; font-weight: 600;">
          Please enter a valid birth year between 2008 and 2018 (e.g. 2012).
        </div>
      `;
      return;
    }

    const match = this.ageData[year] || {
      division: year > 2016 ? 'Youth Development Clinic' : 'Senior Competitive / Adult',
      dates: 'Contact coach for customized assessment',
      time: 'Flexible Sessions',
      court: '121 Worth Blvd, Thornhill'
    };

    resultBox.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
        <span class="badge-pill badge-pink" style="font-size: 0.85rem;">Assigned Division: ${match.division}</span>
        <span style="font-size: 0.8rem; color: #94a3b8;">OVA 2026-27 Season</span>
      </div>
      <div style="font-size: 0.95rem; line-height: 1.6; color: #e2e8f0;">
        <p><strong>Tryout Dates:</strong> ${match.dates}</p>
        <p><strong>Session Time:</strong> ${match.time}</p>
        <p><strong>Location:</strong> ${match.court}</p>
      </div>
      <button class="btn btn-pink btn-sm" style="margin-top: 1rem; width: 100%;" onclick="window.RegistrationModule.openModal('tryouts')">
        Register for ${match.division} Tryout →
      </button>
    `;
  },

  filterTable(filter) {
    const rows = document.querySelectorAll('.schedule-row');
    rows.forEach(row => {
      if (filter === 'all' || row.getAttribute('data-division') === filter) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }
};

window.ScheduleModule = ScheduleModule;
