// Kids Pack: kids mode with simple words, read aloud, space passport and badges, Me in space, trip planner, size line-up, postcards
// Part of Interactive Galaxy. Files load in number order and share one global scope.

/* ---------- kid-friendly words: [simple description, did-you-know fact] ---------- */
const KIDS={
 sun:['The Sun is a star: a giant ball of super-hot glowing gas. It’s so big that about 1.3 million Earths could fit inside it!','Sunlight takes about 8 minutes to reach us, so you always see the Sun as it was 8 minutes ago.'],
 mercury:['Mercury is the smallest planet and the closest to the Sun. It races around the Sun faster than any other planet.','A year on Mercury is only 88 Earth days, so you’d have a birthday about every 3 months!'],
 venus:['Venus is the hottest planet, even hotter than Mercury, because its thick clouds trap heat like a blanket.','Venus spins backwards, so the Sun rises in the west and sets in the east.'],
 earth:['Earth is our home. It’s the only planet we know of with oceans of liquid water and living things.','At the equator, Earth spins at about 1,670 km/h (1,040 mph), but we don’t feel it!'],
 moon:['The Moon is Earth’s closest neighbour in space. Twelve astronauts have walked on it!','Footprints on the Moon can last for millions of years, because there’s no wind to blow them away.'],
 mars:['Mars is red because its dirt is full of rust. It has the biggest volcano in the Solar System, Olympus Mons.','Robot rovers are driving around on Mars right now, looking for signs of ancient life.'],
 jupiter:['Jupiter is the biggest planet. More than 1,300 Earths could fit inside it! It’s made mostly of gas.','The Great Red Spot is a storm bigger than Earth that has been swirling for hundreds of years.'],
 saturn:['Saturn has beautiful rings made of billions of pieces of ice and rock, some as small as sand and some as big as a house.','Saturn is so light for its size that it would float in a giant bathtub of water!'],
 uranus:['Uranus is an ice giant that spins on its side, like a ball rolling around the Sun.','Uranus was the first planet ever discovered with a telescope, in 1781.'],
 neptune:['Neptune is the farthest planet from the Sun. It’s dark and cold, and it has the fastest winds in the Solar System.','One year on Neptune lasts 165 Earth years. It has gone around the Sun only once since it was discovered!'],
 pluto:['Pluto is a dwarf planet far, far away. It has a giant heart-shaped plain made of ice.','Pluto is smaller than our Moon.'],
 io:['Io is covered in volcanoes. It’s the most volcanic place in the Solar System!','Some of Io’s volcanoes shoot material hundreds of kilometres up into space.'],
 europa:['Europa is covered in ice, and underneath there’s a giant hidden ocean.','Scientists think Europa’s ocean is one of the best places to look for life beyond Earth.'],
 ganymede:['Ganymede is the biggest moon in the whole Solar System, bigger than the planet Mercury!','It’s the only moon with its own magnetic field.'],
 callisto:['Callisto is covered with so many craters that there’s hardly room for new ones.','Its surface is about 4 billion years old.'],
 titan:['Titan is Saturn’s biggest moon. It has thick orange air and lakes made of liquid methane instead of water.','A flying robot called Dragonfly is going to explore Titan in the 2030s!'],
 enceladus:['Enceladus is a small icy moon that shoots giant fountains of water into space.','It’s the shiniest thing in the Solar System: its fresh ice reflects almost all the sunlight that hits it.'],
 triton:['Triton is Neptune’s biggest moon, and it goes around Neptune backwards!','Triton has geysers that shoot nitrogen gas high into the sky.'],
 charon:['Charon is Pluto’s big moon. It’s so big that Pluto and Charon swing around each other like dance partners.','Charon has a reddish cap at its north pole.'],
 phobos:['Phobos is a tiny, lumpy moon of Mars, shaped a bit like a potato.','Phobos is slowly getting closer to Mars, and one day it will break apart.'],
 iss:['The International Space Station is a home in space where astronauts live and do experiments. It’s about as big as a football field.','The ISS goes all the way around Earth every 90 minutes, so astronauts see about 16 sunrises every day!'],
 hubble:['Hubble is a space telescope that has taken amazing pictures of planets, stars and galaxies since 1990.','Hubble is about as long as a school bus.'],
 jwst:['The James Webb Space Telescope is the biggest telescope in space. It sees heat (infrared light), so it can find the very first galaxies.','Its giant sunshield is about the size of a tennis court.'],
 halley:['Halley’s Comet is a giant dirty snowball that swings past Earth about every 76 years.','It will be back in 2061. How old will you be then?'],
 betelgeuse:['Betelgeuse is a giant red star in the constellation Orion. If it took the Sun’s place, it would swallow Mars!','One day Betelgeuse will explode as a supernova.'],
 rigel:['Rigel is a super-bright blue star in Orion’s foot.','Rigel shines about 120,000 times brighter than our Sun.'],
 sirius:['Sirius is the brightest star in the night sky. People call it the Dog Star.','Sirius has a tiny partner star nicknamed “the Pup”.'],
 proxima:['Proxima Centauri is the closest star to the Sun. It’s a small red star.','Even travelling at the speed of light, it would take more than 4 years to get there.'],
 polaris:['Polaris is the North Star. It stays in almost the same spot all night, so people have used it to find their way.','Polaris is really three stars together.'],
 vega:['Vega is a bright blue-white star in the summer sky.','Vega spins so fast that it bulges out in the middle.'],
 milky:['The Milky Way is our galaxy: a giant spinning city of hundreds of billions of stars. Our Sun is just one of them!','On a dark night away from city lights, you can see it as a glowing band across the sky.'],
 andromeda:['The Andromeda Galaxy is our big neighbour galaxy, with about a trillion stars.','It’s the farthest thing you can see with just your eyes. Its light left it 2.5 million years ago!'],
 sgra:['Sagittarius A* is a giant black hole at the centre of our galaxy. It weighs as much as 4 million Suns.','Nothing can escape a black hole, not even light.'],
 belt:['The asteroid belt is a huge ring of space rocks between Mars and Jupiter.','There are millions of asteroids, but they’re so spread out that spacecraft fly through easily.'],
 aurora0:['The northern lights are glowing curtains of green and pink light in the sky near the North Pole.','They happen when tiny particles from the Sun crash into the air high above us.'],
 starlink:['Starlink is a group of thousands of small satellites that send the internet around the world.','Sometimes you can see a “train” of Starlink satellites moving across the night sky.']};
