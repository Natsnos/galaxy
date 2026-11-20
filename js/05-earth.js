// Earth extras: vector map fallback, satellites, auroras, places and the pin
// Part of Interactive Galaxy. Files load in number order and share one global scope.

/* ---------- Earth: real continents, satellites, natural phenomena ---------- */
const earthO=objects.find(o=>o.id==='earth'),earthMesh=earthO.mesh,earthHolder=earthO.obj,ER=1.7;
function decodeRing(s,off,sc){const out=[];let px=off[0],py=off[1];for(let i=0;i<s.length;i+=2){let x=s.charCodeAt(i)-64,y=s.charCodeAt(i+1)-64;x=(x>>1)^(-(x&1));y=(y>>1)^(-(y&1));x+=px;y+=py;px=x;py=y;out.push([x/sc,y/sc])}return out}
function buildEarth(geo){if(window.__earthReal)return;const W=1024,H=512,mk=document.createElement('canvas');mk.width=W;mk.height=H;const m=mk.getContext('2d');m.fillStyle='#000';m.fillRect(0,0,W,H);m.fillStyle='#fff';
 const sc=geo.UTF8Scale||1024;
 for(const f of geo.features){const g=f.geometry;if(!g)continue;const polys=g.type==='Polygon'?[g.coordinates]:g.coordinates,offs=g.type==='Polygon'?[g.encodeOffsets]:g.encodeOffsets;
  polys.forEach((poly,pi)=>{m.beginPath();poly.forEach((ring,ri)=>{const pts=typeof ring==='string'?decodeRing(ring,offs[pi][ri],sc):ring;
   pts.forEach(([lo,la],k)=>{const x=(lo+180)/360*W,y=(90-la)/180*H;k?m.lineTo(x,y):m.moveTo(x,y)});m.closePath()});m.fill('evenodd')})}
 const md=m.getImageData(0,0,W,H).data,cv=document.createElement('canvas');cv.width=W;cv.height=H;const g=cv.getContext('2d'),im=g.createImageData(W,H),d=im.data;
 for(let j=0;j<H;j++){const lat=(.5-j/H)*Math.PI,al=Math.abs(lat)/D2R,cl=Math.cos(lat),sy=Math.sin(lat);
  for(let i=0;i<W;i++){const lon=i/W*Math.PI*2,x=cl*Math.cos(lon)+2,z=cl*Math.sin(lon)+2,y=sy+2,k=(j*W+i)*4,land=md[k]/255;
   const n=fbm(x*6,y*6,z*6,4,40);let sea=mix([6,24,64],[18,70,128],n*.8);
   const dryBand=Math.max(0,1-Math.abs(al-24)/14),dry=sm(.3,.7,dryBand*.8+fbm(x*3,y*3,z*3,3,41)*.6-.15);
   let c=mix(mix([40,88,38],[70,110,50],n),[196,166,112],dry);if(al>55)c=mix(c,[90,96,80],sm(55,64,al));c=mix(c,[120,105,90],sm(.68,.8,fbm(x*9,y*9,z*9,3,42))*.5);
   if((lat<0&&al>63)||al>66+n*6)c=[236,240,246];if(al>80+n*4&&lat>0)sea=[228,236,244];
   const o=mix(sea,c,land);d[k]=o[0];d[k+1]=o[1];d[k+2]=o[2];d[k+3]=255}}
 g.putImageData(im,0,0);texCache.earth={cv,data:d,W,H};earthMesh.material.map=new THREE.CanvasTexture(cv);earthMesh.material.needsUpdate=true;
 if(focus&&(focus.id==='earth'||focus.type==='loc'))portrait(focus)}
