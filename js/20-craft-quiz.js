// Real spacecraft far from home (Voyager 1 and 2, New Horizons, Parker Solar Probe) and the kids' Space quiz
// Part of Interactive Galaxy. Files load in number order and share one global scope.

// objects created after the page starts need their own label and menu entry
function addLate(o){const el=document.createElement('div');el.className='lb '+({star:'star',gal:'gal',sat:'sat',nat:'sat',loc:'loc',craft:'sat'}[o.type]||'');el.textContent=o.name;el.onclick=()=>select(o);labels.appendChild(el);o.el=el;
 const op=document.createElement('option');op.value=o.id;op.textContent=o.name;$('goto').appendChild(op)}

/* ---------- spacecraft ---------- */
// Directions are the spacecraft's current sky positions; distances grow at their real speeds.
// Voyager 1 crossed exactly 1 light-day (173.14 AU) from Earth at 10:16:07 UTC on 18 Nov 2026 (NASA).
const CRAFT=[
 {id:'voyager1',name:'Voyager 1',ra:258.3,dec:12.0,anchor:Date.UTC(2026,10,18,10,16,7),dEarth:173.14,v:3.58,col:'#ffe08a',
  facts:[['Launched','5 September 1977'],['Speed','~17 km/s (38,000 mph)'],['Visited','Jupiter (1979), Saturn (1980)'],['Interstellar space since','2012'],['Signal time to Earth','About 24 hours']],
  desc:'The most distant human-made object. On 18 November 2026 it became the first spacecraft one light-day from Earth: its radio signals now take a full day to reach us. It carries a Golden Record of sounds and pictures from Earth.',wiki:'Voyager_1',q:'voyager 1'},
 {id:'voyager2',name:'Voyager 2',ra:301.3,dec:-58.0,anchor:Date.UTC(2035,10,15),dEarth:173.14,v:3.25,col:'#ffe08a',
  facts:[['Launched','20 August 1977'],['Speed','~15.4 km/s'],['Visited','Jupiter, Saturn, Uranus and Neptune'],['Interstellar space since','2018'],['1 light-day from Earth','Expected in 2035']],
  desc:'The only spacecraft ever to visit Uranus and Neptune. It left the Sun’s bubble in 2018 and is heading south of the plane of the planets.',wiki:'Voyager_2',q:'voyager 2'},
 {id:'newhorizons',name:'New Horizons',ra:287.5,dec:-20.4,anchor:Date.UTC(2021,3,17),r0:50,v:2.89,col:'#bfe3ff',approx:true,
  facts:[['Launched','19 January 2006'],['Pluto flyby','14 July 2015'],['Arrokoth flyby','1 January 2019'],['Speed','~13.7 km/s']],
  desc:'Gave us the first close-up pictures of Pluto and of Arrokoth, a snowman-shaped world in the Kuiper Belt. Its distance here is approximate.',wiki:'New_Horizons',q:'new horizons pluto'},
 {id:'parker',name:'Parker Solar Probe',parker:true,col:'#ffb347',approx:true,
  facts:[['Launched','12 August 2018'],['Closest to the Sun','~6.1 million km from its surface'],['Top speed','~690,000 km/h, the fastest object ever built'],['Orbit','Every 88 days']],
  desc:'Dives through the Sun’s outer atmosphere, the corona, protected by a carbon heat shield. Its orbit here is approximate: the probe really is that close to the Sun, but its exact position along the orbit is estimated.',wiki:'Parker_Solar_Probe',q:'parker solar probe'}];
const AUkm_=149597870.7;
function craftHelio(c,ms){
 if(c.parker){const a=.388,e=.881,P=88,T0=Date.UTC(2024,11,24,11,53);let M=(((ms-T0)/864e5/P)%1+1)%1*2*Math.PI;let E=M;for(let k=0;k<40;k++)E-=(E-e*Math.sin(E)-M)/(1-e*Math.cos(E));
  const x=a*(Math.cos(E)-e),y=a*Math.sqrt(1-e*e)*Math.sin(E),w=200*D2R;return[x*Math.cos(w)-y*Math.sin(w),x*Math.sin(w)+y*Math.cos(w),y*.06]}
 const d=radec(c.ra,c.dec),u=[d.x,-d.z,d.y];// three → ecliptic
 let r;if(c.r0)r=c.r0+c.v*(ms-c.anchor)/31557600000;
 else{const E=helio('earth',c.anchor),b=u[0]*E[0]+u[1]*E[1]+u[2]*E[2],D=c.dEarth,rr=b+Math.sqrt(b*b-(E[0]**2+E[1]**2+E[2]**2)+D*D);r=rr+c.v*(ms-c.anchor)/31557600000}
 return u.map(x=>x*r)}
