// Labels, camera, picking, the info card and controls
// Part of Interactive Galaxy. Files load in number order and share one global scope.

/* ---------- labels + select ---------- */
const labels=$('labels');
for(const o of objects){const el=document.createElement('div');el.className='lb '+({star:'star',gal:'gal',sat:'sat',nat:'sat',loc:'loc'}[o.type]||'');el.textContent=o.name;el.onclick=()=>select(o);labels.appendChild(el);o.el=el;
 if(o.type==='loc')continue;const op=document.createElement('option');op.value=o.id;op.textContent=o.name;$('goto').appendChild(op)}
$('goto').onchange=e=>{const o=objects.find(x=>x.id===e.target.value);if(o)select(o);e.target.value=''};

/* ---------- camera focus ---------- */
let focus=null,fly=null;const tmp=new THREE.Vector3(),prevT=new THREE.Vector3();
function worldPos(o,v=new THREE.Vector3()){return o.obj.getWorldPosition(v)}
function flyTo(target,dist,obj){const from=controls.target.clone(),camFrom=camera.position.clone();
 const dir=camFrom.clone().sub(from).normalize();if(Math.abs(dir.y)>.97)dir.set(0,.4,1).normalize();
 fly={t:0,from,camFrom,dist,dir,obj,target}}
function select(o){focus=o;setHash(slugOf(o));if(o.type==='events'){fly=null;showInfo(o);return}flyTo(null,o.viewDist,o);if(['loc','quake','event','launch'].includes(o.type))fly.surface=true;showInfo(o);
 objects.forEach(x=>x.el?.classList.toggle('on',x===o));$('hint').style.opacity=0}
const VIEWS={solar:{t:[0,0,0],c:[0,90,210]},stars:{t:[0,0,0],c:[900,1400,3600]},galaxy:{t:null,c:null}};
function setView(v){focus=null;setHash({solar:'solar-system',stars:'nearby-stars',galaxy:'milky-way'}[v]);$('info').classList.remove('open');objects.forEach(x=>x.el?.classList.remove('on'));
 document.querySelectorAll('[data-v]').forEach(b=>b.classList.toggle('on',b.dataset.v===v));
 if(v==='galaxy'){const c=worldPos({obj:galCore});const up=new THREE.Vector3(0,1,0).applyQuaternion(galaxy.quaternion);
  fly={t:0,from:controls.target.clone(),camFrom:camera.position.clone(),target:c,camTo:c.clone().add(up.multiplyScalar(105000)).add(new THREE.Vector3(0,0,30000))}}
 else{const V=VIEWS[v];fly={t:0,from:controls.target.clone(),camFrom:camera.position.clone(),target:new THREE.Vector3(...V.t),camTo:new THREE.Vector3(...V.c)}}}
document.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>setView(b.dataset.v));

/* ---------- picking ---------- */
const ray=new THREE.Raycaster(),mouse=new THREE.Vector2();let down=null;
canvas.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY];$('tip').hidden=true});
const SMALL=['quake','event','launch','sat','nat','loc'];
function nearestSmall(x,y,max){let best=null,bd=max;for(const o of objects){if(!o._s||!SMALL.includes(o.type)||o.obj.visible===false)continue;const d=Math.hypot(o._s[0]-x,o._s[1]-y);if(d<bd){bd=d;best=o}}return best}
canvas.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||e.buttons){$('tip').hidden=true;return}const o0=nearestSmall(e.clientX,e.clientY,16);if(!o0){const wr=wxReadout(e);if(wr){const t=$('tip');t.innerHTML=wr;t.style.left=e.clientX+'px';t.style.top=e.clientY+'px';t.hidden=false;canvas.style.cursor='crosshair';return}}
 const o=o0||(()=>{let b=null,bd=14;for(const x of objects){if(!x._s||x.obj.visible===false)continue;const d=Math.hypot(x._s[0]-e.clientX,x._s[1]-e.clientY);if(d<bd){bd=d;b=x}}return b})();
 const t=$('tip');if(!o){t.hidden=true;canvas.style.cursor='';return}canvas.style.cursor='pointer';
 t.innerHTML=`<b>${String(o.name).replace(/</g,'&lt;')}</b><span>${String(o.kind||'').replace(/</g,'&lt;')} · click for details</span>`;t.style.left=e.clientX+'px';t.style.top=e.clientY+'px';t.hidden=false});
