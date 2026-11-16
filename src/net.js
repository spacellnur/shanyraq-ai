/* ---------- сеть: Қазақстан → облыс → колледж ---------- */
const KZP=(lat,lon)=>new THREE.Vector3((lon-66.9)*1.6*.67,0,-(lat-48.2)*1.6);
const EXT=.22,MAP=new THREE.Group();scene.add(MAP);MAP.visible=false;
const NETL=[];const netLabel=(html,v,test,cls='room',onclick)=>{const d=document.createElement('div');d.className=cls;d.innerHTML=html;if(onclick){d.onclick=onclick;d.style.pointerEvents='auto';d.style.cursor='pointer'}labelsEl.appendChild(d);NETL.push({d,v,test});return d};
{const sea=new THREE.Mesh(new THREE.PlaneGeometry(140,90),M('#5f86b3'));sea.rotation.x=-PI/2;sea.position.y=-.05;sea.receiveShadow=true;MAP.add(sea)}
/* области */
const OBL_COL=['#f3d9a4','#cfe3b4','#bcd7ea','#efc9b7','#d9cdec','#f2e2b0','#c4e1d6','#e9d2e4'];
const OBL=[],OBLM=[];
OBLAST.forEach((o,i)=>{let v2=o.p.map(([lon,lat])=>{const p=KZP(lat,lon);return new THREE.Vector2(p.x,-p.z)});if(THREE.ShapeUtils.isClockWise(v2))v2=v2.reverse();
 const geo=new THREE.ExtrudeGeometry(new THREE.Shape(v2),{depth:o.city?EXT+.12:EXT,bevelEnabled:false});geo.rotateX(-PI/2);
 const tur=o.n==='Түркістан облысы',col=tur?'#f6c768':OBL_COL[i%OBL_COL.length];
 const mat=new THREE.MeshStandardMaterial({color:col,roughness:.9,transparent:true,opacity:1});const side=new THREE.MeshStandardMaterial({color:new THREE.Color(col).multiplyScalar(.78),roughness:.9,transparent:true,opacity:1});
 const mesh=new THREE.Mesh(geo,[mat,side]);mesh.receiveShadow=true;mesh.userData.ob=o;MAP.add(mesh);
 const edge=new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(v2.map(v=>new THREE.Vector3(v.x,(o.city?EXT+.12:EXT)+.01,-v.y))),new THREE.LineBasicMaterial({color:'#7c6a4a'}));MAP.add(edge);
 const c=KZP(o.c[1],o.c[0]);const ob={o,mesh,mat,side,edge,tur,c,lift:0};OBL.push(ob);OBLM.push(mesh);
 if(!o.city)netLabel(tur?`${o.n} <span>· пилот · 50 колледж</span>`:o.n,c.clone().setY(1.1),()=>view==='kz',tur?'room live':'mini',()=>selectOblast(ob))});
const TUR=OBL.find(b=>b.tur);{const bb=new THREE.Box3().setFromObject(TUR.mesh);TUR.ctr=bb.getCenter(new THREE.Vector3());TUR.size=bb.getSize(new THREE.Vector3())}
/* штаб министерства */
const HQP=KZP(51.17,71.43);
{const g=grp(HQP.x,HQP.z,0,MAP,EXT+.12);box(1.6,.2,1.6,'#cbd5e1',0,.1,0,g);box(1.1,4.2,1.1,M('#7fb3e0',{roughness:.2,metalness:.3}),0,2.3,0,g);
 for(let i=0;i<8;i++)box(1.14,.05,1.14,'#e2ecf6',0,.6+i*.5,0,g,false);box(.8,.35,.8,M('#fbbf24',{emissive:'#f59e0b',emissiveIntensity:.3}),0,4.55,0,g);
 cyl(.04,.04,1.2,DK,0,5.2,0,g,6);box(.6,.34,.02,'#00afca',.32,5.6,0,g,false)}
const HQTOP=HQP.clone().setY(5.3);
netLabel('Оқу-ағарту министрлігі <span>· штаб-квартира, Астана</span>',HQP.clone().setY(7),()=>view==='kz','room live',()=>showHQ());
/* облыстық басқарма (Түркістан қ.) */
const RHQ=KZP(43.30,68.25).add(new THREE.Vector3(-.75,0,-.35));
{const g=grp(RHQ.x,RHQ.z,0,MAP,EXT);box(.5,.06,.4,'#cbd5e1',0,.03,0,g);box(.42,.42,.32,'#f8fafc',0,.27,0,g);box(.44,.05,.34,'#f59e0b',0,.5,0,g);
 for(let i=0;i<3;i++)box(.43,.05,.33,M('#9fd3f5',{emissive:'#5aa0d0',emissiveIntensity:.25}),0,.14+i*.11,0,g,false)}
