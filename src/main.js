(async()=>{
const PI=Math.PI,$=id=>document.getElementById(id);
let speed=1,follow=true,busy=false,t0=performance.now(),doneCount=0,savedMin=0;
const sleep=ms=>new Promise(r=>setTimeout(r,ms/speed));
const esc=x=>String(x).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));

/* ---------- сцена ---------- */
const sceneEl=$('scene'),labelsEl=$('labels');
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
sceneEl.prepend(renderer.domElement);
const scene=new THREE.Scene();scene.background=new THREE.Color('#e8ebf2');
const cam=new THREE.OrthographicCamera(-1,1,1,-1,.1,300);
const OFF=new THREE.Vector3(28,14,32);
const controls=new THREE.OrbitControls(cam,renderer.domElement);
Object.assign(controls,{enableDamping:true,dampingFactor:.08,maxPolarAngle:1.35,minPolarAngle:.3,minZoom:.5,maxZoom:14,screenSpacePanning:true});
const HEMI=new THREE.HemisphereLight('#ffffff','#a9b3c7',.8);scene.add(HEMI);
const sun=new THREE.DirectionalLight('#ffffff',.75);sun.position.set(14,40,18);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
Object.assign(sun.shadow.camera,{left:-30,right:30,top:30,bottom:-30,near:1,far:140});sun.shadow.bias=-.0006;scene.add(sun);sun.target.position.set(0,8,0);scene.add(sun.target);

const MC={};
const M=(c,o)=>{const k=c+(o?JSON.stringify(o):'');return MC[k]||(MC[k]=new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.85},o||{})))};
function box(w,h,d,c,x,y,z,par,sh=true){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),typeof c==='string'?M(c):c);m.position.set(x,y,z);m.castShadow=sh;m.receiveShadow=true;par.add(m);return m}
function cyl(r1,r2,h,c,x,y,z,par,seg=18){const m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,seg),typeof c==='string'?M(c):c);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;par.add(m);return m}
function grp(x,z,rot,par,y=0){const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=rot||0;par.add(g);return g}
const DK='#363b47';

/* ---------- модели ---------- */
const K=2.04,KS=1.7,S=1.3,DH=.384*K,SIT=.04;
const loader=new THREE.GLTFLoader();
const load=n=>new Promise((res,rej)=>{const b=atob(GLB[n]),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);loader.parse(u.buffer,'',res,rej)});
const FN=['desk','chairDesk','computerScreen','computerKeyboard','computerMouse','pottedPlant'];
const CN=['mini_male_a','mini_male_b','mini_male_d','mini_male_e','mini_female_a','mini_female_b','mini_female_c','mini_female_d','mini_female_e'];
const [FG,CG]=await Promise.all([Promise.all(FN.map(load)),Promise.all(CN.map(load))]);
const PROTO={},CH={};
FN.forEach((n,i)=>{const o=FG[i].scene;o.traverse(m=>{if(m.isMesh){const om=m.material;m.material=new THREE.MeshStandardMaterial({color:om.color,map:om.map||null,roughness:.75});m.material.name=om.name;m.castShadow=m.receiveShadow=true}});
 const b=new THREE.Box3().setFromObject(o),c=b.getCenter(new THREE.Vector3()),w=new THREE.Group();o.position.set(-c.x,-b.min.y,-c.z);w.add(o);PROTO[n]=w});
CN.forEach((n,i)=>CH[n]=CG[i]);
function put(n,x,y,z,rot,sc,par){const g=PROTO[n].clone();if(typeof sc==='number')g.scale.setScalar(sc);else g.scale.set(...sc);g.position.set(x,y,z);g.rotation.y=rot||0;par.add(g);return g}

function codeTex(seed){const c=document.createElement('canvas');c.width=128;c.height=80;const g=c.getContext('2d');g.fillStyle='#0f1a2b';g.fillRect(0,0,128,80);
 const cols=['#5eead4','#93c5fd','#fca5a5','#fde68a','#c4b5fd','#e5e7eb'];
 for(let y=6;y<76;y+=7){let x=6+((y*seed)%3)*6;while(x<118){const w=6+((x*y+seed)%22);g.fillStyle=cols[(x+y+seed)%6];g.fillRect(x,y,Math.min(w,122-x),3);x+=w+4}}
 return new THREE.CanvasTexture(c)}
const TEX=[codeTex(3),codeTex(7)];
function signTex(t1,t2,bg,fg){const c=document.createElement('canvas');c.width=1024;c.height=200;const g=c.getContext('2d');g.fillStyle=bg;g.fillRect(0,0,1024,200);
 g.fillStyle=fg;g.font='bold 92px system-ui, sans-serif';g.textBaseline='middle';g.fillText(t1,40,t2?78:100);if(t2){g.globalAlpha=.75;let fs=48;do{g.font=fs+'px system-ui, sans-serif';fs-=2}while(g.measureText(t2).width>950&&fs>18);g.fillText(t2,44,160)}
 const t=new THREE.CanvasTexture(c);t.anisotropy=4;return t}