canvas.addEventListener('pointerleave',()=>$('tip').hidden=true);
canvas.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>6)return;
 const r=canvas.getBoundingClientRect();mouse.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(mouse,camera);
 const small=nearestSmall(e.clientX,e.clientY,22);if(small){select(small);return}
 const hits=ray.intersectObjects(objects.filter(o=>o.mesh).map(o=>o.mesh),false);
 if(hits.length){select(objects.find(o=>o.mesh===hits[0].object));return}
 let best=null,bd=30;for(const o of objects){if(!o._s)continue;const d=Math.hypot(o._s[0]-e.clientX,o._s[1]-e.clientY);if(d<bd){bd=d;best=o}}
 if(best)select(best)});

/* ---------- info panel + portrait ---------- */
function portrait(o){if(o.type==='loc'){const e=BODIES.find(b=>b.id==='earth');portrait({...e,cLon:o.lon});const g=$('pic').getContext('2d'),S=480,R=S*.4,y=S/2-Math.sin(o.lat*D2R)*R,x=S/2;
  if(Math.abs(o.lat)<89.9){g.fillStyle='#ff4d4d';g.strokeStyle='#fff';g.lineWidth=3;g.beginPath();g.arc(x,y,9,0,7);g.fill();g.stroke()}return}
 if(['sat','nat','quake','event','launch'].includes(o.type)){drawSat($('pic'),o);return}
 if(o.type==='events'){const g=$('pic').getContext('2d'),S=480;g.fillStyle='#000';g.fillRect(0,0,S,S);const c=g.createRadialGradient(S/2,S/2,S*.12,S/2,S/2,S*.45);c.addColorStop(0,'#fff');c.addColorStop(.2,'rgba(220,235,255,.8)');c.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=c;g.fillRect(0,0,S,S);g.fillStyle='#000';g.beginPath();g.arc(S/2,S/2,S*.14,0,7);g.fill();return}
 const cv=$('pic'),g=cv.getContext('2d'),S=cv.width;g.fillStyle='#000';g.fillRect(0,0,S,S);
 for(let i=0;i<220;i++){g.fillStyle=`rgba(255,255,255,${Math.random()*.6})`;g.fillRect(Math.random()*S,Math.random()*S,1.3,1.3)}
 if(o.tex){const T=makeTex(o.tex),im=g.getImageData(0,0,S,S),d=im.data,R=S*.4,cx=S/2,cy=S/2,L=[-.55,.45,.7],ln=Math.hypot(...L),emit=o.tex==='sun';
  const CL=o.clouds?makeTex('clouds'):null,rotL=o.cLon!==undefined?(o.cLon+180)/360*Math.PI*2-Math.PI*1.5:o.id==='jupiter'?-1:o.id==='neptune'?2.4:0;
  if(o.ring)ringHalf(g,cx,cy,R,true);const base=g.getImageData(0,0,S,S).data;
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){const nx=(x-cx)/R,ny=(cy-y)/R,q=nx*nx+ny*ny;const k=(y*S+x)*4;if(q>1){d[k]=base[k];d[k+1]=base[k+1];d[k+2]=base[k+2];continue}
   const nz=Math.sqrt(1-q),lat=Math.asin(ny),lon=(Math.atan2(nx,nz)+Math.PI*1.5+rotL+Math.PI*4)%(Math.PI*2);
   const tx=Math.floor(lon/(Math.PI*2)*T.W)%T.W,ty=Math.min(T.H-1,Math.floor((.5-lat/Math.PI)*T.H)),tk=(ty*T.W+tx)*4;
   let r=T.data[tk],gg=T.data[tk+1],b=T.data[tk+2];
   if(CL){const cx_=Math.floor(lon/(Math.PI*2)*CL.W)%CL.W,cy_=Math.min(CL.H-1,Math.floor((.5-lat/Math.PI)*CL.H)),a=CL.data[(cy_*CL.W+cx_)*4+3]/255;r=lerp(r,255,a);gg=lerp(gg,255,a);b=lerp(b,255,a)}
   let l=emit?1-.35*(1-nz):Math.max(0,(nx*L[0]+ny*L[1]+nz*L[2])/ln)*1.15+.04;
   if(o.clouds){const rim=Math.pow(1-nz,3);r=lerp(r*l,120,rim*.6);gg=lerp(gg*l,170,rim*.6);b=lerp(b*l,255,rim*.7);l=1}
   const aa=Math.min(1,(1-Math.sqrt(q))*R);d[k]=lerp(base[k],r*l,aa);d[k+1]=lerp(base[k+1],gg*l,aa);d[k+2]=lerp(base[k+2],b*l,aa)}
  g.putImageData(im,0,0);if(o.ring)ringHalf(g,cx,cy,R,false);
  if(emit){const gr=g.createRadialGradient(cx,cy,R*.95,cx,cy,R*1.25);gr.addColorStop(0,'rgba(255,170,60,.6)');gr.addColorStop(1,'rgba(255,120,0,0)');g.fillStyle=gr;g.fillRect(0,0,S,S)}}
 else if(o.type==='star'){const gr=g.createRadialGradient(S/2,S/2,0,S/2,S/2,S*.48);gr.addColorStop(0,'#fff');gr.addColorStop(.12,o.col);gr.addColorStop(.4,o.col+'44');gr.addColorStop(1,o.col+'00');g.fillStyle=gr;g.fillRect(0,0,S,S);
  g.strokeStyle=o.col+'88';g.lineWidth=2;for(let i=0;i<4;i++){g.save();g.translate(S/2,S/2);g.rotate(i*Math.PI/4);g.beginPath();g.moveTo(-S*.45,0);g.lineTo(S*.45,0);g.globalAlpha=i%2?.25:.6;g.stroke();g.restore()}}
 else drawGalaxyPic(g,S,o)}
