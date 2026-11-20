// Moons of every planet, comets, city lights
// Part of Interactive Galaxy. Files load in number order and share one global scope.

/* ---------- Jupiter's Galilean moons + Titan ---------- */
const MOONS=[
 {id:'io',host:'jupiter',name:'Io',r:.32,d:9.5,tex:'io',facts:[['Diameter','3,643 km'],['Orbit','1.77 days'],['Distance from Jupiter','421,700 km'],['Notable','400+ active volcanoes']],desc:'The most volcanically active world known. Jupiter’s tides constantly squeeze and heat its interior.',wiki:'Io_(moon)',q:'io jupiter moon'},
 {id:'europa',host:'jupiter',name:'Europa',r:.28,d:11.5,tex:'europa',facts:[['Diameter','3,122 km'],['Orbit','3.55 days'],['Distance from Jupiter','671,000 km'],['Notable','Global salty ocean under the ice']],desc:'Beneath its cracked ice shell lies an ocean holding about twice the water of Earth’s oceans. NASA’s Europa Clipper is on its way there.',wiki:'Europa_(moon)',q:'europa moon'},
 {id:'ganymede',host:'jupiter',name:'Ganymede',r:.45,d:14,tex:'ganymede',facts:[['Diameter','5,268 km'],['Orbit','7.15 days'],['Distance from Jupiter','1,070,400 km'],['Notable','Largest moon in the Solar System']],desc:'Bigger than Mercury and the only moon with its own magnetic field. ESA’s JUICE spacecraft will orbit it in the 2030s.',wiki:'Ganymede_(moon)',q:'ganymede'},
 {id:'callisto',host:'jupiter',name:'Callisto',r:.42,d:18,tex:'callisto',facts:[['Diameter','4,821 km'],['Orbit','16.7 days'],['Distance from Jupiter','1,882,700 km'],['Notable','One of the most cratered surfaces known']],desc:'An ancient, battered surface that has barely changed in four billion years.',wiki:'Callisto_(moon)',q:'callisto'},
 {id:'titan',host:'saturn',name:'Titan',r:.42,d:17.6,tex:'titan',approx:true,facts:[['Diameter','5,150 km'],['Orbit','15.9 days'],['Distance from Saturn','1,221,870 km'],['Notable','Thick atmosphere and methane lakes']],desc:'The only moon with a thick atmosphere, and the only other world known to have liquid lakes on its surface, filled with methane and ethane. NASA’s Dragonfly rotorcraft is headed there. Its position along the orbit here is approximate.',wiki:'Titan_(moon)',q:'titan cassini'}];
// more moons: [id,name,host,semi-major axis km,period days,diameter km,texture,retrograde,blurb,wiki]
const HOSTR={mars:3390,saturn:58232,uranus:25362,neptune:24622,pluto:1188};
[['phobos','Phobos','mars',9376,.3189,22.5,'rock',0,'A lumpy little moon spiralling slowly inward. In about 50 million years it will crash into Mars or break into a ring.','Phobos_(moon)'],
 ['deimos','Deimos','mars',23463,1.263,12.4,'rock',0,'Mars’s smaller, outer moon. From Mars it looks like a bright star.','Deimos_(moon)'],
 ['mimas','Mimas','saturn',185539,.942,396,'grey',0,'Its giant Herschel crater makes it look like the Death Star.','Mimas_(moon)'],
 ['enceladus','Enceladus','saturn',237948,1.370,504,'ice',0,'Shoots geysers of water from an ocean under its ice. It’s the shiniest object in the Solar System.','Enceladus'],
 ['tethys','Tethys','saturn',294619,1.888,1062,'ice',0,'Made almost entirely of water ice, with a canyon 2,000 km long.','Tethys_(moon)'],
 ['dione','Dione','saturn',377396,2.737,1123,'grey',0,'An icy world streaked with bright ice cliffs.','Dione_(moon)'],
 ['rhea','Rhea','saturn',527108,4.518,1527,'grey',0,'Saturn’s second-largest moon, a cold, cratered ball of ice and rock.','Rhea_(moon)'],
 ['iapetus','Iapetus','saturn',3560820,79.32,1469,'grey',0,'Two-toned: one side is as dark as coal and the other as bright as snow. A ridge runs around its middle like a walnut seam.','Iapetus_(moon)'],
 ['miranda','Miranda','uranus',129390,1.413,471,'grey',0,'Has the tallest cliff known, Verona Rupes, about 20 km high.','Miranda_(moon)'],
 ['ariel','Ariel','uranus',191020,2.520,1158,'ice',0,'The brightest of Uranus’s big moons, crossed by deep valleys.','Ariel_(moon)'],
 ['umbriel','Umbriel','uranus',266000,4.144,1169,'rock',0,'The darkest of Uranus’s large moons.','Umbriel_(moon)'],
 ['titania','Titania','uranus',435910,8.706,1577,'grey',0,'Uranus’s largest moon, named after the fairy queen in Shakespeare’s A Midsummer Night’s Dream.','Titania_(moon)'],
 ['oberon','Oberon','uranus',583520,13.46,1523,'grey',0,'The outermost of Uranus’s big moons, heavily cratered.','Oberon_(moon)'],
 ['triton','Triton','neptune',354759,5.877,2707,'triton',1,'Orbits backwards, so it was probably a captured Kuiper Belt world. It has nitrogen geysers and is one of the coldest places known.','Triton_(moon)'],
 ['charon','Charon','pluto',19591,6.387,1212,'grey',0,'Half Pluto’s size. Pluto and Charon orbit a point between them, like a double planet.','Charon_(moon)']]