const RTOP=RHQ.clone().setY(EXT+.55);
const ARC=(()=>{const mid=HQTOP.clone().lerp(RTOP,.5);mid.y+=4;return new THREE.QuadraticBezierCurve3(HQTOP,mid,RTOP)})();
const arcLine=new THREE.Line(new THREE.BufferGeometry().setFromPoints(ARC.getPoints(50)),new THREE.LineBasicMaterial({color:'#14b8a6'}));MAP.add(arcLine);
netLabel('Облыс басқармасы',RHQ.clone().setY(1.6),()=>view==='reg'&&!selDist,'room live',()=>showRegHQ());
/* колледждер */
const TOWN={'Түркістан қаласы':[43.297,68.252],'Отырар ауданы':[42.773,68.356],'Арыс қаласы':[42.430,68.807],'Ордабасы ауданы':[42.596,69.267],'Сарыағаш ауданы':[41.455,69.168],
 'Шардара ауданы':[41.255,67.970],'Мақтаарал ауданы':[40.663,68.545],'Жетісай ауданы':[40.775,68.327],'Созақ ауданы':[43.765,69.176],'Сауран ауданы':[43.190,68.340],'Кентау қаласы':[43.518,68.505],
 'Бәйдібек ауданы':[43.025,69.386],'Сайрам ауданы':[42.500,69.800],'Түлкібас ауданы':[42.480,70.300],'Төлеби ауданы':[42.180,69.880],'Қазығұрт ауданы':[41.760,69.390],'Келес ауданы':[41.330,69.060],'Шымкент қаласы':[42.320,69.590]};
const COLLEGES=[],COLM=[],cnt={};
COLLEGE_LIST.forEach(([name,town],i)=>{const tk=town.startsWith('Шымкент')?'Шымкент қаласы':town,k=cnt[tk]=(cnt[tk]||0)+1,[lat,lon]=TOWN[tk];
 const base=KZP(lat,lon),n=COLLEGE_LIST.filter(x=>(x[1].startsWith('Шымкент')?'Шымкент қаласы':x[1])===tk).length,cols=Math.min(3,n),rows=Math.ceil(n/3);if(n>1){const d=TUR.ctr.clone().setY(0).sub(base.clone().setY(0));base.add(d.setLength(Math.min(d.length(),.35+.25*rows)))}base.x+=((k-1)%3-(cols-1)/2)*.9;base.z+=(Math.floor((k-1)/3)-(rows-1)/2)*.85;
 const pilot=i===2,state=/МКҚК|КМУ/.test(name),hgt=pilot?.5:.2+((i*37)%10)/50,w=pilot?.24:.16;
 const g=grp(base.x,base.z,0,MAP,EXT);g.scale.setScalar(.001);
 box(w,hgt,w*.85,pilot?'#ede9fe':(state?'#e0ecf8':'#f5ecdc'),0,hgt/2,0,g);
 const roof=box(w+.02,.035,w*.85+.02,M(pilot?'#a855f7':(state?'#3b82f6':'#d6a35c')).clone(),0,hgt+.018,0,g);
 g.traverse(m=>{if(m.isMesh)m.userData.col=COLLEGES.length});
 const top=base.clone().setY(EXT+hgt+.05),mid=RTOP.clone().lerp(top,.5);mid.y+=.6;const curve=new THREE.QuadraticBezierCurve3(RTOP,mid,top);
 const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(16)),new THREE.LineBasicMaterial({color:pilot?'#a855f7':'#8a7a5a',transparent:true,opacity:pilot?.9:.35}));line.visible=false;MAP.add(line);
 const c={i,name,town,tk,pilot,state,g,roof,curve,line,top};COLLEGES.push(c);g.children.forEach(m=>COLM.push(m))});