function drawSat(cv,o){const g=cv.getContext('2d'),S=cv.width;g.fillStyle='#000';g.fillRect(0,0,S,S);for(let i=0;i<200;i++){g.fillStyle=`rgba(255,255,255,${Math.random()*.6})`;g.fillRect(Math.random()*S,Math.random()*S,1.3,1.3)}
 const T=texCache.earth||makeTex('earth'),R=S*1.6,cx=S/2,cy=S*1.95,im=g.getImageData(0,0,S,S),d=im.data;
 for(let y=0;y<S;y++)for(let x=0;x<S;x++){const nx=(x-cx)/R,ny=(cy-y)/R,q=nx*nx+ny*ny;if(q>1)continue;const nz=Math.sqrt(1-q),lat=Math.asin(ny),lon=Math.atan2(nx,nz)+2.2,tx=((Math.floor(lon/(2*Math.PI)*T.W)%T.W)+T.W)%T.W,ty=Math.floor((.5-lat/Math.PI)*T.H),tk=(ty*T.W+tx)*4,k=(y*S+x)*4,l=.25+.85*Math.max(0,nx*-.3+ny*.5+nz*.8);
  d[k]=T.data[tk]*l;d[k+1]=T.data[tk+1]*l;d[k+2]=T.data[tk+2]*l}
 g.putImageData(im,0,0);const gr=g.createRadialGradient(cx,cy,R*.98,cx,cy,R*1.04);gr.addColorStop(0,'rgba(90,170,255,.8)');gr.addColorStop(1,'rgba(90,170,255,0)');g.fillStyle=gr;g.fillRect(0,0,S,S);
 g.save();g.translate(S/2,S*.38);
 if(o.type==='nat'||o.type==='quake'||o.type==='event'||o.type==='launch'){const a=o.id.startsWith('aurora');const gg=g.createRadialGradient(0,0,0,0,0,S*.3);gg.addColorStop(0,a?'rgba(80,255,160,.9)':'rgba(255,220,90,1)');gg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gg;g.beginPath();g.arc(0,0,S*.3,0,7);g.fill();
  if(a){g.strokeStyle='rgba(120,255,180,.5)';for(let i=0;i<40;i++){g.lineWidth=2;g.beginPath();const x=-S*.4+i*S*.02;g.moveTo(x,S*.05);g.lineTo(x+8,-S*.12-Math.random()*40);g.stroke()}}}
 else if(o.id==='starlink'||o.id==='gps'){for(let i=0;i<40;i++){g.fillStyle='rgba(200,220,255,.9)';g.fillRect(-S*.4+i*S*.02,Math.sin(i*.4)*20,3,3)}}
 else{g.rotate(-.3);g.fillStyle='#2b4c8c';g.strokeStyle='#8fb0ff';g.lineWidth=2;for(const sx of[-1,1]){g.fillRect(sx*S*.08-(sx<0?S*.22:0),-S*.05,S*.22,S*.1);g.strokeRect(sx*S*.08-(sx<0?S*.22:0),-S*.05,S*.22,S*.1)}
  const b=g.createLinearGradient(0,-S*.07,0,S*.07);b.addColorStop(0,'#f2f2f2');b.addColorStop(1,'#8d8d8d');g.fillStyle=o.id==='jwst'?'#d9ab2f':b;g.fillRect(-S*.08,-S*.06,S*.16,S*.12)}
 g.restore()}
