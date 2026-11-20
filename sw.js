// Offline support: keeps the app shell, planet maps and libraries on the device.
// Pages, scripts and styles: network first (so updates arrive), cached copy when offline.
// Planet maps and libraries: cached copy first. Live data (weather, quakes, photos…) always comes from the network.
const VERSION='galaxy-v2';
const CORE=["./", "index.html", "manifest.webmanifest", "css/style.css", "js/01-data.js", "js/02-ephemeris.js", "js/03-textures.js", "js/04-scene.js", "js/05-earth.js", "js/06-moons-comets.js", "js/07-sky-events.js", "js/08-live-data.js", "js/09-search.js", "js/10-weather.js", "js/11-realism.js", "js/12-live-extra.js", "js/13-ux.js", "js/14-state.js", "js/15-ui.js", "js/16-loop.js", "js/17-motion.js", "js/18-kids.js", "js/19-app.js", "icons/apple-touch-icon.png", "icons/favicon-32.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png"];
const TEXTURES=["assets/textures/2k_jupiter.jpg", "assets/textures/2k_mars.jpg", "assets/textures/2k_mercury.jpg", "assets/textures/2k_neptune.jpg", "assets/textures/2k_saturn.jpg", "assets/textures/2k_saturn_ring_alpha.png", "assets/textures/2k_stars_milky_way.jpg", "assets/textures/2k_sun.jpg", "assets/textures/2k_uranus.jpg", "assets/textures/earth_atmos_2048.jpg", "assets/textures/earth_atmos_4096.jpg", "assets/textures/earth_clouds_1024.png", "assets/textures/earth_clouds_2048_alpha.jpg", "assets/textures/earth_lights_2048.png", "assets/textures/earth_normal_2048.jpg", "assets/textures/earth_specular_2048.jpg", "assets/textures/moon_1024.jpg"];
const LIBS=['https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js','https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js','https://cdn.jsdelivr.net/npm/satellite.js@4.1.4/dist/satellite.min.js'];
self.addEventListener('install',e=>{e.waitUntil((async()=>{const c=await caches.open(VERSION);await c.addAll(CORE);
  await Promise.all([...TEXTURES,...LIBS].map(async u=>{try{const r=await fetch(u,{mode:u.startsWith('http')?'cors':'same-origin'});if(r.ok)await c.put(u,r)}catch(_){}}));self.skipWaiting()})())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==VERSION)await caches.delete(k);await self.clients.claim()})())});
const LIB_HOSTS=['cdnjs.cloudflare.com','cdn.jsdelivr.net','fonts.googleapis.com','fonts.gstatic.com'];
self.addEventListener('fetch',e=>{const req=e.request;if(req.method!=='GET')return;const u=new URL(req.url);
 const same=u.origin===self.location.origin;
 if(same&&(u.pathname.includes('/assets/')||u.pathname.includes('/icons/'))){e.respondWith(cacheFirst(req));return}
 if(same){e.respondWith(networkFirst(req));return}
 if(LIB_HOSTS.includes(u.hostname)&&!u.pathname.includes('/map/js/')){e.respondWith(cacheFirst(req));return}
 // everything else (live data, photos, imagery) goes straight to the network
});
async function cacheFirst(req){const c=await caches.open(VERSION);const hit=await c.match(req,{ignoreSearch:false});if(hit)return hit;try{const r=await fetch(req);if(r.ok||r.type==='opaque')c.put(req,r.clone());return r}catch(e){return hit||Response.error()}}
async function networkFirst(req){const c=await caches.open(VERSION);try{const r=await fetch(req);if(r.ok)c.put(req,r.clone());return r}catch(e){const hit=await c.match(req,{ignoreSearch:true})||(req.mode==='navigate'?await c.match('index.html'):null);return hit||Response.error()}}