window.echarts={registerMap:(n,g)=>{try{buildEarth(g)}catch(e){console.log('map',e)}}};
function loadVectorMap(){const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/echarts@4.9.0/map/js/world.js';document.body.appendChild(s)}

const altR=km=>ER*(1+.9*Math.sqrt(km/6371));
const dotTex=glowTex('#bfffe6',.18);
const SAT_LINKS={iss:'https://spotthestation.nasa.gov/',all:'https://www.n2yo.com/'};
const SATS=[
 {id:'iss',name:'ISS',kind:'International Space Station (crewed)',inc:51.64,per:92.9,alt:420,raan:120,ph:0,sz:.32,
  facts:[['Altitude','~420 km'],['Speed','~28,000 km/h'],['Orbits per day','~15.5 (one every ~93 min)'],['Inclination','51.6°'],['Crew','Usually 7'],['Crewed since','November 2000']],
  desc:'The largest structure humans have put in space, about the size of a football field. It is often the brightest moving point in the night sky.',
  track:SAT_LINKS.iss,trackName:'Spot the Station — NASA ↗',wiki:'International_Space_Station',q:'international space station'},
 {id:'tiangong',name:'Tiangong',kind:'Chinese space station (crewed)',inc:41.47,per:91.4,alt:385,raan:250,ph:2,sz:.26,
  facts:[['Altitude','~385 km'],['Inclination','41.5°'],['Orbit','~91 min'],['Crew','Usually 3'],['Completed','2022']],
  desc:'China’s modular space station: the Tianhe core module plus the Wentian and Mengtian laboratory modules.',track:SAT_LINKS.all,trackName:'Live satellite tracker ↗',wiki:'Tiangong_space_station',q:'tiangong space station'},
 {id:'hubble',name:'Hubble',kind:'Space telescope',inc:28.47,per:95.4,alt:515,raan:30,ph:4,sz:.24,
  facts:[['Altitude','~515 km'],['Inclination','28.5°'],['Launched','April 1990'],['Mirror','2.4 m'],['Orbit','~95 min']],
  desc:'Hubble has made more than 1.5 million observations, from planets in our Solar System to galaxies near the edge of the observable universe.',track:SAT_LINKS.all,trackName:'Live satellite tracker ↗',real:NASA('mission/hubble/'),wiki:'Hubble_Space_Telescope',q:'hubble space telescope'},
];
const GEO=[['GOES-19 (GOES-East)',-75.2,'US weather satellite watching the Americas and Atlantic'],['GOES-18 (GOES-West)',-137.2,'US weather satellite watching the Pacific and western North America'],
 ['Meteosat (0°)',0,'European weather satellite over Africa and Europe'],['Himawari-9',140.7,'Japanese weather satellite over Asia and the western Pacific']];
const satGroup=new THREE.Object3D();earthHolder.add(satGroup);
function satPos(s,ms,uOff=0){const t=(ms-946728000000)/6e4,n=2*Math.PI/s.per,a=6378+s.alt,ir=s.inc*D2R;
 const O=(s.raan-1.5*n*1.08263e-3*(6378/a)**2*Math.cos(ir)*t/D2R)*D2R,u=s.ph+n*t+uOff;
 const v=eqToThree(Math.cos(O)*Math.cos(u)-Math.sin(O)*Math.sin(u)*Math.cos(ir),Math.sin(O)*Math.cos(u)+Math.cos(O)*Math.sin(u)*Math.cos(ir),Math.sin(u)*Math.sin(ir));
 return v.multiplyScalar(altR(s.alt))}
const satLines=[];
for(const s of SATS){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:dotTex,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));sp.scale.set(s.sz,s.sz,1);satGroup.add(sp);s.sp=sp;
 const ln=new THREE.Line(new THREE.BufferGeometry(),new THREE.LineBasicMaterial({color:0x5fe0b0,transparent:true,opacity:.35}));ln.frustumCulled=false;satGroup.add(ln);s.line=ln;satLines.push(ln);
 reg({...s,kind:s.kind},sp,'sat',1.6)}