function sign(par,t1,t2,x,y,z,w,bg='#1d2130',fg='#ffffff'){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,w*200/1024),new THREE.MeshBasicMaterial({map:signTex(t1,t2,bg,fg)}));m.position.set(x,y,z);par.add(m);return m}

function desk(par,x,z,w=1.5,mons=1,rot=0){const g=grp(x,z,rot,par);put('desk',0,0,0,0,[K*w/1.5,K,K],g);const scr=[],SW=.393*KS*.86,SH=.2*KS;
 for(let i=0;i<mons;i++){const mx=(i-(mons-1)/2)*.78;put('computerScreen',mx,DH,-.16,0,KS,g);
  const sm=new THREE.MeshBasicMaterial({color:'#2a303c'});const p=new THREE.Mesh(new THREE.PlaneGeometry(SW,SH),sm);p.position.set(mx,DH+.185*KS,-.16+.052*KS+.004);g.add(p);scr.push(sm)}
 put('computerKeyboard',0,DH,.14,0,K,g);put('computerMouse',.45,DH,.16,0,K,g);cyl(.05,.045,.1,'#ffffff',-w/2+.18,DH+.05,.05,g,10);return scr}
function chair(par,x,z,rot,c){const g=put('chairDesk',x,0,z,rot,K,par);if(c)g.traverse(m=>{if(m.isMesh&&m.material.name==='carpet'){m.material=m.material.clone();m.material.color.set(c)}});return g}
function sofa(par,x,z,rot,len,c,c2){const g=grp(x,z,rot,par);box(len,.38,.85,c2,0,.19,0,g);box(len,.62,.22,c2,0,.52,-.33,g);box(.22,.58,.85,c2,-len/2-.06,.29,0,g);box(.22,.58,.85,c2,len/2+.06,.29,0,g);
 const n=Math.max(1,Math.round(len)),seats=[];for(let i=0;i<n;i++){const lx=-len/2+(i+.5)*len/n;box(len/n-.06,.1,.62,c,lx,.43,.08,g);box(len/n-.08,.36,.12,c,lx,.62,-.18,g);seats.push(lx)}
 g.updateMatrix();return seats.map(lx=>new THREE.Vector3(lx,0,.12).applyMatrix4(g.matrix))}
function plant(par,x,z,s=1){put('pottedPlant',x,0,z,(x*7+z*3)%6.28,K*s,par)}
function shelf(par,x,z,rot,w,h){const g=grp(x,z,rot,par);const wd='#8b5e3c';box(w,h,.04,wd,0,h/2,-.18,g);box(.05,h,.4,wd,-w/2,h/2,0,g);box(.05,h,.4,wd,w/2,h/2,0,g);box(w,.05,.4,wd,0,h,0,g);
 const cols=['#ef4444','#3b82f6','#f59e0b','#10b981','#8b5cf6','#ec4899','#f3f4f6','#1f2937'];const rows=Math.floor(h/.45);
 for(let r=0;r<rows;r++){const y=.06+r*.45;box(w-.06,.03,.38,'#6d4428',0,y,0,g,false);let bx=-w/2+.06,i=r*5+Math.round(Math.abs(x)*3+z);
  while(bx<w/2-.14){const bw=.06+((i*7)%5)*.02,bh=.24+((i*3)%4)*.03;box(bw,bh,.26,cols[Math.abs(i)%8],bx+bw/2,y+.015+bh/2,0,g,false);bx+=bw+.012;i++}}}
const LEDS=[];
function rack(par,x,z){box(.8,2.1,.8,'#262a33',x,1.05,z,par);box(.7,1.92,.02,'#1a1d24',x,1.05,z+.41,par,false);
 for(let r=0;r<8;r++){box(.6,.12,.02,'#3a404c',x,.25+r*.23,z+.42,par,false);for(let j=0;j<3;j++){const m=new THREE.MeshBasicMaterial({color:'#14532d'});const l=new THREE.Mesh(new THREE.BoxGeometry(.04,.04,.02),m);l.position.set(x+.13+j*.07,.25+r*.23,z+.435);par.add(l);LEDS.push(m)}}}
function board(par,x,z,w){box(w,1.2,.05,'#ffffff',x,1.6,z,par);box(w+.1,.06,.07,DK,x,2.23,z+.01,par);
 ['#fde047','#86efac','#93c5fd','#f9a8d4','#fde047','#c4b5fd'].forEach((c,i)=>box(.3,.26,.02,c,x-w/2+.45+(i%3)*(w-.9)/2,1.3+Math.floor(i/3)*.4,z+.04,par,false))}

/*FLOORS*/

