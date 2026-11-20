// Sky view (star chart) and Events (eclipses, meteor showers)
// Part of Interactive Galaxy. Files load in number order and share one global scope.

/* ---------- sky view (what you'd see looking up) ---------- */
const CONST=[
 {n:'Orion',s:[[88.79,7.41,.5],[81.28,6.35,1.6],[85.19,-1.94,1.8],[84.05,-1.2,1.7],[83.0,-.3,2.2],[86.94,-9.67,2.1],[78.63,-8.2,.1]],l:[[0,1],[0,2],[1,4],[2,3],[3,4],[2,5],[4,6]]},
 {n:'Big Dipper',s:[[165.93,61.75,1.8],[165.46,56.38,2.4],[178.46,53.69,2.4],[183.86,57.03,3.3],[193.51,55.96,1.8],[200.98,54.93,2.2],[206.89,49.31,1.9]],l:[[0,1],[1,2],[2,3],[3,0],[3,4],[4,5],[5,6]]},
 {n:'Cassiopeia',s:[[2.29,59.15,2.3],[10.13,56.54,2.2],[14.18,60.72,2.4],[21.45,60.24,2.7],[28.6,63.67,3.4]],l:[[0,1],[1,2],[2,3],[3,4]]},
 {n:'Cygnus',s:[[310.36,45.28,1.3],[305.56,40.26,2.2],[292.68,27.96,3.1],[311.55,33.97,2.5],[296.24,45.13,2.9]],l:[[0,1],[1,2],[3,1],[1,4]]},
 {n:'Leo',s:[[152.09,11.97,1.4],[154.99,19.84,2.0],[168.53,20.52,2.6],[177.26,14.57,2.1],[168.56,15.43,3.3]],l:[[0,1],[1,2],[2,3],[3,4],[4,0]]},
 {n:'Scorpius',s:[[240.08,-22.62,2.3],[247.35,-26.43,1.0],[252.54,-34.29,2.3],[264.33,-43.0,1.9],[263.4,-37.1,1.6]],l:[[0,1],[1,2],[2,3],[3,4]]},
 {n:'Southern Cross',s:[[186.65,-63.1,.8],[191.93,-59.69,1.3],[187.79,-57.11,1.6],[183.79,-58.75,2.8]],l:[[0,2],[1,3]]},
 {n:'Gemini',s:[[113.65,31.89,1.6],[116.33,28.03,1.1]],l:[[0,1]]},
 {n:'Summer Triangle',s:[[279.23,38.78,0],[310.36,45.28,1.3],[297.7,8.87,.8]],l:[[0,1],[1,2],[2,0]],faint:true}];
const BRIGHT=[['Sirius',101.29,-16.72,-1.5],['Canopus',95.99,-52.7,-.7],['Arcturus',213.92,19.18,-.05],['Vega',279.23,38.78,0],['Capella',79.17,46.0,.1],['Rigel',78.63,-8.2,.1],['Procyon',114.83,5.22,.4],['Betelgeuse',88.79,7.41,.5],['Altair',297.7,8.87,.8],['Aldebaran',68.98,16.51,.9],['Antares',247.35,-26.43,1.0],['Spica',201.3,-11.16,1.0],['Pollux',116.33,28.03,1.1],['Fomalhaut',344.41,-29.62,1.2],['Deneb',310.36,45.28,1.3],['Regulus',152.09,11.97,1.4],['Polaris',37.95,89.26,2.0],['Achernar',24.43,-57.24,.5],['α Centauri',219.9,-60.83,-.3],['Pleiades',56.75,24.12,1.6]];
const eclRD=v=>{const x=v[0],y=v[1]*cE-v[2]*sE,z=v[1]*sE+v[2]*cE;return[Math.atan2(y,x)/D2R,Math.asin(z/Math.hypot(x,y,z))/D2R]};
const gmst=ms=>((280.46061837+360.98564736629*dJ(ms))%360+360)%360;
function altaz(ra,dec,lat,lon,ms){const H=(gmst(ms)+lon-ra)*D2R,f=lat*D2R,d=dec*D2R;const alt=Math.asin(Math.sin(f)*Math.sin(d)+Math.cos(f)*Math.cos(d)*Math.cos(H));
 const az=Math.atan2(-Math.cos(d)*Math.sin(H),Math.sin(d)*Math.cos(f)-Math.cos(d)*Math.sin(f)*Math.cos(H));return[alt/D2R,(az/D2R+360)%360]}