let kidsMode=false;try{kidsMode=localStorage.getItem('galaxy.kids')==='1'}catch(e){}
function setKids(on){kidsMode=on;document.body.classList.toggle('kids',on);$('kidsb').classList.toggle('on',on);$('kidsb').setAttribute('aria-pressed',on);try{localStorage.setItem('galaxy.kids',on?'1':'0')}catch(e){}if(focus&&$('info').classList.contains('open'))showInfo(focus)}
$('kidsb').onclick=()=>setKids(!kidsMode);setKids(kidsMode);

/* ---------- read aloud ---------- */
const canSpeak='speechSynthesis' in window;if(!canSpeak){$('readb').hidden=true}
function readText(o){const k=KIDS[o.id];return `${o.name}. `+(kidsMode&&k?`${k[0]} Did you know? ${k[1]}`:(o.desc||''))}
// voice options: any voice the device offers, plus speed and a fun pitch style; remembered on this device
let VOICES=[],vpref={};
// voice names don't say male or female, so we recognise the common ones from each system (Apple, Microsoft, Google, Android, Amazon)
const FEMALE=/\b(female|woman|samantha|victoria|karen|moira|tessa|fiona|veena|allison|ava|susan|kathy|princess|vicki|zoe|nicky|serena|kate|stephanie|zira|aria|jenny|hazel|libby|sonia|michelle|emma|ana|clara|natasha|catherine|heera|neerja|elsa|denise|katja|amala|paulina|monica|m[oó]nica|helena|laura|lucia|elvira|dalia|camila|francisca|salome|amelie|am[eé]lie|audrey|aurelie|marie|julie|sylvie|ellen|alice|federica|isabella|elsa|anna|petra|marlene|vicki|joanna|kendra|kimberly|salli|ivy|ruth|olivia|amy|nicole|raveena|aditi|kajal|yuna|kyoko|o-ren|ting-ting|mei-jia|sin-ji|lekha|sara|nora|milena|mariska|alva|ioana|zuzana|carmit|tessa|luciana|joana|fernanda|google us english|google uk english female|google français|google español)\b/i;
const MALE=/\b(male|man|alex|daniel|fred|tom|aaron|arthur|gordon|oliver|rishi|ralph|junior|evan|nathan|david|mark|george|guy|ryan|christopher|eric|brian|andrew|steffan|roger|james|william|liam|connor|davis|tony|jason|henri|thomas|jacques|jorge|diego|juan|carlos|alvaro|pablo|raul|stefan|markus|hans|conrad|luca|cosimo|reed|rocko|grandpa|eddy|matthew|justin|joey|russell|geraint|giorgio|maxim|yuri|otoya|ichiro|li-mu|yannick|xander|google uk english male)\b/i;
const genderOf=v=>{const n=v.name;if(/\bfemale\b/i.test(n))return'female';if(/\bmale\b/i.test(n))return'male';if(FEMALE.test(n))return'female';if(MALE.test(n))return'male';return''};
let vgender='any';try{vpref=JSON.parse(localStorage.getItem('galaxy.voice')||'{}')}catch(e){}
const langName=l=>{try{return new Intl.DisplayNames([navigator.language||'en'],{type:'language'}).of(l)||l}catch(e){return l}};
function loadVoices(){if(!canSpeak)return;VOICES=speechSynthesis.getVoices()||[];if(!VOICES.length)return;vgender=vpref.g||'any';
 document.querySelectorAll('[data-vg]').forEach(b=>b.classList.toggle('on',b.dataset.vg===vgender));
 const mine=(navigator.language||'en').slice(0,2).toLowerCase(),nice=v=>v.name.replace(/^(Microsoft|Google)\s+/,'').replace(/\s+Online \(Natural\)/,' (natural)').replace(/ - [A-Za-z ()]+$/,'');
 const idx=VOICES.map((v,i)=>i).filter(i=>vgender==='any'||genderOf(VOICES[i])===vgender),groups={};idx.forEach(i=>{const l=VOICES[i].lang||'',k=l.slice(0,2).toLowerCase()===mine?'0':'1'+l;(groups[k]=groups[k]||[]).push(i)});
 const html=Object.keys(groups).sort().map(k=>{const items=groups[k].sort((a,b)=>VOICES[a].name.localeCompare(VOICES[b].name)).map(i=>`<option value="${i}">${nice(VOICES[i]).replace(/</g,'&lt;')}${genderOf(VOICES[i])?' ('+genderOf(VOICES[i])+')':''}${VOICES[i].localService===false?' (online)':''} · ${VOICES[i].lang}</option>`).join('');
  return `<optgroup label="${k==='0'?langName(mine)+' voices':langName(k.slice(1))}">${items}</optgroup>`}).join('');
 const none=vgender!=='any'&&!idx.length;
 $('voicesel').innerHTML=(none?`<option value="">Default voice, ${vgender==='female'?'higher':'lower'} pitch</option>`:vgender==='any'?'<option value="">Device default</option>':'')+html;
 $('voicenote').textContent=none?`This device doesn’t have a ${vgender} voice we can recognise, so we’ll use its default voice with a ${vgender==='female'?'higher':'deeper'} pitch. You can add more voices in your device’s speech or accessibility settings.`:'The voices come from your device, so each phone, tablet or computer offers different ones. Tip: many devices let you download extra voices in their speech settings.';
 let keep=VOICES.findIndex(v=>v.voiceURI===vpref.uri);if(keep>=0&&!idx.includes(keep))keep=-1;
 // no saved voice for this type yet: pick one in your language, preferring local voices
 if(keep<0&&vgender!=='any'&&idx.length){const mine=(navigator.language||'en').slice(0,2).toLowerCase();keep=[...idx].sort((a,b)=>((VOICES[a].lang||'').toLowerCase().startsWith(mine)?0:2)+(VOICES[a].localService===false?1:0)-(((VOICES[b].lang||'').toLowerCase().startsWith(mine)?0:2)+(VOICES[b].localService===false?1:0)))[0]}
 $('voicesel').value=keep>=0?String(keep):'';
 $('voicerate').value=vpref.rate||'1';$('voicepitch').value=vpref.pitch||'1';$('voicebox').hidden=false}