/* ресепшн */
let RSIGN;{const g=shell(0);
 RSIGN=sign(g,'ҰСТАЗ ОРТАЛЫҒЫ','Түркістан жоғары көпсалалы, қолөнер колледжі',-1.5,1.8,-4.98,7,'#1d2130','#fbbf24');
 const cg=grp(0,-1.2,PI,g);const rs=desk(cg,0,0,2.4,2);put('chairDesk',0,0,.85,PI,K,cg);
 box(4.4,1.05,.5,'#f8fafc',0,.52,.55,g);box(4.4,.08,.6,'#f59e0b',0,1.08,.55,g);
 SPOT.rec={lv:0,scr:rs,pts:[],seat:[0,-2.05,0,.49]};
 const ws=sofa(g,-7,3.6,PI,3,'#fde68a','#f59e0b');sofa(g,-9.2,1,PI/2,2,'#fde68a','#f59e0b');
 SPOT.wait={lv:0,pts:[[-7,2.6]],seat:[ws[1].x,ws[1].z,PI,.6]};
 box(1.4,.4,.8,'#f8fafc',-7,.2,1.9,g);plant(g,-9.5,-4.4,1.3);plant(g,-3.6,-4.4,1);plant(g,4.4,-4.4,1);plant(g,9.4,4.3,1.1);
 box(2.4,.02,1.6,'#9ca3af',8.7,.05,4.1,g,false);
 shelf(g,6.5,-4.85,0,2.4,1.6)}
SPOT.door={lv:0,pts:[],seat:[8.7,4.3,PI,0]};SPOT.counter={lv:0,pts:[[3,2.2]],seat:[0,1.25,PI,0]};

/* архив */
{const g=shell(-1);
 sign(g,'−1 · МҰРАҒАТ','Архив документов · RAG + MCP-сервер',-2.5,2.05,-4.98,5);
 [-9.2,-7,-4.8].forEach(x=>shelf(g,x,-4.75,0,2,2.2));[-8.1,-5.9].forEach(x=>shelf(g,x,-1.6,0,2,1.5));
 [1.5,2.5,3.5,4.5,5.5,6.5,7.5,8.5].forEach(x=>rack(g,x,-4.4));[3,4,5,6,7].forEach(x=>rack(g,x,-1.8));
 const ls=desk(g,-4,2.2);chair(g,-4,3.05,PI,'#14b8a6');SPOT.lib={lv:-1,scr:ls,pts:[],seat:[-4,3.05,PI,.49]};
 plant(g,-9.4,4.3,1);box(5.6,.08,.3,'#14b8a6',5,2.35,-4.4,g)}

/* лифт */
const SX=11.6,SZ=-2.6;
box(1.9,7*H+.4,1.9,glassM,SX,(5*H+H)/2-H/2+.6,SZ,COL,false);
[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>box(.08,7*H+.4,.08,DK,SX+a*.95,(5*H+H)/2-H/2+.6,SZ+b*.95,COL));
FLOORS.forEach(f=>box(1.4,.1,1.9,'#cfd5df',10.6+.1,f.lv*H-.05,SZ,COL));
const capsule=box(1.2,1.1,1.2,M('#fbbf24',{emissive:'#f59e0b',emissiveIntensity:.35}),SX,.7,SZ,COL);
const PACK=[];for(let i=0;i<18;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.07,8,6),new THREE.MeshBasicMaterial({color:'#14b8a6'}));m.visible=false;COL.add(m);PACK.push(m)}
let ragCount=0,ragTop=1;

/* ---------- агенты ---------- */
const ST={work:['Жұмыста','#16a34a'],think:['Ойлануда','#2563eb'],wait:['Күтуде','#d97706'],rest:['Демалуда','#8a90a2'],walk:['Жүріп келеді','#7c3aed'],idle:['Ұстаз','#f59e0b']};
let ci=0;const nextModel=()=>CN[(ci++)%CN.length];
function makeAgent(id,name,role,lv,home,work,model){
 const g=CH[model],o=THREE.SkeletonUtils.clone(g.scene);o.scale.setScalar(S);o.traverse(m=>{if(m.isMesh){m.castShadow=true;m.frustumCulled=false}});
 const root=new THREE.Group();root.add(o);GROUPS[lv].add(root);const mx=new THREE.AnimationMixer(o),act={};
 ['idle','walk','sit','emote-yes','interact-right'].forEach(n=>{const c=g.animations.find(x=>x.name===n);if(c)act[n]=mx.clipAction(c)});
 const B={};o.traverse(n=>B[n.name]=n);const rest={};['arm-left','arm-right','head'].forEach(n=>rest[n]=B[n].quaternion.clone());
 const a={id,name,role,lv,home,work,st:'rest',fig:{root,model:o,mx,act,B,rest,cur:null},spot:home,sitting:true,path:null,face:0,seatY:.49};
 const s=SPOT[home].seat;root.position.set(s[0],0,s[1]);root.rotation.y=a.face=s[2];a.seatY=s[3];a.sitting=s[3]>0;
 a.lab=document.createElement('div');a.lab.className='lbl';a.lab.innerHTML=`<b>${name}</b><span></span>`;labelsEl.appendChild(a.lab);
 AG[id]=a;return a}
