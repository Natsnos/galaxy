// Photo-real maps, Earth shader, atmosphere, eclipses, Saturn shadows, satellite imagery patches
// Part of Interactive Galaxy. Files load in number order and share one global scope.

/* ---------- #1 photo-real surfaces ---------- */
const TEXDIR='assets/textures/';let texLoaded=0,texTotal=0;
function loadingProgress(){const b=$('lbar');if(b)b.style.width=Math.max(4,texTotal?texLoaded/texTotal*100:4)+'%';if(texTotal&&texLoaded>=texTotal)hideLoader()}
function loadImg(file){texTotal++;if(location.protocol==='file:'){texLoaded++;setTimeout(loadingProgress,0);return Promise.resolve(null)}return new Promise(res=>{const img=new Image();img.onload=()=>{texLoaded++;loadingProgress();res(img)};img.onerror=()=>{texLoaded++;loadingProgress();res(null)};img.src=TEXDIR+file})}
const maxAniso=renderer.capabilities&&renderer.capabilities.getMaxAnisotropy?renderer.capabilities.getMaxAnisotropy():1;
function toTex(img){const t=new THREE.Texture(img);t.anisotropy=Math.min(8,maxAniso);t.needsUpdate=true;return t}
function cachePixels(key,img){try{const W=1024,H=512,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');g.drawImage(img,0,0,W,H);texCache[key]={cv:c,data:g.getImageData(0,0,W,H).data,W,H}}catch(e){}}
const REALMAP={mercury:'2k_mercury.jpg',mars:'2k_mars.jpg',jupiter:'2k_jupiter.jpg',saturn:'2k_saturn.jpg',uranus:'2k_uranus.jpg',neptune:'2k_neptune.jpg',moon:'moon_1024.jpg'};
for(const st of planetState){const f=REALMAP[st.b.id];if(!f)continue;loadImg(f).then(img=>{if(!img)return;st.mesh.material.map=toTex(img);if(st.b.id==='uranus')st.mesh.material.color=new THREE.Color(.78,.82,.84);st.mesh.material.needsUpdate=true;cachePixels(st.b.tex,img)})}
loadImg('2k_sun.jpg').then(img=>{if(!img)return;sunMat.map=toTex(img);sunMat.needsUpdate=true;cachePixels('sun',img)});
{const sat=BODIES.find(b=>b.id==='saturn');loadImg('2k_saturn_ring_alpha.png').then(img=>{if(!img||!sat._ring)return;sat._ring.material.map=toTex(img);sat._ring.material.needsUpdate=true})}
// a softer, larger corona around the Sun
{const c2=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex('#ff8a2a',.08),blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity:.45}));c2.scale.set(150,150,1);sunMesh.add(c2)}
// Earth: day map, terrain normals, shiny oceans, night-side city lights, real cloud map
const earthSunU={value:new THREE.Vector3(1,0,0)};
const LOGV='#include <common>\n#include <logdepthbuf_pars_vertex>\n',LOGF='#include <common>\n#include <logdepthbuf_pars_fragment>\n';
function atmoMat(back){return new THREE.ShaderMaterial({uniforms:{sunDirV:earthSunU},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:back?THREE.BackSide:THREE.FrontSide,
 vertexShader:LOGV+'varying vec3 vN;varying vec3 vP;void main(){vN=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(position,1.0);vP=mv.xyz;gl_Position=projectionMatrix*mv;\n#include <logdepthbuf_vertex>\n}',
 fragmentShader:LOGF+'uniform vec3 sunDirV;varying vec3 vN;varying vec3 vP;void main(){\n#include <logdepthbuf_fragment>\nvec3 V=normalize(-vP);float d=dot(vN,V);'+
 (back?'float a=pow(clamp(1.0+d*1.35,0.0,1.0),3.0)*0.9;':'float a=pow(1.0-max(d,0.0),3.2)*0.85;')+
 'float lit=smoothstep(-0.45,0.35,dot(vN,sunDirV));gl_FragColor=vec4(vec3(0.32,0.6,1.0)*a*(0.12+0.95*lit),1.0);}'})}
{const eb=BODIES.find(b=>b.id==='earth'),haze=new THREE.Mesh(new THREE.SphereGeometry(ER*1.015,64,32),atmoMat(false)),halo=new THREE.Mesh(new THREE.SphereGeometry(ER*1.09,64,32),atmoMat(true));
 earthMesh.add(haze);earthMesh.add(halo);halo.renderOrder=-1;
 const BIG=innerWidth>900&&!matchMedia('(pointer:coarse)').matches;
 Promise.all([BIG?'earth_atmos_4096.jpg':'earth_atmos_2048.jpg','earth_normal_2048.jpg','earth_specular_2048.jpg','earth_lights_2048.png',BIG?'earth_clouds_2048_alpha.jpg':'earth_clouds_1024.png'].map(loadImg)).then(([day,nrm,spec,lights,clouds])=>{
  if(eb._atm)eb._atm.visible=false;
  if(!day){loadVectorMap();return}
  window.__earthReal=true;const m=new THREE.MeshPhongMaterial({map:toTex(day),specular:new THREE.Color(0x2a323a),shininess:30});
  if(nrm){m.normalMap=toTex(nrm);m.normalScale=new THREE.Vector2(.85,.85)}if(spec)m.specularMap=toTex(spec);
  if(lights){m.emissiveMap=toTex(lights);m.emissive=new THREE.Color(0xffd08a);m.emissiveIntensity=showLights?1.7:0;cityLights.visible=false}
  m.onBeforeCompile=sh=>{Object.assign(sh.uniforms,{sunDirV:earthSunU,eclDirV:ECL.dir,eclR:ECL.r,eclK:ECL.k});sh.fragmentShader='uniform vec3 sunDirV;uniform vec3 eclDirV;uniform float eclR;uniform float eclK;\n'+sh.fragmentShader.replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\n totalEmissiveRadiance*=smoothstep(0.1,-0.22,dot(normalize(vNormal),sunDirV));')
   .replace('#include <dithering_fragment>','{float ang=acos(clamp(dot(normalize(vNormal),eclDirV),-1.0,1.0));float q=1.0-smoothstep(0.0,eclR,ang);gl_FragColor.rgb*=1.0-eclK*(0.82*pow(q,0.55)+0.15*(1.0-smoothstep(0.0,0.06,ang)));}\n#include <dithering_fragment>')};
  earthMesh.material=m;mapTex=m.map;cachePixels('earth',day);
  if(clouds){cachePixels('clouds',clouds);if(BIG&&texCache.clouds){const d=texCache.clouds.data;for(let k=0;k<d.length;k+=4){d[k+3]=d[k];d[k]=d[k+1]=d[k+2]=255}}}
  if(eb._cl)eb._cl.material.onBeforeCompile=sh=>{Object.assign(sh.uniforms,{eclDirV:ECL.dir,eclR:ECL.r,eclK:ECL.k});sh.fragmentShader='uniform vec3 eclDirV;uniform float eclR;uniform float eclK;\n'+sh.fragmentShader.replace('#include <dithering_fragment>','{float ang=acos(clamp(dot(normalize(vNormal),eclDirV),-1.0,1.0));float q=1.0-smoothstep(0.0,eclR,ang);gl_FragColor.rgb*=1.0-eclK*(0.82*pow(q,0.55)+0.15*(1.0-smoothstep(0.0,0.06,ang)));}\n#include <dithering_fragment>')};
  if(clouds&&!wxGrid&&eb._cl){const cm=eb._cl.material;if(BIG){cm.map=null;cm.alphaMap=toTex(clouds);cm.color=new THREE.Color(1,1,1)}else cm.map=toTex(clouds);cm.opacity=.92;cm.needsUpdate=true}
  if(focus&&(focus.id==='earth'||focus.type==='loc'))portrait(focus)})}
