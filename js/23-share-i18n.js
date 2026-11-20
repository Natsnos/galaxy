// Sharing (phone share sheet) and Spanish language support
// Part of Interactive Galaxy. Files load in number order and share one global scope.

/* ---------- share ---------- */
if(navigator.share){$('shareb').hidden=false}
$('shareb').onclick=async()=>{const n=focus?focus.name:'';try{await navigator.share({title:'Interactive Galaxy'+(n?' – '+n:''),text:tr(n?`Look at ${n} in the live 3D Solar System!`:'Explore the live 3D Solar System!',n?`¡Mira ${n} en el sistema solar en 3D en vivo!`:'¡Explora el sistema solar en 3D en vivo!'),url:location.href})}catch(e){}};

/* ---------- Spanish ---------- */
// exact interface strings → Spanish (object names included, so labels, menus and card titles switch too)
const ES={'Solar system':'Sistema solar','Nearby stars':'Estrellas cercanas','Milky Way':'Vía Láctea','Go to…':'Ir a…','Sky view':'Ver el cielo','Events':'Eventos','Stories':'Historias','Fun for kids':'Diversión para niños','Kids mode':'Modo niños','Tour':'Guía','Install app':'Instalar app','Go':'Ir',
 'Now':'Ahora','Watch it move':'Verlo moverse','Orbits':'Órbitas','Labels':'Etiquetas','City lights':'Luces de ciudades','True distances':'Distancias reales','Trails':'Estelas','Sound':'Sonido','Controls':'Controles','More':'Más','Less':'Menos','Live feeds & credits':'Datos en vivo y créditos',
 'Real time':'Tiempo real','1 min / sec':'1 min/seg','1 hour / sec':'1 hora/seg','6 hours / sec':'6 horas/seg','1 day / sec':'1 día/seg','1 week / sec':'1 semana/seg','2 weeks / sec':'2 semanas/seg','1 month / sec':'1 mes/seg','1 year / sec':'1 año/seg',
 'LIVE':'EN VIVO','PAUSED':'PAUSA','REWIND':'RETROCESO','SIMULATED':'SIMULADO',
 'Right now (at the time shown)':'Ahora mismo (a la hora indicada)','Facts':'Datos','Read aloud':'Leer en voz alta','Stop reading':'Dejar de leer','Copy link to this':'Copiar enlace','Link copied':'Enlace copiado','Postcard':'Postal','Share':'Compartir','Real photo':'Foto real','3D model':'Modelo 3D',
 'Voice options':'Opciones de voz','Female voices':'Voces femeninas','Male voices':'Voces masculinas','All voices':'Todas las voces','Test this voice':'Probar esta voz','Voice':'Voz','Speed':'Velocidad','Style':'Estilo','Slow':'Lenta','A bit slow':'Un poco lenta','Normal':'Normal','Fast':'Rápida','Deep (robot)':'Grave (robot)','High':'Aguda','Squeaky (chipmunk)':'Muy aguda (ardilla)','Device default':'Voz del dispositivo',
 'Fly to a place on Earth':'Volar a un lugar de la Tierra','Fly':'Volar','Use my location':'Usar mi ubicación','Sky view from here':'Ver el cielo desde aquí','Make this my home':'Hacer de este mi hogar','Saved as home':'Guardado como hogar','Earth imagery':'Imágenes de la Tierra','Standard':'Normal','Blue Marble':'Canica Azul','Yesterday from space':'Ayer desde el espacio',
 'Zoom in on this place':'Acercarse a este lugar','Region':'Región','City':'Ciudad','Street':'Calle','Live weather on the globe':'Tiempo en vivo en el globo','Clouds':'Nubes','Temperature':'Temperatura','Rain & snow':'Lluvia y nieve','Off':'No','Show °C':'Ver °C','Show °F':'Ver °F','Freezing':'Helado','Cold':'Frío','Mild':'Templado','Warm':'Cálido','Hot':'Caluroso',
 'Map markers on the globe':'Marcadores en el globo','Earthquakes':'Terremotos','Wildfires':'Incendios','Storms':'Tormentas','Volcanoes':'Volcanes','Rocket launches':'Lanzamientos','Other events':'Otros eventos','Hover a marker to see what it is. Click or tap it for details.':'Pasa el ratón sobre un marcador para ver qué es. Haz clic o tócalo para ver detalles.',
 'Space passport':'Pasaporte espacial','Me in space':'Yo en el espacio','Trip planner':'Planificador de viajes','Size line-up':'Tamaños','Space quiz':'Quiz espacial',
 'How much would you weigh on other worlds, and how old would you be?':'¿Cuánto pesarías en otros mundos y qué edad tendrías?','Your weight':'Tu peso','Your birthday':'Tu cumpleaños','World':'Mundo','Your age there':'Tu edad allí','Next birthday there':'Próximo cumpleaños allí','Same as on Earth':'Igual que en la Tierra',
 'How long would it take to get there, using the real distance right now?':'¿Cuánto tardarías en llegar, con la distancia real de ahora mismo?','Go to':'Ir a','Travel by':'Viajar en','Blast off':'¡Despegar!','Fly there in 3D':'Volar allí en 3D','Flying…':'Volando…',
 'Walking':'A pie','Bicycle':'Bicicleta','Car on a highway':'Coche por autopista','Jet airliner':'Avión','Apollo 11 rocket (top speed)':'Cohete Apolo 11 (velocidad máxima)','Parker Solar Probe (fastest spacecraft ever)':'Sonda Solar Parker (la nave más rápida)','Speed of light':'Velocidad de la luz',
 'The Sun and planets drawn to the same scale. Scroll sideways to see them all.':'El Sol y los planetas dibujados a la misma escala. Desliza de lado para verlos todos.',
 'About 1,300 Earths would fit inside Jupiter, and about 1.3 million inside the Sun. Distances between them are NOT to scale: at this scale, Earth would be about 3.3 km (2 miles) from the Sun!':'Dentro de Júpiter cabrían unas 1.300 Tierras, y dentro del Sol unos 1,3 millones. Las distancias NO están a escala: ¡a esta escala la Tierra estaría a unos 3,3 km del Sol!',
 'Turn what you see into a postcard. Fly somewhere first, then make it.':'Convierte lo que ves en una postal. Primero vuela a algún sitio y luego créala.','Make a postcard of this view':'Hacer una postal de esta vista','Download postcard':'Descargar postal','On a phone or tablet, press and hold the picture to save or share it.':'En un teléfono o tableta, mantén pulsada la imagen para guardarla o compartirla.',
 'Pick a story. The camera flies you through it, and it can read each step aloud.':'Elige una historia. La cámara te lleva volando y puede leer cada paso en voz alta.','Start the quiz':'Empezar el quiz','Play again':'Jugar otra vez','Next question':'Siguiente pregunta','See my score':'Ver mi puntuación','Show me':'Muéstramelo',
 'Look around':'Mirar alrededor','Back to chart':'Volver al mapa','Learn about it':'Saber más','Next':'Siguiente','Back':'Atrás','Skip':'Saltar','Done':'Listo','Exit':'Salir',
 'Inner planets explorer':'Explorador de planetas interiores','Giant planets':'Planetas gigantes','Moon hopper':'Saltador de lunas','Ice worlds':'Mundos helados','Star hopper':'Viajero de estrellas','Galaxy explorer':'Explorador de galaxias','Space station crew':'Tripulación de la estación','Comet chaser':'Cazador de cometas','Whole Solar System':'Todo el sistema solar','Deep-space explorer':'Explorador del espacio profundo','Quiz whiz':'Genio del quiz',
 'Sun':'Sol','The Sun':'El Sol','Mercury':'Mercurio','Earth':'Tierra','The Moon':'La Luna','Moon':'Luna','Mars':'Marte','Jupiter':'Júpiter','Saturn':'Saturno','Uranus':'Urano','Neptune':'Neptuno','Pluto':'Plutón','Phobos':'Fobos','Ganymede':'Ganímedes','Titan':'Titán','Enceladus':'Encélado','Rhea':'Rea','Iapetus':'Jápeto','Titania':'Titania','Oberon':'Oberón','Triton':'Tritón','Charon':'Caronte',
 'Asteroid Belt':'Cinturón de asteroides','Andromeda Galaxy':'Galaxia de Andrómeda','Halley’s Comet':'Cometa Halley','Comet Encke':'Cometa Encke','Comet Hale–Bopp':'Cometa Hale-Bopp','Sun overhead':'Sol en el cénit','Aurora borealis zone':'Zona de auroras boreales','Aurora australis zone':'Zona de auroras australes',
 'James Webb Space Telescope':'Telescopio espacial James Webb','GPS constellation':'Constelación GPS','Parker Solar Probe':'Sonda Solar Parker','Proxima Centauri':'Próxima Centauri','Alpha Centauri A':'Alfa Centauri A','Polaris':'Polaris (Estrella Polar)',
 'Terrestrial planet':'Planeta rocoso','Gas giant':'Gigante gaseoso','Ice giant':'Gigante helado','Spacecraft':'Nave espacial','Comet':'Cometa'};