.forEach(([id,name,host,a,P,dia,tex,retro,blurb,wiki])=>{const hb=BODIES.find(b=>b.id===host),R=HOSTR[host];
 MOONS.push({id,host,name,P,retro,approx:true,tex,d:hb.r*(1.3+.55*Math.sqrt(a/R)),r:Math.max(.07,Math.min(.42,hb.r*dia/(2*R)*2.2)),
  facts:[['Diameter',dia.toLocaleString()+' km'],['Orbit',P<1?(P*24).toFixed(1)+' hours':P.toFixed(P<10?2:1)+' days'+(retro?' (backwards)':'')],[`Distance from ${host[0].toUpperCase()+host.slice(1)}`,a.toLocaleString()+' km']],
  desc:blurb+' Its position along its orbit here is approximate.',wiki,q:name+' moon'})});
for(const m of MOONS){const host=objects.find(o=>o.id===m.host);const mesh=new THREE.Mesh(new THREE.SphereGeometry(m.r,32,16),new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(makeTex(m.tex,256,128).cv),roughness:1}));
 host.obj.add(mesh);m.mesh=mesh;const N=radec(ROT[m.host][0],ROT[m.host][1]),e1=new THREE.Vector3(1,0,0).cross(N).normalize(),e2=N.clone().cross(e1);m.N=N;
 const pts=[];for(let i=0;i<=128;i++){const t=i/128*Math.PI*2;pts.push(e1.clone().multiplyScalar(Math.cos(t)*m.d).add(e2.clone().multiplyScalar(Math.sin(t)*m.d)))}
 const ln=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0x5a6680,transparent:true,opacity:.14}));host.obj.add(ln);orbitLines.push(ln);
 reg({...m,kind:`Moon of ${m.host[0].toUpperCase()+m.host.slice(1)}`},mesh,'body',2.4,mesh)}
const sD=x=>Math.sin(x*D2R),cD=x=>Math.cos(x*D2R);
function updateMoons(ms){const d=dJ(ms),V=172.74+0.00111588*d,M=357.529+0.9856003*d,N=20.020+0.0830853*d+0.329*sD(V),J=66.115+0.9025179*d-0.329*sD(V);
 const A=1.915*sD(M)+0.020*sD(2*M),B=5.555*sD(N)+0.168*sD(2*N),K=J+A-B,R=1.00014-0.01671*cD(M)-0.00014*cD(2*M),r=5.20872-0.25208*cD(N)-0.00611*cD(2*N);
 const De=Math.sqrt(r*r+R*R-2*r*R*cD(K)),psi=Math.asin(R/De*sD(K))/D2R,t=d-De/173;
 const U={io:163.8069+203.4058646*t,europa:358.4140+101.2916335*t,ganymede:5.7176+50.2345180*t,callisto:224.8092+21.4879800*t,titan:261.6+22.5769768*d};
 for(const m of MOONS)if(U[m.id]===undefined)U[m.id]=(h3(m.id.length*97,m.id.charCodeAt(0),m.id.charCodeAt(1),7)*360)+(m.retro?-1:1)*360/m.P*d;
 for(const m of MOONS){const H=HP[m.host],away=eclToThree(H[0]-HP.earth[0],H[1]-HP.earth[1],H[2]-HP.earth[2]).normalize();away.sub(m.N.clone().multiplyScalar(away.dot(m.N))).normalize();
  const u=(U[m.id]+(m.host==='jupiter'?psi-B:0))*D2R,perp=m.N.clone().cross(away);m.mesh.position.copy(away.multiplyScalar(Math.cos(u)*m.d).add(perp.multiplyScalar(Math.sin(u)*m.d)));m.mesh.rotation.y=-u}}

