// forest boardwalk
DISTRICTS.forest=function(K){
const{model,trunk,MODELS,B,box,mark,part,stick,crown,tree,shrubs,palm,jet,bird,light,frame,addName,shop,rail,esc,vault,planter,fountain,bench,kiosk,seat,fpush,rack,mannequin,glowCase,counter,hsl,rnd,pick,chance,C,GL,STEEL,W8,BARK,chairC,xp,xd,idF,DW,DD,DH,MID,nn,nl,npath,ring,join,stand,ride,ctx,T,shell,lamp,bulbs,umbrella,rock,conifer,bigTree,flowers,bed,people,ESC}=K;
shell({title:'Whispering Pines',floorPat:21,floor:hsl(30,.3,.5),h:2.4,wallCol:hsl(28,.3,.25),wallPat:23,titleCol:hsl(100,.6,.55),titleY:4.2,signY:3.4});
 const bw=(x0,z0,x1,z1)=>{B(x0,0,z0,x1,.45,z1,C.wood,{pat:23})};
 bw(-2.2,0,2.2,DD);bw(-DW,MID-2.2,DW,MID+2.2);
 for(const s of[-1,1]){for(const[a,b]of[[3,MID-2.4],[MID+2.4,DD-1]])rail(s*2.2,a,s*2.2,b,.45);for(const[a,b]of[[-DW+1,-2.4],[2.4,DW-1]])rail(a,MID+s*2.2,b,MID+s*2.2,.45)}
 // a stream with a little bridge
 for(let z=0;z<DD;z+=2){const x=-22+Math.sin(z*.06)*10;B(x-2,0,z,x+2,.06,z+2,hsl(180,.5,.3),{e:.4,pat:8,solid:false});for(const s of[-1,1])if(chance(.4))rock(x+s*2.6,z+1,rnd(.4,.9))}
 const clear=(x,z)=>Math.abs(x)<5||Math.abs(z-MID)<5||Math.abs(x-(-22+Math.sin(z*.06)*10))<4;
 let n=0;for(let k=0;k<400&&n<70;k++){const x=rnd(-57,57),z=rnd(3,137);if(clear(x,z))continue;n++;if(chance(.65))conifer(x,z,rnd(9,17));else bigTree(x,z,rnd(7,12))}
 for(let k=0;k<60;k++){const x=rnd(-57,57),z=rnd(3,137);if(clear(x,z))continue;shrubs(x,0,z,1.2,1.2,40);if(chance(.3))rock(x+1,z,rnd(.5,1.4))}
 for(let z=8;z<DD;z+=10)if(Math.abs(z-MID)>5)for(const s of[-1,1]){B(s*2.4-.05,.45,z-.05,s*2.4+.05,1.6,z+.05,C.dark);B(s*2.4-.15,1.6,z-.15,s*2.4+.15,1.9,z+.15,hsl(40,.9,.6),{e:3,solid:false});light(s*2.4,1.7,z,C.warm,3,7)}
 for(let k=0;k<6;k++){const z=rnd(10,130);if(Math.abs(z-MID)<6)continue;bench(3.6,z,0)}
 for(let k=0;k<25;k++)bird(rnd(-50,50),rnd(18,30),rnd(10,130),rnd(5,15),2,(chance(.5)?1:-1)*rnd(.15,.3));
 for(let k=0;k<40;k++)bird(rnd(-50,50),rnd(.8,2.5),rnd(10,130),rnd(.5,2),.4,(chance(.5)?1:-1)*rnd(.5,1),[.9,.95,.4]); // fireflies / butterflies
 people(-1.5,5,1.5,135,22);people(-55,MID-1.5,55,MID+1.5,14);
 return{title:'Whispering Pines',fog:.009,fogCol:[.06,.08,.07]};
};