const CP2={};
for(const c of CRAFT){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex(c.col,.2),blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));sp.scale.set(2.2,2.2,1);scene.add(sp);c.sp=sp;
 if(!c.parker){const ln=new THREE.Line(new THREE.BufferGeometry(),new THREE.LineDashedMaterial({color:new THREE.Color(c.col),dashSize:3,gapSize:3,transparent:true,opacity:.45}));ln.frustumCulled=false;scene.add(ln);c.path=ln}
 const o=reg({...c,kind:'Spacecraft'+(c.approx?' · position approximate':' · real position')},sp,'craft',14);addLate(o)}
function updateCraft(){for(const c of CRAFT){const h=craftHelio(c,simMs);CP2[c.id]=h;const p=disp(h);c.sp.position.copy(p);
 if(c.path){c.path.geometry.setFromPoints([new THREE.Vector3(0,0,0),p]);c.path.computeLineDistances()}}}
FRAME_HOOKS.push(updateCraft);updateCraft();
// card rows for spacecraft
{const _lr=liveRows;liveRows=function(o){if(o&&o.type==='craft'){const h=CP2[o.id];if(!h)return null;const r=Math.hypot(...h),d=Math.hypot(...sub3(h,HP.earth)),lh=d*AUkm_/299792.458/3600;
  return[['Distance from Sun',r<2?`${r.toFixed(3)} AU (${(r*AUkm_/1e6).toFixed(1)} million km)`:`${r.toFixed(1)} AU (${(r*AUkm_/1e9).toFixed(2)} billion km)`],['Distance from Earth',`${d.toFixed(d<2?3:1)} AU`],['Radio signals take',lh<1?`${(lh*60).toFixed(1)} minutes`:`${lh.toFixed(1)} hours`]]}return _lr(o)}}
{const _tr=timelapseRate;timelapseRate=function(){if(focus&&focus.type==='craft')return focus.parker?[86400,'1 day every second: watch Parker dive past the Sun']:[31557600,'1 year every second: watch it head out into interstellar space'];return _tr()}}
Object.assign(PHOTOS,{voyager1:['Voyager_spacecraft_model.png','Voyager spacecraft (model) · NASA/JPL'],voyager2:['Voyager_spacecraft_model.png','Voyager spacecraft (model) · NASA/JPL'],newhorizons:['New_Horizons_Transparent.png','New Horizons (artist’s view) · NASA'],parker:['Parker_Solar_Probe.jpg','Parker Solar Probe (artist’s view) · NASA']});
Object.assign(KIDS,{voyager1:['Voyager 1 is the farthest spacecraft from Earth. It flew past Jupiter and Saturn and is now sailing between the stars!','Its radio messages now take a whole day to reach us, travelling at the speed of light.'],
 voyager2:['Voyager 2 is the only spacecraft that has visited Uranus and Neptune.','It carries a golden record with music, sounds and greetings from Earth, just in case aliens find it.'],
 newhorizons:['New Horizons flew past Pluto in 2015 and showed us Pluto’s giant icy heart.','It travelled for 9 years to get to Pluto!'],
 parker:['The Parker Solar Probe flies closer to the Sun than anything ever has. It’s also the fastest thing people have ever built!','Its heat shield gets hotter than 1,000 °C, but the instruments behind it stay at about room temperature.']});
STAMP_IDS.push('voyager1','voyager2','newhorizons','parker');BADGES.push(['Deep-space explorer',['voyager1','voyager2','newhorizons','parker']]);

