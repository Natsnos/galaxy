// 3D scene: renderer, camera, Sun, planets, belt, stars, Milky Way, Andromeda
// Part of Interactive Galaxy. Files load in number order and share one global scope.

/* ---------- scene ---------- */
const canvas=$('c');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,logarithmicDepthBuffer:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(50,1,.05,2e6);
camera.position.set(0,90,210);
const controls=new THREE.OrbitControls(camera,canvas);
controls.enableDamping=true;controls.dampingFactor=.08;controls.minDistance=1;controls.maxDistance=6e5;
scene.add(new THREE.AmbientLight(0x334055,.32));
const sunLight=new THREE.PointLight(0xfff2dd,1.55,0,0);scene.add(sunLight);

const objects=[];// {id,name,obj(Object3D),data,type,mesh,viewDist}
const reg=(data,obj,type,viewDist,mesh)=>{const o={...data,data,obj,type,viewDist,mesh};objects.push(o);return o};

// Sun
const sunMat=new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(makeTex('sun').cv)});
const sunMesh=new THREE.Mesh(new THREE.SphereGeometry(10,64,32),sunMat);scene.add(sunMesh);
const sunGlow=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex('#ffa640',.2),blending:THREE.AdditiveBlending,depthWrite:false,transparent:true}));
sunGlow.scale.set(70,70,1);sunMesh.add(sunGlow);
reg(BODIES[0],sunMesh,'body',45,sunMesh);

// Planets
const orbitLines=[],planetState=[];
for(const b of BODIES.slice(1)){
 const tex=new THREE.CanvasTexture(makeTex(b.tex).cv);if(b.id==='earth')b._tex=tex;
 const mesh=new THREE.Mesh(new THREE.SphereGeometry(b.r,48,24),new THREE.MeshStandardMaterial({map:tex,roughness:1,metalness:0}));
 const pivot=mesh;
 const holder=new THREE.Object3D();holder.add(mesh);
 const parent=b.parent?objects.find(o=>o.id===b.parent).obj:scene;parent.add(holder);
 if(b.clouds){const cl=new THREE.Mesh(new THREE.SphereGeometry(b.r*1.02,48,24),new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(makeTex('clouds').cv),transparent:true,depthWrite:false}));mesh.add(cl);b._cl=cl;
  const atm=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex('#5aa8ff',.45),blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:.5}));atm.scale.set(b.r*2.9,b.r*2.9,1);holder.add(atm);b._atm=atm}
 if(b.ring){const g=new THREE.RingGeometry(b.r*1.25,b.r*2.3,128,1);const p=g.attributes.position,uv=g.attributes.uv;
  for(let i=0;i<p.count;i++){const rr=Math.hypot(p.getX(i),p.getY(i));uv.setXY(i,(rr-b.r*1.25)/(b.r*1.05),.5)}
  const rc=document.createElement('canvas');rc.width=512;rc.height=4;const rg=rc.getContext('2d');
  for(let i=0;i<512;i++){const t=i/512;let a=.25+.6*fbm(t*40,1,1,3,30);if(t>.58&&t<.63)a*=.08;if(t<.05)a*=.3;const v=200+fbm(t*20,2,2,2,31)*50;rg.fillStyle=`rgba(${v},${v*.88|0},${v*.7|0},${a})`;rg.fillRect(i,0,1,4)}
  const ring=new THREE.Mesh(g,new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(rc),side:THREE.DoubleSide,transparent:true,depthWrite:false,roughness:1}));b._ring=ring;
  ring.rotation.x=-Math.PI/2;pivot.add(ring)}
 const line=new THREE.Line(new THREE.BufferGeometry(),new THREE.LineBasicMaterial({color:b.parent?0x5a6680:0x3b4a6b,transparent:true,opacity:b.parent?.35:.45}));
 line.frustumCulled=false;parent.add(line);orbitLines.push(line);
 const st={b,holder,mesh,line};planetState.push(st);
 reg(b,holder,'body',Math.max(b.r*6,4),mesh);
}

// Asteroid belt
{const n=4000,pos=new Float32Array(n*3);for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,r=60+Math.random()*12+Math.random()*Math.random()*5;pos.set([Math.cos(a)*r,(Math.random()-.5)*2.2,Math.sin(a)*r],i*3)}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));
 const belt=new THREE.Points(g,new THREE.PointsMaterial({color:0xb7a88f,size:.3,sizeAttenuation:true,map:glowTex('#ffffff',.35),transparent:true,depthWrite:false,opacity:.55}));scene.add(belt);
 const anchor=new THREE.Object3D();anchor.position.set(66,0,0);belt.add(anchor);
 const o=reg(GALAXY[3],anchor,'region',40);o.spin=belt}