/* ---------- comets ---------- */
const COMETS=[
 {id:'halley',name:'Halley’s Comet',qd:.586,e:.967,i:162.26,O:58.42,w:111.33,T:Date.UTC(1986,1,9,11),facts:[['Period','~76 years'],['Last at perihelion','February 1986'],['Next return','July 2061'],['Nucleus','~15 × 8 km']],desc:'The most famous comet, recorded since at least 240 BC. It is now far out past Neptune’s orbit and on its way back. Its dust causes the Eta Aquariid and Orionid meteor showers.',wiki:'Halley%27s_Comet',q:'halley comet 1986'},
 {id:'encke',name:'Comet Encke',qd:.339,e:.847,i:11.35,O:334.2,w:187.3,T:Date.UTC(2023,9,22),approx:true,facts:[['Period','3.3 years — shortest of any major comet'],['Closest to Sun','0.34 AU'],['Meteor shower','Taurids']],desc:'Swings inside Mercury’s orbit every 3.3 years. Speed up time to watch its tail grow and fade as it passes the Sun. Its position is approximate.',wiki:'Comet_Encke',q:'comet encke'},
 {id:'halebopp',name:'Comet Hale–Bopp',qd:.914,e:.9951,i:89.43,O:282.47,w:130.59,T:Date.UTC(1997,3,1),facts:[['Brightest','Spring 1997'],['Visible to the naked eye','~18 months, a record'],['Period','~2,400 years'],['Nucleus','~60 km']],desc:'The great comet of 1997, seen by billions of people. It is now far beyond Neptune, heading outward.',wiki:'Comet_Hale%E2%80%93Bopp',q:'hale-bopp comet'}];
const CP={};
function cometHelio(c,ms,Mo){const a=c.qd/(1-c.e),n=0.9856076686/a**1.5;let M=Mo!==undefined?Mo:((n*(ms-c.T)/864e5)%360+540)%360-180;if(Mo===undefined)M*=D2R;
 let E=c.e>.8?Math.PI*Math.sign(M||1):M;for(let k=0;k<50;k++){const dE=(E-c.e*Math.sin(E)-M)/(1-c.e*Math.cos(E));E-=dE;if(Math.abs(dE)<1e-10)break}
 const xp=a*(Math.cos(E)-c.e),yp=a*Math.sqrt(1-c.e*c.e)*Math.sin(E),w=c.w*D2R,O=c.O*D2R,I=c.i*D2R,cw=Math.cos(w),sw=Math.sin(w),cO=Math.cos(O),sO=Math.sin(O),cI=Math.cos(I),sI=Math.sin(I);
 return[(cw*cO-sw*sO*cI)*xp+(-sw*cO-cw*sO*cI)*yp,(cw*sO+sw*cO*cI)*xp+(-sw*sO+cw*cO*cI)*yp,sw*sI*xp+cw*sI*yp]}
for(const c of COMETS){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex('#cfeaff',.25),blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));sp.scale.set(1.2,1.2,1);scene.add(sp);c.sp=sp;
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(400*3),3));c.tail=new THREE.Points(g,new THREE.PointsMaterial({color:0xa8d8ff,size:.2,map:dotTex,transparent:true,opacity:.22,blending:THREE.AdditiveBlending,depthWrite:false}));c.tail.frustumCulled=false;scene.add(c.tail);
 c.line=new THREE.Line(new THREE.BufferGeometry(),new THREE.LineBasicMaterial({color:0x6aa0c8,transparent:true,opacity:.25}));c.line.frustumCulled=false;scene.add(c.line);orbitLines.push(c.line);
 c.seed=[...Array(400)].map(()=>[Math.random(),Math.random()-.5,Math.random()-.5]);
 reg({...c,kind:'Comet'},sp,'body',8)}
