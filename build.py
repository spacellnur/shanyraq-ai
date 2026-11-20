"""Сборка Шаңырақ AI в один файл dist/index.html.
Запуск: python build.py   (нужен Python 3.9+, без дополнительных пакетов)"""
import base64,json,os,re
ROOT=os.path.dirname(os.path.abspath(__file__))
P=lambda *a:os.path.join(ROOT,*a)
rd=lambda *a:open(P(*a),encoding='utf-8').read()

def build_cab():
    """Шаблон 3D-кабинета (templates/office.html) -> строка CAB_HTML с казахскими подписями."""
    s=open(os.path.join(ROOT,'templates','office.html'),encoding='utf-8').read()
    # модели берём у родительской страницы
    s=re.sub(r'const GLB=\{.*?\};','const GLB=parent.__GLB;const CFG=parent.__CAB||{};',s,count=1,flags=re.S)
    # заголовок и легенду прячем — шапку даёт родитель
    s=s.replace('<h1>Офис ИИ-агентов</h1>','')
    s=re.sub(r'<p class="sub">.*?</p>','',s,count=1,flags=re.S)
    s=re.sub(r'<p class="note">.*?</p>','',s,count=1,flags=re.S)
    s=s.replace('.wrap{max-width:1100px;margin:0 auto;padding:12px}','.wrap{max-width:none;margin:0;padding:0}')
    s=s.replace('font:14px/1.5 system-ui','font:14px/1.5 "Golos Text",system-ui')
    s=s.replace('background:var(--bg);','background:transparent;')
    R=[("const ST={work:['Работает'","const ST={work:['Жұмыста'"),("think:['Думает'","think:['Ойлануда'"),("wait:['Ждёт'","wait:['Күтуде'"),("rest:['Отдыхает'","rest:['Демалуда'"),("walk:['Идёт'","walk:['Жүріп келеді'"),
    ("const ROOMS=[['Кабинет','Оркестратор'","const ROOMS=[['Бас агент','Оркестратор'"),("['Команда','Субагенты'","['Команда','Агенттер'"),("['Серверная','MCP'","['Серверлік','MCP'"),
    ("['Библиотека','RAG'","['Кітапхана','RAG'"),("['Лаунж','Отдых'","['Демалыс','Лаунж'"),("['Переговорка','Проверка'","['Кеңес бөлмесі','Тексеру'"),
    ('<span><i style="background:var(--work)"></i>Работает</span>','<span><i style="background:var(--work)"></i>Жұмыста</span>'),
    ('<span><i style="background:var(--think)"></i>Думает</span>','<span><i style="background:var(--think)"></i>Ойлануда</span>'),
    ('<span><i style="background:var(--wait)"></i>Ждёт</span>','<span><i style="background:var(--wait)"></i>Күтуде</span>'),
    ('<span><i style="background:var(--walk)"></i>Идёт</span>','<span><i style="background:var(--walk)"></i>Жүріп келеді</span>'),
    ('<span><i style="background:var(--rest)"></i>Отдыхает</span>','<span><i style="background:var(--rest)"></i>Демалуда</span>'),
    ('Поток данных MCP</span>','MCP деректер ағыны</span>'),
    ('>Запустить<','>Іске қосу<'),('Своя задача: например, тест по Python','Өз тапсырмаңыз'),('>Дать свою задачу<','>Тапсырма беру<'),
    ('Загружаю 3D-модели…','Кабинет жүктелуде…'),('Выполнено задач','Орындалды'),('Токены субагентов','Агенттер токені'),('Контекст главного<','Бас агент контексі<'),
    ('Крути пальцем · щипок = зум','Айналдыру: тышқанмен, жақындату: дөңгелекпен'),('<h2>Журнал</h2>','<h2>Жұмыс журналы</h2>'),
    ("'Офис занят. Дождись конца текущей задачи.'","'Кабинет бос емес. Ағымдағы тапсырма аяқталғанын күтіңіз.'"),("'Сначала напиши задачу.'","'Алдымен тапсырманы жазыңыз.'"),("'Ошибка загрузки 3D: '","'3D жүктелмеді: '"),
    ("log('Новая задача: «'+safe+'»')","log('Жаңа тапсырма: «'+safe+'»')"),
    ("'делит задачу на части'","'тапсырманы бөліктерге бөлуде'"),
    ("`План: ${plan.ph.length} этап(а), на первом ${plan.ph[0].length} субагент(а) параллельно.`","`Жоспар: ${plan.ph.length} кезең, бірінші кезеңде ${plan.ph[0].length} агент қатар жұмыс істейді.`"),
    ("`ждёт результаты 0/${ph.length}`","`нәтиже күтуде 0/${ph.length}`"),("`ждёт результаты ${state.done}/${state.n}`","`нәтиже күтуде ${state.done}/${state.n}`"),
    ("'ждёт проверку'","'тексеруді күтуде'"),("log('Оркестратор → Проверяющий: проверь текст')","log(`${AG.dir.n} → ${AG.rev.n}: мәтінді тексер`)"),
    ("'проверяет факты и ошибки'","'фактілер мен қателерді тексеруде'"),("'вернул на доработку'","'түзетуге қайтарды'"),
    ("log('Проверяющий: нашёл ошибку → вернуть Писателю','err')","log(`${AG.rev.n}: қате тапты, ${AG.wri.n} түзетеді`,'err')"),
    ("'исправляет ошибку'","'қатені түзетуде'"),("log('Проверяющий: всё верно, OK')","log(`${AG.rev.n}: бәрі дұрыс`)"),
    ("'собирает финальный ответ'","'соңғы жауапты жинауда'"),
    ("log(`Готово. Субагенты потратили ${Math.round(total).toLocaleString('ru')} ток., а в контексте главного всего ${AG.dir.ctx.toLocaleString('ru')}.`,'fin')","log(`Дайын. Агенттер ${Math.round(total).toLocaleString('ru')} токен жұмсады, ал бас агенттің контексінде тек ${AG.dir.ctx.toLocaleString('ru')}.`,'fin')"),
    ("`Параллельная работа: ~${par} с вместо ~${seq} с по очереди.`","`Қатар жұмыс: кезекпен ~${seq} с орнына ~${par} с.`"),
    ("'ответ готов'","'жауап дайын'"),
    ("`Оркестратор → ${a.n}: «${task}»`","`${AG.dir.n} → ${a.n}: «${task}»`"),
    ("`${a.n} → Оркестратор: выжимка ~300 ток. (сам потратил ${tok.toLocaleString('ru')})`","`${a.n} → ${AG.dir.n}: қысқаша нәтиже (~300 токен, өзі ${tok.toLocaleString('ru')} жұмсады)`"),
    ("'MCP-сервер → Библиотекарь: 4 найденных куска текста'","`MCP-сервер → ${AG.lib.n}: 4 үзінді табылды`"),
    ("'сдаёт выжимку'","'нәтижені тапсыруда'"),
    ("`Контекст главного: ${a.ctx.toLocaleString('ru')} ток.`","`Бас агент контексі: ${a.ctx.toLocaleString('ru')} токен`"),
    ("`Потрачено: ${Math.round(a.tok).toLocaleString('ru')} ток. (в своём контексте)`","`Жұмсады: ${Math.round(a.tok).toLocaleString('ru')} токен (өз контексінде)`"),
    ("'ищет в интернете: '+q","'ақпарат іздеуде: '+q"),("'RAG: ищет в документах колледжа'","'RAG: колледж құжаттарынан іздеуде'"),("'пишет ответ из 2 выжимок'","'2 нәтижеден жауап жазуда'"),
    ]
    for a,b in R:
        if a not in s:print('MISS',a[:60])
        s=s.replace(a,b)
    # агенты и сценарии под роль владельца кабинета
    s=s.replace("const ST={work:","if(CFG.ag)for(const k in CFG.ag)if(AG[k]){AG[k].n=CFG.ag[k][0];AG[k].r=CFG.ag[k][1]}\nconst ST={work:",1)
    s=s.replace("const sel=$('preset');PRESETS.forEach","if(CFG.presets){PRESETS.length=0;PRESETS.push(...CFG.presets)}window.__P=PRESETS;\nconst sel=$('preset');PRESETS.forEach",1)
    # кабинет на всю высоту iframe и мост к родительской странице
    s=s.replace("const w=sceneEl.clientWidth,h=Math.round(w<600?Math.max(400,w*1.05):Math.min(720,Math.max(440,w*.72)));","const w=sceneEl.clientWidth,h=Math.max(300,innerHeight);")
    s=s.replace('</style>','.wrap{padding:0!important;max-width:none!important}.ctrl,#busy,.legend,.cards,h2,#log,.note,#hud,#hint{display:none!important}#scene{border-radius:0!important;border:0!important;background:radial-gradient(ellipse at 50% 40%,#f4f6f9 0%,#e3e8ef 100%)!important}body{margin:0;overflow:hidden;background:transparent}</style>',1)
    bridge="""<script>(function(){var P=parent,$=function(i){return document.getElementById(i)},sent=false;
window.CAB={ready:function(){return !$('loading')},run:function(i,t){var p=window.__P[i],o=p.t;if(t)p.t=t;$('preset').value=i;$('run').click();setTimeout(function(){p.t=o},50)},text:function(q){$('custom').value=q;$('runc').click()},speed:function(v){$('sp'+v).click()}};
var L=$('log');new MutationObserver(function(){if(L.children.length<=1)sent=false;var f=L.querySelector('.fin');P.__cabEvt&&P.__cabEvt({type:'log',html:L.innerHTML});if(f&&!sent){sent=true;P.__cabEvt&&P.__cabEvt({type:'done'})}}).observe(L,{childList:true});
var B=$('busy');new MutationObserver(function(){P.__cabEvt&&P.__cabEvt({type:'busy',text:B.textContent})}).observe(B,{childList:true,characterData:true,subtree:true});})();</script>"""
    s=s.replace('</body>',bridge+'</body>',1)
    CAB_JS=('const CAB_HTML='+json.dumps(s,ensure_ascii=False).replace('</','<\\/')+';')

    return CAB_JS

