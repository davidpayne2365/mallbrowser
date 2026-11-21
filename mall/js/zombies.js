// Zombie mode (index.html?mode=zombies): the same mall, overrun. Every zone (the car park, the mall, each district and
// the exit) has slow, shambling zombies; clear them all. You start with a pistol with unlimited bullets and find other
// weapons hidden around the map, each with its own spread and kind of damage.
// The engine calls makeZombieMode(api) once, then zm.update(dt) every frame while you play, and draws zm.zomB (people
// mesh, pose 3 = zombie, 4 = fallen) and zm.fxB (glowing parts: your gun, tracers, flashes, pickups).
function makeZombieMode(api){
 const{P,keys}=api,R=rng(1313);
 // ---- weapons: rate (shots per second), dmg per pellet, pellets, spread (radians), range (m), and what each hit does
 const WEAPONS=[
  {id:'pistol',name:'Pistol',rate:3.5,dmg:30,pellets:1,spread:.012,range:70,col:[1,.85,.4],tip:'Steady and reliable'},
  {id:'shotgun',name:'Shotgun',rate:1.1,dmg:16,pellets:9,spread:.09,range:30,col:[1,.6,.3],tip:'Wide spread of pellets'},
  {id:'smg',name:'SMG',rate:11,dmg:13,pellets:1,spread:.04,range:55,col:[1,.9,.5],tip:'Very fast fire'},
  {id:'rifle',name:'Rail Rifle',rate:1.4,dmg:120,pellets:1,spread:0,range:120,pierce:4,col:[.6,.9,1],tip:'Pierces through 4 zombies'},
  {id:'ember',name:'Ember Gun',rate:7,dmg:8,pellets:2,spread:.06,range:20,burn:1,col:[1,.45,.1],tip:'Sets zombies on fire'},
  {id:'tesla',name:'Tesla Coil',rate:2.5,dmg:40,pellets:1,spread:.01,range:45,chain:3,col:[.5,.8,1],tip:'Lightning jumps to 3 more zombies'},
  {id:'frost',name:'Frost Ray',rate:4,dmg:18,pellets:1,spread:.02,range:50,slow:1,col:[.7,.95,1],tip:'Freezes zombies, slowing them down'}];
 const W=Object.fromEntries(WEAPONS.map(w=>[w.id,w]));
 // where each weapon is hidden (one per zone, along the route); later zones hide a second copy as a spare
 const HIDE={lot:'shotgun',hub:'smg',market:'rifle',dept:'ember',aquarium:'tesla',arboretum:'frost'};
 const COUNT={lot:14,hub:45,exit:18};const PER=28;
 // zombies never appear within 30 m of you (?zclose, for testing, lets them appear right in front)
 const MINDIST=new URLSearchParams(location.search).has('zclose')?3:30;
 let owned=['pistol'],cur='pistol',cool=0,firing=false,health=100,hurtT=0,deadT=0,recoil=0,swapT=0;
 const zones=new Map();          // theme -> {r,zs:[],picks:[],cleared}
 const cleared=new Set(),taken=new Set();
 const ZONES=['lot','hub',...(typeof ROUTE!=='undefined'?ROUTE:[]),'exit'];
 const zomB=api.gbuf(),fxB=api.gbuf();let zData=new Float32Array(16*400),fData=new Float32Array(16*900),nF=0;
 const fx=[];                    // short-lived effects: {kind,a:[x,y,z],b:[x,y,z],col,life,t}

 // ---- HUD
 const css='position:fixed;z-index:5;pointer-events:none;font:600 14px/1.3 system-ui,sans-serif;color:#fff;text-shadow:0 1px 3px #000';
 const el=(style,html='')=>{const d=document.createElement('div');d.style.cssText=css+';'+style;d.innerHTML=html;document.body.appendChild(d);return d};
 const hud={cross:el('left:50%;top:50%;width:18px;height:18px;margin:-9px 0 0 -9px;border:2px solid rgba(255,255,255,.85);border-radius:50%'),
  hp:el('left:16px;bottom:18px;width:200px;height:14px;background:rgba(0,0,0,.45);border-radius:7px;overflow:hidden','<div style="height:100%;width:100%;background:#e33;transition:width .2s"></div>'),
  gun:el('right:16px;bottom:16px;text-align:right;font-size:18px'),zone:el('left:50%;top:12px;transform:translateX(-50%);text-align:center'),
  banner:el('left:50%;top:34%;transform:translateX(-50%);text-align:center;font-size:30px;font-weight:800;opacity:0;transition:opacity .4s'),
  red:el('left:0;top:0;right:0;bottom:0;background:radial-gradient(transparent 45%,rgba(200,0,0,.55));opacity:0;transition:opacity .15s')};
 let bannerT=0;const banner=(t,sub='',s=2.6)=>{hud.banner.innerHTML=t+(sub?`<div style="font-size:16px;font-weight:600;margin-top:6px">${sub}</div>`:'');hud.banner.style.opacity=1;bannerT=s};
 const showHud=v=>{for(const k in hud)if(k!=='banner'&&k!=='red')hud[k].style.display=v?'':'none'};
 // touch: fire, swap and jump buttons
 if(api.touchMode){const bs='position:fixed;z-index:6;border-radius:50%;border:2px solid rgba(255,255,255,.7);background:rgba(0,0,0,.35);color:#fff;font:700 13px system-ui;touch-action:none';
  const btn=(label,style,down,upf)=>{const b=document.createElement('button');b.textContent=label;b.style.cssText=bs+';'+style;b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();down()});
   b.addEventListener('pointerup',e=>{e.preventDefault();e.stopPropagation();upf&&upf()});b.addEventListener('pointercancel',()=>upf&&upf());document.body.appendChild(b);return b};
  btn('FIRE','right:22px;bottom:90px;width:84px;height:84px',()=>firing=true,()=>firing=false);btn('SWAP','right:118px;bottom:40px;width:56px;height:56px',()=>swap(1));
  btn('JUMP','right:22px;bottom:186px;width:60px;height:60px',()=>{keys.add('Space');setTimeout(()=>keys.delete('Space'),150)})}

 // ---- zones: zombies and hidden weapons appear when an area loads (the same places every time)
 function seedOf(t){let h=2166136261;for(const c of t)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0}
 function spawnZone(r){const th=r.theme,Z={r,zs:[],picks:[]};zones.set(th,Z);if(!r.N||!r.N.length)return Z;
  const rr=rng(seedOf(th)+7),d0=r.doors[0],far=r.N.filter(n=>Math.hypot(n.x-d0.x,n.z-d0.z)>(MINDIST<30?0:th==='hub'?40:22)&&Math.hypot(n.x-P.x,n.z-P.z)>MINDIST);const pool=far.length?far:r.N;
  const n=cleared.has(th)?0:COUNT[th]??PER;for(let k=0;k<n;k++){const nd=pool[Math.floor(rr()*pool.length)],s=.92+rr()*.16;
   Z.zs.push({x:nd.x+rr()-.5,y:nd.y,z:nd.z+rr()-.5,yaw:rr()*6.28,hp:100,max:100,spd:.55+rr()*.45,s,ph:rr(),col:[.12+rr()*.2,.1+rr()*.15,.08+rr()*.12],
    st:'idle',wx:nd.x,wz:nd.z,home:[nd.x,nd.z],t:rr()*3,gy:0,atk:0,flash:0,burn:0,slow:0,dead:0})}
  // the hidden weapon: tucked away at a quiet spot far from the entrance
  const want=HIDE[th]||WEAPONS[1+Math.floor(rr()*(WEAPONS.length-1))].id;const nd=pool[Math.floor(rr()*pool.length)];if(!taken.has(th))Z.picks.push({w:want,x:nd.x,y:nd.y,z:nd.z,taken:false});
  return Z}
 function syncZones(){const L=api.LOADED;for(const r of L){const th=r.theme;const Z=zones.get(th);if(!Z||Z.r!==r)spawnZone(r)}
  for(const[th,Z]of zones)if(!L.includes(Z.r))zones.delete(th)}

 // ---- weapons
 function swap(dir){const i=owned.indexOf(cur);cur=owned[(i+dir+owned.length)%owned.length];swapT=.25;cool=Math.max(cool,.2)}
 function select(n){if(owned[n]){cur=owned[n];swapT=.25}}
 function eye(){return[P.x,P.ey??P.y,P.z]}
 function dirs(){const cy=Math.cos(P.yaw),sy=Math.sin(P.yaw),cp=Math.cos(P.pitch),sp=Math.sin(P.pitch);return{f:[-sy*cp,sp,-cy*cp],r:[cy,0,-sy],u:[sy*sp,cp,cy*sp]}}
 // distance along a ray before it meets a wall (marching through the collision grid)
 function wallDist(o,d,max){for(let t=.3;t<max;t+=.25){if(api.solid(o[0]+d[0]*t,o[1]+d[1]*t,o[2]+d[2]*t))return t}return max}
 function raySphere(o,d,c,rad){const ox=o[0]-c[0],oy=o[1]-c[1],oz=o[2]-c[2],b=ox*d[0]+oy*d[1]+oz*d[2],cc=ox*ox+oy*oy+oz*oz-rad*rad,h=b*b-cc;if(h<0)return-1;const t=-b-Math.sqrt(h);return t>0?t:-1}
 const live=()=>{const a=[];for(const Z of zones.values())for(const z of Z.zs)if(z.st!=='dead')a.push(z);return a};
 function hurt(z,dmg,w,head){if(z.st==='dead')return;z.hp-=dmg*(head?2.5:1);z.flash=.12;z.st='chase';if(w.burn)z.burn=4;if(w.slow)z.slow=4;
  if(z.hp<=0){z.st='dead';z.dead=0;groan(z,true)}}
 function shoot(){const w=W[cur],o=eye(),{f,r,u}=dirs(),muz=[o[0]+r[0]*.2+u[0]*-.12+f[0]*.55,o[1]+r[1]*.2+u[1]*-.12+f[1]*.55,o[2]+r[2]*.2+u[2]*-.12+f[2]*.55];
  recoil=Math.min(1,recoil+.5);fx.push({k:'flash',a:muz,col:w.col,life:.05,t:0});gunSound(w);const zs=live();
  for(let p=0;p<w.pellets;p++){const ja=R()*6.283,jr=w.spread*Math.sqrt(R());let d=[f[0]+(r[0]*Math.cos(ja)+u[0]*Math.sin(ja))*jr,f[1]+(r[1]*Math.cos(ja)+u[1]*Math.sin(ja))*jr,f[2]+(r[2]*Math.cos(ja)+u[2]*Math.sin(ja))*jr];
   const l=Math.hypot(...d);d=d.map(v=>v/l);const wd=wallDist(o,d,w.range);
   const hits=[];for(const z of zs){if(Math.hypot(z.x-o[0],z.z-o[2])>wd+1)continue;const s=z.s;
    const th=raySphere(o,d,[z.x,z.y+1.64*s,z.z],.17*s),tb=Math.max(raySphere(o,d,[z.x,z.y+1.15*s,z.z],.3*s),-1),tl=raySphere(o,d,[z.x,z.y+.55*s,z.z],.26*s);
    const ts=[th,tb,tl].filter(t=>t>0);if(!ts.length)continue;const t=Math.min(...ts);if(t<wd)hits.push({z,t,head:th>0&&t===th})}
   hits.sort((a,b)=>a.t-b.t);const n=Math.min(hits.length,w.pierce||1);let end=wd;
   for(let k=0;k<n;k++){const h=hits[k];hurt(h.z,w.dmg,w,h.head);end=h.t;
    if(w.chain){let from=h.z;const done=new Set([h.z]);for(let c=0;c<w.chain;c++){let best=null,bd=6;for(const z of zs)if(!done.has(z)&&z.st!=='dead'){const dd=Math.hypot(z.x-from.x,z.z-from.z);if(dd<bd){bd=dd;best=z}}
      if(!best)break;done.add(best);fx.push({k:'beam',a:[from.x,from.y+1.2,from.z],b:[best.x,best.y+1.2,best.z],col:w.col,life:.12,t:0});hurt(best,w.dmg*.6,w,false);from=best}}}
   const hp=[o[0]+d[0]*end,o[1]+d[1]*end,o[2]+d[2]*end];fx.push({k:'beam',a:muz,b:hp,col:w.col,life:cur==='rifle'?.12:.05,t:0});fx.push({k:'spark',a:hp,col:n?[.6,.05,.03]:w.col,life:.12,t:0})}}

 // ---- sound (short synthesised shots and low groans; no constant noise)
 function gunSound(w){const A=api.actx;if(!A||A.state!=='running')return;const t0=A.currentTime;api.kick(api.master,t0,w.id==='shotgun'||w.id==='rifle'?.5:.3);
  const o=A.createOscillator(),g=A.createGain();o.type=w.id==='tesla'||w.id==='frost'?'sawtooth':'square';o.frequency.setValueAtTime(w.id==='frost'?1400:w.id==='tesla'?900:420,t0);o.frequency.exponentialRampToValueAtTime(90,t0+.08);
  g.gain.setValueAtTime(.06,t0);g.gain.exponentialRampToValueAtTime(.001,t0+.09);o.connect(g);g.connect(api.master);o.start(t0);o.stop(t0+.1)}
 function groan(z,die){const A=api.actx;if(!A||A.state!=='running')return;const d=Math.hypot(z.x-P.x,z.z-P.z);if(d>14)return;const t0=A.currentTime,o=A.createOscillator(),v=A.createOscillator(),vg=A.createGain(),g=A.createGain(),f=A.createBiquadFilter();
  o.type='sawtooth';o.frequency.value=die?70:85+z.ph*40;v.frequency.value=5;vg.gain.value=6;v.connect(vg);vg.connect(o.frequency);f.type='lowpass';f.frequency.value=500;
  const vol=.05*(1-d/14);g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(vol,t0+.15);g.gain.linearRampToValueAtTime(0,t0+(die?.9:1.4));o.connect(f);f.connect(g);g.connect(api.master);o.start(t0);v.start(t0);o.stop(t0+1.5);v.stop(t0+1.5)}

 // ---- zombie movement: shamble toward you, step up and down, slide along walls, keep apart from each other
 const free=(x,y,z)=>!api.solid(x,y+.9,z)&&!api.solid(x,y+1.5,z);
 function moveZ(z,dt){const dx=P.x-z.x,dz=P.z-z.z,dist=Math.hypot(dx,dz),dy=P.feet-z.y;
  if(z.st==='idle'&&(dist<28&&Math.abs(dy)<4||dist<8)){z.st='chase';if(R()<.5)groan(z)}
  let tx,tz,sp=z.spd*(z.slow>0?.3:1);
  if(z.st==='chase'){tx=dx;tz=dz;if(dist>45)z.st='idle'}else{z.t-=dt;if(z.t<0){z.t=2+R()*4;z.wx=z.home[0]+(R()-.5)*8;z.wz=z.home[1]+(R()-.5)*8}tx=z.wx-z.x;tz=z.wz-z.z;sp*=.35}
  const l=Math.hypot(tx,tz);if(l>.05){z.yaw=Math.atan2(tx,tz);let mx=tx/l*sp*dt,mz=tz/l*sp*dt;
   if(!free(z.x+mx,z.y,z.z+mz)){const a=Math.atan2(mx,mz),m=Math.hypot(mx,mz);let ok=false;for(const da of[.8,-.8,1.6,-1.6]){const nx=Math.sin(a+da)*m,nz=Math.cos(a+da)*m;if(free(z.x+nx,z.y,z.z+nz)){mx=nx;mz=nz;ok=true;break}}if(!ok){mx=0;mz=0}}
   if(z.st==='chase'&&dist<1)mx=mz=0;z.x+=mx;z.z+=mz}
  z.gy-=dt;if(z.gy<0){z.gy=.3;const g=api.groundAt(z.x,z.y+.6,z.z);if(g>-50&&g<z.y+.7)z.y=g}
  if(z.st==='chase'&&dist<1.2&&Math.abs(dy)<1.5){z.atk-=dt;if(z.atk<=0){z.atk=1.1;damage(12)}}else z.atk=Math.min(z.atk,.4)}
 function damage(n){if(deadT>0)return;health-=n;hurtT=.4;if(health<=0){health=0;deadT=2.5;banner('You were bitten','Back to the start of this zone…')}}
 function respawn(){const r=api.CUR||api.HUB,d=r.doors[0],inx=-d.dx||0,inz=-d.dz||0;P.x=d.x+inx*4;P.z=d.z+inz*4;P.y=api.EYE+.1;api.settle();health=100;
  for(const z of(zones.get(r.theme)?.zs||[]))if(z.st!=='dead'&&Math.hypot(z.x-P.x,z.z-P.z)<10){z.x=z.home[0];z.z=z.home[1];z.st='idle'}}

 // ---- every frame
 let zoneLast='',groanT=0;
 function update(dt){syncZones();const t=performance.now()/1000;
  if(deadT>0){deadT-=dt;if(deadT<=0)respawn()}
  cool-=dt;swapT=Math.max(0,swapT-dt);recoil=Math.max(0,recoil-dt*6);hurtT=Math.max(0,hurtT-dt);
  if(firing&&cool<=0&&deadT<=0&&swapT<=0){shoot();cool=1/W[cur].rate}
  // zombies near you move; far away ones wait
  for(const Z of zones.values()){for(const z of Z.zs){if(z.st==='dead'){z.dead+=dt;continue}
    z.flash=Math.max(0,z.flash-dt);z.slow=Math.max(0,z.slow-dt);if(z.burn>0){z.burn-=dt;z.hp-=10*dt;z.flash=Math.max(z.flash,.02);if(z.hp<=0){z.st='dead';z.dead=0}}
    if(Math.hypot(z.x-P.x,z.z-P.z)<70)moveZ(z,dt)}
   // keep them from standing inside each other
   const L=Z.zs.filter(z=>z.st!=='dead');for(let i=0;i<L.length;i++)for(let j=i+1;j<L.length;j++){const a=L[i],b=L[j],dx=b.x-a.x,dz=b.z-a.z,d=Math.hypot(dx,dz);if(d<.6&&d>.001&&Math.abs(a.y-b.y)<1){const p=(.6-d)/2/d;a.x-=dx*p;a.z-=dz*p;b.x+=dx*p;b.z+=dz*p}}
   // weapon pickups
   for(const pk of Z.picks)if(!pk.taken&&Math.hypot(pk.x-P.x,pk.z-P.z)<1.4&&Math.abs(pk.y-P.feet)<1.5){pk.taken=true;taken.add(Z.r.theme);const w=W[pk.w];
    if(!owned.includes(pk.w)){owned.push(pk.w);cur=pk.w;swapT=.25;banner('New weapon: '+w.name,w.tip+' · unlimited ammo')}else banner(w.name+' (already yours)','',1.6)}
   const alive=Z.zs.filter(z=>z.st!=='dead').length;
   if(!cleared.has(Z.r.theme)&&Z.zs.length&&alive===0){cleared.add(Z.r.theme);const all=ZONES.every(th=>cleared.has(th));
    banner(all?'You cleared Skylight Galleria!':'Zone cleared!',all?'Every zone is safe again.':`${cleared.size} of ${ZONES.length} zones cleared`,4)}}
  groanT-=dt;if(groanT<0){groanT=2+R()*3;const a=live().filter(z=>z.st==='chase');if(a.length)groan(a[Math.floor(R()*a.length)])}
  // HUD
  const CUR=api.CUR,Z=CUR&&zones.get(CUR.theme),left=Z?Z.zs.filter(z=>z.st!=='dead').length:0,title=CUR?(CUR.theme==='hub'?'The Mall':(typeof TITLES!=='undefined'&&TITLES[CUR.theme])||CUR.title||CUR.theme):'';
  const zl=`${title} · ${Z&&cleared.has(CUR.theme)?'cleared':left+' zombies left'}<br><span style="font-size:12px;opacity:.85">Zones cleared ${cleared.size} / ${ZONES.length}</span>`;if(zl!==zoneLast){hud.zone.innerHTML=zl;zoneLast=zl}
  hud.hp.firstChild.style.width=health+'%';hud.gun.innerHTML=`${W[cur].name} <span style="opacity:.8">∞</span><div style="font-size:12px;opacity:.8">${owned.length} of ${WEAPONS.length} weapons · ${api.touchMode?'SWAP':'wheel / 1–7'} to switch</div>`;
  hud.red.style.opacity=hurtT>0?1:0;if(bannerT>0){bannerT-=dt;if(bannerT<=0)hud.banner.style.opacity=0}
  for(const e of fx)e.t+=dt;for(let i=fx.length-1;i>=0;i--)if(fx[i].t>fx[i].life)fx.splice(i,1);
  write(t)}

 // ---- instance data for drawing
 function write(t){let n=0;for(const Z of zones.values())for(const z of Z.zs){if(z.st==='dead'&&z.dead>6)continue;if(n>=400)break;
   const sink=z.st==='dead'?Math.max(0,z.dead-4)*.25:0,c=z.flash>0?[.7,.05,.03]:z.burn>0?[.9,.35,.05]:z.slow>0?[.45,.7,.95]:z.col;
   zData.set([z.x,z.y-sink,z.z,z.yaw,z.s,z.s,z.s,1,c[0],c[1],c[2],z.ph,0,0,z.st==='dead'?0:Math.min(1.2,z.spd*(z.st==='chase'?.9:.35)*(z.slow>0?.3:1)),z.st==='dead'?4:3],n*16);n++}
  zomB.set(zData.subarray(0,n*16));
  nF=0;const part=(x,y,z,yaw,sx,sy,sz,col,pitch,em)=>{if(nF>=900)return;fData.set([x,y,z,yaw,sx,sy,sz,8,col[0],col[1],col[2],0,pitch,0,em,0],nF*16);nF++};
  // your gun, held in front of you
  if(deadT<=0){const o=eye(),{f,r,u}=dirs(),w=W[cur],k=.46-recoil*.06-swapT*.6,p=[o[0]+r[0]*.24-u[0]*(.2+swapT*.4)+f[0]*k,o[1]+r[1]*.24-u[1]*(.2+swapT*.4)+f[1]*k,o[2]+r[2]*.24-u[2]*(.2+swapT*.4)+f[2]*k];
   const at=(df,du,dr)=>[p[0]+f[0]*df+u[0]*du+r[0]*dr,p[1]+f[1]*df+u[1]*du+r[1]*dr,p[2]+f[2]*df+u[2]*du+r[2]*dr];const pi=P.pitch+recoil*.08;
   const dark=[.06,.06,.07],L=w.id==='shotgun'||w.id==='rifle'?1.35:w.id==='smg'?1.05:1;
   const g1=at(0,0,0),g2=at(.12*L,.012,0),g3=at(-.1,-.07,0),g4=at(.03,.03,0);
   part(...g1,P.yaw,.045,.06,.2*L,dark,pi,0);part(...g2,P.yaw,.025,.025,.2*L,dark,pi,0);part(...g3,P.yaw,.04,.09,.045,dark,pi-.3,0);part(...g4,P.yaw,.05,.01,.12,w.col,pi,1.6)}
  // tracers, flashes, sparks
  for(const e of fx){const a=1-e.t/e.life;if(e.k==='beam'){const[x0,y0,z0]=e.a,[x1,y1,z1]=e.b,dx=x1-x0,dy=y1-y0,dz=z1-z0,l=Math.hypot(dx,dy,dz);if(l<.01)continue;
    part((x0+x1)/2,(y0+y1)/2,(z0+z1)/2,Math.atan2(-dx,-dz),.012,.012,l,e.col,Math.asin(dy/l),4*a)}
   else part(...e.a,t*20,e.k==='flash'?.1:.07,e.k==='flash'?.1:.07,e.k==='flash'?.1:.07,e.col,t*13,(e.k==='flash'?8:3)*a)}
  // hidden weapons: a glowing gun turning slowly above a ring of light
  for(const Z of zones.values())for(const pk of Z.picks){if(pk.taken)continue;const w=W[pk.w],y=pk.y+.9+Math.sin(t*2)*.08,yaw=t*1.2;
   part(pk.x,y,pk.z,yaw,.07,.1,.36,[.08,.08,.09],0,0);part(pk.x,y+.02,pk.z,yaw,.04,.04,.5,w.col,0,2.5);
   for(let k=0;k<8;k++){const a=k/8*6.283;part(pk.x+Math.cos(a)*.5,pk.y+.03,pk.z+Math.sin(a)*.5,a,.12,.02,.04,w.col,0,3)}}
  fxB.set(fData.subarray(0,nF*16))}

 showHud(true);banner('Zombie Mode','Clear every zone · unlimited ammo · find hidden weapons',4);
 // for automated tests: nearest live zombie and counts
 const debug=()=>{const a=live().map(z=>({x:z.x,y:z.y,z:z.z,hp:z.hp,d:Math.hypot(z.x-P.x,z.z-P.z)})).sort((p,q)=>p.d-q.d);return{alive:a.length,near:a[0],health,cur,owned}};
 return{debug,update,zomB,fxB,fire:v=>{firing=v},swap,select,setHud:showHud,owned:()=>owned,
  // faster on your feet than in the normal mode
  walk:3.2,run:6.6,jump:6.4}}