makeAgent('teacher','Ұстаз','Учитель',0,'door','counter','mini_male_a');AG.teacher.sitting=false;
makeAgent('rec','Бас оркестратор','Тапсырманы қабылдап, қабатты таңдайды',0,'rec','rec','mini_male_d');
makeAgent('lib','Кітапханашы','Мұрағаттан RAG арқылы іздейді (MCP)',-1,'lib','lib','mini_female_c');
[1,2,3,4,5].forEach(lv=>{STAFF[lv].forEach(([n,r],i)=>{if(i===0)makeAgent(`h${lv}`,n,r,lv,`h${lv}`,`h${lv}`,nextModel());
 else makeAgent(`a${lv}_${i-1}`,n,r,lv,`s${lv}_${i-1}`,`d${lv}_${i-1}`,nextModel())})});

function play(a,n){const f=a.fig;if(f.cur===n||!f.act[n])return;f.act[n].reset().fadeIn(.25).play();if(f.cur)f.act[f.cur].fadeOut(.25);f.cur=n}
function screens(){for(const k in SPOT){const s=SPOT[k];if(!s.scr)continue;const occ=Object.values(AG).find(a=>a.spot===k);const on=!!occ&&(occ.st==='work'||occ.st==='think');
 s.scr.forEach((m,i)=>{if(m.on===on)return;m.on=on;m.map=on?TEX[i%2]:null;m.color.set(on?'#ffffff':'#2a303c');m.needsUpdate=true})}}
function setState(id,s,task){const a=AG[id],[lab,col]=ST[s];a.st=s;a.task=task||'';a.lab.style.borderColor=col;
 a.lab.querySelector('span').textContent=s==='rest'||s==='idle'?'':lab;a.lab.querySelector('span').style.color=col;screens();floorCards()}
function goTo(id,dest){const a=AG[id],from=SPOT[a.spot]||{pts:[]},to=SPOT[dest];
 const p=[...from.pts].reverse().concat(to.pts,[[to.seat[0],to.seat[1]]]);a.spot=null;a.sitting=false;if(a.st!=='idle')setState(id,'walk',a.task);
 a.path=p.map(([x,z])=>new THREE.Vector3(x,0,z));
 return new Promise(r=>{a.arrive=()=>{a.spot=dest;a.sitting=to.seat[3]>0;a.face=to.seat[2];a.seatY=to.seat[3];r()}})}
const W=new THREE.Vector3();
const wpos=id=>{AG[id].fig.root.getWorldPosition(W);return W.clone()};
const PAPERS=[];
function fly(A,B){return new Promise(r=>{const m=box(.26,.02,.34,'#ffffff',A.x,A.y+1.4,A.z,scene);PAPERS.push({m,A:A.clone(),B:B.clone(),t:0,r})})}
const capPos=()=>capsule.position.clone().setY(capsule.position.y-1.2);
let capTarget=null;
let capQ=Promise.resolve();let pending=null;
function capsuleTo(lv){const p=capQ.then(()=>new Promise(r=>{capTarget={y:lv*H+.7,r}}));capQ=p;return p}

/* ---------- метки ---------- */
const FLAB={};FLOORS.forEach(f=>{const d=document.createElement('div');d.className='room';d.innerHTML=`<i class="dot"></i>${f.lv<0?'−1':f.lv} · ${f.kz}<span class="sub"> · ${f.ru}</span>`;d.title=f.ru;
 const st=document.createElement('em');st.className='fst';d.appendChild(st);
 d.onclick=()=>focusFloor(f.lv,true);labelsEl.appendChild(d);FLAB[f.lv]={d,st,v:new THREE.Vector3(-10.2,f.lv*H+3.1,5.2)};
 const fr=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(20.8,2.9,10.8)),new THREE.LineBasicMaterial({color:'#f5b400'}));fr.position.y=1.45;fr.visible=false;GROUPS[f.lv].add(fr);FLAB[f.lv].fr=fr});
const WAIT=new Set();
function floorState(lv){if(WAIT.has(lv))return['Сізді күтеді','need'];if(Object.values(AG).some(a=>a.lv===lv&&a.id!=='teacher'&&!['rest','idle'].includes(a.st)&&!a.wander))return['Жұмыста','work'];return['Тапсырма жоқ','idle']}
/* табло на крыше */
const ROOF=new THREE.Mesh(new THREE.PlaneGeometry(13,13*200/1024),new THREE.MeshBasicMaterial({transparent:true,side:THREE.DoubleSide}));ROOF.position.set(0,6*H+1.6,0);ROOF.rotation.y=Math.atan2(OFF.x,OFF.z);COL.add(ROOF);
box(.15,1.6,.15,'#475569',-3.5,6*H-.2,0,COL);box(.15,1.6,.15,'#475569',3.5,6*H-.2,0,COL);
let roofKey='';function roofUpd(){const n=Object.keys(AG).length-1,wk=Object.values(AG).filter(a=>a.id!=='teacher'&&['work','think','wait'].includes(a.st)).length,nw=WAIT.size;
 const k=n+'|'+wk+'|'+nw;if(k===roofKey)return;roofKey=k;if(ROOF.material.map)ROOF.material.map.dispose();
 ROOF.material.map=signTex(`7 ҚАБАТ · ${n} АГЕНТ`,nw?`${nw} қабат сізді күтеді`:wk?`${wk} агент жұмыста`:'Барлығы тапсырма күтуде','#0E2A47',nw?'#F5B400':'#ffffff');ROOF.material.needsUpdate=true}
