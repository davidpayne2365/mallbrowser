// grand department store: three floors around an atrium
DISTRICTS.dept=function(K){
const{model,trunk,MODELS,B,box,mark,part,stick,crown,tree,shrubs,palm,jet,bird,light,frame,addName,shop,rail,esc,vault,planter,fountain,bench,kiosk,seat,fpush,rack,mannequin,glowCase,counter,hsl,rnd,pick,chance,C,GL,STEEL,W8,BARK,chairC,xp,xd,idF,DW,DD,DH,MID,nn,nl,npath,ring,join,stand,ride,ctx,T,shell,lamp,bulbs,umbrella,rock,conifer,bigTree,flowers,bed,people,ESC}=K;
const H=18;shell({title:'Hartwell & Co.',floorPat:7,floor:hsl(35,.1,.85),roof:'flat',h:H,panels:false,titleCol:hsl(45,.8,.62),font:'400 {s} Didot,"Bodoni 72",Georgia,serif'});
 const AX=14,AZ0=48,AZ1=92;
 for(const y of[6,12]){B(-DW,y-.4,0,DW,y,AZ0,C.floor,{pat:12});B(-DW,y-.4,AZ1,DW,y,DD,C.floor,{pat:12});B(-DW,y-.4,AZ0,-AX,y,AZ1,C.floor,{pat:12});B(AX,y-.4,AZ0,DW,y,AZ1,C.floor,{pat:12});
  for(const s of[-1,1]){rail(-AX,s>0?AZ1:AZ0,AX,s>0?AZ1:AZ0,y);rail(s*AX,AZ0,s*AX,AZ1-8.5,y)}
  for(let x=-54;x<=54;x+=12)for(let z=8;z<DD;z+=12){if(Math.abs(x)<AX+2&&z>AZ0&&z<AZ1)continue;B(x-.9,y-.45,z-.9,x+.9,y-.4,z+.9,C.white,{e:2.3,solid:false});light(x,y-.9,z,C.warm,6,12,{both:y===6?0:0})}}
 for(let x=-54;x<=54;x+=12)for(let z=8;z<DD;z+=12){if(Math.abs(x)<AX+2&&z>AZ0&&z<AZ1)continue;B(x-.9,H-.05,z-.9,x+.9,H,z+.9,C.white,{e:2.3,solid:false});light(x,H-.8,z,C.warm,6,12)}
 vault(AX,6,12,'z',AZ0,AZ1,4,H);B(-AX,H,AZ0-.01,AX,H+.01,AZ0,C.ceil);
 for(const y0 of[0,6]){const z=AZ1-4;esc(y0?-6.8:6.8,z,y0?-1:1,y0)}
 for(let k=0;k<5;k++){const cy=H-2-k*.01,cz=AZ0+6+k*8;for(let j=0;j<24;j++){const a=j/24*6.283;B(Math.cos(a)*1.4-.06,cy-.5,cz+Math.sin(a)*1.4-.06,Math.cos(a)*1.4+.06,cy,cz+Math.sin(a)*1.4+.06,hsl(45,.5,.85),{e:4,solid:false})}light(0,cy-1,cz,C.warm,10,18)}
 // departments on every floor
 [0,6,12].forEach((fy,fl)=>{const c=ctx(fy,rnd(0,360));
  for(const sx of[-1,1])for(const[xa,z0]of[[20,18],[20,122],[40,18],[40,40],[40,100],[40,122],[24,36],[24,104]]){const x0=sx*xa,sz=z0<MID?-1:1,kind=(fl*3+xa+z0+(sx+1))%5;
   if(kind===0)for(let v=-10;v<=10;v+=3.4)rack(c,z0+v,x0-8,x0+8,()=>hsl(rnd(0,360),rnd(.3,.7),rnd(.3,.7)));
   else if(kind===1){for(let i=0;i<3;i++)for(let j=0;j<3;j++)glowCase(c,x0-9+i*7,z0-9+j*7,x0-4+i*7,z0-7.6+j*7);}
   else if(kind===2){for(let i=0;i<3;i++)for(let j=0;j<2;j++){const x=x0-8+i*8,z=z0-6+j*12,so=hsl(rnd(0,360),.3,.45);B(x-1.6,fy,z-.5,x+1.6,fy+.45,z+.5,so);B(x-1.6,fy+.45,z+.3,x+1.6,fy+1,z+.5,so);B(x-.6,fy,z-1.8,x+.6,fy+.4,z-1.1,C.wood)}}
   else if(kind===3){for(let i=0;i<4;i++){const x=x0-9+i*6;B(x-1.5,fy,z0-10,x+1.5,fy+1.1,z0+10,C.white,{s:.6});for(let z=z0-9;z<z0+10;z+=1.5)B(x-.4,fy+1.1,z-.3,x+.4,fy+1.6,z+.3,hsl(200+rnd(-40,40),.6,.55),{e:1.4,pat:5,solid:false})}}
   else for(let i=0;i<4;i++)mannequin(c,x0-6+i*4,z0+(sz<0?-6:6),rnd(0,360));
   for(let k=0;k<4;k++)stand(x0+rnd(-10,10),z0+rnd(-10,10),rnd(0,6),fy)}
  if(fy){npath([[-AX-2,AZ0-2],[-AX-2,AZ1+2],[AX+2,AZ1+2],[AX+2,AZ0-2]],fy,true);npath([[0,AZ0-2],[-AX-2,AZ0-2]],fy);npath([[0,AZ0-2],[AX+2,AZ0-2]],fy);npath([[0,AZ1+2],[0,DD-4]],fy);npath([[0,4],[0,AZ0-2]],fy);npath([[-56,MID],[-AX-2,MID]],fy);npath([[AX+2,MID],[56,MID]],fy)}});
 for(const e of ESC){const y0=e.y0;nl(nn(e.bx,y0,e.z),nn(e.tx,y0+6,e.z),1);join(e.bx,e.z,e.bx,e.z+(e.sx>0?2:-2),y0);join(e.tx,e.z,AX+2*(e.tx>0?1:-1),AZ1+2,y0+6)}
 for(const e of ESC)nl(nn(e.bx,e.y0,e.z),nn(0,e.y0,e.z<MID?e.z:AZ1+2));
 return{title:'Hartwell & Co.',fog:.002};
};