function ringHalf(g,cx,cy,R,back){g.save();g.beginPath();if(back)g.rect(0,0,g.canvas.width,cy);else g.rect(0,cy,g.canvas.width,g.canvas.height);g.clip();
 for(let i=0;i<90;i++){const t=i/90,rr=R*(1.25+t*1.05);if(t>.58&&t<.63)continue;g.strokeStyle=`rgba(${220-t*40|0},${200-t*40|0},${160-t*30|0},${.15+.35*fbm(t*40,1,1,3,30)})`;g.lineWidth=R*1.05/90+.5;g.beginPath();g.ellipse(cx,cy,rr,rr*.28,-.25,0,7);g.stroke()}
 g.restore()}
function drawGalaxyPic(g,S,o){g.save();g.translate(S/2,S/2);
 if(o.id==='belt'){const T=makeTex('moon');for(let i=0;i<260;i++){const x=(Math.random()-.5)*S,y=(Math.random()-.5)*S*.5+x*.15,r=1+Math.pow(Math.random(),4)*26;
   const gr=g.createRadialGradient(x-r*.3,y-r*.3,0,x,y,r);gr.addColorStop(0,'#cfc4b0');gr.addColorStop(1,'#2b2722');g.fillStyle=gr;g.beginPath();g.ellipse(x,y,r,r*.8,Math.random()*3,0,7);g.fill()}}
 else if(o.id==='sgra'){const gr=g.createRadialGradient(0,0,S*.12,0,0,S*.36);gr.addColorStop(0,'#ffb347');gr.addColorStop(.35,'#ff7a1a');gr.addColorStop(.7,'#7a1d00');gr.addColorStop(1,'#00000000');g.fillStyle=gr;g.beginPath();g.arc(0,0,S*.4,0,7);g.fill();
   g.fillStyle='#000';g.beginPath();g.arc(0,0,S*.13,0,7);g.fill();const g2=g.createLinearGradient(-S*.3,0,S*.3,0);g2.addColorStop(0,'rgba(255,220,150,.9)');g2.addColorStop(1,'rgba(255,140,40,.3)');g.strokeStyle=g2;g.lineWidth=S*.05;g.beginPath();g.arc(0,0,S*.22,Math.PI*.15,Math.PI*.95);g.stroke()}
 else{const tilt=o.id==='andromeda'?.35:1,arms=o.id==='andromeda'?2:4;g.rotate(o.id==='andromeda'?-.6:0);
  for(let i=0;i<9000;i++){const r=Math.pow(Math.random(),1.1)*S*.46,a=(i%arms)/arms*Math.PI*2+Math.log(1+r/20)*2.2+(Math.random()-.5)*.6;
   g.fillStyle=r<S*.08?'rgba(255,225,170,.5)':Math.random()<.2?'rgba(255,170,220,.45)':'rgba(170,200,255,.35)';g.fillRect(Math.cos(a)*r,Math.sin(a)*r*tilt,1.4,1.4)}
  const gr=g.createRadialGradient(0,0,0,0,0,S*.13);gr.addColorStop(0,'#fff3d6');gr.addColorStop(1,'#ffd9a000');g.fillStyle=gr;g.save();g.scale(1,tilt);g.beginPath();g.arc(0,0,S*.13,0,7);g.fill();g.restore()}
 g.restore()}
