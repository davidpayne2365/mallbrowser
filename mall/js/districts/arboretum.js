// arboretum: a giant glass conservatory
DISTRICTS.arboretum=function(K){
const{B,box,mark,part,stick,crown,tree,shrubs,palm,jet,bird,light,frame,addName,shop,rail,esc,vault,planter,fountain,bench,kiosk,seat,fpush,rack,mannequin,glowCase,counter,hsl,rnd,pick,chance,C,GL,STEEL,W8,BARK,chairC,xp,xd,idF,DW,DD,DH,MID,nn,nl,npath,ring,join,stand,ride,ctx,T,shell,lamp,bulbs,umbrella,rock,conifer,bigTree,flowers,bed,people,ESC}=K;
shell({title:'The Arboretum',floorPat:20,floor:hsl(95,.35,.5),roof:'glass',h:9,rise:16,glassWalls:1,wallCol:hsl(30,.2,.35),wallPat:22,titleCol:hsl(120,.7,.55)});
 for(const[x0,z0,x1,z1]of[[-3.2,0,3.2,DD],[-DW,MID-3.2,DW,MID+3.2]])B(x0,0,z0,x1,.03,z1,C.floor,{pat:22,solid:false});
 const quads=[[-31,35],[31,35],[-31,105],[31,105]];
 quads.forEach(([cx,cz],qi)=>{
  const rx=20,rz=22,pts=ring(cx,cz,rx,rz,22);for(const[x,z]of pts)B(x-1.4,0,z-1.4,x+1.4,.025,z+1.4,C.floor,{pat:22,solid:false});
  join(cx>0?3:-3,cz,cx-Math.sign(cx)*rx,cz);join(cx,cz+(cz<MID?rz:-rz),cx,MID);
  for(let k=0;k<14;k++){const a=k/14*6.283+rnd(0,.3);bench(cx+Math.cos(a)*(rx+2.6),cz+Math.sin(a)*(rz+2.6),Math.abs(Math.sin(a))>.7);if(k%3===0)lamp(cx+Math.cos(a+.2)*(rx-2),cz+Math.sin(a+.2)*(rz-2),3.6,C.warm,4)}
  if(qi===0){ // lily pond with a footbridge
   B(cx-11,0,cz-8,cx+11,.4,cz-7.6,hsl(30,.1,.6),{pat:22});B(cx-11,0,cz+7.6,cx+11,.4,cz+8,hsl(30,.1,.6),{pat:22});B(cx-11,0,cz-7.6,cx-10.6,.4,cz+7.6,hsl(30,.1,.6),{pat:22});B(cx+10.6,0,cz-7.6,cx+11,.4,cz+7.6,hsl(30,.1,.6),{pat:22});
   B(cx-10.6,0,cz-7.6,cx+10.6,.15,cz+7.6,hsl(170,.5,.35),{e:.5,pat:8,solid:false});
   B(cx-1.2,.35,cz-8.4,cx+1.2,.5,cz+8.4,C.wood,{pat:23});rail(cx-1.2,cz-8,cx-1.2,cz+8,.45);rail(cx+1.2,cz-8,cx+1.2,cz+8,.45);npath([[cx,cz-rz],[cx,cz-9],[cx,cz+9],[cx,cz+rz]],0);
   for(let k=0;k<30;k++)part(cx+rnd(-9,9),.17,cz+rnd(-6.5,6.5),rnd(.4,.8),.02,rnd(.4,.8),hsl(rnd(100,130),.5,.25),rnd(0,6.28),0,0,0);
   for(let k=0;k<8;k++)part(cx+rnd(-9,9),.25,cz+rnd(-6,6),.12,.08,.12,hsl(rnd(320,360),.7,.7),0,0,0,0);
   for(let k=0;k<6;k++)bigTree(cx+(k%2?-16:16)+rnd(-2,2),cz-15+k*6,rnd(9,13));
  }else if(qi===1){ // palm house
   for(let k=0;k<9;k++){const a=k/9*6.283;palm(cx+Math.cos(a)*9,cz+Math.sin(a)*10,rnd(9,14))}
   bed(cx,cz,6,6,20);fountain(cx,cz-14);for(let k=0;k<10;k++)bigTree(cx+rnd(-17,17),cz+(k%2?17:-18)+rnd(-2,2),rnd(7,11));
  }else{ // rose garden / tree grove
   for(let i=-2;i<=2;i++)for(let j=-2;j<=2;j++)if((i+j)%2===0)bed(cx+i*6,cz+j*6,1.8,1.8,qi===2?350:50);
   for(let k=0;k<12;k++){const a=k/12*6.283;bigTree(cx+Math.cos(a)*(rx+7),cz+Math.sin(a)*(rz+7),rnd(8,14))}
  }
  for(let k=0;k<8;k++)bird(cx+rnd(-8,8),rnd(1.2,3),cz+rnd(-8,8),rnd(1,3),.5,(chance(.5)?1:-1)*rnd(.6,1.1),hsl(pick([45,20,280,200,330]),.9,.6));
  people(cx-rx,cz-rz,cx+rx,cz+rz,6);
 });
 for(let z=12;z<DD;z+=16)for(const sx of[-1,1])if(Math.abs(z-MID)>6){lamp(sx*4.5,z,4,C.warm,5)}
 for(let k=0;k<20;k++)bird(rnd(-40,40),rnd(30,40),rnd(20,120),rnd(8,20),2,(chance(.5)?1:-1)*rnd(.12,.2));
 return{title:'The Arboretum',fog:.0035};
};