roofUpd();

/* ---------- камера ---------- */
let focus=null,view='col',camGoal={t:new THREE.Vector3(0,2*H,0),zoom:1,off:OFF},camAnim=0;
function focusFloor(lv,user){if(view!=='col')setView('col');if(user)follow=false;$('follow').classList.toggle('sel',follow);
 focus=lv;FLOORS.forEach(f=>GROUPS[f.lv].visible=lv===null||f.lv<=lv);
 camGoal={t:lv===null?new THREE.Vector3(1.2,2.5*H,0):new THREE.Vector3(1.5,lv*H+.4,0),zoom:lv===null?Math.min(1.05,(cam.top-cam.bottom)/54):Math.min(2.2,(cam.right-cam.left)/22),off:OFF};camAnim=1;
 document.querySelectorAll('#floors button').forEach(b=>b.classList.toggle('sel',String(lv)===b.dataset.lv));floorCards()}
function camFollow(lv){if(follow)focusFloor(lv,false)}

/* ---------- кадр ---------- */
function upd(a,dt,t){const f=a.fig,R=f.root;
 if(a.path){const tg=a.path[0],dx=tg.x-R.position.x,dz=tg.z-R.position.z,d=Math.hypot(dx,dz),st=2.4*speed*dt;
  if(d<=st){R.position.x=tg.x;R.position.z=tg.z;a.path.shift();if(!a.path.length){a.path=null;const cb=a.arrive;a.arrive=null;cb&&cb();screens()}}
  else{R.position.x+=dx/d*st;R.position.z+=dz/d*st;a.face=Math.atan2(dx,dz)}}
 let dr=a.face-R.rotation.y;dr=Math.atan2(Math.sin(dr),Math.cos(dr));R.rotation.y+=dr*Math.min(1,dt*12);
 const B=f.B;for(const n in f.rest)B[n].quaternion.copy(f.rest[n]);
 if(a.path){play(a,'walk');f.act.walk.timeScale=Math.min(2.2,speed);f.model.position.y=0}
 else if(a.sitting){play(a,'sit');f.model.position.y=a.seatY-SIT}
 else{play(a,a.emote?'emote-yes':'idle');f.model.position.y=0}
 f.mx.update(dt);
 if(!a.path&&a.sitting){
  if(a.st==='work'){B['arm-left'].rotateX(-1*(1+Math.sin(t*18)*.18));B['arm-right'].rotateX(-1*(1-Math.sin(t*18)*.18));B.head.rotateX(.12)}
  else if(a.st==='think'){B['arm-right'].rotateX(-2.1);B.head.rotateX(-.15+Math.sin(t*2)*.05)}
  else if(a.st==='wait'){B.head.rotateY(Math.sin(t*2)*.35)}
  else if(a.st==='rest'){B.head.rotateX(.22+Math.sin(t*1.5)*.05)}}}
const V=new THREE.Vector3();
function place(el,v,w,h){V.copy(v).project(cam);el.style.transform=`translate(${((V.x+1)/2*w).toFixed(1)}px,${((1-V.y)/2*h).toFixed(1)}px) translate(-50%,-100%)`}
function resize(){const w=sceneEl.clientWidth||Math.min(1156,innerWidth-24),ab=document.querySelector('.appbar'),top=document.fullscreenElement?0:(innerWidth<900&&ab?ab.offsetHeight:0),h=Math.max(460,innerHeight-top);sceneEl.style.height=h+'px';renderer.setSize(w,h);
 const asp=w/h,view=Math.max(44,30/asp);Object.assign(cam,{left:-view*asp/2,right:view*asp/2,top:view/2,bottom:-view/2});cam.updateProjectionMatrix()}