Object.entries(cnt).forEach(([t,n])=>{const [lat,lon]=TOWN[t];const d=netLabel(String(n),KZP(lat,lon).setY(.6),()=>view==='reg'&&!busyNet&&!selDist,'cnt',()=>selectDist(t));d.title=t+': '+n+' колледж';d.setAttribute('role','button')});
COLLEGES.forEach(c=>{const sn=c.name.replace(/[«»"]/g,'').replace(/\s*(МКҚК|ЖШС|КМУ)\s*/g,' ').replace(/\s*\(.*?\)\s*/g,' ').trim();netLabel(sn.length>30?sn.slice(0,28)+'…':sn,c.top.clone().setY(EXT+2*(c.top.y-EXT)+.2),()=>view==='reg'&&selDist===c.tk&&!busyNet,c.pilot?'mini pil':'mini',()=>showCollegeCard(c))});
function selectDist(t){selDist=t;const L=COLLEGES.filter(c=>c.tk===t),ctr=new THREE.Vector3();L.forEach(c=>ctr.add(c.top));ctr.divideScalar(L.length);camTo(ctr,L.length>3?4.6:3.4);$('doc').hidden=true;renderChips();navPush()};
netLabel('Пилот колледж',COLLEGES[2].top.clone().setY(1.15),()=>view==='reg'&&!selDist,'room live',()=>openCollege(COLLEGES[2]));
/* импульсы */
const PULSES=[];
function pulse(curve,color='#14b8a6',dur=1.4,rev=false,size=.22){return new Promise(r=>{const m=new THREE.Mesh(new THREE.SphereGeometry(size,12,8),new THREE.MeshBasicMaterial({color}));scene.add(m);PULSES.push({m,curve,t:0,dur,rev,r})})}
/* выбор области и колледжа */
let selOb=null,popT=0,busyNet=false,selDist=null;
function selectOblast(ob){if(!ob.tur){$('busy').textContent=`${ob.o.n}: бұл облыс әлі қосылмаған. Пилот — Түркістан облысы.`;selOb=ob;camTo(ob.c,7);return}setView('reg')}
function camTo(c,size){const span=cam.right-cam.left;camGoal={t:c.clone().setY(.5),zoom:span/size,off:OFF_REG};camAnim=1}
function showCollegeCard(c){$('doctitle').textContent=c.name;
 $('docbody').innerHTML=`${T([['Орналасқан жері',c.town],['Түрі',c.state?'Мемлекеттік (МКҚК)':'Жеке (ЖШС)'],['Ұстаз орталығы',c.pilot?'Қосылған · пилот':'Қосылуға дайын']])}<p><button id="enterc" class="pri">3D ғимаратқа кіру →</button></p>`;
 $('doc').hidden=false;$('enterc').onclick=()=>openCollege(c)}
let curCollege=COLLEGE_LIST[2][0];
function openCollege(c){curCollege=c.name;const short=c.name.replace(/[«»"]/g,'').replace(/\s*(МКҚК|ЖШС|КМУ)\s*/g,' ').trim();
 RSIGN.material.map=signTex('ҰСТАЗ ОРТАЛЫҒЫ',short,'#1d2130','#fbbf24');RSIGN.material.needsUpdate=true;
 document.querySelector('#crumbs button[data-v=col]').textContent=short.length>34?short.slice(0,32)+'…':short;
 setView('col');focusFloor(null,false);$('doc').hidden=true}
/* клик по 3D */
const ray=new THREE.Raycaster(),mp=new THREE.Vector2();let down=null;
renderer.domElement.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY]});
renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>6||view==='col')return;
 const r=renderer.domElement.getBoundingClientRect();mp.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(mp,cam);
 if(view==='reg'){const h=ray.intersectObjects(COLM.filter(m=>COLLEGES[m.userData.col].g.scale.x>.5),false)[0];if(h){showCollegeCard(COLLEGES[h.object.userData.col]);return}}
 const h=ray.intersectObjects(OBLM,false)[0];if(h){const ob=OBL.find(b=>b.mesh===h.object);if(ob.tur&&view==='reg')return;selectOblast(ob)}});
/* виды */
const OFF_KZ=new THREE.Vector3(14,36,30),OFF_REG=new THREE.Vector3(5,32,13);
function setView(v){view=v;selDist=null;HEMI.intensity=v==='col'?.8:.5;sun.intensity=v==='col'?.75:.5;MAP.visible=v==='kz'||v==='reg';COL.visible=v==='col';
 ['floors','camctl'].forEach(id=>$(id).style.display=v==='col'?'':'none');{const f=$('fcards');f.style.display=f.previousElementSibling.style.display=v==='col'?'':'none'}
 const span=cam.right-cam.left;
 if(v==='kz'){camGoal={t:new THREE.Vector3(3,0,3.5),zoom:Math.min(1.35,span/48),off:OFF_KZ};popT=-1}
 if(v==='reg'){const h=cam.top-cam.bottom;camGoal={t:TUR.ctr.clone().setY(.5),zoom:Math.min(span/(TUR.size.x*1.25),h/(TUR.size.z*1.2)),off:OFF_REG};popT=0}
 if(v==='col'){FLOORS.forEach(f=>GROUPS[f.lv].visible=focus===null||f.lv<=focus);camGoal.off=OFF}
 OBL.forEach(b=>{const fade=v==='reg'&&!b.tur;b.mat.opacity=b.side.opacity=fade?.18:1;b.edge.visible=!fade;b.lift=v==='reg'&&b.tur?.25:0});
 COLLEGES.forEach(c=>c.line.visible=false);arcLine.visible=v==='kz';
 if(v!=='reg')$('busy').textContent='';
 camAnim=1;document.querySelectorAll('#crumbs button').forEach(b=>b.classList.toggle('sel',b.dataset.v===v));renderChips();navPush()}