if(canSpeak){loadVoices();speechSynthesis.addEventListener?speechSynthesis.addEventListener('voiceschanged',loadVoices):(speechSynthesis.onvoiceschanged=loadVoices)}
function saveVoice(){const v=VOICES[+$('voicesel').value];vpref={uri:$('voicesel').value===''?'':v&&v.voiceURI,rate:$('voicerate').value,pitch:$('voicepitch').value,g:vgender};try{localStorage.setItem('galaxy.voice',JSON.stringify(vpref))}catch(e){}}
document.querySelectorAll('[data-vg]').forEach(b=>b.onclick=()=>{vgender=b.dataset.vg;vpref.g=vgender;vpref.uri='';loadVoices();saveVoice();speak(vgender==='female'?'Hi! This is a female voice.':vgender==='male'?'Hi! This is a male voice.':'Hello! This is how I sound.')});
['voicesel','voicerate','voicepitch'].forEach(id=>$(id).addEventListener('change',()=>{saveVoice();speak('Hello! This is how I sound.')}));
function speak(text,onend){if(!canSpeak)return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text),v=VOICES[+$('voicesel').value];
 if($('voicesel').value!==''&&v){u.voice=v;u.lang=v.lang}u.rate=parseFloat($('voicerate').value||'1')*(kidsMode?.92:1);u.pitch=parseFloat($('voicepitch').value||'1');if($('voicesel').value===''&&vgender!=='any')u.pitch=Math.min(2,u.pitch*(vgender==='female'?1.35:.75));
 u.onend=u.onerror=()=>{$('readb').textContent='Read aloud';onend&&onend()};speechSynthesis.speak(u);window.__lastUtter={text,voice:v?v.name:'default',rate:u.rate,pitch:u.pitch}}
