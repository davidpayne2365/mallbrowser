// aquarium: a walk-through tunnel under the fish
DISTRICTS.aquarium=function(K){
const{model,trunk,MODELS,B,box,mark,part,stick,crown,tree,shrubs,palm,jet,bird,light,frame,addName,shop,rail,esc,vault,planter,fountain,bench,kiosk,seat,fpush,rack,mannequin,glowCase,counter,hsl,rnd,pick,chance,C,GL,STEEL,W8,BARK,chairC,xp,xd,idF,DW,DD,DH,MID,nn,nl,npath,ring,join,stand,ride,ctx,T,shell,lamp,bulbs,umbrella,rock,conifer,bigTree,flowers,bed,people,ESC}=K;
const WALL=hsl(215,.45,.08);
 shell({title:'Deep Blue Aquarium',floorPat:3,floor:hsl(220,.5,.12),roof:'flat',h:8,wallCol:WALL,wallPat:0,ceil:hsl(215,.4,.06),panels:false,titleCol:hsl(190,.9,.55),font:'italic 900 {s} Georgia,serif'});
 const WATER=hsl(195,.8,.35),BLUE=hsl(200,.9,.5);
 for(const[z0,z1]of[[8,63],[77,132]]){
  // the tank: water all around the tunnel, glass arch you walk under
  B(-16,0,z0,-3.6,7.6,z1,WATER,{glass:1,e:.22,solid:false});B(3.6,0,z0,16,7.6,z1,WATER,{glass:1,e:.22,solid:false});B(-3.6,4.1,z0,3.6,7.6,z1,WATER,{glass:1,e:.22,solid:false});
  B(-16.4,0,z0,-16,8,z1,WALL);B(16,0,z0,16.4,8,z1,WALL);B(-3.65,0,z0,-3.45,1,z1,C.dark);B(3.45,0,z0,3.65,1,z1,C.dark);
  vault(3.55,3.1,12,'z',z0,z1,3,.9);
  B(-16,7.55,z0,16,7.6,z1,hsl(195,.8,.6),{e:1.8,pat:8,solid:false});
  for(let z=z0+3;z<z1;z+=6){light(0,3.6,z,hsl(195,.9,.6),6,9);B(-15.9,0,z-2,-4,.6,z+2,hsl(30,.2,.3));B(4,0,z-2,15.9,.6,z+2,hsl(30,.2,.3))}
  for(let k=0;k<90;k++){const x=(chance(.5)?-1:1)*rnd(4.2,15.5),z=rnd(z0+1,z1-1);
   if(chance(.5))part(x,rnd(.4,1.6),z,rnd(.15,.4),rnd(.4,1.6),rnd(.15,.4),hsl(pick([10,330,30,280,50]),.75,.55),rnd(0,6),rnd(-.3,.3),rnd(-.3,.3),0);
   else for(let j=0;j<12;j++)part(x+rnd(-.4,.4),rnd(.6,2.4),z+rnd(-.4,.4),.06,.5,.03,hsl(rnd(100,150),.6,.3),rnd(0,6),rnd(-.4,.4),rnd(-.4,.4),4)}
  // fish: big schools overhead, smaller ones along the sides
  for(let s=0;s<14;s++){const zc=rnd(z0+12,z1-12),y=rnd(4.6,7),rx=rnd(6,12),rz=rnd(8,(z1-z0)/2-3),w=(chance(.5)?1:-1)*rnd(.25,.55),hue=pick([45,15,200,330,170,280]),n=Math.round(rnd(6,16)),sc=rnd(.6,1.6);
   for(let k=0;k<n;k++)ride('fish',[rnd(-1,1),y+rnd(-.6,.6),zc+rnd(-2,2),0],[rx+rnd(-.8,.8),rnd(.2,.8),rz+rnd(-1,1),5],[...hsl(hue+rnd(-15,15),.85,rnd(.4,.65)),k/n*.25+rnd(0,.05)],[w,sc,rnd(.3,.9),0])}
  for(const sx of[-1,1])for(let s=0;s<5;s++){const zc=rnd(z0+10,z1-10),y=rnd(.8,3.5),hue=pick([45,15,330,60]);for(let k=0;k<10;k++)ride('fish',[sx*rnd(8,11),y+rnd(-.4,.4),zc,0],[rnd(2.5,3.6),.3,rnd(6,12),5],[...hsl(hue,.9,.55),k/10*.3],[(chance(.5)?1:-1)*rnd(.4,.8),rnd(.4,.8),.6,0])}
  ride('fish',[rnd(-2,2),6.4,(z0+z1)/2,0],[9,.6,(z1-z0)/2-6,5],[.32,.34,.38,0],[.12,6,.3,0]); // a shark
 }
 // side galleries along the cross hall: wall tanks, jellyfish columns, touch pool
 for(const sx of[-1,1]){
  for(let x=18;x<56;x+=9){const X=sx*x;
   for(const zs of[-1,1]){const z=MID+zs*6.6;B(X-3.6,0,z-(zs>0?0:2.2),X+3.6,.9,z+(zs>0?2.2:0),WALL);B(X-3.5,.9,z-(zs>0?0:2.2),X+3.5,4.6,z+(zs>0?2.2:0),hsl(rnd(170,220),.8,.4),{glass:1,e:.5});
    for(let k=0;k<8;k++)ride('fish',[X,rnd(1.4,4),z+zs*1.1,0],[rnd(1,2.6),.2,rnd(.3,.8),5],[...hsl(rnd(0,360),.9,.6),k/8],[(chance(.5)?1:-1)*rnd(.6,1.2),rnd(.3,.6),.8,0]);
    light(X,4,z,hsl(rnd(170,220),.9,.6),4,6)}}
  for(let k=0;k<3;k++){const X=sx*(22+k*12),Z=MID+(k%2?-12:12);B(X-1.2,0,Z-1.2,X+1.2,6,Z+1.2,hsl(250,.6,.25),{glass:1,e:.5});light(X,3,Z,hsl(280,.9,.6),5,7);
   for(let j=0;j<10;j++)ride('jelly',[X+rnd(-.6,.6),rnd(.8,5.2),Z+rnd(-.6,.6),0],[.3,.5,.3,7],[...hsl(rnd(280,330),.8,.65),rnd(0,1)],[.5,2,1,0])}
 }
 for(let x=-56;x<=56;x+=8){if(Math.abs(x)<5)continue;B(x-1,7.9,MID-.6,x+1,8,MID+.6,hsl(195,.9,.6),{e:2,solid:false});light(x,7,MID,hsl(195,.9,.7),5,10)}
 people(-3,10,3,130,40);people(-56,MID-2,56,MID+2,25);
 return{title:'Deep Blue Aquarium',night:1,fog:.01,fogCol:[.0,.02,.05]};
};
