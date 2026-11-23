const V='trilhas-v2',L='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/';
const SHELL=['./','index.html','manifest.json','icon.svg',L+'leaflet.css',L+'leaflet.js',L+'images/layers.png',L+'images/layers-2x.png'];
const isTile=h=>/tile\.openstreetmap\.org|opentopomap\.org|arcgisonline\.com/.test(h);
const key=u=>u.replace(/^https:\/\/[abc]\.tile\./,'https://a.tile.');
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!=V&&n!='tiles').map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!='GET')return;const u=new URL(r.url);
 if(isTile(u.hostname)){const k=key(r.url);e.respondWith(caches.open('tiles').then(async c=>{const m=await c.match(k);if(m)return m;try{const n=await fetch(r.url,{mode:'no-cors'});c.put(k,n.clone());return n}catch{return new Response('',{status:504})}}));return}
 e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>m||fetch(r).then(n=>{if(n.ok||n.type=='opaque'){const cp=n.clone();caches.open(V).then(c=>c.put(r,cp))}return n}).catch(()=>r.mode=='navigate'?caches.match('index.html'):Response.error())))});
