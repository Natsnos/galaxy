// Live weather layer on the globe: clouds, temperature, rain and snow
// Part of Interactive Galaxy. Files load in number order and share one global scope.

/* ---------- live weather layer on the globe ---------- */
let wxGrid=null,wxMode='clouds',wxAt=0;const WX_STEP=10,WX_LATS=[],WX_LONS=[];for(let la=-80;la<=80;la+=WX_STEP)WX_LATS.push(la);for(let lo=-180;lo<180;lo+=WX_STEP)WX_LONS.push(lo);
async function loadWxGrid(){const pts=[];for(const la of WX_LATS)for(const lo of WX_LONS)pts.push([la,lo]);const out=new Array(pts.length);let ok=0;
 for(let i=0;i<pts.length;i+=60){const ch=pts.slice(i,i+60);const j=await getData(`https://api.open-meteo.com/v1/forecast?latitude=${ch.map(p=>p[0]).join(',')}&longitude=${ch.map(p=>p[1]).join(',')}&current=cloud_cover,precipitation,temperature_2m,weather_code`);
  if(!j){if(i===0){FEED['live weather layer']=false;feedMsg();return}continue}(Array.isArray(j)?j:[j]).forEach((r,k)=>{if(r&&r.current){out[i+k]=r.current;ok++}})}
 if(!ok)return;wxGrid=out;wxAt=Date.now();FEED['live weather layer']=true;feedMsg();paintWx();if(focus&&(focus.id==='earth'||focus.type==='loc'))$('wxx').hidden=false}
function wxAtLL(lat,lon,key){const nl=WX_LONS.length,fy=(Math.max(-80,Math.min(80,lat))+80)/WX_STEP,fx=((lon+180)%360+360)%360/WX_STEP,y0=Math.min(WX_LATS.length-2,Math.floor(fy)),x0=Math.floor(fx)%nl,x1=(x0+1)%nl,ty=fy-y0,tx=fx-Math.floor(fx);
 const v=(y,x)=>{const c=wxGrid[y*nl+x];return c?(c[key]??0):0};return lerp(lerp(v(y0,x0),v(y0,x1),tx),lerp(v(y0+1,x0),v(y0+1,x1),tx),ty)}
// weather-map colours by °C: purple/blue = cold, green = mild, yellow → red = hot
const TSTOPS=[[-40,'#3d1a6e'],[-25,'#6a3d9a'],[-12,'#3b5bdb'],[0,'#4dabf7'],[8,'#63e6be'],[16,'#94d82d'],[22,'#ffe066'],[28,'#ffa94d'],[34,'#f03e3e'],[42,'#a61e4d']];
function tempRamp(t){if(t<=TSTOPS[0][0])return hex(TSTOPS[0][1]);for(let i=1;i<TSTOPS.length;i++)if(t<=TSTOPS[i][0]){const[a,ca]=TSTOPS[i-1],[b,cb]=TSTOPS[i];return mix(hex(ca),hex(cb),(t-a)/(b-a))}return hex(TSTOPS[TSTOPS.length-1][1])}
let wxUnitF=(navigator.language||'').toLowerCase()==='en-us';
const fmtT=c=>wxUnitF?`${Math.round(c*9/5+32)}°F`:`${Math.round(c)}°C`,fmtT2=c=>`${Math.round(c*9/5+32)}°F (${Math.round(c)}°C)`;
function renderWxKey(){const lo=-40,hi=42,pct=t=>(t-lo)/(hi-lo)*100,grad='linear-gradient(90deg,'+TSTOPS.map(([t,c])=>`${c} ${pct(t).toFixed(1)}%`).join(',')+')';
 const ticks=(wxUnitF?[-20,0,32,50,70,90].map(f=>[(f-32)*5/9,f+'°']):[-30,-15,0,15,30].map(c=>[c,c+'°'])).map(([c,l])=>`<span style="left:${pct(c)}%">${l}</span>`).join('');
 for(const[b,t]of[['wxbar','wxticks'],['wxbar2','wxticks2']]){$(b).style.background=grad;$(t).innerHTML=ticks}
 $('wxunit').textContent=wxUnitF?'Show °C':'Show °F';$('wxft').textContent=`Temperature now (${wxUnitF?'°F':'°C'})`;placeWxLabels(true)}
