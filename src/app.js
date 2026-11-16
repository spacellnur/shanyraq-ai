(()=>{
const $=id=>document.getElementById(id),esc=x=>String(x??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const short=n=>n.replace(/[«»"]/g,'').replace(/\s*(МКҚК|ЖШС|КМУ)\s*/g,' ').replace(/\s*\(.*?\)\s*/g,' ').trim();
const PILOT=2,PNAME=short(COLLEGE_LIST[PILOT][0]);
/* ---------- роли ---------- */
const ROLES={
 admin:{t:'Жүйе әкімшісі',org:'Оқу-ағарту министрлігі, Астана',lvl:0,scope:'Бүкіл Қазақстан',c:'#0E2A47',ab:'ЖӘ'},
 analyst:{t:'Министрлік сарапшысы',org:'Оқу-ағарту министрлігі, Астана',lvl:0,scope:'Бүкіл Қазақстан (оқу)',c:'#1C4C79',ab:'МС'},
 oblys:{t:'Облыс маманы',org:'Түркістан облысының адами әлеуетті дамыту басқармасы',lvl:1,scope:'Түркістан облысы, 50 колледж',c:'#b45309',ab:'ОМ'},
 director:{t:'Директор',org:PNAME,lvl:2,scope:'Колледж толық',c:'#7c3aed',ab:'Д',col:PILOT},
 zam:{t:'Оқу ісі жөніндегі орынбасар',org:PNAME,lvl:3,dept:'oku',scope:'Оқу бөлімі мен оқытушылар',c:'#9333ea',ab:'ОО',col:PILOT},
 kadr:{t:'Кадр бөлімі',org:PNAME,lvl:3,dept:'kadr',scope:'Кадр құжаттары',c:'#0f766e',ab:'К',col:PILOT},
 buh:{t:'Бухгалтерия',org:PNAME,lvl:3,dept:'buh',scope:'Қаржы құжаттары',c:'#15803d',ab:'Б',col:PILOT},
 psix:{t:'Педагог-психолог',org:PNAME,lvl:4,dept:'tarbie',scope:'Өз кабинеті, құпия жазбалар',c:'#be185d',ab:'ПП',col:PILOT},
 soc:{t:'Әлеуметтік педагог',org:PNAME,lvl:4,dept:'tarbie',scope:'Өз кабинеті, әлеуметтік паспорт',c:'#0d9488',ab:'ӘП',col:PILOT},
 teacher:{t:'Оқытушы',org:PNAME,lvl:4,dept:'oku',scope:'Өз тапсырмалары мен агенттері',c:'#00A3C4',ab:'О',col:PILOT}};
const USERS=Object.keys(ROLES).map(k=>({login:k,role:k}));
const LVL_NAME=['Республика','Облыс','Колледж','Бөлім','Жеке'];
/* ---------- события (демо) ---------- */
const E=(lvl,role,col,dept,text,ago,saved,tag)=>({lvl,role,col,dept,text,ago,saved,tag});
const EVENTS=[
 E(4,'teacher',PILOT,'oku','«Т17 Элементті таңдау» сабақ жоспарын жасады','8 мин бұрын',90,'Әдістеме'),
 E(4,'teacher',PILOT,'oku','ТБ-26-11 ата-аналар жиналысының хаттамасын дайындады','25 мин бұрын',60,'Тәрбие'),
 E(4,'teacher',28,'oku','«Python негіздері» бойынша 20 тест сұрағын жасады','40 мин бұрын',60,'Бағалау'),
 E(4,'teacher',0,'oku','Аттестацияға портфолио жинады','1 сағ бұрын',120,'Кәсіби даму'),
 E(4,'teacher',44,'oku','Колледж сайтына жаңалық жазды (kz/ru)','2 сағ бұрын',40,'Байланыс'),
 E(4,'psix',PILOT,'tarbie','Тәуекел тобын жаңартты: 7 студент (деректер журнал мен кураторлардан)','20 мин бұрын',90,'Психолог'),
 E(4,'soc',PILOT,'tarbie','ТБ-26-11 тобының әлеуметтік паспортын толтырды','45 мин бұрын',80,'Әлеуметтік'),
 E(3,'zam',PILOT,'oku','Оқытушылардың 12 сабақ жоспарын тексерді','30 мин бұрын',180,'Оқу бөлімі'),
 E(3,'kadr',PILOT,'kadr','Жаңа оқытушыны қабылдау бұйрығының жобасын жасады','50 мин бұрын',45,'Кадр'),
 E(3,'buh',PILOT,'buh','Қараша айының жалақы ведомосін тексерді: 2 қате табылды','1 сағ бұрын',120,'Қаржы'),
 E(3,'buh',35,'buh','Тоқсандық салық есебінің жобасын дайындады','3 сағ бұрын',150,'Қаржы'),
 E(3,'kadr',13,'kadr','Еңбек шарттарының мерзімін тексерді','4 сағ бұрын',60,'Кадр'),
 E(2,'director',PILOT,null,'Колледждің айлық есебін бекітті','1 сағ бұрын',90,'Басқару'),
 E(2,'director',28,null,'Педкеңес хаттамасын бекітті','2 сағ бұрын',60,'Басқару'),
 E(1,'oblys',null,null,'50 колледжден сабаққа қатысу есебін сұрады: 50/50 жауап','бүгін',600,'Облыс'),
 E(1,'oblys',null,null,'Жаңа «Сабақ жоспары» үлгісін 50 колледжге таратты','кеше',400,'Облыс'),
 E(0,'admin',null,null,'Түркістан облысын пилотқа қосты','3 күн бұрын',0,'Республика'),
 E(0,'analyst',null,null,'Облыстар бойынша дашборд жаңартылды','бүгін',30,'Республика')];
store.get('shq_events',[]).forEach(e=>EVENTS.unshift(e));
window.addEventListener('shq-done',ev=>{if(!ME)return;const r=ROLES[ME],d=ev.detail;const e=E(r.lvl,ME,r.col??null,r.dept||null,`«${d.text}» дайындады (ИИ-агенттер)`,'жаңа ғана',d.saved,'ИИ-агент');
 EVENTS.unshift(e);const l=store.get('shq_events',[]);l.unshift(e);store.set('shq_events',l.slice(0,20))});
function canSee(me,e){const r=ROLES[me];
 if(e.lvl<r.lvl)return false;if(r.lvl<=1)return true;
 if(e.col!==r.col)return false;if(r.lvl===2)return true;
 if(r.lvl===3)return e.lvl===3?e.role===me:e.dept===r.dept;
 return e.role===me}
/* ---------- агенты ---------- */
const CATS=['Барлығы','Сабақ','Бағалау','Тәрбие','Кадр','Қаржы','Басқару','Байланыс','Кәсіби даму','Студенттер'];
const AUD=['Оқытушы','Куратор','Әдіскер','Педагог-психолог','Әлеуметтік педагог','Медбике','Кітапханашы','Жатақхана тәрбиешісі','Мансап орталығы','Оқу ісі орынбасары','Директор','Кадр бөлімі','Бухгалтерия','Облыс маманы','Министрлік','Студент'];
const ICONS={'Сабақ':'M4 5h7a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H4zM20 5h-6M20 5v13h-6a2 2 0 0 0-2 2',
 'Бағалау':'M9 11l3 3 8-8M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9','Тәрбие':'M16 11a4 4 0 1 0-8 0M3 21a7 7 0 0 1 18 0M12 7V3',
 'Кадр':'M4 6h16v12H4zM8 11a2 2 0 1 0 0-.01M14 10h4M14 14h4','Қаржы':'M12 3v18M17 7H9.5a2.5 2.5 0 0 0 0 5h5a2.5 2.5 0 0 1 0 5H6',
 'Басқару':'M4 20V10M10 20V4M16 20v-7M22 20H2','Байланыс':'M4 5h16v11H8l-4 4zM8 9h8M8 12h5','Кәсіби даму':'M12 3l3 6 6 .9-4.5 4.3 1 6.3L12 17l-5.5 3.5 1-6.3L3 9.9 9 9z',
 'Студенттер':'M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5'};
const icon=(cat,col,s=46)=>`<div class="ico" style="width:${s}px;height:${s}px;background:${col}1f"><svg width="${s*.5}" height="${s*.5}" viewBox="0 0 24 24" fill="none" stroke="${col}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${ICONS[cat]||ICONS['Басқару']}"/></svg></div>`;
const A=(id,name,cat,color,desc,tasks,aud,role,col,rating,uses,example)=>({id,name,cat,color,desc,tasks,aud,author:{role,col},rating,uses,example,status:'pub'});
const SEED=[
 A('a1','Сабақ жоспарының шебері','Сабақ','#7c3aed','Колледждің үлгісі мен КТП бойынша 80 минуттық сабақ жоспарын жасайды: мақсат, нәтижелер, кезеңдер, бағалау.',['КТП бойынша сабақ жоспары','Оқыту нәтижелері мен мақсаттар','Кезеңдер мен уақытты бөлу','Үй тапсырмасы'],['Оқытушы','Әдіскер'],'teacher',PILOT,4.9,1240,'Т18 RecyclerView, ТБ-26-11, 80 минут'),
 A('a2','Тест және дескриптор','Бағалау','#2563eb','Тақырып бойынша тест сұрақтарын, кілтін және бағалау дескрипторларын жасайды.',['10–30 тест сұрағы','Жауап кілті','Критерийлер мен дескрипторлар'],['Оқытушы','Әдіскер'],'teacher',28,4.8,980,'Python циклдары, 15 сұрақ'),
 A('a3','Код тексеруші','Бағалау','#0891b2','Студенттің Python/Kotlin кодын іске қосып, қатесін түсіндіреді және баға ұсынады.',['Кодты іске қосу','Қатені түсіндіру','Баға ұсынысы'],['Оқытушы','Студент'],'teacher',PILOT,4.7,640,'Мына Kotlin кодындағы қатені тап'),
 A('a4','Куратор көмекшісі','Тәрбие','#16a34a','Пропусктерді талдап, тәуекел тобын анықтайды, хаттама мен ата-аналарға хат дайындайды.',['Пропуск талдауы','Тәуекел тобы','Жиналыс хаттамасы','Ата-анаға хат'],['Куратор','Оқу ісі орынбасары'],'teacher',0,4.8,710,'ТБ-26-11 тобының қараша айындағы пропусктері'),
 A('a5','Бұйрық жобасы','Кадр','#0f766e','Қабылдау, ауыстыру, демалыс бұйрықтарының жобасын колледж үлгісімен жасайды.',['Қабылдау бұйрығы','Демалыс бұйрығы','Еңбек шартының мерзімін бақылау'],['Кадр бөлімі','Директор'],'kadr',13,4.6,320,'Жаңа оқытушыны қабылдау бұйрығы'),
 A('a6','Ведомость тексеруші','Қаржы','#15803d','Жалақы ведомосіндегі қателерді табады, салық есебінің жобасын дайындайды.',['Ведомость тексеру','Қате тізімі','Тоқсандық есеп жобасы'],['Бухгалтерия'],'buh',35,4.7,280,'Қараша ведомосін тексер'),
 A('a7','Колледж есебі','Басқару','#7c2d12','Барлық бөлімдердің деректерінен директорға айлық есеп пен KPI жинайды.',['Айлық есеп','KPI дашборд','Педкеңеске слайдтар'],['Директор','Облыс маманы'],'director',PILOT,4.8,190,'Қараша айының есебі'),
 A('a8','Аттестация портфолиосы','Кәсіби даму','#db2777','Оқытушының жетістіктерін жинап, аттестация талаптарымен салыстырады.',['Жетістіктер тізімі','Талаптар чек-листі','Рефлексиялық эссе'],['Оқытушы'],'teacher',0,4.9,560,'2026 жылғы портфолио'),
 A('a9','Студенттің оқу серігі','Студенттер','#ea580c','Студентке тақырыпты қарапайым тілмен түсіндіріп, жаттығу береді. Жауапты бірден айтпайды.',['Тақырыпты түсіндіру','Жаттығулар','Өзін-өзі тексеру'],['Студент'],'teacher',44,4.6,1530,'Activity деген не?'),
 A('a10','Аудармашы kz ⇄ ru','Байланыс','#f97316','Ресми құжаттар мен хабарландыруларды қазақ және орыс тілдеріне аударады.',['Құжат аудару','Терминдерді сақтау'],['Оқытушы','Директор','Кадр бөлімі','Бухгалтерия'],'zam',PILOT,4.7,890,'Бұйрықты орыс тіліне аудар'),
 A('a11','Облыс мониторингі','Басқару','#b45309','50 колледждің есептерін жинап, тәуекел аймақтарын белгілейді.',['Есеп сұрау','Жиынтық дашборд','Тәуекел колледждері'],['Облыс маманы','Министрлік'],'oblys',null,4.8,120,'Сабаққа қатысу бойынша жиынтық'),
 A('a13','Тәуекел тобының радары','Тәрбие','#be185d','Журнал, қатысу және куратор белгілерін біріктіріп, қолдау керек студенттерді ерте көрсетеді. Аты-жөні тек психологқа көрінеді.',['Пропуск пен үлгерімді біріктіру','Ерте белгілер','Жеке жұмыс жоспары'],['Педагог-психолог','Куратор'],'psix',PILOT,4.8,210,'ТБ-26-11 тобы бойынша қараша'),
 A('a14','Әлеуметтік паспорт','Тәрбие','#0d9488','Қабылдау, кадр және бухгалтерия деректерінен топтың әлеуметтік паспортын жасайды.',['Отбасы санаттары','Жеңілдіктер мен стипендия','Паспорт кестесі'],['Әлеуметтік педагог','Куратор'],'soc',PILOT,4.7,160,'ТБ-26-11 тобының паспорты'),
 A('a12','Сайт жаңалықтары','Байланыс','#e11d48','Іс-шара туралы жаңалықты kz/ru тілдерінде жазып, фотоға жазу дайындайды.',['Жаңалық мәтіні','Аударма','Хэштегтер'],['Оқытушы','Директор'],'teacher',PILOT,4.5,410,'Облыстық семинар туралы жаңалық')];
let AGENTS=store.get('shq_agents',null);if(!AGENTS)AGENTS=[];SEED.forEach(x=>{if(!AGENTS.some(y=>y.id===x.id))AGENTS.push(x)});store.set('shq_agents',AGENTS);
let MINE=store.get('shq_mine',[]);
const saveA=()=>store.set('shq_agents',AGENTS);
const BUNDLES=[{t:'Жаңа оқытушы жинағы',d:'Сабақ жоспары, тест, портфолио — бірінші айға керектің бәрі.',ids:['a1','a2','a8'],bg:'linear-gradient(135deg,#0E2A47,#1C4C79)'},
 {t:'Куратор жинағы',d:'Пропуск талдауы, хаттамалар, ата-анаға хаттар.',ids:['a4','a10','a12'],bg:'linear-gradient(135deg,#065f46,#0f766e)'},
 {t:'Колледж әкімшілігі',d:'Директор, кадр және бухгалтерия үшін есептер мен құжаттар.',ids:['a5','a6','a7'],bg:'linear-gradient(135deg,#7c2d12,#b45309)'}];
const authorLine=a=>`${ROLES[a.author.role]?.t||'Автор'}, ${a.author.col==null?(ROLES[a.author.role]?.lvl===1?'Түркістан облысы':'Министрлік'):short(COLLEGE_LIST[a.author.col][0])}`;
/* ---------- вход ---------- */
let ME=store.get('shq_user',null),bootMap=false;
$('demoList').innerHTML=USERS.map(u=>`<button type="button" data-l="${u.login}"><span>${esc(ROLES[u.role].t)}</span><code>${u.login}</code></button>`).join('');
$('demoList').onclick=e=>{const b=e.target.closest('button');if(!b)return;$('lg').value=b.dataset.l;$('pw').value='demo';$('lgErr').textContent='';$('loginForm').querySelector('.btn.pri').focus()};
['lg','pw'].forEach(id=>$(id).oninput=()=>$('lgErr').textContent='');
$('loginForm').onsubmit=e=>{e.preventDefault();const l=$('lg').value.trim(),p=$('pw').value;
 if(!l||!p){$('lgErr').textContent='Логин мен құпиясөзді енгізіңіз.';return}
 const u=USERS.find(x=>x.login===l);if(!u||p!=='demo'){$('lgErr').textContent='Логин немесе құпиясөз қате. Демо-аккаунттың құпиясөзі: demo';return}
 ME=u.role;store.set('shq_user',ME);enter()};
$('logout').onclick=()=>{ME=null;store.set('shq_user',null);bootMap=false;$('app').classList.add('hide');$('login').classList.remove('hide');$('pw').value=''};
function enter(){const r=ROLES[ME];$('login').classList.add('hide');$('app').classList.remove('hide');
 $('meAv').textContent=r.ab;$('meAv').style.background=r.c;$('meName').textContent=r.t;$('meRole').textContent=r.org;
 document.querySelector('[data-tab=admin]').classList.toggle('hide',r.lvl>2);tab('home')}
/* путь видимости */
const DEPT={oku:'Оқу бөлімі',kadr:'Кадр бөлімі',buh:'Бухгалтерия',tarbie:'Тәрбие бөлімі'};
function path(){const r=ROLES[ME];
 const segs=['Министрлік','Түркістан облысы',r.col!=null?short(COLLEGE_LIST[r.col][0]):'50 колледж',r.dept?DEPT[r.dept]:'Бөлімдер',r.lvl===4?'Сіз':'Оқытушылар'];
 return `<div class="path" aria-label="Сіздің көру аймағыңыз">${segs.map((s,i)=>`<span class="${i<r.lvl?'up':i===r.lvl?'here':'down'}"${i===r.lvl?' aria-current="true"':''}>${esc(s)}</span>`).join('')}</div>`}
/* вкладки */
document.querySelectorAll('.appbar nav button').forEach(b=>b.onclick=()=>tab(b.dataset.tab));
function tab(t){document.querySelectorAll('.appbar nav button').forEach(b=>b.classList.toggle('on',b.dataset.tab===t));
 ['home','map','cab','net','admin'].forEach(x=>$('tab-'+x).classList.toggle('hide',x!==t));if(t!=='cab')$('tab-cab').innerHTML='';
 if(t==='home')renderHome();if(t==='net')renderNet();if(t==='admin')renderAdmin();if(t==='cab')renderCab();
 if(t==='map'){$('mapPath').innerHTML=path();window.dispatchEvent(new Event('resize'));const r=ROLES[ME];
  document.querySelectorAll('#crumbs button').forEach(b=>b.classList.toggle('hide',(b.dataset.v==='kz'&&r.lvl>0)||(b.dataset.v==='reg'&&r.lvl>1)));
  document.querySelectorAll('#crumbs span').forEach((s,i)=>s.classList.toggle('hide',(i===0&&r.lvl>0)||(i===1&&r.lvl>1)));
  if(!bootMap&&window.APP3D){bootMap=true;r.lvl===0?APP3D.setView('kz'):r.lvl===1?APP3D.setView('reg'):APP3D.openPilot();APP3D.navReset()}}
 window.scrollTo(0,0)}
function toast(m){const d=document.createElement('div');d.className='toast';d.setAttribute('role','status');d.textContent=m;document.body.appendChild(d);setTimeout(()=>d.remove(),2600)}
/* главный экран */
const mins=m=>m>=60?`${Math.floor(m/60)} сағ ${m%60?m%60+' мин':''}`:`${m} мин`;
function renderHome(){const r=ROLES[ME],ev=EVENTS.filter(e=>canSee(ME,e)),list=r.lvl<4?ev.filter(e=>e.role!==ME):ev;
 const saved=ev.reduce((s,e)=>s+e.saved,0),pub=AGENTS.filter(a=>a.status==='pub').length,mod=AGENTS.filter(a=>a.status==='mod').length;
 const sum=[[r.lvl<=1?'50':'1',r.lvl<=1?'колледж':'колледж',r.lvl===0?'Пилот: Түркістан облысы':r.lvl===1?'28 мемлекеттік, 22 жеке':short(COLLEGE_LIST[r.col][0])],
  [String(ev.length),'әрекет көресіз','бүгін және кеше'],[mins(saved),'үнемделген уақыт','қол жұмысының орнына'],[String(pub),'агент Networking-те',mod&&r.lvl<=2?`${mod} агент тексеруді күтеді`:'барлығы жарияланған']];
 const QA={admin:[['3D-желіні ашу','Қазақстан картасы','map'],['Рөлдер мен құқықтар','Әкімшілік бөлімі','admin'],['Агенттерді тексеру',`${mod} агент күтіп тұр`,'mod'],['Networking','Үздік агенттер','net']],
  analyst:[['3D-желіні ашу','Қазақстан картасы','map'],['Облыс есебін көру','Сабаққа қатысу, Түркістан облысы','report'],['Networking','Үздік агенттер','net'],['Рөлдер мен құқықтар','Әкімшілік бөлімі','admin']],
  oblys:[['Есеп сұрау','50 колледжден сабаққа қатысу туралы','report'],['Жаңа үлгіні тарату','50 колледжге бірден','standard'],['Агенттерді тексеру',`${mod} агент күтіп тұр`,'mod'],['Облыс картасы','3D-желі','map']],
  director:[['Колледжді 3D-де ашу','7 қабатты ғимарат','map'],['Айлық есеп жасау','«Колледж есебі» агенті','agent:a7'],['Агенттерді тексеру',`${mod} агент күтіп тұр`,'mod'],['Networking','Үздік агенттер','net']],
  zam:[['Сабақ жоспарын жасау','Әдістеме қабаты, 3D','preset:0'],['Тест жасау','Бағалау қабаты, 3D','preset:1'],['Агент жариялау','Networking-ке','publish'],['Networking','Үздік агенттер','net']],
  kadr:[['Бұйрық жобасын жасау','«Бұйрық жобасы» агенті','agent:a5'],['Құжатты аудару','kz ⇄ ru','agent:a10'],['Агент жариялау','Networking-ке','publish'],['Networking','Үздік агенттер','net']],
  buh:[['Ведомосты тексеру','«Ведомость тексеруші» агенті','agent:a6'],['Колледж есебі','«Колледж есебі» агенті','agent:a7'],['Агент жариялау','Networking-ке','publish'],['Networking','Үздік агенттер','net']],
  psix:[['Тәуекел тобын анықтау','Менің кабинетім, 3D','cab'],['Ата-аналарға тренинг','Менің кабинетім','cab'],['Агент жариялау','Networking-ке','publish'],['Networking','Психологтарға агенттер','net']],
 soc:[['Әлеуметтік паспорт','Менің кабинетім, 3D','cab'],['Аз қамтылған отбасыларға көмек','Менің кабинетім','cab'],['Агент жариялау','Networking-ке','publish'],['Networking','Үздік агенттер','net']],
 teacher:[['Сабақ жоспарын жасау','Әдістеме қабаты, 3D','preset:0'],['Ата-аналар жиналысының хаттамасы','Тәрбие қабаты, 3D','preset:2'],['Агент жариялау','Networking-ке','publish'],['Networking','Үздік агенттер','net']]}[ME];
 $('tab-home').innerHTML=`<div class="page">${path()}
 <div class="ph"><div><h1>${esc(r.t)}</h1><p>${esc(r.org)}</p></div></div>
 <div class="sum">${sum.map(([a,b,c])=>`<div><b>${a}</b><span>${b}</span><small>${esc(c)}</small></div>`).join('')}</div>
 <div class="cols">
  <section class="blk"><h2>${r.lvl<4?'Сізге бағынатындардың әрекеттері':'Менің әрекеттерім'}${r.lvl<4?'<small>Өз деңгейіңіз бен одан төменгінің бәрін көресіз</small>':''}</h2>
   <div class="body">${list.map(evRow).join('')||'<p class="muted">Әзірге әрекет жоқ.</p>'}</div></section>
  <div style="display:flex;flex-direction:column;gap:22px">
   <section class="blk"><h2>Жылдам әрекеттер</h2><div class="body acts">${QA.map(([a,b,c])=>`<button data-qa="${c}"><b>${a}</b><small>${b}</small></button>`).join('')}</div></section>
   <section class="blk"><h2>${r.lvl===4?'Менің агенттерім':'Құрылым'}</h2><div class="body">${r.lvl===4?myAgentsMini():tree(r)}</div></section>
  </div></div>
 <p class="note">Прототип: әрекеттер мен сандар демо үшін жасалған.</p></div>`;
 $('tab-home').querySelectorAll('[data-qa]').forEach(b=>b.onclick=()=>qa(b.dataset.qa))}
function evRow(e){const r=ROLES[e.role];const where=e.col!=null?short(COLLEGE_LIST[e.col][0]):r.lvl===1?'Түркістан облысы':'Министрлік';
 return `<div class="ev"><div class="av" style="background:${r.c}" aria-hidden="true">${r.ab}</div><div><p>${esc(e.text)}</p><div class="who">${esc(r.t)}, ${esc(where)}</div></div><div class="t">${esc(e.ago)}${e.saved?`<em>−${mins(e.saved)}</em>`:''}</div></div>`}
function tree(r){const towns={};COLLEGE_LIST.forEach(([n,t])=>{(towns[t]=towns[t]||[]).push(n)});
 if(r.lvl===0)return `<div class="tree"><details open><summary>Оқу-ағарту министрлігі</summary><ul><li><details><summary>Түркістан облысы<span class="n">50 колледж, пилот</span></summary><ul>${Object.entries(towns).map(([t,l])=>`<li>${esc(t)}<span class="n">${l.length}</span></li>`).join('')}</ul></details></li><li>Қалған 19 өңір<span class="n">келесі кезеңде</span></li></ul></details></div>`;
 if(r.lvl===1)return `<div class="tree">${Object.entries(towns).map(([t,l])=>`<details><summary>${esc(t)}<span class="n">${l.length}</span></summary><ul>${l.map(n=>`<li>${esc(short(n))}</li>`).join('')}</ul></details>`).join('')}</div>`;
 const D=[['Оқу бөлімі','орынбасар, оқытушылар, кураторлар','oku'],['Кадр бөлімі','бұйрықтар, еңбек шарттары','kadr'],['Бухгалтерия','жалақы, есептер','buh']];
 return `<div class="tree"><details open><summary>${esc(short(COLLEGE_LIST[r.col][0]))}</summary><ul>${D.filter(d=>r.lvl===2||d[2]===r.dept).map(d=>`<li>${d[0]}<span class="n">${d[1]}</span></li>`).join('')}</ul></details></div>`}
function myAgentsMini(){const l=AGENTS.filter(a=>a.mine||MINE.includes(a.id));
 return l.length?l.map(a=>`<div class="ev" style="grid-template-columns:30px minmax(0,1fr)">${icon(a.cat,a.color,30)}<div><p>${esc(a.name)}${statusBadge(a)}</p><div class="who">${esc(a.cat)}</div></div></div>`).join(''):'<p class="muted" style="margin:8px 0">Әзірге бос. Networking-тен агент қосыңыз немесе өзіңіз жариялаңыз.</p>'}
function qa(c){if(c==='map'||c==='net'||c==='admin'||c==='cab')return tab(c);if(c==='mod'){netTab='mod';tab('net');return}
 if(c==='publish'){tab('net');openPublish();return}if(c.startsWith('agent:')){tab('net');openAgent(c.slice(6));return}
 if(c.startsWith('preset:')){tab('map');setTimeout(()=>{APP3D.openPilot();APP3D.runPreset(+c.slice(7))},400);return}
 if(c==='report'||c==='standard'){tab('map');setTimeout(()=>APP3D.netRun(c),400)}}
/* кабинеты сотрудников */
const P=(t,ph)=>({t,ph});
const AGSET={
 oku:{ag:{dir:['Бас агент','Тапсырманы бөліп, жауапты жинайды'],res:['Әдіскер','Стандарттар мен әдістемені іздейді'],lib:['Кітапханашы','Колледж құжаттарынан RAG арқылы іздейді'],cod:['Тест құрастырушы','Тест пен тапсырмалар жасайды'],wri:['Жазушы','Соңғы құжатты жазады'],rev:['Тексеруші','Қателерді іздейді']},
  presets:[P('Сабақ жоспары: Т18 RecyclerView, 80 минут',[[['res','КТП мен оқыту нәтижелерін іздеуде',4,9000],['lib','RAG: колледждің сабақ жоспары үлгісі',4,6000,1],['cod','практикалық тапсырма құрастыруда',5,8000]],[['wri','сабақ жоспарын жазуда',5,6000]]]),
   P('ТБ-26-11 ата-аналар жиналысының хаттамасы',[[['lib','RAG: хаттама үлгісі',3,5000,1],['res','пропуск пен үлгерімді талдауда',4,7000]],[['wri','хаттама жазуда',4,4000]]]),
   P('Python циклдары бойынша 15 тест сұрағы',[[['cod','сұрақтар мен жауап кілтін жасауда',5,9000],['lib','RAG: бағалау критерийлері',3,4000,1]],[['wri','дескрипторларды жазуда',4,3500]]])]},
 kadr:{ag:{dir:['Бас агент','Тапсырманы бөліп, жауапты жинайды'],res:['Заң кеңесшісі','Еңбек кодексі мен нормаларды іздейді'],lib:['Мұрағатшы','Бұйрықтар мұрағатынан іздейді'],cod:['Кесте құрастырушы','Мерзімдер мен кестелерді есептейді'],wri:['Бұйрық жазушы','Бұйрық жобасын жазады'],rev:['Тексеруші','Деректер мен мерзімдерді тексереді']},
  presets:[P('Жаңа оқытушыны қабылдау бұйрығы',[[['res','Еңбек кодексінің талаптарын іздеуде',4,7000],['lib','RAG: бұйрық үлгісі',3,5000,1]],[['wri','бұйрық жобасын жазуда',4,4000]]]),
   P('Еңбек шарттарының мерзімін тексеру',[[['cod','мерзімдер кестесін есептеуде',5,8000],['lib','RAG: қолданыстағы шарттар',4,6000,1]],[['wri','ескерту тізімін жазуда',3,3000]]])]},
 buh:{ag:{dir:['Бас агент','Тапсырманы бөліп, жауапты жинайды'],res:['Салық кеңесшісі','Салық нормаларын іздейді'],lib:['Мұрағатшы','Ведомостар мен есептерді іздейді'],cod:['Есептеуші','Сандарды есептеп, салыстырады'],wri:['Есеп жазушы','Есеп пен түсіндірме жазады'],rev:['Тексеруші','Сандардағы қателерді іздейді']},
  presets:[P('Қараша айының жалақы ведомосін тексеру',[[['cod','ведомость сандарын салыстыруда',6,12000],['lib','RAG: штат кестесі',3,5000,1]],[['wri','қателер тізімін жазуда',3,3000]]]),
   P('Тоқсандық салық есебінің жобасы',[[['res','салық мөлшерлемелерін іздеуде',4,7000],['cod','сомаларды есептеуде',5,9000]],[['wri','есеп жобасын жазуда',4,4000]]])]},
 boss:{ag:{dir:['Бас агент','Тапсырманы бөліп, жауапты жинайды'],res:['Талдаушы','Бөлімдердің деректерін жинайды'],lib:['Мұрағатшы','Бұйрықтар мен хаттамаларды іздейді'],cod:['Дашборд жасаушы','KPI мен кестелерді есептейді'],wri:['Есеп жазушы','Есеп пен слайдтар жазады'],rev:['Тексеруші','Сандар мен фактілерді тексереді']},
  presets:[P('Колледждің қараша айындағы есебі',[[['res','бөлімдердің деректерін жинауда',5,10000],['cod','KPI кестесін есептеуде',5,9000],['lib','RAG: өткен айдың есебі',3,5000,1]],[['wri','айлық есепті жазуда',5,6000]]]),
   P('Педкеңес хаттамасы',[[['lib','RAG: хаттама үлгісі',3,5000,1],['res','күн тәртібін жинауда',3,5000]],[['wri','хаттама жазуда',4,4000]]])]}};
const MK=(n,presets)=>({ag:{dir:['Бас агент','Тапсырманы бөліп, жауапты жинайды'],res:[n[0],n[1]],lib:['Кітапханашы','Колледж құжаттарынан RAG арқылы іздейді'],cod:[n[2],n[3]],wri:[n[4],n[5]],rev:['Тексеруші','Қателерді және құпиялықты тексереді']},presets});
Object.assign(AGSET,{
 psix:MK(['Деректер жинаушы','Қатысу, үлгерім, куратор жазбалары','Диагностика маманы','Сауалнама мен нәтижелерді өңдейді','Ұсыныс жазушы','Кураторға, ата-анаға ұсыныстар'],[
  P('Тәуекел тобын анықтау: қатысу, үлгерім, куратор белгілері',[[['res','пропуск пен үлгерімді жинауда',4,8000],['lib','RAG: тәуекел тобымен жұмыс алгоритмі',3,5000,1]],[['cod','көрсеткіштерді салыстыруда',4,6000]],[['wri','жеке жұмыс жоспарын жазуда',4,4000]]]),
  P('1-курстың бейімделу диагностикасы',[[['cod','сауалнама нәтижелерін өңдеуде',5,9000]],[['wri','топтар бойынша қорытынды жазуда',4,4000]]]),
  P('Ата-аналарға тренинг жоспары',[[['lib','RAG: психологтың жылдық жоспары',3,5000,1]],[['wri','тренинг сценарийін жазуда',4,4000]]])]),
 soc:MK(['Деректер жинаушы','Кадр, қабылдау, бухгалтерия деректері','Есеп құрастырушы','Тізім мен кестелер жасайды','Хат жазушы','Өтініш, хат, акт жазады'],[
  P('Топтың әлеуметтік паспорты',[[['res','отбасы мәліметтерін жинауда',4,8000],['lib','RAG: әлеуметтік паспорт үлгісі',3,5000,1]],[['cod','санаттар бойынша кесте жасауда',4,6000]],[['wri','паспортты рәсімдеуде',3,3000]]]),
  P('Аз қамтылған отбасылардан шыққан студенттерге көмек',[[['res','жеңілдіктер мен стипендия деректері',4,7000]],[['wri','көмек көрсету жоспары мен өтініштер',4,4000]]]),
  P('Жетім студенттің жатақханадағы тұрмыс-жағдайын тексеру акті',[[['lib','RAG: акт үлгісі',3,4000,1]],[['wri','акт жазуда',4,3500]]])]),
 med:MK(['Тізім жинаушы','Студенттер тізімі мен жасы','Кесте құрастырушы','Тексеру мен егу кестесі','Анықтама жазушы','Анықтама мен хабарландыру'],[
  P('Жыл сайынғы медициналық тексеру кестесі',[[['res','топтар мен студенттер тізімі',3,5000]],[['cod','күндер бойынша бөлуде',4,5000]],[['wri','кураторларға хабарландыру',3,2500]]]),
  P('Дене шынықтыру топтарының тізімі (негізгі, арнайы)',[[['res','анықтамаларды жинауда',3,5000]],[['wri','оқытушыларға тізім',3,2500]]])]),
 libr:MK(['Сұраныс жинаушы','КТП-дағы әдебиет тізімдері','Есептеуші','Студент саны мен оқулық қоры','Тапсырыс жазушы','Тапсырыс пен есеп'],[
  P('Оқулықпен қамтамасыз ету есебі',[[['res','КТП әдебиет тізімдерін жинауда',4,7000],['cod','қорды студент санымен салыстыруда',4,6000]],[['wri','есеп жазуда',3,3000]]])]),
 dorm:MK(['Тізім жинаушы','Жатақхана тұрғындары','Кесте құрастырушы','Кезекшілік пен іс-шаралар','Хабар жазушы','Кураторға, ата-анаға хабар'],[
  P('Қараша айының кезекшілік кестесі',[[['res','тұрғындар мен бөлмелер тізімі',3,5000]],[['cod','кестені бөлуде',4,5000]],[['wri','кестені рәсімдеуде',2,2000]]])]),
 nvp:MK(['Тізім жинаушы','Ер студенттер, туған жылы','Есеп құрастырушы','Әскери есеп құжаттары','Хат жазушы','Қорғаныс істері бөліміне хат'],[
  P('Әскери есепке алуға студенттер тізімі',[[['res','кадр мен оқу бөлімінен деректер',4,7000]],[['cod','тізім мен құжаттар',4,5000]],[['wri','қорғаныс істері бөліміне хат',3,3000]]])]),
 career:MK(['Талдаушы','Түлектер мен практика базалары','Сәйкестендіруші','Түлек пен бос орынды сәйкестендіреді','Хат жазушы','Жұмыс берушілерге хат'],[
  P('Түлектерді жұмысқа орналастыру есебі',[[['res','түлектер мен жұмыс орындарын жинауда',5,9000]],[['cod','мамандықтар бойынша пайыз есептеуде',4,5000]],[['wri','есеп жазуда',4,4000]]]),
  P('Бос жұмыс орындары дайджесті студенттерге',[[['res','бос орындарды іздеуде',4,8000]],[['wri','дайджест жазуда',3,3000]]])]),
 adm:MK(['Деректер жинаушы','Мамандықтар мен орын саны','Талдаушы','Өтініштер статистикасы','Жауап жазушы','Талапкерлерге жауап'],[
  P('Қабылдау статистикасы: мамандықтар бойынша',[[['res','өтініштерді жинауда',4,7000]],[['cod','конкурсты есептеуде',4,5000]],[['wri','директорға анықтама',3,3000]]]),
  P('Талапкерлердің жиі сұрақтарына жауаптар',[[['lib','RAG: қабылдау ережесі',3,5000,1]],[['wri','жауаптар жазуда',4,3500]]])]),
 office:MK(['Тіркеуші','Кіріс хаттар мен бұйрықтар','Мерзім бақылаушы','Орындау мерзімдері','Жауап жазушы','Хатқа жауап жобасы'],[
  P('Облыс басқармасының хатына жауап жобасы',[[['lib','RAG: ұқсас жауаптар',3,5000,1],['res','жауапты бөлімдерден деректер',4,7000]],[['wri','жауап жобасын жазуда',4,4000]]])])});
const NEEDS={
 boss:[['Барлық бөлімдердің айлық көрсеткіштері','Барлық бөлімдер','Айлық есеп','auto'],['Қаржы жағдайы','Бухгалтерия','Шешім қабылдау','auto'],['Психологиялық қызметтің жалпы статистикасы','Педагог-психолог','Тек сандар, атаусыз','secret']],
 kadr:[['Педагогтердің курстары мен сертификаттары','Әдістеме','Аттестация','auto'],['Сабақ жүктемесі','Оқу бөлімі','Еңбек шарты','auto'],['Әскери есептегі қызметкерлер','АӘД','Есеп','ask']],
 buh:[['Сабақ жүктемесі мен тарификация','Оқу бөлімі','Жалақы','auto'],['Бұйрықтар (қабылдау, демалыс)','Кадр бөлімі','Жалақы','auto'],['Стипендияға құқылы студенттер','Оқу бөлімі, әлеуметтік педагог','Стипендия','auto']],
 oku:[['Сабақ кестесі','Оқу бөлімі','Сабақ жоспары','auto'],['Студенттер тізімі және үлгерім','Журнал','Бағалау','auto'],['Колледж үлгілері мен КТП','Әдістеме, мұрағат','Құжаттар','auto']],
 psix:[['Сабаққа қатысу, пропуск','Оқу бөлімі (журнал)','Тәуекел тобы','auto'],['Үлгерімнің күрт төмендеуі','Журнал','Тәуекел тобы','auto'],['Куратор байқаулары','Кураторлар','Ерте анықтау','ask'],['Әлеуметтік паспорт','Әлеуметтік педагог','Отбасы жағдайы','ask'],['Жатақхана тәртібі','Жатақхана тәрбиешісі','Тұрмыс жағдайы','ask'],['Жеке кеңес жазбалары','Психологтың өзі','Ешкімге берілмейді','secret']],
 soc:[['Отбасы санаты (жетім, көп балалы, аз қамтылған)','Қабылдау комиссиясы, кадр','Әлеуметтік паспорт','auto'],['Стипендия мен жеңілдіктер','Бухгалтерия','Көмек көрсету','auto'],['Жатақхана тұрғындары','Жатақхана тәрбиешісі','Тұрмыс жағдайы','auto'],['Сабаққа қатысу','Оқу бөлімі','Ата-анамен жұмыс','auto'],['Денсаулық тобы','Медбике','Жеңілдіктер','ask']],
 med:[['Студенттер тізімі, туған күні','Оқу бөлімі','Тексеру кестесі','auto'],['Сабақ кестесі','Оқу бөлімі','Тексеру уақыты','auto'],['Жатақхана тұрғындары','Жатақхана','Профилактика','auto']],
 libr:[['КТП-дағы әдебиет тізімдері','Әдістеме','Қор толықтыру','auto'],['Топтардағы студент саны','Оқу бөлімі','Оқулықпен қамту','auto']],
 dorm:[['Жатақханаға орналастыру бұйрықтары','Директор, кадр','Тізім','auto'],['Әлеуметтік санат','Әлеуметтік педагог','Бөлме бөлу','ask'],['Кураторлар байланысы','Тәрбие бөлімі','Хабарлау','auto']],
 nvp:[['Ер студенттер, туған жылы','Оқу бөлімі, қабылдау комиссиясы','Әскери есеп','auto'],['Денсаулық тобы','Медбике','АӘД сабақтары','ask']],
 career:[['Түлектер тізімі мен мамандығы','Оқу бөлімі','Жұмысқа орналастыру','auto'],['Практика базалары','Шеберхана','Жұмыс берушілер','auto'],['Дипломдық жұмыс нәтижелері','Оқу бөлімі','Ұсыныс хат','auto']],
 adm:[['Мамандықтар мен орын саны','Директор, оқу бөлімі','Қабылдау','auto'],['Жатақхана орындары','Жатақхана','Талапкерге жауап','auto']],
 office:[['Бұйрықтар','Директор, кадр','Тізілім','auto'],['Бөлімдердің жауаптары','Барлық бөлімдер','Хатқа жауап','ask']]};
const STAFF=[
 {id:'s1',role:'director',name:'Директор',set:'boss',grp:'Әкімшілік'},{id:'s2',role:'zam',name:'Оқу ісі жөніндегі орынбасар',set:'boss',grp:'Әкімшілік'},
 {id:'s3',role:'kadr',name:'Кадр бөлімінің маманы',set:'kadr',grp:'Әкімшілік'},{id:'s4',role:'buh',name:'Бас бухгалтер',set:'buh',grp:'Әкімшілік'},
 {id:'s20',role:'office',name:'Іс жүргізуші (кеңсе)',set:'office',grp:'Әкімшілік'},{id:'s21',role:'adm',name:'Қабылдау комиссиясының хатшысы',set:'adm',grp:'Әкімшілік'},
 {id:'s5',role:'teacher',name:'Ақпараттық технологиялар оқытушысы',set:'oku',you:true,grp:'Оқытушылар'},
 {id:'s6',role:'teacher',name:'Математика оқытушысы',set:'oku',grp:'Оқытушылар'},{id:'s7',role:'teacher',name:'Ағылшын тілі оқытушысы',set:'oku',grp:'Оқытушылар'},
 {id:'s8',role:'teacher',name:'Тігін ісінің шебері',set:'oku',grp:'Оқытушылар'},{id:'s9',role:'teacher',name:'Куратор, ТБ-25-21',set:'oku',grp:'Оқытушылар'},
 {id:'s10',role:'psix',name:'Педагог-психолог',set:'psix',grp:'Студенттерді қолдау'},{id:'s11',role:'soc',name:'Әлеуметтік педагог',set:'soc',grp:'Студенттерді қолдау'},
 {id:'s12',role:'med',name:'Медбике',set:'med',grp:'Студенттерді қолдау'},{id:'s13',role:'dorm',name:'Жатақхана тәрбиешісі',set:'dorm',grp:'Студенттерді қолдау'},
 {id:'s14',role:'libr',name:'Кітапханашы',set:'libr',grp:'Студенттерді қолдау'},{id:'s15',role:'nvp',name:'АӘД оқытушы-ұйымдастырушысы',set:'nvp',grp:'Студенттерді қолдау'},
 {id:'s16',role:'career',name:'Мансап орталығының маманы',set:'career',grp:'Студенттерді қолдау'}];
const RC={med:['#dc2626','МБ','Медбике'],dorm:['#7c3aed','ЖТ','Жатақхана'],libr:['#0369a1','К','Кітапхана'],nvp:['#3f6212','АӘД','Әскери дайындық'],career:['#c2410c','МО','Мансап орталығы'],adm:['#4338ca','ҚК','Қабылдау комиссиясы'],office:['#475569','ІЖ','Кеңсе']};
const RI=r=>ROLES[r]||{t:RC[r][2],c:RC[r][0],ab:RC[r][1]};
function canSeeCab(st){const r=ROLES[ME];if(r.lvl<=2)return true;if(ME==='teacher')return !!st.you;if(r.lvl===4)return st.role===ME;
 if(st.role===ME)return true;if(r.dept==='oku')return st.role==='teacher';return false}
let cabSel=null;
function renderCab(){const r=ROLES[ME],list=STAFF.filter(canSeeCab);
 if(!cabSel||!list.includes(cabSel))cabSel=list.find(s=>s.role===ME&&(ME!=='teacher'||s.you))||list[0];
 const st=cabSel,mine=(st.role===ME&&(ME!=='teacher'||st.you)),own=AGENTS.filter(a=>mine&&(a.mine||MINE.includes(a.id)));
 $('tab-cab').innerHTML=`<div class="page">${path()}
 <div class="ph"><div><h1>${list.length>1?'Кабинеттер':'Менің кабинетім'}</h1><p>${r.lvl<=2?'Колледждің әр қызметкерінің жеке ИИ-кабинеті бар. Сіз барлық кабинетті көресіз.':r.lvl===3?'Сіз өз кабинетіңізді және бөліміңіздің кабинеттерін көресіз.':'Бұл сіздің жеке ИИ-кабинетіңіз: агенттеріңіз осында жұмыс істейді.'}</p></div></div>
 <div class="cabwrap">${list.length>1?`<nav class="blk cablist" aria-label="Қызметкерлер"><h2>Қызметкерлер<small>${esc(short(COLLEGE_LIST[PILOT][0]))}</small></h2><div class="body">${[...new Set(list.map(s=>s.grp))].map(gname=>`<p class="cabgrp">${gname}</p>`+list.filter(s=>s.grp===gname).map(s=>{const x=RI(s.role);return `<button data-s="${s.id}" class="${s===st?'on':''}"><span class="av" style="background:${x.c}">${x.ab}</span><span><b>${esc(s.name)}${s.you&&ME==='teacher'?' (сіз)':''}</b><small>${esc(x.t)}</small></span></button>`}).join('')).join('')}</div></nav>`:''}
 <div class="cabmain"><div class="cabhead"><div><h2>${esc(st.name)}</h2><p class="muted">${mine?'Тапсырма беріп, агенттердің жұмысын бақылаңыз.':'Тек көру: бұл кабинеттің иесі емессіз.'}</p></div>
  ${own.length?`<div class="cabag"><span class="muted">Networking-тен қосылған:</span>${own.map(a=>`<span class="tagp">${esc(a.name)}</span>`).join('')}</div>`:''}</div>
  ${NEEDS[st.set]?`<section class="blk needs"><h2>Жұмысқа керек деректер<small>Агенттер оларды басқа бөлімдерден өзі алады. Құпия деректер тек иесіне көрінеді.</small></h2><div class="body"><table class="mx"><tr><th>Дерек</th><th>Қайдан</th><th>Не үшін</th><th>Қалай</th></tr>${NEEDS[st.set].map(([d,src,why,how])=>`<tr><td>${d}</td><td>${src}</td><td>${why}</td><td><span class="how how-${how}">${{auto:'Автоматты',ask:'Сұрау арқылы',secret:'Құпия'}[how]}</span></td></tr>`).join('')}</table></div></section>`:''}
  <iframe id="cabFrame" title="${esc(st.name)} кабинеті" class="cabframe"></iframe></div></div>
 <p class="note">Демо: қызметкерлер тізімі мен тапсырмалар мысал ретінде жасалған.</p></div>`;
 $('tab-cab').querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{cabSel=STAFF.find(s=>s.id===b.dataset.s);renderCab()});
 window.__CAB=AGSET[st.set];const f=$('cabFrame');f.srcdoc=CAB_HTML.replace('<style>','<style>'+(document.querySelector('style').textContent.match(/@font-face[^}]*}/g)||[]).join('')+(mine?'':'.ctrl{display:none!important}'));
 const fit=()=>{try{const d=f.contentDocument;if(d&&d.body)f.style.height=Math.max(600,d.body.scrollHeight+4)+'px'}catch(e){}};f.onload=()=>{fit();let n=0;const iv=setInterval(()=>{fit();if(++n>20||!f.isConnected)clearInterval(iv)},700)}}
/* Networking */
let netTab='all',cat='Барлығы',aud='',q='',bundle=null;
const statusBadge=a=>a.status==='pub'?'':a.status==='mod'?'<span class="status st-mod">Тексеруде</span>':'<span class="status st-rej">Қайтарылды</span>';
const meta=a=>a.status==='pub'?`<span>${a.rating?`Баға ${String(a.rating).replace('.',',')}`:'Жаңа'}</span><span>${a.uses??0} рет қолданылды</span>`:`<span>${statusBadge(a)}</span>`;
const cardHTML=a=>`<div class="agc" data-id="${a.id}" tabindex="0" role="button" aria-label="${esc(a.name)}">
 <div class="hd">${icon(a.cat,a.color,40)}<div><h3>${esc(a.name)}</h3><div class="by">${esc(authorLine(a))}</div></div></div>
 <p>${esc(a.desc)}</p><div>${a.aud.slice(0,3).map(x=>`<span class="tagp">${esc(x)}</span>`).join('')}${a.aud.length>3?`<span class="tagp">тағы ${a.aud.length-3}</span>`:''}</div>
 <div class="ft">${meta(a)}</div></div>`;
function renderNet(){const r=ROLES[ME],canMod=r.lvl<=2,modN=AGENTS.filter(a=>a.status==='mod').length,mineN=AGENTS.filter(a=>a.mine||MINE.includes(a.id)).length;
 let list=AGENTS.filter(a=>a.status==='pub');
 if(netTab==='mine')list=AGENTS.filter(a=>a.mine||MINE.includes(a.id));
 if(netTab==='mod')list=AGENTS.filter(a=>a.status==='mod');
 if(netTab==='all'){if(bundle)list=list.filter(a=>bundle.ids.includes(a.id));if(cat!=='Барлығы')list=list.filter(a=>a.cat===cat);if(aud)list=list.filter(a=>a.aud.includes(aud));
  if(q)list=list.filter(a=>(a.name+a.desc+a.tasks.join(' ')).toLowerCase().includes(q.toLowerCase()));list.sort((x,y)=>(y.rating||0)*1000+(y.uses||0)-(x.rating||0)*1000-(x.uses||0))}
 const empty={all:'Сүзгіге сай агент табылмады. Іздеуді немесе санатты өзгертіп көріңіз.',mine:'Мұнда сіз қосқан және жариялаған агенттер болады.',mod:'Тексеруді күтіп тұрған агент жоқ.'}[netTab];
 $('tab-net').innerHTML=`<div class="page">${path()}
 <div class="ph"><div><h1>Networking</h1><p>Колледждердің оқытушылары мен қызметкерлері жасаған ИИ-агенттер. Пайдалы агентті кабинетіңізге қосыңыз немесе өзіңіздікін жариялаңыз.</p></div><button class="btn pri" id="pubBtn">Агент жариялау</button></div>
 <div class="tabs" role="tablist"><button role="tab" class="${netTab==='all'?'on':''}" data-nt="all">Барлық агенттер</button><button role="tab" class="${netTab==='mine'?'on':''}" data-nt="mine">Менің агенттерім<span class="c">${mineN}</span></button>${canMod?`<button role="tab" class="${netTab==='mod'?'on':''}" data-nt="mod">Тексеру<span class="c">${modN}</span></button>`:''}</div>
 ${netTab==='all'?`<h2 class="sec">Дайын жинақтар</h2><div class="sets">${BUNDLES.map((b,i)=>`<button class="set ${bundle===b?'on':''}" data-b="${i}" aria-pressed="${bundle===b}"><h3>${b.t}</h3><p>${b.d}</p><div class="ics">${b.ids.map(id=>{const a=AGENTS.find(x=>x.id===id);return a?icon(a.cat,a.color,26):''}).join('')}</div></button>`).join('')}</div>
 <h2 class="sec">Агенттер</h2>
 <div class="filters"><input id="q" type="search" placeholder="Іздеу: сабақ жоспары, тест, бұйрық" value="${esc(q)}" aria-label="Агент іздеу">
  <select id="fc" aria-label="Санат">${CATS.map(c=>`<option ${c===cat?'selected':''} value="${c}">${c==='Барлығы'?'Барлық санаттар':c}</option>`).join('')}</select>
  <select id="fa" aria-label="Кімге арналған"><option value="">Кімге арналса да</option>${AUD.map(x=>`<option ${x===aud?'selected':''}>${x}</option>`).join('')}</select>
  ${bundle?`<button class="btn sm" id="clrB">«${bundle.t}» жинағын алып тастау</button>`:''}</div>`:''}
 ${netTab==='mod'?`<p class="muted" style="margin:-6px 0 14px">Оқытушы жариялаған агент алдымен директорға, содан кейін облысқа түседі. Мақұлданғаннан кейін ол барлық колледждерге көрінеді.</p>`:''}
 <div class="agents">${list.map(cardHTML).join('')||`<div class="empty">${empty}</div>`}</div>
 <p class="note">Баға мен қолданыс саны демо үшін. Жарияланған агенттер осы браузерде сақталады.</p></div>`;
 const T=$('tab-net');T.querySelector('#pubBtn').onclick=openPublish;
 T.querySelectorAll('[data-nt]').forEach(b=>b.onclick=()=>{netTab=b.dataset.nt;renderNet()});
 T.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{const x=BUNDLES[+b.dataset.b];bundle=bundle===x?null:x;renderNet()});
 const cb=T.querySelector('#clrB');if(cb)cb.onclick=()=>{bundle=null;renderNet()};
 const fc=T.querySelector('#fc');if(fc){fc.onchange=()=>{cat=fc.value;renderNet()};T.querySelector('#fa').onchange=e=>{aud=e.target.value;renderNet()}}
 const qi=T.querySelector('#q');if(qi){qi.oninput=()=>{q=qi.value;const pos=qi.selectionStart;renderNet();const n=$('q');n.focus();n.setSelectionRange(pos,pos)}}
 T.querySelectorAll('.agc').forEach(c=>{c.onclick=()=>openAgent(c.dataset.id);c.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openAgent(c.dataset.id)}}})}