function sunAltAt(lat,lon,ms){const E=helio('earth',ms),[ra,de]=eclRD([-E[0],-E[1],-E[2]]);return altaz(ra,de,lat,lon,ms)[0]}
let skyLoc={name:'New York',lat:40.7128,lon:-74.006,tz:'America/New_York'};
function openSky(loc){if(loc)skyLoc=loc;$('sky').hidden=false;drawSky()}
$('skyb').onclick=()=>{setHash('sky');openSky(locO.lat!==undefined?{name:locO.name,lat:locO.lat,lon:locO.lon,tz:locO.tz}:null)};
$('skyhere').onclick=()=>openSky(locO.lat!==undefined&&focus===locO?{name:locO.name,lat:locO.lat,lon:locO.lon,tz:locO.tz}:null);
$('skyx').onclick=()=>{$('sky').hidden=true;setHash(focus?slugOf(focus):'')};
function geolocate(cb){if(!navigator.geolocation){cb(null);return}navigator.geolocation.getCurrentPosition(p=>cb([p.coords.latitude,p.coords.longitude]),()=>cb(null),{timeout:10000})}
const myTZ=Intl.DateTimeFormat().resolvedOptions().timeZone;
$('skyme').onclick=()=>geolocate(p=>{if(p)openSky({name:'your location',lat:p[0],lon:p[1],tz:myTZ});else $('skysub').textContent='Location access isn’t available here. Pick a place on Earth and choose “Sky view from here”.'});
$('myloc').onclick=()=>geolocate(p=>{if(p){$('llerr').textContent='';flyToPlace('Your location',p[0],p[1],myTZ);setHome({name:'your home',lat:p[0],lon:p[1],tz:myTZ})}else $('llerr').textContent='Location access isn’t available in this view. Type your latitude and longitude instead.'});
function drawSky(){const cv=$('skyc'),dpr=Math.min(devicePixelRatio,2),W=cv.clientWidth,H=cv.clientHeight;if(!W||!H)return;cv.width=W*dpr;cv.height=H*dpr;const g=cv.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);
 const{lat,lon}=skyLoc,ms=simMs,R=Math.min(W,H)/2-26,cx=W/2,cy=H/2,sa=sunAltAt(lat,lon,ms);
 const P=(alt,az)=>{const r=(90-alt)/90*R;return[cx-r*Math.sin(az*D2R),cy-r*Math.cos(az*D2R)]};
 g.fillStyle='#02040a';g.fillRect(0,0,W,H);const t=Math.max(0,Math.min(1,(sa+12)/18));const gr=g.createRadialGradient(cx,cy,0,cx,cy,R);
 gr.addColorStop(0,`rgb(${8+t*60|0},${14+t*110|0},${34+t*170|0})`);gr.addColorStop(1,`rgb(${14+t*120|0},${22+t*140|0},${44+t*170|0})`);g.fillStyle=gr;g.beginPath();g.arc(cx,cy,R,0,7);g.fill();
 g.strokeStyle='rgba(255,255,255,.12)';g.lineWidth=1;for(const a of[30,60]){g.beginPath();g.arc(cx,cy,(90-a)/90*R,0,7);g.stroke()}
 g.font='600 15px "Space Grotesk",sans-serif';g.fillStyle='#ffb347';g.textAlign='center';g.textBaseline='middle';[['N',0],['E',90],['S',180],['W',270]].forEach(([l,az])=>{const r=R+14;g.fillText(l,cx-r*Math.sin(az*D2R),cy-r*Math.cos(az*D2R))});
 const starA=1-t*.85;g.font='12px "Space Grotesk",sans-serif';
 for(const c of CONST){const pts=c.s.map(([ra,de])=>altaz(ra,de,lat,lon,ms));g.strokeStyle=`rgba(140,170,255,${(c.faint?.18:.4)*starA})`;g.lineWidth=1.2;
  for(const[a,b]of c.l){if(pts[a][0]<-2&&pts[b][0]<-2)continue;g.beginPath();g.moveTo(...P(...pts[a]));g.lineTo(...P(...pts[b]));g.stroke()}
  if(!c.faint){const v=pts.filter(p=>p[0]>5);if(v.length){const[x,y]=P(v[0][0],v[0][1]);g.fillStyle=`rgba(150,180,255,${.75*starA})`;g.fillText(c.n,x,y+16)}}
  for(const[i,[al,az]]of pts.entries())if(al>0){const[x,y]=P(al,az),m=c.s[i][2];g.fillStyle=`rgba(255,255,255,${starA})`;g.beginPath();g.arc(x,y,Math.max(1,3.2-m*.8),0,7);g.fill()}}
 for(const[n,ra,de,m]of BRIGHT){const[al,az]=altaz(ra,de,lat,lon,ms);if(al<0)continue;const[x,y]=P(al,az);g.fillStyle=`rgba(255,250,235,${starA})`;g.beginPath();g.arc(x,y,Math.max(1.2,3.6-m*.9),0,7);g.fill();if(m<1.2){g.fillStyle=`rgba(220,225,240,${.8*starA})`;g.fillText(n,x,y-11)}}
 const E=HP.earth,list=[['Sun',[-E[0],-E[1],-E[2]],'#ffcc33',11],['Moon',moonNow.v,'#f0eee6',9]];
 for(const p of['mercury','venus','mars','jupiter','saturn','uranus','neptune'])list.push([p[0].toUpperCase()+p.slice(1),sub3(HP[p],E),{mercury:'#c9c0b8',venus:'#fff3c4',mars:'#ff8a5c',jupiter:'#f2dcb5',saturn:'#f0dc9c',uranus:'#a9e3e8',neptune:'#7fa8ff'}[p],p==='venus'||p==='jupiter'?5:4]);
 g.font='600 13px "Space Grotesk",sans-serif';let up=[];
 for(const[n,v,col,sz]of list){const[ra,de]=eclRD(v),[al,az]=altaz(ra,de,lat,lon,ms);if(al<-0.5)continue;up.push(n);const[x,y]=P(al,az);
  if(n==='Sun'){const s=g.createRadialGradient(x,y,0,x,y,30);s.addColorStop(0,'#fff');s.addColorStop(.3,'#ffcc33');s.addColorStop(1,'rgba(255,200,50,0)');g.fillStyle=s;g.beginPath();g.arc(x,y,30,0,7);g.fill()}
  else{g.fillStyle=col;g.beginPath();g.arc(x,y,sz,0,7);g.fill()}
  g.fillStyle=col;g.fillText(n==='Moon'?`Moon (${moonPhase()[1].toFixed(0)}% lit)`:n,x,y+sz+12)}
 const iss=SATS[0];if(iss.satrec&&window.satellite){const la=issLook(skyLoc,ms);if(la&&la.el>0){const[x,y]=P(la.el,la.az);g.fillStyle='#7dffc4';g.beginPath();g.arc(x,y,4,0,7);g.fill();g.fillText('ISS',x,y-12);up.push('ISS')}}
 let tstr;try{tstr=new Date(ms).toLocaleString(undefined,{timeZone:skyLoc.tz||'UTC',weekday:'short',hour:'numeric',minute:'2-digit',timeZoneName:'short'})}catch(_){tstr=new Date(ms).toUTCString()}
 $('skyloc').textContent=skyLoc.name;$('skysub').textContent=`${tstr} · ${sa>0?'Daytime':sa>-6?'Civil twilight':sa>-18?'Twilight':'Dark sky'} · Above the horizon: ${up.join(', ')||'—'}. Hold it overhead: north at the top, east on the left.`}

