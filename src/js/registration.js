const ALLIANCE_REGISTRATION_ENDPOINT =
  window.ALLIANCE_REGISTRATION_CONFIG && window.ALLIANCE_REGISTRATION_CONFIG.endpoint
    ? window.ALLIANCE_REGISTRATION_CONFIG.endpoint
    : "";


// Interactive Registration Wizard for Alliance Volleyball Club

const RegistrationModule = {
  initialized: false,
  currentStep: 1,
  selectedCategory: '15u',
  selectedSessionId: '',
  formData: {
    category: 'Rep Tryouts',
    division: '14U Girls (Born 2013)',
    athleteName: '',
    athleteDob: '',
    athletePosition: 'Setter',
    experienceYears: '2',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    comments: ''
  },

  init() {
    if (this.initialized) return;
    this.initialized = true;
    this.bindEvents();
  },

  bindEvents() {
    // Open Modal Triggers
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-open-reg]');
      if (!btn) return;
      e.preventDefault();
      const preselected = btn.getAttribute('data-program-type') || 'tryouts';
      const preselectedSession = btn.getAttribute('data-session-id') || '';
      this.openModal(preselected, preselectedSession);
    });

    // Close Modal
    const modalBackdrop = document.getElementById('registrationModal');
    const closeBtn = document.getElementById('regModalClose');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal());
    }

    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) this.closeModal();
      });
    }

    // Wizard Next & Prev Buttons
    const nextBtn = document.getElementById('regNextBtn');
    const prevBtn = document.getElementById('regPrevBtn');
    const submitBtn = document.getElementById('regSubmitBtn');

    if (nextBtn) nextBtn.addEventListener('click', () => this.nextStep());
    if (prevBtn) prevBtn.addEventListener('click', () => this.prevStep());
    if (submitBtn) submitBtn.addEventListener('click', (e) => this.submitRegistration(e));

    // Category Selector Cards
    document.querySelectorAll('.reg-cat-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.reg-cat-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.selectedCategory = card.getAttribute('data-cat-value');
        this.selectedSessionId = '';
        this.formData.category = window.ALLIANCE_PROGRAMS[this.selectedCategory].category;
        this.requestId = null;
        document.querySelectorAll('.reg-cat-card').forEach(c => c.setAttribute('aria-pressed', String(c === card)));
        this.updateDivisions();
      });
    });
  },

  openModal(categoryKey = 'tryouts', sessionId = '') {
    this.currentStep = 1;
    categoryKey = window.ALLIANCE_PROGRAMS[categoryKey] ? categoryKey : '15u';
    this.selectedCategory = categoryKey;
    const sessions = window.ALLIANCE_PROGRAMS[categoryKey].sessions || [];
    this.selectedSessionId = sessions.some(session => session.id === sessionId) ? sessionId : '';
    this.requestId = null;
    const submit = document.getElementById('regSubmitBtn');
    submit.disabled = false; submit.textContent = 'Complete Registration ✓';
    
    // Select category card
    document.querySelectorAll('.reg-cat-card').forEach(c => {
      c.setAttribute('aria-pressed', String(c.getAttribute('data-cat-value') === categoryKey));
      if (c.getAttribute('data-cat-value') === categoryKey) {
        c.classList.add('selected');
        this.formData.category = window.ALLIANCE_PROGRAMS[categoryKey].category;
      } else {
        c.classList.remove('selected');
      }
    });

    this.updateDivisions();
    this.renderStep(1);

    const modal = document.getElementById('registrationModal');
    if (modal) modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  closeModal() {
    if (this.submitting) return;
    const modal = document.getElementById('registrationModal');
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = '';
  },

  nextStep() {
    if (this.currentStep === 1) {
      // Move to Step 2
      this.currentStep = 2;
    } else if (this.currentStep === 2) {
      // Validate Step 2 inputs
      const athleteName = document.getElementById('regAthleteName').value.trim();
      const athleteDob = document.getElementById('regAthleteDob').value;
      const program = window.ALLIANCE_PROGRAMS[this.selectedCategory];
      if ((program.recurringDay !== undefined || (program.sessions && program.sessions.length)) && !this.getSelectedSession()) {
        alert('Please choose a valid upcoming date for the selected program.');
        return;
      }
      if (!athleteName || !athleteDob) {
        alert('Please provide the athlete\'s full name and date of birth.');
        return;
      }
      this.formData.athleteName = athleteName;
      this.formData.athleteDob = athleteDob;
      this.formData.division = document.getElementById('regDivisionSelect').value;
      this.formData.athletePosition = document.getElementById('regAthletePos').value;
      this.formData.experienceYears = document.getElementById('regAthleteExp').value;
      this.currentStep = 3;
    } else if (this.currentStep === 3) {
      // Validate Step 3 inputs
      const parentName = document.getElementById('regParentName').value.trim();
      const parentEmail = document.getElementById('regParentEmail').value.trim();
      const parentPhone = document.getElementById('regParentPhone').value.trim();
      if (!parentName || !parentEmail || !parentPhone || !document.getElementById('regParentEmail').checkValidity()) {
        alert('Please fill in parent/guardian contact details.');
        return;
      }
      this.formData.parentName = parentName;
      this.formData.parentEmail = parentEmail;
      this.formData.parentPhone = parentPhone;
      this.formData.comments = document.getElementById('regComments').value.trim();
      
      this.populateReview();
      this.currentStep = 4;
    }

    this.renderStep(this.currentStep);
  },

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.renderStep(this.currentStep);
    }
  },

  renderStep(step) {
    const container = document.querySelector("#registrationModal .modal-container");
    if (container) container.scrollTop = 0;
    document.querySelectorAll('.reg-step-view').forEach(view => {
      view.style.display = 'none';
    });

    const currentView = document.getElementById(`regStepView${step}`);
    if (currentView) currentView.style.display = 'block';

    // Update Indicators
    for (let i = 1; i <= 4; i++) {
      const ind = document.getElementById(`regInd${i}`);
      if (!ind) continue;
      ind.classList.remove('active', 'completed');
      if (i === step) ind.classList.add('active');
      else if (i < step) ind.classList.add('completed');
    }

    // Buttons visibility
    const prevBtn = document.getElementById('regPrevBtn');
    const nextBtn = document.getElementById('regNextBtn');
    const submitBtn = document.getElementById('regSubmitBtn');

    if (prevBtn) prevBtn.style.display = step === 1 || step === 5 ? 'none' : 'inline-flex';
    if (nextBtn) nextBtn.style.display = step >= 4 ? 'none' : 'inline-flex';
    if (submitBtn) submitBtn.style.display = step === 4 ? 'inline-flex' : 'none';
  },

  getSelectedSession() {
    const p = window.ALLIANCE_PROGRAMS[this.selectedCategory];
    if (p && p.recurringDay !== undefined) {
      const date = this.selectedSessionId;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
      const parsed = new Date(date + 'T12:00:00Z');
      if (isNaN(parsed) || parsed.toISOString().slice(0,10) !== date || parsed.getUTCDay() !== p.recurringDay || date < this.clinicMinimumDate() || date > p.endDate) return null;
      return {id: date, date: parsed.toLocaleDateString('en-CA', {timeZone:'UTC', weekday:'long', year:'numeric', month:'long', day:'numeric'}), time:p.sessionTime, location:p.venue + ', ' + p.address};
    }
    if (!p || !p.sessions || !p.sessions.length) return null;
    return p.sessions.find(session => session.id === this.selectedSessionId) || null;
  },

  clinicMinimumDate() {
    const p = window.ALLIANCE_PROGRAMS[this.selectedCategory];
    const parts = new Intl.DateTimeFormat('en-CA', {timeZone:'America/Toronto', year:'numeric', month:'2-digit', day:'2-digit'}).formatToParts(new Date());
    const part = type => parts.find(p => p.type === type).value;
    return [part('year'),part('month'),part('day')].join('-') < p.startDate ? p.startDate : [part('year'),part('month'),part('day')].join('-');
  },

  sessionMarkup(reviewOnly = false) {
    const p = window.ALLIANCE_PROGRAMS[this.selectedCategory];
    const selected = this.getSelectedSession();
    if (p.recurringDay !== undefined) {
      const fee = selected && selected.id <= p.freeThrough ? 0 : p.fee;
      const payment = fee === 0 ? 'No payment required for this practice.' : 'Please e-transfer $' + fee + ' to Alliancevb.clinic@gmail.com. Include the child’s name, grade group, practice date and parent phone number.';
      if (reviewOnly && selected) return `<strong>${p.name}</strong><p>${selected.date}<br>${selected.time}<br>${selected.location}</p><p>${p.eligibility || ''}</p><p><strong>$${fee} — one practice</strong></p><p>${payment}</p>`;
      return `<strong>${p.name}</strong><p>${p.venue}<br>${p.address}<br>${p.time}</p><p>${p.payment}</p><label for="regClinicDate">Choose a ${p.dayName} practice date *</label><input class="form-control" type="date" id="regClinicDate" min="${this.clinicMinimumDate()}" max="${p.endDate}" value="${/^\d{4}-\d{2}-\d{2}$/.test(this.selectedSessionId) ? this.selectedSessionId : ''}" required><p class="session-choice-instruction">Book one date per registration; register again for additional dates.</p>`;
    }


    if (p.sessions && p.sessions.length) {
      if (reviewOnly && selected) {
        return `<strong>${p.name}</strong><p><strong>${selected.date}</strong><br>${selected.time}<br>${selected.location}</p><p>${p.payment}</p>`;
      }

      const options = p.sessions.map(session => `
        <label class="tryout-session-choice${session.id === this.selectedSessionId ? ' selected' : ''}">
          <input type="radio" name="tryoutSession" value="${session.id}" ${session.id === this.selectedSessionId ? 'checked' : ''}>
          <span>
            <strong>${session.date}</strong>
            <small>${session.time}</small>
            <small>${session.location}</small>
          </span>
        </label>`).join('');

      return `<strong>${p.name}</strong><p class="session-choice-instruction">Choose the tryout date your athlete will attend *</p><div class="tryout-session-choices">${options}</div>`;
    }

    return `<strong>${p.name}</strong><p>${p.date}<br>${p.time}</p><p>${p.venue}<br>${p.address}</p>${p.entrance ? `<div class="entrance-note">${p.entrance}</div>` : ''}<p>${p.payment}</p>`;
  },

  updateDivisions() {
    const p = window.ALLIANCE_PROGRAMS[this.selectedCategory];
    const select = document.getElementById('regDivisionSelect');
    while (select.firstChild) select.removeChild(select.firstChild);
    select.appendChild(new Option(p.name, p.name));
    this.formData.division = p.name;
    document.getElementById('regSessionSummary').innerHTML = this.sessionMarkup();
    const clinicDate = document.getElementById('regClinicDate');
    if (clinicDate) clinicDate.addEventListener('change', () => {
      this.selectedSessionId = clinicDate.value;
      this.requestId = null;
      clinicDate.setCustomValidity(this.getSelectedSession() ? '' : 'Choose an upcoming ' + p.dayName + ' between ' + p.startDate + ' and ' + p.endDate + '.');
      clinicDate.reportValidity();
    });

    document.querySelectorAll('input[name="tryoutSession"]').forEach(input => {
      input.addEventListener('change', () => {
        this.selectedSessionId = input.value;
        this.requestId = null;
        document.querySelectorAll('.tryout-session-choice').forEach(choice => {
          choice.classList.toggle('selected', choice.contains(input) && input.checked);
        });
      });
    });
  },

  populateReview() {
    document.getElementById('revSessionSummary').innerHTML = this.sessionMarkup(true);
    document.getElementById('revCategory').textContent = this.formData.category;
    document.getElementById('revDivision').textContent = this.formData.division;
    document.getElementById('revAthleteName').textContent = this.formData.athleteName;
    document.getElementById('revAthleteDob').textContent = this.formData.athleteDob;
    document.getElementById('revPosition').textContent = this.formData.athletePosition;
    document.getElementById('revParentName').textContent = this.formData.parentName;
    document.getElementById('revParentEmail').textContent = this.formData.parentEmail;
    document.getElementById('revParentPhone').textContent = this.formData.parentPhone;
  },

 async submitRegistration(e) {
  e.preventDefault();
  if (this.submitting) return;
  if (!ALLIANCE_REGISTRATION_ENDPOINT) {
    alert('Online registration is being updated. Please contact info@alliancevbc.ca to register.');
    return;
  }
  this.submitting = true;
  this.requestId = this.requestId || this.createRequestId();

  const submitBtn =
    document.getElementById("regSubmitBtn");

  const originalText = submitBtn.innerHTML;

  submitBtn.innerHTML = "Submitting...";
  submitBtn.disabled = true;

  const payload = new URLSearchParams({
    formType: "registration",
    programId: this.selectedCategory,
    sessionId: this.selectedSessionId || '',
    requestId: this.requestId,

    category:
      this.formData.category || "",

    division:
      this.formData.division || "",

    athleteName:
      this.formData.athleteName || "",

    athleteDob:
      this.formData.athleteDob || "",

    athletePosition:
      this.formData.athletePosition || "",

    experienceYears:
      this.formData.experienceYears || "",

    parentName:
      this.formData.parentName || "",

    parentEmail:
      this.formData.parentEmail || "",

    parentPhone:
      this.formData.parentPhone || "",

    comments:
      this.formData.comments || "",

    website: "",
    sourceUrl: window.location.href
  });

  try {
    const response = await fetch(
      ALLIANCE_REGISTRATION_ENDPOINT,
      {
        method: "POST",

        body: payload
      }
    );

    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.error || 'Registration was not saved.');
    document.getElementById('confirmationEmailStatus').textContent = result.emailStatus === 'sent'
      ? 'Your confirmation email has been sent. Please check your inbox and spam folder.'
      : 'Your confirmation email is pending. Please contact info@alliancevbc.ca if it does not arrive.';
    this.currentStep = 5;
    this.renderStep(5);

    const confirmName =
      document.getElementById(
        "confirmAthleteName"
      );

    if (confirmName) {
      confirmName.textContent =
        this.formData.athleteName;
    }

  } catch (error) {
    console.error(
      "Registration submission failed:",
      error
    );

    alert(
      "Registration could not be submitted. Please try again or contact Alliance directly."
    );

    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  } finally {
    this.submitting = false;
  }
},

createRequestId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }

  const randomPart = Math.random().toString(36).slice(2);
  return 'reg-' + Date.now().toString(36) + '-' + randomPart + '-' + Math.random().toString(36).slice(2);
}
};

window.RegistrationModule = RegistrationModule;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => RegistrationModule.init(), { once: true });
} else {
  RegistrationModule.init();
}
