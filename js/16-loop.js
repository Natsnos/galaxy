// The animation loop
// Part of Interactive Galaxy. Files load in number order and share one global scope.

/* ---------- loop ---------- */
function resize(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
addEventListener('resize',resize);resize();
const clock=new THREE.Clock(),v3=new THREE.Vector3();
// adaptive resolution: step the pixel ratio down if frames are slow
let fpsEma=1/60,slowFor=0,prMax=Math.min(devicePixelRatio,2),prNow=prMax;
function adaptQuality(dt){fpsEma=fpsEma*.95+dt*.05;if(fpsEma>1/28){slowFor+=dt;if(slowFor>2.5&&prNow>.75){prNow=Math.max(.75,prNow-.5);renderer.setPixelRatio(prNow);resize();slowFor=0}}else slowFor=Math.max(0,slowFor-dt*.5)}
const REDUCED=matchMedia('(prefers-reduced-motion: reduce)').matches;
const SOLIDS=[];const _sv=new THREE.Vector3();
function keepOutside(){if(!SOLIDS.length){SOLIDS.push({o:sunMesh,r:10*1.03});planetState.forEach(s=>SOLIDS.push({o:s.mesh,r:s.b.r*(s.b.id==='earth'?1.0015:1.04)}));MOONS.forEach(m=>SOLIDS.push({o:m.mesh,r:m.r*1.06}))}
 for(const b of SOLIDS){b.o.getWorldPosition(_sv);const d=camera.position.distanceTo(_sv);if(d<b.r&&d>1e-6){camera.position.sub(_sv).multiplyScalar(b.r/d).add(_sv)}}}
let lastUI=0;const prevQ=new THREE.Quaternion(),dq=new THREE.Quaternion();
function frame(){requestAnimationFrame(frame);const dt=Math.min(clock.getDelta(),.25);adaptQuality(dt);
 if(live)simMs=Date.now();else if(!paused)simMs+=dt*1000*rate*dirn;
 prevQ.copy(earthMesh.quaternion);updateWorld(simMs);
 if(Math.abs(simMs-orbitAt)>(rate>86400?20:2)*864e5||(performance.now()-lastUI>500&&Math.abs(simMs-orbitAt)>36e5))refreshOrbits(simMs);
 // follow & fly
 if(focus&&focus.obj&&!fly){worldPos(focus,v3);const delta=v3.clone().sub(controls.target);controls.target.add(delta);camera.position.add(delta);
  if(['loc','nat','quake','event','launch'].includes(focus.type)||(focus.type==='sat'&&focus.lon!==undefined)){dq.copy(earthMesh.quaternion).multiply(prevQ.clone().invert());const off=camera.position.clone().sub(controls.target).applyQuaternion(dq);camera.position.copy(controls.target).add(off)}}
 if(fly){fly.t=Math.min(1,fly.t+dt/(REDUCED?.25:1.6));const e=fly.t<.5?4*fly.t**3:1-(-2*fly.t+2)**3/2;
  const tgt=fly.obj?worldPos(fly.obj,v3).clone():fly.target;controls.target.lerpVectors(fly.from,tgt,e);
  if(fly.surface)fly.dir=tgt.clone().sub(worldPos(earthO)).normalize();
  const camTo=fly.camTo||tgt.clone().add(fly.dir.clone().multiplyScalar(fly.dist));camera.position.lerpVectors(fly.camFrom,camTo,e);
  if(fly.t>=1)fly=null}
 controls.minDistance=focus&&focus.type==='loc'?.003:focus&&['sat','nat','quake','event','launch'].includes(focus.type)?.2:focus&&focus.r&&focus.mesh?Math.max(.2,focus.r*1.25):.003;
 {const dcam=camera.position.distanceTo(controls.target),nr=Math.max(1e-5,Math.min(.05,dcam*.05));if(Math.abs(nr-camera.near)/camera.near>.2){camera.near=nr;camera.updateProjectionMatrix()}}
 if(MARKERS.length){const de=camera.position.distanceTo(worldPos(earthO));if(Math.abs(de-(window.__mkD||0))>.002){window.__mkD=de;for(const m of MARKERS){const k=Math.min(m.userData.base,Math.max(.003,(de-ER)*.03));m.scale.set(k,k,1)}}}
 if(pin.visible){const dp=camera.position.distanceTo(worldPos(locO));const k=Math.min(.15,Math.max(.0006,dp*.045));pin.scale.set(k,k,1);pinRing.scale.setScalar(k*1.0);pinRing.material.opacity=REDUCED?.6:.35+.35*Math.sin(performance.now()/300)}
 controls.update();keepOutside();fadeDetail();updateEarthSun();updateSkyFade();placeWxLabels(false);for(const h of FRAME_HOOKS)h(dt);
 if(window.__earthReal&&showLights){const ds=camera.position.distanceTo(worldPos(earthO))-ER;earthMesh.material.emissiveIntensity=1.7*Math.max(.15,Math.min(1,(ds-.02)/.3))}if(Math.abs(simMs-trackAt)>(live?20000:rate*0.5*1000+60000))updateTrack();renderer.render(scene,camera);
 if(performance.now()-lastUI>250){lastUI=performance.now();for(const h of UI_HOOKS)h();
  $('when').textContent=new Date(simMs).toLocaleString(undefined,{weekday:'short',year:'numeric',month:'short',day:'numeric',hour:'numeric',minute:'2-digit',second:'2-digit',timeZoneName:'short'});
  if(showLights&&!window.__earthReal)updateLights();checkISSquick();document.querySelectorAll('.cd[data-net]').forEach(e=>e.textContent=tminus(+e.dataset.net));if(!$('sky').hidden)drawSky();
  $('live').classList.toggle('off',!live);$('live').textContent=live?'LIVE':paused?'PAUSED':dirn<0?'REWIND':'SIMULATED';renderLive()}
 // labels
 const nearEarth=camera.position.distanceTo(worldPos(earthO))<45;
 if(showLabels){const W=innerWidth,H=innerHeight,placed=[];const cd=camera.position.length();
  for(const o of objects){worldPos(o,v3);const p=v3.clone().project(camera);const sx=(p.x+1)/2*W,sy=(1-p.y)/2*H;
   let vis=p.z<1&&sx>-50&&sx<W+50&&sy>-50&&sy<H+50&&o.obj.visible!==false;
   if(['sat','nat','loc','quake','event','launch'].includes(o.type)&&!nearEarth)vis=false;
   if(vis&&o.obj.parent===earthMesh&&o.type!=='sat'){const n=v3.clone().sub(worldPos(earthO)).normalize();if(n.dot(camera.position.clone().sub(v3).normalize())<0)vis=false}
   if(vis&&nearEarth&&o!==earthO&&o.obj.parent!==earthMesh){const c=worldPos(earthO),oc=camera.position,dv=v3.clone().sub(oc),L=dv.length();dv.normalize();const t=c.clone().sub(oc).dot(dv);if(t>0&&t<L&&c.distanceTo(oc.clone().add(dv.multiplyScalar(t)))<ER*.99)vis=false}
   o._s=vis?[sx,sy]:null;if(!o.el)continue;
   let show=vis&&(o.type==='loc'||!placed.some(q=>Math.abs(q[0]-sx)<70&&Math.abs(q[1]-sy)<18));
   if(o.type==='gal'&&cd<3000&&o.id!=='andromeda')show=false;
   if(o.type==='star'&&camera.position.distanceTo(controls.target)<80)show=false;
   if(o===earthO&&((focus&&['loc','quake','event','launch'].includes(focus.type))||camera.position.distanceTo(controls.target)<2.5))show=false;
   if(show&&(o.type==='quake'||o.type==='event'||o.type==='launch'))show=false;if(show){placed.push([sx,sy]);o.el.style.display='';o.el.style.left=sx+'px';o.el.style.top=sy+'px'}else o.el.style.display='none'}}
 else for(const o of objects){worldPos(o,v3);const p=v3.clone().project(camera);o._s=p.z<1&&o.obj.visible!==false&&(nearEarth||!['sat','nat','loc','quake','event','launch'].includes(o.type))?[(p.x+1)/2*innerWidth,(1-p.y)/2*innerHeight]:null}
}
frame();
setTimeout(()=>$('hint').style.opacity=0,6000);
