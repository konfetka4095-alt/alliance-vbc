// Tryout Schedule & Age Category Calculator — 2026–27 season

const ScheduleModule = {
  ageData: {
    2015: { division: '12U Girls', programId: 'free-tryout-grade-6-8' },
    2014: { division: '13U Girls', programId: 'free-tryout-grade-6-8' },
    2013: { division: '14U Girls', programId: '14u' },
    2012: { division: '15U Girls', programId: 'free-tryout-grade-6-8' }
  },

  init() {
    this.renderTryoutSchedule();
    this.bindEvents();
  },

  renderTryoutSchedule() {
    const container = document.querySelector('.tryout-session-grid');
    const programs = window.ALLIANCE_PROGRAMS || {};
    const order = ['free-tryout-grade-6-8', '12u13u', '14u', '15u'];

    if (!container) return;

    const rows = order.map(programId => {
      if (programId === '12u13u') {
        const combined = programs['12u13u'];
        if (!combined || !combined.sessions) return '';

        return combined.sessions.map((session, index) => `
          <tr class="schedule-row${index === combined.sessions.length - 1 ? ' division-end' : ''}" data-division="12u13u">
            <td class="tryout-division-cell" data-label="Division">
              <strong>${index === 0 ? '12/13U Girls' : ''}</strong>
              ${index === 0 ? '<small>12U tryouts run during 13U practice</small>' : ''}
            </td>
            <td data-label="Date & Time">
              <strong>${session.date}</strong>
              <small>${session.time}</small>
            </td>
            <td data-label="Location">${session.location}</td>
            <td class="tryout-action-cell">
              <button class="btn btn-pink btn-sm" data-open-reg data-program-type="12u13u" data-session-id="${session.id}">Register</button>
            </td>
          </tr>`).join('');
      }

      const program = programs[programId];
      if (!program || !program.sessions) return '';

      const divisionLabel = program.scheduleLabel || program.name;
      const divisionSubLabel = program.scheduleSubLabel || (program.born ? `Born ${program.born}` : '');
      const featuredClass = program.featured ? ' featured-tryout-row' : '';

      return program.sessions.map((session, index) => `
        <tr class="schedule-row${featuredClass}${index === program.sessions.length - 1 ? ' division-end' : ''}" data-division="${programId}">
          <td class="tryout-division-cell" data-label="Division">
            <strong>${divisionLabel}</strong>
            ${divisionSubLabel ? `<small>${divisionSubLabel}</small>` : ''}
          </td>
          <td data-label="Date & Time">
            <strong>${session.date}</strong>
            <small>${session.time}</small>
          </td>
          <td data-label="Location">${session.location}</td>
          <td class="tryout-action-cell">
            <button class="btn btn-pink btn-sm" data-open-reg data-program-type="${programId}" data-session-id="${session.id}" aria-label="Register for ${program.name} on ${session.date}">Register</button>
          </td>
        </tr>`).join('');
    }).join('');

    container.className = 'schedule-table-wrapper tryout-schedule-wrapper';
    container.innerHTML = `
      <table class="schedule-table tryout-schedule-table">
        <thead>
          <tr><th>Division</th><th>Date & Time</th><th>Location</th><th>Registration</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;
  },

  bindEvents() {
    const calcBtn = document.getElementById('calcAgeBtn');
    const calcInput = document.getElementById('calcBirthYear');

    if (calcBtn && calcInput) {
      calcBtn.addEventListener('click', () => this.calculateCategory(calcInput.value));
      calcInput.addEventListener('keypress', event => {
        if (event.key === 'Enter') this.calculateCategory(calcInput.value);
      });
    }

    document.querySelectorAll('.schedule-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.schedule-filter-btn').forEach(item => item.classList.remove('active'));
        btn.classList.add('active');
        this.filterTable(btn.getAttribute('data-filter'));
      });
    });
  },

  calculateCategory(yearValue) {
    const year = parseInt(yearValue, 10);
    const resultBox = document.getElementById('calcResultBox');
    if (!resultBox) return;

    const match = this.ageData[year];
    if (!match) {
      resultBox.innerHTML = '<div style="color:#f87171;font-weight:600;">Please contact Alliance to confirm the correct age division for this birth year.</div>';
      return;
    }

    const program = window.ALLIANCE_PROGRAMS[match.programId];
    const sessionList = program.sessions.map(session =>
      `<li style="margin-bottom:.55rem;"><strong>${session.date} · ${session.time}</strong><br>${session.location}</li>`
    ).join('');

    resultBox.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.75rem;gap:1rem;">
        <span class="badge-pill badge-pink" style="font-size:.85rem;">Assigned Division: ${match.division}</span>
        <span style="font-size:.8rem;color:#94a3b8;">OVA 2026–27 Season</span>
      </div>
      <div style="font-size:.95rem;line-height:1.6;color:#e2e8f0;">
        <p><strong>Available tryout sessions:</strong></p>
        <ul style="padding-left:1.25rem;">${sessionList}</ul>
      </div>
      <button class="btn btn-pink btn-sm" style="margin-top:1rem;width:100%;" onclick="window.RegistrationModule.openModal('${match.programId}')">
        Register for ${match.division} Tryouts →
      </button>`;
  },

  filterTable(filter) {
    document.querySelectorAll('.schedule-row').forEach(row => {
      row.style.display = filter === 'all' || row.getAttribute('data-division') === filter ? '' : 'none';
    });
  }
};

window.ScheduleModule = ScheduleModule;