var NET_READY=true;
function netFrame(dt,t,w,h){if(typeof NET_READY==='undefined'||!NET_READY)return;
 for(let i=PULSES.length-1;i>=0;i--){const p=PULSES[i];p.t+=dt*speed/p.dur;const k=Math.min(1,p.t);p.m.position.copy(p.curve.getPoint(p.rev?1-k:k));
  if(k>=1){scene.remove(p.m);PULSES.splice(i,1);p.r()}}
 OBL.forEach(b=>{const y=b.mesh.position.y;b.mesh.position.y=b.edge.position.y=y+(b.lift-y)*.1});
 COLLEGES.forEach(c=>{const want=view==='reg'&&(busyNet||selDist===c.tk||(c.pilot&&!selDist))?(selDist===c.tk?2:1):.001,s=c.g.scale.x;c.g.scale.setScalar(want<.01&&s<.02?.001:s+(want-s)*Math.min(1,dt*7))});
 NETL.forEach(L=>{const vis=MAP.visible&&L.test();L.d.style.display=vis?'':'none';if(vis)place(L.d,L.v,w,h)})}
/* сценарии уровня страны и региона */
const lit=(c,col)=>{c.roof.material.emissive=new THREE.Color(col||'#000');c.roof.material.emissiveIntensity=col?.8:0};
async function netRun(kind){
 if(busy){$('busy').textContent='Жүйе бос емес. Ағымдағы тапсырма аяқталғанын күтіңіз.';return}
 busy=true;$('busy').textContent='';$('log').innerHTML='';t0=performance.now();$('doc').hidden=true;COLLEGES.forEach(c=>lit(c));busyNet=true;COLLEGES.forEach(c=>c.line.visible=true);
 const isRep=kind==='report';
 setView('kz');await sleep(800);
 log(isRep?'Министрлік: барлық колледждерден сабаққа қатысу есебі сұралды':'Министрлік: жаңа «Сабақ жоспары» үлгісі (2026) барлық колледждерге таратылады');
 await pulse(ARC,'#f59e0b',1.8,false,.3);
 log('→ Түркістан облысы: Адами әлеуетті дамыту басқармасы қабылдады');
 setView('reg');await sleep(1600);
 log(`Облыс оркестраторы → 50 колледж: ${isRep?'есеп сұрауы':'жаңа үлгі'}`);
 await Promise.all(COLLEGES.map((c,i)=>sleep(i*30).then(()=>pulse(c.curve,'#f59e0b',1.1,false,.05)).then(()=>lit(c,'#f59e0b'))));
 if(isRep){log('Колледждердегі «Тәрбие» қабаттары қатысуды есептеуде…');
  let n=0;await Promise.all(COLLEGES.map((c,i)=>sleep(600+((i*53)%25)*120).then(()=>{lit(c,'#22c55e');n++;$('busy').textContent=`Жауап берді: ${n}/50`}).then(()=>pulse(c.curve,'#22c55e',1.1,true,.05))));
  $('busy').textContent='';log('Облыс: 50/50 есеп жиналды, жиынтық жасалуда','fin');await sleep(900);
  setView('kz');await sleep(900);await pulse(ARC,'#22c55e',1.8,true,.3);
  log('Министрлік: облыс бойынша жиынтық есеп дайын','fin');
  $('doctitle').textContent='Түркістан облысы · сабаққа қатысу есебі';$('docbody').innerHTML=REPORT_DOC;$('doc').hidden=false}
 else{let n=0;await Promise.all(COLLEGES.map((c,i)=>sleep(400+((i*31)%20)*90).then(()=>{lit(c,'#14b8a6');n++;$('busy').textContent=`Мұрағатқа жүктелді: ${n}/50`})));
  $('busy').textContent='';log('50 колледждің мұрағатына (RAG) жаңа үлгі жүктелді','fin');await sleep(800);
  openCollege(COLLEGES[2]);focusFloor(-1,false);setState('lib','work','жаңа үлгіні индекстейді');ragCount++;ragTop=-1;await sleep(3500);ragCount--;setState('lib','rest','');
  log('Пилот колледж: Кітапханашы жаңа үлгіні индекстеді — енді сабақ жоспарлары жаңа форматта','fin');
  $('doctitle').textContent='Жаңа үлгі таратылды';$('docbody').innerHTML=STANDARD_DOC;$('doc').hidden=false}
 busyNet=false;COLLEGES.forEach(c=>c.line.visible=false);busy=false}
