// Sun today, live aurora, rocket launches, ISS ground track and alerts
// Part of Interactive Galaxy. Files load in number order and share one global scope.

/* ---------- #2 more live data ---------- */
// The Sun today (NASA SDO), shown in the Sun's card
const SDO=[['latest_1024_HMIIC.jpg','Visible light: today’s sunspots (SDO/HMI)'],['latest_1024_0171.jpg','Extreme ultraviolet: magnetic loops in the corona (SDO/AIA 171 Å)'],['latest_1024_0304.jpg','Helium light: flares and prominences (SDO/AIA 304 Å)'],['latest_1024_0193.jpg','Hot corona and coronal holes (SDO/AIA 193 Å)']];
const sunTodayHTML=()=>`<div class="sub">The Sun right now: NASA Solar Dynamics Observatory</div><div class="sdo">${SDO.map(([f,c])=>`<figure><img src="https://sdo.gsfc.nasa.gov/assets/img/latest/${f}" alt="${c}" loading="lazy" onerror="this.closest('figure').remove()"><figcaption>${c}</figcaption></figure>`).join('')}</div>`;
// Live aurora oval (NOAA SWPC OVATION model, refreshed every 15 min)
let aurLive=null,aurAt=null;
async function loadAurora(){const j=await getData('https://services.swpc.noaa.gov/json/ovation_aurora_latest.json');FEED['aurora (NOAA)']=!!j;feedMsg();if(!j||!j.coordinates)return;
 const pos=[],col=[];for(const[lo,la,v]of j.coordinates){if(v<4)continue;const lon=lo>180?lo-360:lo;for(let k=0;k<(v>30?3:v>12?2:1);k++){const h=ER*(1.012+Math.random()*.018),jit=.45;
  pos.push(...llLocal(la+(Math.random()-.5)*jit,lon+(Math.random()-.5)*jit*2,h).toArray());const t=Math.min(1,v/45);col.push(.25+.75*t*(v>35?1:.3),.55+.45*t,.35+.2*t)}}
 if(aurLive){earthMesh.remove(aurLive)}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));
 aurLive=new THREE.Points(g,new THREE.PointsMaterial({size:.05,map:dotTex,vertexColors:true,transparent:true,opacity:.75,blending:THREE.AdditiveBlending,depthWrite:false}));earthMesh.add(aurLive);
 (window.__aurStatic||[]).forEach(p=>p.visible=false);aurAt=j['Forecast Time']||j['Observation Time'];
 objects.filter(o=>o.id&&o.id.startsWith('aurora')).forEach(o=>{o.kind='Live aurora forecast · NOAA OVATION model';o.facts=[...o.facts.filter(f=>f[0]!=='Forecast for'),['Forecast for',new Date(aurAt).toLocaleString()]]})}