const ES_RX=[[/^([\d.,]+) years$/,'$1 años'],[/^([\d.,]+) months$/,'$1 meses'],[/^(\d+) of (\d+)$/,'$1 de $2'],[/^Moon of (.+)$/,m=>'Luna de '+(ES[m.slice(8)]||m.slice(8))],
 [/^You’ve collected (\d+) of (\d+) stamps\..*/,'Has conseguido $1 de $2 sellos. ¡Visita planetas, lunas, estrellas y naves para sellar tu pasaporte!'],[/^Facing (.+)$/,s=>s]];
const EN_BACK=new Map();// node → English text, so we can switch back
function trNode(n){const t=n.nodeValue;if(!t||!t.trim())return;const k=t.trim();
 if(window.LANG==='es'){let v=ES[k];if(v===undefined)for(const[rx,rep]of ES_RX){if(rx.test(k)){v=k.replace(rx,rep);break}}if(v!==undefined&&v!==k){EN_BACK.set(n,t);n.nodeValue=t.replace(k,v)}}
 else if(EN_BACK.has(n)){n.nodeValue=EN_BACK.get(n);EN_BACK.delete(n)}}
const SKIP=new Set(['SCRIPT','STYLE','CANVAS','svg']);
function trTree(root){if(root.nodeType===3){trNode(root);return}if(SKIP.has(root.nodeName)||root.id==='labels'&&window.LANG!=='es'&&!EN_BACK.size)return;
 const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode())trNode(n);
 if(root.querySelectorAll)root.querySelectorAll('[placeholder],[aria-label]').forEach(el=>{for(const a of['placeholder','aria-label']){const v=el.getAttribute(a);if(!v)continue;const key='en'+a.replace('-','');const o=el.dataset[key]||v;
  if(window.LANG==='es'){const es=ATTR_ES[o];if(es){el.dataset[key]=o;el.setAttribute(a,es)}}else if(el.dataset[key])el.setAttribute(a,el.dataset[key])}})}
