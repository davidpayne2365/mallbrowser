// amusement park at night
DISTRICTS.amusement=function(K){
const{B,box,mark,part,stick,crown,tree,shrubs,palm,jet,bird,light,frame,addName,shop,rail,esc,vault,planter,fountain,bench,kiosk,seat,fpush,rack,mannequin,glowCase,counter,hsl,rnd,pick,chance,C,GL,STEEL,W8,BARK,chairC,xp,xd,idF,DW,DD,DH,MID,nn,nl,npath,ring,join,stand,ride,ctx,T,shell,lamp,bulbs,umbrella,rock,conifer,bigTree,flowers,bed,people,ESC}=K;
shell({title:'Starlight Fair',floorPat:22,floor:hsl(30,.1,.5),h:3,wallCol:hsl(0,.5,.3),wallPat:0,titleCol:hsl(330,.9,.6),titleY:5,signY:4});
 for(const sx of[-1,1])for(let z=4;z<DD;z+=8)if(Math.abs(z-MID)>5){const X=sx*(DW-.3);B(X-.1,3,z-.1,X+.1,5,z+.1,C.steel);B(X-.25,5,z-.25,X+.25,5.4,z+.25,hsl(z*7,.9,.6),{e:4,solid:false})}
 for(let z=6;z<DD;z+=10)if(Math.abs(z-MID)>6){bulbs(-3.4,z,3.4,z,5.4,6,.5);lamp(-4,z,4.5,hsl(45,.9,.6),5);lamp(4,z,4.5,hsl(45,.9,.6),5)}
 // ferris wheel
 {const cx=-32,cz=34,hub=17,Rw=14;for(const s of[-1,1]){stick(cx+s*1.5,0,cz-6,cx+s*.8,hub,cz,.35,C.steel);stick(cx+s*1.5,0,cz+6,cx+s*.8,hub,cz,.35,C.steel)}
  ride('ferris',[cx,hub,cz,Math.PI/2],[1,1,1,6],[1,.9,.95,0],[.08,0,0,0]);
  for(let k=0;k<16;k++)ride('gondola',[cx,hub,cz,Math.PI/2],[Rw,0,Rw,7],[...hsl(k*22.5,.8,.55),k/16],[.08,0,0,0]);
  B(cx-4,0,cz-8,cx+4,.4,cz-6,hsl(0,.6,.4));npath([[cx,cz-9],[-3,cz-9]]);light(cx,hub,cz,hsl(300,.9,.6),12,20)}
 // carousel
 {const cx=32,cz=34;B(cx-7.5,0,cz-7.5,cx+7.5,.3,cz+7.5,hsl(45,.6,.4),{solid:false});ride('carousel',[cx,0,cz,0],[1,1,1,6],[1,.85,.9,0],[.35,1,0,0]);
  for(let k=0;k<20;k++)ride('horse',[cx,.9,cz,0],[k%2?4.2:5.6,.35,k%2?4.2:5.6,7],[...hsl(k*37,.5,.8),k/20],[.35,1,6,0]);
  light(cx,6,cz,hsl(45,.9,.6),14,16);ring(cx,cz,10,10,14);join(3,cz,cx-10,cz)}
 // roller coaster
 {const cx=-30,cz=104,rx=22,rz=26;for(let k=0;k<96;k++){const a0=k/96*6.283,a1=(k+1)/96*6.283,y=a=>7+4*Math.sin(3*a);
   const[x0,z0,x1,z1]=[cx+Math.cos(a0)*rx,cz+Math.sin(a0)*rz,cx+Math.cos(a1)*rx,cz+Math.sin(a1)*rz];
   for(const o of[-.6,.6]){const nx=Math.cos(a0)*o,nz=Math.sin(a0)*o;stick(x0+nx,y(a0),z0+nz,x1+nx,y(a1),z1+nz,.12,hsl(0,.8,.5))}
   if(k%4===0)stick(x0,0,z0,x0,y(a0)-.2,z0,.25,C.steel)}
  for(let t=0;t<2;t++)for(let k=0;k<6;k++)ride('car',[cx,7.35,cz,0],[rx,4,rz,7],[...hsl(200+t*120,.8,.5),t*.5+k*.012],[.45,1,3,0])}
 // drop tower
 {const cx=32,cz=104;B(cx-.8,0,cz-.8,cx+.8,34,cz+.8,hsl(220,.3,.5));B(cx-1.2,34,cz-1.2,cx+1.2,35,cz+1.2,hsl(0,.9,.55),{e:3,solid:false});
  ride('drop',[cx,3,cz,0],[1,24,1,7],[1,.3,.4,0],[.35,2,0,0]);light(cx,30,cz,hsl(0,.9,.6),14,24);ring(cx,cz,9,9,12);join(3,cz,cx-9,cz)}
 // midway: game booths and snack stands along the cross path
 const games=['Ring Toss','Duck Pond','Hoop Shot','Balloon Darts','Lucky Wheel','Cotton Candy','Popcorn','Funnel Cakes'];
 for(const sx of[-1,1])for(let k=0;k<4;k++){const x=sx*(10+k*12),z=MID+(k%2?-8:8),hue=rnd(0,360);
  B(x-2.5,0,z-1.5,x+2.5,1,z+1.5,hsl(hue,.6,.4));B(x-2.6,3,z-1.6,x+2.6,3.2,z+1.6,hsl(hue+30,.8,.5));for(const dx of[-2.4,2.4])B(x+dx-.08,1,z-.08,x+dx+.08,3,z+.08,C.white);
  for(let j=0;j<10;j++)B(x+(j/10-.5)*5,3.2,z-1.7,x+(j/10-.5)*5+.5,3.6,z+1.7,j%2?C.white:hsl(hue,.9,.55),{solid:false});
  box(x,3.9,z-(z>MID?1.8:-1.8),4,.6,.12,hsl(hue,.9,.6),{e:3,sign:T(games[(k+(sx>0?4:0))%8]),face:z>MID?1:0,solid:false});light(x,2.6,z,hsl(hue,.9,.7),5,7);stand(x,z+(z>MID?.6:-.6),z>MID?Math.PI:0)}
 for(let k=0;k<30;k++)part(rnd(-50,50),rnd(5,9),rnd(10,130),.35,.45,.35,hsl(rnd(0,360),.9,.6),0,0,0,0); // balloons
 people(-55,MID-3,55,MID+3,30);people(-3,5,3,135,20);
 return{title:'Starlight Fair',night:1,fog:.004};
};
