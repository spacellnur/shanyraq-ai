/* ---------- здание: этажи по реальным службам колледжа ---------- */
const H=5.6;
const FLOORS=[
 {lv:-1,kz:'Мұрағат',ru:'Кітапхана мен құжаттар · RAG + MCP',floor:'#8e97a6',ac:'#14b8a6'},
 {lv:0,kz:'Қабылдау',ru:'Ресепшн · бас оркестратор',floor:'#e6dcc8',ac:'#f59e0b'},
 {lv:1,kz:'Әдістеме',ru:'Әдістемелік кабинет · КТП, сабақ жоспары',floor:'#e4d6f0',ac:'#8b5cf6'},
 {lv:2,kz:'Оқу бөлімі',ru:'Кесте, журнал, бағалау',floor:'#d3e0f2',ac:'#2563eb'},
 {lv:3,kz:'Тәрбие',ru:'Кураторлар, психолог, әлеуметтік педагог',floor:'#d6ead6',ac:'#16a34a'},
 {lv:4,kz:'Шеберхана',ru:'Өндірістік оқыту, практика, WorldSkills',floor:'#ead9c6',ac:'#ea580c'},
 {lv:5,kz:'Әкімшілік',ru:'Директор, кадр, бухгалтерия, баспасөз',floor:'#d9dee6',ac:'#0e7490'}];
const FL={};FLOORS.forEach(f=>FL[f.lv]=f);
const STAFF={
 1:[['Әдіскер','Әдістемелік жұмысты басқарады'],['КТП маманы','Күнтізбелік-тақырыптық жоспар'],['Сабақ жоспарын жазушы','Колледж үлгісімен жоспар'],['Материал дайындаушы','Практика, слайд, үлестірме']],
 2:[['Оқу бөлімінің меңгерушісі','Оқу процесін бақылайды'],['Кесте құрастырушы','Сабақ кестесі, ауыстырулар'],['Тест құрастырушы','Тест, кілт, дескриптор'],['Журнал талдаушы','Үлгерім мен қатысу']],
 3:[['Тәрбие ісі орынбасары','Тәрбие жұмысын басқарады'],['Педагог-психолог','Тәуекел тобы, кеңес'],['Әлеуметтік педагог','Ата-аналармен байланыс'],['Куратор көмекшісі','Хаттама, кураторлық сағат']],
 4:[['Өндірістік оқыту шебері','Практика мен шеберханалар'],['Практика үйлестірушісі','Кәсіпорындармен келісім'],['Дуалды оқыту маманы','Тәлімгерлер, күнделік'],['WorldSkills сарапшысы','Чемпионатқа дайындық']],
 5:[['Директор','Колледжді басқарады'],['Кадр маманы','Бұйрық, аттестация, портфолио'],['Бухгалтер','Жалақы, есептер'],['Баспасөз хатшысы','Сайт пен әлеуметтік желі']]};
const glassM=M('#d3ecff',{transparent:true,opacity:.28,roughness:.05});
const COL=new THREE.Group();scene.add(COL);
const GROUPS={},SPOT={},AG={},ANIM=[];
const DX=[-3.6,0,3.6];
function shell(lv){const f=FL[lv],g=new THREE.Group();g.position.y=lv*H;COL.add(g);GROUPS[lv]=g;
 box(20.6,.3,10.6,lv<0?'#5b6271':'#cfd5df',0,-.15,0,g);box(20,.04,10,f.floor,0,.02,0,g,false);
 const wc=lv<0?'#6b7280':'#f8f8fa';box(20.4,2.7,.22,wc,0,1.35,-5.1,g);box(.22,2.7,10.4,wc,-10.1,1.35,0,g);
 box(20.4,.06,.24,DK,0,2.72,-5.1,g);box(.24,.06,10.4,DK,-10.1,2.72,0,g);
 box(20.4,.12,.12,f.ac,0,.06,5.2,g,false);
 return g}
