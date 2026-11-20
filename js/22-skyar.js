// Look around: point a phone or tablet at the sky (compass + tilt), or drag on a computer, to see what's in that direction
// Part of Interactive Galaxy. Files load in number order and share one global scope.

let arOn=false,arMode='drag',arAz=180,arAlt=30,arF=null,arU=null,arR=null,arLast=0,arRAF=0,arHit=[];
const vAzAlt=(az,alt)=>{az*=D2R;alt*=D2R;return[Math.cos(alt)*Math.sin(az),Math.cos(alt)*Math.cos(az),Math.sin(alt)]};// East, North, Up
const dot3=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],cross3=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],norm3=a=>{const l=Math.hypot(...a)||1;return a.map(x=>x/l)};
function basisFromAzAlt(){const f=vAzAlt(arAz,arAlt),r=norm3([Math.cos(arAz*D2R),-Math.sin(arAz*D2R),0]);return[f,cross3(r,f),r]}
// device orientation → where the back camera points (W3C Z-X'-Y'' angles)
function onOrient(e){let a=e.alpha,b=e.beta,g=e.gamma;if(a==null||b==null)return;if(typeof e.webkitCompassHeading==='number')a=360-e.webkitCompassHeading;else if(!e.absolute&&e.type!=='deviceorientationabsolute'&&arMode!=='rel'){arMode='rel'}
 a*=D2R;b*=D2R;g*=D2R;const cA=Math.cos(a),sA=Math.sin(a),cB=Math.cos(b),sB=Math.sin(b),cG=Math.cos(g),sG=Math.sin(g);
 let r=[cA*cG-sA*sB*sG,sA*cG+cA*sB*sG,-cB*sG],u=[-sA*cB,cA*cB,sB],f=[-(cA*sG+sA*sB*cG),-(sA*sG-cA*sB*cG),-cB*cG];
 const ang=((screen.orientation&&screen.orientation.angle)||window.orientation||0)*D2R;if(ang){const c=Math.cos(ang),s=Math.sin(ang),u2=u.map((x,i)=>x*c+r[i]*s),r2=r.map((x,i)=>x*c-u[i]*s);u=u2;r=r2}
 const k=arF?.3:1;arF=norm3(arF?arF.map((x,i)=>x+(f[i]-x)*k):f);arU=norm3(arU?arU.map((x,i)=>x+(u[i]-x)*k):u);arR=norm3(arR?arR.map((x,i)=>x+(r[i]-x)*k):r);if(arMode!=='rel')arMode='sensor';arLast=performance.now()}
async function startAR(){arOn=true;$('skyar').textContent='Back to chart';$('skyar').classList.add('on');arF=arU=arR=null;arMode='drag';
 try{if(typeof DeviceOrientationEvent!=='undefined'&&typeof DeviceOrientationEvent.requestPermission==='function'){const p=await DeviceOrientationEvent.requestPermission();if(p!=='granted')throw 0}
  addEventListener('deviceorientationabsolute',onOrient);addEventListener('deviceorientation',onOrient)}catch(e){}
 if(skyLoc.name==='New York'&&navigator.geolocation)geolocate(p=>{if(p){skyLoc={name:'your location',lat:p[0],lon:p[1],tz:myTZ}}});
 arStatus(matchMedia('(pointer:coarse)').matches?'Hold your phone up and point it at the sky.':'Drag to look around the sky. On a phone or tablet, just point it at the sky.');
 cancelAnimationFrame(arRAF);(function loop(){if(!arOn)return;drawSkyAR();arRAF=requestAnimationFrame(loop)})()}
function stopAR(){arOn=false;cancelAnimationFrame(arRAF);removeEventListener('deviceorientationabsolute',onOrient);removeEventListener('deviceorientation',onOrient);$('skyar').textContent='Look around';$('skyar').classList.remove('on');$('arstatus').hidden=true;drawSky()}
$('skyar').onclick=()=>arOn?stopAR():startAR();
{const _x=$('skyx').onclick;$('skyx').onclick=e=>{if(arOn)stopAR();_x(e)}}
{const _d=drawSky;drawSky=function(){if(arOn)return;_d()}}
function arStatus(html,btn){const el=$('arstatus');el.innerHTML=`<span>${html}</span>`+(btn?`<button id="arfly">${btn}</button>`:'');el.hidden=false}
// drag to look (computers, or when there's no compass)
{let d=null;const cv=$('skyc');cv.addEventListener('pointerdown',e=>{if(!arOn)return;d=[e.clientX,e.clientY,arAz,arAlt,e.clientX,e.clientY]});
 cv.addEventListener('pointermove',e=>{if(!d||arMode==='sensor')return;arAz=((d[2]-(e.clientX-d[0])*.15)%360+360)%360;arAlt=Math.max(-30,Math.min(90,d[3]+(e.clientY-d[1])*.15))});
 cv.addEventListener('pointerup',e=>{if(d&&Math.hypot(e.clientX-d[4],e.clientY-d[5])<6)arTap(e);d=null})}
