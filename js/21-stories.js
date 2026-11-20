// Guided space stories: narrated steps that fly the camera and move the clock
// Part of Interactive Galaxy. Files load in number order and share one global scope.

const T2=(en,es)=>({en,es});const LNG=()=>window.LANG||'en';
// helpers the steps use
function sideView(id,dist){const o=objects.find(x=>x.id===id);if(!o)return;const c=worldPos(o),sd=c.clone().negate().normalize(),side=new THREE.Vector3(0,1,0).cross(sd).normalize();
 focus=null;$('info').classList.remove('open');fly={t:0,from:controls.target.clone(),camFrom:camera.position.clone(),target:c,camTo:c.clone().add(side.multiplyScalar(dist)).add(new THREE.Vector3(0,dist*.18,0))}}
function sunView(id,dist){const o=objects.find(x=>x.id===id);if(!o)return;const c=worldPos(o),sd=c.clone().negate().normalize();focus=null;$('info').classList.remove('open');
 fly={t:0,from:controls.target.clone(),camFrom:camera.position.clone(),target:c,camTo:c.clone().add(sd.multiplyScalar(dist)).add(new THREE.Vector3(0,dist*.12,0))}}
function moonFromEarth(){const m=worldPos(objects.find(x=>x.id==='moon')),e=worldPos(earthO),d=e.clone().sub(m).normalize();focus=null;$('info').classList.remove('open');
 fly={t:0,from:controls.target.clone(),camFrom:camera.position.clone(),target:m,camTo:m.clone().add(d.multiplyScalar(2.2)).add(new THREE.Vector3(0,.5,0))}}