/* мелкие предметы */
const canvasTex=(w,h,draw)=>{const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'));const t=new THREE.CanvasTexture(c);t.anisotropy=4;return t};
function wallPanel(g,x,y,z,w,h,tex,rot=0){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex}));m.position.set(x,y,z);m.rotation.y=rot;g.add(m);return m}
function seatAt(lv,i,x,z,rot,sy,pts){SPOT[`s${lv}_${i}`]={lv,pts:pts||[[x,-2.85]],seat:[x,z,rot,sy]}}
function hot(lv,x,z,rot,pts){SPOT[`p${lv}`]={lv,pts,seat:[x,z,rot,0]}}
function cabinet(g,x,z,rot,c='#9aa5b4',drawers=4){const k=grp(x,z,rot,g);box(.7,1.3,.55,c,0,.65,0,k);for(let i=0;i<drawers;i++){box(.62,.26,.02,'#cfd6df',0,.22+i*.3,.28,k,false);box(.16,.03,.03,DK,0,.25+i*.3,.3,k,false)}}
function stool(g,x,z,c){cyl(.2,.2,.06,c,x,.47,z,g,14);cyl(.03,.03,.44,DK,x,.22,z,g,6)}
function roundTable(g,x,z,r=.8){cyl(r,r,.06,'#f4f4f6',x,.74,z,g,24);cyl(.07,.07,.72,DK,x,.37,z,g,8)}
function flag(g,x,z,h=2.2){cyl(.03,.03,h,'#d1d5db',x,h/2,z,g,8);const t=canvasTex(240,120,c=>{c.fillStyle='#00AFCA';c.fillRect(0,0,240,120);c.fillStyle='#FEC50C';c.beginPath();c.arc(130,52,22,0,7);c.fill();for(let i=0;i<24;i++){const a=i/24*6.283;c.fillRect(130+Math.cos(a)*30-2,52+Math.sin(a)*30-2,4,4)}c.fillRect(14,8,10,104)});
 const geo=new THREE.PlaneGeometry(.9,.45,8,1),m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({map:t,side:THREE.DoubleSide}));m.position.set(x+.47,h-.3,z);g.add(m);
 const base=geo.attributes.position.array.slice();ANIM.push((tt)=>{const p=geo.attributes.position.array;for(let i=0;i<p.length;i+=3){const u=(base[i]+.45)/.9;p[i+2]=Math.sin(tt*3+u*5)*.06*u}geo.attributes.position.needsUpdate=true})}
function clockOn(g,x,y,z){cyl(.32,.32,.04,'#ffffff',x,y,z,g,24).rotation.x=PI/2;cyl(.34,.34,.03,DK,x,y,z-.01,g,24).rotation.x=PI/2;
 const hand=(l,c)=>{const p=new THREE.Group();p.position.set(x,y,z+.03);const m=box(.025,l,.01,c,0,l/2,0,p,false);g.add(p);return p};const hh=hand(.17,DK),mm=hand(.26,'#ef4444');
 ANIM.push(tt=>{mm.rotation.z=-tt*.8;hh.rotation.z=-tt*.8/12})}
function headRoom(g,lv,f){box(.08,2.5,6.2,glassM,6.2,1.25,-2,g,false);box(.08,2.5,2.4,glassM,6.2,1.25,3.8,g,false);box(.1,.06,10,DK,6.2,2.5,0,g);
 const hs=desk(g,8.3,-2.2,1.6,2);chair(g,8.3,-1.35,PI,'#1f2937');SPOT[`h${lv}`]={lv,scr:hs,pts:[],seat:[8.3,-1.35,PI,.49]};
 plant(g,9.5,-4.4,1.1);plant(g,9.5,4.3,.9)}
function deskRow(g,lv,f){DX.forEach((x,i)=>{const scr=desk(g,x,-1.7);chair(g,x,-.85,PI,f.ac);SPOT[`d${lv}_${i}`]={lv,scr,pts:[[x-1.2,-2.85],[x-1.2,.15],[x,.15]],seat:[x,-.85,PI,.49]}})}
function base(lv){const f=FL[lv],g=shell(lv);sign(g,`${lv} · ${f.kz.toUpperCase()}`,f.ru,-1.2,2.05,-4.98,4.6);
 box(9.6,.02,3.6,'#ffffff',0,.045,-0.9,g,false).material=M(f.ac,{transparent:true,opacity:.16});deskRow(g,lv,f);headRoom(g,lv,f);return[g,f]}

