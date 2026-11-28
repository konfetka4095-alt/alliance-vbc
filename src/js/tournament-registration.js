/* Adult team registrations are separate from the athlete/parent registration wizard. */
(() => {
  const form = document.getElementById('avcTournamentForm');
  if (!form) return;
  const status = document.getElementById('avcTournamentStatus');
  const button = document.getElementById('avcTournamentSubmit');
  const endpoint = (window.ALLIANCE_REGISTRATION_CONFIG || {}).endpoint || '/api/register.php';
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const count = Number(data.get('playerCount'));
    if (!Number.isInteger(count) || count < 1 || count > 100) {
      status.textContent = 'Please enter a valid number of players.';
      return;
    }
    data.set('formType', 'adult-tournament-team');
    data.set('requestId', 'AVCT-' + (crypto.randomUUID ? crypto.randomUUID().replace(/-/g, '') : String(Date.now()) + Math.random().toString(36).slice(2)));
    // Honeypot is intentionally left empty.
    data.set('website', '');
    button.disabled = true;
    status.textContent = 'Submitting your team registration…';
    try {
      const response = await fetch(endpoint, {method: 'POST', body: data, credentials: 'same-origin'});
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || 'Could not save your team registration.');
      status.textContent = 'Registration received! Alliance will contact your team captain with next steps.';
      form.reset();
    } catch (error) {
      status.textContent = error.message || 'Registration could not be submitted. Please try again or email info@alliancevbc.ca.';
    } finally {
      button.disabled = false;
    }
  });
  function maybeScroll() {
    if (window.location.hash.includes('adult-programs?tournament')) {
      setTimeout(() => document.getElementById('adult-tournament-details')?.scrollIntoView({behavior:'smooth',block:'start'}), 200);
    }
  }
  window.addEventListener('hashchange', maybeScroll);
  maybeScroll();
})();