const ATTR_ES={'Search an address, place or planet…':'Busca una dirección, lugar o planeta…','Address, place, or lat, lon':'Dirección, lugar o lat, lon','Go to object':'Ir al objeto','Close':'Cerrar','Close sky view':'Cerrar vista del cielo','Show the tour':'Ver la guía'};
let trBusy=false;const trObs=new MutationObserver(ms=>{if(trBusy||window.LANG!=='es'&&!EN_BACK.size)return;trBusy=true;try{for(const m of ms){if(m.type==='characterData')trNode(m.target);else m.addedNodes.forEach(trTree)}}finally{trBusy=false}});
trObs.observe(document.body,{subtree:true,childList:true,characterData:true});
// simple Spanish descriptions and facts for kids mode (and as the description in Spanish)
const KIDS_ES={sun:['El Sol es una estrella: una enorme bola de gas muy caliente que brilla. ¡Es tan grande que dentro cabrían 1,3 millones de Tierras!','La luz del Sol tarda unos 8 minutos en llegar, así que siempre lo ves como era hace 8 minutos.'],
 mercury:['Mercurio es el planeta más pequeño y el más cercano al Sol. Da la vuelta al Sol más rápido que ningún otro planeta.','Un año en Mercurio dura solo 88 días: ¡cumplirías años cada 3 meses!'],
 venus:['Venus es el planeta más caliente, aún más que Mercurio, porque sus nubes espesas atrapan el calor como una manta.','Venus gira al revés: allí el Sol sale por el oeste y se pone por el este.'],
 earth:['La Tierra es nuestro hogar: el único planeta que conocemos con océanos de agua líquida y seres vivos.','En el ecuador, la Tierra gira a unos 1.670 km/h, ¡pero no lo notamos!'],
 moon:['La Luna es nuestra vecina más cercana en el espacio. ¡Doce astronautas han caminado sobre ella!','Las huellas en la Luna pueden durar millones de años, porque allí no hay viento que las borre.'],
 mars:['Marte es rojo porque su suelo está lleno de óxido. Tiene el volcán más grande del sistema solar, el Monte Olimpo.','Ahora mismo hay robots recorriendo Marte en busca de señales de vida antigua.'],
 jupiter:['Júpiter es el planeta más grande: ¡dentro cabrían más de 1.300 Tierras! Está hecho sobre todo de gas.','La Gran Mancha Roja es una tormenta más grande que la Tierra que dura desde hace cientos de años.'],
 saturn:['Saturno tiene anillos preciosos hechos de miles de millones de trozos de hielo y roca, algunos como granos de arena y otros como casas.','Saturno es tan ligero para su tamaño que flotaría en una bañera gigante de agua.'],
 uranus:['Urano es un gigante helado que gira de lado, como una pelota rodando alrededor del Sol.','Urano fue el primer planeta descubierto con un telescopio, en 1781.'],
 neptune:['Neptuno es el planeta más lejano del Sol. Es oscuro y frío, y tiene los vientos más rápidos del sistema solar.','Un año en Neptuno dura 165 años terrestres: ¡solo ha dado una vuelta al Sol desde que se descubrió!'],
 pluto:['Plutón es un planeta enano muy, muy lejano. Tiene una gran llanura de hielo con forma de corazón.','Plutón es más pequeño que nuestra Luna.'],
 io:['Ío está cubierta de volcanes: ¡es el lugar con más volcanes del sistema solar!','Algunos volcanes de Ío lanzan material a cientos de kilómetros hacia el espacio.'],
 europa:['Europa está cubierta de hielo y debajo esconde un océano enorme.','Los científicos creen que su océano es uno de los mejores lugares para buscar vida fuera de la Tierra.'],
 ganymede:['Ganímedes es la luna más grande de todo el sistema solar, ¡más grande que el planeta Mercurio!','Es la única luna con su propio campo magnético.'],
 callisto:['Calisto tiene tantos cráteres que casi no queda sitio para otros nuevos.','Su superficie tiene unos 4.000 millones de años.'],
 titan:['Titán es la luna más grande de Saturno. Tiene un aire naranja y espeso y lagos de metano líquido en vez de agua.','¡Un robot volador llamado Dragonfly va a explorar Titán en la década de 2030!'],
 enceladus:['Encélado es una pequeña luna helada que lanza enormes chorros de agua al espacio.','Es lo más brillante del sistema solar: su hielo refleja casi toda la luz del Sol.'],
 triton:['Tritón es la luna más grande de Neptuno, ¡y gira alrededor de él al revés!','Tritón tiene géiseres que lanzan gas nitrógeno muy alto.'],
 charon:['Caronte es la gran luna de Plutón. Es tan grande que Plutón y Caronte giran uno alrededor del otro como bailarines.','Caronte tiene un casquete rojizo en su polo norte.'],
 phobos:['Fobos es una luna diminuta de Marte, con forma de patata llena de bultos.','Fobos se acerca poco a poco a Marte y algún día se romperá.'],
 iss:['La Estación Espacial Internacional es una casa en el espacio donde viven astronautas y hacen experimentos. Es tan grande como un campo de fútbol.','La EEI da la vuelta a la Tierra cada 90 minutos: ¡los astronautas ven unos 16 amaneceres al día!'],
 hubble:['Hubble es un telescopio espacial que hace fotos increíbles de planetas, estrellas y galaxias desde 1990.','Hubble es tan largo como un autobús escolar.'],
 jwst:['El telescopio James Webb es el telescopio más grande del espacio. Ve el calor (luz infrarroja) para encontrar las primeras galaxias.','Su enorme parasol es del tamaño de una pista de tenis.'],
 halley:['El cometa Halley es una enorme bola de nieve sucia que pasa cerca de la Tierra cada 76 años.','Volverá en 2061. ¿Cuántos años tendrás entonces?'],
 betelgeuse:['Betelgeuse es una estrella gigante roja en la constelación de Orión. ¡Si estuviera en el lugar del Sol, se tragaría a Marte!','Algún día Betelgeuse explotará como supernova.'],
 rigel:['Rigel es una estrella azul muy brillante en el pie de Orión.','Rigel brilla unas 120.000 veces más que nuestro Sol.'],
 sirius:['Sirio es la estrella más brillante del cielo nocturno.','Sirio tiene una diminuta estrella compañera llamada «el Cachorro».'],
 proxima:['Próxima Centauri es la estrella más cercana al Sol. Es una pequeña estrella roja.','Incluso a la velocidad de la luz, tardarías más de 4 años en llegar.'],
 polaris:['Polaris es la Estrella Polar. Se queda casi en el mismo sitio toda la noche, por eso la gente la ha usado para orientarse.','Polaris en realidad son tres estrellas juntas.'],
 vega:['Vega es una estrella blanca azulada muy brillante del cielo de verano.','Vega gira tan rápido que está abultada por el medio.'],
 milky:['La Vía Láctea es nuestra galaxia: una enorme ciudad giratoria de cientos de miles de millones de estrellas. ¡El Sol es solo una de ellas!','En una noche oscura, lejos de las luces de la ciudad, se ve como una franja brillante en el cielo.'],
 andromeda:['La galaxia de Andrómeda es nuestra gran vecina, con un billón de estrellas.','Es lo más lejano que puedes ver a simple vista: ¡su luz salió hace 2,5 millones de años!'],
 sgra:['Sagitario A* es un agujero negro gigante en el centro de nuestra galaxia. Pesa como 4 millones de soles.','Nada puede escapar de un agujero negro, ni siquiera la luz.'],
 belt:['El cinturón de asteroides es un gran anillo de rocas espaciales entre Marte y Júpiter.','Hay millones de asteroides, pero están tan separados que las naves lo cruzan sin problema.'],
 aurora0:['Las auroras boreales son cortinas de luz verde y rosa en el cielo cerca del Polo Norte.','Se producen cuando partículas del Sol chocan con el aire, muy alto sobre nosotros.'],
 starlink:['Starlink es un grupo de miles de pequeños satélites que llevan internet a todo el mundo.','A veces se ve un «tren» de satélites Starlink cruzando el cielo nocturno.'],
 voyager1:['La Voyager 1 es la nave más lejana de la Tierra. Pasó junto a Júpiter y Saturno y ahora viaja entre las estrellas.','Sus mensajes de radio tardan ya un día entero en llegarnos, viajando a la velocidad de la luz.'],
 voyager2:['La Voyager 2 es la única nave que ha visitado Urano y Neptuno.','Lleva un disco dorado con música, sonidos y saludos de la Tierra, por si algún extraterrestre la encuentra.'],
 newhorizons:['New Horizons pasó junto a Plutón en 2015 y nos mostró su enorme corazón de hielo.','¡Tardó 9 años en llegar a Plutón!'],
 parker:['La Sonda Solar Parker vuela más cerca del Sol que nada antes. ¡También es lo más rápido que ha construido el ser humano!','Su escudo térmico supera los 1.000 °C, pero los instrumentos de detrás se mantienen a temperatura ambiente.']};
{const _show=showInfo;showInfo=function(o){_show(o);if(window.LANG!=='es')return;const k=KIDS_ES[o.id];
 if(k){$('idesc').textContent=k[0];if(kidsMode){$('kidfact').innerHTML=`<b>¿Sabías que…?</b> ${k[1]}`;$('kidfact').hidden=false}}
 trTree($('info'))}}
