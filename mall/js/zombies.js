// Zombie mode (index.html?mode=zombies): night falls on a busy mall, and a few of the shoppers are zombies.
// A zombie goes for the nearest person (or for you, if you are close), pulls them down and feeds; a while later the
// victim gets up as a zombie too, so the outbreak spreads through the crowd. Nobody new appears: the zone is cleared
// when no zombies are left and nobody is still turning. You have a pistol with unlimited bullets; each zombie you
// kill has a 5% chance to drop a new weapon, each with its own spread and kind of damage.
// The engine calls makeZombieMode(api) once and zm.update(dt) every frame while you play. People are the engine's
// crowd (region.P): a person with p.zs is moved here (p.x, p.y, p.z, p.yaw, p.pose, p.zsp speed, p.zc colours);
// everyone else keeps shopping. zm.fxB holds glowing parts: your gun, tracers, flashes and dropped weapons.
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
 const DROP=.05;                                   // chance a killed zombie drops a weapon you don't have yet
 const SEED={lot:2,hub:6,exit:2},SEEDN=3;          // zombies hidden in each zone's crowd at the start
 const TURN=[10,16];                               // seconds before someone pulled down gets up as a zombie
 // zombies never start within 30 m of you (?zclose, for testing, lets them start right in front)
 const MINDIST=new URLSearchParams(location.search).has('zclose')?3:30;
 let shots=0,hitsN=0,owned=['pistol'],cur='pistol',cool=0,firing=false,health=100,hurtT=0,deadT=0,recoil=0,swapT=0;
 const seeded=new Map(),cleared=new Set(),saved=new Map(),drops=[],fx=[];
 const ZONES=['lot','hub',...(typeof ROUTE!=='undefined'?ROUTE:[]),'exit'];
 const fxB=api.gbuf();let fData=new Float32Array(16*900),nF=0;

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

 // ---- people and their states. p.zs.st: zombie, eat (feeding on someone), down (pulled down, turning), dead (shot),
 // gone (removed), flee (running from a zombie), cower (stopped, frightened)
 const isZ=p=>p.zs&&(p.zs.st==='zombie'||p.zs.st==='eat');
 const isHuman=p=>!p.fur&&(!p.zs||p.zs.st==='flee'||p.zs.st==='cower');
 const blood=c=>[c[0]*.55+.2,c[1]*.35,c[2]*.35];
 // limbs: left arm, right arm, left leg, right leg (bit 1, 2, 4, 8 of p.limb once blown off); a zombie without a leg crawls
 function turn(p){const z=p.zs||(p.zs={});Object.assign(z,{st:'zombie',hp:100,spd:1+R()*.45,tgt:null,think:R()*.6,atk:0,flash:0,burn:0,slow:0,gy:0,t:0,wx:p.x,wz:p.z,lhp:[40,40,50,50],crawl:false,k:Math.floor(R()*4)});
  p.limb=0;p.zc=blood(p.c);p.pose=3}
 // a few shoppers in each zone are already infected when you first get there
 // everyone in the zone is a zombie (the full crowd); anyone within 30 m of you starts somewhere further away
 function seedZone(r){const th=r.theme;if(seeded.get(th)===r)return;seeded.set(th,r);if(cleared.has(th)){for(const p of r.P)if(!p.fur)p.zs={st:'gone'};return}
  const rr=rng(seedOfZ(th)),far=(r.N||[]).filter(n=>Math.hypot(n.x-P.x,n.z-P.z)>MINDIST);
  const testLimbs=new URLSearchParams(location.search).has('zcrawl');let n=0;   // ?zcrawl: some start without a leg or an arm (for testing)
  for(const p of r.P){if(p.fur)continue;turn(p);if(testLimbs){n++;if(n%3===0){p.limb|=4;p.zs.crawl=true;p.zs.spd=.4;p.pose=8}else if(n%3===1)p.limb|=2}if(Math.hypot(p.x-P.x,p.z-P.z)<MINDIST&&far.length){const n=far[Math.floor(rr()*far.length)];p.x=n.x+rr()-.5;p.y=n.y;p.z=n.z+rr()-.5}}}
 function seedOfZ(t){let h=2166136261;for(const c of t)h=Math.imul(h^c.charCodeAt(0),16777619);return(h>>>0)+11}

 // ---- quick look-ups: who is near whom (rebuilt a few times a second)
 const CELL=6;let gridH=new Map(),gridZ=new Map(),gridF=new Map(),gridT=0;
 const key=(x,y,z)=>Math.floor(x/CELL)*73856093^Math.floor(z/CELL)*19349663^Math.floor(y/3)*83492791;
 function rebuild(){gridH=new Map();gridZ=new Map();gridF=new Map();const add=(g,p)=>{const k=key(p.x,p.y,p.z);let a=g.get(k);if(!a)g.set(k,a=[]);a.push(p)};
  for(const r of api.LOADED)for(const p of r.P){if(isZ(p))add(gridZ,p);else if(isHuman(p)){add(gridH,p);if(p.zs&&p.zs.st==='flee'&&p.zs.seen)add(gridF,p)}}}
 function nearest(g,x,y,z,max){let best=null,bd=max;const cx=Math.floor(x/CELL),cz=Math.floor(z/CELL),cy=Math.floor(y/3),n=Math.ceil(max/CELL);
  for(let i=-n;i<=n;i++)for(let j=-n;j<=n;j++)for(const dy of[0,-1,1]){const a=g.get((cx+i)*73856093^(cz+j)*19349663^(cy+dy)*83492791);if(!a)continue;
   for(const p of a){const d=Math.hypot(p.x-x,p.z-z);if(d<bd&&Math.abs(p.y-y)<2.5){bd=d;best=p}}}return best}

 // ---- weapons
 function swap(dir){const i=owned.indexOf(cur);cur=owned[(i+dir+owned.length)%owned.length];swapT=.25;cool=Math.max(cool,.2)}
 function select(n){if(owned[n]){cur=owned[n];swapT=.25}}
 function eye(){return[P.x,P.ey??P.y,P.z]}
 function dirs(){const cy=Math.cos(P.yaw),sy=Math.sin(P.yaw),cp=Math.cos(P.pitch),sp=Math.sin(P.pitch);return{f:[-sy*cp,sp,-cy*cp],r:[cy,0,-sy],u:[sy*sp,cp,cy*sp]}}
 function wallDist(o,d,max){for(let t=.3;t<max;t+=.25){if(api.solid(o[0]+d[0]*t,o[1]+d[1]*t,o[2]+d[2]*t))return t}return max}
 function raySphere(o,d,c,rad){const ox=o[0]-c[0],oy=o[1]-c[1],oz=o[2]-c[2],b=ox*d[0]+oy*d[1]+oz*d[2],cc=ox*ox+oy*oy+oz*oz-rad*rad,h=b*b-cc;if(h<0)return-1;const t=-b-Math.sqrt(h);return t>0?t:-1}
 function zombiesNear(o,range){const a=[];for(const r of api.LOADED)for(const p of r.P)if(isZ(p)&&Math.hypot(p.x-o[0],p.z-o[2])<range+2)a.push(p);return a}
 function kill(p){const z=p.zs;z.st='dead';z.t=0;p.pose=4;p.zsp=0;groan(p,true);
  // a small chance of dropping a weapon you don't have yet
  const missing=WEAPONS.filter(w=>!owned.includes(w.id)&&!drops.some(d=>d.w===w.id));
  if(missing.length&&R()<DROP){const w=missing[Math.floor(R()*missing.length)];drops.push({w:w.id,x:p.x,y:p.y,z:p.z,t:0})}}
 const rxv=(v,a,py)=>{const c=Math.cos(a),s=Math.sin(a),y=v[1]-py;return[v[0],y*c-v[2]*s+py,y*s+v[2]*c]};
 function bodyParts(p){const crawl=p.zs.crawl,lm=p.limb||0,out=[];
  const arm=(x,ang)=>{const c=Math.cos(ang),s=Math.sin(ang);return[[x,1.47-.31*c,-.31*s],[x,1.47-.6*c,-.6*s]]};
  const ang=crawl?-2.9:-1.3,L=[['head',[0,1.66,.02],.14],['torso',[0,1.2,0],.21],['torso',[0,.93,0],.19]];
  if(!(lm&1))for(const c of arm(-.235,ang))L.push(['la',c,.1]);if(!(lm&2))for(const c of arm(.235,ang))L.push(['ra',c,.1]);
  if(!(lm&4))L.push(['ll',[-.095,.62,0],.11],['ll',[-.095,.25,0],.1]);if(!(lm&8))L.push(['rl',[.095,.62,0],.11],['rl',[.095,.25,0],.1]);
  const cy=Math.cos(p.yaw),sy=Math.sin(p.yaw),[sx,sh,sz]=p.s;
  for(const[part,c0,r]of L){let c=crawl?(v=>{const q=rxv(v,1.5708,0);return[q[0],q[1]+.16,q[2]]})(c0):rxv(c0,.22,.9);
   c=[c[0]*sx,c[1]*sh,c[2]*sz];out.push({part,c:[p.x+cy*c[0]+sy*c[2],p.y+c[1],p.z-sy*c[0]+cy*c[2]],r:r*sh})}
  return out}
 // damage by where you hit: the head takes 4x, the body 1x, arms and legs 0.7x and are blown off after enough
 const LIMB={la:0,ra:1,ll:2,rl:3},HIT={head:4,torso:1,la:.7,ra:.7,ll:.7,rl:.7};
 function hurt(p,dmg,w,part='torso'){const z=p.zs;if(!isZ(p))return;z.hp-=dmg*HIT[part];z.flash=.12;if(w.burn)z.burn=4;if(w.slow)z.slow=4;
  if(part in LIMB&&z.hp>0){const i=LIMB[part];z.lhp[i]-=dmg;if(z.lhp[i]<=0&&!(p.limb&(1<<i)))sever(p,i)}
  if(z.hp<=0)kill(p)}
 function sever(p,i){p.limb|=1<<i;const z=p.zs,cy=Math.cos(p.yaw),sy=Math.sin(p.yaw),side=i%2?1:-1,arm=i<2;
  const lx=side*(arm?.3:.1),ly=arm?1.35:.5,x=p.x+cy*lx,zz=p.z-sy*lx,y=p.y+ly;
  // the limb flies off, with a spray of blood
  fx.push({k:'gib',a:[x,y,zz],v:[cy*side*2+(R()-.5)*2,2.5+R()*1.5,-sy*side*2+(R()-.5)*2],ground:p.y,size:arm?[.09,.55,.09]:[.13,.8,.13],col:arm?[.16,.22,.11]:p.zc.map(v=>v*.8),yaw:R()*6,pitch:R()*6,spin:6+R()*6,life:6,t:0});
  for(let k=0;k<10;k++)fx.push({k:'gib',a:[x,y,zz],v:[(R()-.5)*3,1+R()*2.5,(R()-.5)*3],ground:p.y,size:[.04,.04,.04],col:[.45,.02,.02],yaw:0,pitch:0,spin:0,life:1.2+R(),t:0});
  if(!arm&&!z.crawl){z.crawl=true;z.spd=.35+R()*.15}}
 function shoot(){const w=W[cur],o=eye(),{f,r,u}=dirs(),muz=[o[0]+r[0]*.24+u[0]*-.18+f[0]*.62,o[1]+r[1]*.24+u[1]*-.18+f[1]*.62,o[2]+r[2]*.24+u[2]*-.18+f[2]*.62];
  shots++;recoil=Math.min(1,recoil+.5);fx.push({k:'flash',a:muz,col:w.col,life:.05,t:0});gunSound(w);const zs=zombiesNear(o,w.range);
  for(let q=0;q<w.pellets;q++){const ja=R()*6.283,jr=w.spread*Math.sqrt(R());let d=[f[0]+(r[0]*Math.cos(ja)+u[0]*Math.sin(ja))*jr,f[1]+(r[1]*Math.cos(ja)+u[1]*Math.sin(ja))*jr,f[2]+(r[2]*Math.cos(ja)+u[2]*Math.sin(ja))*jr];
   const l=Math.hypot(...d);d=d.map(v=>v/l);const wd=wallDist(o,d,w.range);
   const hits=[];for(const p of zs){const vx=p.x-o[0],vy=p.y+1-o[1],vz=p.z-o[2],along=vx*d[0]+vy*d[1]+vz*d[2];if(along<0||along>wd+1)continue;
    if(Math.hypot(vx-d[0]*along,vy-d[1]*along,vz-d[2]*along)>1.4)continue;let best=null;
    for(const b of bodyParts(p)){const t=raySphere(o,d,b.c,b.r);if(t>0&&t<wd&&(!best||t<best.t))best={p,t,part:b.part}}if(best)hits.push(best)}
   hits.sort((a,b)=>a.t-b.t);const n=Math.min(hits.length,w.pierce||1);let end=wd;
   for(let k=0;k<n;k++){const h=hits[k];hitsN++;hurt(h.p,w.dmg,w,h.part);end=h.t;
    if(w.chain){let from=h.p;const done=new Set([h.p]);for(let c=0;c<w.chain;c++){let best=null,bd=6;for(const p of zs)if(!done.has(p)&&isZ(p)){const dd=Math.hypot(p.x-from.x,p.z-from.z);if(dd<bd){bd=dd;best=p}}
      if(!best)break;done.add(best);fx.push({k:'beam',a:[from.x,from.y+1.2,from.z],b:[best.x,best.y+1.2,best.z],col:w.col,life:.12,t:0});hurt(best,w.dmg*.6,w,'torso');from=best}}}
   const hp=[o[0]+d[0]*end,o[1]+d[1]*end,o[2]+d[2]*end];fx.push({k:'beam',a:muz,b:hp,col:w.col,life:cur==='rifle'?.12:.05,t:0});fx.push({k:'spark',a:hp,col:n?[.6,.05,.03]:w.col,life:.12,t:0})}}

 // ---- sound (short synthesised shots and low groans; no constant noise)
 function gunSound(w){const A=api.actx;if(!A||A.state!=='running')return;const t0=A.currentTime;api.kick(api.master,t0,w.id==='shotgun'||w.id==='rifle'?.5:.3);
  const o=A.createOscillator(),g=A.createGain();o.type=w.id==='tesla'||w.id==='frost'?'sawtooth':'square';o.frequency.setValueAtTime(w.id==='frost'?1400:w.id==='tesla'?900:420,t0);o.frequency.exponentialRampToValueAtTime(90,t0+.08);
  g.gain.setValueAtTime(.06,t0);g.gain.exponentialRampToValueAtTime(.001,t0+.09);o.connect(g);g.connect(api.master);o.start(t0);o.stop(t0+.1)}
 function groan(p,die){const A=api.actx;if(!A||A.state!=='running')return;const d=Math.hypot(p.x-P.x,p.z-P.z);if(d>14)return;const t0=A.currentTime,o=A.createOscillator(),v=A.createOscillator(),vg=A.createGain(),g=A.createGain(),f=A.createBiquadFilter();
  o.type='sawtooth';o.frequency.value=die?70:85+p.ph*40;v.frequency.value=5;vg.gain.value=6;v.connect(vg);vg.connect(o.frequency);f.type='lowpass';f.frequency.value=500;
  const vol=.05*(1-d/14);g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(vol,t0+.15);g.gain.linearRampToValueAtTime(0,t0+(die?.9:1.4));o.connect(f);f.connect(g);g.connect(api.master);o.start(t0);v.start(t0);o.stop(t0+1.5);v.stop(t0+1.5)}

 // ---- moving people around: walk toward (or away from) a point, step up and down, slide along walls
 const free=(x,y,z)=>!api.solid(x,y+.9,z)&&!api.solid(x,y+1.5,z);
 function step(p,tx,tz,sp,dt){const z=p.zs,dx=tx-p.x,dz=tz-p.z,l=Math.hypot(dx,dz);if(l<.05)return;p.yaw=Math.atan2(dx,dz);let mx=dx/l*sp*dt,mz=dz/l*sp*dt;
  if(!free(p.x+mx,p.y,p.z+mz)){const a=Math.atan2(mx,mz),m=Math.hypot(mx,mz);let ok=false;for(const da of[.8,-.8,1.6,-1.6]){const nx=Math.sin(a+da)*m,nz=Math.cos(a+da)*m;if(free(p.x+nx,p.y,p.z+nz)){mx=nx;mz=nz;ok=true;break}}if(!ok){mx=0;mz=0}}
  p.x+=mx;p.z+=mz;z.gy=(z.gy||0)-dt;if(z.gy<0){z.gy=.3;const g=api.groundAt(p.x,p.y+.6,p.z);if(g>-50&&g<p.y+.7)p.y=g}}
 function zombie(p,dt){const z=p.zs,dP=Math.hypot(P.x-p.x,P.z-p.z),dy=P.feet-p.y;
  z.flash=Math.max(0,z.flash-dt);z.slow=Math.max(0,z.slow-dt);if(z.burn>0){z.burn-=dt;z.hp-=10*dt;z.flash=Math.max(z.flash,.02);if(z.hp<=0){kill(p);return}}
  p.zc=z.flash>0?[.7,.05,.03]:z.burn>0?[.9,.35,.05]:z.slow>0?[.45,.7,.95]:blood(p.c);
  if(z.st==='eat'){z.t+=dt;p.zsp=0;p.pose=5;if(z.t>6){z.st='zombie';p.pose=3}return}
  // choose who to go after: you if you're close, otherwise the nearest person
  z.think-=dt;if(z.think<0){z.think=.6;z.tgt=dP<16&&Math.abs(dy)<3?'you':nearest(gridH,p.x,p.y,p.z,28)}
  const sp=z.spd*(z.slow>0?.3:1);let tx,tz,s=sp;
  if(z.tgt==='you'){tx=P.x;tz=P.z}else if(z.tgt&&isHuman(z.tgt)){tx=z.tgt.x;tz=z.tgt.z}
  else{z.t-=dt;if(z.t<0){z.t=3+R()*5;z.wx=p.x+(R()-.5)*16;z.wz=p.z+(R()-.5)*16}tx=z.wx;tz=z.wz;s=sp*.6}
  if(z.tgt==='you'&&dP<1){p.yaw=Math.atan2(P.x-p.x,P.z-p.z)}else step(p,tx,tz,s,dt);p.zsp=z.crawl?.8:Math.min(1.2,s*.9);p.pose=z.crawl?8:3;
  // bite you
  if(z.tgt==='you'&&dP<(z.crawl?1.4:1.2)&&Math.abs(dy)<1.5){z.atk-=dt;if(z.atk<=0){z.atk=1.1;damage(12)}}else z.atk=Math.min(z.atk,.4);
  // or pull someone down
  const h=z.tgt!=='you'&&z.tgt;if(h&&isHuman(h)&&Math.hypot(h.x-p.x,h.z-p.z)<.8&&Math.abs(h.y-p.y)<1){
   h.zs={st:'down',t:0,turn:TURN[0]+R()*(TURN[1]-TURN[0])};h.pose=6;h.zsp=0;h.zc=blood(h.c);h.yaw=p.yaw+Math.PI;z.st='eat';z.t=0;z.tgt=null;groan(p)}}
 // people are scared: they spot a zombie 22 m away and run (panic spreads to anyone near a runner); they sprint at
 // first but tire after about 8 s; when nothing is chasing them they crouch and cover their heads (pose 7)
 function human(p,dt){const z=p.zs;const zz=nearest(gridZ,p.x,p.y,p.z,22);let away=null;
  if(zz)away=[p.x-zz.x,p.z-zz.z];else{const f=nearest(gridF,p.x,p.y,p.z,6);if(f&&f!==p)away=[Math.sin(f.yaw),Math.cos(f.yaw)]}
  // only people who can see a zombie spread the panic, so it doesn't snowball through the whole mall
  if(away){if(!z)p.zs={st:'flee',t:0,run:0};const s=p.zs;s.st='flee';s.t=0;s.seen=!!zz;s.run=(s.run||0)+dt;const l=Math.hypot(...away)||1,sp=(p.base||1.3)*(s.run<8?1.9:1.15);
   step(p,p.x+away[0]/l*4,p.z+away[1]/l*4,sp,dt);p.zsp=Math.min(1.6,sp*.7);p.pose=0}
  else if(z){z.t+=dt;z.run=Math.max(0,(z.run||0)-dt*.5);if(z.t>2.5){z.st='cower';p.pose=7;p.zsp=0}}}

 function damage(n){if(deadT>0)return;health-=n;hurtT=.4;if(health<=0){health=0;deadT=2.5;banner('You were bitten','Back to the start of this zone…')}}
 function respawn(){const r=api.CUR||api.HUB,d=r.doors[0],inx=-d.dx||0,inz=-d.dz||0;P.x=d.x+inx*4;P.z=d.z+inz*4;P.y=api.EYE+.1;api.settle();health=100;
  for(const q of r.P)if(isZ(q)&&Math.hypot(q.x-P.x,q.z-P.z)<10){q.x+=(q.x-P.x)*1.5;q.z+=(q.z-P.z)*1.5}}

 // ---- every frame
 let zoneLast='',groanT=0,countT=0,frameNo=0;const count=new Map();
 function update(dt){const t=performance.now()/1000;
  for(const r of api.LOADED)seedZone(r);
  if(deadT>0){deadT-=dt;if(deadT<=0)respawn()}
  cool-=dt;swapT=Math.max(0,swapT-dt);recoil=Math.max(0,recoil-dt*6);hurtT=Math.max(0,hurtT-dt);
  if(firing&&cool<=0&&deadT<=0&&swapT<=0){shoot();cool=1/W[cur].rate}
  gridT-=dt;if(gridT<0){gridT=.2;rebuild()}
  frameNo++;
  for(const r of api.LOADED)for(const p of r.P){const dd=Math.hypot(p.x-P.x,p.z-P.z);if(dd>90)continue;const z=p.zs;
   if(!z){if(!p.fur&&gridZ.size)human(p,dt);continue}
   if(isZ(p)){if(dd>40){z.acc=(z.acc||0)+dt;if(((frameNo+z.k)&3)!==0)continue;zombie(p,Math.min(.2,z.acc));z.acc=0}else zombie(p,dt)}
   else if(z.st==='down'){z.t+=dt;if(z.t>z.turn)turn(p)}
   else if(z.st==='dead'){z.t+=dt;if(z.t>4)p.y-=dt*.25;if(z.t>7)z.st='gone'}
   else if(z.st==='flee'||z.st==='cower')human(p,dt)}
  // weapons dropped by zombies
  for(let i=drops.length-1;i>=0;i--){const d=drops[i];d.t+=dt;if(Math.hypot(d.x-P.x,d.z-P.z)<1.4&&Math.abs(d.y-P.feet)<1.5){const w=W[d.w];drops.splice(i,1);
    if(!owned.includes(d.w)){owned.push(d.w);cur=d.w;swapT=.25;banner('New weapon: '+w.name,w.tip+' · unlimited ammo')}}else if(d.t>120)drops.splice(i,1)}
  // counts per zone, and clearing a zone
  countT-=dt;if(countT<0){countT=.4;for(const r of api.LOADED){let zs=0,down=0,hum=0;for(const p of r.P){if(isZ(p))zs++;else if(p.zs&&p.zs.st==='down')down++;else if(isHuman(p))hum++}count.set(r.theme,{zs,down,hum});
    if(!cleared.has(r.theme)&&seeded.get(r.theme)===r&&zs===0&&down===0&&r.P.length){cleared.add(r.theme);saved.set(r.theme,hum);const all=ZONES.every(th=>cleared.has(th));
     banner(all?'You cleared Skylight Galleria!':'Zone cleared!',all?'Every zone is safe again.':`${hum?hum+' survivors saved · ':''}${cleared.size} of ${ZONES.length} zones cleared`,4)}}}
  groanT-=dt;if(groanT<0){groanT=2+R()*3;const a=zombiesNear([P.x,0,P.z],14);if(a.length)groan(a[Math.floor(R()*a.length)])}
  // HUD
  const CUR=api.CUR,c=CUR&&count.get(CUR.theme),title=CUR?(CUR.theme==='hub'?'The Mall':(typeof TITLES!=='undefined'&&TITLES[CUR.theme])||CUR.title||CUR.theme):'';
  const line=!c?'':cleared.has(CUR.theme)?'cleared':`${c.zs} zombies${c.down?` · ${c.down} turning`:''}${c.hum?` · ${c.hum} people left`:''}`;
  const zl=`${title} · ${line}<br><span style="font-size:12px;opacity:.85">Zones cleared ${cleared.size} / ${ZONES.length}</span>`;if(zl!==zoneLast){hud.zone.innerHTML=zl;zoneLast=zl}
  hud.hp.firstChild.style.width=health+'%';hud.gun.innerHTML=`${W[cur].name} <span style="opacity:.8">∞</span><div style="font-size:12px;opacity:.8">${owned.length} of ${WEAPONS.length} weapons · ${api.touchMode?'SWAP':'wheel / 1–7'} to switch</div>`;
  hud.red.style.opacity=hurtT>0?1:0;if(bannerT>0){bannerT-=dt;if(bannerT<=0)hud.banner.style.opacity=0}
  for(const e of fx){e.t+=dt;if(e.k==='gib'&&e.v){e.v[1]-=9.8*dt;for(let j=0;j<3;j++)e.a[j]+=e.v[j]*dt;e.yaw+=e.spin*dt;e.pitch+=e.spin*.7*dt;if(e.a[1]<e.ground+e.size[1]*.3){e.a[1]=e.ground+e.size[1]*.3;e.v=e.v.map(v=>v*.4);e.v[1]=0;e.spin*=.5;e.pitch=1.5708}}}
  for(let i=fx.length-1;i>=0;i--)if(fx[i].t>fx[i].life)fx.splice(i,1);
  write(t)}

 // ---- glowing parts: your gun, tracers, flashes, dropped weapons
 function write(t){nF=0;const part=(x,y,z,yaw,sx,sy,sz,col,pitch,em)=>{if(nF>=900)return;fData.set([x,y,z,yaw,sx,sy,sz,8,col[0],col[1],col[2],0,pitch,0,em,0],nF*16);nF++};
  if(deadT<=0){const o=eye(),{f,r,u}=dirs(),w=W[cur],k=.46-recoil*.06-swapT*.6,p=[o[0]+r[0]*.24-u[0]*(.2+swapT*.4)+f[0]*k,o[1]+r[1]*.24-u[1]*(.2+swapT*.4)+f[1]*k,o[2]+r[2]*.24-u[2]*(.2+swapT*.4)+f[2]*k];
   const at=(df,du,dr)=>[p[0]+f[0]*df+u[0]*du+r[0]*dr,p[1]+f[1]*df+u[1]*du+r[1]*dr,p[2]+f[2]*df+u[2]*du+r[2]*dr];const pi=P.pitch+recoil*.08;
   const dark=[.06,.06,.07],L=w.id==='shotgun'||w.id==='rifle'?1.35:w.id==='smg'?1.05:1;
   const g1=at(0,0,0),g2=at(.12*L,.012,0),g3=at(-.1,-.07,0),g4=at(.03,.03,0);
   part(...g1,P.yaw,.045,.06,.2*L,dark,pi,0);part(...g2,P.yaw,.025,.025,.2*L,dark,pi,0);part(...g3,P.yaw,.04,.09,.045,dark,pi-.3,0);part(...g4,P.yaw,.05,.01,.12,w.col,pi,1.6)}
  for(const e of fx){const a=1-e.t/e.life;if(e.k==='gib'){part(...e.a,e.yaw,...e.size,e.col,e.pitch,0);continue}if(e.k==='beam'){const[x0,y0,z0]=e.a,[x1,y1,z1]=e.b,dx=x1-x0,dy=y1-y0,dz=z1-z0,l=Math.hypot(dx,dy,dz);if(l<.01)continue;
    part((x0+x1)/2,(y0+y1)/2,(z0+z1)/2,Math.atan2(-dx,-dz),.012,.012,l,e.col,Math.asin(dy/l),4*a)}
   else part(...e.a,t*20,e.k==='flash'?.1:.07,e.k==='flash'?.1:.07,e.k==='flash'?.1:.07,e.col,t*13,(e.k==='flash'?8:3)*a)}
  for(const d of drops){const w=W[d.w],y=d.y+.9+Math.sin(t*2)*.08,yaw=t*1.2;
   part(d.x,y,d.z,yaw,.07,.1,.36,[.08,.08,.09],0,0);part(d.x,y+.02,d.z,yaw,.04,.04,.5,w.col,0,2.5);
   for(let k=0;k<8;k++){const a=k/8*6.283;part(d.x+Math.cos(a)*.5,d.y+.03,d.z+Math.sin(a)*.5,a,.12,.02,.04,w.col,0,3)}}
  fxB.set(fData.subarray(0,nF*16))}

 // for automated tests: nearest live zombie and counts
 const debug=()=>{const a=zombiesNear([P.x,0,P.z],500).map(p=>({x:p.x,y:p.y,z:p.z,hp:p.zs.hp,st:p.zs.st,d:Math.hypot(p.x-P.x,p.z-P.z)})).sort((p,q)=>p.d-q.d);
  let down=0,fleeing=0,limbs=0,crawl=0;for(const r of api.LOADED)for(const p of r.P){if(p.zs&&p.zs.st==='down')down++;if(p.zs&&p.zs.st==='flee')fleeing++;if(p.limb)limbs++;if(p.zs&&p.zs.crawl&&isZ(p))crawl++}return{alive:a.length,down,fleeing,limbs,crawl,near:a[0],health,cur,owned,drops:drops.length,shots,hits:hitsN}};
 showHud(true);banner('Zombie Mode','Everyone has turned · clear every zone',4);
 return{debug,update,fxB,fire:v=>{firing=v},swap,select,setHud:showHud,owned:()=>owned,
  // faster on your feet than in the normal mode
  walk:3.2,run:6.6,jump:6.4}}
