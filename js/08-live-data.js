// Live data: photos, Earth imagery, satellite TLEs, earthquakes, natural events, weather, ISS passes
// Part of Interactive Galaxy. Files load in number order and share one global scope.

/* ---------- live data (works wherever the page may reach outside services) ---------- */
const FEED={};const feedMsg=()=>{const on=Object.entries(FEED).filter(([k,v])=>v).map(([k])=>k),tried=Object.keys(FEED).length;
 $('feeds').textContent=!tried?'':on.length?`Live feeds: ${on.join(', ')}`:'Live feeds are blocked in this view. Open the self-hosted copy for live data.'};
async function getData(u,text){try{const c=new AbortController(),tm=setTimeout(()=>c.abort(),12000);const r=await fetch(u,{signal:c.signal});clearTimeout(tm);if(!r.ok)return null;return text?await r.text():await r.json()}catch(e){return null}}
const loadScript=src=>new Promise(res=>{const s=document.createElement('script');s.src=src;s.onload=()=>res(true);s.onerror=()=>res(false);document.head.appendChild(s)});
// real photos from Wikipedia / Wikimedia Commons
const photoCache={};const PLACE_WIKI={'New York':'New_York_City','Amazon (Manaus)':'Manaus','Sahara Desert':'Sahara','Pyramids of Giza':'Giza_pyramid_complex','Rome':'Rome','Paris':'Paris'};
// famous real photos; if one can't load, the page falls back to Wikipedia's lead image, then to the 3D model
const PHOTOS={sun:['https://sdo.gsfc.nasa.gov/assets/img/latest/latest_1024_0304.jpg','The Sun right now · NASA Solar Dynamics Observatory (ultraviolet, updated every few minutes)'],
 mercury:['Mercury_in_true_color.jpg','Mercury · NASA MESSENGER'],venus:['Venus-real_color.jpg','Venus in true colour · NASA Mariner 10'],earth:['The_Earth_seen_from_Apollo_17.jpg','“The Blue Marble” · Apollo 17 crew, 1972'],
 moon:['FullMoon2010.jpg','The full Moon · Gregory H. Revera'],mars:['OSIRIS_Mars_true_color.jpg','Mars · ESA Rosetta OSIRIS'],jupiter:['Jupiter_and_its_shrunken_Great_Red_Spot.jpg','Jupiter · NASA/ESA Hubble'],
 saturn:['Saturn_during_Equinox.jpg','Saturn · NASA Cassini'],uranus:['Uranus2.jpg','Uranus · NASA Voyager 2'],neptune:['Neptune_-_Voyager_2_(29347980845)_flatten_crop.jpg','Neptune · NASA Voyager 2'],
 pluto:['Pluto_in_True_Color_-_High-Res.jpg','Pluto · NASA New Horizons'],charon:['Charon_in_True_Color_-_High-Res.jpg','Charon · NASA New Horizons'],
 io:['Io_highest_resolution_true_color.jpg','Io · NASA Galileo'],europa:['Europa-moon-with-margins.jpg','Europa · NASA Galileo'],ganymede:['Ganymede_g1_true-edit1.jpg','Ganymede · NASA Galileo'],callisto:['Callisto.jpg','Callisto · NASA Galileo'],
 titan:['Titan_in_true_color.jpg','Titan · NASA Cassini'],enceladus:['PIA17202_-_Approaching_Enceladus.jpg','Enceladus · NASA Cassini'],mimas:['Mimas_Cassini.jpg','Mimas · NASA Cassini'],
 iapetus:['Iapetus_as_seen_by_the_Cassini_probe_-_20071008.jpg','Iapetus · NASA Cassini'],triton:['Triton_moon_mosaic_Voyager_2_(large).jpg','Triton · NASA Voyager 2'],phobos:['Phobos_colour_2008.jpg','Phobos · NASA Mars Reconnaissance Orbiter'],
 miranda:['Miranda.jpg','Miranda · NASA Voyager 2'],
 betelgeuse:['Orion_Head_to_Toe.jpg','Orion, with red Betelgeuse at top left and blue Rigel at bottom right · Rogelio Bernal Andreo'],rigel:['Orion_Head_to_Toe.jpg','Orion, with blue Rigel at bottom right · Rogelio Bernal Andreo'],
 sirius:['Sirius_A_and_B_Hubble_photo.jpg','Sirius A with its tiny companion Sirius B (lower left) · NASA/ESA Hubble'],proxima:['New_shot_of_Proxima_Centauri,_our_nearest_neighbour.jpg','Proxima Centauri · ESA/Hubble & NASA'],
 acen:['Alpha,_Beta_and_Proxima_Centauri_(1).jpg','Alpha Centauri (left), with Proxima circled · Skatebiker'],
 andromeda:['Andromeda_Galaxy_(with_h-alpha).jpg','The Andromeda Galaxy · Adam Evans'],milky:['ESO_-_Milky_Way.jpg','The Milky Way over the Atacama Desert · ESO'],
 halley:['Lspn_comet_halley.jpg','Halley’s Comet in 1986 · NASA'],halebopp:['Comet-Hale-Bopp-29-03-1997_hires_adj.jpg','Comet Hale–Bopp in 1997 · Philipp Salzgeber'],
 iss:['International_Space_Station_after_undocking_of_STS-132.jpg','The ISS · NASA'],hubble:['HST-SM4.jpeg','Hubble after its last servicing mission · NASA'],belt:['Vesta_full_mosaic.jpg','Asteroid Vesta · NASA Dawn']};
