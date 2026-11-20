// open-air street market
DISTRICTS.market=function(K){
const{model,trunk,MODELS,B,box,mark,part,stick,crown,tree,shrubs,palm,jet,bird,light,frame,addName,shop,rail,esc,vault,planter,fountain,bench,kiosk,seat,fpush,rack,mannequin,glowCase,counter,hsl,rnd,pick,chance,C,GL,STEEL,W8,BARK,chairC,xp,xd,idF,DW,DD,DH,MID,nn,nl,npath,ring,join,stand,ride,ctx,T,shell,lamp,bulbs,umbrella,rock,conifer,bigTree,flowers,bed,people,ESC}=K;
shell({title:'Old Town Market',floorPat:22,floor:hsl(30,.1,.6),h:14,wallCol:hsl(15,.4,.5),wallPat:25,titleCol:hsl(30,.9,.6)});
 // building facades with lit windows and shopfronts at street level
 for(const[x0,z0,x1,z1,face]of[[-DW,0,DW,.4,0],[-DW,DD-.4,DW,DD,1],[-DW,0,-DW+.4,DD,2],[DW-.4,0,DW,DD,3]]){
  const along=face<2,len=along?x1-x0:z1-z0;
  for(let s=4;s<len-2;s+=4){const u=(along?x0:z0)+s;if(Math.abs(u-(along?0:MID))<5)continue;
   for(let fl=1;fl<3;fl++){const y=5+fl*3.4,lit=chance(.55);const col=lit?hsl(40,.8,.7):hsl(220,.2,.15);
    if(along)B(u-.7,y,face?DD-.45:.4,u+.7,y+1.8,face?DD-.4:.45,col,{e:lit?1.6:0,solid:false});else B(face===2?-DW+.4:DW-.45,y,u-.7,face===2?-DW+.45:DW-.4,y+1.8,u+.7,col,{e:lit?1.6:0,solid:false})}}}
 for(const sx of[-1,1])for(const sz of[-1,1]){const x0=sx*8,z0=MID+sz*8;
  for(let i=0;i<4;i++)for(let j=0;j<4;j++){const x=x0+sx*i*11+sx*4,z=z0+sz*j*13+sz*4,hue=pick([0,30,120,200,45,330]),wide=rnd(2.2,2.8);
   B(x-wide,0,z-1.1,x+wide,.9,z+1.1,C.wood,{pat:23});for(const[dx,dz]of[[-wide,-1.1],[wide,-1.1],[-wide,1.1],[wide,1.1]])B(x+dx-.05,.9,z+dz-.05,x+dx+.05,2.6,z+dz+.05,C.wood);
   for(let k=0;k<8;k++)B(x-wide-.2+k*(wide*2+.4)/8,2.6,z-1.6,x-wide-.2+(k+1)*(wide*2+.4)/8,2.75,z+1.6,k%2?C.white:hsl(hue,.75,.5),{solid:false});
   const goods=pick(['fruit','flowers','bread','crafts']);
   for(let k=0;k<26;k++){const gx=x+rnd(-wide+.2,wide-.2),gz=z+rnd(-.9,.9);
    if(goods==='flowers')part(gx,1.05,gz,.18,.06,.3,hsl(pick([340,50,280,0,20]),.8,.6),rnd(0,6),rnd(-1.4,-.4),0,4);
    else{const s=rnd(.1,.2);B(gx-s,.9,gz-s,gx+s,.9+s*1.4,gz+s,goods==='fruit'?hsl(pick([0,30,55,90,15]),.85,.5):goods==='bread'?hsl(32,.6,rnd(.35,.55)):hsl(rnd(0,360),.5,.5),{solid:false})}}
   stand(x,z+sz*1.6,sz>0?Math.PI:0);light(x,2.3,z,C.warm,3,6)}}
 fountain(0,MID);for(const[x,z]of[[-8,MID-8],[8,MID-8],[-8,MID+8],[8,MID+8]]){planter(x,z)}
 for(let z=10;z<DD;z+=12)bulbs(-DW+.5,z,DW-.5,z+6,10,40,1.5);
 for(let k=0;k<10;k++){const x=rnd(-50,50),z=pick([20,120])+rnd(-6,6);if(Math.abs(x)<5)continue;B(x-.5,.72,z-.5,x+.5,.76,z+.5,C.white,{solid:false});B(x-.05,0,z-.05,x+.05,.72,z+.05,C.dark,{solid:false});umbrella(x,z,hsl(rnd(0,360),.7,.45));
  for(const[dx,dz]of[[-.9,0],[.9,0]]){B(x+dx-.2,0,z+dz-.2,x+dx+.2,.45,z+dz+.2,C.dark,{solid:false});if(chance(.6))seat(x+dx,z+dz,Math.atan2(-dx,-dz))}}
 for(let z=6;z<DD;z+=14)for(const sx of[-1,1])lamp(sx*4.5,z,4.5,C.warm,5);
 for(let k=0;k<14;k++)bird(rnd(-30,30),rnd(1.2,3),rnd(20,120),rnd(2,6),.5,(chance(.5)?1:-1)*rnd(.4,.8),hsl(0,0,rnd(.25,.45)));
 people(-50,MID-3,50,MID+3,20);people(-3,5,3,135,20);
 return{title:'Old Town Market',fog:.0025};
};