function modal(head,body){const m=document.createElement('div');m.className='modal';const back=document.activeElement;
 m.innerHTML=`<div class="sheet" role="dialog" aria-modal="true"><div class="sheet-h">${head}<button class="btn sm x">Жабу</button></div><div class="sheet-b">${body}</div></div>`;
 const close=()=>{m.remove();document.removeEventListener('keydown',k);back&&back.focus&&back.focus()},k=e=>{if(e.key==='Escape')close()};
 m.onclick=e=>{if(e.target===m||e.target.closest('.x'))close()};document.addEventListener('keydown',k);document.body.appendChild(m);m.close=close;return m}
function openAgent(id){const a=AGENTS.find(x=>x.id===id);if(!a)return;const r=ROLES[ME],has=MINE.includes(a.id)||a.mine;
 const m=modal(`<div style="display:flex;gap:14px;align-items:center">${icon(a.cat,a.color,48)}<div><h2>${esc(a.name)}${statusBadge(a)}</h2><p>${esc(authorLine(a))}</p></div></div>`,
 `<div class="dl"><div><section><h3>Не істейді</h3><p style="margin:0">${esc(a.desc)}</p></section>
  <section><h3>Қандай тапсырмаларды орындайды</h3><ul>${a.tasks.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></section>
  ${a.example?`<section><h3>Мысал сұраныс</h3><div class="ex">${esc(a.example)}</div></section>`:''}</div>
 <div><section><h3>Кімге арналған</h3>${a.aud.map(x=>`<span class="tagp">${esc(x)}</span>`).join('')}</section>
  <section><h3>Санат</h3><span class="tagp">${esc(a.cat)}</span></section>
  ${a.status==='pub'?`<section><h3>Қолданыс</h3><p style="margin:0" class="muted">${a.rating?`Баға ${String(a.rating).replace('.',',')}, `:''}${a.uses??0} рет қолданылды</p></section>`:''}
  <section>${a.status==='mod'&&r.lvl<=2?`<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn pri" id="apr">Мақұлдау</button><button class="btn" id="rej">Авторға қайтару</button></div>`:
   a.status==='pub'?`<button class="btn pri" id="addA" ${has?'disabled':''}>${has?'Кабинетіңізде бар':'Кабинетке қосу'}</button>`:''}</section>
 </div></div>`);
 const ad=m.querySelector('#addA');if(ad&&!has)ad.onclick=()=>{MINE.push(a.id);store.set('shq_mine',MINE);a.uses=(a.uses||0)+1;saveA();ad.textContent='Кабинетіңізде бар';ad.disabled=true;toast('Агент кабинетке қосылды')};
 const ap=m.querySelector('#apr');if(ap)ap.onclick=()=>{a.status='pub';a.rating=null;a.uses=0;saveA();m.close();toast('Агент мақұлданды және жарияланды');renderNet()};
 const rj=m.querySelector('#rej');if(rj)rj.onclick=()=>{a.status='rej';saveA();m.close();toast('Агент авторға қайтарылды');renderNet()}}
/* публикация */
const COLORS=['#5B4BC4','#2563EB','#00799A','#1E7A46','#C2570C','#B8326E','#0E2A47'];
function openPublish(){const r=ROLES[ME];let color=COLORS[0],tasks=['',''];
 const m=modal(`<div><h2>Агент жариялау</h2><p>Басқа колледждер агентіңізді табуы үшін оның не істейтінін, қандай тапсырмаларды орындайтынын және кімге арналғанын жазыңыз.</p></div>`,
 `<form id="pf" class="pub" novalidate><div class="col">
  <div class="fld"><label for="pName">Атауы</label><input id="pName" maxlength="60" placeholder="Мысалы: Сабақ жоспарының шебері"><div class="err" id="eName"></div></div>
  <div class="fld"><label for="pDesc">Не істейді?</label><small class="hint">Қандай мәселені шешеді және соңында не береді</small><textarea id="pDesc" rows="3" maxlength="300"></textarea><div class="err" id="eDesc"></div></div>
  <div class="fld"><label>Қандай тапсырмаларды орындайды?</label><small class="hint">Әр жолға бір тапсырма</small><div class="tasks" id="pTasks"></div><button type="button" class="btn sm" id="addT" style="align-self:flex-start">Тапсырма қосу</button><div class="err" id="eTasks"></div></div>
  <fieldset class="fld" style="border:0;padding:0;margin:0"><legend style="font-size:14px;font-weight:500;padding:0;margin-bottom:6px">Кімге арналған?</legend><div class="roles-pick" id="pAud">${AUD.map(x=>`<label><input type="checkbox" value="${x}">${x}</label>`).join('')}</div><div class="err" id="eAud"></div></fieldset>
  <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px"><div class="fld"><label for="pCat">Санат</label><select id="pCat">${CATS.slice(1).map(c=>`<option>${c}</option>`).join('')}</select></div>
   <div class="fld"><label id="colL">Белгі түсі</label><div class="colors" id="pCol" role="radiogroup" aria-labelledby="colL">${COLORS.map((c,i)=>`<button type="button" role="radio" aria-checked="${!i}" aria-label="Түс ${i+1}" data-col="${c}" style="background:${c}" class="${i?'':'on'}"></button>`).join('')}</div></div></div>
  <div class="fld"><label for="pEx">Мысал сұраныс</label><small class="hint">Міндетті емес</small><input id="pEx" maxlength="120" placeholder="Т18 RecyclerView, ТБ-26-11, 80 минут"></div>
 </div><div class="col"><p class="prev-l">Networking-те осылай көрінеді</p><div class="prevbox" id="pPrev"></div>
  ${r.lvl<=1?'<p class="muted" style="margin:0;font-size:13.5px">Сіздің деңгейіңізде агент бірден жарияланады.</p>':'<div><p class="prev-l" style="margin-bottom:4px">Жариялағаннан кейін</p><ol class="flow"><li>Колледж директоры тексереді</li><li>Облыс маманы мақұлдайды</li><li>Агент барлық колледждерге көрінеді</li></ol></div>'}
  <button class="btn pri" type="submit">Жариялау</button></div></form>`);
 const tl=m.querySelector('#pTasks');
 const drawT=()=>{tl.innerHTML=tasks.map((t,i)=>`<div class="row"><input data-t="${i}" value="${esc(t)}" placeholder="Мысалы: ${['КТП бойынша сабақ жоспары','Үй тапсырмасын құрастыру','Бағалау критерийлері'][i%3]}" aria-label="Тапсырма ${i+1}">${tasks.length>1?`<button type="button" class="btn sm" data-rm="${i}" aria-label="Тапсырма ${i+1} өшіру">Өшіру</button>`:''}</div>`).join('');
  tl.querySelectorAll('[data-t]').forEach(inp=>inp.oninput=()=>{tasks[+inp.dataset.t]=inp.value;m.querySelector('#eTasks').textContent='';prev()});
  tl.querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>{tasks.splice(+b.dataset.rm,1);drawT();prev()})};
 m.querySelector('#addT').onclick=()=>{if(tasks.length<8){tasks.push('');drawT();tl.querySelector(`[data-t="${tasks.length-1}"]`).focus()}};
 m.querySelectorAll('#pCol button').forEach(b=>b.onclick=()=>{color=b.dataset.col;m.querySelectorAll('#pCol button').forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-checked',x===b)});prev()});
 const val=()=>({name:m.querySelector('#pName').value.trim(),desc:m.querySelector('#pDesc').value.trim(),tasks:tasks.map(t=>t.trim()).filter(Boolean),aud:[...m.querySelectorAll('#pAud input:checked')].map(x=>x.value),cat:m.querySelector('#pCat').value,example:m.querySelector('#pEx').value.trim()});
 const prev=()=>{const v=val();m.querySelector('#pPrev').innerHTML=cardHTML({id:'p',name:v.name||'Агенттің атауы',desc:v.desc||'Агенттің сипаттамасы осында шығады.',tasks:v.tasks,aud:v.aud.length?v.aud:['Кімге арналған'],cat:v.cat,color,author:{role:ME,col:ROLES[ME].col??null},status:'pub',rating:null,uses:0}).replace('class="agc"','class="agc" style="cursor:default;border:0"').replace('tabindex="0" role="button"','')};
 m.querySelectorAll('#pName,#pDesc,#pCat,#pEx').forEach(x=>x.oninput=x.onchange=()=>{const e=m.querySelector('#e'+x.id.slice(1));if(e)e.textContent='';prev()});
 m.querySelectorAll('#pAud input').forEach(x=>x.onchange=()=>{m.querySelector('#eAud').textContent='';prev()});
 drawT();prev();m.querySelector('#pName').focus();
 m.querySelector('#pf').onsubmit=e=>{e.preventDefault();const v=val();let ok=true;
  if(v.name.length<3){m.querySelector('#eName').textContent='Атауын жазыңыз, кемінде 3 әріп.';ok=false}
  if(v.desc.length<20){m.querySelector('#eDesc').textContent='Агент не істейтінін толығырақ жазыңыз, кемінде 20 таңба.';ok=false}
  if(!v.tasks.length){m.querySelector('#eTasks').textContent='Кемінде бір тапсырма жазыңыз.';ok=false}
  if(!v.aud.length){m.querySelector('#eAud').textContent='Агент кімге арналғанын белгілеңіз.';ok=false}
  if(!ok){const f=m.querySelector('.err:not(:empty)');f&&f.scrollIntoView({block:'center',behavior:'smooth'});return}
  const a={id:'u'+Date.now(),...v,color,author:{role:ME,col:ROLES[ME].col??null},status:ROLES[ME].lvl<=1?'pub':'mod',rating:null,uses:0,mine:true};
  AGENTS.unshift(a);saveA();m.close();netTab='mine';renderNet();toast(a.status==='pub'?'Агент жарияланды':'Агент тексеруге жіберілді')}}
/* админка */
function renderAdmin(){const r=ROLES[ME];const Y='<span class="yes">Иә</span>',N='<span class="no">Жоқ</span>';
 const rows=[['admin','Бүкіл Қазақстан',Y,Y,Y,'Барлық деңгейде'],['analyst','Бүкіл Қазақстан, тек оқу',Y,Y,N,N],['oblys','Өз облысы',Y,Y,Y,'Облыс ішінде'],['director','Өз колледжі',Y,Y,Y,'Колледж ішінде'],
  ['zam','Оқу бөлімі',Y,Y,N,N],['kadr','Кадр құжаттары',Y,Y,N,N],['buh','Қаржы құжаттары',Y,Y,N,N],['teacher','Тек өзі',N,Y,N,N],['psix','Өзі, құпия жазбалар',N,Y,N,N],['soc','Өзі, әлеуметтік паспорт',N,Y,N,N]];
 const users=USERS.filter(u=>{const x=ROLES[u.role];return x.lvl>=r.lvl&&(r.lvl<=1||x.col===r.col)});
 $('tab-admin').innerHTML=`<div class="page">${path()}<div class="ph"><div><h1>Әкімшілік</h1><p>Әр деңгей өзінен төмендегілердің бәрін көреді. Төменгі деңгей жоғарыны көрмейді, ал колледждер бір-бірінің ішкі құжаттарын көрмейді. Психологтың жеке кеңес жазбалары ешкімге көрінбейді: басшылар тек атаусыз статистиканы көреді.</p></div></div>
 <section class="blk" style="margin-bottom:22px;overflow-x:auto"><h2>Рөлдер мен құқықтар</h2><div class="body"><table class="mx"><tr><th>Рөл</th><th>Деңгей</th><th>Көру аймағы</th><th>Төмендегілерді көреді</th><th>Агент жариялайды</th><th>Агентті тексереді</th><th>Рөл береді</th></tr>
 ${rows.map(([k,s,a,b,c,d])=>`<tr${k===ME?' style="background:#F3F7FA"':''}><td>${ROLES[k].t}</td><td>${LVL_NAME[ROLES[k].lvl]}</td><td>${s}</td><td>${a}</td><td>${b}</td><td>${c}</td><td>${d}</td></tr>`).join('')}</table></div></section>
 <section class="blk"><h2>Пайдаланушылар<small>Сіздің аймағыңыздағы ${users.length} демо-аккаунт</small></h2><div class="body"><table class="mx"><tr><th>Рөл</th><th>Логин</th><th>Ұйым</th><th>Деңгей</th></tr>${users.map(u=>{const x=ROLES[u.role];return `<tr><td>${x.t}</td><td>${u.login}</td><td>${esc(x.org)}</td><td>${LVL_NAME[x.lvl]}</td></tr>`}).join('')}</table></div></section></div>`}
if(ME&&ROLES[ME])enter();
})();
/* live-reload только на localhost: следим за ver.txt */
if(/^(localhost|127\.0\.0\.1)$/.test(location.hostname)){let v0=null;setInterval(()=>fetch('ver.txt?'+Date.now(),{cache:'no-store'}).then(r=>r.ok?r.text():null).then(v=>{if(v==null)return;v=v.trim();if(v0!==null&&v!==v0)location.reload();v0=v}).catch(()=>{}),2000)}