$('voicetest').onclick=()=>speak(focus?`Hi! I can read about ${focus.name} for you.`:'Hi! I can read about anything in space for you.');
$('readb').onclick=()=>{if(!canSpeak||!focus)return;if(speechSynthesis.speaking){speechSynthesis.cancel();$('readb').textContent='Read aloud';return}
 speak(readText(focus));$('readb').textContent='Stop reading'};

/* ---------- space passport ---------- */
const STAMP_IDS=['sun','mercury','venus','earth','moon','mars','jupiter','saturn','uranus','neptune','pluto','io','europa','ganymede','callisto','titan','enceladus','triton','charon','phobos','belt','halley','encke','halebopp','iss','tiangong','hubble','jwst','proxima','acen','sirius','vega','polaris','betelgeuse','rigel','milky','andromeda','sgra'];
const BADGES=[['Inner planets explorer',['mercury','venus','earth','mars']],['Giant planets',['jupiter','saturn','uranus','neptune']],['Moon hopper',['moon','io','europa','ganymede','callisto','titan']],
 ['Ice worlds',['europa','enceladus','triton','pluto','charon']],['Star hopper',['proxima','acen','sirius','vega','polaris','betelgeuse','rigel']],['Galaxy explorer',['milky','andromeda','sgra']],
 ['Space station crew',['iss','tiangong','hubble','jwst']],['Comet chaser',['halley','encke','halebopp']],['Whole Solar System',['sun','mercury','venus','earth','moon','mars','jupiter','saturn','uranus','neptune','pluto']]];