const commons=f=>f.startsWith('http')?f:`https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(f)}?width=800`;
let phMode='photo';
document.querySelectorAll('[data-ph]').forEach(b=>b.onclick=()=>{phMode=b.dataset.ph;document.querySelectorAll('[data-ph]').forEach(x=>x.classList.toggle('on',x===b));if(focus)loadPhoto(focus)});
function showPhoto(o,src,cap,onfail){const img=$('photo');img.onload=()=>{if(focus!==o)return;img.hidden=false;$('phbadge').hidden=false;$('pic').hidden=true;$('phtog').hidden=false;$('piccap').textContent='Real photo: '+cap};img.onerror=onfail;img.alt=cap;img.src=src}
async function loadPhoto(o){$('phbadge').hidden=true;$('phtog').hidden=true;
 if(phMode==='model'&&o.type!=='loc'){$('photo').hidden=true;$('pic').hidden=false;$('phtog').hidden=false;$('piccap').textContent='3D model view, drawn from the same maps used on the globe.';return}
 const P=PHOTOS[o.id];if(P&&o.type!=='loc'){$('photo').hidden=true;$('pic').hidden=false;$('piccap').textContent='Loading a real photo…';showPhoto(o,commons(P[0]),P[1],()=>{if(focus===o)loadPhotoWiki(o)});return}
 return loadPhotoWiki(o)}
async function loadPhotoWiki(o){if(o.photo){const img=$('photo');img.hidden=true;$('pic').hidden=false;img.onload=()=>{if(focus!==o)return;img.hidden=false;$('pic').hidden=true;$('phbadge').hidden=false;$('piccap').textContent='Real photo: Launch Library 2 (The Space Devs)'};img.onerror=()=>{};img.src=o.photo;return}
 const img=$('photo'),title=o.type==='loc'?(PLACE_WIKI[o.name]||(o.name!=='Pinned spot'&&o.name!=='Your location'?o.name.replace(/ /g,'_'):null)):o.wiki;
 img.hidden=true;$('pic').hidden=false;$('piccap').textContent='3D model view. Tap below for real telescope and spacecraft photos.';if(!title)return;
 let j=photoCache[title];if(j===undefined){j=photoCache[title]=await getData('https://en.wikipedia.org/api/rest_v1/page/summary/'+title);FEED.photos=!!j;feedMsg()}
 const src=j&&(j.thumbnail?.source?.replace(/\/\d+px-/,'/800px-')||j.originalimage?.source);if(!src||focus!==o)return;
 img.onload=()=>{if(focus!==o)return;img.hidden=false;$('pic').hidden=true;$('phbadge').hidden=false;$('phtog').hidden=o.type==='loc';$('piccap').textContent=`Real photo: ${j.title}, from Wikipedia / Wikimedia Commons`};
 img.onerror=()=>{if(j.originalimage&&img.src!==j.originalimage.source)img.src=j.originalimage.source};img.src=src}