addEventListener('resize',resize);resize();
controls.target.copy(camGoal.t);cam.position.copy(camGoal.t).add(OFF);cam.lookAt(controls.target);
controls.addEventListener('start',()=>{camAnim=0});
const clock=new THREE.Clock();
(function loop(){requestAnimationFrame(loop);const dt=Math.min(clock.getDelta(),.05),t=clock.elapsedTime;if(!sceneEl.offsetParent)return;
 for(const id in AG)upd(AG[id],dt,t);
 if(capTarget){const dy=capTarget.y-capsule.position.y,st=7*speed*dt;if(Math.abs(dy)<=st){capsule.position.y=capTarget.y;const r=capTarget.r;capTarget=null;r()}else capsule.position.y+=Math.sign(dy)*st}
 for(let i=PAPERS.length-1;i>=0;i--){const p=PAPERS[i];p.t+=dt*speed/.85;const k=Math.min(1,p.t);p.m.position.lerpVectors(p.A,p.B,k);p.m.position.y=(p.A.y+(p.B.y-p.A.y)*k)+1.4+2.2*k*(1-k);p.m.rotation.y=k*6;
  if(k>=1){scene.remove(p.m);PAPERS.splice(i,1);p.r()}}
 const on=ragCount>0;LEDS.forEach((m,i)=>{const l=on?((t*14+i*1.7)%2<1):Math.sin(t*1.2+i*2.3)>.55;m.color.set(l?'#22c55e':'#14532d')});
 const y0=-H+.8,y1=ragTop*H+1.2;PACK.forEach((m,i)=>{m.visible=on&&(focus===null||ragTop<=focus);if(on)m.position.set(SX-.5,y0+((t*.5*speed+i/PACK.length)%1)*(y1-y0),SZ+1.05)});
 if(camAnim){const ck=Math.min(1,dt*4);controls.target.lerp(camGoal.t,ck);cam.zoom+=(camGoal.zoom-cam.zoom)*ck;cam.updateProjectionMatrix();
  const want=controls.target.clone().add(camGoal.off);cam.position.lerp(want,ck);if(controls.target.distanceTo(camGoal.t)<.02&&Math.abs(cam.zoom-camGoal.zoom)<.005)camAnim=0}
 ANIM.forEach(f=>f(t,dt*speed));ambient(dt);controls.update();renderer.render(scene,cam);
 const w=sceneEl.clientWidth,h=sceneEl.clientHeight;
 for(const id in AG){const a=AG[id],vis=view==='col'&&GROUPS[a.lv].visible&&(focus!==null?a.lv===focus:(['work','think','wait'].includes(a.st)||(a.st==='walk'&&!a.wander&&busy)||(id==='teacher'&&busy)));a.lab.style.display=vis?'':'none';
  if(vis){a.fig.B.head.getWorldPosition(V);V.y+=.95;place(a.lab,V,w,h)}}
 FLOORS.forEach(f=>{const L=FLAB[f.lv],vis=view==='col'&&GROUPS[f.lv].visible;L.d.style.display=vis?'':'none';if(vis)place(L.d,L.v,w,h);
  const [stt,cls]=floorState(f.lv);const rb=$("floors").querySelector(`[data-lv="${f.lv}"]`);if(rb&&rb.dataset.st!==cls)rb.dataset.st=cls;if(L.st.textContent!==stt){L.st.textContent=cls==='need'?stt:'';L.st.className='fst '+cls;L.d.dataset.st=cls}
  L.d.classList.toggle('live',cls==='work');L.d.classList.toggle('need',cls==='need');L.fr.visible=cls==='need'&&Math.sin(t*4)>-.6});
 roofUpd();ROOF.visible=view==='col'&&(focus===null||focus>=5);
 $('hAct').textContent=Object.values(AG).filter(a=>a.st==='work').length;netFrame(dt,t,w,h)})();

/*NET*/
/* ---------- фоновая жизнь: агенты иногда встают и идут к предметам ---------- */
let ambT=2;function ambient(dt){if(busy||view!=='col')return;ambT-=dt*speed;if(ambT>0)return;ambT=2.5+Math.random()*2.5;
 const c=Object.values(AG).filter(a=>/^a\d_\d$/.test(a.id)&&a.st==='rest'&&!a.path&&a.spot===a.home&&!a.wander&&!Object.values(AG).some(b=>b.wander&&b.lv===a.lv));if(!c.length)return;
 const a=c[Math.floor(Math.random()*c.length)],hs='p'+a.lv;if(!SPOT[hs])return;a.wander=true;
 (async()=>{try{await goTo(a.id,hs);setState(a.id,'think','');a.lab.querySelector('span').textContent='';await sleep(3500+Math.random()*2500);
  if(!busy&&a.spot===hs){await goTo(a.id,a.home);setState(a.id,'rest','')}}finally{a.wander=false}})()}
/* ---------- сценарии ---------- */
const TASKS={
 1:[[0,'КТП-дан тақырып пен оқыту нәтижелерін алу',4,1],[1,'Сабақ жоспарын колледж үлгісімен жазу',4.5,1],[2,'Практикалық жұмыс пен слайдтар',4]],
 2:[[0,'Сабақ кестесінде бос сағатты табу',3.5],[1,'Тест сұрақтары мен жауап кілті',4.5],[2,'Бағалау критерийлері мен дескрипторлар',4,1]],
 3:[[0,'Тәуекел тобы: 30 сағат шегіне жақындағандар',4,1],[1,'Ата-аналарға жеке хаттар',3.5],[2,'Жиналыс хаттамасы колледж үлгісімен',4.5,1]],
 4:[[0,'Практика базасымен келісім жобасы',4.5,1],[1,'Тәлімгерге арналған күнделік',4],[2,'WorldSkills тапсырмасының үлгісі',3.5]],
 5:[[0,'Аттестация талаптары мен бұйрық',4.5,1],[1,'Курстар мен сертификаттар есебі',3.5,1],[2,'Сайтқа жаңалық (kz/ru)',4]]};
