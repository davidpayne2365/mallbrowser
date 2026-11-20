// ice rink under glass
DISTRICTS.rink=function(K){
const{B,box,mark,part,stick,crown,tree,shrubs,palm,jet,bird,light,frame,addName,shop,rail,esc,vault,planter,fountain,bench,kiosk,seat,fpush,rack,mannequin,glowCase,counter,hsl,rnd,pick,chance,C,GL,STEEL,W8,BARK,chairC,xp,xd,idF,DW,DD,DH,MID,nn,nl,npath,ring,join,stand,ride,ctx,T,shell,lamp,bulbs,umbrella,rock,conifer,bigTree,flowers,bed,people,ESC}=K;
shell({title:'Glacier Ice Rink',floorPat:0,floor:hsl(220,.1,.3),roof:'glass',h:8,rise:12,glassWalls:1,wallCol:hsl(210,.2,.3),titleCol:hsl(195,.9,.65)});
 const cx=0,cz=40,rx=24,rz=30;
 B(-rx,0,cz-rz,rx,.04,cz+rz,hsl(200,.15,.95),{pat:13,solid:false});
 B(-rx+2,.04,cz-.18,rx-2,.05,cz+.18,hsl(0,.85,.45),{solid:false});for(const s of[-1,1])B(-rx+2,.04,cz+s*9-.18,rx-2,.05,cz+s*9+.18,hsl(220,.85,.45),{solid:false});
 for(let k=0;k<40;k++){const a=k/40*6.283;B(Math.cos(a)*4.5-.12,.04,cz+Math.sin(a)*4.5-.12,Math.cos(a)*4.5+.12,.05,cz+Math.sin(a)*4.5+.12,hsl(220,.85,.45),{solid:false})}
 for(let k=0;k<80;k++){const a0=k/80*6.283,a1=(k+1)/80*6.283,x0=cx+Math.cos(a0)*rx,z0=cz+Math.sin(a0)*rz,x1=cx+Math.cos(a1)*rx,z1=cz+Math.sin(a1)*rz;
  if(Math.abs(x0)<3.5)continue;const mx=(x0+x1)/2,mz=(z0+z1)/2;part(mx,.55,mz,.18,1.1,Math.hypot(x1-x0,z1-z0)+.05,k%10<5?C.white:hsl(210,.6,.5),Math.atan2(x1-x0,z1-z0),0,0,0);mark(mx-.25,0,mz-.25,mx+.25,1.1,mz+.25)}
 const sk=ring(cx,cz,rx-4,rz-5,26);const sk2=ring(cx,cz,rx-10,rz-11,18);
 for(let k=0;k<6;k++)bulbs(-rx,cz-rz+k*12,rx,cz-rz+k*12,9,24,1);
 // the tall decorated tree and a cafe
 {const tx=0,tz=105;conifer(tx-12,tz,16);conifer(tx+12,tz,16);for(let k=0;k<120;k++){const a=rnd(0,6.28),y=rnd(3,14),r=(16*.32*(1-(y-4)/12)+.3)*.9;part(tx-12+Math.sin(a)*r,y,tz+Math.cos(a)*r,.18,.18,.18,hsl(pick([0,45,200,120]),.9,.6),0,0,0,0)}
  for(let k=0;k<12;k++){const x=rnd(-50,-12),z=rnd(90,130);B(x-.5,.72,z-.5,x+.5,.76,z+.5,C.white,{solid:false});umbrella(x,z,hsl(200,.6,.45));seat(x-.9,z,Math.PI/2);if(chance(.5))seat(x+.9,z,-Math.PI/2)}
  for(let i=0;i<6;i++)B(20+i*0,i*.3,95+i*1.2,52,i*.3+.3,96.2+i*1.2,hsl(210,.3,.5)); // bleachers
  for(let k=0;k<30;k++)seat(rnd(22,50),95.6+Math.floor(rnd(0,6))*1.2,Math.PI,0)}
 for(let k=0;k<8;k++)lamp(pick([-1,1])*4.5,rnd(80,135),4,C.warm,5);
 for(let k=0;k<8;k++)bird(rnd(-30,30),rnd(22,30),rnd(20,120),rnd(6,14),2,(chance(.5)?1:-1)*rnd(.15,.25));
 for(let k=0;k<25;k++)part(rnd(-55,55),rnd(8,20),rnd(5,135),.4,.4,.05,C.white,rnd(0,6),rnd(0,6),0,0); // hanging snowflakes
 people(-55,MID-3,55,MID+3,10);
 return{title:'Glacier Ice Rink',skaters:[sk,sk2],fog:.003};
};