// Earth imagery from NASA GIBS
const gibs=(layer,date)=>`https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=${layer}&CRS=EPSG:4326&BBOX=-90,-180,90,180&WIDTH=2048&HEIGHT=1024&FORMAT=image/jpeg${date?'&TIME='+date:''}`;
const earthTex={};let mapTex=null;
function setEarthImg(kind){document.querySelectorAll('[data-img]').forEach(b=>b.classList.toggle('on',b.dataset.img===kind));const cl=BODIES.find(b=>b.id==='earth')._cl;
 if(kind==='map'){if(mapTex){earthMesh.material.map=mapTex;earthMesh.material.needsUpdate=true}cl.visible=wxMode!=='off';return}
 const use=t=>{earthMesh.material.map=t;earthMesh.material.needsUpdate=true;cl.visible=kind!=='yday'&&wxMode!=='off'};
 if(earthTex[kind]){use(earthTex[kind]);return}
 const y=new Date(Date.now()-864e5).toISOString().slice(0,10),img=new Image();img.crossOrigin='anonymous';
 img.onload=()=>{const t=new THREE.Texture(img);t.needsUpdate=true;earthTex[kind]=t;use(t);FEED['NASA Earth imagery']=true;feedMsg()};
 img.onerror=()=>{FEED['NASA Earth imagery']=false;feedMsg();$('llerr').textContent='NASA imagery couldn’t load here.'};
 img.src=kind==='bm'?gibs('BlueMarble_ShadedRelief_Bathymetry'):gibs('VIIRS_SNPP_CorrectedReflectance_TrueColor',y)}
document.querySelectorAll('[data-img]').forEach(b=>b.onclick=()=>{if(!mapTex)mapTex=earthMesh.material.map;setEarthImg(b.dataset.img)});
// satellites from CelesTrak TLEs, propagated with SGP4 (satellite.js)
function satECI(rec,ms){const pv=window.satellite.propagate(rec,new Date(ms));const p=pv&&pv.position;if(!p||isNaN(p.x))return null;const r=Math.hypot(p.x,p.y,p.z);return eqToThree(p.x/r,p.y/r,p.z/r).multiplyScalar(altR(r-6378))}
function issLook(loc,ms){const rec=SATS[0].satrec,S=window.satellite,d=new Date(ms),pv=S.propagate(rec,d);if(!pv.position)return null;const ecf=S.eciToEcf(pv.position,S.gstime(d)),l=S.ecfToLookAngles({latitude:loc.lat*D2R,longitude:loc.lon*D2R,height:0},ecf);return{el:l.elevation/D2R,az:l.azimuth/D2R}}
const parseTLE=t=>{const L=t.split(/\r?\n/).map(x=>x.trimEnd()).filter(Boolean),out=[];for(let i=0;i+2<L.length+1;i++)if(L[i+1]?.startsWith('1 ')&&L[i+2]?.startsWith('2 ')){out.push([L[i].trim(),L[i+1],L[i+2]]);i+=2}return out};
async function liveSats(){const ok=await loadScript('https://cdn.jsdelivr.net/npm/satellite.js@4.1.4/dist/satellite.min.js');if(!ok||!window.satellite){FEED['satellite tracking']=false;feedMsg();return}
 const st=await getData('https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=tle',true),hb=await getData('https://celestrak.org/NORAD/elements/gp.php?CATNR=20580&FORMAT=tle',true),gps=await getData('https://celestrak.org/NORAD/elements/gp.php?GROUP=gps-ops&FORMAT=tle',true);
 const all=[...parseTLE(st||''),...parseTLE(hb||'')],find=re=>all.find(x=>re.test(x[0]));
 [[SATS[0],/^ISS \(ZARYA\)/],[SATS[1],/^CSS \(TIANHE\)/],[SATS[2],/HST|HUBBLE/]].forEach(([s,re])=>{const t=find(re);if(t){s.satrec=window.satellite.twoline2satrec(t[1],t[2]);objects.find(o=>o.id===s.id).kind=s.kind+' · live position'}});
 const g=parseTLE(gps||'');if(g.length){const c=CONS[0];c.recs=g.map(t=>window.satellite.twoline2satrec(t[1],t[2]));c.pts.geometry.setAttribute('position',new THREE.BufferAttribute(new Float32Array(c.recs.length*3),3));objects.find(o=>o.id==='gps').kind=`Navigation satellites · ${g.length} live`}
 FEED['satellite tracking']=!!(st||hb);feedMsg();orbitAt=-1e15}
