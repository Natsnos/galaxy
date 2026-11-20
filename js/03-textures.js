// Procedural (drawn) surface textures used before real maps load or offline
// Part of Interactive Galaxy. Files load in number order and share one global scope.

/* ---------- procedural textures ---------- */
const h3=(x,y,z,s)=>{let h=Math.imul(x,374761393)^Math.imul(y,668265263)^Math.imul(z,1274126177)^Math.imul(s,2246822519);h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296};
const fade=t=>t*t*(3-2*t),lerp=(a,b,t)=>a+(b-a)*t;
function vnoise(x,y,z,s){const X=Math.floor(x),Y=Math.floor(y),Z=Math.floor(z),u=fade(x-X),v=fade(y-Y),w=fade(z-Z);
 const c=(i,j,k)=>h3(X+i,Y+j,Z+k,s);
 return lerp(lerp(lerp(c(0,0,0),c(1,0,0),u),lerp(c(0,1,0),c(1,1,0),u),v),lerp(lerp(c(0,0,1),c(1,0,1),u),lerp(c(0,1,1),c(1,1,1),u),v),w)}
function fbm(x,y,z,o,s){let a=.5,f=1,t=0,n=0;for(let i=0;i<o;i++){t+=a*vnoise(x*f,y*f,z*f,s+i);n+=a;a*=.5;f*=2}return t/n}
const mix=(c1,c2,t)=>[lerp(c1[0],c2[0],t),lerp(c1[1],c2[1],t),lerp(c1[2],c2[2],t)];
const hex=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const ramp=(stops,t)=>{t=Math.max(0,Math.min(.999,t));const n=stops.length-1,i=Math.floor(t*n);return mix(hex(stops[i]),hex(stops[i+1]),t*n-i)};
const sm=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)};

const SHADERS={
 sun:(x,y,z)=>{const n=fbm(x*6,y*6,z*6,5,1),g=fbm(x*30,y*30,z*30,2,2);return ramp(['#b33a00','#ff7a00','#ffb238','#fff1b0'],n*.75+g*.35)},
 mercury:(x,y,z)=>{const n=fbm(x*5,y*5,z*5,6,3);return ramp(['#4a4644','#7d7772','#a29b94','#c7c0b8'],n)},
 moon:(x,y,z)=>{const n=fbm(x*4,y*4,z*4,6,4),m=fbm(x*1.6,y*1.6,z*1.6,3,5);const c=ramp(['#5d5b58','#8f8c87','#b7b3ad','#d8d4ce'],n);return mix(c,[70,70,72],sm(.55,.66,m)*.65)},
 venus:(x,y,z)=>{const w=fbm(x*3,y*3,z*3,3,6);const n=fbm(x*2+w*2,y*9,z*2+w*2,5,7);return ramp(['#a8743a','#d9a95e','#ecd09a','#f7e6c4'],n)},
 earth:(x,y,z,lat)=>{const n=fbm(x*2.2,y*2.2,z*2.2,7,8);const d=fbm(x*7,y*7,z*7,3,9);const al=Math.abs(lat);
  if(al>1.25+(d-.5)*.25)return[236,242,248];
  if(n<.52){const t=n/.52;return mix([8,28,72],[30,90,150],Math.pow(t,3))}
  const dry=sm(.35,.85,1-Math.abs(al-.4)*2.2)*fbm(x*3,y*3,z*3,3,10);let c=mix([46,96,40],[178,150,96],sm(.35,.6,dry));
  c=mix(c,[110,100,90],sm(.62,.75,n));if(al>1.05)c=mix(c,[220,226,230],sm(1.05,1.2,al));return c},
 clouds:(x,y,z,lat)=>{const w=fbm(x*2,y*2,z*2,3,11);const n=fbm(x*4+w,y*6,z*4+w,6,12);const v=sm(.5,.72,n)*(1-sm(1.3,1.5,Math.abs(lat))*.3);return[255,255,255,v*235]},
 mars:(x,y,z,lat)=>{const n=fbm(x*3,y*3,z*3,7,13),m=fbm(x*1.5,y*1.5,z*1.5,4,14);let c=ramp(['#5a2a18','#8e4426','#c06a3c','#d99a6a'],n*.7+.3*(1-m));if(Math.abs(lat)>1.3+(n-.5)*.3)c=[240,236,230];return c},
 jupiter:(x,y,z,lat)=>{const w=fbm(x*4,y*4,z*4,4,15);const b=Math.sin(lat*14+w*2.2)*.5+.5;let c=ramp(['#8a5a3c','#c49a72','#e8d6bc','#f4ead8'],b*.8+fbm(x*12,y*30,z*12,3,16)*.25);
  const dx=Math.atan2(z,x)-1.0,dy=lat+.38;const e=(dx*dx)/.06+(dy*dy)/.012;if(e<1)c=mix(c,[178,74,46],(1-e)*.9);return c},
 saturn:(x,y,z,lat)=>{const w=fbm(x*3,y*3,z*3,3,17);const b=Math.sin(lat*18+w*1.2)*.5+.5;return ramp(['#b08d5c','#d6b984','#ead7aa','#f3e6c4'],b*.6+.35+fbm(x*10,y*40,z*10,2,18)*.1)},
 uranus:(x,y,z,lat)=>{const b=Math.sin(lat*10)*.04+fbm(x*3,y*8,z*3,3,19)*.08;return ramp(['#8fd3dc','#a9e3e8','#c7f0f2'],.4+b+lat*.08)},
 neptune:(x,y,z,lat)=>{const w=fbm(x*3,y*3,z*3,3,20);const b=Math.sin(lat*12+w*1.5)*.5+.5;let c=ramp(['#1f3fa8','#3a63d0','#5f8ae6'],b*.5+.3);const dx=Math.atan2(z,x)+2,dy=lat+.35;const e=dx*dx/.05+dy*dy/.01;if(e<1)c=mix(c,[20,30,90],(1-e)*.8);return c},
 pluto:(x,y,z)=>{const n=fbm(x*4,y*4,z*4,6,21),h=fbm(x*1.3,y*1.3,z*1.3,3,22);let c=ramp(['#5a3a28','#8f6646','#c9a27c','#e8d4bc'],n);if(h>.58)c=mix(c,[240,230,215],sm(.58,.64,h));return c},
};
Object.assign(SHADERS,{
 io:(x,y,z)=>{const n=fbm(x*5,y*5,z*5,5,50),q=fbm(x*12,y*12,z*12,3,51);let c=ramp(['#9c6b20','#d8b04a','#efe08c','#fff6c8'],n);if(q>.66)c=mix(c,[60,30,15],sm(.66,.72,q));return c},
 europa:(x,y,z)=>{const n=fbm(x*3,y*3,z*3,4,52),l=Math.abs(Math.sin(fbm(x*4,y*4,z*4,4,53)*40));return mix(ramp(['#c9b9a0','#e8dfcf','#f6f1e8'],n),[150,95,60],(1-sm(0,.12,l))*.7)},
 ganymede:(x,y,z)=>{const n=fbm(x*4,y*4,z*4,6,54),m=fbm(x*1.5,y*1.5,z*1.5,3,55);return mix(ramp(['#6e6258','#9a8f84','#c9c0b5'],n),[90,80,70],sm(.5,.6,m)*.6)},
 callisto:(x,y,z)=>{const n=fbm(x*6,y*6,z*6,5,56);let c=ramp(['#3a3530','#5c5248','#7d7266'],n);if(vnoise(x*60,y*60,z*60,57)>.9)c=[220,215,205];return c},
 titan:(x,y,z,lat)=>ramp(['#b8742e','#d89a48','#e8b866'],.5+fbm(x*2,y*6,z*2,3,58)*.3+lat*.1),
 ice:(x,y,z)=>{const n=fbm(x*5,y*5,z*5,5,61);return mix(ramp(['#cfd6dc','#e9eef2','#ffffff'],n),[150,175,200],(1-sm(0,.1,Math.abs(Math.sin(fbm(x*3,y*3,z*3,3,62)*30))))*.5)},
 rock:(x,y,z)=>ramp(['#3d3631','#5e544b','#7a6f64'],fbm(x*6,y*6,z*6,5,63)),
 triton:(x,y,z,lat)=>{const n=fbm(x*5,y*5,z*5,5,64);let c=ramp(['#9b8a86','#c9b6ae','#efe2da'],n);if(lat<-.2)c=mix(c,[240,220,215],.5);return c},
 grey:(x,y,z)=>ramp(['#55524f','#86817c','#b4aea7'],fbm(x*5,y*5,z*5,5,65))});
