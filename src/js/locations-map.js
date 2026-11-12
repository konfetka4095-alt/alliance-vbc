/* Alliance Locations — simple all-school map, no registration logic changes. */
(function () {
  'use strict';
  const VENUES = [{"id":"hollywood","school":"Hollywood Public School","address":"360 Hollywood Ave, North York, ON","lat":43.770225,"lng":-79.391908,"programs":[["Youth Volleyball Clinic · Grades 4–6","#programs"],["Small-Group Skill Sessions","#programs"]]},{"id":"st-gabriel","school":"St. Gabriel Catholic School","address":"396 Spring Garden Ave, North York, ON","lat":43.769,"lng":-79.389,"programs":[["House League · Grades 5–8","#programs"]]},{"id":"bayview","school":"Bayview Middle School","address":"25 Bunty Lane, North York, ON","lat":43.775871,"lng":-79.385473,"programs":[["Bayview Winter Volleyball","#programs"]]},{"id":"moraine","school":"Moraine Hills Public School","address":"85 Rollinghill Rd, Richmond Hill, ON","lat":43.9100496653,"lng":-79.45451915,"programs":[["Youth Volleyball Clinic · Grades 4–6","#programs"]]},{"id":"richmond-rose","school":"Richmond Rose Public School","address":"160 Frank Endean Rd, Richmond Hill, ON","lat":43.8847106153,"lng":-79.41278085,"programs":[["Youth Volleyball Clinic · Grades 4–6","#programs"]]},{"id":"pleasantville","school":"Pleasantville Primary School","address":"400 Mill St, Richmond Hill, ON","lat":43.8741289153,"lng":-79.4601716,"programs":[["House League · Grades 7–9","#programs"]]},{"id":"st-anthony","school":"St. Anthony Catholic School","address":"141 Kirk Dr, Thornhill, ON","lat":43.8290903152,"lng":-79.4153323,"programs":[["15+ & Adult Volleyball Clinic","#adult-programs"]]}];
  const panel = document.getElementById('view-locations');
  const canvas = document.getElementById('alliance-locations-map');
  const fallback = document.getElementById('alliance-locations-map-fallback');
  if (!panel || !canvas) return;
  let map = null;
  const pins = new Map();
  let retryCount = 0;
  function directions(v) {
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(v.school + ', ' + v.address + ', Canada');
  }
  function popup(v) {
    const shell = document.createElement('div'); shell.className = 'avc-map-popup';
    const heading = document.createElement('strong'); heading.textContent = v.school; shell.append(heading);
    const address = document.createElement('small'); address.textContent = v.address; shell.append(address);
    const list = document.createElement('ul');
    v.programs.forEach(([name]) => { const item = document.createElement('li'); item.textContent = name; list.append(item); });
    shell.append(list);
    const link = document.createElement('a'); link.href = directions(v); link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = 'Directions ↗'; shell.append(link);
    return shell;
  }
  function fit() {
    if (!map) return;
    map.invalidateSize();
    const bounds = window.L.latLngBounds(VENUES.map(v => [v.lat, v.lng]));
    map.fitBounds(bounds, { padding: [28, 28], maxZoom: 12 });
  }
  function highlight(id) {
    panel.querySelectorAll('.avc-venue-card').forEach(card => card.classList.toggle('is-selected', card.dataset.venueId === id));
  }
  function initMap() {
    if (!panel.classList.contains('active-view')) return;
    if (!window.L) {
      if (retryCount++ < 12) window.setTimeout(initMap, 400);
      else fallback.hidden = false;
      return;
    }
    fallback.hidden = true;
    if (map) { window.requestAnimationFrame(fit); return; }
    map = window.L.map(canvas, {scrollWheelZoom:false, zoomControl:true}).setView([43.83,-79.42],11);
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19, attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    const dot = window.L.divIcon({className:'avc-pin',html:'<span aria-hidden="true"></span>',iconSize:[23,23],iconAnchor:[11,11]});
    VENUES.forEach(v => {
      const marker = window.L.marker([v.lat,v.lng], {icon:dot,title:v.school,keyboard:true}).addTo(map);
      marker.bindPopup(popup(v), {maxWidth:280,minWidth:200});
      marker.on('click', () => highlight(v.id));
      pins.set(v.id,marker);
    });
    window.requestAnimationFrame(fit);
  }
  document.querySelectorAll('#view-locations [data-focus-venue]').forEach(button => {
    button.addEventListener('click', () => {
      const venue = VENUES.find(v=>v.id===button.dataset.focusVenue);
      if (!venue) return;
      initMap();
      if (!map) return;
      map.flyTo([venue.lat,venue.lng], Math.max(map.getZoom(),14), {duration:.45});
      pins.get(venue.id).openPopup();
      highlight(venue.id);
      canvas.scrollIntoView({behavior:'smooth',block:'center'});
    });
  });
  function onRoute() { if (window.location.hash === '#locations') window.setTimeout(initMap, 50); }
  window.addEventListener('hashchange', onRoute);
  document.addEventListener('DOMContentLoaded', onRoute);
})();
