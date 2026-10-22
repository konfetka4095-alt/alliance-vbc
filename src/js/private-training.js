const PrivateTrainingModule = {
  endpoint: (window.ALLIANCE_REGISTRATION_CONFIG && window.ALLIANCE_REGISTRATION_CONFIG.endpoint) || '/api/register.php',
  excludedDates: new Set(['2026-12-21', '2026-12-28', '2027-02-15']),

  init() {
    const form = document.getElementById('privateTrainingForm');
    if (!form) return;
    this.populateDates();
    this.syncTrainingType();
    const type = document.getElementById('ptTrainingType');
    if (type) type.addEventListener('change', () => this.syncTrainingType());
    form.addEventListener('submit', (e) => this.submit(e));
  },

  populateDates() {
    const select = document.getElementById('ptPreferredDate');
    if (!select || select.options.length > 1) return;
    let d = new Date('2026-11-09T12:00:00Z');
    const end = new Date('2027-02-22T12:00:00Z');
    while (d <= end) {
      const iso = d.toISOString().slice(0, 10);
      if (d.getUTCDay() === 1 && !this.excludedDates.has(iso)) {
        const label = d.toLocaleDateString('en-CA', {timeZone:'UTC', weekday:'long', month:'long', day:'numeric', year:'numeric'});
        select.add(new Option(label, iso));
      }
      d.setUTCDate(d.getUTCDate() + 1);
    }
  },

  syncTrainingType() {
    const type = document.getElementById('ptTrainingType');
    const secondWrap = document.getElementById('ptSecondParticipantWrap');
    const second = document.getElementById('ptSecondParticipant');
    const price = document.getElementById('ptPriceSummary');
    const semi = type && type.value === 'semi-private';
    if (secondWrap) secondWrap.hidden = !semi;
    if (second) {
      second.required = semi;
      if (!semi) second.value = '';
    }
    if (price) {
      price.innerHTML = semi
        ? '<strong>$70 per person</strong><span>2 athletes · $140 total · 1 hour</span>'
        : '<strong>$120</strong><span>1 athlete · 1 hour</span>';
    }
  },

  requestId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'pt-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 14);
  },

  async submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const feedback = document.getElementById('ptFeedback');
    const submit = document.getElementById('ptSubmit');
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const consent = document.getElementById('ptPhotoConsent');
    if (!consent || !consent.checked) {
      alert('Please review and acknowledge the Photo & Video Policy before submitting.');
      return;
    }

    const payload = new URLSearchParams({
      formType: 'private-training',
      requestId: this.requestId(),
      trainingType: document.getElementById('ptTrainingType').value,
      participantName: document.getElementById('ptParticipantName').value.trim(),
      secondParticipantName: document.getElementById('ptSecondParticipant').value.trim(),
      experienceLevel: document.getElementById('ptExperience').value,
      skillFocus: document.getElementById('ptSkillFocus').value,
      skillDetails: document.getElementById('ptSkillDetails').value.trim(),
      preferredDate: document.getElementById('ptPreferredDate').value,
      preferredTime: document.getElementById('ptPreferredTime').value,
      contactName: document.getElementById('ptContactName').value.trim(),
      contactEmail: document.getElementById('ptContactEmail').value.trim(),
      contactPhone: document.getElementById('ptContactPhone').value.trim(),
      howHeard: document.getElementById('ptHowHeard').value,
      photoVideoConsent: 'Yes',
      photoVideoPolicyVersion: '2026-10-17',
      website: document.getElementById('ptWebsite').value,
      sourceUrl: window.location.href
    });

    const old = submit.textContent;
    submit.disabled = true;
    submit.textContent = 'SENDING REQUEST...';
    if (feedback) { feedback.className = 'pt-form-feedback'; feedback.textContent = ''; }

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
        body: payload.toString()
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) throw new Error(data.error || 'We could not submit your request.');
      form.reset();
      this.syncTrainingType();
      if (feedback) {
        feedback.className = 'pt-form-feedback success';
        feedback.innerHTML = data.emailStatus === 'sent'
          ? '<strong>Request received.</strong> Check your email for confirmation. Alliance will follow up to confirm coach availability and your exact 1-hour session time.'
          : '<strong>Request received.</strong> Your request was saved successfully. Alliance will follow up to confirm coach availability and your exact 1-hour session time.';
      }
      feedback && feedback.scrollIntoView({behavior:'smooth', block:'center'});
    } catch (err) {
      if (feedback) {
        feedback.className = 'pt-form-feedback error';
        feedback.textContent = err.message || 'We could not submit your request. Please contact info@alliancevbc.ca.';
      }
    } finally {
      submit.disabled = false;
      submit.textContent = old;
    }
  }
};

document.addEventListener('DOMContentLoaded', () => PrivateTrainingModule.init());
window.PrivateTrainingModule = PrivateTrainingModule;