const log=(m,c)=>{const d=document.createElement('div');if(c)d.className=c;d.innerHTML=`<span class="t">${((performance.now()-t0)/1000).toFixed(1)}s</span>${m}`;$('log').appendChild(d);$('log').scrollTop=1e9};
async function staff(lv,[i,task,sec,rag]){const id=`a${lv}_${i}`,a=AG[id];
 log(`${AG['h'+lv].name} (${lv}-қабат) → ${a.name}: «${esc(task)}»`);
 await fly(wpos('h'+lv),wpos(id));await goTo(id,a.work);setState(id,'work',task);
 if(rag){ragCount++;ragTop=lv;setState('lib','work',lv+'-қабат үшін мұрағаттан іздеуде');log(`${a.name} → MCP: <b>search_docs</b> → Кітапханашы мұрағаттан іздейді`,'mcpl')}
 await sleep(sec*1000);
 if(rag){ragCount--;log(`Мұрағат → ${a.name}: 4 үзінді табылды (үлгі, стандарт)`,'mcpl');if(!ragCount)setState('lib','rest','')}
 setState(id,'wait','нәтижені тапсыруда');await fly(wpos(id),wpos('h'+lv));log(`${a.name} → ${AG['h'+lv].name}: дайын`);
 await goTo(id,a.home);setState(id,'rest','')}
async function floorJob(lv,tk){
 await capsuleTo(0);await capsuleTo(lv);log(`Лифт → ${lv}-қабат (${FL[lv].kz})`);camFollow(lv);
 await fly(capPos(),wpos('h'+lv));setState('h'+lv,'think','жұмысты бөлуде');await sleep(1500);
 setState('h'+lv,'wait','агенттерді күтуде');await Promise.all(((tk&&tk[lv])||TASKS[lv]).map(t=>staff(lv,t)));
 setState('h'+lv,'think','жинап, тексеруде');await sleep(1500);
 await fly(wpos('h'+lv),capPos());setState('h'+lv,'rest','');log(`${lv}-қабат: нәтиже төмен жіберілді`)}
async function run(p){
 if(busy){$('busy').textContent='Орталық бос емес. Ағымдағы тапсырма аяқталғанын күтіңіз.';return}
 busy=true;$('busy').textContent='';$('log').innerHTML='';panel(true,'Жұмыс журналы');t0=performance.now();$('doc').hidden=true;WAIT.clear();pending=null;
 log('Тапсырма: «'+esc(p.text)+'»');camFollow(0);
 AG.teacher.emote=false;await goTo('teacher','counter');
 setState('rec','think','қабаттарды анықтауда');await sleep(1800);
 log('Бас оркестратор: бағыт → '+p.floors.map(l=>`${l}-қабат (${FL[l].kz})`).join(' + '));
 setState('rec','wait','қабаттарды күтуде');await fly(wpos('rec'),capPos());
 if(p.floors.length>1&&follow)focusFloor(null,false);
 const jobs=[];for(const lv of p.floors){jobs.push(floorJob(lv,p.tasks));if(p.floors.length>1)await sleep(400)}
 await Promise.all(jobs);
 await capsuleTo(0);camFollow(0);await fly(capPos(),wpos('rec'));
 setState('rec','think','құжатты тексеруде');await sleep(1500);
 await fly(wpos('rec'),wpos('teacher'));setState('rec','rest','');
 p.floors.forEach(l=>WAIT.add(l));pending=p;
 log('Құжат дайын. Тексеріп, бекітіңіз: «Бекіту» немесе «Түзету».','fin');
 $('docbody').innerHTML=p.doc;$('doctitle').textContent=p.title;$('docstate').textContent='Сізді күтеді';$('docstate').className='dstate need';$('docact').hidden=false;$('doc').hidden=false;
 await sleep(2500);AG.teacher.emote=false;busy=false;Object.values(AG).forEach(x=>x.wander=false)}

/* ---------- интерфейс ---------- */
setState('teacher','idle','');
$('runc').onclick=()=>{const q=$('custom').value.trim();if(!q){$('custom').focus();$('busy').textContent='Алдымен тапсырманы жазыңыз.';return}
 const r=[[/сабақ|урок|жоспар|кт[пж]|презентац|слайд/i,1],[/тест|бағала|оцен|дескрипт|критери|сұрақ|вопрос/i,2],[/пропуск|ата-ана|родител|куратор|хаттама|протокол|отчисл/i,3],[/практика|шеберхана|мастерск|worldskills|дуал|кәсіпорын|предприят|тәлімгер/i,4],[/жаңалық|новост|сайт|аудар|перев|хабарланд|объявл|аттестац|портфолио|бұйрық|приказ|жалақы|ведомост|есеп|отчёт|отчет|директор/i,5],[/кесте|расписан|журнал|үлгерім/i,2]];
 const floors=[...new Set(r.filter(([re])=>re.test(q)).map(x=>x[1]))];if(!floors.length)floors.push(1);
 run({text:q,floors,saved:45*floors.length,title:'Дайын құжат',doc:DOCS.custom(q,floors)})};
