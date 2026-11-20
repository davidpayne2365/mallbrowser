// open-air street market: lanes of stalls between brick buildings, cafes, a fountain square and string lights
DISTRICTS.market=function(K){
const{slide,rockB,hedge,grassPatch,log,leafTint,model,trunk,MODELS,B,box,mark,part,stick,crown,tree,shrubs,palm,jet,bird,light,frame,addName,shop,rail,esc,vault,planter,fountain,bench,kiosk,seat,fpush,rack,mannequin,glowCase,counter,hsl,rnd,pick,chance,C,GL,STEEL,W8,BARK,chairC,xp,xd,idF,DW,DD,DH,MID,nn,nl,npath,ring,join,stand,ride,ctx,T,shell,lamp,bulbs,umbrella,rock,conifer,bigTree,flowers,bed,people,ESC}=K;
shell({title:'Old Town Market',floorPat:22,floor:hsl(30,.1,.6),h:14,wallCol:hsl(15,.4,.5),wallPat:25,titleCol:hsl(30,.9,.6)});
// building facades: lit windows, balconies with plants, awnings over street-level shops
for(const[x0,z0,x1,z1,face]of[[-DW,0,DW,.4,0],[-DW,DD-.4,DW,DD,1],[-DW,0,-DW+.4,DD,2],[DW-.4,0,DW,DD,3]]){
 const along=face<2,len=along?x1-x0:z1-z0,sgn=face===0||face===2?1:-1;
 for(let s=4;s<len-2;s+=4){const u=(along?x0:z0)+s;if(Math.abs(u-(along?0:MID))<5)continue;
  const P=(off,y)=>along?[u,y,face?DD-.4-off:.4+off]:[face===2?-DW+.4+off:DW-.4-off,y,u];
  for(let fl=1;fl<3;fl++){const y=5+fl*3.4,lit=chance(.55),col=lit?hsl(40,.8,.7):hsl(220,.2,.15),[wx,wy,wz]=P(.03,y+.9);
   box(wx,wy,wz,along?1.4:.06,1.8,along?.06:1.4,col,{e:lit?1.6:0,solid:false});
   if(chance(.4)){const[bx,by,bz]=P(.5,y-.1);box(bx,by,bz,along?1.8:1,.12,along?1:1.8,hsl(20,.2,.35),{solid:false});const[px,py,pz]=P(.85,y+.3);box(px,py,pz,along?1.8:.06,.6,along?.06:1.8,C.dark,{solid:false});
    model('card_shrub',bx,by+.06,bz,rnd(0,6),.6,{tint:leafTint(),sway:.3})}}
  const[ax,ay,az]=P(.8,3.6);box(ax,ay,az,along?3.2:1.6,.12,along?1.6:3.2,hsl(pick([0,120,200,30,280]),.65,.45),{solid:false});
  const[dx,dy,dz]=P(.04,1.6);box(dx,dy,dz,along?2.4:.06,3.2,along?.06:2.4,hsl(30,.4,.25),{solid:false})}}
// market lanes: rows of stalls back to back, leaving 4 m lanes between them
const goodsFor=['fruit','flowers','bread','crafts','fish','cheese'];
const stall=(x,z,nx)=>{const F=frame(x,z,0,1,nx,0),hue=pick([0,30,120,200,45,330]),goods=pick(goodsFor),at=(u,v)=>F.w(u,v);
 F(-2.3,0,0,2.3,.9,1.9,C.wood,{pat:23});for(const u of[-2.3,2.3])for(const v of[0,1.9])F(u-.05,.9,v-.05,u+.05,2.6,v+.05,C.wood);
 for(let k=0;k<8;k++)F(-2.5+k*.625,2.6,-.5,-1.875+k*.625,2.75,2.4,k%2?C.white:hsl(hue,.75,.5),{solid:false});
 const put=(name,s,o)=>{const[gx,gz]=at(rnd(-2,2),rnd(.2,1.6));model(name,gx,.9,gz,rnd(0,6.28),s,o)};
 if(goods==='bread')for(let k=0;k<14;k++)put('croissant',1.2);
 else if(goods==='fruit'){for(let k=0;k<18;k++)put('lemon',1.4,{tint:pick([[1,1,1],[1,.5,.3],[.6,1,.4]])});const[cx,cz]=at(-2.9,1);model('wooden_crate_01',cx,0,cz,rnd(-.3,.3),.8,{solid:true})}
 else if(goods==='flowers')for(let k=0;k<6;k++){const[fx,fz]=at(rnd(-1.8,1.8),rnd(.4,1.4));model('planter_pot_clay',fx,.9,fz,0,.5);model('card_shrub',fx,1.05,fz,rnd(0,6),.6,{tint:hsl(pick([340,45,280,0]),.8,.6).map(v=>v*3)})}
 else for(let k=0;k<22;k++){const[gx,gz]=at(rnd(-2.1,2.1),rnd(.15,1.75)),sz=rnd(.1,.2);B(gx-sz,.9,gz-sz,gx+sz,.9+sz*1.4,gz+sz,goods==='fish'?hsl(200,.1,rnd(.6,.8)):goods==='cheese'?hsl(45,.7,rnd(.5,.7)):hsl(rnd(0,360),.5,.5),{solid:false})}
 if(chance(.6)){const[bx,bz]=at(2.9,rnd(.4,1.4));model(chance(.5)?'Barrel_01':'barrel_03',bx,0,bz,rnd(0,6.28),1,{solid:true})}
 const[vx,vz]=at(0,2.5);stand(vx,vz,Math.atan2(-nx,0));const[lx,lz]=at(0,1);light(lx,2.3,lz,C.warm,3,6)};
for(const sx of[-1,1])for(let row=0;row<3;row++){const x=sx*(10+row*15);for(let z=8;z<DD-6;z+=5.4){if(Math.abs(z-MID)<9)continue;stall(x-2.4,z,1);stall(x+2.4,z,-1)}
 npath(Array.from({length:30},(_,k)=>[x+sx*7.5,4+k*4.5]).filter(([,z])=>Math.abs(z-MID)>4||true),0);join(x+sx*7.5,MID,0,MID)}
// fountain square with trees, a busker, cafe seating
fountain(0,MID);for(const[x,z]of[[-6,MID-6],[6,MID-6],[-6,MID+6],[6,MID+6]])planter(x,z);
stand(4,MID+3.5,Math.PI);model('Ukulele_01',4.25,1.05,MID+3.25,-.8,1.2,{pitch:-.3});model('boombox',3.3,0,MID+3.2,.4,1);
for(const sz of[-1,1])for(let k=0;k<5;k++){const x=-14+k*7,z=MID+sz*6.4;if(Math.abs(x)<9)continue;model('modern_coffee_table_01',x,0,z,rnd(0,6),1,{solid:true});umbrella(x,z,hsl(rnd(0,360),.7,.45));
 for(const a of[0,2.1,4.2]){const cx=x+Math.cos(a)*1,cz=z+Math.sin(a)*1;model('bar_chair_round_01',cx,0,cz,a+Math.PI/2,.9);if(chance(.6))seat(cx,cz,Math.atan2(x-cx,z-cz),.15)}}
for(let z=10;z<DD;z+=12)bulbs(-DW+.5,z,DW-.5,z+6,10,40,1.5);
for(let z=6;z<DD;z+=14)for(const sx of[-1,1])lamp(sx*4.5,z,4.5,C.warm,5);
for(let k=0;k<20;k++)bird(rnd(-30,30),rnd(1.2,3),rnd(20,120),rnd(2,6),.5,(chance(.5)?1:-1)*rnd(.4,.8),hsl(0,0,rnd(.25,.45)));
people(-50,MID-3,50,MID+3,26);people(-3,5,3,135,24);for(const sx of[-1,1])for(let row=0;row<3;row++)people(sx*(10+row*15)+sx*6,6,sx*(10+row*15)+sx*9,134,8);
return{title:'Old Town Market',fog:.0025};
};
