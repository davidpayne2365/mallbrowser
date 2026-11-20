// cinema: lobby and two auditoriums
DISTRICTS.cinema=function(K){
const{B,box,mark,part,stick,crown,tree,shrubs,palm,jet,bird,light,frame,addName,shop,rail,esc,vault,planter,fountain,bench,kiosk,seat,fpush,rack,mannequin,glowCase,counter,hsl,rnd,pick,chance,C,GL,STEEL,W8,BARK,chairC,xp,xd,idF,DW,DD,DH,MID,nn,nl,npath,ring,join,stand,ride,ctx,T,shell,lamp,bulbs,umbrella,rock,conifer,bigTree,flowers,bed,people,ESC}=K;
const RED=hsl(350,.6,.25);
 shell({title:'Paramount Lights',floorPat:3,floor:hsl(350,.6,.25),roof:'flat',h:10,wallCol:hsl(350,.3,.12),wallPat:0,ceil:hsl(240,.2,.05),panels:false,titleCol:hsl(45,.95,.6)});
 for(let k=0;k<200;k++){const x=rnd(-58,58),z=rnd(2,138);B(x-.03,9.9,z-.03,x+.03,9.95,z+.03,hsl(45,.4,.9),{e:6,solid:false})}
 for(let x=-56;x<=56;x+=8)for(let z=6;z<DD;z+=14)light(x,8.5,z,hsl(30,.7,.7),3.2,12);
 // concession stand and ticket booths
 B(-14,0,22,-4,1.1,25,RED);B(-14.2,1.1,21.8,-3.8,1.2,25.2,C.white,{s:.7});for(let k=0;k<4;k++)box(-12.5+k*2.6,3,26.6,2.2,1.2,.1,hsl(rnd(0,360),.7,.55),{e:2,solid:false});
 B(-13.5,1.2,23,-12,2.6,24.2,hsl(45,.9,.65),{e:2.5,glass:1});for(let k=0;k<3;k++)stand(-11+k*3,26,Math.PI);
 for(let k=0;k<3;k++){const x=6+k*5;B(x-1.6,0,18,x+1.6,2.6,20,hsl(350,.5,.3));B(x-1.5,1.2,17.95,x+1.5,2.2,18,C.glass,{glass:1});stand(x,19.2,Math.PI)}
 // movie posters in light boxes along the lobby walls
 const films=['The Last Orbit','Midnight Carousel','Paper Lanterns','Velvet Storm','Neon Harbor','Echoes of June','The Glass Garden','Starfall Express','Little Giants','Tidebreak','The Quiet Map','Ember Road'];
 for(const sx of[-1,1])for(let k=0;k<5;k++){const z=8+k*11;box(sx*(DW-.5),3.4,z,.15,3.6,2.6,hsl(rnd(0,360),.7,.55),{e:1.8,pat:5,solid:false});box(sx*(DW-.6),5.7,z,.15,.6,3,hsl(45,.9,.6),{e:2.5,sign:T(films[(k+(sx>0?5:0))%12]),face:sx>0?3:2,solid:false})}
 for(let x=-50;x<=50;x+=2)B(x-.15,7.6,MID-3.5,x+.15,7.9,MID-3.4,hsl(45,.95,.6),{e:x%4?4:1,pat:5,solid:false});
 // two auditoriums
 for(const sx of[-1,1]){const xi=sx*8,xo=sx*58,z0=80,z1=136,mx=(xi+xo)/2;
  B(Math.min(xi,xi+sx*.4),0,z0,Math.max(xi,xi+sx*.4),10,z1-12,hsl(350,.3,.12));B(Math.min(xi,xi+sx*.4),0,z1-6,Math.max(xi,xi+sx*.4),10,z1,hsl(350,.3,.12));B(Math.min(xi,xo),0,z0,Math.max(xi,xo),10,z0+.4,hsl(350,.3,.12));
  box(xi+sx*.3,5.6,z1-9,.15,.8,4,hsl(45,.95,.6),{e:3,sign:T(films[sx>0?2:7]),face:sx>0?2:3,solid:false});
  box(mx,4.6,z1-.6,Math.abs(xo-xi)*.8,6.5,.1,hsl(200,.5,.6),{e:2.2,pat:5,solid:false});light(mx,4,z1-6,hsl(210,.6,.7),6,20);
  for(let r=0;r<9;r++){const z=z1-12-r*4.2,y=r*.42;B(Math.min(xi,xo)+sx*.4,0,z-2.1,Math.max(xi,xo)-sx*.4,y,z+2.1,RED);
   for(let x=Math.min(xi,xo)+3;x<Math.max(xi,xo)-3;x+=.9){if(Math.abs(x-mx)<1.2)continue;B(x-.36,y,z-.3,x+.36,y+.45,z+.3,hsl(350,.7,.35),{solid:false});B(x-.36,y+.45,z+.25,x+.36,y+1,z+.35,hsl(350,.7,.35),{solid:false});if(chance(.45))seat(x,z,0,y)}}
  npath([[0,z1-9],[xi+sx*2,z1-9],[mx,z1-9],[mx,z0+4]],0)}
 for(let z=10;z<62;z+=8)for(const sx of[-1,1]){const x=sx*6;box(x,1.6,z,.12,2.4,1.6,hsl(rnd(0,360),.7,.55),{e:2,pat:5});box(x,3.05,z,.14,.4,1.8,hsl(45,.95,.6),{e:2.5,sign:T(films[Math.floor(rnd(0,12))]),face:sx>0?3:2,solid:false});B(x-.3,0,z-.9,x+.3,.2,z+.9,C.dark)}
 for(const sx of[-1,1])for(const z of[30,50]){const x=sx*12;B(x-1.6,0,z-1,x+1.6,1.1,z+1,RED);B(x-1.2,1.1,z-.6,x+1.2,2.3,z+.6,hsl(45,.9,.65),{e:2,glass:1});light(x,2.6,z,hsl(40,.9,.7),4,7);stand(x,z+1.6,Math.PI)}
 for(let z=4;z<64;z+=3)B(-2.2,0,z,2.2,.02,z+1.5,hsl(45,.8,.5),{e:.4,solid:false});
 people(-50,MID-3,50,MID+3,26);people(-3,5,3,75,16);
 return{title:'Paramount Lights',night:1,fog:.002};
};
