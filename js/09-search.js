// Address and place search, Google Maps view
// Part of Interactive Galaxy. Files load in number order and share one global scope.

/* ---------- address & place search ---------- */
// Optional: paste a Google Maps Embed API key here for the official embed. Without one, the standard keyless embed is used.
const GOOGLE_MAPS_KEY='';
let mapType='k';
const liveOK=()=>Object.values(FEED).some(Boolean);
const gmapSrc=(o)=>GOOGLE_MAPS_KEY?`https://www.google.com/maps/embed/v1/${mapType==='k'||mapType==='h'?'view':'place'}?key=${GOOGLE_MAPS_KEY}&${mapType==='m'?'q='+encodeURIComponent(o.full||`${o.lat},${o.lon}`):`center=${o.lat},${o.lon}&zoom=19&maptype=satellite`}`
 :`https://maps.google.com/maps?q=${encodeURIComponent(o.full?o.full:`${o.lat},${o.lon}`)}&ll=${o.lat},${o.lon}&t=${mapType}&z=${o.full?19:15}&output=embed`;
function showMap(o){const box=$('mapbox');if(o.type!=='loc'||!liveOK()){box.hidden=true;return}box.hidden=false;$('gmap').src=gmapSrc(o);$('pic').hidden=true;$('photo').hidden=true;$('piccap').textContent='Google Maps · drag and zoom inside the map'}
document.querySelectorAll('[data-mt]').forEach(b=>b.onclick=()=>{mapType=b.dataset.mt;document.querySelectorAll('[data-mt]').forEach(x=>x.classList.toggle('on',x===b));if(focus&&focus.type==='loc')$('gmap').src=gmapSrc(focus)});
const tzGuess=lon=>{const h=Math.round(lon/15);return h===0?'UTC':`Etc/GMT${h>0?'-':'+'}${Math.abs(h)}`};
const shortName=r=>{const a=r.address||{},road=a.road?`${a.house_number?a.house_number+' ':''}${a.road}`:null,town=a.city||a.town||a.village||a.hamlet||a.county;return [...new Set([road||r.name||(r.display_name||'').split(',')[0],town].filter(Boolean))].join(', ')||r.display_name};
function goResult(r){$('results').innerHTML='';flyToPlace(shortName(r),+r.lat,+r.lon,tzGuess(+r.lon),{full:r.display_name})}
async function runSearch(text,errEl){text=text.trim();if(!text)return;errEl.textContent='';
 const m=text.match(/^\s*(-?\d+(?:\.\d+)?)\s*[, ]\s*(-?\d+(?:\.\d+)?)\s*$/);
 if(m){const lat=+m[1],lon=+m[2];if(Math.abs(lat)<=90&&Math.abs(lon)<=180){flyToPlace('Pinned spot',lat,lon,tzGuess(lon));return}}
 const t=text.toLowerCase(),obj=objects.find(o=>o.type!=='loc'&&o.name&&(o.name.toLowerCase()===t||o.name.toLowerCase().replace(/^the /,'')===t));if(obj){select(obj);return}
 const pre=PLACES.find(p=>p[0].toLowerCase()===t);if(pre){flyToPlace(...pre);return}
 errEl.textContent='Searching…';
 const res=await getData(`https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&accept-language=${encodeURIComponent(navigator.language||'en')}&q=${encodeURIComponent(text)}`);
 FEED['address search']=!!res;feedMsg();
 if(!res){errEl.innerHTML=`Address search works on your live site (GitHub Pages), not in this preview. <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(text)}" target="_blank" rel="noopener" style="color:var(--acc)">Open “${text.replace(/[<>&"]/g,'')}” in Google Maps ↗</a>`;return}
 if(!res.length){errEl.textContent='No match found. Try adding the city, state or country.';return}
 errEl.textContent='';goResult(res[0]);
 if(res.length>1){window.__res=res;$('results').innerHTML='<div class="sub">Other matches</div>'+res.slice(1).map((r,i)=>`<div class="ev" data-r="${i+1}"><div><b>${shortName(r).replace(/</g,'&lt;')}</b><span>${r.display_name.replace(/</g,'&lt;')}</span></div><button>Go</button></div>`).join('')}}
$('results').addEventListener('click',e=>{const d=e.target.closest('[data-r]');if(d&&window.__res)goResult(window.__res[+d.dataset.r])});
$('srch').onsubmit=e=>{e.preventDefault();const v=$('q').value.trim(),t=v.toLowerCase();if(!v)return;
 const isObj=objects.some(o=>o.type!=='loc'&&o.name&&(o.name.toLowerCase()===t||o.name.toLowerCase().replace(/^the /,'')===t));
 if(!isObj&&!(focus&&(focus.id==='earth'||focus.type==='loc')))select(earthO);$('ll').value=v;runSearch(v,$('llerr'))};