// read aloud in Spanish with a Spanish voice
{const _rt=readText;readText=function(o){if(window.LANG==='es'){const k=KIDS_ES[o.id];const n=ES[o.name]||o.name;return k?`${n}. ${k[0]} ¿Sabías que…? ${k[1]}`:`${n}.`}return _rt(o)}}
{const _sp=speak;speak=function(text,onend){if(window.LANG==='es'&&VOICES.length){const sel=$('voicesel'),cur=VOICES[+sel.value];if(!(cur&&/^es/i.test(cur.lang))){
  const pool=VOICES.map((v,i)=>i).filter(i=>/^es/i.test(VOICES[i].lang)),pick=pool.find(i=>vgender==='any'||genderOf(VOICES[i])===vgender)??pool[0];
  if(pick!==undefined){const prev=sel.value;sel.value=String(pick);_sp(text,onend);sel.value=prev;return}}}_sp(text,onend)}}
// quiz in Spanish: [question, answers, explanation] in the same order as QUIZ
const QUIZ_ES=[['¿Cuál es el planeta más grande?',['Saturno','Júpiter','Neptuno','Tierra'],'Júpiter es tan grande que dentro cabrían más de 1.300 Tierras.'],
 ['¿Qué planeta está más cerca del Sol?',['Venus','Marte','Mercurio','Tierra'],'Mercurio es el planeta más cercano al Sol y el más pequeño.'],
 ['¿Cuál es el planeta más caliente?',['Mercurio','Venus','Marte','Júpiter'],'Venus es más caliente que Mercurio, porque sus nubes espesas atrapan el calor como una manta.'],
 ['¿Por qué Marte es rojo?',['Está ardiendo','Su suelo está lleno de óxido','Está cubierto de plantas rojas','Refleja el Sol'],'El suelo de Marte tiene mucho óxido de hierro: ¡herrumbre!'],
 ['¿De qué están hechos los anillos de Saturno?',['Gas','Hielo y roca','Metal','Nubes'],'De miles de millones de trozos de hielo y roca, algunos como granos de arena y otros como casas.'],
 ['¿Cuánto tarda la luz del Sol en llegar a la Tierra?',['8 segundos','8 minutos','8 horas','8 días'],'Unos 8 minutos y 20 segundos. ¡Siempre ves el Sol como era hace 8 minutos!'],
 ['¿Cuántas personas han caminado sobre la Luna?',['Ninguna','2','12','100'],'Doce astronautas caminaron sobre la Luna entre 1969 y 1972.'],
 ['¿Qué planeta gira de lado?',['Urano','Neptuno','Marte','Tierra'],'Urano está inclinado unos 98°, así que rueda alrededor del Sol de lado.'],
 ['¿Qué es el Sol?',['Un planeta','Una estrella','Una luna','Un cometa'],'El Sol es una estrella: una enorme bola de gas caliente que brilla.'],
 ['¿Qué luna tiene más volcanes?',['Nuestra Luna','Titán','Ío','Europa'],'Ío, una luna de Júpiter, tiene cientos de volcanes activos.'],
 ['¿Cuál es la luna más grande del sistema solar?',['Titán','Ganímedes','Nuestra Luna','Europa'],'Ganímedes, una luna de Júpiter, es incluso más grande que el planeta Mercurio.'],
 ['¿Qué planeta tiene los vientos más rápidos?',['Tierra','Júpiter','Neptuno','Marte'],'Los vientos de Neptuno alcanzan unos 2.000 km/h.'],
 ['¿Cómo se llama nuestra galaxia?',['Andrómeda','La Vía Láctea','La Osa Mayor','Orión'],'Vivimos en la Vía Láctea, una galaxia espiral con cientos de miles de millones de estrellas.'],
 ['¿Qué estrella está más cerca del Sol?',['Sirio','Polaris','Próxima Centauri','Betelgeuse'],'Próxima Centauri, a unos 4,2 años luz.'],
 ['¿Cuál es la estrella más brillante del cielo nocturno?',['Polaris','Sirio','Vega','Rigel'],'Sirio. (¡La Estrella Polar no es la más brillante!)'],
 ['¿Qué causa un eclipse de Sol?',['La sombra de la Tierra sobre la Luna','La Luna tapa el Sol','Las nubes','El Sol se apaga'],'En un eclipse de Sol, la Luna pasa entre la Tierra y el Sol y tapa su luz.'],
 ['¿Por qué hay estaciones?',['La Tierra se acerca al Sol en verano','La Tierra está inclinada','El Sol se calienta más','La Luna se mueve'],'Por la inclinación de la Tierra, cada mitad se inclina por turnos hacia el Sol. ¡La Tierra está más cerca del Sol en enero!'],
 ['¿Cuánto tarda la EEI en dar la vuelta a la Tierra?',['Unos 90 minutos','Un día','Una semana','Un año'],'Unos 90 minutos, así que los astronautas ven unos 16 amaneceres al día.'],
 ['¿Qué nave está más lejos de la Tierra?',['Hubble','La EEI','Voyager 1','New Horizons'],'La Voyager 1. Sus señales ya tardan un día entero en llegarnos.'],
 ['¿Qué es Plutón?',['Un planeta','Un planeta enano','Una luna','Una estrella'],'Plutón es un planeta enano desde 2006.'],
 ['¿Qué luna tiene lagos de metano líquido?',['Titán','Europa','Fobos','Calisto'],'Titán, luna de Saturno, tiene lagos y mares de metano y etano líquidos.'],
 ['¿Qué hay en el centro de nuestra galaxia?',['Una estrella gigante','Un agujero negro supermasivo','Nada','El Sol'],'Un agujero negro llamado Sagitario A*, unos 4 millones de veces más pesado que el Sol.'],
 ['¿Cuánto dura un año en Mercurio?',['88 días','365 días','12 años','1 día'],'Mercurio da la vuelta al Sol en solo 88 días terrestres.'],
 ['¿Qué planeta flotaría en el agua?',['Tierra','Júpiter','Saturno','Marte'],'Saturno es menos denso que el agua: ¡flotaría en una bañera lo bastante grande!'],
 ['¿Qué produce las auroras boreales?',['Los rayos','Partículas del Sol que chocan con el aire','Reflejos en el hielo','Las luces de las ciudades'],'Partículas del Sol chocan con los gases de la parte alta de la atmósfera y los hacen brillar.'],
 ['¿Qué planeta tiene la Gran Mancha Roja?',['Marte','Júpiter','Saturno','Venus'],'La Gran Mancha Roja de Júpiter es una tormenta más grande que la Tierra.'],
 ['¿De qué está hecho sobre todo un cometa?',['Hielo y polvo','Fuego','Metal','Solo gas'],'Los cometas son bolas de nieve sucia de hielo y polvo. Cerca del Sol les crecen colas brillantes.'],
 ['¿Qué luna lanza chorros de agua al espacio?',['Encélado','Nuestra Luna','Deimos','Caronte'],'Encélado, luna de Saturno, tiene géiseres alimentados por un océano bajo el hielo.']];
{const qtext=i=>window.LANG==='es'&&QUIZ_ES[i]?[QUIZ_ES[i][0],QUIZ_ES[i][1],QUIZ[i][2],QUIZ_ES[i][2],QUIZ[i][4]]:QUIZ[i];
 const _sq=showQ;showQ=function(){_sq();if(window.LANG!=='es'||!qz||qz.i>=qz.idx.length){trTree($('quizbox'));return}const[q,opts]=qtext(qz.idx[qz.i]);const box=$('quizbox');box.querySelector('.qq').textContent=q;box.querySelectorAll('[data-a]').forEach((b,k)=>b.textContent=opts[k]);
  box.querySelector('.qstars').textContent=`Pregunta ${qz.i+1} de ${qz.idx.length} · ${'★'.repeat(qz.score)}`}
 const _an=answer;answer=function(k){const before=qz.score;_an(k);if(window.LANG!=='es')return;const[,,,exp]=qtext(qz.idx[qz.i]);const ok=qz.score>before;const p=$('qafter').querySelector('.qexp');if(p)p.innerHTML=`<b>${ok?'¡Correcto!':'No exactamente.'}</b> ${exp}`;trTree($('qafter'));
  if(kidsMode&&canSpeak)speak((ok?'¡Correcto! ':'No exactamente. ')+exp)}}
