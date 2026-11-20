// Updating positions each frame and the data shown in cards
// Part of Interactive Galaxy. Files load in number order and share one global scope.

/* ---------- live state ---------- */
const HP={};let moonNow=null;
function updateWorld(ms){orient('sun',ms,sunMesh.quaternion);
 for(const s of planetState){if(s.b.parent){moonNow=moonGeo(ms);s.holder.position.copy(eclToThree(...moonNow.v).multiplyScalar(s.b.a))}
  else{HP[s.b.id]=helio(s.b.id,ms);s.holder.position.copy(disp(HP[s.b.id]))}
  orient(s.b.id,ms,s.mesh.quaternion);if(s.b._cl&&!s.b._cl.userData.live)s.b._cl.rotation.y=(ms/864e5*.15)%(Math.PI*2)}
 objects.find(o=>o.id==='belt').spin.rotation.y=dJ(ms)*2*Math.PI/1680;
 for(const s of SATS)s.sp.position.copy((s.satrec&&satECI(s.satrec,ms))||satPos(s,ms));updateCons(ms);
 const sunDir=earthHolder.position.clone().negate().normalize();jwst.position.copy(sunDir.clone().multiplyScalar(-ER*7));
 subsolar.position.copy(sunDir.clone().applyQuaternion(earthMesh.quaternion.clone().invert()).multiplyScalar(ER*1.01));
 updateMoons(ms);updateComets(ms)}
let orbitAt=-1e15;
function refreshOrbits(ms){orbitAt=ms;
 for(const s of planetState){const pts=[];
  if(s.b.parent){for(let i=0;i<=240;i++)pts.push(eclToThree(...moonGeo(ms+i/240*27.32*864e5).v).multiplyScalar(s.b.a))}
  else for(let i=0;i<=360;i++)pts.push(disp(helio(s.b.id,ms,i/360*Math.PI*2)));
  s.line.geometry.setFromPoints(pts)}
 for(const s of SATS){const pts=[];for(let i=0;i<=120;i++)pts.push((s.satrec&&satECI(s.satrec,ms+i/120*s.per*6e4))||satPos(s,ms,i/120*Math.PI*2));s.line.geometry.setFromPoints(pts)}
 cometOrbits(ms)}
const localLL=v=>{const l=v.clone().applyQuaternion(earthMesh.quaternion.clone().invert()).normalize();return[Math.asin(l.y)/D2R,Math.atan2(-l.z,l.x)/D2R]};
function sunElev(lat,lon){const n=llLocal(lat,lon,1).applyQuaternion(earthMesh.quaternion),s=earthHolder.position.clone().negate().normalize();return Math.asin(Math.max(-1,Math.min(1,n.dot(s))))/D2R}
const AU=149597870.7,fmtAU=r=>`${r.toFixed(3)} AU (${(r*AU/1e6).toFixed(1)} million km)`,lt=r=>{const m=r*AU/299792.458/60;return m<60?`${m.toFixed(1)} light-minutes`:`${(m/60).toFixed(2)} light-hours`};
const sub3=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],len=v=>Math.hypot(...v);
function moonPhase(){const E=HP.earth,sl=Math.atan2(-E[1],-E[0]),ml=Math.atan2(moonNow.v[1],moonNow.v[0]);let el=((ml-sl)/D2R+720)%360;
 const ill=(1-Math.cos(el*D2R))/2*100,names=['New Moon','Waxing crescent','First quarter','Waxing gibbous','Full Moon','Waning gibbous','Last quarter','Waning crescent'];
 return[names[Math.round(el/45)%8],ill]}
