// waterpark
DISTRICTS.waterpark=function(K){
const{model,trunk,MODELS,B,box,mark,part,stick,crown,tree,shrubs,palm,jet,bird,light,frame,addName,shop,rail,esc,vault,planter,fountain,bench,kiosk,seat,fpush,rack,mannequin,glowCase,counter,hsl,rnd,pick,chance,C,GL,STEEL,W8,BARK,chairC,xp,xd,idF,DW,DD,DH,MID,nn,nl,npath,ring,join,stand,ride,ctx,T,shell,lamp,bulbs,umbrella,rock,conifer,bigTree,flowers,bed,people,ESC}=K;
shell({title:'Lagoon Splash',floorPat:24,floor:hsl(40,.2,.85),h:2.6,wallCol:hsl(190,.5,.45),wallPat:0,titleCol:hsl(190,.95,.6),titleY:4.4,signY:3.6});
 const pool=(x0,z0,x1,z1)=>{B(x0,-.02,z0,x1,.06,z1,hsl(195,.8,.45),{e:.55,pat:8,solid:false});B(x0-.4,0,z0-.4,x1+.4,.25,z0,C.white);B(x0-.4,0,z1,x1+.4,.25,z1+.4,C.white);B(x0-.4,0,z0,x0,.25,z1,C.white);B(x1,0,z0,x1+.4,.25,z1,C.white)};
 // wave pool, with swimmers
 pool(-52,10,-8,60);for(let k=0;k<26;k++)stand(rnd(-50,-10),rnd(12,58),rnd(0,6),-.95);
 for(let k=0;k<20;k++){const x=rnd(-50,-10),z=rnd(12,58);part(x,.12,z,.9,.18,.9,hsl(pick([0,50,200,300]),.85,.55),0,0,0,0)}
 // splash pad full of jets
 pool(8,10,52,60);for(let i=0;i<6;i++)for(let j=0;j<6;j++)jet(14+i*6.5,.1,15+j*8,rnd(-.3,.3),rnd(2.5,5),rnd(-.3,.3),.05,18,.2);
 for(let k=0;k<16;k++)stand(rnd(10,50),rnd(12,58),rnd(0,6),-.5);
 // slide tower and twisting slides into a splash pool
 {const tx=-30,tz=105;for(let y=0;y<12;y+=.45){const a=y*.55;B(tx+Math.cos(a)*2.2-1,y,tz+Math.sin(a)*2.2-1,tx+Math.cos(a)*2.2+1,y+.45,tz+Math.sin(a)*2.2+1,hsl(45,.8,.55))}
  B(tx-3,12,tz-3,tx+3,12.4,tz+3,hsl(200,.5,.5));for(let k=0;k<4;k++)B(tx-3+k*2,12.4,tz-3,tx-2.9+k*2,13.4,tz+3,C.white);
  for(const[hue,dir]of[[0,1],[200,-1],[120,1]]){let px=tx+dir*3,py=12,pz=tz;for(let k=0;k<48;k++){const a=k*.22*dir,nx=tx+dir*3+Math.sin(a)*6+k*.25*dir,ny=12-k*.24,nz=tz-8+Math.cos(a)*6-k*.5;stick(px,py,pz,nx,ny,nz,.9,hsl(hue,.85,.5));px=nx;py=ny;pz=nz}}
  pool(tx-14,tz-40,tx+14,tz-24)}
 // lazy river around a palm island
 {const cx=30,cz=105,pts=[];for(let k=0;k<48;k++){const a=k/48*6.283,x=cx+Math.cos(a)*18,z=cz+Math.sin(a)*24;B(x-2.4,-.02,z-2.4,x+2.4,.06,z+2.4,hsl(195,.8,.45),{e:.55,pat:8,solid:false})}
  for(let k=0;k<14;k++)ride('tube',[cx,.12,cz,0],[18,0,24,7],[...hsl(k*25,.85,.55),k/14],[.06,1,0,0]);
  for(let k=0;k<6;k++)palm(cx+rnd(-8,8),cz+rnd(-12,12),rnd(7,11));shrubs(cx,0,cz,9,14,140)}
 // loungers, umbrellas, lifeguard chairs, palms along the edges
 for(let k=0;k<26;k++){const x=pick([-1,1])*rnd(6,55),z=pick([5,64,74])+rnd(-1,1);if(Math.abs(x)<5)continue;B(x-.35,0,z-1,x+.35,.35,z+1,C.white,{solid:false});if(k%2)umbrella(x+.9,z,hsl(pick([0,45,200]),.8,.5));if(chance(.4))seat(x,z,0,-.1)}
 for(let k=0;k<12;k++)palm(pick([-1,1])*rnd(54,57),rnd(5,135),rnd(7,10));
 for(const[x,z]of[[-30,62],[30,62]]){B(x-.6,0,z-.6,x+.6,2.4,z+.6,C.white);B(x-.8,2.4,z-.8,x+.8,2.6,z+.8,hsl(0,.8,.5));stand(x,z,Math.PI,2.6)}
 for(let k=0;k<12;k++)bird(rnd(-40,40),rnd(20,30),rnd(20,120),rnd(6,14),2,(chance(.5)?1:-1)*rnd(.15,.25),[.9,.9,.9]);
 people(-55,MID-3,55,MID+3,24);people(-3,5,3,135,16);
 return{title:'Lagoon Splash',fog:.0015};
};