function arTap(e){const r=$('skyc').getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;let best=null,bd=34;for(const h of arHit){const dd=Math.hypot(h.x-x,h.y-y);if(dd<bd){bd=dd;best=h}}
 if(!best){arStatus(arMode==='sensor'?'Point your phone at the sky.':'Drag to look around. Tap a planet or star to learn about it.');return}
 const o=best.id&&objects.find(z=>z.id===best.id);arStatus(`<b>${best.name}</b> · ${best.alt.toFixed(0)}° up, toward the ${compassName(best.az)}${best.note?' · '+best.note:''}`,o?'Learn about it':null);
 if(o)$('arfly').onclick=()=>{stopAR();$('sky').hidden=true;select(o)}}
const compassName=a=>['north','north-east','east','south-east','south','south-west','west','north-west'][Math.round(((a%360)+360)%360/45)%8];
function drawSkyAR(){const cv=$('skyc'),dpr=Math.min(devicePixelRatio,2),W=cv.clientWidth,H=cv.clientHeight;if(!W||!H)return;if(cv.width!==W*dpr||cv.height!==H*dpr){cv.width=W*dpr;cv.height=H*dpr}const g=cv.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);
 if(arMode!=='sensor'||!arF||performance.now()-arLast>3000){if(arMode==='sensor'&&performance.now()-arLast>3000)arMode='drag';[arF,arU,arR]=basisFromAzAlt()}else{arAz=(Math.atan2(arF[0],arF[1])/D2R+360)%360;arAlt=Math.asin(Math.max(-1,Math.min(1,arF[2])))/D2R}
 const{lat,lon}=skyLoc,ms=simMs,sa=sunAltAt(lat,lon,ms),F=Math.min(W,H)/(2*Math.tan(32*D2R)),cx=W/2,cy=H/2;
 const P=(az,alt)=>{const v=vAzAlt(az,alt),z=dot3(v,arF);if(z<.08)return null;return[cx+dot3(v,arR)/z*F,cy-dot3(v,arU)/z*F]};
 const t=Math.max(0,Math.min(1,(sa+12)/18));g.fillStyle=`rgb(${6+t*70|0},${10+t*120|0},${26+t*180|0})`;g.fillRect(0,0,W,H);
 // ground below the horizon
 const hz=[];for(let a=0;a<=360;a+=2){const p=P(a,0);if(p)hz.push(p)}
 if(hz.length>1){g.beginPath();g.moveTo(hz[0][0],hz[0][1]);hz.forEach(p=>g.lineTo(p[0],p[1]));const below=P(arAz,-60)||[cx,H*3];g.lineTo(hz[hz.length-1][0],H*3);g.lineTo(hz[0][0],H*3);g.closePath();
  g.fillStyle='rgba(28,32,24,.92)';g.fill();g.strokeStyle='rgba(180,200,160,.6)';g.lineWidth=1.5;g.beginPath();g.moveTo(hz[0][0],hz[0][1]);hz.forEach(p=>g.lineTo(p[0],p[1]));g.stroke()}
 g.font='700 15px "Space Grotesk",sans-serif';g.textAlign='center';g.textBaseline='middle';
 [['N',0],['NE',45],['E',90],['SE',135],['S',180],['SW',225],['W',270],['NW',315]].forEach(([l,a])=>{const p=P(a,0);if(p){g.fillStyle=l.length===1?'#ffb347':'#c9a26b';g.fillText(l,p[0],p[1]+16)}});
 g.setLineDash([4,6]);g.strokeStyle='rgba(255,255,255,.12)';for(const al of[30,60]){g.beginPath();let st=false;for(let a=0;a<=360;a+=3){const p=P(a,al);if(p){st?g.lineTo(...p):g.moveTo(...p);st=true}else st=false}g.stroke()}g.setLineDash([]);
 arHit=[];const starA=1-t*.85;
 for(const c of CONST){const pts=c.s.map(([ra,de])=>altaz(ra,de,lat,lon,ms));const sp=pts.map(([al,az])=>P(az,al));g.strokeStyle=`rgba(140,170,255,${(c.faint?.2:.45)*starA})`;g.lineWidth=1.3;
  for(const[a,b]of c.l){if(!sp[a]||!sp[b])continue;g.beginPath();g.moveTo(...sp[a]);g.lineTo(...sp[b]);g.stroke()}
  sp.forEach((p,i)=>{if(!p)return;const m=c.s[i][2];g.fillStyle=`rgba(255,255,255,${starA})`;g.beginPath();g.arc(p[0],p[1],Math.max(1.2,3.6-m*.9),0,7);g.fill()});
  if(!c.faint){const k=sp.findIndex(Boolean);if(k>=0){g.font='13px "Space Grotesk",sans-serif';g.fillStyle=`rgba(150,180,255,${.85*starA})`;g.fillText(c.n,sp[k][0],sp[k][1]+18);arHit.push({x:sp[k][0],y:sp[k][1],name:c.n,alt:pts[k][0],az:pts[k][1],note:'constellation'})}}}
 for(const[n,ra,de,m]of BRIGHT){const[al,az]=altaz(ra,de,lat,lon,ms),p=P(az,al);if(!p)continue;g.fillStyle=`rgba(255,250,235,${starA})`;g.beginPath();g.arc(p[0],p[1],Math.max(1.4,4-m*.9),0,7);g.fill();
  if(m<1.3){g.font='12px "Space Grotesk",sans-serif';g.fillStyle=`rgba(220,225,240,${.85*starA})`;g.fillText(n,p[0],p[1]-12)}const sid={Sirius:'sirius',Vega:'vega',Rigel:'rigel',Betelgeuse:'betelgeuse',Polaris:'polaris','α Centauri':'acen'}[n];arHit.push({x:p[0],y:p[1],name:n,alt:al,az,id:sid,note:al<0?'below the horizon':'star'})}
 const E=HP.earth,list=[['Sun',[-E[0],-E[1],-E[2]],'#ffcc33',16,'sun'],['Moon',moonNow.v,'#f0eee6',13,'moon']];
 for(const p of['mercury','venus','mars','jupiter','saturn','uranus','neptune'])list.push([p[0].toUpperCase()+p.slice(1),sub3(HP[p],E),{mercury:'#c9c0b8',venus:'#fff3c4',mars:'#ff8a5c',jupiter:'#f2dcb5',saturn:'#f0dc9c',uranus:'#a9e3e8',neptune:'#7fa8ff'}[p],p==='venus'||p==='jupiter'?7:5.5,p]);
 g.font='700 14px "Space Grotesk",sans-serif';
 for(const[n,v,col,sz,id]of list){const[ra,de]=eclRD(v),[al,az]=altaz(ra,de,lat,lon,ms),p=P(az,al);if(!p)continue;
  if(id==='sun'){const s=g.createRadialGradient(p[0],p[1],0,p[0],p[1],46);s.addColorStop(0,'#fff');s.addColorStop(.3,'#ffcc33');s.addColorStop(1,'rgba(255,200,50,0)');g.fillStyle=s;g.beginPath();g.arc(p[0],p[1],46,0,7);g.fill()}
  else{g.fillStyle=col;g.beginPath();g.arc(p[0],p[1],sz,0,7);g.fill();if(id!=='moon'){g.strokeStyle=col+'88';g.lineWidth=1;g.beginPath();g.arc(p[0],p[1],sz+5,0,7);g.stroke()}}
  g.fillStyle=col;g.fillText(id==='moon'?`Moon (${moonPhase()[1].toFixed(0)}% lit)`:n,p[0],p[1]+sz+14);
  arHit.push({x:p[0],y:p[1],name:n,alt:al,az,id,note:id==='sun'?'never look straight at the Sun!':al<0?'below the horizon right now':''})}
 if(SATS[0].satrec&&window.satellite){const la=issLook(skyLoc,ms);if(la){const p=P(la.az,la.el);if(p){g.fillStyle='#7dffc4';g.beginPath();g.arc(p[0],p[1],5,0,7);g.fill();g.fillText('ISS',p[0],p[1]-14);arHit.push({x:p[0],y:p[1],name:'ISS',alt:la.el,az:la.az,id:'iss',note:la.el<0?'below the horizon':'moving fast!'})}}}
 // crosshair and heading
 g.strokeStyle='rgba(255,255,255,.5)';g.lineWidth=1.5;g.beginPath();g.arc(cx,cy,18,0,7);g.moveTo(cx-28,cy);g.lineTo(cx-20,cy);g.moveTo(cx+20,cy);g.lineTo(cx+28,cy);g.moveTo(cx,cy-28);g.lineTo(cx,cy-20);g.moveTo(cx,cy+20);g.lineTo(cx,cy+28);g.stroke();
 g.fillStyle='#fff';g.font='600 15px "Space Grotesk",sans-serif';g.textAlign='left';g.fillText(`Facing ${compassName(arAz)} · ${arAlt>=0?arAlt.toFixed(0)+'° up':(-arAlt).toFixed(0)+'° down'}${arMode==='sensor'?' · following your phone':arMode==='rel'?' · phone (compass not available)':''}`,14,22)}
window.__skyAR={set:(az,alt)=>{arAz=az;arAlt=alt;arMode='drag'},hits:()=>arHit};