function shadowView(){const e=worldPos(earthO);focus=null;$('info').classList.remove('open');fly={t:0,from:controls.target.clone(),camFrom:camera.position.clone(),target:e,camTo:e.clone().add(ECLW.clone().multiplyScalar(7))}}
const at=(y,m,d,h=12,mi=0)=>Date.UTC(y,m-1,d,h,mi);
const earthAxis=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,-ER*1.6,0),new THREE.Vector3(0,ER*1.6,0)]),new THREE.LineBasicMaterial({color:0xff6b6b}));earthAxis.visible=false;earthMesh.add(earthAxis);
// a step: {t:text, go:id (fly there), view:'solar'|'stars'|'galaxy', time:ms|'now', rate:time-lapse speed, side:[id,dist], sun:[id,dist], shadow:true, card:true}
const STORIES=[
 {id:'tour',title:T2('Tour of the planets','Recorrido por los planetas'),blurb:T2('Visit the Sun and all eight planets, plus Pluto.','Visita el Sol, los ocho planetas y Plutón.'),steps:[
  {view:'solar',time:'now',t:T2('Welcome to our Solar System! Everything you see is where it really is right now. Let’s visit each world, starting with our star.','¡Bienvenido a nuestro sistema solar! Todo lo que ves está donde realmente está ahora mismo. Visitemos cada mundo, empezando por nuestra estrella.')},
  {go:'sun',t:T2('The Sun is a star, a giant ball of glowing gas. It holds everything in the Solar System together with its gravity.','El Sol es una estrella, una enorme bola de gas brillante. Con su gravedad mantiene unido todo el sistema solar.')},
  {go:'mercury',t:T2('Mercury is the smallest planet and the closest to the Sun. Its year lasts just 88 days.','Mercurio es el planeta más pequeño y el más cercano al Sol. Su año dura solo 88 días.')},
  {go:'venus',t:T2('Venus is the hottest planet. Its thick clouds trap heat like a blanket, so it’s hot enough to melt lead.','Venus es el planeta más caliente. Sus nubes espesas atrapan el calor como una manta: allí hace tanto calor que se derretiría el plomo.')},
  {go:'earth',t:T2('Earth, our home: the only planet we know with oceans of liquid water and life.','La Tierra, nuestro hogar: el único planeta que conocemos con océanos de agua líquida y vida.')},
  {go:'mars',t:T2('Mars, the red planet. Its soil is full of rust, and robot rovers are exploring it right now.','Marte, el planeta rojo. Su suelo está lleno de óxido, y ahora mismo hay robots explorándolo.')},
  {go:'jupiter',t:T2('Jupiter is the giant: more than 1,300 Earths could fit inside. Its Great Red Spot is a storm bigger than Earth.','Júpiter es el gigante: dentro cabrían más de 1.300 Tierras. Su Gran Mancha Roja es una tormenta más grande que la Tierra.')},
  {go:'saturn',t:T2('Saturn and its rings of ice and rock. Saturn is so light that it would float in water!','Saturno y sus anillos de hielo y roca. ¡Saturno es tan ligero que flotaría en el agua!')},
  {go:'uranus',t:T2('Uranus spins on its side, rolling around the Sun like a ball.','Urano gira de lado, rodando alrededor del Sol como una pelota.')},
  {go:'neptune',t:T2('Neptune is the farthest planet, with the fastest winds in the Solar System.','Neptuno es el planeta más lejano, con los vientos más rápidos del sistema solar.')},
  {go:'pluto',t:T2('And Pluto, a dwarf planet with a giant heart made of ice. That’s the end of our tour!','Y Plutón, un planeta enano con un enorme corazón de hielo. ¡Fin del recorrido!')}]},
 {id:'seasons',title:T2('Why we have seasons','¿Por qué hay estaciones?'),blurb:T2('See how Earth’s tilt gives us summer and winter.','Mira cómo la inclinación de la Tierra nos da el verano y el invierno.'),steps:[
  {time:at(2026,6,21,8,24),side:['earth',7],axis:1,t:T2('Here is Earth on June 21st, with the Sun off to the left. The red line is Earth’s axis, the line it spins around. See how it’s tilted? The North Pole leans toward the Sun.','Aquí está la Tierra el 21 de junio, con el Sol a la izquierda. La línea roja es el eje de la Tierra, la línea sobre la que gira. ¿Ves que está inclinado? El Polo Norte se inclina hacia el Sol.')},
  {time:at(2026,6,21,8,24),sun:['earth',6],axis:1,t:T2('Because the north leans toward the Sun, sunlight hits it more directly and days are longer. That’s summer in the north! Near the North Pole the Sun doesn’t set at all.','Como el norte se inclina hacia el Sol, la luz le llega más directa y los días son más largos. ¡Es verano en el norte! Cerca del Polo Norte el Sol no se pone.')},
  {time:at(2026,12,21,20,50),side:['earth',7],axis:1,t:T2('Six months later, on December 21st, Earth is on the other side of the Sun. Now the South Pole leans toward the Sun: summer in Australia, winter in the north.','Seis meses después, el 21 de diciembre, la Tierra está al otro lado del Sol. Ahora el Polo Sur se inclina hacia el Sol: es verano en Australia e invierno en el norte.')},
  {time:at(2027,3,20,14,25),sun:['earth',6],axis:1,t:T2('In March and September, neither pole leans toward the Sun. Day and night are about the same length everywhere. These are the equinoxes.','En marzo y septiembre ningún polo se inclina hacia el Sol. El día y la noche duran casi lo mismo en todas partes: son los equinoccios.')},
  {view:'solar',time:at(2027,1,3),rate:14*86400,t:T2('Surprise: Earth is closest to the Sun in early January, during northern winter! So seasons come from the tilt, not from distance. Watch a year go by.','Sorpresa: la Tierra está más cerca del Sol a principios de enero, ¡en pleno invierno del norte! Las estaciones vienen de la inclinación, no de la distancia. Mira pasar un año.')}]},
 {id:'eclipses',title:T2('How eclipses work','Cómo funcionan los eclipses'),blurb:T2('Watch the Moon’s shadow fall on Earth, then Earth’s shadow turn the Moon red.','Mira la sombra de la Luna sobre la Tierra y la sombra de la Tierra volviendo roja la Luna.'),steps:[
  {go:'moon',time:'now',t:T2('The Moon goes around Earth about once a month. Sometimes it lines up exactly with the Sun and Earth, and that makes an eclipse.','La Luna da la vuelta a la Tierra más o menos una vez al mes. A veces se alinea exactamente con el Sol y la Tierra, y eso produce un eclipse.')},
  {time:at(2027,8,2,10,7),shadow:true,t:T2('August 2nd, 2027: a total solar eclipse. The Moon passes in front of the Sun, and its shadow falls on Earth. See the dark spot over Egypt? People there will see the Sun disappear for over 6 minutes.','2 de agosto de 2027: un eclipse total de Sol. La Luna pasa delante del Sol y su sombra cae sobre la Tierra. ¿Ves la mancha oscura sobre Egipto? Allí el Sol desaparecerá durante más de 6 minutos.')},
  {time:at(2027,8,2,9,7),rate:600,shadow:true,t:T2('Watch the shadow race across Earth at thousands of kilometres an hour.','Mira cómo la sombra cruza la Tierra a miles de kilómetros por hora.')},
  {time:at(2028,12,31,16,52),moonview:1,t:T2('December 31st, 2028: a total lunar eclipse. Now Earth is between the Sun and the Moon, and Earth’s shadow turns the Moon a coppery red.','31 de diciembre de 2028: un eclipse total de Luna. Ahora la Tierra está entre el Sol y la Luna, y su sombra tiñe la Luna de rojo cobrizo.')},
  {view:'solar',time:'now',t:T2('Why isn’t there an eclipse every month? The Moon’s orbit is tilted a little, so usually its shadow misses Earth. Check Events to see when the next one is!','¿Por qué no hay eclipses cada mes? La órbita de la Luna está un poco inclinada, así que casi siempre su sombra no toca la Tierra. ¡Mira en Eventos cuándo es el próximo!')}]},
 {id:'mars',title:T2('Journey to Mars','Viaje a Marte'),blurb:T2('How far is Mars, and when is the best time to go?','¿A qué distancia está Marte y cuándo conviene ir?'),steps:[
  {go:'earth',time:'now',t:T2('Let’s plan a trip to Mars! We start at home on Earth.','¡Planeemos un viaje a Marte! Empezamos en casa, en la Tierra.')},
  {go:'mars',t:T2('Mars is the next planet out from the Sun. Right now it’s hundreds of millions of kilometres away. Its card shows today’s exact distance.','Marte es el siguiente planeta desde el Sol. Ahora mismo está a cientos de millones de kilómetros. Su ficha muestra la distancia exacta de hoy.'),card:true},
  {view:'solar',rate:14*86400,t:T2('Earth and Mars both go around the Sun, but Earth is faster. Every 26 months Earth catches up, and that’s the best time to launch. Watch them move!','La Tierra y Marte giran alrededor del Sol, pero la Tierra va más rápido. Cada 26 meses la Tierra lo alcanza, y ese es el mejor momento para despegar. ¡Míralos moverse!')},
  {go:'mars',time:'now',t:T2('The trip takes about 7 months. When you arrive, you’ll find a cold desert with the biggest volcano in the Solar System, Olympus Mons.','El viaje dura unos 7 meses. Al llegar encontrarás un desierto frío con el volcán más grande del sistema solar, el Monte Olimpo.')},
  {go:'phobos',t:T2('Mars has two tiny moons. This is Phobos, shaped like a lumpy potato. Welcome to Mars!','Marte tiene dos lunas diminutas. Esta es Fobos, con forma de patata llena de bultos. ¡Bienvenido a Marte!')}]},
 {id:'galaxy',title:T2('Our place in the galaxy','Nuestro lugar en la galaxia'),blurb:T2('Zoom out from Earth all the way to the Andromeda Galaxy.','Aléjate desde la Tierra hasta la galaxia de Andrómeda.'),steps:[
  {go:'earth',time:'now',t:T2('This is Earth, our home planet. Let’s zoom out and see where we live in the universe.','Esta es la Tierra, nuestro planeta. Alejémonos para ver dónde vivimos en el universo.')},
  {go:'moon',t:T2('The Moon is our closest neighbour, about 384,000 kilometres away. Light gets there in about one second.','La Luna es nuestra vecina más cercana, a unos 384.000 kilómetros. La luz llega en poco más de un segundo.')},
  {view:'solar',t:T2('Our Solar System: the Sun and its planets. Sunlight takes about 4 hours to reach Neptune.','Nuestro sistema solar: el Sol y sus planetas. La luz del Sol tarda unas 4 horas en llegar a Neptuno.')},
  {go:'voyager1',t:T2('Voyager 1 is the farthest spacecraft. Its signals now take a whole day to reach us.','La Voyager 1 es la nave más lejana. Sus señales tardan ya un día entero en llegarnos.')},
  {view:'stars',t:T2('Our nearest stars. The closest, Proxima Centauri, is so far that its light takes over 4 years to get here.','Nuestras estrellas más cercanas. La más próxima, Próxima Centauri, está tan lejos que su luz tarda más de 4 años en llegar.')},
  {view:'galaxy',t:T2('The Milky Way, our galaxy, with hundreds of billions of stars. Our Sun is just one of them, out in a spiral arm.','La Vía Láctea, nuestra galaxia, con cientos de miles de millones de estrellas. Nuestro Sol es solo una de ellas, en un brazo espiral.')},
  {go:'andromeda',t:T2('And this is Andromeda, our neighbour galaxy. Its light left it 2.5 million years ago. The universe is huge!','Y esta es Andrómeda, nuestra galaxia vecina. Su luz salió de allí hace 2,5 millones de años. ¡El universo es enorme!')}]}];