/* ---------- Space quiz ---------- */
// [question, [answers...], index of correct answer, explanation, object to show]
const QUIZ=[
 ['Which planet is the biggest?',['Saturn','Jupiter','Neptune','Earth'],1,'Jupiter is so big that more than 1,300 Earths could fit inside it.','jupiter'],
 ['Which planet is closest to the Sun?',['Venus','Mars','Mercury','Earth'],2,'Mercury is the closest planet to the Sun, and the smallest.','mercury'],
 ['Which planet is the hottest?',['Mercury','Venus','Mars','Jupiter'],1,'Venus is hotter than Mercury, because its thick clouds trap heat like a blanket.','venus'],
 ['Why is Mars red?',['It’s on fire','Its dirt is full of rust','It’s covered in red plants','It reflects the Sun'],1,'Mars’s soil has lots of iron oxide, which is rust!','mars'],
 ['What are Saturn’s rings made of?',['Gas','Ice and rock','Metal','Clouds'],1,'Billions of chunks of ice and rock, some as small as sand and some as big as a house.','saturn'],
 ['How long does sunlight take to reach Earth?',['8 seconds','8 minutes','8 hours','8 days'],1,'About 8 minutes and 20 seconds. You always see the Sun as it was 8 minutes ago!','sun'],
 ['How many people have walked on the Moon?',['None','2','12','100'],2,'Twelve astronauts walked on the Moon between 1969 and 1972.','moon'],
 ['Which planet spins on its side?',['Uranus','Neptune','Mars','Earth'],0,'Uranus is tilted about 98°, so it rolls around the Sun on its side.','uranus'],
 ['What is the Sun?',['A planet','A star','A moon','A comet'],1,'The Sun is a star: a giant ball of glowing hot gas.','sun'],
 ['Which moon has the most volcanoes?',['Our Moon','Titan','Io','Europa'],2,'Jupiter’s moon Io has hundreds of active volcanoes.','io'],
 ['What is the biggest moon in the Solar System?',['Titan','Ganymede','Our Moon','Europa'],1,'Ganymede, a moon of Jupiter, is even bigger than the planet Mercury.','ganymede'],
 ['Which planet has the fastest winds?',['Earth','Jupiter','Neptune','Mars'],2,'Neptune’s winds can reach about 2,000 km/h (1,200 mph).','neptune'],
 ['What is our galaxy called?',['Andromeda','The Milky Way','The Big Dipper','Orion'],1,'We live in the Milky Way, a spiral galaxy with hundreds of billions of stars.','milky'],
 ['Which star is closest to the Sun?',['Sirius','Polaris','Proxima Centauri','Betelgeuse'],2,'Proxima Centauri, about 4.2 light-years away.','proxima'],
 ['Which is the brightest star in the night sky?',['Polaris','Sirius','Vega','Rigel'],1,'Sirius, the Dog Star. (The North Star, Polaris, isn’t the brightest!)','sirius'],
 ['What causes a solar eclipse?',['Earth’s shadow on the Moon','The Moon blocking the Sun','Clouds','The Sun turning off'],1,'In a solar eclipse, the Moon passes between Earth and the Sun and blocks its light.','moon'],
 ['Why do we have seasons?',['Earth gets closer to the Sun in summer','Earth is tilted','The Sun gets hotter','The Moon moves'],1,'Earth’s tilt means each half takes turns leaning toward the Sun. Earth is actually closest to the Sun in January!','earth'],
 ['How long does the ISS take to go around Earth?',['About 90 minutes','One day','One week','One year'],0,'About 90 minutes, so astronauts see about 16 sunrises every day.','iss'],
 ['Which spacecraft is farthest from Earth?',['Hubble','The ISS','Voyager 1','New Horizons'],2,'Voyager 1. Its signals now take a whole day to reach us.','voyager1'],
 ['What is Pluto?',['A planet','A dwarf planet','A moon','A star'],1,'Pluto has been called a dwarf planet since 2006.','pluto'],
 ['Which moon has lakes of liquid methane?',['Titan','Europa','Phobos','Callisto'],0,'Saturn’s moon Titan has lakes and seas of liquid methane and ethane.','titan'],
 ['What is in the middle of our galaxy?',['A giant star','A supermassive black hole','Nothing','The Sun'],1,'A black hole called Sagittarius A*, about 4 million times heavier than the Sun.','sgra'],
 ['How long is a year on Mercury?',['88 days','365 days','12 years','1 day'],0,'Mercury goes around the Sun in just 88 Earth days.','mercury'],
 ['Which planet could float in water?',['Earth','Jupiter','Saturn','Mars'],2,'Saturn is less dense than water, so it would float in a giant enough bathtub!','saturn'],
 ['What makes the northern lights?',['Lightning','Particles from the Sun hitting our air','Reflections from ice','City lights'],1,'Particles from the Sun crash into gases high in our atmosphere and make them glow.','aurora0'],
 ['Which planet has the Great Red Spot?',['Mars','Jupiter','Saturn','Venus'],1,'Jupiter’s Great Red Spot is a storm bigger than Earth.','jupiter'],
 ['What is a comet mostly made of?',['Ice and dust','Fire','Metal','Gas only'],0,'Comets are dirty snowballs of ice and dust. Near the Sun, they grow glowing tails.','halley'],
 ['Which moon shoots water fountains into space?',['Enceladus','Our Moon','Deimos','Charon'],0,'Saturn’s moon Enceladus has geysers fed by an ocean under its ice.','enceladus']];
