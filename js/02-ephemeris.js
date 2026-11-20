// Real positions: JPL planet elements, IAU rotation, the Moon, coordinate helpers
// Part of Interactive Galaxy. Files load in number order and share one global scope.

/* ---------- real ephemeris ---------- */
const D2R=Math.PI/180,EPS=23.4392911*D2R,cE=Math.cos(EPS),sE=Math.sin(EPS);
// JPL "Approximate Positions of the Planets", Table 1 (J2000 ecliptic): a e I L varpi Omega, then rates per century
const ELEM={
 mercury:[0.38709927,0.20563593,7.00497902,252.25032350,77.45779628,48.33076593,0.00000037,0.00001906,-0.00594749,149472.67411175,0.16047689,-0.12534081],
 venus:[0.72333566,0.00677672,3.39467605,181.97909950,131.60246718,76.67984255,0.00000390,-0.00004107,-0.00078890,58517.81538729,0.00268329,-0.27769418],
 earth:[1.00000261,0.01671123,-0.00001531,100.46457166,102.93768193,0,0.00000562,-0.00004392,-0.01294668,35999.37244981,0.32327364,0],
 mars:[1.52371034,0.09339410,1.84969142,-4.55343205,-23.94362959,49.55953891,0.00001847,0.00007882,-0.00813131,19140.30268499,0.44441088,-0.29257343],
 jupiter:[5.20288700,0.04838624,1.30439695,34.39644051,14.72847983,100.47390909,-0.00011607,-0.00013253,-0.00183714,3034.74612775,0.21252668,0.20469106],
 saturn:[9.53667594,0.05386179,2.48599187,49.95424423,92.59887831,113.66242448,-0.00125060,-0.00050991,0.00193609,1222.49362201,-0.41897216,-0.28867794],
 uranus:[19.18916464,0.04725744,0.77263783,313.23810451,170.95427630,74.01692503,-0.00196176,-0.00004397,-0.00242939,428.48202785,0.40805281,0.04240589],
 neptune:[30.06992276,0.00859048,1.77004347,-55.12002969,44.96476227,131.78422574,0.00026291,0.00005105,0.00035372,218.45945325,-0.32241464,-0.00508664],
 pluto:[39.48211675,0.24882730,17.14001206,238.92903833,224.06891629,110.30393684,-0.00031596,0.00005170,0.00004818,145.20780515,-0.04062942,-0.01183482]};
// IAU WGCCRE rotation models: pole RA, pole Dec, prime meridian W0, W rate (deg/day)
const ROT={sun:[286.13,63.87,84.176,14.1844],mercury:[281.0103,61.4155,329.5988,6.1385108],venus:[272.76,67.16,160.20,-1.4813688],
 earth:[0,90,190.147,360.9856235],moon:[269.9949,66.5392,38.3213,13.17635815],mars:[317.269202,54.432516,176.049863,350.891982443297],
 jupiter:[268.056595,64.495303,284.95,870.536],saturn:[40.589,83.537,38.90,810.7939024],uranus:[257.311,-15.175,203.81,-501.1600928],
 neptune:[299.36,43.46,249.978,541.1397757],pluto:[132.993,-6.163,302.695,56.3625225]};
const RADEC={proxima:[217.429,-62.680],acen:[219.902,-60.834],sirius:[101.287,-16.716],vega:[279.235,38.784],polaris:[37.954,89.264],betelgeuse:[88.793,7.407],rigel:[78.634,-8.202]};
const eclToThree=(x,y,z)=>new THREE.Vector3(x,z,-y);
const eqToThree=(x,y,z)=>eclToThree(x,y*cE+z*sE,-y*sE+z*cE);
const radec=(ra,dec)=>{ra*=D2R;dec*=D2R;return eqToThree(Math.cos(dec)*Math.cos(ra),Math.cos(dec)*Math.sin(ra),Math.sin(dec))};
const jd=ms=>ms/864e5+2440587.5, dJ=ms=>jd(ms)-2451545.0;
function helio(id,ms,Mo){const el=ELEM[id],T=dJ(ms)/36525,g=k=>el[k]+el[k+6]*T;
 const a=g(0),e=g(1),I=g(2)*D2R,L=g(3),wp=g(4),O=g(5)*D2R,w=(wp-g(5))*D2R;
 let M=((L-wp)%360+540)%360-180;M*=D2R;if(Mo!==undefined)M=Mo;let E=M+e*Math.sin(M);for(let i=0;i<6;i++)E-=(E-e*Math.sin(E)-M)/(1-e*Math.cos(E));
 const xp=a*(Math.cos(E)-e),yp=a*Math.sqrt(1-e*e)*Math.sin(E),cw=Math.cos(w),sw=Math.sin(w),cO=Math.cos(O),sO=Math.sin(O),cI=Math.cos(I),sI=Math.sin(I);
 return[(cw*cO-sw*sO*cI)*xp+(-sw*cO-cw*sO*cI)*yp,(cw*sO+sw*cO*cI)*xp+(-sw*sO+cw*cO*cI)*yp,sw*sI*xp+cw*sI*yp]}
