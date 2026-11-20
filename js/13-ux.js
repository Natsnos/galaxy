// Loading screen, tour, shareable links, phone controls, true distances
// Part of Interactive Galaxy. Files load in number order and share one global scope.

/* ---------- #3 loading screen, tour, shareable links, phone controls, true distances ---------- */
let loaderHidden=false;function hideLoader(){if(loaderHidden)return;loaderHidden=true;$('loader').classList.add('done');setTimeout(()=>{$('loader').hidden=true;maybeTour()},650)}
setTimeout(hideLoader,9000);$('lsub').textContent='Loading planets and live data…';
const TOUR=[[null,'<b>Welcome to the live Solar System</b>Everything you see is in its real position right now. The LIVE clock drives the Sun, the planets, the Moon and Earth’s spin.'],
 ['#srch','<b>Search anything</b>Type an address, a place or a planet. Addresses fly you to the spot with real satellite imagery and a Google Maps view.'],
 [null,'<b>Explore</b>Drag to orbit and scroll or pinch to zoom. Click any planet, moon, star, satellite or marker for facts, live data and real photos.'],
 ['#ctl','<b>Control time</b>Pause, rewind or fast-forward up to a year per second. <i>Now</i> snaps back to live.'],
 ['#watchb','<b>Watch it move</b>Tap to speed up time for 25 seconds and watch planets, moons and Earth move, with glowing trails. Then it goes back to live.'],
 ['#funb','<b>Fun for kids</b>Collect passport stamps, find your weight and age on other planets, plan a trip, compare sizes and make postcards. <i>Kids mode</i> uses simpler words, and every card can be read aloud.'],
 ['#skyb','<b>Look up</b>Sky view shows tonight’s sky above any place. Events lists eclipses, meteor showers and rocket launches.'],
 ['#scaleb','<b>See the real distances</b>True distances spreads the planets out to their real spacing. Tap Tour any time to see this again.']];
let tourI=0;
function maybeTour(){let seen=false;try{seen=localStorage.getItem('galaxy.tour')==='done'}catch(e){}if(!seen&&!location.hash)startTour()}
function startTour(){tourI=0;$('tour').hidden=false;showTourStep()}
function showTourStep(){document.querySelectorAll('.hl').forEach(e=>e.classList.remove('hl'));$('ctl').classList.remove('open');const[sel,html]=TOUR[tourI];$('ttext').innerHTML=html;$('tstep').textContent=`${tourI+1} of ${TOUR.length}`;
 $('tback').hidden=tourI===0;$('tnext').textContent=tourI===TOUR.length-1?'Done':'Next';if(sel){const el=$(sel.slice(1));if(el){if(['#ctl','#watchb','#scaleb'].includes(sel))$('ctl').classList.add('open');el.classList.add('hl')}}}
function endTour(){$('tour').hidden=true;$('ctl').classList.remove('open');document.querySelectorAll('.hl').forEach(e=>e.classList.remove('hl'));try{localStorage.setItem('galaxy.tour','done')}catch(e){}}
$('tnext').onclick=()=>{if(tourI<TOUR.length-1){tourI++;showTourStep()}else endTour()};$('tback').onclick=()=>{if(tourI>0){tourI--;showTourStep()}};$('tskip').onclick=endTour;$('helpb').onclick=startTour;
$('ctltog').onclick=()=>{const o=$('ctl').classList.toggle('open');$('ctltog').setAttribute('aria-expanded',o)};
// shareable links: #mars, #io, #iss, #place-407128n-740060w-white-house, #sky, #events, #milky-way …
const slugId=id=>String(id).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
function slugOf(o){if(!o)return'';if(o.type==='events')return'events';if(o.type==='loc'){const f=x=>Math.round(Math.abs(x)*1e4);const nm=slugId(o.name||'').slice(0,40);return`place-${f(o.lat)}${o.lat<0?'s':'n'}-${f(o.lon)}${o.lon<0?'w':'e'}${nm&&nm!=='pinned-spot'?'-'+nm:''}`}return o.id?slugId(o.id):''}
let routing=false;
function setHash(h){if(routing)return;try{history.replaceState(null,'',h?'#'+h:location.pathname+location.search)}catch(e){}}
function route(){const h=decodeURIComponent(location.hash.slice(1));if(!h)return;routing=true;try{
 const pm=h.match(/^place-(\d+)([ns])-(\d+)([ew])(?:-(.+))?$/);
 if(pm){const lat=pm[1]/1e4*(pm[2]==='s'?-1:1),lon=pm[3]/1e4*(pm[4]==='w'?-1:1),nm=pm[5]?pm[5].replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase()):'Shared place';flyToPlace(nm,lat,lon,tzGuess(lon))}
 else if(h==='events')select(evObj);else if(h==='sky')openSky();
 else if({'solar-system':1,'nearby-stars':1,'milky-way':1}[h])setView({'solar-system':'solar','nearby-stars':'stars','milky-way':'galaxy'}[h]);
 else{const o=objects.find(x=>slugOf(x)===h);if(o)select(o)}}finally{routing=false}}
addEventListener('hashchange',route);setTimeout(route,600);
$('copylink').onclick=async()=>{const url=location.href;let ok=false;try{await navigator.clipboard.writeText(url);ok=true}catch(e){}
 $('copylink').textContent=ok?'Link copied':'Copy failed';if(!ok)$('llerr').textContent=url;setTimeout(()=>$('copylink').textContent='Copy link to this',2000)};
$('sethome').onclick=()=>{if(focus&&focus.type==='loc'){setHome({name:focus.name,lat:focus.lat,lon:focus.lon,tz:focus.tz});$('sethome').textContent='Saved as home'}};
// true distances
let trueScale=false;const RMAP_C=RMAP.map(x=>x.slice());
$('scaleb').onclick=()=>{trueScale=!trueScale;$('scaleb').classList.toggle('on',trueScale);
 RMAP.length=0;(trueScale?[[0,0],[1,39],[100,3900]]:RMAP_C).forEach(x=>RMAP.push(x.slice()));
 objects.find(o=>o.id==='belt').spin.scale.setScalar(trueScale?1.6:1);starGroup.scale.setScalar(trueScale?6:1);orbitAt=-1e15;
 VIEWS.solar.c=trueScale?[0,650,1750]:[0,90,210];VIEWS.stars.c=trueScale?[5000,8000,20000]:[900,1400,3600];
 showToast(trueScale?'True distances: the planets are now spaced like the real Solar System. They’re still drawn huge, because at true size even Jupiter would be a speck smaller than a pixel.':'Back to the compact view, with distances squeezed so everything fits.','scale');setTimeout(()=>{if($('toast').dataset.key==='scale')$('toast').hidden=true},9000);
 if(!focus)setView('solar')};
