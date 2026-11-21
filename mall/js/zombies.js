// Zombie mode (index.html?mode=zombies): night has fallen and everyone in the mall has turned. Clear every zone.
// It plays like a looter shooter: guns (js/guns.js) drop from zombies with a rarity, a maker, an element and
// abilities; damage numbers pop off every hit; damaged zombies show a health bar; clearing a zone earns a rare-or-better
// gun and a full heal; rare health potions are hidden around each zone.
// The engine calls makeZombieMode(api) once and zm.update(dt) every frame while you play. People are the engine's
// crowd (region.P): a person with p.zs is moved here (p.x, p.y, p.z, p.yaw, p.pose, p.zsp speed, p.zc colours, p.limb).
// zm.fxB holds the glowing and metal parts this mode draws: your gun, beams, flames, numbers' targets, drops, potions.
function makeZombieMode(api){
 const{P,keys}=api,R=rng(1313),QSZ=new URLSearchParams(location.search);
 const GUN_DROP=.06,POTION_DROP=.03,HIDDEN_POTIONS=0,POTION_HEAL=50,SLOTS=6;
 const TURN=[10,16];                               // seconds before someone pulled down gets up as a zombie
 // zombies never start within 30 m of you (?zclose, for testing, lets them start right in front)
 const MINDIST=QSZ.has('zclose')?3:30;
 let shots=0,hitsN=0,cool=0,firing=false,health=100,hurtT=0,deadT=0,recoil=0,swapT=0,prevE=false,beamSnd=0;
 const inv=[makeGun(R,{type:'pistol',rarity:0,maker:'hammerjack'})];let ci=0;const gun=()=>inv[ci];
 const seeded=new Map(),cleared=new Set(),drops=[],potions=[],fx=[];
 const ZONES=['lot','hub',...(typeof ROUTE!=='undefined'?ROUTE:[]),'exit'];
 const fxB=api.gbuf();let fData=new Float32Array(16*1600),nF=0;

 // ---- HUD
 const css='position:fixed;z-index:5;pointer-events:none;font:600 14px/1.3 system-ui,sans-serif;color:#fff;text-shadow:0 1px 3px #000';
 const el=(style,html='')=>{const d=document.createElement('div');d.style.cssText=css+';'+style;d.innerHTML=html;document.body.appendChild(d);return d};
 const hud={cross:el('left:50%;top:50%;width:18px;height:18px;margin:-9px 0 0 -9px;border:2px solid rgba(255,255,255,.85);border-radius:50%'),
  hp:el('left:16px;bottom:18px;width:220px;height:16px;background:rgba(0,0,0,.5);border-radius:8px;overflow:hidden','<div style="height:100%;width:100%;background:linear-gradient(#ff6a5a,#c81e1e);transition:width .2s"></div>'),
  hpn:el('left:22px;bottom:19px;font-size:12px'),
  gun:el('right:16px;bottom:16px;text-align:right;max-width:46vw'),zone:el('left:50%;top:12px;transform:translateX(-50%);text-align:center'),
  card:el('left:50%;bottom:90px;transform:translateX(-50%);min-width:240px;max-width:86vw;padding:10px 14px;border-radius:10px;background:rgba(10,10,16,.82);display:none;text-align:left;pointer-events:auto'),
  banner:el('left:50%;top:30%;transform:translateX(-50%);text-align:center;font-size:30px;font-weight:800;opacity:0;transition:opacity .4s;width:90vw'),
  red:el('left:0;top:0;right:0;bottom:0;background:radial-gradient(transparent 45%,rgba(200,0,0,.55));opacity:0;transition:opacity .15s'),
  nums:el('left:0;top:0;width:100%;height:100%;overflow:hidden')};
 let bannerT=0;const banner=(t,sub='',s=2.6)=>{hud.banner.innerHTML=t+(sub?`<div style="font-size:16px;font-weight:600;margin-top:6px">${sub}</div>`:'');hud.banner.style.opacity=1;bannerT=s};
 const showHud=v=>{for(const k in hud)if(!['banner','red','card','nums'].includes(k))hud[k].style.display=v?'':'none'};
 // touch: fire, swap, jump, and take (shown on a weapon card)
 if(api.touchMode){const bs='position:fixed;z-index:6;border-radius:50%;border:2px solid rgba(255,255,255,.7);background:rgba(0,0,0,.35);color:#fff;font:700 13px system-ui;touch-action:none';
  const btn=(label,style,down,upf)=>{const b=document.createElement('button');b.textContent=label;b.style.cssText=bs+';'+style;b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();down()});
   b.addEventListener('pointerup',e=>{e.preventDefault();e.stopPropagation();upf&&upf()});b.addEventListener('pointercancel',()=>upf&&upf());document.body.appendChild(b);return b};
  btn('FIRE','right:22px;bottom:90px;width:84px;height:84px',()=>firing=true,()=>firing=false);btn('SWAP','right:118px;bottom:40px;width:56px;height:56px',()=>swap(1));
  btn('JUMP','right:22px;bottom:186px;width:60px;height:60px',()=>{keys.add('Space');setTimeout(()=>keys.delete('Space'),150)})}
 hud.card.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();if(near)take(near)});

 // ---- damage numbers: they pop off where you hit and drift up
 const nums=[];
 function popNum(x,y,z,v,col,big){if(v<.5)return;if(nums.length>60){const o=nums.shift();o.d.remove()}const d=document.createElement('div');
  d.style.cssText=`position:absolute;left:0;top:0;font:900 ${big?24:16}px system-ui,sans-serif;color:${col};text-shadow:0 2px 3px #000,0 0 6px rgba(0,0,0,.6);transform:translate(-50%,-50%);white-space:nowrap`;
  d.textContent=Math.round(v)+(big?'!':'');hud.nums.appendChild(d);nums.push({d,x,y,z,t:0,dx:(R()-.5)*40})}
 function stepNums(dt){for(let i=nums.length-1;i>=0;i--){const n=nums[i];n.t+=dt;const s=api.project(n.x,n.y+n.t*.9,n.z);
   if(!s||n.t>.9){n.d.remove();nums.splice(i,1);continue}n.d.style.left=(s[0]+n.dx*n.t)+'px';n.d.style.top=s[1]+'px';n.d.style.opacity=1-Math.max(0,n.t-.5)/.4}}

 // ---- people and their states. p.zs.st: zombie, eat (feeding on someone), down (pulled down, turning), dead (shot),
 // gone (removed), flee (running from a zombie), cower (stopped, frightened)
 const isZ=p=>p.zs&&(p.zs.st==='zombie'||p.zs.st==='eat');
 const isHuman=p=>!p.fur&&(!p.zs||p.zs.st==='flee'||p.zs.st==='cower');
 const blood=c=>[c[0]*.55+.2,c[1]*.35,c[2]*.35];
 // limbs: left arm, right arm, left leg, right leg (bit 1, 2, 4, 8 of p.limb once blown off); a zombie without a leg crawls
 function turn(p){const z=p.zs||(p.zs={});Object.assign(z,{st:'zombie',hp:100,spd:1+R()*.45,tgt:null,think:R()*.6,atk:0,flash:0,burn:0,acid:0,slow:0,gy:0,t:0,wx:p.x,wz:p.z,lhp:[40,40,50,50],crawl:false,k:Math.floor(R()*4),acc:0,dot:0,dotT:0});
  p.limb=0;p.zc=blood(p.c);p.pose=3}
 // everyone in the zone is a zombie (the full crowd); anyone within 30 m of you starts somewhere further away.
 // Each zone also hides a few rare health potions in quiet corners.
 function seedZone(r){const th=r.theme;if(seeded.get(th)===r)return;seeded.set(th,r);
  if(cleared.has(th)){for(const p of r.P)if(!p.fur)p.zs={st:'gone'};return}
  const rr=rng(seedOfZ(th)),nodes=r.N||[],far=nodes.filter(n=>Math.hypot(n.x-P.x,n.z-P.z)>MINDIST);
  const testLimbs=QSZ.has('zcrawl');let n=0;   // ?zcrawl: some start without a leg or an arm (for testing)
  for(const p of r.P){if(p.fur)continue;turn(p);if(testLimbs){n++;if(n%3===0){p.limb|=4;p.zs.crawl=true;p.zs.spd=.4;p.pose=8}else if(n%3===1)p.limb|=2}
   if(Math.hypot(p.x-P.x,p.z-P.z)<MINDIST&&far.length){const q=far[Math.floor(rr()*far.length)];p.x=q.x+rr()-.5;p.y=q.y;p.z=q.z+rr()-.5}}
  const d0=r.doors[0],quiet=nodes.filter(q=>Math.hypot(q.x-d0.x,q.z-d0.z)>25);
  for(let k=0;k<HIDDEN_POTIONS&&quiet.length;k++){const q=quiet[Math.floor(rr()*quiet.length)];potions.push({x:q.x+rr()-.5,y:q.y,z:q.z+rr()-.5,r})}}
 function seedOfZ(t){let h=2166136261;for(const c of t)h=Math.imul(h^c.charCodeAt(0),16777619);return(h>>>0)+11}

 // ---- quick look-ups: who is near whom (rebuilt a few times a second)
 const CELL=6;let gridH=new Map(),gridZ=new Map(),gridF=new Map(),gridT=0;
 const key=(x,y,z)=>Math.floor(x/CELL)*73856093^Math.floor(z/CELL)*19349663^Math.floor(y/3)*83492791;
 function rebuild(){gridH=new Map();gridZ=new Map();gridF=new Map();const add=(g,p)=>{const k=key(p.x,p.y,p.z);let a=g.get(k);if(!a)g.set(k,a=[]);a.push(p)};
  for(const r of api.LOADED)for(const p of r.P){if(isZ(p))add(gridZ,p);else if(isHuman(p)){add(gridH,p);if(p.zs&&p.zs.st==='flee'&&p.zs.seen)add(gridF,p)}}}
 function nearest(g,x,y,z,max,skip){let best=null,bd=max;const cx=Math.floor(x/CELL),cz=Math.floor(z/CELL),cy=Math.floor(y/3),n=Math.ceil(max/CELL);
  for(let i=-n;i<=n;i++)for(let j=-n;j<=n;j++)for(const dy of[0,-1,1]){const a=g.get((cx+i)*73856093^(cz+j)*19349663^(cy+dy)*83492791);if(!a)continue;
   for(const p of a){if(skip&&skip.has(p))continue;const d=Math.hypot(p.x-x,p.z-z);if(d<bd&&Math.abs(p.y-y)<2.5){bd=d;best=p}}}return best}
 const nearZ=(x,y,z,max,skip)=>nearest(gridZ,x,y,z,max,skip);

 // ---- weapons
 function swap(dir){ci=(ci+dir+inv.length)%inv.length;swapT=.25;cool=Math.max(cool,.2)}
 function select(n){if(inv[n]){ci=n;swapT=.25}}
 function eye(){return[P.x,P.ey??P.y,P.z]}
 function dirs(){const cy=Math.cos(P.yaw),sy=Math.sin(P.yaw),cp=Math.cos(P.pitch),sp=Math.sin(P.pitch);return{f:[-sy*cp,sp,-cy*cp],r:[cy,0,-sy],u:[sy*sp,cp,cy*sp]}}
 function wallDist(o,d,max){for(let t=.3;t<max;t+=.25){if(api.solid(o[0]+d[0]*t,o[1]+d[1]*t,o[2]+d[2]*t))return t}return max}
 function raySphere(o,d,c,rad){const ox=o[0]-c[0],oy=o[1]-c[1],oz=o[2]-c[2],b=ox*d[0]+oy*d[1]+oz*d[2],cc=ox*ox+oy*oy+oz*oz-rad*rad,h=b*b-cc;if(h<0)return-1;const t=-b-Math.sqrt(h);return t>0?t:-1}
 function zombiesNear(o,range){const a=[];for(const r of api.LOADED)for(const p of r.P)if(isZ(p)&&Math.hypot(p.x-o[0],p.z-o[2])<range+2)a.push(p);return a}
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
 // which zombies a ray hits, nearest first, before it reaches a wall
 function trace(o,d,range,zs){const wd=wallDist(o,d,range),hits=[];
  for(const p of zs){const vx=p.x-o[0],vy=p.y+1-o[1],vz=p.z-o[2],along=vx*d[0]+vy*d[1]+vz*d[2];if(along<0||along>wd+1)continue;
   if(Math.hypot(vx-d[0]*along,vy-d[1]*along,vz-d[2]*along)>1.4)continue;let best=null;
   for(const b of bodyParts(p)){const t=raySphere(o,d,b.c,b.r);if(t>0&&t<wd&&(!best||t<best.t))best={p,t,part:b.part}}if(best)hits.push(best)}
  hits.sort((a,b)=>a.t-b.t);return{hits,wd}}
 // damage by where you hit: the head takes 4x (more with Deadeye and precise makers), the body 1x, arms and legs 0.7x
 // and are blown off after enough; elements add burning, acid, slowing or extra lightning
 const LIMB={la:0,ra:1,ll:2,rl:3},HIT={torso:1,la:.7,ra:.7,ll:.7,rl:.7};
 function hurt(p,dmg,g,part='torso',at,quiet){const z=p.zs;if(!isZ(p))return 0;const head=part==='head',mult=head?4*g.crit:HIT[part],v=dmg*mult;
  z.hp-=v;z.flash=.12;if(g.elem==='fire')z.burn=4;if(g.elem==='acid')z.acid=3;if(g.elem==='frost')z.slow=4;
  if(part in LIMB&&z.hp>0){const i=LIMB[part];z.lhp[i]-=dmg;if(z.lhp[i]<=0&&!(p.limb&(1<<i)))sever(p,i)}
  const pos=at||[p.x,p.y+1.6*p.s[1],p.z],col=head?'#ffd23a':g.elem?ELEMENTS[g.elem].css:'#ffffff';
  if(quiet){z.dot+=v;z.dcol=col}else popNum(pos[0],pos[1],pos[2],v,col,head);
  if(z.hp<=0)kill(p,g);return v}
 function sever(p,i){p.limb|=1<<i;const z=p.zs,cy=Math.cos(p.yaw),sy=Math.sin(p.yaw),side=i%2?1:-1,arm=i<2;
  const lx=side*(arm?.3:.1),ly=arm?1.35:.5,x=p.x+cy*lx,zz=p.z-sy*lx,y=p.y+ly;
  fx.push({k:'gib',a:[x,y,zz],v:[cy*side*2+(R()-.5)*2,2.5+R()*1.5,-sy*side*2+(R()-.5)*2],ground:p.y,size:arm?[.09,.55,.09]:[.13,.8,.13],col:arm?[.16,.22,.11]:p.zc.map(v=>v*.8),yaw:R()*6,pitch:R()*6,spin:6+R()*6,life:6,t:0});
  for(let k=0;k<10;k++)fx.push({k:'gib',a:[x,y,zz],v:[(R()-.5)*3,1+R()*2.5,(R()-.5)*3],ground:p.y,size:[.04,.04,.04],col:[.45,.02,.02],yaw:0,pitch:0,spin:0,life:1.2+R(),t:0});
  if(!arm&&!z.crawl){z.crawl=true;z.spd=.35+R()*.15}}
 function kill(p,g){const z=p.zs;if(z.st==='dead')return;z.st='dead';z.t=0;p.pose=4;p.zsp=0;groan(p,true);
  if(drops.length<40&&R()<GUN_DROP)drops.push({g:makeGun(R),x:p.x,y:p.y,z:p.z,t:0});
  else if(R()<POTION_DROP)potions.push({x:p.x,y:p.y,z:p.z,r:null})}
 // explosions hurt every zombie nearby, less towards the edge
 function blast(c,rad,dmg,g){fx.push({k:'boom',a:c,life:.45,t:0,rad});for(let k=0;k<14;k++)fx.push({k:'puff',a:[...c],v:[(R()-.5)*7,R()*4,(R()-.5)*7],life:.5+R()*.3,t:0,col:[1,.5+R()*.3,.1],s0:.15,s1:.6});
  boomSound();for(const p of zombiesNear(c,rad)){const d=Math.hypot(p.x-c[0],p.y+1-c[1],p.z-c[2]);if(d<rad)hurt(p,dmg*(1-d/rad*.6),g,'torso')}}
 function muzzle(){const o=eye(),{f,r,u}=dirs(),k=.46+.3*gun().len*.4;return[o[0]+r[0]*.24-u[0]*.17+f[0]*k,o[1]+r[1]*.24-u[1]*.17+f[1]*k,o[2]+r[2]*.24-u[2]*.17+f[2]*k]}
 function shoot(){const g=gun(),o=eye(),{f,r,u}=dirs(),muz=muzzle();
  shots++;recoil=Math.min(1,recoil+(g.type==='sniper'||g.type==='launcher'||g.type==='shotgun'?1:.5));fx.push({k:'flash',a:muz,col:g.ecol,life:.05,t:0});gunSound(g);
  const zs=zombiesNear(o,g.range);
  for(let q=0;q<g.pellets;q++){const ja=R()*6.283,jr=g.spread*Math.sqrt(R());let d=[f[0]+(r[0]*Math.cos(ja)+u[0]*Math.sin(ja))*jr,f[1]+(r[1]*Math.cos(ja)+u[1]*Math.sin(ja))*jr,f[2]+(r[2]*Math.cos(ja)+u[2]*Math.sin(ja))*jr];
   const l=Math.hypot(...d);d=d.map(v=>v/l);const{hits,wd}=trace(o,d,g.range,zs);const n=Math.min(hits.length,1+g.pierce);let end=wd;
   for(let k=0;k<n;k++){const h=hits[k],at=[o[0]+d[0]*h.t,o[1]+d[1]*h.t,o[2]+d[2]*h.t];hitsN++;hurt(h.p,g.dmg,g,h.part,at);end=h.t;
    // lightning and ricochets jump on to the next zombie
    const jumps=g.chain+(g.elem==='shock'?1:0)+(g.abil.includes('ricochet')?1:0);let from=h.p;const done=new Set([h.p]);
    for(let c=0;c<jumps;c++){const nx=nearZ(from.x,from.y,from.z,7,done);if(!nx)break;done.add(nx);fx.push({k:'beam',a:[from.x,from.y+1.2,from.z],b:[nx.x,nx.y+1.2,nx.z],col:g.ecol,life:.14,t:0,w:.02});hurt(nx,g.dmg*.6,g,'torso');from=nx}
    if(g.abil.includes('explode'))blast(at,2.5,g.dmg*.5,g)}
   const hp=[o[0]+d[0]*end,o[1]+d[1]*end,o[2]+d[2]*end];
   if(g.blast)blast(hp,g.blast,g.dmg,g);
   fx.push({k:'beam',a:muz,b:hp,col:g.ecol,life:g.type==='sniper'?.15:.05,t:0,w:g.type==='launcher'?.05:.012});fx.push({k:'spark',a:hp,col:n?[.6,.05,.03]:g.ecol,life:.12,t:0})}}
 // beam guns (frost ray, flamethrower) hit continuously while you hold the trigger
 function beamTick(dt){const g=gun(),o=eye(),{f,r,u}=dirs(),muz=muzzle(),zs=zombiesNear(o,g.range),dps=g.dmg*g.rate;
  const rays=g.beam==='flame'?5:1;for(let q=0;q<rays;q++){const ja=q/rays*6.283,jr=g.beam==='flame'&&q?.09:0;const d0=[f[0]+(r[0]*Math.cos(ja)+u[0]*Math.sin(ja))*jr,f[1]+(r[1]*Math.cos(ja)+u[1]*Math.sin(ja))*jr,f[2]+(r[2]*Math.cos(ja)+u[2]*Math.sin(ja))*jr];
   const l=Math.hypot(...d0),d=d0.map(v=>v/l),{hits,wd}=trace(o,d,g.range,zs);const end=hits.length?hits[0].t:wd;
   if(hits.length)hurt(hits[0].p,dps*dt/rays,g,hits[0].part,null,true);
   if(g.beam==='frost'&&q===0)fx.push({k:'beam',a:muz,b:[o[0]+d[0]*end,o[1]+d[1]*end,o[2]+d[2]*end],col:[.7,.95,1],life:.04,t:0,w:.03+Math.sin(performance.now()*.03)*.008})}
  if(g.beam==='flame')for(let k=0;k<3;k++){const s=6+R()*4;fx.push({k:'puff',a:[...muz],v:[f[0]*s+(R()-.5)*1.4,f[1]*s+(R()-.5)*1.4+.4,f[2]*s+(R()-.5)*1.4],life:.35+R()*.25,t:0,col:[1,.45+R()*.4,.08],s0:.04,s1:.5})}
  else if(R()<.5)fx.push({k:'puff',a:[...muz],v:[f[0]*3+(R()-.5),f[1]*3+(R()-.5),f[2]*3+(R()-.5)],life:.3,t:0,col:[.8,.95,1],s0:.03,s1:.15});
  beamSnd-=dt;if(beamSnd<0){beamSnd=.12;gunSound(g,true)}}

 // ---- sound (short synthesised shots and low groans; no constant noise)
 const TONE={pistol:420,smg:520,rifle:380,shotgun:240,sniper:180,launcher:110,flamer:90,frost:1400,tesla:900,acid:600};
 function gunSound(g,beam){const A=api.actx;if(!A||A.state!=='running')return;const t0=A.currentTime;if(!beam)api.kick(api.master,t0,g.type==='shotgun'||g.type==='sniper'||g.type==='launcher'?.6:.3);
  const o=A.createOscillator(),gn=A.createGain(),f0=TONE[g.type]||400;o.type=g.elem==='shock'||g.type==='frost'?'sawtooth':beam?'triangle':'square';o.frequency.setValueAtTime(f0,t0);o.frequency.exponentialRampToValueAtTime(beam?f0*.8:90,t0+(beam?.1:.08));
  gn.gain.setValueAtTime(beam?.025:.06,t0);gn.gain.exponentialRampToValueAtTime(.001,t0+.1);o.connect(gn);gn.connect(api.master);o.start(t0);o.stop(t0+.12)}
 function boomSound(){const A=api.actx;if(!A||A.state!=='running')return;const t0=A.currentTime;api.kick(api.master,t0,1);const o=A.createOscillator(),g=A.createGain();o.type='triangle';o.frequency.setValueAtTime(70,t0);o.frequency.exponentialRampToValueAtTime(30,t0+.5);g.gain.setValueAtTime(.25,t0);g.gain.exponentialRampToValueAtTime(.001,t0+.6);o.connect(g);g.connect(api.master);o.start(t0);o.stop(t0+.6)}
 function chime(){const A=api.actx;if(!A||A.state!=='running')return;const t0=A.currentTime;[660,880,1320].forEach((f,i)=>{const o=A.createOscillator(),g=A.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(0,t0+i*.07);g.gain.linearRampToValueAtTime(.06,t0+i*.07+.02);g.gain.exponentialRampToValueAtTime(.001,t0+i*.07+.4);o.connect(g);g.connect(api.master);o.start(t0+i*.07);o.stop(t0+i*.07+.45)})}
 function groan(p,die){const A=api.actx;if(!A||A.state!=='running')return;const d=Math.hypot(p.x-P.x,p.z-P.z);if(d>14)return;const t0=A.currentTime,o=A.createOscillator(),v=A.createOscillator(),vg=A.createGain(),g=A.createGain(),f=A.createBiquadFilter();
  o.type='sawtooth';o.frequency.value=die?70:85+p.ph*40;v.frequency.value=5;vg.gain.value=6;v.connect(vg);vg.connect(o.frequency);f.type='lowpass';f.frequency.value=500;
  const vol=.05*(1-d/14);g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(vol,t0+.15);g.gain.linearRampToValueAtTime(0,t0+(die?.9:1.4));o.connect(f);f.connect(g);g.connect(api.master);o.start(t0);v.start(t0);o.stop(t0+1.5);v.stop(t0+1.5)}

 // ---- moving people around: walk toward (or away from) a point, step up and down, slide along walls
 const free=(x,y,z)=>!api.solid(x,y+.9,z)&&!api.solid(x,y+1.5,z);
 function step(p,tx,tz,sp,dt){const z=p.zs,dx=tx-p.x,dz=tz-p.z,l=Math.hypot(dx,dz);if(l<.05)return;p.yaw=Math.atan2(dx,dz);let mx=dx/l*sp*dt,mz=dz/l*sp*dt;
  if(!free(p.x+mx,p.y,p.z+mz)){const a=Math.atan2(mx,mz),m=Math.hypot(mx,mz);let ok=false;for(const da of[.8,-.8,1.6,-1.6]){const nx=Math.sin(a+da)*m,nz=Math.cos(a+da)*m;if(free(p.x+nx,p.y,p.z+nz)){mx=nx;mz=nz;ok=true;break}}if(!ok){mx=0;mz=0}}
  p.x+=mx;p.z+=mz;z.gy=(z.gy||0)-dt;if(z.gy<0){z.gy=.3;const g=api.groundAt(p.x,p.y+.6,p.z);if(g>-50&&g<p.y+.7)p.y=g}}
 function zombie(p,dt){const z=p.zs,dP=Math.hypot(P.x-p.x,P.z-p.z),dy=P.feet-p.y;
  z.flash=Math.max(0,z.flash-dt);z.slow=Math.max(0,z.slow-dt);
  // burning and acid keep hurting; their damage shows as numbers twice a second
  if(z.burn>0||z.acid>0){const v=(z.burn>0?12:0)+(z.acid>0?15:0);z.burn-=dt;z.acid-=dt;z.hp-=v*dt;z.dot+=v*dt;z.dcol=z.burn>0?ELEMENTS.fire.css:ELEMENTS.acid.css;z.flash=Math.max(z.flash,.02);if(z.hp<=0){kill(p);return}}
  z.dotT-=dt;if(z.dotT<0&&z.dot>0){z.dotT=.45;if(dP<40)popNum(p.x,p.y+1.7*p.s[1],p.z,z.dot,z.dcol||'#fff');z.dot=0}
  p.zc=z.flash>0?[.7,.05,.03]:z.burn>0?[.9,.35,.05]:z.acid>0?[.45,.85,.2]:z.slow>0?[.45,.7,.95]:blood(p.c);
  if(z.st==='eat'){z.t+=dt;p.zsp=0;p.pose=5;if(z.t>6){z.st='zombie';p.pose=3}return}
  z.think-=dt;if(z.think<0){z.think=.6;z.tgt=dP<16&&Math.abs(dy)<3?'you':nearest(gridH,p.x,p.y,p.z,28)}
  const sp=z.spd*(z.slow>0?.3:1);let tx,tz,s=sp;
  if(z.tgt==='you'){tx=P.x;tz=P.z}else if(z.tgt&&isHuman(z.tgt)){tx=z.tgt.x;tz=z.tgt.z}
  else{z.t-=dt;if(z.t<0){z.t=3+R()*5;z.wx=p.x+(R()-.5)*16;z.wz=p.z+(R()-.5)*16}tx=z.wx;tz=z.wz;s=sp*.6}
  if(z.tgt==='you'&&dP<1){p.yaw=Math.atan2(P.x-p.x,P.z-p.z)}else step(p,tx,tz,s,dt);p.zsp=z.crawl?.8:Math.min(1.2,s*.9);p.pose=z.crawl?8:3;
  if(z.tgt==='you'&&dP<(z.crawl?1.4:1.2)&&Math.abs(dy)<1.5){z.atk-=dt;if(z.atk<=0){z.atk=1.1;damage(12)}}else z.atk=Math.min(z.atk,.4);
  const h=z.tgt!=='you'&&z.tgt;if(h&&isHuman(h)&&Math.hypot(h.x-p.x,h.z-p.z)<.8&&Math.abs(h.y-p.y)<1){
   h.zs={st:'down',t:0,turn:TURN[0]+R()*(TURN[1]-TURN[0])};h.pose=6;h.zsp=0;h.zc=blood(h.c);h.yaw=p.yaw+Math.PI;z.st='eat';z.t=0;z.tgt=null;groan(p)}}
 function human(p,dt){const z=p.zs;const zz=nearest(gridZ,p.x,p.y,p.z,22);let away=null;
  if(zz)away=[p.x-zz.x,p.z-zz.z];else{const f=nearest(gridF,p.x,p.y,p.z,6);if(f&&f!==p)away=[Math.sin(f.yaw),Math.cos(f.yaw)]}
  if(away){if(!z)p.zs={st:'flee',t:0,run:0};const s=p.zs;s.st='flee';s.t=0;s.seen=!!zz;s.run=(s.run||0)+dt;const l=Math.hypot(...away)||1,sp=(p.base||1.3)*(s.run<8?1.9:1.15);
   step(p,p.x+away[0]/l*4,p.z+away[1]/l*4,sp,dt);p.zsp=Math.min(1.6,sp*.7);p.pose=0}
  else if(z){z.t+=dt;z.run=Math.max(0,(z.run||0)-dt*.5);if(z.t>2.5){z.st='cower';p.pose=7;p.zsp=0}}}

 function damage(n){if(deadT>0)return;health-=n;hurtT=.4;if(health<=0){health=0;deadT=3;banner('You died','No second chances · starting over from the car park…',9999)}}
 function respawn(){const r=api.CUR||api.HUB,d=r.doors[0],inx=-d.dx||0,inz=-d.dz||0;P.x=d.x+inx*4;P.z=d.z+inz*4;P.y=api.EYE+.1;api.settle();health=100;
  for(const q of r.P)if(isZ(q)&&Math.hypot(q.x-P.x,q.z-P.z)<10){q.x+=(q.x-P.x)*1.5;q.z+=(q.z-P.z)*1.5}}

 // ---- loot: a card for the gun at your feet; E (X on a controller, or tap the card) takes it
 let near=null,cardFor=null;
 const pct=(a,b)=>b?Math.round((a/b-1)*100):0,arrow=v=>v>0?`<span style="color:#7dff8a">▲${v}%</span>`:v<0?`<span style="color:#ff7a7a">▼${-v}%</span>`:'';
 function card(g){const c=gun(),dps=x=>x.dmg*x.pellets*x.rate,acc=x=>Math.round((1-Math.min(.2,x.spread)*4)*100);
  const el2=g.elem?`<span style="color:${ELEMENTS[g.elem].css}">${ELEMENTS[g.elem].name}</span>`:'None';
  return`<div style="font-size:17px;font-weight:800;color:${g.rar.css}">${g.name}</div><div style="font-size:12px;opacity:.8">${g.rar.name} ${GUN_TYPES[g.type].name} · ${g.makerName} — ${g.trait}</div>
  <div style="margin-top:6px;font-size:13px">Damage ${Math.round(g.dmg)}${g.pellets>1?'×'+g.pellets:''} ${arrow(pct(g.dmg*g.pellets,c.dmg*c.pellets))}<br>Fire rate ${g.rate.toFixed(1)}/s ${arrow(pct(g.rate,c.rate))} · DPS ${Math.round(dps(g))} ${arrow(pct(dps(g),dps(c)))}<br>Accuracy ${g.beam?'beam':acc(g)+'%'} · Element ${el2}${g.blast?' · Blast '+g.blast+' m':''}${g.pierce?' · Pierce '+g.pierce:''}</div>
  ${g.abil.map(a=>`<div style="font-size:12px;color:#ffd77a">◆ ${ABILITIES[a].name}: ${ABILITIES[a].tip}</div>`).join('')}
  <div style="margin-top:6px;font-size:12px;opacity:.85">${api.touchMode?'Tap here to take it':'E (or X on a controller) to take it'}${inv.length>=SLOTS?' · replaces your current gun':''}</div>`}
 function take(d){const i=drops.indexOf(d);if(i<0)return;drops.splice(i,1);
  if(inv.length<SLOTS){inv.push(d.g);ci=inv.length-1}else{const old=inv[ci];inv[ci]=d.g;drops.push({g:old,x:P.x,y:P.feet,z:P.z,t:0})}
  swapT=.25;chime();banner(`<span style="color:${d.g.rar.css}">${d.g.name}</span>`,`${d.g.rar.name} ${GUN_TYPES[d.g.type].name} · unlimited ammo`,2.2);near=null}

 // ---- every frame
 // ---- the helicopter: at the far end of the Grand Exit car park; reach it and it flies you away
 let escaped=false,reached=false,heli=null,flyT=0;
 function findHeli(){const r=api.LOADED.find(q=>q.theme==='exit');if(!r){heli=null;return}if(heli&&heli.r===r)return;const d=r.doors[0],ix=-d.dx,iz=-d.dz;
  heli={r,x:d.x+ix*122,z:d.z+iz*122,y:0,yaw:Math.atan2(ix,iz),fx:ix,fz:iz}}
 function flyStep(dt){flyT+=dt;const h=heli,t=flyT,up=Math.min(1,t/4);h.y=up*up*14+Math.max(0,t-4)*4;const fwd=Math.max(0,t-3.5)*Math.max(0,t-3.5)*1.2;
  h.x+=h.fx*fwd*dt;h.z+=h.fz*fwd*dt;P.x=h.x-h.fx*.3;P.z=h.z-h.fz*.3;P.feet=h.y+.55;P.ey=P.feet+1.15;P.y=P.ey;P.vx=P.vz=P.vy=0;
  if(t>9&&!escaped){escaped=true;chime();banner('You escaped Skylight Galleria!','Thanks for playing · press Esc for the menu',9999)}}
 let zoneLast='',gunLast='',groanT=0,countT=0,frameNo=0;const count=new Map();
 function update(dt){const t=performance.now()/1000;
  for(const r of api.LOADED)seedZone(r);
  if(deadT>0){deadT-=dt;if(deadT<=0){deadT=99;location.reload()}}
  cool-=dt;swapT=Math.max(0,swapT-dt);recoil=Math.max(0,recoil-dt*6);hurtT=Math.max(0,hurtT-dt);
  gridT-=dt;if(gridT<0){gridT=.2;rebuild()}
  if(firing&&deadT<=0&&swapT<=0){if(gun().beam)beamTick(dt);else if(cool<=0){shoot();cool=1/gun().rate}}
  frameNo++;
  for(const r of api.LOADED)for(const p of r.P){const dd=Math.hypot(p.x-P.x,p.z-P.z);if(dd>90)continue;const z=p.zs;
   if(!z){if(!p.fur&&gridZ.size)human(p,dt);continue}
   if(isZ(p)){if(dd>40){z.acc=(z.acc||0)+dt;if(((frameNo+z.k)&3)!==0)continue;zombie(p,Math.min(.2,z.acc));z.acc=0}else zombie(p,dt)}
   else if(z.st==='down'){z.t+=dt;if(z.t>z.turn)turn(p)}
   else if(z.st==='dead'){z.t+=dt;if(z.t>4)p.y-=dt*.25;if(z.t>7)z.st='gone'}
   else if(z.st==='flee'||z.st==='cower')human(p,dt)}
  // guns on the floor: the nearest one within reach shows its card
  near=null;let nd=2.2;for(let i=drops.length-1;i>=0;i--){const d=drops[i];d.t+=dt;if(d.t>180){drops.splice(i,1);continue}const dd=Math.hypot(d.x-P.x,d.z-P.z);if(dd<nd&&Math.abs(d.y-P.feet)<1.5){nd=dd;near=d}}
  if(near!==cardFor){cardFor=near;hud.card.style.display=near?'':'none';if(near)hud.card.innerHTML=card(near.g)}
  const e=keys.has('KeyE');if(e&&!prevE&&near)take(near);prevE=e;
  // health potions
  for(let i=potions.length-1;i>=0;i--){const q=potions[i];if(q.r&&!api.LOADED.includes(q.r)){potions.splice(i,1);continue}
   if(health<100&&Math.hypot(q.x-P.x,q.z-P.z)<1.2&&Math.abs(q.y-P.feet)<1.5){potions.splice(i,1);health=Math.min(100,health+POTION_HEAL);chime();banner('<span style="color:#ff5a6a">Health potion</span>',`+${POTION_HEAL} health`,1.6)}}
  // counts per zone, and the reward for clearing one: a rare-or-better gun and a full heal
  countT-=dt;if(countT<0){countT=.4;for(const r of api.LOADED){let zs=0,down=0,hum=0;for(const p of r.P){if(isZ(p))zs++;else if(p.zs&&p.zs.st==='down')down++;else if(isHuman(p))hum++}count.set(r.theme,{zs,down,hum});
}
    if(api.CUR&&api.CUR.theme==='exit'&&!reached){reached=true;chime();banner('The helicopter is waiting!','Get to the helipad at the far end of the car park',5)}}
  groanT-=dt;if(groanT<0){groanT=2+R()*3;const a=zombiesNear([P.x,0,P.z],14);if(a.length)groan(a[Math.floor(R()*a.length)])}
  // HUD
  const CUR=api.CUR,c=CUR&&count.get(CUR.theme),title=CUR?(CUR.theme==='hub'?'The Mall':(typeof TITLES!=='undefined'&&TITLES[CUR.theme])||CUR.title||CUR.theme):'';
  const line=!c?'':cleared.has(CUR.theme)?'cleared':`${c.zs} zombies${c.down?` · ${c.down} turning`:''}${c.hum?` · ${c.hum} people left`:''}`;
  const zl=`${title}${c?` · ${c.zs} zombies here`:''}<br><span style="font-size:12px;opacity:.85">${escaped?'You escaped!':reached?'Get to the helicopter':'Get through the mall to the Grand Exit'}</span>`;if(zl!==zoneLast){hud.zone.innerHTML=zl;zoneLast=zl}
  hud.hp.firstChild.style.width=health+'%';hud.hpn.textContent=Math.ceil(health)+' / 100';
  const g=gun(),gl=`<div style="font-size:18px;font-weight:800;color:${g.rar.css}">${g.name} <span style="opacity:.8;color:#fff">∞</span></div><div style="font-size:12px;opacity:.85">${g.rar.name} ${GUN_TYPES[g.type].name} · ${g.makerName}${g.elem?' · '+ELEMENTS[g.elem].name:''}${g.abil.length?' · '+g.abil.map(a=>ABILITIES[a].name).join(', '):''}</div>
   <div style="margin-top:4px">${inv.map((x,i)=>`<span style="display:inline-block;min-width:18px;margin-left:3px;padding:1px 4px;border-radius:4px;font-size:11px;background:${i===ci?x.rar.css:'rgba(0,0,0,.5)'};color:${i===ci?'#111':x.rar.css};border:1px solid ${x.rar.css}">${i+1}</span>`).join('')}</div>`;
  if(gl!==gunLast){hud.gun.innerHTML=gl;gunLast=gl}
  hud.red.style.opacity=hurtT>0?1:0;if(bannerT>0){bannerT-=dt;if(bannerT<=0)hud.banner.style.opacity=0}
  for(const e2 of fx){e2.t+=dt;if((e2.k==='gib'||e2.k==='puff')&&e2.v){if(e2.k==='gib')e2.v[1]-=9.8*dt;else e2.v=e2.v.map(v=>v*(1-dt*2.5));for(let j=0;j<3;j++)e2.a[j]+=e2.v[j]*dt;
    if(e2.k==='gib'){e2.yaw+=e2.spin*dt;e2.pitch+=e2.spin*.7*dt;if(e2.a[1]<e2.ground+e2.size[1]*.3){e2.a[1]=e2.ground+e2.size[1]*.3;e2.v=e2.v.map(v=>v*.4);e2.v[1]=0;e2.spin*=.5;e2.pitch=1.5708}}}}
  for(let i=fx.length-1;i>=0;i--)if(fx[i].t>fx[i].life)fx.splice(i,1);
  findHeli();if(heli&&!flyT&&deadT<=0&&Math.hypot(heli.x-P.x,heli.z-P.z)<4&&Math.abs(P.feet-heli.y)<2){flyT=.001;firing=false;banner('Get in!','',2)}
  stepNums(dt);write(t)}

 // ---- parts to draw: your gun (metal finishes), beams, flames, blasts, health bars, dropped guns, potions
 function write(t){nF=0;const part=(x,y,z,yaw,sx,sy,sz,col,pitch,em,pat=0)=>{if(nF>=1600)return;fData.set([x,y,z,yaw,sx,sy,sz,8,col[0],col[1],col[2],0,pitch,0,em,pat],nF*16);nF++};
  const DARK=[.22,.22,.25];
  const drawGun=(g,at,yaw,pitch,sc)=>{for(const[f,u,r,w,h,l,m]of g.parts){const p=at(f*sc,u*sc,r*sc);
    if(m==='b')part(...p,yaw,w*sc,h*sc,l*sc,g.tint,pitch,0,g.skin);else if(m==='d')part(...p,yaw,w*sc,h*sc,l*sc,DARK,pitch,0,41);
    else part(...p,yaw,w*sc,h*sc,l*sc,m==='g'?g.col:g.ecol,pitch,m==='g'?1.6:2.2)}};
  if(deadT<=0){const o=eye(),{f,r,u}=dirs(),k=.46-recoil*.06-swapT*.6,dn=.2+swapT*.4,p0=[o[0]+r[0]*.24-u[0]*dn+f[0]*k,o[1]+r[1]*.24-u[1]*dn+f[1]*k,o[2]+r[2]*.24-u[2]*dn+f[2]*k];
   drawGun(gun(),(df,du,dr)=>[p0[0]+f[0]*df+u[0]*du+r[0]*dr,p0[1]+f[1]*df+u[1]*du+r[1]*dr,p0[2]+f[2]*df+u[2]*du+r[2]*dr],P.yaw,P.pitch+recoil*.08,1)}
  for(const e of fx){const a=1-e.t/e.life;
   if(e.k==='gib'){part(...e.a,e.yaw,...e.size,e.col,e.pitch,0);continue}
   if(e.k==='puff'){const s=e.s0+(e.s1-e.s0)*(e.t/e.life);part(...e.a,e.t*7,s,s,s,e.col,e.t*5,3.5*a);continue}
   if(e.k==='boom'){const s=e.rad*(.3+e.t/e.life*.9);part(...e.a,0,s,s,s,[1,.55,.15],0,5*a);continue}
   if(e.k==='beam'){const[x0,y0,z0]=e.a,[x1,y1,z1]=e.b,dx=x1-x0,dy=y1-y0,dz=z1-z0,l=Math.hypot(dx,dy,dz);if(l<.01)continue;const w=e.w||.012;
    part((x0+x1)/2,(y0+y1)/2,(z0+z1)/2,Math.atan2(-dx,-dz),w,w,l,e.col,Math.asin(dy/l),4*a);continue}
   part(...e.a,t*20,e.k==='flash'?.1:.07,e.k==='flash'?.1:.07,e.k==='flash'?.1:.07,e.col,t*13,(e.k==='flash'?8:3)*a)}
  // health bars over zombies you've hurt
  const {r:cr}=dirs();let bars=0;for(const r of api.LOADED)for(const p of r.P){if(bars>50)break;if(!isZ(p)||p.zs.hp>=100)continue;const d=Math.hypot(p.x-P.x,p.z-P.z);if(d>30)continue;bars++;
   const fr=Math.max(0,p.zs.hp/100),y=p.y+(p.zs.crawl?.75:2.05*p.s[1]),off=-(1-fr)*.25;
   part(p.x,y,p.z,P.yaw,.52,.07,.01,[.05,.05,.05],0,0);part(p.x+cr[0]*off,y,p.z+cr[2]*off,P.yaw,.5*fr,.05,.02,fr>.5?[.25,1,.3]:fr>.25?[1,.8,.2]:[1,.2,.15],0,2)}
  // guns on the floor turn slowly; rare and better ones send up a beam of their colour
  for(const d of drops){const a=t*1.1+d.x,fw=[-Math.sin(a),0,-Math.cos(a)],rt=[Math.cos(a),0,-Math.sin(a)],y=d.y+.55+Math.sin(t*2+d.z)*.06;
   drawGun(d.g,(df,du,dr)=>[d.x+fw[0]*df+rt[0]*dr,y+du,d.z+fw[2]*df+rt[2]*dr],a,0,1.6);
   for(let k=0;k<8;k++){const b=k/8*6.283;part(d.x+Math.cos(b)*.45,d.y+.03,d.z+Math.sin(b)*.45,b,.1,.02,.04,d.g.col,0,2.5)}
   if(d.g.rarity>=2)part(d.x,d.y+1.6,d.z,0,.03,3.2,.03,d.g.col,0,1.4)}
  // health potions: a glowing red flask
  for(const q of potions){if(q.r&&!api.LOADED.includes(q.r))continue;const y=q.y+.35+Math.sin(t*2.5+q.x)*.05;
   part(q.x,y,q.z,t,.16,.2,.16,[1,.12,.15],0,2.4);part(q.x,y+.15,q.z,t,.06,.1,.06,[.8,.9,1],0,.5);part(q.x,y+.22,q.z,t,.07,.04,.07,[.45,.3,.15],0,0);
   for(let k=0;k<6;k++){const b=k/6*6.283+t;part(q.x+Math.cos(b)*.3,q.y+.03,q.z+Math.sin(b)*.3,b,.07,.02,.03,[1,.2,.25],0,2)}}
  // the helicopter and its helipad
  if(heli){const h=heli,fw=[h.fx,0,h.fz],rt=[h.fz,0,-h.fx],at=(f,u,r)=>[h.x+fw[0]*f+rt[0]*r,h.y+u,h.z+fw[2]*f+rt[2]*r],yaw=Math.atan2(-fw[0],-fw[2]),BODY=[.15,.3,.2],DK=[.05,.05,.06];
   if(!flyT||h.y<.5)for(let k=0;k<24;k++){const b=k/24*6.283;part(heli.x+Math.cos(b)*6,.03,heli.z+Math.sin(b)*6,b,.9,.03,.15,[1,.85,.2],0,1.2)}
   part(...at(0,1.3,0),yaw,2.2,1.9,4.2,BODY,0,0,43);part(...at(1.7,1.45,0),yaw,1.9,1.3,1.2,[.12,.18,.25],0,.3);part(...at(-3.8,1.75,0),yaw,.35,.4,3.8,BODY,0,0,43);
   part(...at(-5.6,2.4,0),yaw,.12,1.2,.7,BODY,0,0,43);for(const s of[-1,1]){part(...at(0,.1,s*1.05),yaw,.1,.1,4,DK,0,0);part(...at(.9,.45,s*1.05),yaw,.08,.7,.08,DK,0,0);part(...at(-.9,.45,s*1.05),yaw,.08,.7,.08,DK,0,0)}
   part(...at(0,2.35,0),yaw,.25,.35,.25,DK,0,0);const spin=t*(flyT?30:6);for(const k of[0,1.5708])part(...at(0,2.55,0),spin+k,.25,.04,11,DK,0,0);
   part(...at(-5.6,2.6,.2),yaw,.05,1.4,.12,DK,spin,0);part(...at(-5.9,1.9,0),yaw,.12,.12,.12,[1,.1,.1],0,4);part(...at(2.2,.9,0),yaw,.2,.15,.1,[1,1,.9],0,5)}
  fxB.set(fData.subarray(0,nF*16))}

 // for automated tests: nearest live zombie and counts
 const debug=()=>{const a=zombiesNear([P.x,0,P.z],500).map(p=>({x:p.x,y:p.y,z:p.z,hp:p.zs.hp,st:p.zs.st,d:Math.hypot(p.x-P.x,p.z-P.z)})).sort((p,q)=>p.d-q.d);
  let limbs=0,crawl=0;for(const r of api.LOADED)for(const p of r.P){if(p.limb)limbs++;if(p.zs&&p.zs.crawl&&isZ(p))crawl++}
  return{alive:a.length,limbs,crawl,near:a[0],health,gun:gun().name,guns:inv.length,drops:drops.length,potions:potions.length,shots,hits:hitsN,nums:nums.length}};
 // for automated tests: give yourself a gun of a type and rarity (?zgun=flamer etc. does it at the start)
 const give=(type,rarity=2)=>{inv.push(makeGun(R,{type,rarity}));ci=inv.length-1};if(QSZ.get('zgun'))give(QSZ.get('zgun'),+(QSZ.get('zrar')||2));
 showHud(true);banner('Zombie Mode','Fight your way through the mall to the Grand Exit',4);
 return{flying:()=>flyT>0,flyStep,debug,give,update,fxB,fire:v=>{firing=v},swap,select,setHud:showHud,
  // one speed: quick on your feet, no need to hold anything to run
  walk:5,run:5,jump:7.4}}