def main():
    s=rd('src','shell.html')
    glb={f[:-4]:base64.b64encode(open(P('models',f),'rb').read()).decode() for f in sorted(os.listdir(P('models'))) if f.endswith('.glb')}
    colleges=[l.split('|') for l in rd('src','colleges.txt').strip().splitlines()]
    s=s.replace('<!--GLB-->','<script>const GLB='+json.dumps(glb)+';window.__GLB=GLB;</script>')
    s=s.replace('<!--DOCS-->','<script>'+rd('src','docs.js')+'</script>')
    s=s.replace('<!--KZ-->','<script>const KZ_OUTLINE='+rd('data','kz.json')+';</script>')
    s=s.replace('<!--OBL-->','<script>const OBLAST='+rd('data','obl.json')+';const COLLEGE_LIST='+json.dumps(colleges,ensure_ascii=False)+';</script>')
    s=s.replace('<!--MAIN-->','<script>'+rd('src','main.js').replace('/*FLOORS*/',rd('src','floors.js')).replace('/*NET*/',rd('src','net.js'))+'</script>')
    s=s.replace('/*FONTS*/',rd('src','fonts.css')).replace('/*APPCSS*/',rd('src','app.css'))
    s=s.replace('<!--APP-->','<script>'+build_cab()+'</script><script>'+rd('src','app.js')+'</script>')
    os.makedirs(P('dist'),exist_ok=True)
    open(P('dist','index.html'),'w',encoding='utf-8').write(s)
    import time;open(P('dist','ver.txt'),'w').write(str(int(time.time())))  # для автообновления на localhost
    print('dist/index.html',len(s)//1024,'KB')

if __name__=='__main__':main()
