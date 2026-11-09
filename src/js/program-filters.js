/* Alliance program finder: synchronized list and Google Maps location preview */
(function () {
  'use strict';
  function init() {
    const panel=document.getElementById('view-programs'), finder=document.getElementById('program-finder');
    if (!panel || !finder) return;
    const location=document.getElementById('program-location-filter');
    const type=document.getElementById('program-type-filter');
    const search=document.getElementById('program-search-filter');
    const count=document.getElementById('program-filter-count');
    const empty=document.getElementById('program-filter-empty');
    const listButton=document.getElementById('program-list-view');
    const mapButton=document.getElementById('program-map-view');
    const mapPanel=document.getElementById('program-map-panel');
    const mapSelect=document.getElementById('program-map-select');
    const frame=document.getElementById('program-map-frame');
    const directions=document.getElementById('program-map-directions');
    const cards=Array.from(panel.querySelectorAll('.program-detail-card'));
    let view='list';
    function googleLink(place) { return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(place); }
    function updateMap(visibleCards) {
      const last=mapSelect.value;
      const venues=new Map();
      visibleCards.forEach(card=>{
        const place=card.dataset.mapPlace;
        if (!place) return;
        const name=place.split(',')[0].trim();
        if (!venues.has(place)) venues.set(place,name);
      });
      mapSelect.replaceChildren();
      venues.forEach((name,place)=>{const option=document.createElement('option');option.value=place;option.textContent=name;mapSelect.appendChild(option);});
      if (venues.has(last)) mapSelect.value=last;
      const place=mapSelect.value;
      if (place) {
        frame.src='https://maps.google.com/maps?output=embed&q='+encodeURIComponent(place);
        directions.href=googleLink(place);
        frame.hidden=false; directions.hidden=false;
      } else {frame.removeAttribute('src');frame.hidden=true;directions.hidden=true;}
    }
    function showView(next) {
      view=next;
      mapPanel.hidden=view!=='map';
      listButton.classList.toggle('is-selected',view==='list');
      mapButton.classList.toggle('is-selected',view==='map');
      listButton.setAttribute('aria-pressed',String(view==='list'));
      mapButton.setAttribute('aria-pressed',String(view==='map'));
      cards.forEach(card=>{if(card.dataset.filterMatch==='true')card.hidden=view==='map';});
    }
    function apply() {
      const loc=location.value, kind=type.value, term=search.value.trim().toLowerCase();
      const visible=cards.filter(card=>{
        const match=(loc==='all'||card.dataset.programLocation===loc) && (kind==='all'||card.dataset.programCat===kind) && (!term||card.textContent.toLowerCase().includes(term));
        card.dataset.filterMatch=String(match);card.hidden=!match||view==='map';return match;
      });
      count.textContent=visible.length+' program'+(visible.length===1?'':'s')+' found';
      empty.hidden=visible.length!==0;
      updateMap(visible);
    }
    function reset(){location.value='all';type.value='all';search.value='';apply();}
    [location,type].forEach(el=>el.addEventListener('change',apply));
    search.addEventListener('input',apply);
    document.getElementById('program-filter-reset').addEventListener('click',reset);
    document.getElementById('program-filter-empty-reset').addEventListener('click',reset);
    listButton.addEventListener('click',()=>{showView('list');apply();});
    mapButton.addEventListener('click',()=>{showView('map');apply();});
    mapSelect.addEventListener('change',()=>{
      const place=mapSelect.value;
      if(place){frame.src='https://maps.google.com/maps?output=embed&q='+encodeURIComponent(place);directions.href=googleLink(place);}
    });
    apply();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