const ECL={dir:{value:new THREE.Vector3(1,0,0)},r:{value:.5},k:{value:0}},ECLW=new THREE.Vector3();let eclInfo=null,lunInfo=null;
function updateEclipses(){if(!HP.earth||!moonNow)return;const AUkm=149597870.7,Re=6371,Rm=1737.4,Rs=696000,E=HP.earth;
 const S=[-E[0]*AUkm,-E[1]*AUkm,-E[2]*AUkm],M=moonNow.v.map(x=>x*moonNow.km),DM=[M[0]-S[0],M[1]-S[1],M[2]-S[2]],dSM=Math.hypot(...DM),D=DM.map(x=>x/dSM);
 const b=M[0]*D[0]+M[1]*D[1]+M[2]*D[2],c=M[0]*M[0]+M[1]*M[1]+M[2]*M[2]-Re*Re,h=b*b-c;let t=h>=0?-b-Math.sqrt(h):-b;const P=[M[0]+D[0]*t,M[1]+D[1]*t,M[2]+D[2]*t],pl=Math.hypot(...P);
 const rp=Rm+t*(Rs+Rm)/dSM,ru=Rm-t*(Rs-Rm)/dSM;let k=0;if(t>0)k=h>=0?1:Math.max(0,1-(pl-Re)/rp);
 ECL.k.value=k;ECL.r.value=Math.min(1.4,rp/Re);ECLW.copy(eclToThree(P[0]/pl,P[1]/pl,P[2]/pl));
 eclInfo=k>0?{total:h>=0&&ru>0,annular:h>=0&&ru<=0,on:h>=0,dirW:ECLW.clone(),k}:null;
 const dES=Math.hypot(...E)*AUkm,anti=E.map(x=>x/Math.hypot(...E)),cs=moonNow.v[0]*anti[0]+moonNow.v[1]*anti[1]+moonNow.v[2]*anti[2],sep=moonNow.km*Math.sqrt(Math.max(0,1-cs*cs));
 const uR=Re-moonNow.km*(Rs-Re)/dES,pR=Re+moonNow.km*(Rs+Re)/dES,fu=cs>0?Math.max(0,Math.min(1,(uR+Rm-sep)/(2*Rm))):0,fp=cs>0?Math.max(0,Math.min(1,(pR+Rm-sep)/(2*Rm))):0;
 lunInfo=fp>0?{fu,fp}:null;const mm=moonState&&moonState.mesh.material;if(mm&&mm.color){mm.color.setRGB(1-.42*fu,1-.78*fu,1-.88*fu);mm.color.multiplyScalar(1-.35*fp*(1-fu))}}