// earthquakes (USGS) and natural events (NASA EONET)
const EVCOL={Wildfires:'#ff7a2e',Volcanoes:'#ff3b3b','Severe Storms':'#5ad1ff','Sea and Lake Ice':'#e8f4ff',Floods:'#3f8cff',Earthquakes:'#ffd23f',Drought:'#d9a441',Landslides:'#b07a4a','Dust and Haze':'#d9c79a',Snow:'#ffffff','Temperature Extremes':'#ff4fa3',Manmade:'#c0c0c0','Water Color':'#40e0d0'};
// each kind of marker gets its own symbol, so they can be told apart at a glance
const glyphCache={};
function glyphTex(kind,col){const key=kind+col;if(glyphCache[key])return glyphCache[key];const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');g.translate(32,32);
 g.lineWidth=5;g.strokeStyle='#000a';g.fillStyle=col;g.lineJoin='round';
 const sh=()=>{g.stroke();g.fill()};
 if(kind==='quake'){g.fillStyle='#0000';g.strokeStyle='#000a';g.lineWidth=9;[10,20].forEach(r=>{g.beginPath();g.arc(0,0,r,0,7);g.stroke()});g.strokeStyle=col;g.lineWidth=4;[10,20].forEach(r=>{g.beginPath();g.arc(0,0,r,0,7);g.stroke()});g.fillStyle=col;g.beginPath();g.arc(0,0,4,0,7);g.fill()}
 else if(kind==='fire'){g.beginPath();g.moveTo(0,-24);g.bezierCurveTo(16,-6,18,8,12,16);g.quadraticCurveTo(0,26,-12,16);g.bezierCurveTo(-18,6,-8,-4,0,-24);sh();g.fillStyle='#ffe28a';g.beginPath();g.moveTo(0,-4);g.quadraticCurveTo(8,8,4,16);g.quadraticCurveTo(0,20,-4,16);g.quadraticCurveTo(-8,8,0,-4);g.fill()}
 else if(kind==='storm'){g.lineWidth=9;g.strokeStyle='#000a';const sp=()=>{g.beginPath();for(let a=0;a<4.4*Math.PI;a+=.2){const r=2+a*1.55;g.lineTo(Math.cos(a)*r,Math.sin(a)*r)}g.stroke()};sp();g.lineWidth=4.5;g.strokeStyle=col;sp()}
 else if(kind==='volcano'){g.beginPath();g.moveTo(-22,18);g.lineTo(-6,-12);g.lineTo(6,-12);g.lineTo(22,18);g.closePath();sh();g.fillStyle='#ff3b1f';g.beginPath();g.arc(0,-18,6,0,7);g.fill()}
 else if(kind==='launch'){g.beginPath();g.moveTo(0,-26);g.quadraticCurveTo(10,-12,9,10);g.lineTo(16,20);g.lineTo(-16,20);g.lineTo(-9,10);g.quadraticCurveTo(-10,-12,0,-26);sh();g.fillStyle='#4a2a00';g.beginPath();g.arc(0,-6,4,0,7);g.fill()}
 else{g.beginPath();g.moveTo(0,-20);g.lineTo(18,0);g.lineTo(0,20);g.lineTo(-18,0);g.closePath();sh()}
 return glyphCache[key]=new THREE.CanvasTexture(c)}