const texCache={};
function makeTex(name,W=512,H=256){
 if(texCache[name])return texCache[name];
 const cv=document.createElement('canvas');cv.width=W;cv.height=H;const g=cv.getContext('2d'),im=g.createImageData(W,H),d=im.data,f=SHADERS[name];
 for(let j=0;j<H;j++){const lat=(.5-j/H)*Math.PI,cl=Math.cos(lat),sy=Math.sin(lat);
  for(let i=0;i<W;i++){const lon=i/W*Math.PI*2,x=cl*Math.cos(lon),z=cl*Math.sin(lon);const c=f(x+2,sy+2,z+2,lat),k=(j*W+i)*4;
   d[k]=c[0];d[k+1]=c[1];d[k+2]=c[2];d[k+3]=c.length>3?c[3]:255}}
 if(name==='mercury'||name==='moon')craters(d,W,H,name==='moon'?140:220);
 g.putImageData(im,0,0);return texCache[name]={cv,data:d,W,H};
}
function craters(d,W,H,n){let s=7;const rnd=()=>(s=(s*16807)%2147483647)/2147483647;
 for(let c=0;c<n;c++){const cx=rnd()*W,cy=H*.12+rnd()*H*.76,r=1.5+Math.pow(rnd(),3)*16;
  for(let y=-r*1.3;y<r*1.3;y++)for(let x=-r*1.3;x<r*1.3;x++){const q=Math.hypot(x,y)/r;if(q>1.3)continue;
   const px=((Math.round(cx+x)%W)+W)%W,py=Math.round(cy+y);if(py<0||py>=H)continue;const k=(py*W+px)*4;
   const f=q<1?.78+.12*q:1.12-(q-1)*.4;for(let t=0;t<3;t++)d[k+t]=Math.min(255,d[k+t]*f)}}}

function glowTex(col,core=.12){const cv=document.createElement('canvas');cv.width=cv.height=128;const g=cv.getContext('2d');
 const gr=g.createRadialGradient(64,64,0,64,64,64);gr.addColorStop(0,'#ffffff');gr.addColorStop(core,col);gr.addColorStop(.35,col+'55');gr.addColorStop(1,col+'00');
 g.fillStyle=gr;g.fillRect(0,0,128,128);return new THREE.CanvasTexture(cv)}