const moonState=planetState.find(s=>s.b.id==='moon');
window.__galaxyDebug={eclipse:()=>eclInfo&&{ll:localLL(eclInfo.dirW),k:eclInfo.k,total:eclInfo.total,annular:eclInfo.annular,on:eclInfo.on},lunar:()=>lunInfo,
 camD:id=>{const o=objects.find(x=>x.id===id);return camera.position.distanceTo(worldPos(o))},scr:id=>{const o=objects.find(x=>x.id===id);return o&&o._s},sunSide:()=>{const e=worldPos(earthO),d=ECLW.clone();focus=null;fly=null;controls.target.copy(e);camera.position.copy(e.clone().add(d.multiplyScalar(7)))}};
// Saturn: ring shadow on the planet, planet shadow on the rings
const SATU={sunPos:{value:new THREE.Vector3()},satC:{value:new THREE.Vector3()},satR:{value:4.6},ringN:{value:new THREE.Vector3(0,1,0)},rIn:{value:4.6*1.25},rOut:{value:4.6*2.3},ringMap:{value:null}};
{const sb=BODIES.find(b=>b.id==='saturn'),ss=planetState.find(s=>s.b.id==='saturn');SATU.satR.value=sb.r;SATU.rIn.value=sb.r*1.25;SATU.rOut.value=sb.r*2.3;
 const vtx=sh=>{sh.vertexShader='varying vec3 vWPosX;\n'+sh.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\nvWPosX=(modelMatrix*vec4(transformed,1.0)).xyz;')};
 const pre='uniform vec3 sunPos;uniform vec3 satC;uniform float satR;uniform vec3 ringN;uniform float rIn;uniform float rOut;uniform sampler2D ringMap;varying vec3 vWPosX;\n';
 ss.mesh.material.onBeforeCompile=sh=>{Object.assign(sh.uniforms,SATU);vtx(sh);sh.fragmentShader=pre+sh.fragmentShader.replace('#include <dithering_fragment>','{vec3 L=normalize(sunPos-vWPosX);float dn=dot(L,ringN);if(abs(dn)>1e-4){float t=dot(satC-vWPosX,ringN)/dn;if(t>0.0){vec3 P=vWPosX+L*t;float r=length(P-satC);if(r>rIn&&r<rOut){float a=texture2D(ringMap,vec2((r-rIn)/(rOut-rIn),0.5)).a;gl_FragColor.rgb*=1.0-0.82*a;}}}}\n#include <dithering_fragment>')};
 if(sb._ring){SATU.ringMap.value=sb._ring.material.map;sb._ring.material.onBeforeCompile=sh=>{Object.assign(sh.uniforms,SATU);vtx(sh);sh.fragmentShader=pre+sh.fragmentShader.replace('#include <dithering_fragment>','{vec3 L=normalize(sunPos-vWPosX);vec3 oc=vWPosX-satC;float b=dot(oc,L);float c=dot(oc,oc)-satR*satR;float h=b*b-c;if(h>0.0&&-b-sqrt(h)>0.0)gl_FragColor.rgb*=0.1;}\n#include <dithering_fragment>')}}
 window.__satShadow=()=>{ss.holder.getWorldPosition(SATU.satC.value);SATU.ringN.value.set(0,1,0).applyQuaternion(ss.mesh.getWorldQuaternion(new THREE.Quaternion()));if(sb._ring&&sb._ring.material.map)SATU.ringMap.value=sb._ring.material.map}}
function updateEarthSun(){updateEclipses();if(window.__satShadow)window.__satShadow();const e=worldPos(earthO),sdir=e.clone().negate().normalize();camera.updateMatrixWorld();earthSunU.value.copy(sdir).transformDirection(camera.matrixWorldInverse);ECL.dir.value.copy(ECLW).transformDirection(camera.matrixWorldInverse)}

// real all-sky Milky Way photo (galactic coordinates), wrapped on a sky sphere aligned with the galaxy
let skyBox=null,galPts=null;galaxy.children.forEach(c=>{if(c.isPoints)galPts=c});
loadImg('2k_stars_milky_way.jpg').then(img=>{if(!img)return;const t=toTex(img);t.wrapS=THREE.RepeatWrapping;t.repeat.set(-1,-1);t.offset.set(.5,1);
 skyBox=new THREE.Mesh(new THREE.SphereGeometry(1e5,64,32),new THREE.MeshBasicMaterial({map:t,side:THREE.BackSide,depthWrite:false,transparent:true,color:new THREE.Color(1.7,1.7,1.7)}));
 skyBox.quaternion.copy(galaxy.quaternion);skyBox.renderOrder=-10;skyBox.frustumCulled=false;scene.add(skyBox)});
function updateSkyFade(){const d=camera.position.length(),f=Math.max(0,Math.min(1,(d-9000)/14000));if(skyBox){skyBox.position.copy(camera.position);skyBox.material.opacity=1-f;skyBox.visible=f<1}
 if(galPts){galPts.material.opacity=.55*(skyBox?f:1);galPts.visible=!skyBox||f>0}if(window.__bgStars)window.__bgStars.visible=d<18000}