// constellations: GPS (6 planes x 4) and a Starlink-like shell
const CONS=[{id:'gps',name:'GPS constellation',kind:'Navigation satellites (31 active)',inc:55,per:717.97,alt:20200,planes:6,per_plane:4,col:'#ffd27a',sz:.16,
  facts:[['Altitude','~20,200 km'],['Orbit','~12 hours (2 per day)'],['Inclination','55°'],['Planes','6'],['Run by','U.S. Space Force']],
  desc:'At least four GPS satellites are always above any point on Earth. Your phone times their signals to work out where you are. Orbit planes here are representative.',track:SAT_LINKS.all,trackName:'Live satellite tracker ↗',wiki:'Global_Positioning_System',q:'GPS satellite'},
 {id:'starlink',name:'Starlink shell',kind:'Internet satellite megaconstellation',inc:53,per:95.6,alt:550,planes:36,per_plane:30,col:'#a8c8ff',sz:.05,
  facts:[['Altitude','~550 km (main shell)'],['Inclination','53°'],['Satellites in orbit','Thousands, growing every month'],['Orbit','~96 min']],
  desc:'SpaceX’s broadband network is now the largest satellite constellation ever built. This shows one representative shell of 1,080 satellites.',track:'https://satellitemap.space/',trackName:'Live Starlink map ↗',wiki:'Starlink',q:'starlink satellites'}];
for(const c of CONS){const n=c.planes*c.per_plane,g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(n*3),3));
 const pts=new THREE.Points(g,new THREE.PointsMaterial({color:c.col,size:c.id==='gps'?.09:.04,map:dotTex,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));pts.frustumCulled=false;satGroup.add(pts);c.pts=pts;
 const anchor=new THREE.Object3D();satGroup.add(anchor);c.anchor=anchor;reg(c,anchor,'sat',c.id==='gps'?14:4)}
function updateCons(ms){for(const c of CONS){const arr=c.pts.geometry.attributes.position.array;let k=0;
 if(c.recs){for(const r of c.recs){const v=satECI(r,ms);if(v){arr[k++]=v.x;arr[k++]=v.y;arr[k++]=v.z}else k+=3}c.pts.geometry.attributes.position.needsUpdate=true;c.anchor.position.set(arr[0],arr[1],arr[2]);continue}
 for(let p=0;p<c.planes;p++)for(let q=0;q<c.per_plane;q++){const v=satPos({...c,raan:p*360/c.planes,ph:q*2*Math.PI/c.per_plane+p*.37},ms);arr[k++]=v.x;arr[k++]=v.y;arr[k++]=v.z}
 c.pts.geometry.attributes.position.needsUpdate=true;c.anchor.position.set(arr[0],arr[1],arr[2])}}
// geostationary: fixed over real longitudes, so they ride on the rotating Earth
const llLocal=(lat,lon,r)=>{lat*=D2R;lon*=D2R;return new THREE.Vector3(Math.cos(lat)*Math.cos(lon)*r,Math.sin(lat)*r,-Math.cos(lat)*Math.sin(lon)*r)};
for(const[nm,lon,what]of GEO){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex('#ffe08a',.2),blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));sp.scale.set(.22,.22,1);
 sp.position.copy(llLocal(0,lon,altR(35786)));earthMesh.add(sp);
 reg({id:'geo'+lon,name:nm,kind:'Geostationary weather satellite',lon,facts:[['Altitude','35,786 km'],['Parked over',`${Math.abs(lon)}° ${lon<0?'W':'E'}, equator`],['Orbit','Once per sidereal day (23 h 56 min)']],
  desc:`${what}. A geostationary orbit matches Earth’s spin exactly, so it hovers over one spot and images the same hemisphere every few minutes. Its position here is exact.`,
  track:'https://zoom.earth/',trackName:'Live satellite cloud imagery ↗',wiki:'Geostationary_orbit',q:nm.split(' ')[0]+' satellite'},sp,'sat',4)}
// JWST at Sun–Earth L2 (1.5 million km beyond Earth, away from the Sun)
const jwst=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex('#ffd36b',.2),blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));jwst.scale.set(.5,.5,1);earthHolder.add(jwst);
reg({id:'jwst',name:'James Webb Space Telescope',kind:'Infrared space telescope at Sun–Earth L2',facts:[['Distance from Earth','~1.5 million km'],['Location','Sun–Earth L2, always opposite the Sun'],['Mirror','6.5 m, 18 gold-coated segments'],['Launched','25 December 2021']],
 desc:'Webb sees in infrared light, so it can look through dust and back to the first galaxies. Its tennis-court-sized sunshield keeps it below −220 °C.',real:NASA('mission/webb/'),wiki:'James_Webb_Space_Telescope',q:'james webb'},jwst,'sat',3);