let stamps=new Set();try{stamps=new Set(JSON.parse(localStorage.getItem('galaxy.passport')||'[]'))}catch(e){}
const stampCol=id=>(typeof TRAIL_COL!=='undefined'&&TRAIL_COL[id])||(STARS.find(x=>x.id===id)||{}).col||{io:'#e8c25a',europa:'#d9cbb5',ganymede:'#9a8f84',callisto:'#6b6157',titan:'#d89a48',enceladus:'#e9eef2',triton:'#c9b6ae',charon:'#9a948d',phobos:'#6b5d52',belt:'#b7a88f',halley:'#a8d8ff',encke:'#a8d8ff',halebopp:'#a8d8ff',iss:'#bfffe6',tiangong:'#bfffe6',hubble:'#bfffe6',jwst:'#ffd36b',milky:'#e6dcff',andromeda:'#f2e3ff',sgra:'#ffcf8a'}[id]||'#ffffff';
function collect(o){if(!o||!STAMP_IDS.includes(o.id))return null;if(stamps.has(o.id))return'have';const before=BADGES.filter(b=>b[1].every(i=>stamps.has(i))).length;stamps.add(o.id);
 try{localStorage.setItem('galaxy.passport',JSON.stringify([...stamps]))}catch(e){}const earned=BADGES.filter(b=>b[1].every(i=>stamps.has(i))&&b[1].includes(o.id));
 if(BADGES.filter(b=>b[1].every(i=>stamps.has(i))).length>before){showToast(`Badge earned: ${earned.map(b=>b[0]).join(', ')}!`,'badge');confetti()}else if(stamps.size===STAMP_IDS.length){confetti()}
 return'new'}