const aurImgHTML=o=>`<div class="sub">NOAA forecast map, updated every few minutes</div><div class="wide"><img src="https://services.swpc.noaa.gov/images/animations/ovation/${o.id==='aurora1'?'south':'north'}/latest.jpg" alt="NOAA aurora forecast map" loading="lazy" onerror="this.parentElement.previousElementSibling.remove();this.parentElement.remove()"></div>`;
// Upcoming rocket launches (Launch Library 2 by The Space Devs), pinned at their pads
let LAUNCHES=[];
async function loadLaunches(){let j=null;try{const c=JSON.parse(localStorage.getItem('galaxy.launches')||'null');if(c&&Date.now()-c.t<30*6e4)j=c.j}catch(e){}
 if(!j){j=await getData('https://ll.thespacedevs.com/2.3.0/launches/upcoming/?limit=12&mode=normal')||await getData('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=12&mode=normal');if(j)try{localStorage.setItem('galaxy.launches',JSON.stringify({t:Date.now(),j}))}catch(e){}}
 FEED['rocket launches']=!!j;feedMsg();if(!j||!j.results)return;
 const seen={};LAUNCHES=j.results.filter(l=>l.pad&&l.pad.latitude!=null).map((l,i)=>{const lat=+l.pad.latitude,lon=+l.pad.longitude,k=lat.toFixed(1)+lon.toFixed(1),n=seen[k]=(seen[k]||0)+1;
  const rocket=l.rocket?.configuration?.full_name||l.rocket?.configuration?.name||'Rocket',prov=l.launch_service_provider?.name||'',img=typeof l.image==='string'?l.image:l.image?.image_url,
  mis=l.mission?.name||l.name,net=Date.parse(l.net);
  return addMarker(lat+(n-1)*.15,lon,'#ffb347',.12,{id:'launch-'+i,name:l.name,kind:`Rocket launch · ${l.status?.name||'Scheduled'}`,net,photo:img,
   facts:[['Launch time',new Date(net).toLocaleString(undefined,{weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'})],['Rocket',rocket],['Launch provider',prov||'—'],['Pad',`${l.pad.name}${l.pad.location?.name?', '+l.pad.location.name:''}`],['Mission',mis],['Orbit',l.mission?.orbit?.name||'—']],
   desc:l.mission?.description||'An upcoming launch from the Launch Library 2 database. Launch times often shift, so check the countdown close to the day.',
   links:[['Search for a live stream ↗',`https://www.youtube.com/results?search_query=${encodeURIComponent(l.name+' launch live')}`,1],['Launch details ↗',`https://www.google.com/search?q=${encodeURIComponent(l.name+' launch')}`]]},'launch','launches')})}
const tminus=t=>{let d=Math.round((t-Date.now())/1000),sign=d<0?'T+ ':'T− ';d=Math.abs(d);const D=Math.floor(d/86400),H=Math.floor(d%86400/3600),M=Math.floor(d%3600/60),S=d%60;return sign+(D?D+' d ':'')+String(H).padStart(2,'0')+':'+String(M).padStart(2,'0')+':'+String(S).padStart(2,'0')};
// ISS ground track over Earth + overhead-pass alerts for your home
const issTrack=new THREE.Line(new THREE.BufferGeometry(),new THREE.LineBasicMaterial({color:0x5fe0b0,transparent:true,opacity:.75}));issTrack.frustumCulled=false;earthMesh.add(issTrack);let trackAt=-1e15;
function updateTrack(){const S=window.satellite,rec=SATS[0].satrec;if(!S||!rec){issTrack.visible=false;return}const pts=[];
 for(let k=-12;k<=190;k++){const d=new Date(simMs+k*30000),pv=S.propagate(rec,d);if(!pv.position)continue;const gd=S.eciToGeodetic(pv.position,S.gstime(d));pts.push(llLocal(gd.latitude/D2R,gd.longitude/D2R,ER*1.004))}
 issTrack.geometry.setFromPoints(pts);issTrack.visible=pts.length>1;trackAt=simMs}
function passList(o,from,days){const out=[];let cur=null;for(let t=from,end=from+days*864e5;t<end&&out.length<6;t+=20000){const l=issLook(o,t);if(!l)continue;
 if(l.el>0){if(!cur)cur={start:t,max:l.el,maxT:t,azS:l.az};if(l.el>cur.max){cur.max=l.el;cur.maxT=t}cur.azE=l.az}else if(cur){cur.end=t;if(cur.max>=10)out.push(cur);cur=null}}return out}
const compass=a=>['N','NE','E','SE','S','SW','W','NW'][Math.round(((a%360)+360)%360/45)%8];
let home=null;try{home=JSON.parse(localStorage.getItem('galaxy.home')||'null')}catch(e){}
function setHome(h){home=h;try{localStorage.setItem('galaxy.home',JSON.stringify(h))}catch(e){}homePasses=null;checkISS()}
let homePasses=null,homeAt=0,toastFor=null;
function checkISS(){if(!home||!SATS[0].satrec||!window.satellite){$('isshome').textContent=home?'':'';return}
 if(!homePasses||Date.now()-homeAt>20*6e4){homePasses=passList(home,Date.now()-15*6e4,2);homeAt=Date.now()}
 const now=Date.now(),next=homePasses.find(p=>p.end>now);if(!next){$('isshome').textContent=`ISS over ${home.name}: no good passes in the next 2 days.`;return}
 const f=t=>new Date(t).toLocaleString(undefined,{weekday:'short',hour:'numeric',minute:'2-digit'});
 $('isshome').textContent=`ISS over ${home.name}: next pass ${f(next.start)}, ${next.max.toFixed(0)}° high`;
 const mins=(next.start-now)/6e4;if(mins<=10&&toastFor!==next.start&&!toastDismissed[next.start]){toastFor=next.start;
  const dark=sunAltAt(home.lat,home.lon,next.maxT)<-6;showToast(now>=next.start?`The ISS is passing over you now. Look ${compass(next.azS)} → ${compass(next.azE)}, up to ${next.max.toFixed(0)}° high.${dark?'':' (Daylight, so it’s hard to see.)'}`:`The ISS rises in ${Math.max(1,Math.round(mins))} min. Look ${compass(next.azS)}, up to ${next.max.toFixed(0)}° high.${dark?' It should be easy to spot.':''}`,next.start)}}
const toastDismissed={};function showToast(t,key){$('toasttext').textContent=t;$('toast').hidden=false;$('toast').dataset.key=key}
$('toastx').onclick=()=>{toastDismissed[$('toast').dataset.key]=1;$('toast').hidden=true};
loadAurora();setInterval(loadAurora,15*6e4);loadLaunches();setInterval(checkISS,30000);
