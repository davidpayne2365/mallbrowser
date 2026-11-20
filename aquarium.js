(()=>{var C=Math.PI*2,Y=(e,t,o)=>Math.min(o,Math.max(t,e)),B=(e,t,o)=>e+(t-e)*o,Ge=e=>((e+Math.PI)%C+C)%C-Math.PI;function X(e,t){let o=e|0;for(let n of t)o=Math.imul(o^n.codePointAt(0),16777619);return(n=0,r=1)=>{o=o+1831565813|0;let s=Math.imul(o^o>>>15,1|o);return s=s+Math.imul(s^s>>>7,61|s)^s,B(n,r,((s^s>>>14)>>>0)/4294967296)}}function j(e,t,o){let n=Math.hypot(e,t,o)||1;return[e/n,t/n,o/n]}var{hypot:et,sin:qt,cos:Ot,sqrt:_o,round:yt,min:yn,max:No,PI:Do}=Math,qo=2*Do,G=class{constructor(){this.p=[],this.i=[],this.aux=[]}v(t,o,n,r=1){return this.p.push(t,o,n),this.aux.push(r),this.p.length/3-1}tri(t,o,n){this.i.push(t,o,n)}quad(t,o,n,r){this.i.push(t,o,n,t,n,r)}tube(t,o,n=6,r=!0,s=null){let i=[],a=.31,c=.9,l=.3;for(let f=0;f<t.length;f++){let u=t[f],d=t[No(f-1,0)],m=t[yn(f+1,t.length-1)],v=m[0]-d[0],g=m[1]-d[1],y=m[2]-d[2],A=et(v,g,y)||1;v/=A,g/=A,y/=A;let z=c*y-l*g,k=l*v-a*y,h=a*g-c*v,x=et(z,k,h)||1;z/=x,k/=x,h/=x,a=g*h-y*k,c=y*z-v*h,l=v*k-g*z;let p=typeof o=="function"?o(f):o,b=[];for(let M=0;M<n;M++){let E=M/n*qo;b.push(this.v(u[0]+(z*Ot(E)+a*qt(E))*p,u[1]+(k*Ot(E)+c*qt(E))*p,u[2]+(h*Ot(E)+l*qt(E))*p,s?s(f):yn(1,.35+.65*f/(t.length-1))))}i.push(b)}for(let f=0;f<i.length-1;f++)for(let u=0;u<n;u++){let d=(u+1)%n;this.quad(i[f][u],i[f][d],i[f+1][d],i[f+1][u])}if(r){let f=t[t.length-1],u=this.v(f[0],f[1],f[2],s?s(t.length-1):1),d=i[i.length-1];for(let m=0;m<n;m++)this.tri(d[m],d[(m+1)%n],u)}}build(t){let o=this.p.length/3,n=this.p,r=this.i,s=new Float32Array(o*3);for(let l=0;l<r.length;l+=3){let f=r[l]*3,u=r[l+1]*3,d=r[l+2]*3,m=n[u]-n[f],v=n[u+1]-n[f+1],g=n[u+2]-n[f+2],y=n[d]-n[f],A=n[d+1]-n[f+1],z=n[d+2]-n[f+2],k=v*z-g*A,h=g*y-m*z,x=m*A-v*y;for(let p of[f,u,d])s[p]+=k,s[p+1]+=h,s[p+2]+=x}let i=new ArrayBuffer(o*16),a=new Float32Array(i),c=new Int8Array(i);for(let l=0;l<o;l++){let f=s[l*3],u=s[l*3+1],d=s[l*3+2];if(t){let v=t(n[l*3],n[l*3+1],n[l*3+2],f,u,d);f=v[0],u=v[1],d=v[2]}let m=et(f,u,d)||1;a[l*4]=n[l*3],a[l*4+1]=n[l*3+1],a[l*4+2]=n[l*3+2],c[l*16+12]=yt(f/m*127),c[l*16+13]=yt(u/m*127),c[l*16+14]=yt(d/m*127),c[l*16+15]=yt(Y(this.aux[l],-1,1)*127)}return{vb:i,ib:new Uint32Array(r),nv:o}}};function re(e,t){let o=new G,n=(1+_o(5))/2,r=[[-1,n,0],[1,n,0],[-1,-n,0],[1,-n,0],[0,-1,n],[0,1,n],[0,-1,-n],[0,1,-n],[n,0,-1],[n,0,1],[-n,0,-1],[-n,0,1]].map(i=>{let a=et(...i);return i.map(c=>c/a)}),s=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]];for(let i=0;i<e;i++){let a=new Map,c=[],l=(f,u)=>{let d=f<u?f*65536+u:u*65536+f,m=a.get(d);if(m===void 0){let v=[0,1,2].map(y=>r[f][y]+r[u][y]),g=et(...v);r.push(v.map(y=>y/g)),m=r.length-1,a.set(d,m)}return m};for(let[f,u,d]of s){let m=l(f,u),v=l(u,d),g=l(d,f);c.push([f,m,g],[u,v,m],[d,g,v],[m,v,g])}s=c}for(let i of r){let a=t?t(i[0],i[1],i[2]):i;o.v(a[0],a[1],a[2])}for(let i of s)o.tri(i[0],i[1],i[2]);return o}function bt(e,t,o){let n=Math.imul(e,374761393)+Math.imul(t,668265263)+Math.imul(o,1274126177);return n=Math.imul(n^n>>>13,1274126177),((n^n>>>16)>>>0)/4294967296}function bn(e,t,o){let n=Math.floor(e),r=Math.floor(t),s=Math.floor(o),i=u=>u*u*(3-2*u),a=i(e-n),c=i(t-r),l=i(o-s),f=u=>B(B(bt(n,r,u),bt(n+1,r,u),a),B(bt(n,r+1,u),bt(n+1,r+1,u),a),c);return B(f(s),f(s+1),l)}function Gt(e,t=3){let o=X(e,"rock-shape"),n=Array.from({length:5},()=>[...j(o(-1,1),o(-1,1),o(-1,1)),o(.66,.95)]);return re(t,(r,s,i)=>{let a=.92+.62*(bn(r*2+e,s*3,i*2)-.5)+.21*(bn(r*6-e,s*5,i*6)-.5),c=r*a,l=s*a,f=i*a;for(let[u,d,m,v]of n){let g=Math.max(0,c*u+l*d+f*m-v);c-=u*g,l-=d*g,f-=m*g}return[c,l,f]}).build()}function wn(e){let t=X(e,"coral"),o=new G;function n(r,s,i,a,c){let l=[r],f=r;for(let u=1;u<=5;u++)if(s=j(s[0]+t(-.16,.16),s[1]+.11,s[2]+t(-.15,.15)),f=f.map((d,m)=>d+s[m]*i/5),l.push(f),c&&(u===3||u===5)){let d=u===3?-1:1,m=t(0,Math.PI*2),v=j(s[0]+Math.cos(m)*.86*d,s[1]+.15,s[2]+Math.sin(m)*.86*d);n(f,v,i*t(.53,.76),a*.65,c-1)}l.push(f.map((u,d)=>u+s[d]*a*.44)),o.tube(l,u=>a*(u===6?.38:1-u*.064),9,!0,u=>c===0?u/6:u/6*.35)}for(let r=0;r<8;r++){let s=r*2.39996;n([Math.cos(s)*.13,0,Math.sin(s)*.13],j(Math.cos(s)*.77,t(.85,1.55),Math.sin(s)*.77),t(.41,.66),t(.052,.075),3)}return o.build()}function ge(e,t){return .08*(t+3.8)/7.6+.032*Math.sin(2.4*e+1.7*t)}function wt(e,t,o,n,r=1){let s=new G;for(let a=0;a<=r;a++)for(let c=0;c<=r;c++){let l=c/r,f=a/r,u=(l-.5)*e;if(o==="wall")s.v(u,f*t,n);else{let d=(f-.5)*t-.25,m=o==="sand"?n+ge(u,d):n;s.v(u,m,d)}}let i=r+1;for(let a=0;a<r;a++)for(let c=0;c<r;c++){let l=a*i+c;o==="wall"?s.quad(l,l+1,l+i+1,l+i):s.quad(l,l+i,l+i+1,l+1)}return s.build()}function Mn(){let e=new G,t=[[.48,-.065,.003,.008,.008],[.447,-.066,.026,.04,.034],[.399,-.042,.048,.079,.054],[.333,-.006,.07,.13,.093],[.257,.011,.083,.204,.153],[.163,.015,.092,.251,.207],[.052,.01,.097,.267,.239],[-.069,.006,.087,.238,.223],[-.17,-.002,.067,.192,.189],[-.262,-.009,.047,.12,.131],[-.34,-.011,.031,.059,.07],[-.405,-.012,.016,.028,.039],[-.449,-.012,.011,.019,.022]],o=32,n=t.map(([c,l,f,u,d])=>Array.from({length:o},(m,v)=>{let g=v/o*C,y=Math.cos(g);return e.v(c,l+y*(y>=0?u:d),Math.sin(g)*f,-1)}));for(let c=0;c<n.length-1;c++)for(let l=0;l<o;l++){let f=(l+1)%o;e.quad(n[c][l],n[c+1][l],n[c+1][f],n[c][f])}let r=e.v(.484,-.064,0,-1),s=e.v(-.452,-.012,0,-1);for(let c=0;c<o;c++){let l=(c+1)%o;e.tri(r,n[0][c],n[0][l]),e.tri(s,n.at(-1)[l],n.at(-1)[c])}function i(c,l){let f=c.map((u,d)=>Array.from({length:5},(m,v)=>{let g=v/4;return e.v(B(u[0],l[d][0],g),B(u[1],l[d][1],g),B(u[2],l[d][2],g),-.65+g*.35)}));for(let u=0;u<f.length-1;u++)for(let d=0;d<4;d++)e.quad(f[u][d],f[u+1][d],f[u+1][d+1],f[u][d+1])}i([[.23,.19,0],[.15,.24,0],[.04,.26,0],[-.06,.229,0],[-.165,.177,0],[-.26,.102,0],[-.335,.044,0]],[[.224,.2,0],[.068,.37,0],[-.045,.4,.013],[-.172,.347,.01],[-.281,.268,.008],[-.374,.138,.003],[-.382,.059,0]]),i([[.17,-.16,0],[.075,-.208,0],[-.04,-.216,0],[-.145,-.176,0],[-.23,-.13,0],[-.331,-.067,0]],[[.145,-.183,0],[-.01,-.31,.01],[-.126,-.324,.008],[-.23,-.26,.004],[-.331,-.158,0],[-.382,-.075,0]]),i([[-.414,-.032,0],[-.435,-.026,0],[-.443,-.012,0],[-.435,.006,0],[-.415,.016,0]],[[-.586,-.171,0],[-.65,-.129,.009],[-.64,-.016,.02],[-.657,.105,.012],[-.607,.17,0]]);function a(c,l,f){let u=re(2,(m,v,g)=>[c[0]+m*l[0],c[1]+v*l[1],c[2]+g*l[2]]),d=e.aux.length;for(let m=0;m<u.p.length;m+=3)e.v(u.p[m],u.p[m+1],u.p[m+2],f);for(let m=0;m<u.i.length;m+=3)e.tri(d+u.i[m],d+u.i[m+1],d+u.i[m+2])}for(let c of[-1,1])i([[.206,.047,c*.083],[.183,.004,c*.094],[.202,-.024,c*.086]],[[.15,.026,c*.117],[.009,-.084,c*.166],[.071,-.119,c*.143]]),a([.329,.055,c*.057],[.045,.041,.019],.66),a([.334,.058,c*.069],[.024,.026,.014],0),a([-.369,-.018,c*.027],[.036,.008,.008],.98);return e.build()}function Sn(e,t){for(let o=1;o<t.length;o++)for(let n=0;n<t[o].length;n++){let r=(n+1)%t[o].length;e.quad(t[o-1][n],t[o][n],t[o][r],t[o-1][r])}}function zn(){let e=new G;for(let[t,o,n,r,s,i]of[[0,.13,0,1,.06,6],[-.24,.28,-.13,.76,-.11,7],[.17,.42,-.03,.53,.13,5]]){e.tube([[0,0,0],[t*.45,o*.45,n*.45],[t,o,n]],c=>.22*r*(1-c*.24),8);let a=Array.from({length:10},(c,l)=>Array.from({length:48},(f,u)=>{let d=(l+.04)/9.04,m=C*u/48,v=Math.sin(i*m+2*o)+.46*Math.cos(11*m-3*o),g=r*d*(1+.105*v+.08*Math.cos(m+4*o)),y=g*Math.cos(m),A=g*Math.sin(m),z=o-s*y+.13*Math.sin(d*5.4)+.105*d*d*(v+1.1);return e.v(t+y,z,n+A,d)}));Sn(e,a)}return e.build()}function An(){let e=new G,t=Array.from({length:23},(o,n)=>Array.from({length:68},(r,s)=>{let i=C*s/68,a=(n+.09)/22.09,c=Math.sin(a*1.69)*Math.cos(i),l=Math.sin(a*1.69)*Math.sin(i),f=Math.cos(a*1.69)*.61+.065,u=.5+.5*Math.sin(21*c+5*Math.sin(4.2*l+1.7*c)+2.8*Math.sin(10*l-3*c)),d=u*u,m=f+d*.07*(.6+.4*Math.sin(a*Math.PI));return e.v(c*(1+.065*Math.cos(5*i)),m,l*.82,d)}));return Sn(e,t),e.build()}function kn(e){let t=X(e,"sea-fan"),o=new G;function n(r,s,i,a,c){let l=[r],f=r;for(let u=1;u<=4;u++)if(s=j(s[0]+t(-.16,.16),s[1]+.13,s[2]+t(-.1,.1)),f=f.map((d,m)=>d+s[m]*i*.25),l.push(f),c>0&&u>=2){let d=(u%2?-1:1)*t(.45,.95);n(f,j(s[0]+d,s[1]*.74,s[2]),i*t(.43,.71),a*.53,c-1)}o.tube(l,u=>a*(1-.19*u),5,!0,u=>(3-c+u*.25)*.25)}for(let r=-2;r<=2;r++)n([r*.044,0,0],j(r*.47,1,t(-.09,.09)),.52+.17*(2-Math.abs(r)),.052-.004*Math.abs(r),3);return o.build()}var Oo=[[2,.34,.43,.41,.1,.5],[4,-.22,.25,.3,.31,.2],[8,.05,.37,.36,.05,1.3],[10,.23,-.04,.27,.6,-1.2],[0,-.16,.52,.31,.21,.7],[13,-.65,.3,.47,.17,.1],[14,.39,.19,.43,.04,-.5],[16,-.36,.04,.32,.75,1.8],[12,.3,.47,.37,.32,2],[18,.71,-.34,.28,.13,-1.3]],Go=[[1,.28,.35,.36,.15,-1],[5,.03,.55,.39,.71,1.6],[8,-.34,.1,.24,.4,2],[7,.09,-.02,.17,.13,.6],[9,-.3,.3,.35,.85,.7],[11,-.12,.12,.23,.27,0],[14,-.42,.16,.36,.6,.7],[15,.21,.17,.32,.35,.9],[17,-.09,.12,.24,.71,2],[18,.28,.38,.39,.3,-.6],[19,.18,.17,.42,.18,2.4],[16,-.54,.36,.23,.89,1.2]],Ho=[[2,-.6,-.26,.7,.12,-.43],[4,-.34,-.4,.63,.81,.18],[5,-.55,.29,.54,.21,.45],[1,.51,-.51,.48,.31,-.5],[9,.23,-.12,.41,.17,.21],[14,.61,-.49,.75,.66,.58],[15,-.4,-.38,.62,.54,-.2],[13,-.52,-.17,.45,.17,.42],[18,-.66,.15,.36,.28,-.35],[19,.48,-.38,.47,.1,.34]];function Vo(e,t){let[o,n,r]=e.position,[s,i,a]=e.scale,c=Math.cos(e.yaw),l=Math.sin(e.yaw),f=new Float32Array(t.vb),u=[];for(let d=0;d<f.length;d+=4){let m=f[d]*s,v=f[d+2]*a;u.push([o+m*c-v*l,n+f[d+1]*i,r+m*l+v*c])}return{positions:u,indices:t.ib}}function $o(e,t,o){let{positions:n,indices:r}=e,s=-1/0;for(let i=0;i<r.length;i+=3){let[a,c,l]=[n[r[i]],n[r[i+1]],n[r[i+2]]],f=(c[0]-a[0])*(l[2]-a[2])-(l[0]-a[0])*(c[2]-a[2]);if(Math.abs(f)<1e-8)continue;let u=((t-a[0])*(l[2]-a[2])-(l[0]-a[0])*(o-a[2]))/f,d=((c[0]-a[0])*(o-a[2])-(t-a[0])*(c[2]-a[2]))/f;u>=0&&d>=0&&u+d<=1&&(s=Math.max(s,a[1]+u*(c[1]-a[1])+d*(l[1]-a[1])))}return s}function En(e,t,o,n,r){let s=t.map(a=>Vo(a,o[a.variant]));function i(a,c){return a.flatMap(([l,f,u,d,m,v])=>{let[g,,y]=t[l].position,A=g+f,z=y+u,k=-1/0;for(let x=0;x<t.length;x++){let p=t[x];Math.abs(p.position[0]-A)>1.8||Math.abs(p.position[2]-z)>1.8||(k=Math.max(k,$o(s[x],A,z)))}if(!(k>.16&&k<2.66))return[];let h=c===6?d*.75:d;return[n([A,k-.045,z],[d,h,d],v,c,m)]})}return[r(zn(),i(Oo,6),!0),r(An(),i(Go,7),!0),r(kn(e),i(Ho,8),!0)]}var jo={F:[[[0,0],[0,6],[3.6,6]],[[0,3.2],[2.9,3.2]]],e:[[[0,2.15],[3.6,2.15],[3.48,3.2],[2.72,4.05],[1.16,4.12],[.24,3.24],[0,2.12],[.22,1],[1.17,0],[2.72,0],[3.46,.61]]],r:[[[.24,0],[.24,4.15]],[[.24,2.85],[1.18,3.95],[2.24,4.16],[3.24,3.89]]],n:[[[0,0],[0,4.15]],[[0,3.03],[1.08,4.1],[2.45,4.13],[3.33,3.52],[3.6,2.54],[3.6,0]]],v:[[[0,4.2],[1.8,0],[3.6,4.2]]],"/":[[[.15,-.35],[3.45,6.35]]],0:[[[.95,0],[0,.9],[0,5.1],[.95,6],[2.65,6],[3.6,5.1],[3.6,.9],[2.65,0],[.95,0]]],1:[[[.5,4.9],[1.8,6],[1.8,0]],[[.5,0],[3.1,0]]],2:[[[0,4.85],[.5,5.65],[1.35,6],[2.55,6],[3.35,5.52],[3.6,4.65],[3.12,3.78],[0,.55],[0,0],[3.6,0]]],3:[[[.15,5.55],[.95,6],[2.6,6],[3.45,5.4],[3.45,4.4],[2.55,3.35],[1.3,3.35]],[[2.55,3.35],[3.6,2.52],[3.6,1.02],[2.65,0],[.95,0],[.1,.54]]],4:[[[2.75,0],[2.75,6],[0,2.03],[3.6,2.03]]],5:[[[3.42,6],[.45,6],[.15,3.18],[.93,3.58],[2.65,3.58],[3.6,2.75],[3.6,1.06],[2.6,0],[.92,0],[0,.63]]],6:[[[3.27,5.68],[2.56,6],[1.28,5.76],[.34,4.68],[0,3.07],[0,1.05],[.94,0],[2.63,0],[3.6,1.04],[3.6,2.48],[2.7,3.43],[.99,3.43],[0,2.67]]],7:[[[0,6],[3.6,6],[1.02,0]]],8:[[[.95,3.3],[.15,4.15],[.15,5.15],[1,6],[2.6,6],[3.45,5.15],[3.45,4.15],[2.65,3.3],[.95,3.3],[0,2.53],[0,.95],[.97,0],[2.63,0],[3.6,.95],[3.6,2.53],[2.65,3.3]]],9:[[[.32,.28],[1.12,0],[2.32,.22],[3.26,1.3],[3.6,2.92],[3.6,4.96],[2.66,6],[.97,6],[0,4.96],[0,3.52],[.9,2.57],[2.61,2.57],[3.6,3.33]]]};function Mt(e){let t=s=>s===" "?2.1:4.7,n=-([...e].reduce((s,i)=>s+t(i),0)-1.1)/2,r=[];for(let s of e){for(let i of jo[s]??[])r.push(i.map(([a,c])=>[(n+a)*.0115,c*.016]));n+=t(s)}return r}var Wo="v 11/15/26",Yo=.98;function Tn(e){let t=.0065,o=(n,r)=>e.v(n-.025,r+.183,.392,Yo);for(let n of Mt(Wo)){for(let r=1;r<n.length;r++){let[s,i]=n[r-1],[a,c]=n[r],l=Math.hypot(a-s,c-i),f=(i-c)*t/l,u=(a-s)*t/l;e.quad(o(s-f,i-u),o(a-f,c-u),o(a+f,c+u),o(s+f,i+u))}for(let[r,s]of n){let i=o(r,s),a=Array.from({length:8},(c,l)=>o(r+t*Math.cos(l*Math.PI/4),s+t*Math.sin(l*Math.PI/4)));for(let c=0;c<a.length;c++)e.tri(i,a[c],a[(c+1)%a.length])}}}var ie=[0,.037,.52],pe=.29,je=[0,.5,-.39],$t=9,$e=-.42,Ve=-.98,ue=.29,Re=.59,Ht=.93,He=.7,tt=.78,Ko=.29;function Q(e,t,o,n){let[r,s,i]=t,[a,c,l]=o.map(u=>u/2),f=[[-a,-c,-l],[a,-c,-l],[a,c,-l],[-a,c,-l],[-a,-c,l],[a,-c,l],[a,c,l],[-a,c,l]];for(let u of[[0,3,2,1],[4,5,6,7],[0,4,7,3],[1,2,6,5],[3,7,6,2],[0,1,5,4]]){let d=u.map(m=>e.v(r+f[m][0],s+f[m][1],i+f[m][2],n));e.quad(...d)}}var ze=re(1);function xe(e,t,o,n,r=0){let s=e.aux.length,i=Math.cos(r),a=Math.sin(r);for(let c=0;c<ze.p.length;c+=3){let l=ze.p[c]*o[0],f=ze.p[c+1]*o[1];e.v(t[0]+l*i-f*a,t[1]+l*a+f*i,t[2]+ze.p[c+2]*o[2],n)}for(let c=0;c<ze.i.length;c+=3)e.tri(s+ze.i[c],s+ze.i[c+1],s+ze.i[c+2])}function Xo(e,t,o,n){let r=Array.from({length:19},(s,i)=>[t+.086*Math.cos(i*C/18),o+.097*Math.sin(i*C/18),n]);e.tube(r,.016,8,!1,()=>ue),Q(e,[t,o+.102,n-.021],[.066,.06,.038],ue)}function Qo(e){let t=new G,o=X(e,"treasure");Q(t,[0,.062,0],[1.39,.1,.76],$e),Q(t,[0,.116,0],[1.26,.016,.67],Ve);for(let r=0;r<4;r++){let s=.143+r*.091;for(let i of[-1,1])Q(t,[0,s,i*.359],[1.39,.084,.06],$e+r*.052),Q(t,[i*.675,s,0],[.05,.084,.68],$e-r*.038)}for(let r of[-1,1]){Q(t,[0,.294,r*.323],[1.29,.35,.015],Ve),Q(t,[r*.647,.294,0],[.015,.35,.66],Ve);for(let s of[.083,.462]){Q(t,[0,s,r*.385],[1.46,.074,.065],ue),Q(t,[r*.704,s,0],[.073,.074,.76],ue);for(let i=-5;i<=5;i++)xe(t,[i*.123,s,r*.422],[.014,.014,.007],Re)}for(let s of[-.677,.677]){Q(t,[s,.271,r*.389],[.086,.42,.071],ue),Q(t,[s+Math.sign(s)*.029,.271,r*.35],[.042,.42,.055],ue);for(let i=0;i<4;i++)xe(t,[s,.147+i*.08,r*.427],[.015,.015,.008],Re)}}Q(t,[0,.385,.429],[.124,.143,.027],ue),xe(t,[0,.401,.449],[.019,.023,.005],Ve),Q(t,[0,.376,.45],[.013,.035,.006],Ve),Tn(t),Xo(t,-.43,.285,.419);for(let r=0;r<45;r++){let s=o(-.58,.58),i=o(-.28,.29),a=Math.max(0,1-Math.hypot(s*1.42,(i+.155)*2.2)),c=.169+o(.018,.093)+.2*a,l=o(.032,.067);xe(t,[s,c,i],[l,.009,l*.92],Re+o(-.07,.07),o(-.4,.4))}for(let r=0;r<12;r++){let s=o(-.43,.46),i=o(-.25,.02),a=.363+o(-.014,.056);xe(t,[s,a,i],[o(.038,.057),.016,.045],Re+o(-.07,.07),o(-.47,.47))}let n=Array.from({length:27},(r,s)=>{let i=s/26,a=Math.sin(Math.PI*i);return[.17+.42*i,.455-.235*a**1.8+.073*(1-a),.343+.123*Math.sin(Math.PI*i)**.48]});t.tube(n,.008,5,!1,()=>Ht),n.forEach((r,s)=>{let i=.021+.005*Math.sin(s*1.77)**2;xe(t,r,[i,i*.96,i],Ht)});for(let r=0;r<9;r++){let s=r/8;xe(t,[.17-.18*s,.522-.28*s,.32-.37*s],[.02,.021,.02],Ht)}return t.build()}function Vt(e,t=0){return[(Ko+t)*Math.sin(e),tt/2-(tt/2+t)*Math.cos(e)]}function zt(e,t,o,n,r,s,i,a=0,c=!1){let l=Array.from({length:s+1},(f,u)=>{let[d,m]=Vt(n+u*(r-n)/s,a);return[e.v(t,d,m,i),e.v(o,d,m,i)]});for(let f=0;f<s;f++){let[u,d]=l[f],[m,v]=l[f+1];c?e.quad(u,m,v,d):e.quad(u,d,v,m)}}function Zo(){let e=new G;for(let t=0;t<7;t++){let o=Math.PI*t/7+.009,n=Math.PI*(t+1)/7-.009;zt(e,-He,He,o,n,4,$e+.045*(t%3)),zt(e,-He,He,o-.01,n+.01,4,Ve,-.025,!0)}for(let t of[-He,He]){let o=e.v(t,0,tt/2,$e),n=Array.from({length:33},(r,s)=>e.v(t,...Vt(s*Math.PI/32),$e));for(let r=0;r<32;r++)e.tri(o,n[r],n[r+1])}for(let t of[-.682,-.25,.25,.682]){zt(e,t-.042,t+.042,0,Math.PI,32,ue,.018),zt(e,t-.045,t-.035,0,Math.PI,32,Re,.021);for(let o=0;o<=10;o++){let[n,r]=Vt((o+.25)*Math.PI/10.5,.027);xe(e,[t,n,r],[.017,.015,.015],Re)}}for(let t of[0,tt]){Q(e,[0,.008,t],[1.465,.067,.058],ue);for(let o=-5;o<=5;o++)xe(e,[o*.122,.006,t+(t===0?-.032:.032)],[.015,.015,.009],Re)}return Q(e,[0,-.012,tt+.031],[.091,.084,.022],ue),e.build()}function Pn(e){return{base:Qo(e),lid:Zo()}}var Cn=10,nt=-.58,At=-.96,In=.91;function ot(e,t,o){for(let n=0;n<t.length;n++){let r=(n+1)%t.length;e.quad(t[n],o[n],o[r],t[r])}}function Jo(e){function n(u,d=1,m=0,v=.04+u*.71){let g=-.78-(1-u)*C*2.62,y=Math.cos(g),A=Math.sin(g),z=.021*Math.exp(u*2.05),k=.0123*Math.exp(u*2.31)*d,h=1+.045*Math.sin(u*C*52)+.018*Math.sin(u*C*83);return Array.from({length:28},(x,p)=>{let b=p*C/28,M=z+Math.cos(b)*k*h;return e.v(-.105+M*y+m*A,.264+M*A*.93-m*y,.136-.171*u+Math.sin(b)*k*1.21,v)})}let r=n(0),s=e.v(-.105,.264,.136,.04);for(let u=0;u<28;u++)e.tri(s,r[u],r[(u+1)%28]);for(let u=1;u<=236;u++){let d=n(u/236);ot(e,r,d),r=d}let i=n(1,1.05,-.012,In),a=n(1,.78,-.018,In);ot(e,r,i),ot(e,i,a);let c=n(1,.78,-.018,At),l=n(1,.49,.045,At);ot(e,c,l);let f=e.v(.037,.109,-.035,At);for(let u=0;u<28;u++)e.tri(f,l[u],l[(u+1)%28])}function er(e){let t=[[-.34,.019,.015],[-.29,.037,.048],[-.2,.067,.079],[-.1,.123,.101],[0,.153,.104],[.08,.142,.1],[.16,.115,.092],[.23,.12,.075],[.29,.116,.057],[.33,.084,.04],[.345,.058,.017]],o=24,n=t.map(([i,a,c])=>Array.from({length:o},(l,f)=>{let u=f*C/o,d=(.5+.5*Math.cos(u))**1.4,m=1.13-.23*d;return e.v(i,.005+d*a,Math.sin(u)*c*m,nt-.14*(1-d))}));for(let i=1;i<n.length;i++)ot(e,n[i-1],n[i]);let r=e.v(-.348,.012,0,nt),s=e.v(.353,.032,0,nt);for(let i=0;i<o;i++){let a=(i+1)%o;e.tri(r,n[0][i],n[0][a]),e.tri(s,n.at(-1)[a],n.at(-1)[i])}for(let i of[-1,1]){let a=[.389,.253,i*.113];e.tube([[.215,.108,i*.036],[.265,.15,i*.057],[.318,.203,i*.083],[.355,.239,i*.1],a],f=>.016-.0019*f,9,!0,()=>nt),e.tube([[.274,.071,i*.046],[.328,.093,i*.068],[.374,.123,i*.085]],f=>.012-.0024*f,8,!0,()=>nt);let c=re(2,(f,u,d)=>[a[0]+f*.012,a[1]+u*.012,a[2]+d*.011]),l=e.aux.length;for(let f=0;f<c.p.length;f+=3)e.v(c.p[f],c.p[f+1],c.p[f+2],At);for(let f=0;f<c.i.length;f+=3)e.tri(l+c.i[f],l+c.i[f+1],l+c.i[f+2])}}function Bn(){let e=new G;return er(e),Jo(e),e.build()}var Rn=11,We=-.34,tr=-.64,nr=-.53,kt=.8,Et=.96;function ye(e,t,o,n,r=2){let s=re(r,(a,c,l)=>[t[0]+a*o[0],t[1]+c*o[1],t[2]+l*o[2]]),i=e.aux.length;for(let a=0;a<s.p.length;a+=3)e.v(s.p[a],s.p[a+1],s.p[a+2],n);for(let a=0;a<s.i.length;a+=3)e.tri(i+s.i[a],i+s.i[a+1],i+s.i[a+2])}function Wt(e,t){for(let o=1;o<t.length;o++)for(let n=0;n<t[o].length;n++){let r=(n+1)%t[o].length;e.quad(t[o-1][n],t[o][n],t[o][r],t[o-1][r])}}function rt(e,t,o){let r=t.map(([s,i,a,c,l=o])=>Array.from({length:32},(f,u)=>{let d=u*C/32;return e.v(s,i+a*Math.cos(d),c*Math.sin(d),l)}));Wt(e,r)}function Ln(e,t){let n=[[-.561,0,.003],[-.621,.04,.024],[-.681,.116,.047],[-.765,.152,.049],[-.806,.122,.038],[-.762,.073,.029],[-.704,.04,.014],[-.733,.005,.003]].map(([r,s,i],a)=>Array.from({length:7},(c,l)=>{let f=l/6;return e.v(B(-.566,r,f),-.016+t*s*f,i*f+.012*Math.sin(a*1.7)*f*f,.53+.14*f)}));for(let r=0;r<n.length-1;r++)for(let s=0;s<6;s++)s===0?e.tri(n[r][0],n[r+1][1],n[r][1]):e.quad(n[r][s],n[r+1][s],n[r+1][s+1],n[r][s+1])}var jt=e=>B(-.28,-.04,e);function or(e,t){let o=[[.25,.08,.01,.028,.027,0],[.226,.098,.008,.03,.027,.12],[.192,.112,.005,.024,.022,.24],[.151,.122,.006,.019,.018,.39],[.123,.125,.012,.018,.017,.5],[.096,.125,.024,.019,.016,.62],[.05,.121,.041,.015,.013,.77],[.004,.114,.054,.01,.009,.91],[-.016,.112,.058,.015,.009,1],[-.035,.11,.06,.012,.007,1],[-.04,.109,.061,.005,.004,1]],n=16,r=o.map(([s,i,a,c,l,f],u)=>{let d=o[Math.max(0,u-1)],m=o[Math.min(u+1,o.length-1)],v=m[0]-d[0],g=t*(m[1]-d[1]),y=Math.hypot(v,g);return Array.from({length:n},(A,z)=>{let k=z*C/n,h=c*Math.cos(k)/y;return e.v(s+g*h,t*i-v*h,a+l*Math.sin(k),jt(f))})});Wt(e,r);for(let[s,i]of[[-.009,.016],[-.003,.024],[.003,.023],[.009,.017]]){let a=t*(.11+s);e.tube([[-.031,a,.061],[-.04-i*.38,a,.061],[-.04-i,a,.056]],c=>[.0044,.0038,.0024][c],7,!0,()=>jt(1))}e.tube([[-.009,t*.103,.057],[-.024,t*.095,.061],[-.036,t*.096,.057]],s=>[.006,.0042,.003][s],8,!0,()=>jt(1))}function rr(e){ye(e,[.298,0,.008],[.055,.032,.033],We),ye(e,[.366,0,.018],[.074,.059,.061],We,3),ye(e,[.361,0,.074],[.016,.013,.016],We),e.tube([[.337,-.016,.068],[.333,0,.073],[.337,.016,.068]],.0045,6,!0,()=>nr);for(let o of[-1,1])ye(e,[.382,o*.025,.069],[.008,.013,.0058],tr,1),ye(e,[.385,o*.024,.074],[.0036,.004,.0022],Et,1),ye(e,[.361,o*.053,.013],[.017,.012,.012],We,1),ye(e,[.356,o*.061,.018],[.007,.008,.008],Et,1);let t=Array.from({length:17},(o,n)=>Array.from({length:40},(r,s)=>{let i=s*C/40,c=.015+(2.56-1.53*Math.max(0,Math.sin(i))**2)*n/16,l=1+.037*Math.sin(9*i+c*3);return e.v(.374+.079*Math.cos(c),.068*Math.sin(c)*Math.cos(i)*l,.013+.066*Math.sin(c)*Math.sin(i)*l,-.99)}));Wt(e,t);for(let o of[-1,1])for(let n=0;n<5;n++){let r=n/4,s=.017*Math.sin(n*2.3),i=[[.406,o*(.04+r*.015),.012-r*.041],[.339,o*(.062+r*.02),-.029-r*.031],[.255,o*(.067+r*.043),-.056-r*.043],[.143,o*(.097+r*.03+s),-.077-r*.056],[.021+r*.082,o*(.121+r*.035+s),-.108-r*.068]];e.tube(i,a=>[.017,.024,.026,.02,.0045][a]*(1-r*.17),10,!0,a=>-1+a*.058)}e.tube([[.406,-.049,.047],[.42,-.024,.063],[.429,0,.067],[.42,.024,.063],[.406,.049,.047]],.0056,8,!0,()=>Et),ye(e,[.432,0,.067],[.01,.01,.007],kt,1)}function Un(){let e=new G;rt(e,[[.065,0,.085,.057,.04],[.011,0,.091,.058,.06],[-.06,-.003,.08,.055,.09],[-.147,-.005,.066,.05,.14],[-.24,-.006,.05,.041,.21],[-.333,-.008,.036,.031,.27],[-.427,-.011,.025,.023,.34],[-.514,-.015,.016,.016,.39],[-.56,-.016,.013,.012,.43],[-.59,-.016,.004,.005,.44]]),Ln(e,-1),Ln(e,1),rt(e,[[-.01,0,.088,.058],[.058,0,.085,.057],[.12,0,.061,.049],[.152,0,.068,.055]],We),rt(e,[[.115,0,.065,.052],[.148,0,.072,.06],[.195,0,.089,.071],[.241,0,.096,.063],[.266,0,.087,.052]],kt),rt(e,[[.255,0,.09,.053],[.278,0,.079,.043],[.299,0,.049,.034],[.316,0,.032,.032]],We),rt(e,[[.026,0,.094,.062],[.042,0,.091,.061],[.054,0,.089,.059]],Et),ye(e,[.047,0,.061],[.02,.02,.011],kt,1);for(let t of[-1,1])or(e,t),e.tube([[.212,t*.074,.045],[.252,t*.075,.04],[.281,t*.06,.019]],.0065,8,!0,()=>kt);return rr(e),e.build()}var _n=12,Ue=[.425,.395,.365],Yt=-1,Fn=-.72,sr=-.34,ar=-.21,ir=-.08,cr=.46,lr=.57,fr=.74,ur=.94;function be(e,t,o,n,r){let s=re(r,(a,c,l)=>[t[0]+o[0]*a,t[1]+o[1]*c,t[2]+o[2]*l]),i=e.aux.length;for(let a=0;a<s.p.length;a+=3)e.v(s.p[a],s.p[a+1],s.p[a+2],n);for(let a=0;a<s.i.length;a+=3)e.tri(i+s.i[a],i+s.i[a+1],i+s.i[a+2])}function pr(e,t){let o=X(t,"puffer-spines"),n=106,r=Math.PI*(3-Math.sqrt(5));for(let s=0;s<n;s++){let i=1-2*(s+.5)/n,a=Math.sqrt(1-i*i),c=s*r+o(-.07,.07),l=Math.cos(c)*a,f=Math.sin(c)*a;if(l>.51||Math.abs(f)>.86&&l>-.48&&i<.09&&i>-.35)continue;let[u,d,m]=j(l/Ue[0],i/Ue[1],f/Ue[2]),[v,,g]=j(m,0,-u),y=d*g,A=m*v-u*g,z=-d*v,k=o(.012,.021),h=o(.037,.074)*B(.73,1.06,(i+1)/2),x=l*Ue[0]-u*.005,p=i*Ue[1]-d*.005,b=f*Ue[2]-m*.005,M=6,E=[],R=[];for(let I=0;I<M;I++){let L=I*C/M,q=k*Math.cos(L),_=k*Math.sin(L),w=v*q+y*_,T=A*_,O=g*q+z*_;E.push(e.v(x+w,p+T,b+O,Fn)),R.push(e.v(x+u*h*.46+w*.47,p+d*h*.46+T*.47,b+m*h*.46+O*.47,Fn))}let D=e.v(x+u*h-.015,p+d*h,b+m*h,sr);for(let I=0;I<M;I++){let L=(I+1)%M;e.quad(E[I],E[L],R[L],R[I]),e.tri(R[I],R[L],D)}}}function Kt(e,t,o){let r=t.map(([s,i,a],c)=>Array.from({length:7},(l,f)=>{let u=f/6,[d,m,v]=o[c];return e.v(B(s,d,u),B(i,m,u),B(a,v,u),B(.045,.29,u))}));for(let s=0;s<r.length-1;s++)for(let i=0;i<6;i++)e.quad(r[s][i],r[s+1][i],r[s+1][i+1],r[s][i+1])}function Nn(e){let t=new G;be(t,[0,0,0],Ue,Yt,4),pr(t,e),be(t,[-.417,-.019,0],[.102,.04,.037],Yt,2),Kt(t,[[-.476,-.051,0],[-.49,-.037,0],[-.496,-.019,0],[-.489,-.001,0],[-.475,.015,0]],[[-.635,-.125,0],[-.682,-.09,.01],[-.697,-.02,.017],[-.679,.055,.011],[-.631,.102,0]]);for(let o of[-1,1])Kt(t,[[-.234,o*.318,0],[-.307,o*.258,0],[-.358,o*.193,0]],[[-.256,o*.353,.002],[-.379,o*.365,.016],[-.448,o*.234,.01]]),Kt(t,[[.07,.014,o*.35],[.046,-.046,o*.357],[.023,-.086,o*.352]],[[-.158,-.008,o*.45],[-.209,-.075,o*.465],[-.133,-.139,o*.415]]),be(t,[.254,.124,o*.236],[.085,.085,.062],cr,3),be(t,[.273,.128,o*.279],[.062,.064,.034],lr,3),be(t,[.288,.129,o*.301],[.043,.047,.021],fr,3),be(t,[.298,.146,o*.32],[.012,.013,.0045],ur,2);return be(t,[.401,-.075,0],[.081,.098,.1],Yt,3),be(t,[.468,-.079,0],[.024,.046,.064],ar,3),be(t,[.486,-.079,0],[.009,.021,.039],ir,2),t.build()}var Dn=241117,Tt=4.67,Xt=[[-1.24,2.52,2.3,.92,.12],[1.02,1.6,2.66,.83,3.21],[2.83,2.3,.88,.7,2.98],[-3.52,3.07,-.09,.7,.19],[.39,3.15,-.38,.78,-.13],[-.46,.96,1.75,.65,.06],[3.79,1.51,1.58,.63,2.94]],qn=[{key:"tangs",mesh:Mn,starts:Xt},{key:"mermaid",mesh:Un,starts:[[.25,2.45,1.42,.72,.12,Rn,.43]]},{key:"puffer",mesh:Nn,starts:[[-.64,1.87,1.91,.94,-.22,_n,1.19,{paceScale:.8,weave:1,extraClearance:.17}]]}],Qt=qn.flatMap(e=>e.starts),dr=[[-3.61,.39,-.12,1.25,.64,1.16,.2],[-2.78,.68,-.84,1.41,.88,1.02,1.1],[-2.8,1.34,-1.3,1.14,.96,.89,-.65],[-3.13,2.07,-1.51,1.01,.75,.76,.21],[-3.97,1.39,-1.57,1.14,.92,.91,-.9],[-4.32,.57,-1.54,1.37,1.07,1.18,-.4],[-2.36,.38,.32,1.21,.54,.81,1.18],[-1.55,.23,.13,.59,.33,.51,1.8],[-3.16,.79,.23,.84,.71,.86,2.1],[-4.03,.54,.91,.93,.53,.79,.5],[-2.18,1.02,-.68,.63,.48,.69,-.9],[-3.43,1.56,-.42,.62,.52,.66,.3],[2.88,.42,-.45,1.51,.71,1.04,-.5],[3.63,.92,-.78,1.27,.91,1.24,.33],[4.31,1.55,-1.44,1.01,.8,1.05,.56],[3.48,1.44,-1.87,1.25,.78,.95,-.25],[2.59,.96,-1.88,1.06,.67,.92,1.5],[2,.35,.05,.75,.45,.68,.7],[3.48,.35,.66,1.23,.59,.83,-1.1],[4.79,.36,.29,1.08,.58,.94,.5],[1.4,.23,-1.86,.56,.36,.55,-.8],[-.6,.18,-2.67,.75,.31,.7,1.1]];function ee(e,t,o,n,r=0){return[...e,n,...t,r,Math.cos(o),Math.sin(o),0,0]}function hr(e){let t=X(e,"reef-placement"),o=dr.map(([r,s,i,a,c,l,f],u)=>({position:[r+t(-.038,.038),s,i+t(-.038,.038)],scale:[a,c,l],yaw:f,tint:t(0,1),variant:u%4})),n=[];for(let r=0;r<220;r++){let s=t(0,C),i=r%2===0,a=t(.65,2.2),c=(i?-3.22:3.38)+Math.cos(s)*a,l=-.35+Math.sin(s)*a*1.18,f=.016+.12*t(0,1)**4;n.push({position:[c,.01+ge(c,l),l],scale:[f,f*t(.34,.77),f*t(.7,1.3)],yaw:s,tint:t(0,1)})}return{clusters:o,pebbles:n}}function On(e){let{clusters:t,pebbles:o}=hr(e),n=(v,g,y=!1)=>({mesh:v,data:Float32Array.from(g.flat()),castsShadow:y}),r=[n(wt(15,8,"sand",0,80),[ee([0,0,0],[1,1,1],0,0)]),n(wt(18,6,"wall",-3.6),[ee([0,0,0],[1,1,1],0,3)]),n(wt(16,8,"surface",Tt,48),[ee([0,0,0],[1,1,1],0,4)])],s=Array.from({length:4},(v,g)=>Gt(e%193+g*19));for(let v=0;v<s.length;v++){let g=t.filter(y=>y.variant===v);r.push(n(s[v],g.map(y=>ee(y.position,y.scale,y.yaw,1,y.tint)),!0))}r.push(n(Gt(20,1),o.map(v=>ee(v.position,v.scale,v.yaw,1,v.tint)))),r.push(n(wn(e),[ee([-3.09,2.62,-1.45],[.89,1.08,.91],.3,2,.12),ee([-3.9,1.89,-1.05],[.64,.55,.72],-.67,2,.61),ee([-2.53,1.94,-.94],[.42,.56,.42],1.92,2,.31),ee([-2.86,1.02,.64],[.47,.4,.39],-.1,2,.19),ee([3.19,1.94,-1.68],[.62,.63,.62],1.8,2,.83),ee([3.89,1.19,.12],[.45,.41,.41],2.8,2,.37)],!0)),r.push(...En(e,t,s,ee,n));let i=Pn(e),a=ee(ie,[1,1,1],pe,$t);a[10]=1,r.push(n(i.base,[a],!0));let c=Math.cos(pe),l=Math.sin(pe),f=[ie[0]-je[2]*l,ie[1]+je[1],ie[2]+je[2]*c],u=n(i.lid,[ee(f,[1,1,1],pe,$t)]);u.data[10]=1;let d=t.map(({position:v,scale:g,yaw:y})=>({position:v,radii:g.map(A=>A*1.17),yaw:y}));d.push({position:[-3.1,2.96,-1.45],radii:[.95,.63,.83],yaw:0},{position:[3.19,2.2,-1.68],radii:[.63,.48,.63],yaw:0}),d.push({position:[ie[0],.3,ie[2]],radii:[.85,.34,.51],yaw:pe},{position:[f[0]-.13*l,.89,f[2]+.13*c],radii:[.8,.53,.39],yaw:pe});let m=qn.map(v=>({key:v.key,mesh:v.mesh(e),count:v.starts.length}));return{solids:r,swimmers:m,obstacles:d,lid:u,snail:Bn(),seed:e}}var Gn=`// Instancing, water caustics and triplanar detail adapted from Abyssal Garden (MIT).
struct Frame {
  vp: mat4x4f,
  shadow: mat4x4f,
  eyeTime: vec4f,
  lightLevel: vec4f,
  snailGround: vec4f,
};
@group(0) @binding(0) var<uniform> frame: Frame;
@group(0) @binding(1) var detailTexture: texture_2d<f32>;
@group(0) @binding(2) var waterTexture: texture_2d<f32>;
@group(0) @binding(3) var shadowTexture: texture_depth_2d;
@group(0) @binding(4) var tileSampler: sampler;
@group(0) @binding(5) var shadowSampler: sampler_comparison;

const ivoryLettering = vec3f(.95,.88,.73);

struct Vertex {
  @location(0) position: vec3f,
  @location(1) normalAux: vec4f,
  @location(2) centerMaterial: vec4f,
  @location(3) shape: vec4f,
  @location(4) angles: vec4f,
};

struct Sample {
  @builtin(position) clip: vec4f,
  @location(0) world: vec3f,
  @location(1) normal: vec3f,
  @location(2) local: vec3f,
  @location(3) aux: f32,
  @location(4) @interpolate(flat) material: u32,
  @location(5) @interpolate(flat) tint: f32,
};

fn orient(p: vec3f, angles: vec2f) -> vec3f {
  return vec3f(p.x * angles.x - p.z * angles.y, p.y, p.x * angles.y + p.z * angles.x);
}

fn swimRotation(p: vec3f, bank: f32, pitch: f32) -> vec3f {
  let r = vec3f(p.x,cos(bank)*p.y-sin(bank)*p.z,sin(bank)*p.y+cos(bank)*p.z);
  return vec3f(cos(pitch)*r.x-sin(pitch)*r.y,sin(pitch)*r.x+cos(pitch)*r.y,r.z);
}

@vertex fn vsShadow(i: Vertex) -> @builtin(position) vec4f {
  var p = i.position * i.shape.xyz;
  if (i.centerMaterial.w == 9.) { p = hingeVector(p,i.angles.zw); }
  return frame.shadow * vec4f(i.centerMaterial.xyz + orient(p, i.angles.xy), 1.);
}

@vertex fn vsScene(i: Vertex) -> Sample {
  var o: Sample;
  o.material = u32(i.centerMaterial.w);
  var p = i.position;
  var n = i.normalAux.xyz;
  if (o.material == 5u) {
    let phase = i.shape.z;
    let u = clamp((.36 - p.x) / 1.03, 0., 1.);
    let angle = phase - u * 3.9;
    let wave = .195 * u * u + .009;
    let bend = sin(angle) * wave;
    let slope = (cos(angle) * 3.9 * wave - sin(angle) * .39 * u) / 1.03;
    p.z += bend;
    n.x -= slope * n.z;
    let pectoral = smoothstep(.085, .15, abs(i.position.z)) * smoothstep(.0, .045, i.position.x) * step(-.8, i.normalAux.w);
    p.z += pectoral * .033 * sin(phase * 1.7 + i.angles.w) * sign(i.position.z);
    let r = i.shape.y;
    p = vec3f(p.x, cos(r) * p.y - sin(r) * p.z, sin(r) * p.y + cos(r) * p.z);
    n = vec3f(n.x, cos(r) * n.y - sin(r) * n.z, sin(r) * n.y + cos(r) * n.z);
    let x = i.angles.z;
    p = vec3f(cos(x) * p.x - sin(x) * p.y, sin(x) * p.x + cos(x) * p.y, p.z) * i.shape.x;
    n = vec3f(cos(x) * n.x - sin(x) * n.y, sin(x) * n.x + cos(x) * n.y, n.z);
  } else if (o.material == 11u) {
    let phase = i.shape.z;
    let aux = i.normalAux.w;
    if (aux > -.30 && aux < -.02) {
      let arm = mermaidArm(p,n,aux,phase);
      p = arm.position;
      n = arm.normal;
    } else {
      p = mermaidPosition(p,aux,phase);
      n = mermaidNormal(i.position,n,phase);
    }
    let pitch = .34 + i.angles.z*.68;
    let bank = i.shape.y + .12*sin(phase);
    p = swimRotation(p,bank,pitch) * i.shape.x;
    n = swimRotation(n,bank,pitch);
  } else if (o.material == 12u) {
    if (i.normalAux.w > 0. && i.normalAux.w < .34) {
      let fin = pufferFin(p,n,i.normalAux.w,i.shape.z);
      p = fin.position;
      n = fin.normal;
    }
    p = swimRotation(p,i.shape.y,i.angles.z) * i.shape.x;
    n = swimRotation(n,i.shape.y,i.angles.z);
  } else {
    if (o.material == 10u) { p = snailDeform(p,i.normalAux.w,i.shape.w); }
    p *= i.shape.xyz;
    n /= i.shape.xyz;
    if (o.material == 9u) {
      p = hingeVector(p,i.angles.zw);
      n = hingeVector(n,i.angles.zw);
    }
  }
  o.world = i.centerMaterial.xyz + orient(p, i.angles.xy);
  o.normal = orient(n, i.angles.xy);
  if (o.material == 10u) {
    o.world.y += dot(i.angles.zw,(o.world-i.centerMaterial.xyz).xz);
    o.normal -= vec3f(i.angles.z,0.,i.angles.w)*o.normal.y;
  }
  o.local = i.position;
  o.aux = i.normalAux.w;
  o.tint = i.shape.w;
  o.clip = frame.vp * vec4f(o.world, 1.);
  return o;
}

fn detail(uv: vec2f, scale: f32, footprint: f32) -> vec4f {
  let lod = max(0., log2(max(.001, footprint * scale) * 1024.));
  return textureSampleLevel(detailTexture, tileSampler, uv * scale, lod);
}

fn triplanar(p: vec3f, n: vec3f, scale: f32, footprint: f32) -> vec4f {
  let weights = pow(abs(n), vec3f(4.));
  let a = detail(p.zy, scale, footprint);
  let b = detail(p.xz + .31, scale, footprint);
  let c = detail(p.xy + .64, scale, footprint);
  return (weights.x * a + weights.y * b + weights.z * c) / max(.001, dot(weights, vec3f(1.)));
}

fn caustics(p: vec3f, footprint: f32) -> f32 {
  let light = frame.lightLevel.xyz;
  let q = p.xz + light.xz * ((frame.lightLevel.w - p.y) / light.y);
  let lod = max(0., log2(max(.001, footprint) * 98.));
  let a = textureSampleLevel(waterTexture, tileSampler, q * .48, lod).r;
  let b = textureSampleLevel(waterTexture, tileSampler, q.yx * .25 + .31, lod + 1.).r;
  return min(2.25, pow(a, 1.45) * (1.05 + b));
}

fn shadowAt(p: vec3f, normal: vec3f) -> f32 {
  let lp = frame.shadow * vec4f(p + normal * .018, 1.);
  let uv = lp.xy * vec2f(.5,-.5) + .5;
  var light = 0.;
  for (var y = -1; y <= 1; y++) {
    for (var x = -1; x <= 1; x++) {
      let offset = vec2f(f32(x), f32(y)) * (2.4 / 2048.);
      light += textureSampleCompareLevel(shadowTexture, shadowSampler, uv + offset, lp.z - .0008);
    }
  }
  return light / 9.;
}

@fragment fn fsScene(i: Sample, @builtin(front_facing) front: bool) -> @location(0) vec4f {
  let p = i.world;
  let v = normalize(frame.eyeTime.xyz - p);
  let size = max(length(dpdx(p)), length(dpdy(p)));
  let n0 = normalize(i.normal) * select(-1., 1., front);

  if (i.material == 3u) {
    return vec4f(backWall(p,size),1.);
  }

  if (i.material == 4u) {
    return vec4f(waterSurface(p,v),1.);
  }

  let light = shadowAt(p, n0);
  let caustic = caustics(p, size);
  var normal = n0;
  var base = vec3f(.46, .42, .34);
  var gloss = .13;
  var wrap = .0;
  var glow = vec3f(0.);
  var cavity = 1.;

  switch i.material {
    case 0u: {
      let sand = sandSurface(p, n0, size);
      base = sand.color;
      normal = sand.normal;
      gloss = sand.gloss;
      cavity = sand.occlusion;
    }
    case 1u: {
      let rock = rockSurface(p, n0, i.tint, size);
      let ink = fernLettering(p,size);
      base = mix(rock.color,ivoryLettering,ink);
      normal = rock.normal;
      gloss = mix(rock.gloss,.13,ink);
      cavity = mix(rock.occlusion,1.,ink);
      glow = ivoryLettering * (.11 * ink);
    }
    case 2u: {
      let detailA = triplanar(p + i.tint * 4., n0, 2.1, size);
      let detailB = triplanar(p - i.tint * 3., n0, .83, size);
      let color = mix(vec3f(.49,.137,.107), vec3f(.24,.11,.37), smoothstep(.28,.86,i.tint));
      let ends = smoothstep(.52,1.,i.aux);
      base = mix(color * (.56 + .72 * detailA.b), vec3f(.86,.47,.35), ends * .78);
      base *= .74 + .26 * smoothstep(.28,.53,detailB.b);
      normal = normalize(n0 + vec3f(detailA.r - .5,0.,detailA.g - .5) * .48);
      wrap = .18;
      glow = base * (.045 + ends * .075);
    }
    case 6u, 7u, 8u: {
      let colony = coralSurface(i, n0, size);
      base = colony.color;
      normal = colony.normal;
      gloss = colony.gloss;
      cavity = colony.occlusion;
      wrap = .25;
      glow = base * .047;
    }
    case 9u: {
      let ornament = chestSurface(i, n0, size);
      base = ornament.color;
      normal = ornament.normal;
      gloss = ornament.gloss;
      cavity = ornament.occlusion;
      if (i.aux > .42) { glow = base * .11; }
    }
    case 10u: {
      let snail = snailSurface(i,n0,size);
      base = snail.color;
      normal = snail.normal;
      gloss = snail.gloss;
      cavity = snail.occlusion;
    }
    case 11u: {
      let swimmer = mermaidSurface(i,n0,size);
      base = swimmer.color;
      normal = swimmer.normal;
      gloss = swimmer.gloss;
      cavity = swimmer.occlusion;
      wrap = .18;
      glow = base * .077;
    }
    case 12u: {
      let puffer = pufferSurface(i,n0,size);
      base = puffer.color;
      gloss = puffer.gloss;
      cavity = puffer.occlusion;
      wrap = .27;
      glow = base * .048;
    }
    default: {
      let body = i.local;
      let back = smoothstep(.02,.37,body.y);
      let belly = 1. - smoothstep(-.257,-.095,body.y);
      let scales = detail(vec2f(body.x + .23 * body.y, body.y), 3.3, size);
      let gillCurve = (body.x - .192 + .60 * body.y * body.y - .12 * body.y) * 57.;
      let gill = exp(-gillCurve * gillCurve);
      let gillMask = (1. - smoothstep(.11,.18,abs(body.y + .019))) * smoothstep(.035,.076,abs(body.z));
      let mouthCurve = (body.y + .066) * 151.;
      let mouth = exp(-mouthCurve * mouthCurve) * smoothstep(.418,.48,body.x);
      base = mix(vec3f(.96,.73,.017), vec3f(.80,.521,.012), back * .54);
      base = mix(base, vec3f(.97,.80,.10), belly * .46);
      base *= (.91 + scales.b * .18) * (1. - .21 * gill * gillMask - .20 * mouth) * (.93 + .12 * i.tint);
      gloss = .25;
      wrap = .19;
      if (i.aux > -.8 && i.aux < -.2) {
        let edge = smoothstep(-.64,-.29,i.aux);
        let ribs = .87 + .13 * sin((body.x - body.y * .24) * 235. + body.y * 12.);
        let tail = 1. - smoothstep(-.61,-.40,body.x);
        base = mix(vec3f(.86,.600,.024), vec3f(.93,.782,.167), edge * .73) * ribs;
        base = mix(base, vec3f(.87,.737,.056) * ribs, tail * .42);
        glow = base * (.046 + edge * .075);
        wrap = .48;
        gloss = .15;
      }
      if (i.aux > -.18) {
        base = vec3f(.009,.012,.009);
        gloss = .89;
        if (i.aux > .31) { base = vec3f(.76,.501,.055); gloss = .53; }
        if (i.aux > .87) { base = vec3f(.85,.82,.52); gloss = .26; }
      }
    }
  }

  var color = inWater(p, tankLight(p,normal,v,base,glow,wrap,gloss,cavity,light,caustic));
  if (i.material == 0u) {
    color *= snailShade(p);
    let rear = 1. - smoothstep(-3.60, -1.63, p.z);
    color = mix(color, backColor(vec3f(p.x,0.,-3.6)), rear * rear);
  }
  return vec4f(color,1.);
}
`;var Hn=`struct Surface {
  color: vec3f,
  normal: vec3f,
  gloss: f32,
  occlusion: f32,
};

struct RockTile {
  height: f32,
  stain: f32,
  slope: vec3f,
};

fn rockTile(p: vec3f, w: vec3f, scale: f32, footprint: f32) -> RockTile {
  let x = detail(p.zy, scale, footprint);
  let y = detail(p.xz + .31, scale, footprint);
  let z = detail(p.xy + .64, scale, footprint);
  let slope = (vec3f(0., x.g - .5, x.r - .5) * w.x +
    vec3f(y.r - .5, 0., y.g - .5) * w.y + vec3f(z.r - .5, z.g - .5, 0.) * w.z) * 2.;
  return RockTile(dot(w,vec3f(x.b,y.b,z.b)),dot(w,vec3f(x.a,y.a,z.a)),slope);
}

fn rockSurface(p: vec3f, n: vec3f, tint: f32, footprint: f32) -> Surface {
  let weights = pow(abs(n), vec3f(5.));
  let w = weights / max(.001, dot(weights,vec3f(1.)));
  let origin = p + vec3f(.67,.21,.93) * tint * 11.;
  let bedrock = rockTile(origin,w,.22,footprint);
  let pores = rockTile(origin + .91,w,.76,footprint);
  let grain = rockTile(origin + .27,w,2.45,footprint);
  let strata = .5 + .5 * sin(p.y * 22. + p.x * 2.5 + 11. * bedrock.stain);
  let chips = smoothstep(.37,.61,bedrock.height * .48 + pores.height * .52);
  let weathering = smoothstep(.30,.70,bedrock.stain * .78 + tint * .16 + strata * .10);
  let stone = mix(vec3f(.099,.099,.090), vec3f(.37,.305,.23), weathering);
  let coralline = smoothstep(.46,.65,bedrock.stain * .62 + pores.stain * .4 + grain.height * .12);
  let algae = smoothstep(.50,.63,bedrock.height * .52 + pores.stain * .34 + max(n.y,0.) * .21);
  var color = mix(stone, vec3f(.235,.070,.108), coralline * (.81 - algae * .29));
  color = mix(color, vec3f(.080,.110,.052), algae * .68);
  let expanse = smoothstep(.34,.49,pores.height * .71 + grain.height * .29);
  let paleEdges = smoothstep(.56,.67,pores.height) * smoothstep(.49,.64,grain.height);
  color *= .57 + chips * .35 + expanse * .33;
  color += vec3f(.19,.144,.106) * paleEdges;
  let slope = bedrock.slope * .29 + pores.slope * .87 + grain.slope * .39;
  let tangentSlope = slope - n * dot(n,slope);
  return Surface(color, normalize(n + tangentSlope), .07 + .10 * paleEdges, .45 + expanse * .55);
}

fn sandSurface(p: vec3f, n: vec3f, footprint: f32) -> Surface {
  let field = detail(p.xz + .21, .22, footprint);
  let sand = detail(p.xz, 2.9, footprint);
  let ripples = cos(p.z * 15.6 + p.x * 1.5 + 5.2 * field.a + .65 * sin(p.x * 4.));
  let ridge = pow(.5 + .5 * ripples, 3.);
  let grains = smoothstep(.38,.62,sand.b);
  let color = vec3f(.56,.477,.359) * (.66 + .32 * grains + .15 * field.a + .10 * ridge);
  let nBump = vec3f((sand.r-.5)*.16, 0., (sand.g-.5)*.16 + .072*ripples);
  return Surface(color, normalize(n+nBump), .045, .86 + .14 * grains);
}

fn coralSurface(i: Sample, n: vec3f, footprint: f32) -> Surface {
  let s = triplanar(i.world + i.tint * 4., n, 2.45, footprint);
  let pores = smoothstep(.38,.60,s.b);
  let textureNormal = normalize(n + vec3f(s.r-.5,0.,s.g-.5) * .39);
  if (i.material == 6u) {
    let lip = smoothstep(.67,.99,i.aux);
    let tissue = mix(vec3f(.41,.138,.054),vec3f(.21,.051,.231),smoothstep(.17,.76,i.tint));
    return Surface(mix(tissue*(.76+.45*pores),vec3f(.88,.46,.32),lip*.59),textureNormal,.21,.73+.27*pores);
  }
  if (i.material == 7u) {
    let channels = smoothstep(.10,.63,i.aux);
    let color = mix(vec3f(.33,.32,.061),vec3f(.055,.38,.29),smoothstep(.17,.84,i.tint));
    let lit = color * (.38 + channels*.80) + channels*vec3f(.082,.067,.034);
    return Surface(lit*(.78+.36*pores),textureNormal,.26,.66+.34*channels);
  }
  let fan = mix(vec3f(.46,.091,.056),vec3f(.305,.083,.38),smoothstep(.21,.69,i.tint));
  let tip = smoothstep(.49,1.,i.aux);
  return Surface(mix(fan*(.68+.38*pores),vec3f(.70,.32,.24),tip*.66),textureNormal,.13,.80+.20*pores);
}
`;var Vn=`fn square(x: f32) -> f32 { return x*x; }

// Two overlapping pools from the tank's overhead light bar.
fn lightPools(p: vec3f) -> vec2f {
  let below = max(0., 4.67 - p.y);
  let spread = 1. + .18 * below;
  let left = (p.x + 2.05 - .24 * below) / spread;
  let right = (p.x - 3.20 + .13 * below) / spread;
  return exp(-vec2f(.34 * left * left, .45 * right * right));
}

fn backColor(p: vec3f) -> vec3f {
  let pools = lightPools(p);
  let fade = smoothstep(.25,4.67,p.y);
  let shelf = smoothstep(-.31,1.78,p.y) * (1. - smoothstep(1.65,4.62,p.y));
  let base = mix(vec3f(.0045,.010,.020),vec3f(.011,.042,.070),fade);
  return base + fade*fade * (vec3f(.019,.080,.097)*pools.x + vec3f(.021,.045,.083)*pools.y)
    + vec3f(.002,.010,.013) * shelf;
}

fn backWall(p: vec3f, footprint: f32) -> vec3f {
  let mottle = detail(p.xy * vec2f(.62,1.) + .42,.24,footprint).a;
  let ripple = caustics(p,footprint*2.3);
  let pools = lightPools(p);
  let grazing = smoothstep(1.5,4.62,p.y);
  let wash = (.12 + .20*ripple) * grazing * (.76*pools.x + .27*pools.y);
  let panel = backColor(p) * (.89 + .20*mottle);
  return panel + vec3f(.021,.068,.091)*wash;
}

fn waterSurface(p: vec3f, view: vec3f) -> vec3f {
  let a = textureSampleLevel(waterTexture,tileSampler,p.xz*vec2f(.45,.24),.7).ba;
  let b = textureSampleLevel(waterTexture,tileSampler,p.zx*vec2f(.48,.35)+.43,1.25).ab;
  let normal = normalize(vec3f(a.x*1.9+b.x*.80,-1.,a.y*1.8+b.y*.82));
  let reflected = reflect(-view,normal);
  let led = exp(-13.*square(reflected.z-.46));
  let grazed = pow(clamp(1.-abs(dot(normal,view)),0.,1.),3.4);
  let pools = lightPools(p);
  let high = pow(clamp(.61 + .65*a.x + .41*b.y,0.,1.),4.7);
  let base = vec3f(.012,.039,.057) + vec3f(.019,.047,.076)*grazed;
  let reflection = vec3f(.25,.46,.60) * led * high * (.34+.54*pools.x+.25*pools.y);
  let join = smoothstep(-3.63,-2.83,p.z);
  return mix(backColor(p)*.88,base+reflection,join);
}

fn tankLight(p: vec3f, n: vec3f, view: vec3f, base: vec3f, glow: vec3f, wrap: f32,
  gloss: f32, cavity: f32, visibility: f32, caustic: f32) -> vec3f {
  let l = frame.lightLevel.xyz;
  let pools = lightPools(p);
  let upper = clamp(n.y*.51+.49,0.,1.);
  let diffuse = clamp((dot(n,l)+wrap)/(1.+wrap),0.,1.);
  let fill = .24 * max(0.,dot(n,vec3f(.27,.22,.94)));
  let rim = max(0.,dot(n,vec3f(.20,.35,-.915))) * (.10+.18*pools.y);
  let shade = mix(vec3f(.086,.145,.195),vec3f(.27,.33,.38),upper);
  let key = vec3f(1.26,1.16,.98) * (.76+.36*pools.x);
  let waterLight = vec3f(.66,.91,1.10) * (.40 * caustic) * (.55+.45*pools.x);
  let diffuseLight = (shade+fill*vec3f(.87,.89,.79)+rim*vec3f(.19,.54,.85))*cavity
    + (key+waterLight)*visibility*diffuse*mix(.56,1.,cavity);
  let halfVector = normalize(l+view);
  let specular = pow(max(0.,dot(n,halfVector)),mix(16.,91.,gloss))*visibility*gloss*(.57+.21*caustic);
  let sheen = pow(1.-max(0.,dot(n,view)),3.)*gloss*.21;
  return base*diffuseLight + glow + specular*vec3f(1.,.96,.80) + sheen*vec3f(.22,.58,.81);
}

fn inWater(p: vec3f, color: vec3f) -> vec3f {
  let depthFromGlass = max(0.,3.05-p.z);
  let transmission = exp(-depthFromGlass*vec3f(.118,.044,.028));
  let haze = backColor(vec3f(p.x,p.y,-3.6))*(1.-exp(-depthFromGlass*.145));
  return color*transmission+haze;
}
`;var $n=`fn hingeVector(p: vec3f, angles: vec2f) -> vec3f {
  return vec3f(p.x, p.y * angles.x + p.z * angles.y, p.z * angles.x - p.y * angles.y);
}

fn chestSurface(i: Sample, n: vec3f, footprint: f32) -> Surface {
  if (i.aux > .96) { return Surface(ivoryLettering,n,.13,1.); }
  let p = i.local;
  let grain = detail(vec2f((p.x + .73 * p.z) * .32, p.y * 3.85 + p.z * 2.1), .95, footprint * 2.);
  let stains = detail(p.xz * .91 + p.y * .55, .93, footprint).a;
  if (i.aux > .80) {
    let color = mix(vec3f(.61,.57,.43),vec3f(.88,.81,.65),stains);
    return Surface(color,n,.80,1.);
  }
  if (i.aux > .42) {
    return Surface(mix(vec3f(.46,.26,.071),vec3f(.91,.62,.22),stains),n,.83,1.);
  }
  if (i.aux > .02) {
    let patina = smoothstep(.44,.65,stains * .70 + grain.a * .37);
    let brass = mix(vec3f(.46,.275,.075),vec3f(.16,.32,.24),patina * .92);
    return Surface(brass*(.76+.31*grain.b),n,.43,.91);
  }
  if (i.aux < -.86) {
    return Surface(vec3f(.022,.011,.013),n,.06,.54);
  }
  let wood = mix(vec3f(.135,.044,.055),vec3f(.34,.110,.097),smoothstep(.30,.68,grain.a));
  return Surface(wood*(.60+(i.aux+.60)*1.1+.40*grain.b),n,.17,.83);
}

struct Bubble {
  @builtin(position) clip: vec4f,
  @location(0) uv: vec2f,
  @location(1) fades: vec2f,
};

@vertex fn vsBubble(@builtin(vertex_index) id: u32, @location(0) centerRadius: vec4f, @location(1) info: vec4f) -> Bubble {
  let uv = vec2f(f32(id & 1u),f32(id >> 1u))*2. - 1.;
  let wobble = sin(info.y) * .11;
  let up = vec3f(0.,.998,-.055);
  let center = centerRadius.xyz + vec3f(uv.x*(1.+wobble),0.,0.)*centerRadius.w + up*uv.y*(1.-wobble*.65)*centerRadius.w;
  return Bubble(frame.vp * vec4f(center,1.),uv,vec2f(info.x,info.y));
}

@fragment fn fsBubble(i: Bubble) -> @location(0) vec4f {
  let shape = length(i.uv);
  let edge = smoothstep(.65,.94,shape);
  let outline = 1. - smoothstep(.90,1.,shape);
  let glossPoint = i.uv - vec2f(-.36 + .055*sin(i.fades.y),.50);
  let glint = exp(-dot(glossPoint,glossPoint)*44.);
  let opposite = i.uv - vec2f(.54,-.50);
  let bounce = exp(-dot(opposite,opposite)*47.) * .54;
  let rimShade = clamp(.54 + .33*i.uv.y - .34*i.uv.x, .22, .94);
  let alpha = clamp(.034 + edge*rimShade + glint*.86 + bounce*.44, 0., .92) * outline * i.fades.x;
  let color = mix(vec3f(.19,.44,.60),vec3f(.85,.99,1.17),clamp(edge*.57 + glint + bounce,0.,1.));
  return vec4f(color*alpha,alpha);
}
`;var jn=`fn snailDeform(p: vec3f, material: f32, phase: f32) -> vec3f {
  var shape = p;
  if (material < -.50) {
    let foot = 1. - smoothstep(.015,.095,p.y);
    shape.z += sin(phase*3. - p.x*24.) * .0048 * foot;
    let reach = smoothstep(.215,.40,p.x) * smoothstep(.11,.253,p.y);
    shape.z += sin(phase*2. + sign(p.z)*1.24) * .027 * reach;
    shape.y += cos(phase + sign(p.z)*.82) * .020 * reach;
  }
  return shape;
}

fn shellStroke(p: vec2f, start: vec2f, end: vec2f) -> f32 {
  let edge = end - start;
  let along = clamp(dot(p-start,edge) / dot(edge,edge),0.,1.);
  return length(p-start-edge*along);
}

fn shellInitials(p: vec3f, color: vec3f, footprint: f32) -> vec3f {
  if (p.y < .31 || p.y > .405 || abs(p.x+.14) > .081 || abs(p.z) < .028) { return color; }
  // Project onto the upper shell from both sides so the initials read left to right on each pass.
  let q = vec2f((p.x+.14)*sign(p.z),p.y-.322);
  let hook = vec2f(-.030,.018);
  let bottom = vec2f(-.043,.004);
  let j = min(min(shellStroke(q,vec2f(-.061,.064),vec2f(-.020,.064)),
      shellStroke(q,vec2f(-.030,.064),hook)),
    min(shellStroke(q,hook,bottom),shellStroke(q,bottom,vec2f(-.061,.012))));
  let left = vec2f(.007,.004);
  let middle = vec2f(.024,.045);
  let right = vec2f(.042,.004);
  let w = min(min(shellStroke(q,vec2f(-.007,.064),left),shellStroke(q,left,middle)),
    min(shellStroke(q,middle,right),shellStroke(q,right,vec2f(.063,.064))));
  let distance = min(j,w);
  let feather = clamp(footprint*.56,.0013,.005);
  let edge = 1. - smoothstep(.0085-feather,.0085+feather,distance);
  let ink = 1. - smoothstep(.0055-feather,.0055+feather,distance);
  return mix(mix(color,vec3f(.075,.034,.022),.73*edge),vec3f(.96,.88,.72),ink);
}

fn snailSurface(i: Sample, n: vec3f, footprint: f32) -> Surface {
  if (i.aux < -.87) {
    return Surface(vec3f(.025,.016,.012),n,.73,.8);
  }
  let flakes = triplanar(i.local,n,3.6,footprint);
  if (i.aux < -.50) {
    let skin = mix(vec3f(.084,.060,.041),vec3f(.32,.248,.153),smoothstep(.35,.64,flakes.a));
    let sole = smoothstep(-.70,-.56,i.aux);
    return Surface(skin*(.88+.29*flakes.b) + .058*(1.-sole),n,.29,.86);
  }
  if (i.aux > .79) {
    return Surface(vec3f(.65,.445,.263)*(.77+.33*flakes.a),n,.41,.94);
  }
  let striation = .5+.5*sin(i.aux*156. + flakes.a*3.2);
  let markings = .5+.5*sin(i.aux*94. + i.local.z*28. + flakes.a*2.5);
  let amber = mix(vec3f(.23,.096,.033),vec3f(.58,.345,.13),smoothstep(.18,.76,markings));
  let lightBand = smoothstep(.47,.73,flakes.a*.82 + striation*.33);
  let color = mix(amber,vec3f(.79,.61,.36),lightBand*.65) * (.67 + .47*flakes.b + .16*striation);
  return Surface(shellInitials(i.local,color,footprint),n,.37,.92);
}

fn snailShade(p: vec3f) -> f32 {
  let dx = p.xz - frame.snailGround.xy;
  let facing = frame.snailGround.zw;
  if (all(facing == vec2f(0.))) { return 1.; }
  let local = vec2f(dot(dx,facing)+.051,dot(dx,vec2f(-facing.y,facing.x)));
  let relative = local/vec2f(.28,.13);
  return 1. - .44*exp(-dot(relative,relative)*1.65);
}
`;var Wn=`struct MermaidArm {
  position: vec3f,
  normal: vec3f,
};

fn mermaidArm(p: vec3f, n: vec3f, aux: f32, phase: f32) -> MermaidArm {
  // The arm mesh encodes shoulder-to-fingertip progress in its skin material.
  let progress = clamp((aux + .28)/.24,0.,1.);
  let side = sign(p.y);
  let shoulder = vec3f(.250,side*.080,.010);
  let elbow = vec3f(.123,side*.125,.012);
  let shoulderWeight = smoothstep(0.,.23,progress);
  let elbowWeight = smoothstep(.38,.63,progress);
  let sweep = -side * (.040 + .083 * sin(phase + side*.96)) * shoulderWeight;
  let flex = (-.080 - .052*side + .125 * sin(phase + side*.96 - .7)) * elbowWeight;
  let elbowAngle = vec2f(cos(flex),sin(flex));
  let bent = elbow + orient(p-elbow,elbowAngle);
  return MermaidArm(shoulder+swimRotation(bent-shoulder,0.,sweep),
    swimRotation(orient(n,elbowAngle),0.,sweep));
}

fn mermaidPosition(p: vec3f, material: f32, phase: f32) -> vec3f {
  var moved = p;
  let tail = clamp((.06-p.x)/.69,0.,1.26);
  let wave = phase - tail*4.5;
  moved.y += sin(wave)*tail*tail*.105;
  moved.z += cos(wave)*tail*tail*.049;
  if (material < -.71) {
    let tip = (material+1.)*4.3;
    moved.y += sin(phase+p.y*19.)*.028*tip;
    moved.z += cos(phase+p.x*20.)*.044*tip;
  }
  return moved;
}

fn mermaidNormal(p: vec3f, n: vec3f, phase: f32) -> vec3f {
  let tail = clamp((.06-p.x)/.69,0.,1.26);
  let wave = phase-tail*4.5;
  let dy = (2.*tail*sin(wave)-4.5*tail*tail*cos(wave)) * (-.105/.69);
  let dz = (2.*tail*cos(wave)+4.5*tail*tail*sin(wave)) * (-.049/.69);
  return vec3f(n.x-dy*n.y-dz*n.z,n.yz);
}

fn mermaidSurface(i: Sample, n: vec3f, footprint: f32) -> Surface {
  if (i.aux < -.71) {
    let strands = .5+.5*sin((i.local.y*1.9 + i.local.z)*390. + i.local.x*41.);
    let copper = mix(vec3f(.113,.024,.019),vec3f(.45,.118,.060),strands*.58+.14);
    return Surface(copper,n,.43,.93);
  }
  if (i.aux < -.59) { return Surface(vec3f(.036,.016,.012),n,.22,1.); }
  if (i.aux < -.45) { return Surface(vec3f(.49,.115,.12),n,.38,1.); }
  if (i.aux < 0.) {
    let blush = exp(-34.*length(i.local.xy-vec2f(.357,.035))) * smoothstep(.03,.063,i.local.z);
    let rose = mix(vec3f(.73,.374,.236),vec3f(.89,.355,.284),blush);
    return Surface(rose,n,.245,1.);
  }
  if (i.aux > .91) { return Surface(vec3f(.95,.62,.22),n,.67,1.); }
  if (i.aux > .73) {
    let silk = .79+.21*cos((i.local.y+i.local.z*.76)*166.+i.local.x*15.);
    return Surface(vec3f(.308,.106,.40)*silk,n,.36,.96);
  }
  if (i.aux > .49) {
    let edge = smoothstep(.59,.67,i.aux);
    let ribs = .87+.13*sin((i.local.y*2.1+i.local.x)*175.);
    let color = mix(vec3f(.046,.47,.44),vec3f(.35,.78,.67),edge)*ribs;
    return Surface(color,n,.27,1.);
  }
  let cells = detail(vec2f(i.local.x*.8,(i.local.y+i.local.z)*1.7),1.8,footprint).a;
  let scaleRow = .5+.5*cos(i.local.x*160.+sin((i.local.y+i.local.z)*145.)*1.7);
  let highlights = clamp(.24+.44*cells+.29*scaleRow,0.,1.);
  let tail = mix(vec3f(.022,.24,.25),vec3f(.14,.64,.55),highlights);
  return Surface(tail,n,.47,.94);
}
`;var Yn=`struct PufferPose {
  position: vec3f,
  normal: vec3f,
};

fn pufferFin(p: vec3f, n: vec3f, aux: f32, phase: f32) -> PufferPose {
  let edge = clamp((aux-.045)/.245,0.,1.);
  if (abs(p.z) > .29 && p.x > -.33) {
    let side = sign(p.z);
    let root = vec3f(.046,-.046,side*.357);
    let beat = side * (.16 + .39*sin(phase*2. + side*.55)) * edge;
    let sweep = .13*cos(phase*2. + side*.55) * edge;
    return PufferPose(root+swimRotation(p-root,beat,sweep),swimRotation(n,beat,sweep));
  }
  let tail = p.x < -.46;
  let root = vec3f(select(-.30,-.49,tail),p.y,0.);
  let beat = sin(phase + p.x*2.1) * edge * select(.37,.65,tail);
  let yaw = vec2f(cos(beat),sin(beat));
  return PufferPose(root+orient(p-root,yaw),orient(n,yaw));
}

fn pufferSpots(p: vec3f, footprint: f32) -> f32 {
  let heights = p.y / .395;
  let angle = atan2(p.z,p.x)*.15915494+.5;
  let uv = vec2f(angle*27., (heights+.9)*7.1 + .49*sin(angle*50.26548));
  let cell = floor(uv);
  let cellX = cell.x - floor(cell.x/27.)*27.;
  let noise = fract(sin(dot(vec2f(cellX,cell.y),vec2f(17.37,52.43)))*8281.21);
  let center = vec2f(.5) + .23*(vec2f(noise,fract(noise*15.39))-.5);
  let radius = .14 + .18*fract(noise*6.32);
  let feather = clamp(footprint*11.,.026,.13);
  let dotMark = 1. - smoothstep(radius-feather,radius+feather,length(fract(uv)-center));
  return dotMark * smoothstep(-.78,-.11,heights) * (1.-smoothstep(.89,1.,abs(heights))) * (.64 + .36*noise);
}

fn pufferSurface(i: Sample, n: vec3f, footprint: f32) -> Surface {
  let p = i.local;
  if (i.aux > .88) { return Surface(vec3f(.82,.92,.88),n,.88,1.); }
  if (i.aux > .65) { return Surface(vec3f(.012,.016,.012),n,.96,1.); }
  if (i.aux > .52) { return Surface(vec3f(.40,.284,.103),n,.71,1.); }
  if (i.aux > .36) { return Surface(vec3f(.67,.49,.23),n,.40,1.); }
  if (i.aux > 0.) {
    let edge = smoothstep(.07,.28,i.aux);
    let ribs = .85 + .15 * cos((p.y + .65*abs(p.z))*158. + p.x*17.);
    let color = mix(vec3f(.43,.27,.10),vec3f(.85,.68,.37),edge*.84)*ribs;
    return Surface(color,n,.23,.98);
  }
  if (i.aux > -.13) { return Surface(vec3f(.055,.023,.018),n,.53,1.); }
  if (i.aux > -.26) { return Surface(vec3f(.55,.33,.19),n,.39,1.); }

  let dorsal = smoothstep(-.04,.33,p.y);
  let belly = 1. - smoothstep(-.24,-.085,p.y + .045*sin(p.x*13.));
  let sideTone = mix(vec3f(.71,.49,.233),vec3f(.42,.30,.138),dorsal);
  var color = mix(sideTone,vec3f(.94,.85,.661),belly);
  if (i.aux > -.82) {
    let tip = smoothstep(-.65,-.34,i.aux);
    let spine = mix(color*.83,vec3f(.29,.195,.104),tip*.72);
    return Surface(spine,n,.25,.97);
  }
  let cheek = smoothstep(.22,.42,p.x);
  let spots = pufferSpots(p,footprint) * (1. - .83*cheek);
  let grain = detail(vec2f(p.x+.3*p.z,p.y),2.8,footprint).b;
  let gillLine = (p.x - .09 + .92*(p.y+.06)*(p.y+.06)) * 135.;
  let gill = exp(-gillLine*gillLine) * smoothstep(.29,.35,abs(p.z)) * (1.-smoothstep(.096,.16,abs(p.y+.03)));
  color = mix(color*(.93+.15*grain),vec3f(.09,.049,.024),spots*.88) * (1.-.35*gill);
  return Surface(color,n,.29,1.);
}
`;var Kn=`// Adapted from Abyssal Garden by Maksymilian Dendura (MIT). See LICENSE.\r
@vertex fn vs(@builtin(vertex_index) i: u32) -> @builtin(position) vec4f { return vec4f(f32(i32(i & 1u) * 4 - 1), f32(i32(i >> 1u) * 4 - 1), 0., 1.); }\r
@group(0) @binding(0) var<uniform> tm: vec4f;\r
const TAU = 6.283185307;\r
// Quantize wave frequencies to whole cycles over the app's 360 second clock.\r
fn phase(rate: f32) -> f32 { return tm.x * round(rate * (360. / TAU)) * (TAU / 360.); }\r
fn caus(uv: vec2f) -> f32 {\r
  let p = uv * 6.2831853;\r
  var i = p; var c = 0.;\r
  for (var n = 1; n <= 5; n++) {\r
    let rate = 1. - 3.5 / f32(n);\r
    let tt = phase(.45 * rate) + 23. * rate;\r
    i = p + vec2f(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));\r
    let s = sin(i.x + tt); let k = cos(i.y + tt);\r
    c += abs(s * k) / (1.25 * sqrt(s * s + k * k) + 1e-4);\r
  }\r
  c = 1.17 - pow(c / 5., 1.4);\r
  return pow(abs(c), 8.);\r
}\r
const WK = array<vec3f, 10>(vec3f(1., 2., 1.), vec3f(-2., 1., .9), vec3f(3., 1., .6), vec3f(1., -4., .5), vec3f(4., 3., .4),\r
  vec3f(-3., 5., .32), vec3f(6., -2., .28), vec3f(5., 7., .2), vec3f(-8., 3., .18), vec3f(2., 11., .14));\r
@fragment fn fs(@builtin(position) fc: vec4f) -> @location(0) vec4f {\r
  let uv = fc.xy / 256.;\r
  let c = caus(uv);\r
  let wu = uv + .02 * vec2f(sin(TAU * uv.y * 2. + phase(TAU * .1)), cos(TAU * uv.x * 3. + phase(-TAU * .07)));\r
  var s = vec2f(0.);\r
  for (var i = 0; i < 10; i++) {\r
    let k = WK[i];\r
    let speed = (.5 + .35 * sqrt(length(k.xy))) * select(-1., 1., (i & 1) == 0);\r
    s += k.xy * k.z * cos(dot(k.xy, wu) * TAU + phase(speed) + f32(i) * 1.7);\r
  }\r
  return vec4f(c, c, s * .06);\r
}\r
`;var Xn=`// Adapted from Abyssal Garden by Maksymilian Dendura (MIT). See LICENSE.\r
fn ss(a: f32, b: f32, x: f32) -> f32 { let t = clamp((x - a) / (b - a), 0., 1.); return t * t * (3. - 2. * t); }\r
fn h31(p: vec3f) -> f32 { var q = fract(p * vec3f(.1031, .1030, .0973)); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }\r
fn h33(p: vec3f) -> vec3f { var q = fract(p * vec3f(.1031, .1030, .0973)); q += dot(q, q.yxz + 33.33); return fract((q.xxy + q.yxx) * q.zyx); }\r
@vertex fn vs(@builtin(vertex_index) i: u32) -> @builtin(position) vec4f { return vec4f(f32(i32(i & 1u) * 4 - 1), f32(i32(i >> 1u) * 4 - 1), 0., 1.); }\r
fn hp(p: vec2f, per: f32) -> f32 { return h31(vec3f(p - per * floor(p / per), per)); }\r
fn tn(p: vec2f, per: f32) -> f32 {\r
  let i = floor(p); let f = fract(p); let u = f * f * (3. - 2. * f);\r
  return mix(mix(hp(i, per), hp(i + vec2f(1., 0.), per), u.x), mix(hp(i + vec2f(0., 1.), per), hp(i + vec2f(1., 1.), per), u.x), u.y);\r
}\r
fn tf(uv: vec2f, per: f32, n: i32) -> f32 { var a = .5; var s = 0.; var pr = per; for (var i = 0; i < n; i++) { s += a * tn(uv * pr + f32(i) * 7.3, pr); pr *= 2.; a *= .5; } return s / (1. - 2. * a); }\r
fn tw(p: vec2f, per: f32) -> vec3f {\r
  let i = floor(p); let f = fract(p); var d = vec2f(9.); var id = 0.;\r
  for (var x = -1; x <= 1; x++) { for (var y = -1; y <= 1; y++) {\r
    let o = vec2f(f32(x), f32(y)); let c = i + o; let cw = c - per * floor(c / per);\r
    let hh = h33(vec3f(cw, per)); let r = o + hh.xy - f; let l = dot(r, r);\r
    if (l < d.x) { d.y = d.x; d.x = l; id = hh.z; } else if (l < d.y) { d.y = l; }\r
  } }\r
  return vec3f(sqrt(d), id);\r
}\r
fn H(uv: vec2f) -> f32 {\r
  let warp = uv + .072 * (vec2f(tf(uv, 5., 4), tf(uv + .46, 5., 4)) - .5);\r
  let mantle = tf(warp, 4., 7);\r
  let ridge = abs(tf(warp + 1.73, 7., 5) * 2. - 1.);\r
  let fracture = ss(.013, .096, ridge);\r
  let large = tw(warp * 24., 24.);\r
  let fine = tw((warp.yx + .19) * 57., 57.);\r
  let largePore = (1. - ss(.11, .40 + .10 * large.z, large.x)) * ss(.18, .54, large.z);\r
  let smallPore = (1. - ss(.03, .35, fine.x)) * ss(.14, .55, fine.z);\r
  let rim = ss(.26,.44,large.x) * (1. - ss(.46,.62,large.x)) * ss(.28,.58,large.z);\r
  return .25 + mantle * .43 + fracture * .14 + rim * .075 - largePore * .28 - smallPore * .10;\r
}\r
@fragment fn fs(@builtin(position) fc: vec4f) -> @location(0) vec4f {\r
  let uv = fc.xy / 1024.; let e = 1. / 1024.;\r
  let h = H(uv);\r
  let gx = H(uv + vec2f(e, 0.)) - H(uv - vec2f(e, 0.)); let gy = H(uv + vec2f(0., e)) - H(uv - vec2f(0., e));\r
  let s = clamp(vec2f(gx, gy) * 1024. * .5 * .026, vec2f(-1.), vec2f(1.));\r
  return vec4f(-s * .5 + .5, h, tf(uv + 3.7, 3., 6));\r
}\r
`;var Qn=`@group(0) @binding(0) var image: texture_2d<f32>;
@group(0) @binding(1) var linear: sampler;

struct Vertex { @builtin(position) position: vec4f, @location(0) uv: vec2f };

@vertex fn vs(@builtin(vertex_index) i: u32) -> Vertex {
  var v: Vertex;
  let uv = vec2f(f32((i << 1u) & 2u),f32(i & 2u));
  v.position = vec4f(uv * vec2f(2.,-2.) + vec2f(-1.,1.),0.,1.);
  v.uv = uv;
  return v;
}

@fragment fn mip(v: Vertex) -> @location(0) vec4f {
  return textureSampleLevel(image,linear,v.uv,0.);
}

fn tone(c: vec3f) -> vec3f {
  return c / (vec3f(1.) + c * .62);
}

@fragment fn present(v: Vertex) -> @location(0) vec4f {
  let uv = v.uv;
  let c = textureSampleLevel(image,linear,uv,0.).rgb;
  let edge = pow(abs(uv.x * 2. - 1.), 7.);
  let vignette = 1. - .17 * (uv.x - .42) * (uv.x - .42) - .14 * (uv.y - .46) * (uv.y - .46);
  let diagonal = uv.x + .044 * uv.y;
  let softReflection = exp(-2800. * (diagonal-.05) * (diagonal-.05));
  let glass = vec3f(.013,.019,.025) * (edge * (.14 + .23 * exp(-8. * uv.y)) + softReflection * .18);
  let mapped = clamp(tone(max(vec3f(0.), c * vignette + glass)), vec3f(0.), vec3f(1.));
  let rgb = select(12.92 * mapped, 1.055 * pow(mapped,vec3f(1./2.4)) - .055, mapped > vec3f(.0031308));
  let dither = fract(52.9829189 * fract(dot(v.position.xy, vec2f(.06711056,.00583715)))) - .5;
  return vec4f(rgb + dither / 255.,1.);
}
`;var Zn=([e,t])=>`vec2f(${e.toFixed(6)},${t.toFixed(6)})`,Ar=Mt("Fern").flatMap(e=>e.slice(1).map((t,o)=>`distanceToInk = min(distanceToInk, letterStroke(q,${Zn(e[o])},${Zn(t)}));`)),Jn=`
fn letterStroke(p: vec2f, start: vec2f, end: vec2f) -> f32 {
  let line = end - start;
  return length(p - start - line * clamp(dot(p - start,line) / dot(line,line),0.,1.));
}

fn fernLettering(p: vec3f, footprint: f32) -> f32 {
  if (abs(p.x+2.16) > .37 || abs(p.y-1.04) > .24 || abs(p.z) > .65) { return 0.; }
  let clip = frame.vp * vec4f(p,1.);
  // The projector uses the fixed front view. Match the chest lettering's projected scale.
  let q = (clip.xy / clip.w - vec2f(-.450,-.478)) * vec2f(4.65,2.53) + vec2f(0.,.048);
  if (abs(q.x) > .114 || abs(q.y-.048) > .062) { return 0.; }
  var distanceToInk = 1.;
  ${Ar.join(`
  `)}
  let feather = clamp(footprint*.53,.0011,.0063);
  return 1. - smoothstep(${.0065}-feather,${.0065}+feather,distanceToInk);
}
`;var Pt=[0,2.93,11.15],st=j(-.46,.86,.36),kr=16/9,Er=[0,2.3,-.2],eo=(e,t)=>e[0]*t[0]+e[1]*t[1]+e[2]*t[2],It=(e,t)=>[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]],to=e=>new Float32Array(e.flatMap((t,o)=>e.map(n=>n[o])));function no(){let e=j(...Er.map((s,i)=>s-Pt[i])),t=j(...It(e,[0,1,0])),o=It(t,e),n=1/Math.tan(27*Math.PI/360),r=(s,i)=>[...s,-eo(s,Pt)].map(a=>a*i);return to([r(t,n/kr),r(o,n),[0,0,0,.08],r(e,1)])}function oo(){let e=j(...It([0,1,0],st)),t=It(st,e),o=[0,1.4,0],n=(r,s,i=0)=>[...r.map(a=>a/s),i-eo(r,o)/s];return to([n(e,7),n(t,5.4),n(st,-16,.5),[0,0,0,1]])}var at={x:4.78,bottom:.56,top:3.89,back:-2.8,glass:2.76},Ae=12,it=e=>.32*e.scale+e.extraClearance,Zt=(e,t)=>.27*(e.scale+t.scale)+e.extraClearance+t.extraClearance;function Tr({position:e,radii:t,yaw:o}){let n=Math.cos(o),r=Math.sin(o);function s(a,c,l,f){let u=a-e[0],d=l-e[2];return((n*u+r*d)/(t[0]+f))**2+((c-e[1])/(t[1]+f))**2+((-r*u+n*d)/(t[2]+f))**2}function i(a,c,l,f){let u=it(a),[d,m,v]=e,g=t[0]+u,y=t[1]+u,A=t[2]+u,z=a.x-d,k=a.z-v,h=c-a.x,x=f-a.z,p=(n*z+r*k)/g,b=(a.y-m)/y,M=(-r*z+n*k)/A,E=(n*h+r*x)/g,R=(l-a.y)/y,D=(-r*h+n*x)/A,I=Y(-(p*E+b*R+M*D)/(E*E+R*R+D*D||1),0,1);return(p+I*E)**2+(b+I*R)**2+(M+I*D)**2>=1-1e-9}return{position:e,distance:s,segmentClear:i}}function Pr(e,t,o){return Math.abs(e)<=at.x&&t>=at.bottom&&t<=at.top&&o>=at.back&&o<=at.glass}function ro(e,t,o=Xt){let n=t.map(Tr);function r(h,x,p,b){return Pr(h,x,p)&&n.every(M=>M.distance(h,x,p,b)>=1)}function s(h,x,p,b){h.tx=x,h.ty=p,h.tz=b,h.bestDistance=Math.hypot(x-h.x,p-h.y,b-h.z),h.stalled=0,h.goalAge=0}function i(h,x,p,b){return r(x,p,b,it(h)+.04)&&n.every(M=>M.segmentClear(h,x,p,b))}function a(h,x=!1){let p=h.returning,b=h.x>.45?-1:h.x<-.45||Math.cos(h.yaw)>=0?1:-1;if(!x&&!p)for(let I=0;I<14;I++){let L=b*h.rng(2.25,4.21),q=Y(h.homeY+h.rng(-.63,.63),.81,3.53),_=Y(h.homeZ+h.rng(-1.3,1.05),-.65,2.3);if(i(h,L,q,_)){s(h,L,q,_);return}}let M=-1/0,E,R=p?Math.PI/2:Math.atan2(1.45-h.z,-h.x),D=h.rng(-.16,.16);for(let I of[1.55,.9])for(let L=0;L<10;L++){let q=R+L*C/10+D,_=Y(h.x+Math.cos(q)*I,-4.46,4.46),w=Y(h.z+Math.sin(q)*I,-2.54,2.45);for(let T of[0,.5,-.5]){let O=Y(h.y+T,.71,3.73),J=Math.hypot(_-h.x,O-h.y,w-h.z);if(J<.65||!i(h,_,O,w))continue;let W=(w-h.z)*(p?2.2:.78),Te=.42*(Math.abs(h.x)-Math.abs(_)),se=W+Te+.44*J-Math.abs(T)*.44;se<=M||(M=se,E=[_,O,w])}}E?s(h,...E):s(h,0,Y(h.homeY+.42,1.36,3.68),1.81)}let c=o.map(([h,x,p,b,M,E=5,R=1,D={}],I)=>{let L=X(e,`tang-${I}`),{paceScale:q=1,weave:_=0,extraClearance:w=0}=D,T={x:h,y:x,z:p,yaw:M,pitch:0,bank:0,phase:L(0,C),scale:b,rng:L,material:E,stroke:R,weave:_,extraClearance:w*b,pace:L(.47,.82)*q,speed:L(.5,.76)*q,homeY:x,homeZ:p,blocked:0,tint:L(),finOffset:L(0,C),away:0,returning:!1,turnAway:0,escapeYaw:M,previous:{},next:{}};if(!r(h,x,p,it(T)))throw new Error(`Fish ${I} starts inside a tank obstacle.`);return a(T),T});function l(h){h.previous.x=h.x,h.previous.y=h.y,h.previous.z=h.z,h.previous.yaw=h.yaw,h.previous.pitch=h.pitch,h.previous.bank=h.bank,h.previous.phase=h.phase}c.forEach(l);let f=c,u=0;function d(h,x,p,b){return r(x,p,b,it(h))&&f.every(M=>Math.hypot(x-M.x,p-M.y,b-M.z)>=Zt(h,M))}function m(h){if(!d(h,h.x,h.y,h.z)){for(let x of[3.25,2.45,1.65])for(let p of[0,-.85,.85,-1.7,1.7,-2.55,2.55])if(d(h,p,x,2.25)){Object.assign(h,{x:p,y:x,z:2.25,blocked:0,away:0,returning:!1,turnAway:0}),a(h);return}}}function v(h){let x=c.filter((p,b)=>h[b]);f=x.filter(p=>f.includes(p));for(let p of x)f.includes(p)||(m(p),l(p),f.push(p));f=x}function g(h,x,p,b){if(!r(x,p,b,it(h)))return!1;for(let M of f){if(M===h)continue;let E=Math.hypot(x-M.x,p-M.y,b-M.z);if(E<Zt(h,M)&&E<=Math.hypot(h.x-M.x,h.y-M.y,h.z-M.z))return!1}return!0}function y(h,x,p){let b=h.speed*p*.49;for(let M of[Math.PI/2,-Math.PI/2,Math.PI]){let E=h.yaw+M,R=h.x+Math.cos(E)*b,D=h.z+Math.sin(E)*b;if(g(h,R,h.y,D)){(h.turnAway<=0||Math.abs(Ge(h.escapeYaw-h.yaw))<.3)&&(h.escapeYaw=E,h.turnAway=.72),x.x=R,x.y=h.y,x.z=D;return}}x.x=h.x,x.y=h.y,x.z=h.z}function A(h){let x=u*h;u++;for(let p of f){l(p);let b=Math.hypot(p.tx-p.x,p.ty-p.y,p.tz-p.z);p.goalAge+=h,p.stalled+=h,b<p.bestDistance-.12&&(p.bestDistance=b,p.stalled=0);let M=Math.sin(p.yaw)<-.36;p.away=M?p.away+h:0,p.returning&&p.z>=1.12&&(p.returning=!1);let E=!p.returning&&p.z<1.12&&M&&(p.z<-.52||p.away>1.85);E&&(p.returning=!0);let R=p.stalled>2.7||p.blocked>.65||p.goalAge>18;(E||R||b<.54)&&(p.blocked=0,a(p,R));let D=p.tx-p.x,I=p.ty-p.y,L=p.tz-p.z,q=Math.hypot(D,I,L)||1,_=D/q,w=I/q*.66,T=L/q,O=Math.cos(p.yaw),J=Math.sin(p.yaw),W=Math.cos(p.pitch)*p.speed,Te=Math.sin(p.pitch)*p.speed,se=p.x+O*.79,Fe=p.z+J*.79;for(let U of n){let le=Math.min(U.distance(p.x,p.y,p.z,.36+p.extraClearance),U.distance(se,p.y,Fe,.37+p.extraClearance)),K=Math.max(0,1.45-le)*1.48;if(K===0)continue;let[oe,fe,Se]=U.position,te=Math.hypot(p.x-oe,p.y-fe,p.z-Se)||1;_+=(p.x-oe)/te*K,w+=(p.y-fe)/te*K,T+=(p.z-Se)/te*K}let ne=0,dt=0,ht=0;for(let U of f){if(U===p)continue;let le=U.x-p.x,K=U.y-p.y,oe=U.z-p.z,fe=Math.hypot(le,K,oe);if(fe===0||fe>2.6)continue;let Se=Zt(p,U),te=Y((Se+.23-fe)/.23,0,1)*.69/fe;_-=le*te,w-=K*te,T-=oe*te;let Le=Math.cos(U.pitch)*U.speed,me=Math.cos(U.yaw)*Le-O*W,qe=Math.sin(U.pitch)*U.speed-Te,Oe=Math.sin(U.yaw)*Le-J*W,S=-(le*me+K*qe+oe*Oe)/(me*me+qe*qe+Oe*Oe||1);if(S<=0||S>=2)continue;let P=Se+.33,F=Math.hypot(le+me*S,K+qe*S,oe+Oe*S),N=Y(1-F/P,0,1)*(1-.25*S);if(N<=ne)continue;let V=Math.hypot(le,oe)||1;ne=N,dt=-oe/V,ht=le/V}_+=dt*ne*1.9,T+=ht*ne*1.9,_-=Math.sign(p.x)*Math.max(0,Math.abs(se)-3.93)*2.2,T-=Math.max(0,Fe-2.04)*2.35,T+=Math.max(0,-.7-Fe)*1.2,w+=Math.max(0,.93-p.y)-Math.max(0,p.y-3.56);let mt=0,vt=0,Pe=0;if(p.weave){let U=x+p.finOffset;mt=p.weave*(.35*Math.sin(.87*U)+.14*Math.sin(1.91*U))*(1-.65*ne),w+=p.weave*(.24*Math.sin(.94*U)+.11*Math.cos(1.49*U)),vt=p.weave*(.24*Math.sin(1.23*U+.5)+.095*Math.cos(2.14*U)),Pe=p.weave*.14*Math.sin(.98*U-.8)}let Ze=p.turnAway>0?p.escapeYaw:Math.atan2(T,_)+mt;p.turnAway=Math.max(0,p.turnAway-h);let gt=Ge(Ze-p.yaw),_e=Y(gt*2,-1.25,1.25),Ne=Y(Math.atan2(w,Math.hypot(_,T)),-.39,.39),De=B(p.pitch,Ne,1-Math.exp(-h*2.4)),Ie=Ge(p.yaw+_e*h),Ce=B(p.speed,p.pace*(1+.13*Math.sin(x*1.13+p.finOffset)+Pe)*(1-.22*Math.abs(_e)),1-Math.exp(-h*1.7)),Be=Math.cos(De)*Ce*h,xt=p.x+Math.cos(Ie)*Be,Me=p.y+Math.sin(De)*Ce*h,Je=p.z+Math.sin(Ie)*Be;Object.assign(p.next,{x:xt,y:Me,z:Je,yaw:Ie,pitch:De,speed:Ce,bank:B(p.bank,-_e*.23+vt,1-Math.exp(-h*3)),blocked:Math.max(0,p.blocked-h*2),phase:(p.phase+h*(6.8+Ce*8.9)*p.stroke)%C})}for(let p of f){let b=p.next;g(p,b.x,b.y,b.z)||(y(p,b,h),b.blocked=p.blocked+h),Object.assign(p,b)}}let z=new Float32Array(c.length*Ae);function k(h){let x=0;for(let p of c){let b=p.previous,M=b.yaw+Ge(p.yaw-b.yaw)*h;z[x++]=B(b.x,p.x,h),z[x++]=B(b.y,p.y,h),z[x++]=B(b.z,p.z,h),z[x++]=p.material,z[x++]=p.scale,z[x++]=B(b.bank,p.bank,h),z[x++]=b.phase+Ge(p.phase-b.phase)*h,z[x++]=p.tint,z[x++]=Math.cos(M),z[x++]=Math.sin(M),z[x++]=B(b.pitch,p.pitch,h),z[x++]=p.finOffset}return z}return{step:A,interpolate:k,setEnabled:v,get tick(){return u},clear:r,snapshot:()=>c.map(({x:h,y:x,z:p,yaw:b,speed:M,phase:E,scale:R,blocked:D})=>({x:h,y:x,z:p,yaw:b,speed:M,phase:E,scale:R,blocked:D}))}}var Jt=15,lt=8,Ir=1.44,ct=(e,t,o)=>{let n=Y((o-e)/(t-e),0,1);return n*n*(3-2*n)};function so(e){let t=e%Jt;return(.19*ct(4.9,6.7,t)+(Ir-.19)*ct(6.45,7.65,t))*(1-ct(10.1,12.1,t))}function ao(e){let t=X(e,"treasure-bubbles"),o=[];for(let i=0;i<42;i++){let a=i<4,c=a?t(.012,.022):t(.014,.055);o.push({launch:a?5.65+i*.35:7.68+t(0,2.7)**1.24/1.47,x:t(-.31,.31),z:a?t(.342,.39):t(.09,.29),drift:t(-.14,.14),phase:t(0,C),speed:t(.61,.91)+c*3.9,radius:c})}let n=new Float32Array(o.length*lt),r=Math.cos(pe),s=Math.sin(pe);return{data:n,sample(i,a){let c=0;for(let l of o){let f=(i-l.launch+Jt)%Jt,u=ie[1]+je[1]+f*l.speed-.082*(1-Math.exp(-f*6)),d=l.radius*(1+.055*f);if(u>a-d||f<.01||f>i)continue;let m=Math.min(f,1.4)*Math.sin(f*3.5+l.phase),v=l.x+l.drift*f+m*(.081-l.radius*.7),g=l.z+.045*f+m*.048,y=ct(0,.19,f)*ct(0,.16,a-u-d),A=c++*lt;n[A]=ie[0]+v*r-g*s,n[A+1]=u,n[A+2]=ie[2]+v*s+g*r,n[A+3]=d,n[A+4]=y,n[A+5]=l.phase+f*6}return c}}}var Lt=[[-1.02,1.031],[-.52,1.16],[0,1.264],[.57,1.358],[.93,1.315],[1.3,1.2],[1.38,1.065],[1.24,.989],[.98,1.1],[.74,1.247],[.48,1.307],[0,1.185],[-.49,1.045],[-.93,.944],[-1.16,.922],[-1.23,1.022]],io=120,Ct=30;function co(e,t,o,n,r){return .5*(2*t+(o-e)*r+(2*e-5*t+4*o-n)*r*r+(3*(t-o)+n-e)*r*r*r)}var de=[],en=0,Bt=e=>Lt[(e+Lt.length)%Lt.length];for(let e=0;e<=Lt.length*Ct;e++){let t=Math.floor(e/Ct),o=e%Ct/Ct,[n,r,s,i]=[Bt(t-1),Bt(t),Bt(t+1),Bt(t+2)],a=co(n[0],r[0],s[0],i[0],o),c=co(n[1],r[1],s[1],i[1],o),l=de.at(-1);l&&(en+=Math.hypot(a-l.x,c-l.z)),de.push({x:a,z:c,distance:en})}var lo=e=>(e+de.length-1)%(de.length-1);function fo(e){let t=de[lo(e-1)],o=de[lo(e+1)];return Math.atan2(o.z-t.z,o.x-t.x)}function uo(){let e=new Float32Array(Ae);return e[3]=Cn,e.fill(.86,4,7),{data:e,sample(t){let o=t%io/io*en,n=0,r=de.length-1;for(;r-n>1;){let y=n+r>>1;de[y].distance<=o?n=y:r=y}let s=de[n],i=de[r],a=(o-s.distance)/(i.distance-s.distance),c=B(s.x,i.x,a),l=B(s.z,i.z,a),f=fo(n),u=fo(r),d=Math.atan2(Math.sin(u-f),Math.cos(u-f)),m=f+d*a,v=ge(c,l),g=.025;return e[0]=c,e[1]=v-.007,e[2]=l,e[7]=t*C/8,e[8]=Math.cos(m),e[9]=Math.sin(m),e[10]=(ge(c+g,l)-ge(c-g,l))/(2*g),e[11]=(ge(c,l+g)-ge(c,l-g))/(2*g),e}}}async function po(){if(!navigator.gpu)throw new Error("WebGPU is unavailable. Try Chrome or Edge with graphics acceleration enabled.");let e=navigator.userAgentData?.platform||navigator.platform,t=/^win/i.test(e)&&/Chrom(?:e|ium)\//.test(navigator.userAgent),o=await navigator.gpu.requestAdapter(t?void 0:{powerPreference:"high-performance"});if(!o)throw new Error("No WebGPU adapter is available. Check browser graphics acceleration and your graphics driver.");let n=o.features.has("timestamp-query")?["timestamp-query"]:[];return{device:await o.requestDevice({requiredFeatures:n}),adapterInfo:o.info}}function ho(e){let t=new Set;function o(n){return t.add(n),n}return{texture:(n,r,s,i,a,c=1)=>o(e.createTexture({label:n,size:[r,s],format:i,usage:a,mipLevelCount:c})),buffer(n,r,s){let i=typeof s=="number"?s:s.byteLength,a=o(e.createBuffer({label:n,size:i,usage:r|GPUBufferUsage.COPY_DST}));return typeof s!="number"&&e.queue.writeBuffer(a,0,s),a},destroy(n){n&&t.delete(n)&&n.destroy()},dispose(){for(let n of t)n.destroy();t.clear()},get count(){return t.size}}}async function ft(e,t,o){let n=e.createShaderModule({label:t,code:o}),{messages:r}=await n.getCompilationInfo(),s=r.filter(i=>i.type==="error");if(s.length)throw new Error(`${t} WGSL: ${s.map(i=>`${i.lineNum}:${i.linePos} ${i.message}`).join(`
`)}`);return n}function tn(e,t=0,o=0,n=0){return{view:e,clearValue:[t,o,n,1],loadOp:"clear",storeOp:"store"}}function mo(e,t){if(!e.features.has("timestamp-query"))return null;let o=e.createQuerySet({type:"timestamp",count:2}),n=e.createBuffer({size:16,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC}),r=Array.from({length:6},()=>({busy:!1,buffer:e.createBuffer({size:16,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ})})),s={querySet:o,beginningOfPassWriteIndex:0},i={querySet:o,endOfPassWriteIndex:1},a=!1;return{start:s,end:i,reserve:()=>a?null:r.find(c=>!c.busy),resolve(c,l){c.resolveQuerySet(o,0,2,n,0),c.copyBufferToBuffer(n,0,l.buffer,0,16)},read(c,l){c.busy=!0,c.buffer.mapAsync(GPUMapMode.READ).then(()=>{if(a)return;let f=new BigUint64Array(c.buffer.getMappedRange()),u=Number(f[1]-f[0])/1e6;c.buffer.unmap(),u>0&&u<1e3&&t(u,l)}).catch(()=>{}).finally(()=>{c.busy=!1})},dispose(){a=!0;for(let{buffer:c}of r)c.destroy();n.destroy(),o.destroy()}}}var Ye="rgba16float",ut="depth32float",nn=2048,on=256,rn=1024,sn=5,vo=11,go=[{arrayStride:16,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"snorm8x4"}]},{arrayStride:Ae*4,stepMode:"instance",attributes:[2,3,4].map((e,t)=>({shaderLocation:e,offset:t*16,format:"float32x4"}))}];async function xo(e,t,o){let{device:n,adapterInfo:r}=await po(),s=n.queue,i=e.getContext("webgpu"),a=ho(n),c=navigator.gpu.getPreferredCanvasFormat(),l=GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING,f,u=!1,d=null,m=0,v=y=>{u||o.error(y.error)};n.addEventListener("uncapturederror",v),n.lost.then(y=>{u||o.lost(y)});function g(){u||(u=!0,n.removeEventListener("uncapturederror",v),f?.dispose(),i?.unconfigure(),a.dispose(),d=null,n.destroy())}try{let ne=function(S,P){return n.createBindGroup({layout:S.getBindGroupLayout(0),entries:P.map((F,N)=>({binding:N,resource:F}))})},Pe=function(S,P,F){return{vertex:a.buffer("Mesh vertices",GPUBufferUsage.VERTEX,new Uint8Array(S.vb)),index:a.buffer("Mesh indices",GPUBufferUsage.INDEX,S.ib),instance:a.buffer("Instance records",GPUBufferUsage.VERTEX,F),indexCount:S.ib.length,count:P}},K=function(S,P){S.setVertexBuffer(0,P.vertex),S.setVertexBuffer(1,P.instance),S.setIndexBuffer(P.index,"uint32"),S.drawIndexed(P.indexCount,P.count)},oe=function(S,P,F){let N=Array.from({length:P},(V,H)=>S.createView({baseMipLevel:H,mipLevelCount:1}));return{first:N[0],passes:N.slice(1).map((V,H)=>({view:V,group:ne(F,[N[H],T])}))}},te=function(S,P,F,N,V){let H=S.beginRenderPass({colorAttachments:[tn(P)],timestampWrites:V});H.setPipeline(F),N&&H.setBindGroup(0,N),H.draw(3),H.end()},qe=function({width:S,height:P,renderWidth:F,renderHeight:N}){if((!d||S!==d.width||P!==d.height)&&(e.width=S,e.height=P,i.configure({device:n,format:c,alphaMode:"opaque"})),F!==d?.renderWidth||N!==d?.renderHeight){a.destroy(d?.color),a.destroy(d?.depth);let V=a.texture("Internal HDR",F,N,Ye,l),H=a.texture("Internal depth",F,N,ut,GPUTextureUsage.RENDER_ATTACHMENT),ve=V.createView();d={color:V,depth:H,colorView:ve,depthView:H.createView(),presentBind:ne(D,[ve,T])}}Object.assign(d,{width:S,height:P,renderWidth:F,renderHeight:N})},Oe=function(S,P,F,N){m++,Te[0]=P,s.writeBuffer(Fe,0,Te);for(let $ of _e)F[$.key]&&s.writeBuffer($.instance,0,S,$.offset,$.length);if(F.snail){let $=Ie.sample(P);W[0]=$[0],W[1]=$[2],W[2]=$[8],W[3]=$[9],s.writeBuffer(se,W.byteOffset,W),s.writeBuffer(Ce.instance,0,$)}else U&&(W.fill(0),s.writeBuffer(se,W.byteOffset,W));U=F.snail;let V=N===null?0:so(N);Ne[10]=Math.cos(V),Ne[11]=Math.sin(V),s.writeBuffer(De.instance,0,Ne),Me=N===null?0:Be.sample(N,Tt),Me&&s.writeBuffer(xt,0,Be.data,0,Me*lt);let H=n.createCommandEncoder({label:"Aquarium frame"}),ve=f?.reserve();te(H,fe.first,b,mt,ve?f.start:void 0);for(let{view:$,group:Fo}of fe.passes)te(H,$,E,Fo);let ae=H.beginRenderPass({colorAttachments:[tn(d.colorView,.008,.024,.034)],depthStencilAttachment:{view:d.depthView,depthClearValue:0,depthLoadOp:"clear",depthStoreOp:"discard"}});ae.setPipeline(x),ae.setBindGroup(0,dt);for(let $ of Ze)K(ae,$);K(ae,De),U&&K(ae,Ce),Je=0;for(let $ of _e)F[$.key]&&(K(ae,$),Je++);return Me&&(ae.setPipeline(I),ae.setBindGroup(0,vt),ae.setVertexBuffer(0,xt),ae.draw(4,Me)),ae.end(),te(H,i.getCurrentTexture().createView(),D,d.presentBind,ve?f.end:void 0),ve&&f.resolve(H,ve),s.submit([H.finish()]),ve&&f.read(ve,m),m};if(!i)throw new Error("The browser could not configure the WebGPU canvas.");let[y,A,z,k]=await Promise.all([ft(n,"Tank scene",[Gn,Hn,Jn,Vn,$n,jn,Wn,Yn].join(`
`)),ft(n,"Caustics",Kn),ft(n,"Rock detail",Xn),ft(n,"Presentation",Qn)]),h=(S,P,F,N,V="vs")=>n.createRenderPipelineAsync({label:S,layout:"auto",vertex:{module:P,entryPoint:V},fragment:{module:P,entryPoint:F,targets:[{format:N}]}}),[x,p,b,M,E,R,D,I]=await Promise.all([n.createRenderPipelineAsync({label:"Tank geometry",layout:"auto",vertex:{module:y,entryPoint:"vsScene",buffers:go},fragment:{module:y,entryPoint:"fsScene",targets:[{format:Ye}]},depthStencil:{format:ut,depthWriteEnabled:!0,depthCompare:"greater"}}),n.createRenderPipelineAsync({label:"Static shadow",layout:"auto",vertex:{module:y,entryPoint:"vsShadow",buffers:go},depthStencil:{format:ut,depthWriteEnabled:!0,depthCompare:"less",depthBias:1,depthBiasSlopeScale:1}}),h("Animated caustics",A,"fs",Ye),h("Rock detail bake",z,"fs","rgba8unorm"),h("Caustic mips",k,"mip",Ye),h("Rock detail mips",k,"mip","rgba8unorm"),h("Fullscreen composite",k,"present",c),n.createRenderPipelineAsync({label:"Air bubbles",layout:"auto",vertex:{module:y,entryPoint:"vsBubble",buffers:[{arrayStride:4*lt,stepMode:"instance",attributes:[0,1].map(S=>({shaderLocation:S,offset:S*16,format:"float32x4"}))}]},fragment:{module:y,entryPoint:"fsBubble",targets:[{format:Ye,blend:{color:{srcFactor:"one",dstFactor:"one-minus-src-alpha"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha"}}}]},primitive:{topology:"triangle-strip"},depthStencil:{format:ut,depthWriteEnabled:!1,depthCompare:"greater"}})]),L=a.texture("Shadow map",nn,nn,ut,l),q=a.texture("Caustic map",on,on,Ye,l,sn),_=a.texture("Rock detail",rn,rn,"rgba8unorm",l,vo),w=n.createSampler({addressModeU:"repeat",addressModeV:"repeat",minFilter:"linear",magFilter:"linear",mipmapFilter:"linear"}),T=n.createSampler({minFilter:"linear",magFilter:"linear"}),O=n.createSampler({compare:"less-equal",minFilter:"linear",magFilter:"linear"}),J=new Float32Array(44),W=J.subarray(40);J.set(no(),0),J.set(oo(),16),J.set(Pt,32),J.set([...st,Tt],36);let Te=new Float32Array(4),se=a.buffer("Scene uniforms",GPUBufferUsage.UNIFORM,J),Fe=a.buffer("Caustic uniforms",GPUBufferUsage.UNIFORM,Te),dt=ne(x,[{buffer:se},_.createView(),q.createView(),L.createView(),w,O]),ht=ne(p,[{buffer:se}]),mt=ne(b,[{buffer:Fe}]),vt=ne(I,[{buffer:se}]),Ze=t.solids.map(S=>({...Pe(S.mesh,S.data.length/Ae,S.data),castsShadow:S.castsShadow})),gt=0,_e=t.swimmers.map(({key:S,mesh:P,count:F})=>{let N=F*Ae,V={...Pe(P,F,N*4),key:S,offset:gt,length:N};return gt+=N,V}),Ne=t.lid.data.slice(),De=Pe(t.lid.mesh,1,Ne),Ie=uo(),Ce=Pe(t.snail,1,Ie.sample(0)),Be=ao(t.seed),xt=a.buffer("Air bubble instances",GPUBufferUsage.VERTEX,Be.data.byteLength),Me=0,Je=0,U=!1,le=[...t.solids,t.lid].reduce((S,{mesh:P,data:F})=>S+P.vb.byteLength+P.ib.byteLength+F.byteLength,Be.data.byteLength)+t.snail.vb.byteLength+t.snail.ib.byteLength+Ie.data.byteLength+t.swimmers.reduce((S,{mesh:P,count:F})=>S+P.vb.byteLength+P.ib.byteLength+F*Ae*4,0),fe=oe(q,sn,E),Se=oe(_,vo,R),Le=n.createCommandEncoder({label:"Static tank bakes"});te(Le,Se.first,M);for(let{view:S,group:P}of Se.passes)te(Le,S,R,P);let me=Le.beginRenderPass({colorAttachments:[],depthStencilAttachment:{view:L.createView(),depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});me.setPipeline(p),me.setBindGroup(0,ht);for(let S of Ze)S.castsShadow&&K(me,S);return me.end(),s.submit([Le.finish()]),await s.onSubmittedWorkDone(),f=mo(n,o.sample),{resize:qe,render:Oe,dispose:g,adapterInfo:r,get maxDimension(){return n.limits.maxTextureDimension2D},get hasTimestamps(){return!!f},forceLoss:()=>n.destroy(),get diagnostics(){let S=d?d.renderWidth*d.renderHeight*12:0,P=nn**2*4+Math.ceil((rn**2*4+on**2*8)*4/3);return{draws:Ze.length+Je+Number(U)+ +(Me>0)+sn+2,resources:a.count+(f?8:0),textureAndMeshMiB:(le+S+P)/2**20}}}}catch(y){throw g(),y}}var Rt=.016666666666666666;function yo(e=Rt,t=4){let o=null,n=0;return{reset(){o=null},advance(r,s){o===null&&(o=r);let i=Math.max(0,r-o);o=r,n+=Math.min(i/1e3,e*t);for(let a=0;a<t&&n+1e-10>=e;a++)s(e),n=Math.max(0,n-e);return{elapsed:i,alpha:n/e}}}}var Cr=[.5,.5833333333333334,.6666666666666666,.75,.8333333333333334,.9166667,1];function bo(e,t){let o=new URLSearchParams(e),n={};try{n=JSON.parse(t?.getItem("aquarium.quality.v1")??"{}")??{}}catch{}let r=(f,u)=>{let d=o.has(f)?o.get(f):n[f];return d!==""&&d!=null&&Number.isFinite(Number(d))?Number(d):u},s=Math.max(.5,Math.min(1,r("min",.5))),i=Math.max(s,Math.min(1,r("max",1))),a=r("scale",0),c=o.get("seed"),l=c&&/^-?\d+$/.test(c)&&Number.isSafeInteger(Number(c))?Number(c)|0:void 0;return{min:s,max:i,fixed:a>=.5&&a<=1?a:null,seed:l,debug:o.get("hud")==="1"}}function wo(e,t,o,n,r){let s=Math.max(1,Math.floor(Math.min(e*o/16+.025,t*o/9+.025,n/16))),i=Math.max(1,Math.round(s*r));return{width:s*16,height:s*9,renderWidth:i*16,renderHeight:i*9}}function Mo({min:e=.5,max:t=1,fixed:o=null}={}){let n=[...new Set([e,...Cr.filter(l=>l>e&&l<t),t])],r=n.findIndex(l=>l>=2/3);r<0&&(r=n.length-1);let s=o,i=0,a=0,c=1;return{get scale(){return s??n[r]},get fixed(){return s},setFixed(l){s=l,i=a=0,c=1},reset(){i=a=0,c=1},sample({frameP90:l,cpuP90:f,gpuP90:u,gpuSamples:d}){if(s!==null)return!1;if(c>0)return c--,!1;let m=d>=5,v=m?u>14||l>21&&f<10&&u>11:l>19&&f<11,g=m?u<8.7&&l<18.6&&f<9:l<17.5&&f<8;i=v?i+1:0,a=g?a+1:0;let y=i>=2&&r>0?-1:a>=(m?8:20)&&r<n.length-1?1:0;return y?(r+=y,i=a=0,c=2,!0):!1}}}var So=Object.freeze({tangs:!0,puffer:!1,snail:!0,mermaid:!1,chest:!0});function zo(e,t){let o=w=>document.getElementById(w),n=o("status"),r=o("status-title"),s=o("status-detail"),i=o("retry"),a=o("controls"),c=o("quality"),l=o("quality-mode"),f=o("quality-panel"),u=o("tank-contents"),d=o("tank-panel"),m=[...d.querySelectorAll('input[type="checkbox"]')],v=o("fullscreen"),g=o("show-stats"),y=o("stats"),A=o("notice"),z=new AbortController,k=(w,T,O)=>w.addEventListener(T,O,{signal:z.signal}),h,x,p=!1,b=!1,M=null;function E(){M&&(M.panel.hidden=!0,M.button.setAttribute("aria-expanded","false"),M=null,I())}function R(w,T,O){k(w,"click",J=>{let W=M?.button===w;E(),!W&&(T.hidden=!1,w.setAttribute("aria-expanded","true"),M={button:w,panel:T},J.detail===0&&O.focus())})}function D(){let w=document.activeElement;p&&(M||a.contains(w)&&w.matches(":focus-visible"))||(a.hidden=!0,e.classList.toggle("viewing",p))}function I(){p&&(clearTimeout(h),a.hidden=!1,e.classList.remove("viewing"),h=setTimeout(D,2750))}function L(w){clearTimeout(x),A.textContent=w,A.hidden=!1,x=setTimeout(()=>{A.hidden=!0},6e3)}async function q(){try{document.fullscreenElement===e?await document.exitFullscreen():await e.requestFullscreen()}catch{L("Fullscreen is unavailable. You can still view the aquarium in this window.")}}function _(w){b=w,y.hidden=!w,g.setAttribute("aria-pressed",String(w)),g.textContent=w?"Hide performance":"Show performance"}k(e,"pointermove",I),k(e,"pointerdown",w=>{M&&!M.button.contains(w.target)&&!M.panel.contains(w.target)&&E(),I()}),k(a,"focusout",I),R(u,d,m[0]),R(c,f,l);for(let w of m)k(w,"change",()=>t.contents(w.name,w.checked));return k(v,"click",q),k(l,"change",()=>t.quality(l.value==="auto"?null:Number(l.value))),k(g,"click",()=>_(!b)),k(i,"click",t.retry),k(document,"fullscreenchange",()=>{v.textContent=document.fullscreenElement===e?"Exit fullscreen":"Fullscreen",t.resize()}),k(document,"keydown",w=>{if(!p||w.repeat||w.ctrlKey||w.altKey||w.metaKey)return;let T=w.key.toLowerCase();if(T==="f")w.preventDefault(),q();else if(T==="h")_(!b);else if(T==="b"&&t.benchmark)t.benchmark();else if(T==="escape"&&M){let O=M.button;E(),O.focus()}else T==="tab"&&I()}),{setHud:_,message:L,get hud(){return b},report:w=>{b&&(y.textContent=w)},contents(w){for(let T of m)T.checked=w[T.name]},quality(w){let T=w===null?"auto":String(w);if(![...l.options].some(O=>O.value===T)){let O=new Option(`${Math.round(w*100)}%`,T);l.add(O)}l.value=T},state(w,T){if(p=w==="running",e.dataset.state=w,p){e.classList.add("ready"),n.hidden=!0,I();return}E(),D(),n.hidden=!1,i.hidden=w!=="error",r.textContent=w==="recovering"?"Restoring the aquarium":w==="error"?"Aquarium paused":"Aquarium",s.textContent=w==="error"?T.message:w==="recovering"?"Reconnecting to the graphics device\u2026":"Preparing the tank\u2026"},dispose(){z.abort(),clearTimeout(h),clearTimeout(x)}}}function an(e){let t=new Float32Array(e),o=0,n=0;return{add(r){t[n]=r,n=(n+1)%e,o=Math.min(e,o+1)},reset(){o=n=0},stats(){let r=t.slice(0,o).sort(),s=c=>r[Math.max(0,Math.ceil(o*c)-1)]??0,i=r.reduce((c,l)=>c+l,0),a=r.reduce((c,l)=>c+ +(l>25),0);return{count:o,average:o?i/o:0,p50:s(.5),p90:s(.9),p95:s(.95),p99:s(.99),max:s(1),late60Hz:a}}}}function Ao(e=640){let t=an(e),o=an(e),n=an(e);return{frame(r,s){r>0&&r<1e3&&(t.add(r),o.add(s))},gpu:n.add,reset(){t.reset(),o.reset(),n.reset()},stats(){return{frame:t.stats(),cpu:o.stats(),gpu:n.stats()}}}}function ko({connect:e,status:t,reportError:o=()=>{},retryDelay:n=200,maxRetries:r=2}){let s=null,i=!1,a=!1,c=!1,l=null,f=0,u=0;function d(v){if(s?.dispose(),s=null,!(!c||a)){if(f>=r){c=!1,t("error",v);return}f++,t("recovering",v),l=setTimeout(()=>{l=null,m()},n*f)}}async function m(){if(i||!c||a)return;i=!0;let v=++u,g=null,y;try{y=await e({lost:A=>{if(!c||a||u!==v)return;let z=new Error(A.message||"The graphics device was lost.");i?g=z:d(z)},error:A=>{u===v&&!a&&o(A)}})}catch(A){if(i=!1,!c||a)return;g?d(g):(c=!1,t("error",A));return}if(i=!1,!c||a||g){y.dispose(),g&&d(g);return}s=y,t("running")}return{start(){c||a||(c=!0,f=0,t("loading"),m())},dispose(){a=!0,c=!1,clearTimeout(l),s?.dispose(),s=null},get renderer(){return s},markStable(){f=0},fail:d,terminate(v){f=r,d(v)}}}var Br=document.getElementById("aquarium"),hn=document.getElementById("tank"),Io=(()=>{try{return window.localStorage}catch{return null}})(),mn=bo(location.search,Io),vn=mn.seed??Dn,gn=On(vn),pt={...So},Lr=gn.swimmers.flatMap(({key:e,count:t})=>Array(t).fill(e)),Co=()=>Lr.map(e=>pt[e]);function Rr(){let e=ro(vn,gn.obstacles,Qt);return e.setEnabled(Co()),e}var Ke=Rr(),Bo=0,Dt=yo(),Ee=Mo(mn),Ut=Ao(),Ft=new AbortController,Xe=null,ke=!0,ce,Eo=0,Ur=0,un=0,Fr="loading",_r=0,cn=[],Lo=0,pn=1,_t=0,Z=null,ln=null,To=null,Po=!1,fn=!1,we=zo(Br,{retry:()=>he.start(),resize:()=>{ke=!0},quality:e=>{Qe("cancelled","Render scale changed."),Ee.setFixed(e);try{Io?.setItem("aquarium.quality.v1",JSON.stringify({scale:e}))}catch{}ke=!0},contents:(e,t)=>{Qe("cancelled","Tank contents changed."),pt[e]=t,e==="chest"?Bo=Ke.tick*Rt:e!=="snail"&&Ke.setEnabled(Co())},benchmark:null});we.setHud(mn.debug);we.quality(Ee.fixed);we.contents(pt);function dn(e=performance.now()){Ut.reset(),Lo=e,pn=_t+1}function Nr(e){return`FPS  ${e.frame.average?(1e3/e.frame.average).toFixed(1):"\u2014"}   p95 ${e.frame.p95.toFixed(1)} ms   p99 ${e.frame.p99.toFixed(1)} ms
CPU  ${e.cpu.p90.toFixed(2)} ms p90   GPU ${e.gpu.count?`${e.gpu.p90.toFixed(2)} ms p90`:"\u2014"}
${ce.renderWidth}\xD7${ce.renderHeight} \u2192 ${ce.width}\xD7${ce.height}   ${Math.round(Ee.scale*100)}%${Ee.fixed===null?" Auto":""}
Draws ${he.renderer.diagnostics.draws}   Nominal textures/meshes ${he.renderer.diagnostics.textureAndMeshMiB.toFixed(1)} MiB`}function Dr(e){Xe=null;let t=he.renderer;if(!t||document.hidden)return;let o=performance.now();try{let n=devicePixelRatio;if(ke||Eo!==n){let l=hn.getBoundingClientRect(),f=wo(l.width,l.height,n,t.maxDimension,Ee.scale);(!ce||Object.keys(f).some(u=>f[u]!==ce[u]))&&(Z&&ce&&(f.width!==ce.width||f.height!==ce.height)&&Qe("cancelled","Presentation dimensions changed."),t.resize(f),ce=f,dn(e)),ke=!1,Eo=n}let{elapsed:r,alpha:s}=Dt.advance(e,fn?()=>{}:Ke.step),i=(Ke.tick+(Ke.tick&&!fn?s:0))*Rt,a=pt.chest?i-Bo:null;_t=t.render(Ke.interpolate(fn?1:s),i%360,pt,a),++un===1&&we.state("running"),un===270&&he.markStable();let c=performance.now()-o;if(Ut.frame(r,c),Z&&e>=Z.collectAt&&(Z.firstDraw===null&&(Z.firstDraw=_t),Z.metrics.frame(r,c),e>=Z.finishAt&&Qe("complete")),e-Lo>=1e3){let l=Ut.stats();we.hud&&we.report(Nr(l)),!Z&&l.frame.count>=5&&Ee.sample({frameP90:l.frame.p90,cpuP90:l.cpu.p90,gpuP90:To??l.gpu.p90,gpuSamples:To?99:l.gpu.count})&&(_r++,ke=!0),dn(e)}xn()}catch(n){console.error(n),he.fail(n)}}function xn(){Xe===null&&he.renderer&&!document.hidden&&(Xe=requestAnimationFrame(Dr))}function Nt(){Xe!==null&&cancelAnimationFrame(Xe),Xe=null,Dt.reset(),dn()}var he=ko({connect:e=>xo(hn,gn,{...e,lost:t=>{Po?(Po=!1,he.terminate(new Error("The graphics device was lost. Retry to reconnect."))):e.lost(t)},sample:(t,o)=>{Ur++,o>=pn&&Ut.gpu(t),Z&&Z.firstDraw!==null&&o>=Z.firstDraw&&Z.metrics.gpu(t)}}),status:(e,t)=>{Fr=e,e==="running"?(ce=void 0,ke=!0,un=_t=0,pn=1,Dt.reset(),xn()):(Qe("cancelled","Rendering stopped."),Nt(),Ee.reset(),we.state(e,t))},reportError:e=>{cn.push(e.message),cn.length>12&&cn.shift(),console.error(e)}});function Qe(e,t){if(!Z)return;let{metrics:o,dimensions:n,scale:r,showNotice:s}=Z;ln={state:e,reason:t,seed:vn,scale:r,dimensions:n,stats:o.stats()},Z=null,e==="complete"&&(console.info("Aquarium benchmark",ln),s&&we.message(`Benchmark complete \xB7 ${n.renderWidth}\xD7${n.renderHeight} \xB7 ${(1e3/ln.stats.frame.average).toFixed(1)} FPS. Details are in the browser console.`))}var Ro=new ResizeObserver(()=>{ke=!0});Ro.observe(hn);function Uo(){document.hidden?(Qe("cancelled","Page was hidden."),Nt()):(ke=!0,Ee.reset(),Dt.reset(),xn())}document.addEventListener("visibilitychange",Uo,{signal:Ft.signal});window.addEventListener("pagehide",e=>{if(e.persisted){Nt();return}Ft.abort(),Ro.disconnect(),we.dispose(),Nt(),he.dispose()},{signal:Ft.signal});window.addEventListener("pageshow",e=>{e.persisted&&Uo()},{signal:Ft.signal});he.start();})();