const LAYERS={quakes:{name:'Earthquakes',col:'#ffd23f',glyph:'quake',on:true},fires:{name:'Wildfires',col:'#ff7a2e',glyph:'fire',on:true},storms:{name:'Storms',col:'#5ad1ff',glyph:'storm',on:true},
 volcanoes:{name:'Volcanoes',col:'#ff3b3b',glyph:'volcano',on:true},launches:{name:'Rocket launches',col:'#ffb347',glyph:'launch',on:true},other:{name:'Other events',col:'#e8f4ff',glyph:'other',on:true}};
const layerOf=cat=>({Wildfires:'fires','Severe Storms':'storms',Volcanoes:'volcanoes'}[cat]||'other');
const MARKERS=[];
function addMarker(lat,lon,col,size,data,type,layer){const L=LAYERS[layer||'other'];const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:glyphTex(L.glyph,layer==='other'?col:L.col),transparent:true,depthWrite:false}));
 const k=Math.min(.16,Math.max(.07,size*.8));sp.scale.set(k,k,1);sp.userData.base=k;MARKERS.push(sp);sp.position.copy(llLocal(lat,lon,ER*1.008));sp.visible=L.on;earthMesh.add(sp);const o=reg({...data,lat,lon,layer:layer||'other'},sp,type,1.4);renderLegend();return o}
function renderLegend(){const el=$('mklegend');if(!el)return;const cnt={};objects.forEach(o=>{if(o.layer)cnt[o.layer]=(cnt[o.layer]||0)+1});const ks=Object.keys(LAYERS).filter(k=>cnt[k]);
 $('mkx').dataset.has=ks.length?'1':'';el.innerHTML=ks.map(k=>`<button data-layer="${k}" class="${LAYERS[k].on?'on':''}" aria-pressed="${LAYERS[k].on}"><img src="${glyphTex(LAYERS[k].glyph,LAYERS[k].col).image.toDataURL()}" alt="" width="20" height="20">${LAYERS[k].name} (${cnt[k]})</button>`).join('')}
$('mklegend').addEventListener('click',e=>{const b=e.target.closest('[data-layer]');if(!b)return;const L=LAYERS[b.dataset.layer];L.on=!L.on;objects.forEach(o=>{if(o.layer===b.dataset.layer)o.obj.visible=L.on});renderLegend()});
async function liveEarth(){const q=await getData('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson');
 if(q){for(const f of q.features){const[lo,la,dep]=f.geometry.coordinates,p=f.properties;addMarker(la,lo,'#ffd23f',.05+p.mag*.02,{id:'q'+f.id,name:`M${p.mag.toFixed(1)} earthquake`,kind:p.place||'Earthquake',
   facts:[['Magnitude',p.mag.toFixed(1)],['Depth',dep.toFixed(0)+' km'],['When',new Date(p.time).toLocaleString()],['Location',fmtLL(la,lo)],['Tsunami flag',p.tsunami?'Yes':'No']],desc:'From the USGS live feed of magnitude 4.5+ earthquakes over the past week.',links:[['USGS event page ↗',p.url,1],['Live earthquake map — USGS ↗','https://earthquake.usgs.gov/earthquakes/map/']]},'quake','quakes')}FEED['earthquakes (USGS)']=true}else FEED['earthquakes (USGS)']=false;
 const ev=await getData('https://eonet.gsfc.nasa.gov/api/v3/events?status=open&days=30&limit=200');
 if(ev){for(const e of ev.events){const gm=e.geometry[e.geometry.length-1];if(!gm)continue;let c=gm.coordinates;while(Array.isArray(c[0]))c=c[0];const cat=e.categories[0]?.title||'Event';
   addMarker(c[1],c[0],EVCOL[cat]||'#ffffff',.14,{id:'e'+e.id,name:e.title,kind:cat+' · NASA EONET',facts:[['Type',cat],['Latest update',new Date(gm.date).toLocaleString()],['Location',fmtLL(c[1],c[0])]].concat(gm.magnitudeValue?[['Magnitude',`${gm.magnitudeValue} ${gm.magnitudeUnit||''}`]]:[]),
    desc:'An open natural event tracked by NASA’s Earth Observatory Natural Event Tracker (EONET).',links:[e.sources?.[0]?.url&&['Source report ↗',e.sources[0].url,1],['See it from space — NASA Worldview ↗',`https://worldview.earthdata.nasa.gov/?v=${c[0]-8},${c[1]-5},${c[0]+8},${c[1]+5}`]].filter(Boolean)},'event',layerOf(cat))}FEED['natural events (NASA)']=true}else FEED['natural events (NASA)']=false;
 feedMsg()}