$('wxunit').onclick=()=>{wxUnitF=!wxUnitF;renderWxKey()};
// real current readings for major cities, shown as labels on the globe
const WXC=[['New York',40.71,-74.01],['Los Angeles',34.05,-118.24],['Chicago',41.88,-87.63],['Miami',25.76,-80.19],['Denver',39.74,-104.99],['Seattle',47.61,-122.33],['Mexico City',19.43,-99.13],['Toronto',43.65,-79.38],['Anchorage',61.22,-149.9],['Honolulu',21.31,-157.86],['Bogotá',4.71,-74.07],['Lima',-12.05,-77.04],['São Paulo',-23.55,-46.63],['Buenos Aires',-34.6,-58.38],['Reykjavík',64.15,-21.94],['London',51.51,-.13],['Paris',48.86,2.35],['Madrid',40.42,-3.7],['Rome',41.9,12.5],['Berlin',52.52,13.4],['Moscow',55.76,37.62],['Cairo',30.04,31.24],['Lagos',6.52,3.38],['Nairobi',-1.29,36.82],['Johannesburg',-26.2,28.05],['Dubai',25.2,55.27],['Delhi',28.61,77.21],['Mumbai',19.08,72.88],['Beijing',39.9,116.41],['Tokyo',35.68,139.65],['Seoul',37.57,126.98],['Bangkok',13.76,100.5],['Singapore',1.35,103.82],['Jakarta',-6.21,106.85],['Sydney',-33.87,151.21],['Perth',-31.95,115.86],['Auckland',-36.85,174.76],['Yakutsk',62.03,129.73],['Nuuk',64.18,-51.72],['McMurdo (Antarctica)',-77.85,166.67]];
let wxCity=[];
async function loadWxCities(){const j=await getData(`https://api.open-meteo.com/v1/forecast?latitude=${WXC.map(c=>c[1]).join(',')}&longitude=${WXC.map(c=>c[2]).join(',')}&current=temperature_2m,precipitation,weather_code,cloud_cover`);
 if(!j)return;const arr=Array.isArray(j)?j:[j];const box=$('wxlabels');box.innerHTML='';
 wxCity=WXC.map(([n,la,lo],i)=>{const c=arr[i]&&arr[i].current;if(!c)return null;const el=document.createElement('div');el.className='wxl';el.hidden=true;box.appendChild(el);return{n,la,lo,c,el}}).filter(Boolean);placeWxLabels(true)}
const WXSNOW=new Set([71,73,75,77,85,86]);
function placeWxLabels(force){const show=wxGrid&&(wxMode==='temp'||wxMode==='precip')&&camera.position.distanceTo(worldPos(earthO))<45;
 $('wxfloat').hidden=!(show&&wxMode==='temp');if(!wxCity.length)return;if(!show){wxCity.forEach(w=>w.el.hidden=true);return}
 const ec=worldPos(earthO),W=innerWidth,H=innerHeight,placed=[];
 for(const w of wxCity){const v=llLocal(w.la,w.lo,ER*1.01).applyQuaternion(earthMesh.quaternion).add(ec),n=v.clone().sub(ec).normalize(),toCam=camera.position.clone().sub(v).normalize();
  let txt=null,bg='';if(wxMode==='temp'){txt=fmtT(w.c.temperature_2m);const[r,g,b]=tempRamp(w.c.temperature_2m);bg=`rgb(${r|0},${g|0},${b|0})`}
  else if(w.c.precipitation>0||[51,53,55,61,63,65,66,67,80,81,82,95,96,99,71,73,75,77,85,86].includes(w.c.weather_code)){const sn=WXSNOW.has(w.c.weather_code)||(w.c.temperature_2m<=0);txt=sn?'Snow':'Rain';bg=sn?'#f1f3f5':'#74c0fc'}
  const p=v.clone().project(camera),sx=(p.x+1)/2*W,sy=(1-p.y)/2*H;
  const ok=txt&&n.dot(toCam)>.2&&p.z<1&&sx>0&&sx<W&&sy>0&&sy<H&&!placed.some(q=>Math.abs(q[0]-sx)<54&&Math.abs(q[1]-sy)<22);
  if(!ok){w.el.hidden=true;continue}placed.push([sx,sy]);w.el.hidden=false;w.el.style.left=sx+'px';w.el.style.top=sy+'px';w.el.style.background=bg;
  if(force||w.el.dataset.t!==txt+w.n){w.el.dataset.t=txt+w.n;w.el.innerHTML=`${txt}<small>${w.n}</small>`}}}
