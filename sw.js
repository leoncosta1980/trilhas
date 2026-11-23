/* Trilhas GPS - service worker v3.0 */
const V='trilhas-v3.0',TC='tiles-v3';
const SHELL=['./','index.html','manifest.json','icon-192.png','icon-512.png','icon-maskable.png'];
const TILE=/(^|\.)(tile\.openstreetmap\.org|opentopomap\.org|arcgisonline\.com)$/;
const tKey=u=>u.replace(/^https:\/\/[abc]\.tile\./,'https://a.tile.');
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(SHELL.map(u=>c.add(new Request(u,{cache:'reload'})).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==V&&n!==TC).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
async function tile(r){const c=await caches.open(TC),k=tKey(r.url),m=await c.match(k);if(m)return m;
 try{const n=await fetch(r);if(n.ok&&n.type!=='opaque')c.put(k,n.clone()).catch(()=>{});return n}catch(e){return new Response('',{status:504,statusText:'offline'})}}
async function page(r){const c=await caches.open(V);
 try{const n=await Promise.race([fetch(r),new Promise((_,j)=>setTimeout(()=>j(new Error('timeout')),6000))]);if(n.ok)c.put('index.html',n.clone()).catch(()=>{});return n}
 catch(e){return (await c.match('index.html'))||(await c.match('./'))||Response.error()}}
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;let u;try{u=new URL(r.url)}catch(x){return}
 if(TILE.test(u.hostname)){e.respondWith(tile(r));return}
 if(u.origin!==self.location.origin)return;
 if(r.mode==='navigate'){e.respondWith(page(r));return}
 e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>{const f=fetch(r).then(n=>{if(n.ok){const cp=n.clone();caches.open(V).then(c=>c.put(r,cp))}return n}).catch(()=>m||Response.error());return m||f}))});