// Moon: Schlyter's low-precision theory with main perturbations (geocentric ecliptic)
function moonGeo(ms){const d=jd(ms)-2451543.5,n=x=>((x%360)+360)%360;
 const N=n(125.1228-0.0529538083*d),i=5.1454,w=n(318.0634+0.1643573223*d),e=0.0549,M=n(115.3654+13.0649929509*d);
 let E=M*D2R+e*Math.sin(M*D2R)*(1+e*Math.cos(M*D2R));for(let k=0;k<5;k++)E-=(E-e*Math.sin(E)-M*D2R)/(1-e*Math.cos(E));
 const xv=60.2666*(Math.cos(E)-e),yv=60.2666*Math.sqrt(1-e*e)*Math.sin(E),v=Math.atan2(yv,xv)/D2R;let r=Math.hypot(xv,yv);
 const Nr=N*D2R,vw=(v+w)*D2R,ir=i*D2R,xh=r*(Math.cos(Nr)*Math.cos(vw)-Math.sin(Nr)*Math.sin(vw)*Math.cos(ir)),yh=r*(Math.sin(Nr)*Math.cos(vw)+Math.cos(Nr)*Math.sin(vw)*Math.cos(ir)),zh=r*Math.sin(vw)*Math.sin(ir);
 let lon=Math.atan2(yh,xh)/D2R,lat=Math.atan2(zh,Math.hypot(xh,yh))/D2R;
 const Ms=n(356.0470+0.9856002585*d),Ls=n(Ms+282.9404+4.70935e-5*d),Lm=n(M+w+N),D=(Lm-Ls)*D2R,F=(Lm-N)*D2R,Mm=M*D2R,Mr=Ms*D2R,s=Math.sin;
 lon+=-1.274*s(Mm-2*D)+0.658*s(2*D)-0.186*s(Mr)-0.059*s(2*Mm-2*D)-0.057*s(Mm-2*D+Mr)+0.053*s(Mm+2*D)+0.046*s(2*D-Mr)+0.041*s(Mm-Mr)-0.035*s(D)-0.031*s(Mm+Mr);
 lat+=-0.173*s(F-2*D)-0.055*s(Mm-F-2*D)-0.046*s(Mm+F-2*D)+0.033*s(F+2*D)+0.017*s(2*Mm+F);
 r+=-0.58*Math.cos(Mm-2*D)-0.46*Math.cos(2*D);
 lon-=1.396971*(d-1.5)/36525;
 const lo=lon*D2R,la=lat*D2R;return{v:[Math.cos(la)*Math.cos(lo),Math.cos(la)*Math.sin(lo),Math.sin(la)],km:r*6371}}
// orientation quaternion from IAU model; sphere local X = prime meridian, Y = north pole
const mBasis=new THREE.Matrix4();
function orient(id,ms,q){const[a0,d0,W0,Wd]=ROT[id],N=radec(a0,d0),ar=a0*D2R;const Q=eqToThree(-Math.sin(ar),Math.cos(ar),0).normalize();
 const W=(W0+Wd*dJ(ms))*D2R,P=Q.clone().multiplyScalar(Math.cos(W)).add(N.clone().cross(Q).multiplyScalar(Math.sin(W)));
 mBasis.makeBasis(P,N,P.clone().cross(N));return q.setFromRotationMatrix(mBasis)}
// compressed display distance (angles are real; distances squeezed so everything fits)
const RMAP=[[0,12],[.39,22],[.72,30],[1,39],[1.52,50],[2.7,66],[5.2,80],[9.5,110],[19.2,140],[30.1,165],[39.5,190],[50,215],[100,260],[200,300]];
function mapR(r){for(let i=1;i<RMAP.length;i++)if(r<=RMAP[i][0]){const[a,b]=[RMAP[i-1],RMAP[i]];return a[1]+(b[1]-a[1])*(r-a[0])/(b[0]-a[0])}return RMAP[RMAP.length-1][1]}
const disp=v=>{const r=Math.hypot(...v),k=mapR(r)/r;return eclToThree(v[0]*k,v[1]*k,v[2]*k)};