// Sun-overhead point, aurora zones (geomagnetic poles, IGRF 2025)
const subsolar=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex('#ffcc33',.3),blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));subsolar.scale.set(.5,.5,1);earthMesh.add(subsolar);
reg({id:'subsolar',name:'Sun overhead',kind:'Subsolar point — computed live',facts:[['What it is','The spot where the Sun is directly overhead'],['Moves','~1,670 km/h westward at the equator'],['Range','Between 23.4° N and 23.4° S']],
 desc:'Everyone on the lit half of Earth is in daytime. The terminator, the line between day and night on the globe, is also drawn live from the Sun’s real position.',wiki:'Subsolar_point'},subsolar,'nat',4);
const AUR=[[80.8,-72.6],[-80.8,107.4]];
for(const[i,[pl,plo]]of AUR.entries()){const pole=llLocal(pl,plo,1).normalize(),ref=Math.abs(pole.y)<.9?new THREE.Vector3(0,1,0):new THREE.Vector3(1,0,0),e1=ref.clone().cross(pole).normalize(),e2=pole.clone().cross(e1);
 const pos=[];for(let k=0;k<900;k++){const th=Math.random()*Math.PI*2,rr=(19+Math.random()*7)*D2R,h=ER*(1.012+Math.random()*.02);
  pos.push(...pole.clone().multiplyScalar(Math.cos(rr)).add(e1.clone().multiplyScalar(Math.sin(rr)*Math.cos(th))).add(e2.clone().multiplyScalar(Math.sin(rr)*Math.sin(th))).multiplyScalar(h).toArray())}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
 {const ap=new THREE.Points(g,new THREE.PointsMaterial({color:0x4dff9a,size:.06,map:dotTex,transparent:true,opacity:.28,blending:THREE.AdditiveBlending,depthWrite:false}));earthMesh.add(ap);(window.__aurStatic=window.__aurStatic||[]).push(ap)}
 const an=new THREE.Object3D();an.position.copy(pole.multiplyScalar(ER*1.05));earthMesh.add(an);
 reg({id:'aurora'+i,name:i?'Aurora australis zone':'Aurora borealis zone',kind:'Auroral oval around the geomagnetic pole',facts:[['Centred on',`Geomagnetic ${i?'south':'north'} pole (${Math.abs(pl)}° ${i?'S':'N'})`],['Altitude of glow','~100–300 km'],['Colours','Green (oxygen), red, purple (nitrogen)']],
  desc:'Charged particles from the Sun pour down Earth’s magnetic field lines here and make the upper air glow. The ring shows the typical zone. During solar storms it grows toward the equator. Check the live forecast for tonight.',
  track:'https://www.swpc.noaa.gov/products/aurora-30-minute-forecast',trackName:'Live aurora forecast — NOAA ↗',wiki:'Aurora',q:'aurora from space station'},an,'nat',4)}