/* 1 · Әдістемелік кабинет: проектор, дөңгелек үстел, папкалар, флипчарт */
{const [g,f]=base(1);let slide=0;const sl=['#8b5cf6','#0ea5e9','#f59e0b','#16a34a'];
 const tex=canvasTex(320,180,()=>{}),draw=()=>{const c=tex.image.getContext('2d');c.fillStyle='#fff';c.fillRect(0,0,320,180);c.fillStyle=sl[slide%4];c.fillRect(0,0,320,34);
  c.fillStyle='#fff';c.font='bold 20px sans-serif';c.fillText(['Сабақ мақсаты','Оқыту нәтижелері','Практикалық жұмыс','Бағалау'][slide%4],12,24);c.fillStyle='#cbd5e1';for(let i=0;i<5;i++)c.fillRect(16,52+i*22,180+((i*53+slide*31)%100),9);
  c.fillStyle=sl[(slide+1)%4];c.fillRect(230,60,70,90);tex.needsUpdate=true};draw();
 wallPanel(g,-7.4,1.55,-4.97,3.2,1.8,tex);box(.5,.2,.4,'#e5e7eb',-7.4,2.55,-3.2,g);
 let acc=0;ANIM.push((t,dt)=>{acc+=dt;if(acc>3){acc=0;slide++;draw()}});
 roundTable(g,-7.4,-2.6,.9);[[-8.5,-2.6,PI/2],[-7.4,-1.5,PI],[-6.3,-2.6,-PI/2]].forEach(([x,z,r],i)=>{chair(g,x,z,r,f.ac);seatAt(1,i,x,z,r,.49,[[-5.2,-2.85],[-5.2,-1.2],[x,-1.2]])});
 [0,1].forEach(i=>shelf(g,-9.8,.4+i*2.2,PI/2,2,1.6));
 const fc=grp(-2.4,4.3,PI,g);box(1,1.2,.04,'#fff',0,1.25,0,fc);box(.04,1.6,.04,DK,-.4,.8,.1,fc);box(.04,1.6,.04,DK,.4,.8,.1,fc);['#8b5cf6','#f59e0b','#16a34a'].forEach((c,i)=>box(.7-i*.15,.05,.01,c,-.05,1.55-i*.2,-.03,fc,false));
 hot(1,-2.4,3.4,PI,[[-5.2,-2.85],[-5.2,2.6]]);plant(g,-9.4,4.4,1.1);plant(g,4.9,4.3,1)}

/* 2 · Оқу бөлімі: сабақ кестесі, шкафтар, көшірме құрылғысы */
{const [g,f]=base(2);const days=['Дс','Сс','Ср','Бс','Жм'],cc=['#bfdbfe','#fde68a','#bbf7d0','#fbcfe8','#ddd6fe','#fed7aa'];let hl=0;
 const tex=canvasTex(400,220,()=>{}),draw=()=>{const c=tex.image.getContext('2d');c.fillStyle='#fff';c.fillRect(0,0,400,220);c.fillStyle='#1e3a8a';c.font='bold 18px sans-serif';c.fillText('САБАҚ КЕСТЕСІ',12,22);
  days.forEach((d,i)=>{c.fillStyle='#334155';c.font='14px sans-serif';c.fillText(d,48+i*68,46);for(let r=0;r<5;r++){const k=(i*5+r);c.fillStyle=k===hl?'#2563eb':cc[(i*3+r*2)%6];c.fillRect(30+i*68,54+r*32,62,26)}});tex.needsUpdate=true};draw();
 wallPanel(g,-7.3,1.55,-4.97,3.6,1.95,tex);let acc=0;ANIM.push((t,dt)=>{acc+=dt;if(acc>1.2){acc=0;hl=(hl+7)%25;draw()}});
 [-.6,.3,1.2,2.1,3].forEach((z,i)=>cabinet(g,-9.65,z,PI/2,i%2?'#93c5fd':'#9aa5b4'));
 [-8.6,-7.4,-6.2].forEach((x,i)=>{chair(g,x,-3.3,0,f.ac);seatAt(2,i,x,-3.3,0,.49,[[-5.2,-2.85],[x,-2.4]])});
 const cp=grp(-3,4,PI,g);box(.9,.9,.7,'#e5e7eb',0,.45,0,cp);box(.8,.08,.5,'#94a3b8',0,.94,0,cp);const led=box(.06,.06,.02,M('#22c55e',{emissive:'#22c55e',emissiveIntensity:.8}),.3,.8,-.36,cp,false);
 const paper=box(.3,.01,.4,'#ffffff',0,.62,-.5,cp,false);ANIM.push(t=>{const k=(t*.6)%1;paper.position.z=-.36-k*.3;paper.visible=k<.8;led.visible=Math.sin(t*6)>0});
 hot(2,-3,3.1,PI,[[-5.2,-2.85],[-5.2,2.4]]);plant(g,-9.4,4.4,1);plant(g,4.9,4.3,1)}

