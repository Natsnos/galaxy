// Install as an app: offline cache, install button, iPhone/iPad instructions, offline notice
// Part of Interactive Galaxy. Files load in number order and share one global scope.

const isStandalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1')){
 addEventListener('load',()=>{navigator.serviceWorker.register('sw.js').catch(()=>{})})}
let installEvt=null;
addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvt=e;$('installb').hidden=false});
addEventListener('appinstalled',()=>{$('installb').hidden=true;showToast('Installed! Open Interactive Galaxy from your home screen or apps.','app')});
if(isIOS&&!isStandalone&&location.protocol==='https:')$('installb').hidden=false;
$('installb').onclick=async()=>{if(installEvt){installEvt.prompt();try{await installEvt.userChoice}catch(e){}installEvt=null;$('installb').hidden=true;return}
 if(isIOS)showToast('To install on iPhone or iPad: tap the Share button, then “Add to Home Screen”.','app')};
function onlineState(){if(!navigator.onLine)showToast('You’re offline. The planets and saved maps still work. Live data comes back when you reconnect.','net');else if($('toast').dataset.key==='net')$('toast').hidden=true}
addEventListener('offline',onlineState);addEventListener('online',onlineState);
if(!navigator.onLine)setTimeout(onlineState,1500);