function liveRows(o){const ms=simMs;
 if(o.type==='launch')return[['Countdown',`<span class="cd">${tminus(o.net)}</span>`]];
 if(o.type==='events'||o.type==='quake'||o.type==='event')return null;
 if(CP[o.id]){const r=len(CP[o.id]),d=len(sub3(CP[o.id],HP.earth));return[['Distance from Sun',fmtAU(r)],['Distance from Earth',fmtAU(d)],['Tail',r<2.5?'Visible — near the Sun':'None while this far out']]}
 if(o.host){const v=o.mesh.position.clone();return[['Position','Real angle around '+o.host[0].toUpperCase()+o.host.slice(1)+(o.approx?' (approximate)':' (from Meeus)')]]}
 if(o.type==='loc'&&o.lat===undefined)return null;
 if(o.type==='loc'){const e=sunElev(o.lat,o.lon),st=e>0?'Daytime':e>-6?'Twilight':e>-18?'Dusk/dawn sky':'Night';
  let t;try{t=new Date(ms).toLocaleString(undefined,{timeZone:o.tz||'UTC',weekday:'short',hour:'numeric',minute:'2-digit',timeZoneName:'short'})}catch(_){t=new Date(ms).toUTCString()}
  return[['Local time',t],['Sun',`${st} — ${e.toFixed(1)}° ${e>=0?'above':'below'} horizon`],['Position',fmtLL(o.lat,o.lon)],...(o.wx||[])]}
 if(o.type==='sat'&&o.id!=='jwst'){const[la,lo]=localLL(worldPos(o).sub(worldPos(earthO)));return[['Currently over',fmtLL(la,lo)],['Below it',sunElev(la,lo)>0?'Daytime':'Night side']]}
 if(o.id==='subsolar'){const[la,lo]=localLL(worldPos(o).sub(worldPos(earthO)));return[['Sun is overhead at',fmtLL(la,lo)]]}
 if(o.type==='star'){const y=new Date(ms).getFullYear();return[['Light reaching Earth now left',o.ly<1000?`around ${Math.round(y-o.ly)}`:`${Math.round(o.ly)} years ago`]]}
 if(o.id==='moon'){const[p,ill]=moonPhase();const le=lunInfo?[['Eclipse now',lunInfo.fu>=.999?'Total lunar eclipse: Earth’s shadow is turning the Moon red':lunInfo.fu>0?`Partial lunar eclipse: ${(lunInfo.fu*100).toFixed(0)}% in Earth’s dark shadow`:'Penumbral lunar eclipse: the Moon is slightly dimmed']]:[];return[...le,['Phase',p],['Illuminated',ill.toFixed(0)+'%'],['Distance from Earth',Math.round(moonNow.km).toLocaleString()+' km']]}
 if(o.id==='sun'){const r=len(HP.earth);return[['Distance from Earth',fmtAU(r)],['Sunlight takes',lt(r)]]}
 if(o.id==='earth'){const E=HP.earth,sl=((Math.atan2(-E[1],-E[0])/D2R)+360)%360,q=Math.floor(sl/90),[p,ill]=moonPhase(),[la,lo]=localLL(worldPos(objects.find(x=>x.id==='subsolar')).sub(worldPos(earthO)));
  let se=[];if(eclInfo&&eclInfo.on){const[sl,so]=localLL(eclInfo.dirW);se=[['Solar eclipse now',`${eclInfo.total?'Total':eclInfo.annular?'Annular':'Partial'} — the Moon’s shadow is over ${fmtLL(sl,so)}`]]}else if(eclInfo)se=[['Solar eclipse now','Partial, near the edge of the day side']];
  return[...se,['Distance from Sun',fmtAU(len(E))],['Season (N / S)',[['Spring','Autumn'],['Summer','Winter'],['Autumn','Spring'],['Winter','Summer']][q].join(' / ')],['Sun overhead at',fmtLL(la,lo)],['Moon',`${p}, ${ill.toFixed(0)}% lit`]]}
 if(HP[o.id]){const r=len(HP[o.id]),d=len(sub3(HP[o.id],HP.earth)),lon=((Math.atan2(HP[o.id][1],HP[o.id][0])/D2R)+360)%360;
  return[['Distance from Sun',fmtAU(r)],['Distance from Earth',fmtAU(d)],['Light from it takes',lt(d)],['Heliocentric longitude',lon.toFixed(1)+'°']]}
 return null}
function renderLive(){if(!focus||!$('info').classList.contains('open'))return;const rows=liveRows(focus);$('ilivecap').hidden=$('ilive').hidden=!rows;
 if(rows)$('ilive').innerHTML=rows.map(([k,v])=>`<tr><td>${k}</td><td>${v}</td></tr>`).join('')}
