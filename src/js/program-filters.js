/* Alliance program explorer — shared map/list filters, multiple school pins */
(function () {
  'use strict';
  // Coordinates for known school locations; each place is keyed by its public address.
  // St. Gabriel is approximate until its exact building centroid is confirmed.
  const PLACES = [
    {match:'St. Gabriel Catholic School',name:'St. Gabriel Catholic School',lat:43.7695,lng:-79.3897},
    {match:'Hollywood Public School',name:'Hollywood Public School',lat:43.770225,lng:-79.391908},
    {match:'Bayview Middle School',name:'Bayview Middle School',lat:43.775871,lng:-79.385473},
    {match:'Moraine Hills Public School',name:'Moraine Hills Public School',lat:43.9100496653,lng:-79.45451915},
    {match:'Pleasantville Primary School',name:'Pleasantville Primary School',lat:43.8741289153,lng:-79.4601716},
    {match:'Richmond Rose Public School',name:'Richmond Rose Public School',lat:43.8847106153,lng:-79.41278085}
  ];
  function init(){
    const panel=document.getElementById('view-programs'),finder=document.getElementById('program-finder');
    if(!panel||!finder)return;
    const location=document.getElementById('program-location-filter'),type=document.getElementById('program-type-filter'),search=document.getElementById('program-search-filter');
    const count=document.getElementById('program-filter-count'),empty=document.getElementById('program-filter-empty');
    const listButton=document.getElementById('program-list-view'),mapButton=document.getElementById('program-map-view'),mapPanel=document.getElementById('program-map-panel');
    const closeButton=document.getElementById('program-map-close'),bottomClose=document.getElementById('program-map-bottom-close'),fitButton=document.getElementById('program-map-fit');
    const list=document.getElementById('program-map-location-list'),venueCount=document.getElementById('program-map-venue-count'),error=document.getElementById('program-map-load-error');
    const cards=Array.from(panel.querySelectorAll('.program-detail-card'));
    let view='list',map=null,markers=[],visibleCards=[];
    function title(card){return card.querySelector('h2')?.textContent.trim()||'Volleyball program';}
    function rows(card){return Array.from(card.querySelectorAll('.meta-row')).reduce((out,row)=>{const k=row.querySelector('.meta-label')?.textContent.trim().toLowerCase(),v=row.querySelector('.meta-val')?.textContent.trim();if(k&&v)out[k]=v;return out;},{});}
    function pinData(){
      const groups=new Map();
      visibleCards.forEach(card=>{const address=card.dataset.mapPlace;if(!address)return;
        const config=PLACES.find(item=>address.startsWith(item.match));if(!config)return;
        if(!groups.has(config.match))groups.set(config.match,{...config,address,cards:[]});
        groups.get(config.match).cards.push(card);
      });
      return Array.from(groups.values());
    }
    function directions(place){return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(place.address);}
    function action(text,cls,callback){const b=document.createElement('button');b.type='button';b.className=cls;b.textContent=text;b.addEventListener('click',callback);return b;}
    function backToList(focusCard){
      view='list';mapPanel.hidden=true;listButton.classList.add('is-selected');mapButton.classList.remove('is-selected');
      listButton.setAttribute('aria-pressed','true');mapButton.setAttribute('aria-pressed','false');
      apply();
      if(focusCard){focusCard.scrollIntoView({behavior:'smooth',block:'center'});focusCard.classList.add('program-map-target');window.setTimeout(()=>focusCard.classList.remove('program-map-target'),2200);}
      else{listButton.focus();}
    }
    function buildProgramLine(card){
      const m=rows(card),row=document.createElement('div');row.className='program-pin-program';
      const heading=document.createElement('strong');heading.textContent=title(card);row.appendChild(heading);
      const detail=document.createElement('span');detail.textContent=[m.schedule,m.fee].filter(Boolean).join(' · ');row.appendChild(detail);
      row.appendChild(action('View program →','program-pin-action',()=>backToList(card)));
      return row;
    }
    function makeDetails(place){
      const box=document.createElement('div');box.className='program-pin-details';
      const heading=document.createElement('strong');heading.className='program-pin-place';heading.textContent=place.name;box.appendChild(heading);
      const address=document.createElement('small');address.textContent=place.address.split(',').slice(1).join(',').trim();box.appendChild(address);
      place.cards.forEach(card=>box.appendChild(buildProgramLine(card)));
      const link=document.createElement('a');link.className='program-pin-directions';link.href=directions(place);link.target='_blank';link.rel='noopener noreferrer';link.textContent='Directions ↗';box.appendChild(link);
      return box;
    }
    function focusPlace(place){
      const item=markers.find(x=>x.place.match===place.match);
      if(item&&map){map.flyTo([place.lat,place.lng],Math.max(map.getZoom(),14),{duration:.5});item.marker.openPopup();}
      list.querySelectorAll('.program-map-location').forEach(node=>node.classList.toggle('is-current',node.dataset.school===place.match));
    }
    function renderLocations(groups){
      list.replaceChildren();venueCount.textContent=groups.length+' schools';
      if(groups.length===0){const msg=document.createElement('p');msg.className='program-map-no-results';msg.textContent='No matching schools. Try clearing your filters.';list.appendChild(msg);return;}
      groups.forEach(place=>{
        const wrapper=document.createElement('div');wrapper.className='program-map-location';wrapper.dataset.school=place.match;
        const btn=action(place.name,'program-location-choose',()=>focusPlace(place));
        const counter=document.createElement('span');counter.className='program-location-count';counter.textContent=place.cards.length+' program'+(place.cards.length!==1?'s':'');btn.appendChild(counter);wrapper.appendChild(btn);
        const programs=document.createElement('div');programs.className='program-location-mini';
        place.cards.forEach(card=>programs.appendChild(buildProgramLine(card)));
        wrapper.appendChild(programs);list.appendChild(wrapper);
      });
    }
    function fitMarkers(){if(!map)return;if(markers.length>1){map.fitBounds(window.L.latLngBounds(markers.map(x=>x.marker.getLatLng())),{padding:[34,34],maxZoom:12});}else if(markers.length===1){map.setView(markers[0].marker.getLatLng(),14);}else map.setView([43.825,-79.420],11);}
    function renderMap(){
      const groups=pinData();renderLocations(groups);
      if(view!=='map')return;
      if(!window.L){error.hidden=false;return;}
      error.hidden=true;
      if(!map){
        map=window.L.map('program-locations-map',{scrollWheelZoom:false,zoomControl:true}).setView([43.825,-79.42],11);
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'}).addTo(map);
      }
      markers.forEach(x=>map.removeLayer(x.marker));markers=[];
      const icon=window.L.divIcon({className:'avc-map-icon',html:'<span aria-hidden="true"></span>',iconSize:[24,30],iconAnchor:[12,29]});
      groups.forEach(place=>{
        const marker=window.L.marker([place.lat,place.lng],{icon,title:place.name,keyboard:true}).addTo(map);
        marker.bindPopup(makeDetails(place),{maxWidth:290,minWidth:235,autoPanPadding:[18,18]});
        marker.on('click',()=>focusPlace(place));markers.push({place,marker});
      });
      window.requestAnimationFrame(()=>{map.invalidateSize();fitMarkers();});
    }
    function apply(){
      const loc=location.value,kind=type.value,term=search.value.trim().toLowerCase();
      visibleCards=cards.filter(card=>{
        const match=(loc==='all'||card.dataset.programLocation===loc)&&(kind==='all'||card.dataset.programCat===kind)&&(!term||card.textContent.toLowerCase().includes(term));
        card.dataset.filterMatch=String(match);card.hidden=!match||view==='map';return match;
      });
      count.textContent=visibleCards.length+' program'+(visibleCards.length===1?'':'s')+' found';empty.hidden=visibleCards.length!==0;
      renderMap();
    }
    function showMap(){
      view='map';mapPanel.hidden=false;mapButton.classList.add('is-selected');listButton.classList.remove('is-selected');
      listButton.setAttribute('aria-pressed','false');mapButton.setAttribute('aria-pressed','true');
      apply();mapPanel.scrollIntoView({behavior:'smooth',block:'start'});
    }
    function reset(){location.value='all';type.value='all';search.value='';apply();}
    [location,type].forEach(el=>el.addEventListener('change',apply));search.addEventListener('input',apply);
    document.getElementById('program-filter-reset').addEventListener('click',reset);
    document.getElementById('program-filter-empty-reset').addEventListener('click',reset);
    listButton.addEventListener('click',()=>backToList());mapButton.addEventListener('click',showMap);
    closeButton.addEventListener('click',()=>backToList());bottomClose.addEventListener('click',()=>backToList());fitButton.addEventListener('click',fitMarkers);
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&view==='map')backToList();});
    // Support visitors who enter map mode before the CDN finishes loading.
    let attempts=0;const retry=()=>{if(view!=='map'||map||window.L||attempts++>12){if(view==='map'&&window.L&&!map)renderMap();return;}window.setTimeout(retry,500);};
    mapButton.addEventListener('click',retry);
    apply();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