// what the weather layer says at any point under the mouse
function wxReadout(e){if(!wxGrid||wxMode==='off'||camera.position.distanceTo(worldPos(earthO))>45)return null;const r=canvas.getBoundingClientRect();
 mouse.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(mouse,camera);const h=ray.intersectObject(earthMesh,false)[0];if(!h)return null;
 const[la,lo]=localLL(h.point.clone().sub(worldPos(earthO))),t=wxAtLL(la,lo,'temperature_2m'),cc=wxAtLL(la,lo,'cloud_cover'),pr=wxAtLL(la,lo,'precipitation');
 return`<b>About ${fmtT2(t)}</b><span>${fmtLL(la,lo)} · clouds ${Math.round(cc)}% · ${pr>.05?(t<=0?'snowing':'raining')+` ${pr.toFixed(1)} mm/h`:'no rain or snow'}</span>`}
function paintWx(){const cl=BODIES.find(b=>b.id==='earth')._cl;if(!cl)return;if(wxMode==='off'){cl.visible=false;return}cl.visible=true;if(!wxGrid)return;
 const W=720,H=360,cv=document.createElement('canvas');cv.width=W;cv.height=H;const g=cv.getContext('2d'),im=g.createImageData(W,H),d=im.data;
 for(let j=0;j<H;j++){const lat=90-(j+.5)/H*180,lr=lat*D2R,cl_=Math.cos(lr),sy=Math.sin(lr);for(let i=0;i<W;i++){const lon=(i+.5)/W*360-180,lo=(lon+180)*D2R,x=cl_*Math.cos(lo)+2,y=sy+2,z=cl_*Math.sin(lo)+2,k=(j*W+i)*4;let r,gg,b,a;
  if(wxMode==='clouds'){const cc=wxAtLL(lat,lon,'cloud_cover')/100,pr=wxAtLL(lat,lon,'precipitation'),n=fbm(x*5,y*5,z*5,4,60),q=sm(.2,.85,cc+(n-.5)*.7);r=gg=b=255;a=q*225+Math.min(1,pr/3)*25;if(pr>.5){r=gg=232;b=240}}
  else if(wxMode==='temp'){[r,gg,b]=tempRamp(wxAtLL(lat,lon,'temperature_2m'));a=160}
  else{const pr=wxAtLL(lat,lon,'precipitation'),t=wxAtLL(lat,lon,'temperature_2m'),q=sm(.05,4,pr);[r,gg,b]=t<0?[235,245,255]:[60,140,255];a=q*210}
  d[k]=r;d[k+1]=gg;d[k+2]=b;d[k+3]=a}}
 g.putImageData(im,0,0);const tx=new THREE.CanvasTexture(cv);cl.material.map=tx;cl.material.alphaMap=null;
 // temperature and rain colours are drawn unlit, so they read the same on the day and night sides
 if(wxMode==='clouds'){cl.material.emissive=new THREE.Color(0,0,0);cl.material.emissiveMap=null}else{cl.material.emissive=new THREE.Color(1,1,1);cl.material.emissiveMap=tx;cl.material.emissiveIntensity=.8}
 cl.material.needsUpdate=true;cl.rotation.y=0;cl.userData.live=true;$('wxkey').hidden=wxMode!=='temp';placeWxLabels(true);
 $('wxcap').textContent=`${wxMode==='clouds'?'Real cloud cover':wxMode==='temp'?'Air temperature near the ground. City labels are real current readings; colours between cities are estimated':'Rain (blue) and snow (white) falling now'} from Open-Meteo on a ${WX_STEP}° grid, updated ${new Date(wxAt).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})}. Refreshes every 30 minutes.`}
document.querySelectorAll('[data-wx]').forEach(b=>b.onclick=()=>{wxMode=b.dataset.wx;document.querySelectorAll('[data-wx]').forEach(x=>x.classList.toggle('on',x===b));paintWx()});
document.querySelector('[data-wx=clouds]').classList.add('on');
renderWxKey();loadWxGrid();loadWxCities();setInterval(()=>{loadWxGrid();loadWxCities()},30*60*1000);