function showInfo(o){$('iname').textContent=o.name;$('ikind').textContent=o.kind;
 $('ifacts').innerHTML=o.facts.map(([k,v])=>`<tr><td>${k}</td><td>${v}</td></tr>`).join('');$('idesc').textContent=o.desc;
 const L=o.links?[...o.links]:[];
 if(!o.links){if(o.track)L.push([o.trackName,o.track,1]);L.push([o.real?'See real NASA photos ↗':'See real photos — NASA image library ↗',o.real||IMG(o.q||o.name),!o.track]);
  if(o.id==='earth')L.push(['Live weather & storms — Windy ↗','https://www.windy.com/',1],['Live satellite clouds, fires & hurricanes — Zoom Earth ↗','https://zoom.earth/'],['Live earthquakes — USGS ↗','https://earthquake.usgs.gov/earthquakes/map/'],['Live natural events — NASA Worldview ↗','https://worldview.earthdata.nasa.gov/'],['Live aurora forecast — NOAA ↗','https://www.swpc.noaa.gov/products/aurora-30-minute-forecast'],['Where is the ISS now? — NASA ↗','https://spotthestation.nasa.gov/']);
  if(o.wiki)L.push(['Read more on Wikipedia ↗',WIKI(o.wiki)])}
 $('ilinks').innerHTML=L.map(([t,u,pri])=>`<a class="real${pri?'':' alt'}" href="${u}" target="_blank" rel="noopener">${t}</a>`).join('');
 $('earthx').hidden=!(o.id==='earth'||o.type==='loc');$('mkx').hidden=!($('mkx').dataset.has&&o.id==='earth');$('zoomx').hidden=o.type!=='loc';$('wxx').hidden=!(o.id==='earth'||o.type==='loc')||!wxGrid;$('imgx').hidden=!(FEED['NASA Earth imagery']!==false&&Object.values(FEED).some(Boolean));
 $('extra').innerHTML=o.type==='events'?eventsHTML():o.type==='loc'?issPasses(o):o.id==='sun'?sunTodayHTML():o.id&&o.id.startsWith('aurora')?aurImgHTML(o):'';
 $('sethome').hidden=o.type!=='loc';$('sethome').textContent=home&&focus&&home.lat===o.lat&&home.lon===o.lon?'Saved as home':'Make this my home';$('sharerow').hidden=o.type==='quake'||o.type==='event'||o.type==='launch';if(o.type==='loc')loadWeather(o);
 $('ilivecap').textContent=o.type==='events'?'':'Right now (at the time shown)';renderLive();
 if(o.type!=='loc')$('results').innerHTML='';$('mapbox').hidden=true;if(o.type==='loc'&&liveOK())showMap(o);else loadPhoto(o);
 $('info').classList.add('open');$('info').scrollTop=0;setTimeout(()=>portrait(o),20)}
$('close').onclick=()=>{$('info').classList.remove('open');focus=null;setHash('');objects.forEach(x=>x.el?.classList.remove('on'))};

/* ---------- controls ---------- */
let showLights=true;$('lights').onclick=e=>{showLights=e.currentTarget.classList.toggle('on');if(window.__earthReal){earthMesh.material.emissiveIntensity=showLights?1.7:0}else cityLights.visible=showLights};
let showLabels=true,rate=1,simMs=Date.now(),live=true,paused=false,dirn=1;
const setLive=v=>{live=v;$('now').classList.toggle('on',v)};
$('pause').onclick=e=>{paused=!paused;e.currentTarget.textContent=paused?'▶':'❚❚';e.currentTarget.classList.toggle('on',paused);setLive(false)};
$('rev').onclick=e=>{dirn*=-1;e.currentTarget.classList.toggle('on',dirn<0);setLive(false)};
$('rate').onchange=e=>{rate=+e.target.value;if(rate!==1)setLive(false)};
$('now').onclick=()=>{simMs=Date.now();rate=1;$('rate').value='1';paused=false;$('pause').textContent='❚❚';$('pause').classList.remove('on');dirn=1;$('rev').classList.remove('on');setLive(true)};
$('pick').onchange=e=>{const t=new Date(e.target.value).getTime();if(!isNaN(t)){simMs=t;setLive(false)}};
$('orb').onclick=e=>{const on=e.target.classList.toggle('on');[...orbitLines,...satLines].forEach(l=>l.visible=on)};
$('lab').onclick=e=>{showLabels=e.target.classList.toggle('on');labels.style.display=showLabels?'':'none'};
addEventListener('keydown',e=>{const tg=e.target.tagName;if(!['INPUT','SELECT','TEXTAREA'].includes(tg)&&!e.metaKey&&!e.ctrlKey&&!e.altKey){
  if(e.key==='/'){e.preventDefault();$('q').focus();return}if(e.key===' '&&tg!=='BUTTON'){e.preventDefault();$('pause').click();return}
  if(e.key==='n'||e.key==='N'){$('now').click();return}if(e.key==='+'||e.key==='='||e.key==='-'){const r=$('rate');r.selectedIndex=Math.max(0,Math.min(r.options.length-1,r.selectedIndex+(e.key==='-'?-1:1)));r.dispatchEvent(new Event('change'));return}}
 if(e.key==='Escape'){if(!$('sky').hidden)$('sky').hidden=true;else $('close').click()}});