function updateComets(ms){for(const c of COMETS){const h=cometHelio(c,ms);CP[c.id]=h;const p=disp(h);c.sp.position.copy(p);const r=Math.hypot(...h),L=Math.min(8,2.4/(r*r)),arr=c.tail.geometry.attributes.position.array,dir=p.clone().normalize();
  const side=new THREE.Vector3(0,1,0).cross(dir).normalize(),up=dir.clone().cross(side);
  c.seed.forEach(([f,a,b],i)=>{const q=f*f*L,sp=.2+q*.12;arr.set([p.x+dir.x*q+(side.x*a+up.x*b)*sp,p.y+dir.y*q+(side.y*a+up.y*b)*sp,p.z+dir.z*q+(side.z*a+up.z*b)*sp],i*3)});
  c.tail.visible=r<2.5;c.tail.geometry.attributes.position.needsUpdate=true}}
function cometOrbits(ms){for(const c of COMETS){const pts=[];for(let i=0;i<=400;i++){const E=(i/400*2-1)*Math.PI;pts.push(disp(cometHelio(c,ms,E-c.e*Math.sin(E))))}c.line.geometry.setFromPoints(pts)}}

/* ---------- city lights on Earth's night side ---------- */
const CITIES=[[40.71,-74.0],[34.05,-118.24],[41.88,-87.63],[29.76,-95.37],[33.75,-84.39],[25.76,-80.19],[47.61,-122.33],[37.77,-122.42],[39.74,-104.99],[32.78,-96.8],[42.36,-71.06],[38.9,-77.04],[43.65,-79.38],[45.5,-73.57],[49.28,-123.12],[19.43,-99.13],[20.66,-103.35],[25.69,-100.32],[4.71,-74.07],[-12.05,-77.04],[-33.45,-70.67],[-34.6,-58.38],[-23.55,-46.63],[-22.91,-43.17],[-15.79,-47.88],[10.48,-66.9],[51.51,-0.13],[48.86,2.35],[52.52,13.4],[40.42,-3.7],[41.9,12.5],[45.46,9.19],[52.37,4.9],[50.85,4.35],[48.21,16.37],[52.23,21.01],[55.76,37.62],[59.93,30.36],[50.45,30.52],[41.01,28.98],[38.0,23.73],[30.04,31.24],[6.52,3.38],[-1.29,36.82],[-26.2,28.05],[-33.92,18.42],[33.57,-7.59],[24.71,46.68],[25.2,55.27],[35.69,51.39],[24.86,67.0],[31.55,74.34],[28.61,77.21],[19.08,72.88],[12.97,77.59],[13.08,80.27],[22.57,88.36],[23.81,90.41],[13.76,100.5],[21.03,105.85],[10.82,106.63],[3.14,101.69],[1.35,103.82],[-6.21,106.85],[14.6,120.98],[22.32,114.17],[23.13,113.26],[31.23,121.47],[39.9,116.41],[30.57,104.07],[34.34,108.94],[37.57,126.98],[35.68,139.65],[34.69,135.5],[43.06,141.35],[-33.87,151.21],[-37.81,144.96],[-27.47,153.03],[-31.95,115.86],[-36.85,174.76],[21.31,-157.86],[61.22,-149.9],[64.15,-21.94],[60.17,24.94],[59.33,18.07],[53.48,-2.24],[53.35,-6.26],[38.72,-9.14]];
const lightGeo=new THREE.BufferGeometry(),lp=[],lc=new Float32Array(CITIES.length*3);for(const[a,b]of CITIES)lp.push(...llLocal(a,b,ER*1.003).toArray());
lightGeo.setAttribute('position',new THREE.Float32BufferAttribute(lp,3));lightGeo.setAttribute('color',new THREE.BufferAttribute(lc,3));
const cityLights=new THREE.Points(lightGeo,new THREE.PointsMaterial({size:.16,map:glowTex('#ffc870',.25),vertexColors:true,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));earthMesh.add(cityLights);
function updateLights(){CITIES.forEach(([a,b],i)=>{const e=sunElev(a,b),k=Math.max(0,Math.min(1,(-e-2)/6));lc[i*3]=k;lc[i*3+1]=k*.8;lc[i*3+2]=k*.5});lightGeo.attributes.color.needsUpdate=true}