let qz=null;
function startQuiz(){const idx=[...QUIZ.keys()].sort(()=>Math.random()-.5).slice(0,8);qz={idx,i:0,score:0};showQ()}
function showQ(){const box=$('quizbox');if(!qz){box.innerHTML=`<p class="lead">Test what you know about space! 8 questions, and you get a star for every right answer. Score 6 or more to earn the <b>Quiz whiz</b> passport stamp.</p><div class="frow"><button id="qstart" class="on">Start the quiz</button></div>`;$('qstart').onclick=startQuiz;return}
 if(qz.i>=qz.idx.length){const s=qz.score,n=qz.idx.length,won=s>=6;
  box.innerHTML=`<p class="qq">You got ${s} out of ${n}!</p><p class="qstars">${'★'.repeat(s)}${'☆'.repeat(n-s)}</p><p class="lead">${s===n?'Perfect score. You’re a real space expert!':won?'Great job, space explorer!':'Nice try! Explore the planets and try again.'}</p><div class="frow"><button id="qagain" class="on">Play again</button></div>`;
  if(won&&!stamps.has('quiz')){stamps.add('quiz');try{localStorage.setItem('galaxy.passport',JSON.stringify([...stamps]))}catch(e){}showToast('New passport stamp: Quiz whiz!','badge');confetti()}else if(s===n)confetti();
  $('qagain').onclick=startQuiz;qz.done=true;return}
 const[q,opts,ans]=QUIZ[qz.idx[qz.i]];
 box.innerHTML=`<p class="qstars">Question ${qz.i+1} of ${qz.idx.length} · ${'★'.repeat(qz.score)}</p><p class="qq">${q}</p><div class="qopts">${opts.map((o,k)=>`<button data-a="${k}">${o}</button>`).join('')}</div><div id="qafter"></div>`;
 box.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>answer(+b.dataset.a))}
function answer(k){const[,,ans,exp,show]=QUIZ[qz.idx[qz.i]];const btns=[...document.querySelectorAll('.qopts [data-a]')];if(btns.some(b=>b.disabled))return;
 btns.forEach((b,i)=>{b.disabled=true;if(i===ans)b.classList.add('right');else if(i===k)b.classList.add('wrong')});const ok=k===ans;if(ok)qz.score++;
 $('qafter').innerHTML=`<p class="qexp"><b>${ok?'Correct!':'Not quite.'}</b> ${exp}</p><div class="frow"><button id="qnext" class="on">${qz.i+1<qz.idx.length?'Next question':'See my score'}</button><button id="qshow">Show me</button></div>`;
 $('qnext').onclick=()=>{qz.i++;showQ()};$('qshow').onclick=()=>{const o=objects.find(x=>x.id===show);if(o){$('fun').hidden=true;select(o)}};
 if(kidsMode&&typeof speak==='function'&&canSpeak)speak((ok?'Correct! ':'Not quite. ')+exp)}
STAMP_IDS.push('quiz');
{const _of=openFun;openFun=function(tab){_of(tab);if(tab==='quiz'&&(!qz||qz.done))showQ()}}
{const _rp=renderPassport;renderPassport=function(){_rp();const b=document.querySelector('.stampc[data-go="quiz"]');if(!b){const el=document.createElement('button');el.className='stampc'+(stamps.has('quiz')?' got':'');el.dataset.quiz='1';
 el.innerHTML=`<i style="${stamps.has('quiz')?'background:radial-gradient(circle at 35% 35%,#fff,#ffd43b 45%,#000 120%)':''}"></i><span>${stamps.has('quiz')?'Quiz whiz':'?'}</span>`;el.onclick=e=>{e.stopPropagation();openFun('quiz')};$('stamps').appendChild(el)}}}