/* ---------- sky events: eclipses (NASA / Espenak) and meteor showers ---------- */
const ECLIPSES=[[Date.UTC(2027,1,6,16,0),'Annular solar eclipse','S Pacific, Chile, Argentina, Uruguay, S Atlantic','sun'],[Date.UTC(2027,1,20,10,13),'Penumbral lunar eclipse','Americas, Europe, Africa, Asia','moon'],
 [Date.UTC(2027,6,18,16,3),'Penumbral lunar eclipse','Asia, Australia, Pacific','moon'],[Date.UTC(2027,7,2,10,7),'Total solar eclipse — up to 6 min 23 s of totality','Spain, Morocco, Egypt, Saudi Arabia, Yemen','sun'],
 [Date.UTC(2027,7,17,7,14),'Penumbral lunar eclipse','Pacific, Americas','moon'],[Date.UTC(2028,0,12,4,13),'Partial lunar eclipse','Americas, Europe, Africa','moon'],[Date.UTC(2028,0,26,15,9),'Annular solar eclipse','Ecuador, Peru, Brazil, Portugal, Spain','sun'],
 [Date.UTC(2028,6,6,18,20),'Partial lunar eclipse','Europe, Africa, Asia, Australia','moon'],[Date.UTC(2028,6,22,2,56),'Total solar eclipse','Australia (through Sydney), New Zealand','sun'],[Date.UTC(2028,11,31,16,52),'Total lunar eclipse','Europe, Africa, Asia, Australia','moon'],
 [Date.UTC(2029,0,14,17,13),'Partial solar eclipse','North America','sun'],[Date.UTC(2030,10,25,6,51),'Total solar eclipse','Botswana, South Africa, Australia','sun']];
