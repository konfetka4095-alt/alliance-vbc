// Interactive Registration Wizard for Alliance Volleyball Club

const RegistrationModule = {
  currentStep: 1,
  selectedCategory: 'tryouts',
  formData: {
    category: 'Rep Tryouts',
    division: '14U Girls (Born 2012)',
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
    this.bindEvents();
  },

  bindEvents() {
    // Open Modal Triggers
    document.querySelectorAll('[data-open-reg]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const preselected = btn.getAttribute('data-program-type') || 'tryouts';
        this.openModal(preselected);
      });
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
        this.formData.category = card.querySelector('.reg-option-name').textContent;
        this.updateDivisions();
      });
    });
  },

  openModal(categoryKey = 'tryouts') {
    this.currentStep = 1;
    this.selectedCategory = categoryKey;
    
    // Select category card
    document.querySelectorAll('.reg-cat-card').forEach(c => {
      if (c.getAttribute('data-cat-value') === categoryKey) {
        c.classList.add('selected');
        this.formData.category = c.querySelector('.reg-option-name').textContent;
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
      if (!parentName || !parentEmail || !parentPhone) {
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

  updateDivisions() {
    const select = document.getElementById('regDivisionSelect');
    if (!select) return;

    select.innerHTML = '';
    const divisionsMap = {
      tryouts: [
        '12U Girls (Born 2014 or later)',
        '13U Girls (Born 2013)',
        '14U Girls (Born 2012)',
        '15U Girls (Born 2011)'
      ],
      clinics: [
        'Youth Skills Clinic - Ages 9-11 (Saturday Morning)',
        'Intermediate Clinic - Ages 12-14 (Saturday Afternoon)',
        'High Performance Clinic - Ages 14-17 (Sunday)'
      ],
      prep: [
        'Prep for Rep - Fall Cohort (Ages 11-13)',
        'Prep for Rep - Winter Cohort (Ages 12-14)'
      ],
      camps: [
        'March Break Intensive Volleyball Camp (Ages 10-15)',
        'Summer Elite Volleyball Camp - July Session',
        'Summer Elite Volleyball Camp - August Session'
      ],
      house: [
        'Junior House League (Grades 5-7)',
        'Senior House League (Grades 8-10)'
      ],
      adult: [
        'Adult Co-ed Open Play (Thursday Evenings)',
        'Adult Intermediate Skills & Scrimmage (Sunday Evenings)'
      ]
    };

    const list = divisionsMap[this.selectedCategory] || divisionsMap.tryouts;
    list.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item;
      opt.textContent = item;
      select.appendChild(opt);
    });
  },

  populateReview() {
    document.getElementById('revCategory').textContent = this.formData.category;
    document.getElementById('revDivision').textContent = this.formData.division;
    document.getElementById('revAthleteName').textContent = this.formData.athleteName;
    document.getElementById('revAthleteDob').textContent = this.formData.athleteDob;
    document.getElementById('revPosition').textContent = this.formData.athletePosition;
    document.getElementById('revParentName').textContent = this.formData.parentName;
    document.getElementById('revParentEmail').textContent = this.formData.parentEmail;
    document.getElementById('revParentPhone').textContent = this.formData.parentPhone;
  },

  submitRegistration(e) {
    e.preventDefault();
    this.currentStep = 5;
    this.renderStep(5);
    
    // Confirmed banner
    const confirmName = document.getElementById('confirmAthleteName');
    if (confirmName) confirmName.textContent = this.formData.athleteName;
  }
};

window.RegistrationModule = RegistrationModule;