/* 3 · Тәрбие: психолог бұрышы, кілем, пуфиктер, іс-шаралар тақтасы, ту */
{const [g,f]=base(3);
 cyl(1.6,1.6,.02,'#fde68a',-7.4,.04,-2.4,g,32);
 [[-8.4,-1.8],[-7.4,-3.3],[-6.4,-1.8]].forEach(([x,z],i)=>{const b=new THREE.Mesh(new THREE.SphereGeometry(.42,16,10),M(['#f472b6','#60a5fa','#34d399'][i]));b.scale.y=.6;b.position.set(x,.26,z);b.castShadow=true;g.add(b);
  seatAt(3,i,x,z,Math.atan2(-7.4-x,-2.4-z),.32,[[-5.2,-2.85],[-5.2,-1],[x,-1]])});
 const arm=grp(-9.1,3.6,PI/2,g);box(.9,.35,.85,'#86efac',0,.3,0,arm);box(.9,.6,.2,'#4ade80',0,.65,-.35,arm);roundTable(g,-8,3.6,.35);plant(g,-9.5,1.8,1.3);plant(g,-6.6,4.5,1.1);
 const tex=canvasTex(320,180,c=>{c.fillStyle='#fefce8';c.fillRect(0,0,320,180);c.fillStyle='#166534';c.font='bold 18px sans-serif';c.fillText('ІС-ШАРАЛАР',12,24);
  ['#fca5a5','#93c5fd','#fde68a','#a7f3d0','#c4b5fd','#fdba74'].forEach((col,i)=>{c.fillStyle=col;c.fillRect(14+(i%3)*102,40+Math.floor(i/3)*66,90,56)})});
 wallPanel(g,-7.4,1.6,-4.97,3,1.7,tex);flag(g,-2.6,4.2);box(2.2,.18,1.2,'#e7e5e4',-2.4,.09,4.2,g);
 hot(3,-2.4,3.2,PI,[[-5.2,-2.85],[-5.2,2.6]]);plant(g,4.9,4.3,1)}