let story=null,narrate=true;
function storyListHTML(){return STORIES.map(s=>`<button class="stcard" data-story="${s.id}"><div><b>${s.title[LNG()]}</b><span>${s.blurb[LNG()]}</span></div><i>${s.steps.length} ${LNG()==='es'?'pasos':'steps'}</i></button>`).join('')}
function startStory(id){const s=STORIES.find(x=>x.id===id);if(!s)return;$('fun').hidden=true;if(typeof tl!=='undefined'&&tl)stopTimelapse();story={s,i:0};document.body.classList.add('storying');$('storybar').hidden=false;
 narrate=canSpeak&&(narrate!==false);showStep()}
function showStep(){const{s,i}=story,st=s.steps[i],es=LNG()==='es';$('sttitle').textContent=s.title[LNG()];$('ststep').textContent=es?`Paso ${i+1} de ${s.steps.length}`:`Step ${i+1} of ${s.steps.length}`;
 $('sttext').textContent=st.t[LNG()];$('stback').hidden=i===0;$('stnext').textContent=i===s.steps.length-1?(es?'Terminar':'Finish'):(es?'Siguiente':'Next');
 $('stback').textContent=es?'Atrás':'Back';$('stexit').textContent=es?'Salir':'Exit';voiceBtn();$('stvoice').hidden=!canSpeak;earthAxis.visible=!!st.axis;
 // time first, so positions are right before the camera moves
 if(st.time==='now'){simMs=Date.now();rate=1;paused=false;dirn=1;setLive(true)}else if(typeof st.time==='number'){simMs=st.time;setLive(false);dirn=1}
 if(st.rate){rate=st.rate;paused=false;setLive(false)}else if(st.time!==undefined&&st.time!=='now'){paused=true}
 const sel=$('rate');sel.value=[...sel.options].some(o=>+o.value===rate)?String(rate):sel.value;$('pause').textContent=paused?'▶':'❚❚';
 updateWorld(simMs);
 if(st.view)setView(st.view);
 if(st.go){const o=objects.find(x=>x.id===st.go);if(o){select(o);if(!st.card)setTimeout(()=>{if(story)$('info').classList.remove('open')},50)}}
 if(st.side)sideView(...st.side);if(st.sun)sunView(...st.sun);if(st.shadow){updateEarthSun();shadowView()}if(st.moonview){updateEarthSun();moonFromEarth()}
 if(narrate&&canSpeak)setTimeout(()=>{if(story)speak(st.t[LNG()])},300)}