// the tour in Spanish
const TOUR_ES=['<b>Bienvenido al sistema solar en vivo</b>Todo lo que ves está en su posición real ahora mismo. El reloj EN VIVO mueve el Sol, los planetas, la Luna y el giro de la Tierra.',
 '<b>Busca lo que quieras</b>Escribe una dirección, un lugar o un planeta. Las direcciones te llevan volando al sitio con imágenes de satélite reales y una vista de Google Maps.',
 '<b>Explora</b>Arrastra para girar y usa la rueda o pellizca para acercarte. Toca cualquier planeta, luna, estrella, satélite o marcador para ver datos, información en vivo y fotos reales.',
 '<b>Controla el tiempo</b>Pausa, retrocede o adelanta hasta un año por segundo. <i>Ahora</i> vuelve al tiempo real.',
 '<b>Verlo moverse</b>Acelera el tiempo durante 25 segundos para ver moverse planetas, lunas y la Tierra, con estelas brillantes. Después vuelve al tiempo real.',
 '<b>Diversión para niños</b>Colecciona sellos en tu pasaporte, descubre tu peso y edad en otros planetas, planifica un viaje, compara tamaños y haz postales. El <i>modo niños</i> usa palabras sencillas y todas las fichas se pueden leer en voz alta.',
 '<b>Mira hacia arriba</b>«Ver el cielo» muestra el cielo de esta noche sobre cualquier lugar. «Eventos» muestra eclipses, lluvias de estrellas y lanzamientos.',
 '<b>Mira las distancias reales</b>«Distancias reales» separa los planetas como están de verdad. Toca «Guía» cuando quieras para volver a ver esto.'];
{const _ts=showTourStep;showTourStep=function(){_ts();if(window.LANG==='es'&&TOUR_ES[tourI]){$('ttext').innerHTML=TOUR_ES[tourI];$('tstep').textContent=`${tourI+1} de ${TOUR.length}`;$('tnext').textContent=tourI===TOUR.length-1?'Listo':'Siguiente'}}}
// trip planner result in Spanish
{const humanES=h=>{if(h<1)return`${Math.round(h*60)} minutos`;if(h<48)return`${h.toFixed(h<10?1:0).replace('.',',')} horas`;const d=h/24;if(d<60)return`${Math.round(d)} días`;if(d<730)return`${Math.round(d)} días (unos ${Math.round(d/30.44)} meses)`;
  const y=d/365.25;if(y<1000)return`${y.toFixed(y<10?1:0).replace('.',',')} años`;if(y<1e6)return`${Math.round(y/1000).toLocaleString('es')} mil años`;if(y<1e9)return`${(y/1e6).toFixed(1).replace('.',',')} millones de años`;return`${(y/1e9).toFixed(1).replace('.',',')} mil millones de años`};
 const VES=['A pie','En bicicleta','En coche por autopista','En avión','En el cohete Apolo 11 a máxima velocidad','En la Sonda Solar Parker, la nave más rápida','A la velocidad de la luz'];
 const DES={moon:'la Luna',sun:'el Sol',mercury:'Mercurio',venus:'Venus',mars:'Marte',jupiter:'Júpiter',saturn:'Saturno',uranus:'Urano',neptune:'Neptuno',pluto:'Plutón',proxima:'Próxima Centauri, la estrella más cercana'};
 const _tg=$('tripgo').onclick;$('tripgo').onclick=()=>{_tg();if(window.LANG!=='es')return;const id=$('tripto').value,vi=+$('tripby').value,v=VEHICLES[vi][1],km=distNowKm(id),dn=DES[id];
  setTimeout(()=>{$('tripout').innerHTML=`${dn[0].toUpperCase()+dn.slice(1)} está a <b>${Math.round(km).toLocaleString('es')} km</b> ahora mismo. ${VES[vi]} (${v.toLocaleString('es')} km/h), el viaje duraría <b>${humanES(km/v)}</b>.`+(id==='moon'&&v===39000?' Los astronautas del Apolo 11 tardaron unos 3 días, porque la gravedad de la Tierra los frenó tras el gran empujón del cohete.':'')},REDUCED?10:4050)}}
// switch language
function applyLang(){const es=window.LANG==='es';document.documentElement.lang=es?'es':'en';$('langb').textContent=es?'English':'Español';$('langb').lang=es?'en':'es';
 trBusy=true;try{trTree(document.body)}finally{trBusy=false}
 if(typeof ctlApply==='function')ctlApply();
 if(focus&&$('info').classList.contains('open'))showInfo(focus);if(!$('tour').hidden)showTourStep();if(typeof story!=='undefined'&&story)showStep();if(!$('fun').hidden){const t=document.querySelector('[data-tab].on');if(t)openFun(t.dataset.tab)}}
$('langb').onclick=()=>{window.LANG=window.LANG==='es'?'en':'es';try{localStorage.setItem('galaxy.lang',window.LANG)}catch(e){}applyLang()};
applyLang();
// keep the info card, pin bar and weather key below the header, however tall it gets
function hdrH(){const h=document.querySelector('header').getBoundingClientRect().height;document.documentElement.style.setProperty('--hdr',Math.round(h)+'px')}
hdrH();addEventListener('resize',hdrH);new ResizeObserver(hdrH).observe(document.querySelector('header'));