$('custom').oninput=()=>{if(!busy)$('busy').textContent=''};
[1,2,4].forEach(v=>$('sp'+v).onclick=()=>{speed=v;$('spBtn').textContent=v+'×';[1,2,4].forEach(u=>$('sp'+u).classList.toggle('sel',u===v))});
$('follow').onclick=()=>{follow=!follow;$('follow').classList.toggle('sel',follow)};
$('docclose').onclick=()=>{$('doc').hidden=true};
$('docok').onclick=()=>{const p=pending;if(!p)return;pending=null;WAIT.clear();$('docact').hidden=true;$('docstate').textContent='Бекітілді';$('docstate').className='dstate ok';
 doneCount++;savedMin+=p.saved;$('hDone').textContent=doneCount;$('hSaved').textContent=savedMin>=60?`${Math.floor(savedMin/60)} сағ ${savedMin%60} мин`:`${savedMin} мин`;
 log(`Оқытушы құжатты бекітті. ~${p.saved} мин үнемделді. Құжат «Құжаттар» бөліміне сақталды.`,'fin');
 window.dispatchEvent(new CustomEvent('shq-done',{detail:{text:p.title||p.text,saved:p.saved||0,floors:p.floors,doc:p.doc,title:p.title}}))};
$('docfix').onclick=()=>{const p=pending;if(!p||busy)return;pending=null;WAIT.clear();$('docact').hidden=true;$('doc').hidden=true;
 log('Оқытушы құжатты түзетуге қайтарды. Агенттер қайта өңдейді.','err');run(p)};
const fb=$('floors');[['Бүкіл ғимарат',null]].concat([...FLOORS].reverse().map(f=>[f.kz,f.lv])).forEach(([t,lv])=>{const b=document.createElement('button');
 b.innerHTML=lv===null?`<span class="nm">${t}</span>`:`<span class="n">${lv<0?'−1':lv}</span><span class="nm">${t}</span><i class="dot"></i>`;if(lv===null)b.className='all';b.title=lv===null?t:FL[lv].ru;
 b.dataset.lv=String(lv);b.onclick=()=>{focusFloor(lv,true);if(lv!==null)panel(true,`${lv<0?'−1':lv} · ${FL[lv].kz}`)};fb.appendChild(b)});
/* правая панель, меню, вид */
function panel(open,title){sceneEl.classList.toggle('has-panel',open);if(title)$('pTitle').textContent=title}
$('pClose').onclick=()=>panel(false);$('pOpen').onclick=()=>panel(true);
new MutationObserver(()=>{if(!$('doc').hidden)panel(true,'Дайын құжат')}).observe($('doc'),{attributes:true,attributeFilter:['hidden']});
document.querySelectorAll('.dd > button').forEach(b=>b.onclick=e=>{e.stopPropagation();const d=b.parentElement,o=!d.classList.contains('open');document.querySelectorAll('.dd').forEach(x=>x.classList.remove('open'));d.classList.toggle('open',o)});
document.addEventListener('click',()=>document.querySelectorAll('.dd.open').forEach(x=>x.classList.remove('open')));
$('fitBtn').onclick=()=>{if(view==='col')focusFloor(null,true);else setView(view)};
$('fsBtn').onclick=()=>{try{document.fullscreenElement?document.exitFullscreen():sceneEl.requestFullscreen()}catch(e){}};document.addEventListener('fullscreenchange',()=>setTimeout(resize,60));
controls.addEventListener('start',()=>sceneEl.classList.add('orbit'));controls.addEventListener('end',()=>sceneEl.classList.remove('orbit'));
focusFloor(null,false);follow=true;$('follow').classList.add('sel');
function floorCards(){const el=$('fcards');if(!el)return;el.innerHTML=[...FLOORS].reverse().filter(f=>focus===null||f.lv===focus).map(f=>{const ags=Object.values(AG).filter(a=>a.lv===f.lv&&a.id!=='teacher');
 return `<div class="card" style="border-left-color:${f.ac}"><div class="nm">${f.lv<0?'−1':f.lv} · ${f.kz} <span>${f.ru}</span></div>${ags.map(a=>`<div class="ag"><i style="background:${ST[a.st][1]}"></i><b>${a.name}</b> — ${a.role}${a.st!=='rest'&&a.task?` <em>· ${esc(a.task)}</em>`:''}</div>`).join('')}</div>`}).join('')}
floorCards();
setView('kz');
$('loading').remove();
})().catch(e=>{const l=document.getElementById('loading');if(l)l.textContent='3D жүктелмеді: '+e.message;console.error(e)});