function renderPassport(){$('ppsum').textContent=`You’ve collected ${stamps.size} of ${STAMP_IDS.length} stamps. Visit a planet, moon, star or spacecraft to stamp your passport!`;
 $('badges').innerHTML=BADGES.map(([n,ids])=>{const got=ids.filter(i=>stamps.has(i)).length;return`<div class="badge${got===ids.length?' done':''}"><b>${n}</b>${got} of ${ids.length}<div class="bar"><i style="width:${got/ids.length*100}%"></i></div></div>`}).join('');
 $('stamps').innerHTML=STAMP_IDS.map(id=>{const o=objects.find(x=>x.id===id);if(!o)return'';const g=stamps.has(id),c=stampCol(id);
  return`<button class="stampc${g?' got':''}" data-go="${id}" aria-label="${o.name}${g?' (collected)':''}"><i style="${g?`background:radial-gradient(circle at 35% 35%,#fff,${c} 45%,#000 120%)`:''}"></i><span>${g?o.name:'?'}</span></button>`}).join('')}
$('stamps').addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(!b)return;const o=objects.find(x=>x.id===b.dataset.go);if(o){$('fun').hidden=true;select(o)}});

/* ---------- extend the info card: kid words, did-you-know, stamps ---------- */
{const _show=showInfo;showInfo=function(o){_show(o);const k=KIDS[o.id];
 if(kidsMode&&k){$('idesc').textContent=k[0];$('kidfact').innerHTML=`<b>Did you know?</b> ${k[1]}`;$('kidfact').hidden=false}else $('kidfact').hidden=true;
 const st=collect(o);$('stamp').hidden=st!=='new';if(st==='new')$('stamp').textContent=`New passport stamp: ${o.name}! You have ${stamps.size} of ${STAMP_IDS.length}.`;
 if(canSpeak&&speechSynthesis.speaking){speechSynthesis.cancel()}$('readb').textContent='Read aloud';$('postb').hidden=o.type==='events'}}
{const _c=$('close').onclick;$('close').onclick=e=>{if(canSpeak)speechSynthesis.cancel();_c(e)}}
{const _t=showToast;showToast=function(t,k){if(kidsMode&&/^The ISS/.test(t))t+=' Go outside and wave at the astronauts!';_t(t,k)}}

/* ---------- Me in space ---------- */
const WORLDS=[['Mercury',.378,87.969],['Venus',.907,224.701],['Earth',1,365.256],['The Moon',.166,null],['Mars',.377,686.98],['Jupiter',2.53,4332.59],['Saturn',1.065,10759.22],['Uranus',.886,30688.5],['Neptune',1.14,60182],['Pluto',.063,90560],['The Sun',27.9,null]];
function renderMe(){const w=parseFloat($('mew').value),u=$('meu').value,b=$('meb').value?new Date($('meb').value+'T12:00:00'):null,now=Date.now();
 try{localStorage.setItem('galaxy.me',JSON.stringify({w:$('mew').value,u,b:$('meb').value}))}catch(e){}
 const days=b?(now-b.getTime())/864e5:null,fd=t=>new Date(t).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'});
 $('metable').innerHTML='<tr><th>World</th><th>Your weight</th><th>Your age there</th><th>Next birthday there</th></tr>'+WORLDS.map(([n,g,P])=>{
  const wt=w>0?`${(w*g).toFixed(w*g<10?1:0)} ${u}`:'—';let age='—',nb='—';
  if(days>0&&P){const a=days/P;age=a<1?`${(a*12).toFixed(1)} months`:`${a<100?a.toFixed(1):Math.floor(a)} years`;
   if(n==='Earth'){const t=new Date(b);t.setFullYear(new Date().getFullYear());if(t.getTime()<=now)t.setFullYear(t.getFullYear()+1);nb=fd(t.getTime())}else nb=fd(b.getTime()+Math.ceil(a+1e-9)*P*864e5)}else if(days>0&&n==='The Moon')age='Same as on Earth';
  return`<tr><td>${n}${['Jupiter','Saturn','Uranus','Neptune'].includes(n)?'*':''}${n==='The Sun'?'**':''}</td><td>${wt}</td><td>${age}</td><td>${nb}</td></tr>`}).join('')+
  '<tr><td colspan="4" style="text-align:left;white-space:normal;color:var(--dim);font-size:13px">* Giant planets have no ground to stand on, so this is your weight at the cloud tops. ** Just for fun: nobody could stand on the Sun!</td></tr>'}
try{const m=JSON.parse(localStorage.getItem('galaxy.me')||'null');if(m){$('mew').value=m.w||'';$('meu').value=m.u||'lb';$('meb').value=m.b||''}else $('meu').value=(navigator.language||'').toLowerCase()==='en-us'?'lb':'kg'}catch(e){}
['mew','meu','meb'].forEach(id=>$(id).addEventListener('input',renderMe));

/* ---------- trip planner ---------- */
const DESTS=[['moon','the Moon'],['sun','the Sun'],['mercury','Mercury'],['venus','Venus'],['mars','Mars'],['jupiter','Jupiter'],['saturn','Saturn'],['uranus','Uranus'],['neptune','Neptune'],['pluto','Pluto'],['proxima','Proxima Centauri, the nearest star']];
const VEHICLES=[['Walking',5,'On foot'],['Bicycle',20,'By bicycle'],['Car on a highway',100,'By car on a highway'],['Jet airliner',900,'By jet airliner'],['Apollo 11 rocket (top speed)',39000,'In the Apollo 11 rocket at top speed'],['Parker Solar Probe (fastest spacecraft ever)',690000,'On the Parker Solar Probe, the fastest spacecraft ever'],['Speed of light',1079252849,'At the speed of light']];
$('tripto').innerHTML=DESTS.map(([id,n])=>`<option value="${id}">${n[0].toUpperCase()+n.slice(1)}</option>`).join('');$('tripby').innerHTML=VEHICLES.map(([n,v],i)=>`<option value="${i}">${n}</option>`).join('');$('tripby').value='2';
function distNowKm(id){const AUk=149597870.7,E=HP.earth;if(id==='moon')return moonNow.km;if(id==='sun')return Math.hypot(...E)*AUk;if(id==='proxima')return 4.2465*9.4607e12;return Math.hypot(...sub3(HP[id],E))*AUk}
function human(h){if(h<1)return`${Math.round(h*60)} minutes`;if(h<48)return`${h.toFixed(h<10?1:0)} hours`;const d=h/24;if(d<60)return`${Math.round(d)} days`;if(d<730)return`${Math.round(d)} days (about ${Math.round(d/30.44)} months)`;
 const y=d/365.25;if(y<1000)return`${y.toFixed(y<10?1:0)} years`;if(y<1e6)return`${Math.round(y/1000).toLocaleString()} thousand years`;if(y<1e9)return`${(y/1e6).toFixed(1)} million years`;return`${(y/1e9).toFixed(1)} billion years`}
$('tripgo').onclick=()=>{const id=$('tripto').value,[vn,v,phrase]=VEHICLES[+$('tripby').value],km=distNowKm(id),h=km/v,dn=DESTS.find(d=>d[0]===id)[1];
 const ship=$('tripship'),track=$('triptrack');ship.style.transition='none';ship.style.left='0px';void ship.offsetWidth;ship.style.transition=REDUCED?'none':'';ship.style.left=(track.clientWidth-44)+'px';$('tripout').textContent='Flying…';
 setTimeout(()=>{$('tripout').innerHTML=`${dn[0].toUpperCase()+dn.slice(1)} is <b>${Math.round(km).toLocaleString()} km</b> (${Math.round(km/1.609344).toLocaleString()} miles) away right now. ${phrase} (${v.toLocaleString()} km/h), the trip would take <b>${human(h)}</b>.`+(id==='moon'&&v===39000?' The real Apollo 11 astronauts took about 3 days, because Earth’s gravity slowed them down after the rocket’s big push.':'')+(v>1e9?` That’s also how old the light from ${dn} is when it reaches your eyes.`:'')},REDUCED?0:4000)};
$('tripfly').onclick=()=>{const o=objects.find(x=>x.id===$('tripto').value);if(o){$('fun').hidden=true;select(o)}};

/* ---------- size line-up (true sizes) ---------- */
function renderSizes(){const R=[['Mercury',2440,'mercury'],['Venus',6052,'venus'],['Earth',6371,'earth'],['Moon',1737,'moon'],['Mars',3390,'mars'],['Jupiter',69911,'jupiter'],['Saturn',58232,'saturn'],['Uranus',25362,'uranus'],['Neptune',24622,'neptune'],['Pluto',1188,'pluto']];
 const k=14/6371,H=360,cy=170,sunR=696340*k;let x=150,parts=[`<defs><linearGradient id="sg" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="110" y2="0"><stop offset="0" stop-color="#e8590c"/><stop offset=".75" stop-color="#ffa94d"/><stop offset="1" stop-color="#ffe066"/></linearGradient></defs>`,
  `<circle cx="${110-sunR}" cy="${cy}" r="${sunR}" fill="url(#sg)"/><text x="10" y="28" style="fill:#3b1300;font-weight:700">Sun</text><text x="10" y="46" style="fill:#3b1300">1,392,700 km</text>`];
 for(const[n,r,id]of R){const rr=r*k,c=TRAIL_COL[id]||'#ccc';x+=Math.max(rr,34);
  if(id==='saturn')parts.push(`<ellipse cx="${x}" cy="${cy}" rx="${rr*2.3}" ry="${rr*.45}" fill="none" stroke="#e8d29a" stroke-width="${rr*.35}" opacity=".55"/>`);
  parts.push(`<circle cx="${x}" cy="${cy}" r="${Math.max(rr,1.5)}" fill="${c}"/><text x="${x}" y="${cy+Math.max(rr,8)+20}" text-anchor="middle">${n}</text><text x="${x}" y="${cy+Math.max(rr,8)+38}" text-anchor="middle" style="fill:#9aa4b8">${(r*2).toLocaleString()} km</text>`);
  x+=Math.max(rr,34)+(id==='saturn'?rr*1.4:16)}
 $('sizes').innerHTML=`<svg width="${x+40}" height="${H}" viewBox="0 0 ${x+40} ${H}" role="img" aria-label="The Sun and planets drawn to the same scale">${parts.join('')}</svg>`;
 $('sizefact').textContent='About 1,300 Earths would fit inside Jupiter, and about 1.3 million inside the Sun. Distances between them are NOT to scale: at this scale, Earth would be about 3.3 km (2 miles) from the Sun!'}

/* ---------- postcards ---------- */
function makePostcard(){renderer.render(scene,camera);let shot;try{shot=renderer.domElement.toDataURL('image/jpeg',.92)}catch(e){$('cardout').textContent='Sorry, this browser can’t take a picture of the view.';return}
 const img=new Image();img.onload=()=>{const W=1200,H=800,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');g.fillStyle='#fdf8ec';g.fillRect(0,0,W,H);
  const s=Math.max((W-48)/img.width,(H-48)/img.height),iw=img.width*s,ih=img.height*s;g.save();g.beginPath();g.rect(24,24,W-48,H-48);g.clip();g.drawImage(img,(W-iw)/2,(H-ih)/2,iw,ih);
  const gr=g.createLinearGradient(0,H-300,0,H);gr.addColorStop(0,'#0000');gr.addColorStop(1,'#000c');g.fillStyle=gr;g.fillRect(24,H-300,W-48,276);g.restore();
  const place=focus?(focus.type==='loc'?focus.name:focus.id==='events'?'space':focus.name):'the Solar System';
  g.fillStyle='#fff';g.font='700 64px "Space Grotesk",sans-serif';g.fillText(`Greetings from ${place}!`.slice(0,40),60,H-110);
  g.font='28px "Space Grotesk",sans-serif';g.fillStyle='#ffe7b0';g.fillText(new Date(simMs).toLocaleDateString(undefined,{weekday:'long',year:'numeric',month:'long',day:'numeric'})+' · Interactive Galaxy',60,H-60);
  g.save();g.translate(W-130,120);g.rotate(.12);g.strokeStyle='#d6336c';g.lineWidth=6;g.beginPath();g.arc(0,0,70,0,7);g.stroke();g.beginPath();g.arc(0,0,56,0,7);g.stroke();
  g.fillStyle='#d6336c';g.font='700 22px "Space Grotesk",sans-serif';g.textAlign='center';g.fillText('SPACE',0,-6);g.fillText('POST',0,22);g.restore();
  const url=c.toDataURL('image/jpeg',.9);$('cardout').innerHTML=`<img src="${url}" alt="Postcard: Greetings from ${place}"><div class="frow"><a class="real" href="${url}" download="postcard-${slugId(place)||'space'}.jpg">Download postcard</a></div><p class="cap">On a phone or tablet, press and hold the picture to save or share it.</p>`};img.src=shot}
$('cardgo').onclick=()=>{$('fun').hidden=true;requestAnimationFrame(()=>{makePostcard();openFun('card')})};
$('postb').onclick=()=>{makePostcard();openFun('card')};

/* ---------- the Fun panel ---------- */
function openFun(tab){$('fun').hidden=false;document.querySelectorAll('[data-tab]').forEach(b=>{const on=b.dataset.tab===tab;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});
 document.querySelectorAll('[data-pane]').forEach(p=>p.hidden=p.dataset.pane!==tab);if(tab==='passport')renderPassport();if(tab==='me')renderMe();if(tab==='sizes')renderSizes()}
$('funb').onclick=()=>openFun('passport');$('funx').onclick=()=>$('fun').hidden=true;
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>openFun(b.dataset.tab));
addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('fun').hidden){$('fun').hidden=true;e.stopImmediatePropagation()}},true);

/* ---------- confetti ---------- */
function confetti(){if(REDUCED)return;const cv=$('confetti'),g=cv.getContext('2d'),W=cv.width=innerWidth,H=cv.height=innerHeight,cols=['#ffd43b','#ff6b6b','#4dabf7','#69db7c','#b197fc','#ffa94d'];
 const P=[...Array(160)].map(()=>({x:W/2+(Math.random()-.5)*200,y:H/3,vx:(Math.random()-.5)*14,vy:-Math.random()*12-4,r:Math.random()*6+3,c:cols[Math.random()*6|0],a:Math.random()*6}));let t=0;
 (function step(){g.clearRect(0,0,W,H);for(const p of P){p.vy+=.35;p.x+=p.vx;p.y+=p.vy;p.a+=.2;g.fillStyle=p.c;g.save();g.translate(p.x,p.y);g.rotate(p.a);g.fillRect(-p.r/2,-p.r/4,p.r,p.r/2);g.restore()}
  if(++t<150)requestAnimationFrame(step);else g.clearRect(0,0,W,H)})()}