// Nearby stars (distance compressed: log scale)
const starGroup=new THREE.Object3D();scene.add(starGroup);
for(const s of STARS){const d=radec(...RADEC[s.id]).multiplyScalar(900+Math.log10(s.ly)*900);
 const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex(s.col,.1),blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));
 sp.position.copy(d);sp.scale.set(s.sz,s.sz,1);starGroup.add(sp);reg(s,sp,'star',s.sz*3)}

// Background stars
{const n=9000,pos=new Float32Array(n*3),col=new Float32Array(n*3);const pal=[[1,.85,.7],[.8,.88,1],[1,1,1],[1,.95,.85],[1,.7,.55]];
 for(let i=0;i<n;i++){const u=Math.random()*2-1,t=Math.random()*Math.PI*2,r=12000+Math.random()*4000,s=Math.sqrt(1-u*u);
  pos.set([s*Math.cos(t)*r,u*r,s*Math.sin(t)*r],i*3);const c=pal[i%5],k=.5+Math.random()*.5;col.set([c[0]*k,c[1]*k,c[2]*k],i*3)}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('color',new THREE.BufferAttribute(col,3));
 window.__bgStars=new THREE.Points(g,new THREE.PointsMaterial({size:1.6,sizeAttenuation:false,vertexColors:true,transparent:true,opacity:.75}));scene.add(window.__bgStars)}

// Milky Way (sun sits in an arm; disc tilted relative to ecliptic)
const GAL_R=50000,SUN_R=26000;
const galaxy=new THREE.Object3D();scene.add(galaxy);
{// real orientation: local -X points to Sgr A*, local Y to the north galactic pole
 const X=radec(266.417,-29.008).negate(),Y=radec(192.859,27.128);Y.sub(X.clone().multiplyScalar(Y.dot(X))).normalize();
 galaxy.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(X,Y,X.clone().cross(Y)))}
const galCore=new THREE.Object3D();galaxy.add(galCore);galCore.position.set(-SUN_R,0,0);
{const n=70000,pos=[],col=[];const arms=4;
 for(let i=0;i<n;i++){const core=i<n*.18;let r,a;
  if(core){r=Math.pow(Math.random(),1.6)*9000;a=Math.random()*Math.PI*2}
  else{r=3000+Math.pow(Math.random(),.8)*GAL_R;const arm=i%arms;a=arm/arms*Math.PI*2+Math.log(r/3000)*2.3+(Math.random()-.5)*(.5+4000/r)}
  const x=Math.cos(a)*r-SUN_R,z=Math.sin(a)*r,y=(Math.random()-.5)*(core?2600*(1-r/10000):700);
  if(Math.hypot(x,y,z)<5000)continue;pos.push(x,y,z);
  const t=Math.min(1,r/GAL_R);const c=core?[1,.85,.62]:Math.random()<.25?[.95,.7,.9]:[.65+.3*(1-t),.75+.15*(1-t),1];const k=core?1:.8;col.push(c[0]*k,c[1]*k,c[2]*k)}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));
 galaxy.add(new THREE.Points(g,new THREE.PointsMaterial({size:260,map:glowTex('#ffffff',.3),vertexColors:true,transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false})));
 const bulge=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex('#ffd9a0',.15),blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:.9}));
 bulge.scale.set(26000,26000,1);galCore.add(bulge);
 const bh=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex('#ffcf8a',.05),blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));bh.scale.set(1500,1500,1);galCore.add(bh);
}
reg(GALAXY[0],galCore,'gal',9000);
const milkyAnchor=new THREE.Object3D();galCore.add(milkyAnchor);reg(GALAXY[1],milkyAnchor,'gal',140000);

// Andromeda
const andro=new THREE.Object3D();andro.position.copy(radec(10.685,41.269).multiplyScalar(420000));scene.add(andro);
{const cv=document.createElement('canvas');cv.width=cv.height=256;const g=cv.getContext('2d');g.translate(128,128);
 for(let i=0;i<5000;i++){const r=Math.pow(Math.random(),1.5)*120,a=Math.random()*Math.PI*2+r*.04;g.fillStyle=`rgba(${220+Math.random()*35|0},${200+Math.random()*40|0},255,${.25*(1-r/125)})`;g.fillRect(Math.cos(a)*r,Math.sin(a)*r*.32,1.6,1.6)}
 const gr=g.createRadialGradient(0,0,0,0,0,40);gr.addColorStop(0,'#fff6e0');gr.addColorStop(1,'#fff6e000');g.fillStyle=gr;g.scale(1,.4);g.beginPath();g.arc(0,0,40,0,7);g.fill();
 const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(cv),blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,rotation:.6}));
 sp.scale.set(110000,110000,1);andro.add(sp)}
reg(GALAXY[2],andro,'gal',260000);
