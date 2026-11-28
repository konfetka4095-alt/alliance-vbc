/* Adult team registrations: match Alliance's existing four-step registration wizard. */
(() => {
  const modal = document.getElementById('tournamentRegistrationModal');
  const form = document.getElementById('avcTournamentForm');
  if (!modal || !form) return;
  const $ = id => document.getElementById(id);
  const status = $('avcTournamentStatus');
  const submit = $('avcTournamentSubmit');
  const next = $('tourneyNext');
  const prev = $('tourneyPrev');
  const actions = $('tourneyWizardActions');
  const panes = [...modal.querySelectorAll('[data-tourney-step]')];
  const indicators = [...modal.querySelectorAll('#tourneySteps .reg-step-indicator')];
  const endpoint = (window.ALLIANCE_REGISTRATION_CONFIG || {}).endpoint || '/api/register.php';
  let step = 1, sending = false, previousFocus = null;
  function fieldsForStep(n) { return n === 2 ? ['tourneyTeamName','tourneyPlayerCount'] : n === 3 ? ['tourneyContact','tourneyEmail','tourneyPhone'] : []; }
  function validStep(n) {
    for (const id of fieldsForStep(n)) {
      const field = $(id);
      if (!field.checkValidity()) { field.reportValidity(); field.focus(); return false; }
    }
    return true;
  }
  function review() {
    const entries = [
      ['Event','Adult Volleyball Tournament'], ['Date','December 19, 2026'],
      ['Team', $('tourneyTeamName').value.trim()], ['Number of players',$('tourneyPlayerCount').value],
      ['Team contact',$('tourneyContact').value.trim()],['Email',$('tourneyEmail').value.trim()],
      ['Phone',$('tourneyPhone').value.trim()],['Notes',$('tourneyNotes').value.trim() || '—']
    ];
    const box = $('tourneyReview'); box.replaceChildren();
    entries.forEach(([label,value]) => {
      const row = document.createElement('div'); row.className = 'meta-row';
      const a = document.createElement('span'); a.className='meta-label'; a.textContent=label;
      const b = document.createElement('span'); b.className='meta-val'; b.textContent=value;
      row.append(a,b); box.append(row);
    });
  }
  function display(n) {
    step = n;
    panes.forEach(p => { p.hidden = Number(p.dataset.tourneyStep) !== n; });
    indicators.forEach((el,i) => { el.classList.toggle('active',i === n-1); el.classList.toggle('completed',i<n-1); });
    $('tourneySteps').hidden = n === 5;
    actions.hidden = n === 5;
    $('tourneyDoneWrap').hidden = n !== 5;
    prev.hidden = n === 1 || n === 5;
    next.hidden = n >= 4;
    submit.hidden = n !== 4;
    if (n === 4) review();
    status.textContent = '';
    modal.querySelector('.modal-container').scrollTop=0;
  }
  function open() {
    previousFocus = document.activeElement;
    form.reset(); sending=false; submit.disabled=false;
    display(1);
    modal.classList.add('open'); modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    $('tourneyModalClose').focus();
  }
  function close() {
    if(sending) return;
    modal.classList.remove('open'); modal.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
    if(previousFocus && typeof previousFocus.focus==='function') previousFocus.focus();
  }
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-open-tournament],.avc-event-spotlight-action');
    if(!trigger) return;
    event.preventDefault();
    if(window.RouterModule && window.RouterModule.navigate) window.RouterModule.navigate('adult-programs');
    else window.location.hash='#adult-programs';
    open();
  });
  $('tourneyModalClose').addEventListener('click',close);
  $('tourneyDone').addEventListener('click',close);
  modal.addEventListener('click',event => {if(event.target===modal) close();});
  document.addEventListener('keydown',event => {if(event.key==='Escape' && modal.classList.contains('open')) close();});
  next.addEventListener('click',() => {if(validStep(step)) display(Math.min(step+1,4));});
  prev.addEventListener('click',() => display(Math.max(step-1,1)));
  form.addEventListener('submit',async event => {
    event.preventDefault();
    if(sending || !validStep(2) || !validStep(3)) return;
    const data = new FormData(form), count=Number(data.get('playerCount'));
    if(!Number.isInteger(count) || count<1 || count>100) { status.textContent='Enter a valid number of players.'; return; }
    data.set('formType','adult-tournament-team');
    data.set('requestId','AVCT-' + (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID().replace(/-/g,'') : String(Date.now())+Math.random().toString(36).slice(2)));
    data.set('website','');
    sending=true; submit.disabled=true; submit.textContent='Submitting…'; status.textContent='Submitting your team registration…';
    try {
      const response=await fetch(endpoint,{method:'POST',body:data,credentials:'same-origin'});
      const result=await response.json();
      if(!response.ok || !result.ok) throw new Error(result.error || 'Could not save the registration.');
      sending=false; display(5);
    } catch(error) {
      status.textContent=error.message || 'Registration could not be submitted. Please try again or contact info@alliancevbc.ca.';
    } finally {
      sending=false;submit.disabled=false;submit.textContent='Complete Registration ✓';
    }
  });
  // Support links copied/shared from previous releases.
  function legacyHash() {
    if(location.hash.includes('adult-programs?tournament-register')) {
      if(window.RouterModule && window.RouterModule.navigate) window.RouterModule.navigate('adult-programs');
      open();
    }
  }
  window.addEventListener('hashchange',legacyHash);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',legacyHash); else legacyHash();
})();