// places
const PLACES=[['New York',40.7128,-74.006,'America/New_York'],['Los Angeles',34.0522,-118.2437,'America/Los_Angeles'],['Chicago',41.8781,-87.6298,'America/Chicago'],['Grand Canyon',36.1069,-112.1129,'America/Phoenix'],['Kennedy Space Center',28.5729,-80.649,'America/New_York'],['Mexico City',19.4326,-99.1332,'America/Mexico_City'],['Honolulu',21.3069,-157.8583,'Pacific/Honolulu'],['Anchorage',61.2181,-149.9003,'America/Anchorage'],['Amazon (Manaus)',-3.119,-60.0217,'America/Manaus'],['Rio de Janeiro',-22.9068,-43.1729,'America/Sao_Paulo'],['Reykjavík',64.1466,-21.9426,'Atlantic/Reykjavik'],['London',51.5074,-0.1278,'Europe/London'],['Paris',48.8566,2.3522,'Europe/Paris'],['Rome',41.9028,12.4964,'Europe/Rome'],['Pyramids of Giza',29.9792,31.1342,'Africa/Cairo'],['Sahara Desert',23.4162,25.6628,'Africa/Tripoli'],['Nairobi',-1.2921,36.8219,'Africa/Nairobi'],['Dubai',25.2048,55.2708,'Asia/Dubai'],['Mumbai',19.076,72.8777,'Asia/Kolkata'],['Mount Everest',27.9881,86.925,'Asia/Kathmandu'],['Beijing',39.9042,116.4074,'Asia/Shanghai'],['Tokyo',35.6762,139.6503,'Asia/Tokyo'],['Sydney',-33.8688,151.2093,'Australia/Sydney'],['South Pole',-90,0,'Antarctica/McMurdo']];
$('place').innerHTML=PLACES.map((p,i)=>`<option value="${i}">${p[0]}</option>`).join('');
const pin=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex('#ff5a5a',.25),blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));pin.scale.set(.18,.18,1);pin.visible=false;earthMesh.add(pin);
const locO=reg({id:'loc',name:'Location',kind:'Place on Earth',facts:[],desc:''},pin,'loc',.35);
const pinRing=new THREE.Sprite(new THREE.SpriteMaterial({map:(()=>{const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');g.strokeStyle='#ff5a5a';g.lineWidth=8;g.beginPath();g.arc(64,64,52,0,7);g.stroke();return new THREE.CanvasTexture(c)})(),transparent:true,depthWrite:false}));pin.add(pinRing);
// real satellite imagery draped on the globe around a place (Esri World Imagery), at three detail levels
const DETAIL=[['region',8,.35],['city',1.2,.06],['street',.16,.009]];let detailMeshes=[];
// soft edges so a patch blends into the globe instead of showing a hard box
let _feather=null;function featherTex(){if(_feather)return _feather;const N=128,c=document.createElement('canvas');c.width=c.height=N;const g=c.getContext('2d'),im=g.createImageData(N,N);
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){const e=Math.min(x,N-1-x,y,N-1-y)/(N*.14),v=Math.round(255*Math.max(0,Math.min(1,e))*Math.max(0,Math.min(1,e))*(3-2*Math.max(0,Math.min(1,e)))),k=(y*N+x)*4;im.data[k]=im.data[k+1]=im.data[k+2]=v;im.data[k+3]=255}
 g.putImageData(im,0,0);return _feather=new THREE.CanvasTexture(c)}
// each patch shows only when you're zoomed in close enough to need it
function fadeDetail(){if(!detailMeshes.length)return;const ds=camera.position.distanceTo(worldPos(earthO))-ER;
 for(const m of detailMeshes){const w=m.userData.w,o=Math.max(0,Math.min(1,(w*3-ds)/(w*1.5)));m.material.opacity=o;m.visible=o>.01}}
const esri=(w,s_,e,n)=>`https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=${w},${s_},${e},${n}&bboxSR=4326&imageSR=4326&size=1024,1024&format=jpg&f=image`;
function loadDetail(lat,lon){detailMeshes.forEach(m=>{earthMesh.remove(m);m.geometry.dispose&&m.geometry.dispose()});detailMeshes=[];if(Math.abs(lat)>84){$('detailcap').textContent='';return}
 let done=0;DETAIL.forEach(([nm,dLat],i)=>{const dLon=Math.min(60,dLat/Math.max(.15,Math.cos(lat*D2R))),N=Math.min(85,lat+dLat/2),S=Math.max(-85,lat-dLat/2),W=lon-dLon/2,E=lon+dLon/2;
  const img=new Image();img.crossOrigin='anonymous';
  img.onload=()=>{if(locO.lat!==lat||locO.lon!==lon)return;const t=new THREE.Texture(img);t.needsUpdate=true;
   const g=new THREE.SphereGeometry(ER*(1.0004+i*.00025),48,48,(W+180)*D2R,dLon*D2R,(90-N)*D2R,(N-S)*D2R);
   const m=new THREE.Mesh(g,new THREE.MeshPhongMaterial({map:t,alphaMap:featherTex(),transparent:true,depthWrite:false,shininess:0,specular:0x000000,emissive:0xffffff,emissiveMap:t,emissiveIntensity:.05,opacity:0}));m.renderOrder=2+i;m.userData.w=dLat*D2R*ER;earthMesh.add(m);detailMeshes.push(m);
   done++;FEED['satellite imagery (Esri)']=true;feedMsg();$('detailcap').textContent='Real satellite imagery: Esri World Imagery (Esri, Maxar, Earthstar Geographics). Scroll or pinch to zoom closer.'};
  img.onerror=()=>{FEED['satellite imagery (Esri)']=false;feedMsg()};img.src=esri(W,S,E,N)})}
function zoomTo(level){const d=DETAIL.find(x=>x[0]===level);if(!d||!pin.visible)return;focus=locO;fly={t:0,from:controls.target.clone(),camFrom:camera.position.clone(),dist:d[2],dir:new THREE.Vector3(),obj:locO,surface:true};
 document.querySelectorAll('[data-z]').forEach(b=>b.classList.toggle('on',b.dataset.z===level))}
document.querySelectorAll('[data-z]').forEach(b=>b.onclick=()=>zoomTo(b.dataset.z));
$('chipgo').onclick=()=>select(locO);
$('chipx').onclick=()=>{pin.visible=false;$('chip').hidden=true;detailMeshes.forEach(m=>earthMesh.remove(m));detailMeshes=[];if(focus===locO){focus=null;$('info').classList.remove('open')}};
const fmtLL=(lat,lon)=>`${Math.abs(lat).toFixed(2)}° ${lat<0?'S':'N'}, ${Math.abs(lon).toFixed(2)}° ${lon<0?'W':'E'}`;
function flyToPlace(name,lat,lon,tz,info={}){pin.position.copy(llLocal(lat,lon,ER*1.004));pin.visible=true;const full=info.full||null,gq=encodeURIComponent(full||`${lat},${lon}`);
 Object.assign(locO,{name,lat,lon,tz,full,wx:null,kind:'Place on Earth · '+fmtLL(lat,lon),facts:(full?[['Address',full]]:[]).concat([['Latitude',lat.toFixed(5)+'°'],['Longitude',lon.toFixed(5)+'°']]),
  desc:'Pinned on the globe at its true position, turning with Earth in real time. The lighting shows whether it is day or night there right now. Open the links for street-level satellite imagery and live weather.',
  links:[['Open in Google Maps ↗',full?`https://www.google.com/maps/search/?api=1&query=${gq}`:`https://www.google.com/maps/@?api=1&map_action=map&center=${lat},${lon}&zoom=18&basemap=satellite`,1],
   ['Street View ↗',`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lon}`],
   ['Google Earth 3D ↗',`https://earth.google.com/web/@${lat},${lon},0a,4000d,35y,0h,45t,0r`],
   ['Live weather radar & wind — Windy ↗',`https://www.windy.com/?${lat.toFixed(3)},${lon.toFixed(3)},9`],
   ['Live satellite clouds — Zoom Earth ↗',`https://zoom.earth/maps/satellite/#view=${lat.toFixed(3)},${lon.toFixed(3)},7z`]]});
 locO.el.textContent=name;$('q').value='';
 $('chip').hidden=false;$('chipname').textContent=name;$('chipg').href=locO.links[0][1];loadDetail(lat,lon);select(locO);document.querySelectorAll('[data-z]').forEach(b=>b.classList.toggle('on',b.dataset.z==='region'))}
$('flyp').onclick=()=>{const p=PLACES[$('place').value];flyToPlace(...p)};
const parseLL=()=>{const m=$('ll').value.match(/(-?\d+(?:\.\d+)?)\s*[, ]\s*(-?\d+(?:\.\d+)?)/);if(!m)return null;const lat=+m[1],lon=+m[2];return Math.abs(lat)<=90&&Math.abs(lon)<=180?[lat,lon]:null};
$('flyll').onclick=()=>runSearch($('ll').value,$('llerr'));
$('ll').onkeydown=e=>{if(e.key==='Enter')$('flyll').click()};