/* 4 · Шеберхана: тігін машиналары, 3D-принтер, манекен, WorldSkills */
{const [g,f]=base(4);
 const bench=(x,z)=>{box(2.4,.08,.9,'#b45309',x,.86,z,g);[[-1.1,-.38],[1.1,-.38],[-1.1,.38],[1.1,.38]].forEach(([a,b])=>box(.06,.84,.06,DK,x+a,.42,z+b,g))};
 bench(-7.4,-3.6);bench(-7.4,-1.2);
 [-8.2,-6.6].forEach((x,i)=>{const sm=grp(x,-3.6,0,g);box(.5,.08,.24,'#f8fafc',0,.94,0,sm);box(.1,.3,.2,'#f8fafc',.2,1.1,0,sm);box(.42,.08,.2,'#f8fafc',0,1.24,0,sm);
  const nd=box(.02,.12,.02,'#94a3b8',-.18,1.12,0,sm,false);ANIM.push(t=>{nd.position.y=1.12+Math.sin(t*22+i)*.03})});
 [[-8.3,-2.6],[-6.5,-2.6],[-7.4,-.3]].forEach(([x,z],i)=>{stool(g,x,z,f.ac);seatAt(4,i,x,z,i<2?PI:0,.45,[[-5.2,-2.85],[-5.2,-.2],[x,z+(i<2?0:.6)]])});
 const pr=grp(-3,4.1,PI,g);box(.9,.06,.9,DK,0,.95,0,pr);[[-.42,-.42],[.42,-.42],[-.42,.42],[.42,.42]].forEach(([a,b])=>box(.05,.95,.05,DK,a,.48,b,pr));box(.9,.06,.9,DK,0,1.9,0,pr);box(.86,.04,.86,'#cbd5e1',0,.98,0,pr,false);
 const head=box(.14,.12,.14,'#f97316',0,1.75,0,pr);const part=cyl(.12,.15,.01,'#38bdf8',0,1.0,0,pr,16);ANIM.push(t=>{head.position.x=Math.sin(t*2.1)*.3;head.position.z=Math.cos(t*1.3)*.3;const k=(t*.05)%1;part.scale.y=1+k*25;part.position.y=1+k*.13});
 const mq=grp(-9.2,2.6,0,g);cyl(.03,.03,.7,DK,0,.35,0,mq,6);cyl(.2,.26,.7,'#fda4af',0,1.05,0,mq,14);const hd=new THREE.Mesh(new THREE.SphereGeometry(.13,12,8),M('#e5e7eb'));hd.position.set(0,1.55,0);mq.add(hd);
 ANIM.push(t=>{mq.rotation.y=Math.sin(t*.5)*.6});
 const ws=canvasTex(300,100,c=>{c.fillStyle='#ea580c';c.fillRect(0,0,300,100);c.fillStyle='#fff';c.font='bold 30px sans-serif';c.fillText('WorldSkills',16,46);c.font='18px sans-serif';c.fillText('Kazakhstan · дайындық',16,78)});
 wallPanel(g,-7.4,2.05,-4.97,2.6,.87,ws);shelf(g,-9.8,.9,PI/2,1.6,1.2);
 hot(4,-3,3.2,PI,[[-5.2,-2.85],[-5.2,2.4]]);plant(g,-9.4,4.4,1);plant(g,4.9,4.3,1)}

/* 5 · Әкімшілік: мәжіліс үстелі, ту, сейф, сағат, марапаттар */
{const [g,f]=base(5);
 box(3.6,.08,1.3,'#7c2d12',-7.2,.76,-2.2,g);[[-8.8,-2.7],[-5.6,-2.7],[-8.8,-1.7],[-5.6,-1.7]].forEach(([x,z])=>box(.08,.72,.08,DK,x,.36,z,g));
 [[-8.2,-3.2,0],[-7.2,-3.2,0],[-6.2,-3.2,0]].forEach(([x,z,r],i)=>{chair(g,x,z,r,'#1f2937');seatAt(5,i,x,z,r,.49,[[-5.2,-2.85],[-5.2,-3.9],[x,-3.9]])});
 [-8.2,-7.2,-6.2].forEach(x=>chair(g,x,-1.2,PI,'#1f2937'));
 flag(g,-9.4,-4.4,2.3);clockOn(g,-4.6,2.1,-4.97);
 const safe=grp(-9.4,1.2,PI/2,g);box(.8,1,.7,'#374151',0,.5,0,safe);cyl(.1,.1,.04,'#d1d5db',.15,.6,.36,safe,12).rotation.x=PI/2;
 [2.1,2.9,3.7].forEach(z=>cabinet(g,-9.65,z,PI/2,'#64748b'));
 const aw=grp(-3,4.5,PI,g);box(1.4,1.6,.4,glassM,0,.8,0,aw,false);box(1.4,.06,.42,'#7c2d12',0,1.62,0,aw);box(1.4,.06,.42,'#7c2d12',0,.02,0,aw);
 [-.4,0,.4].forEach((x,i)=>{const cup=cyl(.07,.12,.25,M('#f5b400',{metalness:.6,roughness:.3}),x,.5+i%2*.5,0,aw,10);ANIM.push(t=>{cup.rotation.y=t*(1+i*.3)})});
 hot(5,-3,3.4,PI,[[-5.2,-2.85],[-5.2,2.4]]);plant(g,4.9,4.3,1)}