// weather at a location (Open-Meteo)
const WMO={0:'Clear',1:'Mostly clear',2:'Partly cloudy',3:'Overcast',45:'Fog',48:'Freezing fog',51:'Light drizzle',53:'Drizzle',55:'Heavy drizzle',61:'Light rain',63:'Rain',65:'Heavy rain',66:'Freezing rain',67:'Heavy freezing rain',71:'Light snow',73:'Snow',75:'Heavy snow',77:'Snow grains',80:'Rain showers',81:'Rain showers',82:'Violent showers',85:'Snow showers',86:'Heavy snow showers',95:'Thunderstorm',96:'Thunderstorm with hail',99:'Severe thunderstorm with hail'};
async function loadWeather(o){o.wx=null;const j=await getData(`https://api.open-meteo.com/v1/forecast?latitude=${o.lat}&longitude=${o.lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,cloud_cover,wind_speed_10m,precipitation&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`);
 FEED['weather']=!!j;feedMsg();if(!j||!j.current)return;if(j.timezone&&(!o.tz||o.tz.startsWith('Etc/')))o.tz=j.timezone;const c=j.current,C=f=>((f-32)*5/9).toFixed(0);
 const n=v=>typeof v==='number'&&!isNaN(v);o.wx=[['Weather now',WMO[c.weather_code]||'—'],n(c.temperature_2m)&&['Temperature',`${c.temperature_2m.toFixed(0)} °F (${C(c.temperature_2m)} °C)`],n(c.apparent_temperature)&&['Feels like',`${c.apparent_temperature.toFixed(0)} °F`],n(c.wind_speed_10m)&&['Wind',`${c.wind_speed_10m.toFixed(0)} mph`],n(c.relative_humidity_2m)&&['Humidity / clouds',`${c.relative_humidity_2m}% / ${c.cloud_cover??'—'}%`]].filter(Boolean);renderLive()}
// ISS passes over a location
function issPasses(o){const s=SATS[0];if(!s.satrec||!window.satellite)return '';const out=[];let cur=null;
 for(let t=Date.now(),end=t+3*864e5;t<end&&out.length<5;t+=20000){const l=issLook(o,t);if(!l)continue;if(l.el>0){if(!cur)cur={start:t,max:l.el,maxT:t};if(l.el>cur.max){cur.max=l.el;cur.maxT=t}}else if(cur){cur.end=t;if(cur.max>=10)out.push(cur);cur=null}}
 if(!out.length)return '<div class="sub">ISS passes overhead</div><p>No good passes (10°+ high) in the next 3 days.</p>';
 const f=t=>{try{return new Date(t).toLocaleString(undefined,{timeZone:o.tz||undefined,weekday:'short',hour:'numeric',minute:'2-digit'})}catch(_){return new Date(t).toLocaleString()}};
 return '<div class="sub">ISS passes overhead (next 3 days)</div>'+out.map(p=>{const dark=sunAltAt(o.lat,o.lon,p.maxT)<-6;return `<div class="pass"><span>${f(p.start)} · ${Math.round((p.end-p.start)/6e4)} min</span><span>${p.max.toFixed(0)}° high${dark?' · dark sky, look up!':' · daylight'}</span></div>`}).join('')}
liveSats();liveEarth();
let issq=0;function checkISSquick(){if(performance.now()-issq>30000){issq=performance.now();checkISS()}}
