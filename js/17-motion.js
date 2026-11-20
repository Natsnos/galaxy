// See things move: fading trails behind planets and the Moon, a one-tap time-lapse, and optional space sounds
// Part of Interactive Galaxy. Files load in number order and share one global scope.

/* ---------- trails ---------- */
const TRAIL_COL={mercury:'#b5aca3',venus:'#e8c98a',earth:'#4da3ff',mars:'#ff7a50',jupiter:'#e0b98a',saturn:'#e8d29a',uranus:'#9fe3ea',neptune:'#5b8cff',pluto:'#c8a27c',moon:'#d0d0d0'};
const TRAIL_N=90;let trailsOn=true;
const trails=planetState.map(st=>{const g=new THREE.BufferGeometry(),pos=new Float32Array(TRAIL_N*3),col=new Float32Array(TRAIL_N*3);
 g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('color',new THREE.BufferAttribute(col,3));
 const c=new THREE.Color(TRAIL_COL[st.b.id]||'#ffffff');for(let i=0;i<TRAIL_N;i++){const k=.15+.85*Math.pow(i/(TRAIL_N-1),1.3);col.set([c.r*k,c.g*k,c.b*k],i*3)}
 const line=new THREE.Line(g,new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:.95,blending:THREE.AdditiveBlending,depthWrite:false}));line.frustumCulled=false;
 const dots=new THREE.Points(g,new THREE.PointsMaterial({size:st.b.parent?.3:Math.max(2.2,st.b.r*.9),opacity:.9,map:dotTex,vertexColors:true,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));dots.frustumCulled=false;
 (st.b.parent?st.holder.parent:scene).add(line);(st.b.parent?st.holder.parent:scene).add(dots);
 // how far back each trail reaches: about an eighth of an orbit (the Moon: 4 days)
 return{st,line,dots,pos,span:(st.b.parent?4:st.b.P*.12)*864e5}});
function updateTrails(){if(!trailsOn)return;for(const t of trails){const{st,pos,span}=t;
 for(let i=0;i<TRAIL_N;i++){const ms=simMs-span*(1-i/(TRAIL_N-1));const v=st.b.parent?eclToThree(...moonGeo(ms).v).multiplyScalar(st.b.a):disp(helio(st.b.id,ms));pos[i*3]=v.x;pos[i*3+1]=v.y;pos[i*3+2]=v.z}
 t.line.geometry.attributes.position.needsUpdate=true}}
FRAME_HOOKS.push(updateTrails);
$('trailb').onclick=e=>{trailsOn=e.currentTarget.classList.toggle('on');trails.forEach(t=>{t.line.visible=trailsOn;t.dots.visible=trailsOn})};

/* ---------- Watch it move: a short time-lapse that suits what you're looking at, then back to live ---------- */
let tl=null;
function timelapseRate(){const f=focus,id=f&&f.id;
 if(f&&(id==='earth'||['loc','quake','event','launch','nat'].includes(f.type)))return[3600,'1 hour every second: watch Earth spin and day turn to night'];
 if(f&&f.type==='sat')return[60,'1 minute every second: watch the satellites race around Earth'];
 if(id==='moon')return[6*3600,'6 hours every second: watch the Moon circle Earth'];
 if(f&&(id==='jupiter'||f.host==='jupiter'))return[6*3600,'6 hours every second: watch Jupiter’s moons whip around it'];
 if(f&&(id==='saturn'||f.host==='saturn'||id==='uranus'||f.host==='uranus'||id==='neptune'||f.host==='neptune'||id==='pluto'||f.host==='pluto'||f.host==='mars'||id==='mars'))return[86400,'1 day every second: watch the moons orbit'];
 if(f&&f.type==='star'||f&&f.type==='gal')return[31557600,'1 year every second'];
 return[14*86400,'2 weeks every second: watch the planets circle the Sun']}
function startTimelapse(){const[r,why]=timelapseRate();rate=r;const sel=$('rate');sel.value=[...sel.options].some(o=>+o.value===r)?String(r):sel.value;paused=false;dirn=1;setLive(false);
 $('pause').textContent='❚❚';$('pause').classList.remove('on');$('rev').classList.remove('on');tl={until:performance.now()+25000,why};orbitLines.forEach(l=>{l.userData.op=l.userData.op??l.material.opacity;l.material.opacity=l.userData.op*.35});$('watchb').classList.add('on');
 showToast(why,'tl');setTimeout(()=>{if($('toast').dataset.key==='tl')$('toast').hidden=true},6000)}
function stopTimelapse(){tl=null;orbitLines.forEach(l=>{if(l.userData.op!=null)l.material.opacity=l.userData.op});$('watchb').classList.remove('on');$('watchb').textContent='Watch it move';$('now').click()}
$('watchb').onclick=()=>tl?stopTimelapse():startTimelapse();
UI_HOOKS.push(()=>{if(!tl)return;const left=Math.ceil((tl.until-performance.now())/1000);if(left<=0)stopTimelapse();else $('watchb').textContent=`Back to live in ${left}s · Stop`});

/* ---------- sounds (made in the browser, no files): a soft space hum and a whoosh when flying ---------- */
let audio=null,soundOn=false;
function startAudio(){try{const A=window.AudioContext||window.webkitAudioContext;if(!A)return false;audio=audio||new A();if(audio.state==='suspended')audio.resume();
 if(!audio.hum){const out=audio.createGain();out.gain.value=0;out.connect(audio.destination);const lp=audio.createBiquadFilter();lp.type='lowpass';lp.frequency.value=420;lp.connect(out);
  [[55,'sine',.5],[82.4,'triangle',.18],[110.3,'sine',.12],[164.8,'sine',.05]].forEach(([f,t,v])=>{const o=audio.createOscillator(),g=audio.createGain();o.type=t;o.frequency.value=f;g.gain.value=v;o.connect(g);g.connect(lp);o.start();
   const l=audio.createOscillator(),lg=audio.createGain();l.frequency.value=.05+Math.random()*.08;lg.gain.value=v*.4;l.connect(lg);lg.connect(g.gain);l.start()});
  audio.hum=out}
 audio.hum.gain.setTargetAtTime(.07,audio.currentTime,.8);return true}catch(e){return false}}
function stopAudio(){if(audio&&audio.hum)audio.hum.gain.setTargetAtTime(0,audio.currentTime,.4)}
function whoosh(){if(!soundOn||!audio)return;try{const n=audio.sampleRate*1.1,b=audio.createBuffer(1,n,audio.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.sin(Math.PI*i/n);
 const s=audio.createBufferSource();s.buffer=b;const f=audio.createBiquadFilter();f.type='bandpass';f.Q.value=1.4;f.frequency.setValueAtTime(300,audio.currentTime);f.frequency.exponentialRampToValueAtTime(2400,audio.currentTime+.9);
 const g=audio.createGain();g.gain.value=.16;s.connect(f);f.connect(g);g.connect(audio.destination);s.start()}catch(e){}}
$('soundb').onclick=e=>{soundOn=!soundOn;if(soundOn&&!startAudio()){soundOn=false;showToast('Sound isn’t available in this browser.','snd');return}if(!soundOn)stopAudio();
 e.currentTarget.classList.toggle('on',soundOn);e.currentTarget.setAttribute('aria-pressed',soundOn)};
{const _select=select;select=function(o){_select(o);if(o&&o.type!=='events')whoosh()}}