function endStory(){story=null;earthAxis.visible=false;if(canSpeak)speechSynthesis.cancel();document.body.classList.remove('storying');$('storybar').hidden=true;$('now').click()}
$('stnext').onclick=()=>{if(!story)return;if(story.i<story.s.steps.length-1){story.i++;showStep()}else{endStory();if(typeof confetti==='function')confetti()}};
$('stback').onclick=()=>{if(story&&story.i>0){story.i--;showStep()}};$('stexit').onclick=endStory;
function voiceBtn(){const es=LNG()==='es';$('stvoice').textContent=narrate?(es?'Narración sí':'Narration on'):(es?'Narración no':'Narration off');$('stvoice').setAttribute('aria-pressed',narrate)}
$('stvoice').onclick=()=>{narrate=!narrate;if(!narrate){if(canSpeak)speechSynthesis.cancel()}else if(story)speak(story.s.steps[story.i].t[LNG()]);voiceBtn()};
$('storylist').addEventListener('click',e=>{const b=e.target.closest('[data-story]');if(b)startStory(b.dataset.story)});
$('storyb').onclick=()=>openFun('stories');
{const _of=openFun;openFun=function(tab){_of(tab);if(tab==='stories')$('storylist').innerHTML=storyListHTML()}}
addEventListener('keydown',e=>{if(!story)return;if(e.key==='ArrowRight'){e.preventDefault();$('stnext').click()}else if(e.key==='ArrowLeft'){e.preventDefault();$('stback').click()}else if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();endStory()}},true);