function showHQ(){$('doctitle').textContent='Оқу-ағарту министрлігі · ИИ-штаб';$('docbody').innerHTML=HQ_DOC;$('doc').hidden=false;$('doc').scrollIntoView({behavior:'smooth'})}
function showRegHQ(){$('doctitle').textContent='Түркістан облысы · ИИ-штаб';$('docbody').innerHTML=REGHQ_DOC;$('doc').hidden=false;$('doc').scrollIntoView({behavior:'smooth'})}
const NETCHIPS=[['Есеп сұрау: сабаққа қатысу','#f59e0b',()=>netRun('report')],['Жаңа үлгіні тарату','#14b8a6',()=>netRun('standard')]];
function renderChips(){const el=$('chips');el.innerHTML='';
 const list=view==='col'?PRESETS.map(p=>[p.chip,FL[p.floors[0]].ac,()=>run(p)]):NETCHIPS.concat(view==='reg'?[['Пилот колледжге кіру','#a855f7',()=>openCollege(COLLEGES[2])]]:[]);
 list.forEach(([t,c,fn])=>{const b=document.createElement('button');b.innerHTML=`<i style="background:${c}"></i>${t}`;b.onclick=fn;el.appendChild(b)});
 ['custom','runc'].forEach(id=>$(id).style.display=view==='col'?'':'none');
 $('hint').textContent=view==='kz'?'Облысты басыңыз':view==='reg'?(selDist?selDist+': колледжді басыңыз':'Санды басыңыз: аудан ашылады'):'';
 if(view==='reg'&&selDist){const b=document.createElement('button');b.textContent='Барлық облыс';b.onclick=()=>setView('reg');el.prepend(b)}}
document.querySelectorAll('#crumbs button').forEach(b=>b.onclick=()=>{if(b.dataset.v==='col'){setView('col');focusFloor(null,false)}else setView(b.dataset.v)});
/* назад / вперёд */
let NAVH=[],NAVI=-1,navLock=false;
function navName(st){return st.v==='kz'?'Қазақстан':st.v==='col'?(st.c||'Колледж').replace(/[«»"]/g,'').replace(/\s*(МКҚК|ЖШС|КМУ)\s*/g,' ').trim():st.d?st.d:'Түркістан облысы'}
function navUI(){const b=$('navB'),f=$('navF');if(!b)return;b.disabled=NAVI<=0;f.disabled=NAVI>=NAVH.length-1;
 b.title=NAVI>0?'Артқа: '+navName(NAVH[NAVI-1]):'';f.title=NAVI<NAVH.length-1?'Алға: '+navName(NAVH[NAVI+1]):'';$('navWhere').textContent=NAVH[NAVI]?navName(NAVH[NAVI]):''}
function navPush(){if(navLock)return;const st={v:view,d:view==='reg'?selDist:null,c:view==='col'?curCollege:null},cur=NAVH[NAVI];
 if(cur&&cur.v===st.v&&cur.d===st.d&&cur.c===st.c)return;NAVH=NAVH.slice(0,NAVI+1);NAVH.push(st);NAVI=NAVH.length-1;navUI()}
function navGo(i){if(i<0||i>=NAVH.length)return;NAVI=i;const st=NAVH[i];navLock=true;
 if(st.v==='col')openCollege(COLLEGES.find(c=>c.name===st.c)||COLLEGES[2]);else{setView(st.v);if(st.d)selectDist(st.d)}navLock=false;navUI()}
$('navB').onclick=()=>navGo(NAVI-1);$('navF').onclick=()=>navGo(NAVI+1);
window.APP3D={navReset:()=>{NAVH=[];NAVI=-1;navPush()},setView,netRun,openPilot:()=>openCollege(COLLEGES[2]),runPreset:i=>run(PRESETS[i])};