const SHOWERS=[['Quadrantids',0,3,110],['Lyrids',3,22,18],['Eta Aquariids',4,6,50],['Southern δ Aquariids',6,30,25],['Perseids',7,12,100],['Draconids',9,8,10],['Orionids',9,21,20],['Leonids',10,17,15],['Geminids',11,14,150],['Ursids',11,22,10]];
const evObj={id:'events',name:'Sky events',kind:'Upcoming eclipses and meteor showers',type:'events',facts:[],desc:'Tap Jump to send the whole model to that moment. Eclipse dates and approximate peak times (UTC) are from NASA’s eclipse catalog by Fred Espenak. Meteor showers peak on about the same nights every year. Darker skies away from city lights show many more meteors.',wiki:'Eclipse',links:[['NASA eclipse page ↗','https://science.nasa.gov/eclipses/future-eclipses/',1],['Meteor shower calendar — American Meteor Society ↗','https://www.amsmeteors.org/meteor-showers/meteor-shower-calendar/']]};
function eventsHTML(){const ms=simMs,f=t=>new Date(t).toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric',year:'numeric'});
 const ec=ECLIPSES.filter(e=>e[0]>ms-864e5).slice(0,6),y=new Date(ms).getFullYear(),sh=[];for(const yy of[y,y+1])for(const[n,m,d,z]of SHOWERS){const t=Date.UTC(yy,m,d,6);if(t>ms-864e5)sh.push([t,n,z])}sh.sort((a,b)=>a[0]-b[0]);
 return `<div class="sub">Eclipses</div>${ec.map(e=>`<div class="ev"><div><b>${e[1]}</b><span>${f(e[0])} · ${e[2]}</span></div><button data-jump="${e[0]}" data-sel="${e[3]==='sun'?'earth':'moon'}">Jump</button></div>`).join('')||'<p>No eclipses in the list after this date.</p>'}
 ${LAUNCHES.length?`<div class="sub">Upcoming rocket launches</div>${LAUNCHES.slice(0,6).map(l=>`<div class="ev"><div><b>${l.name.replace(/</g,'&lt;')}</b><span>${new Date(l.net).toLocaleString(undefined,{weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})} · <span class="cd" data-net="${l.net}">${tminus(l.net)}</span></span></div><button data-launch="${l.id}">Show</button></div>`).join('')}`:''}
 <div class="sub">Meteor shower peaks</div>${sh.slice(0,5).map(s=>`<div class="ev"><div><b>${s[1]}</b><span>${f(s[0])} · up to ~${s[2]} meteors/hour in dark skies</span></div><button data-jump="${s[0]}" data-sel="sky">Jump</button></div>`).join('')}`}
$('evb').onclick=()=>select(evObj);
$('extra').addEventListener('click',e=>{const lb=e.target.closest('[data-launch]');if(lb){const o=objects.find(x=>x.id===lb.dataset.launch);if(o)select(o);return}const b=e.target.closest('[data-jump]');if(!b)return;simMs=+b.dataset.jump;setLive(false);
 if(b.dataset.sel==='sky'){openSky()}else select(objects.find(o=>o.id===b.dataset.sel))});
