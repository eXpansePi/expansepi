import type { Language } from "./config"

const cs = {
  meta: {
    title: "Pro firmy: školení, AI, automatizace a software na míru",
    description: "Školení zaměstnanců, praktické využití AI, automatizace procesů a software na míru. S eXpansePi můžete začít od problému, bez hotového technického zadání.",
  },
  home: {
    title: "Školení, AI a software pro firmy",
    intro: "Rozvíjíme dovednosti týmů, automatizujeme opakovanou práci a stavíme firemní nástroje. Můžete přijít s konkrétním zadáním i s problémem, pro který teprve hledáte řešení.",
    action: "Prohlédnout služby pro firmy",
    metaTitle: "IT kurzy a služby pro firmy | eXpansePi",
    metaDescription: "Praktické IT kurzy pro jednotlivce. Pro firmy školení týmů, AI, automatizace procesů a software na míru od vývojářů z praxe.",
  },
  hero: {
    title: "Školení, AI a software pro firmy",
    intro: "Pomáháme vašim lidem zvládnout nové technologie a vašemu provozu zbavit se zbytečné ruční práce. Navrhujeme a vyvíjíme nástroje podle toho, co potřebujete vyřešit.",
    note: "Nemusíte mít hotové technické zadání. Začneme vaším problémem.",
    action: "Probrat zadání",
    secondary: "S čím vám pomůžeme",
  },
  services: {
    title: "S čím se na nás obrátit",
    intro: "Pro menší firmy i týmy ve větších organizacích. Spolupracujeme s vedením, HR, provozními i IT týmy; pro první rozhovor nemusíte být technický specialista.",
    items: [
      { id: "skoleni", title: "Školení zaměstnanců", text: "Tým potřebuje nové dovednosti, které využije ve své práci. Obsah a tempo přizpůsobíme lidem i vašim technologiím.", action: "Školení pro váš tým" },
      { id: "ai-automatizace", title: "AI a automatizace", text: "Ruční přepisování, hledání informací nebo opakované úkoly. Najdeme vhodný postup a ověříme ho na konkrétní úloze.", action: "AI v každodenní práci" },
      { id: "software", title: "Software na míru", text: "Tabulky nebo hotové nástroje už nestačí. Vytvoříme aplikaci, interní systém nebo propojení vašich stávajících nástrojů.", action: "Vývoj podle potřeb firmy" },
    ],
  },
  ai: {
    eyebrow: "Praktické využití, ověřitelný přínos",
    title: "AI a automatizace",
    intro: "Od konzultace a výběru vhodných úloh po vlastní nástroj a jeho zapojení do provozu. Posoudíme očekávaný přínos, kvalitu dat i náklady. Kde stačí běžná automatizace, není potřeba přidávat AI.",
    output: "Podle zadání připravíme doporučení a plán zavádění AI, ověříme vybraný scénář v pilotu nebo dodáme vlastní AI nástroj a integraci. Součástí domluvy jsou kritéria vyhodnocení a zaškolení lidí, kteří budou řešení používat.",
    cases: [
      { title: "Přepisujete údaje z dokumentů", text: "Vytěžování údajů z objednávek, formulářů nebo jiných podkladů. Výstupy lze předat ke kontrole a následně zapsat do vašeho systému." },
      { title: "Informace hledáte na více místech", text: "Interní asistent nad vybranou dokumentací, vyhledávání znalostí a odpovědi s odkazy na podklady. Rozsah zdrojů a přístupů navrhneme společně." },
      { title: "Nástroje si nepředávají data", text: "Propojení aplikací přes API, automatické reporty, zpracování požadavků a navazující úkoly. Méně opakovaného kopírování mezi systémy." },
    ],
    workflow: {
      title: "Příklad: od přijaté objednávky k záznamu v systému",
      steps: ["Přijatý dokument", "AI vybere údaje", "Člověk je zkontroluje", "Zápis do systému"],
      note: "Ilustrační postup, ne reference klienta. Míru automatizace, kontrolu chyb a schvalování nastavíme podle konkrétního procesu.",
    },
    private: {
      title: "Privátní / interní AI",
      intro: "Firemní asistent může hledat ve vaší dokumentaci, pracovat s vybranými interními daty a navazovat na existující systémy. Interní nástroj ale automaticky neznamená, že data neopouštějí firmu.",
      items: [
        { title: "Zdroje a oprávnění", text: "Určíme, ke kterým podkladům smí asistent přistupovat a kdo smí vidět konkrétní odpovědi. Navrhneme napojení na vaše řízení přístupů." },
        { title: "Vhodný způsob provozu", text: "Posoudíme externí službu, privátní prostředí nebo provoz na vaší infrastruktuře. Volba závisí na citlivosti dat, podmínkách poskytovatele, nákladech a možnostech správy." },
        { title: "Ověření před nasazením", text: "Na dohodnutých úlohách ověříme kvalitu odpovědí, práci se zdroji a přístupová pravidla. Domluvíme aktualizace podkladů, odpovědnost za provoz i limity řešení." },
      ],
    },
  },
  training: {
    title: "Školení zaměstnanců",
    intro: "Workshop nebo navazující školení pro konkrétní tým. Začneme jeho zkušenostmi, používanými nástroji a úlohami, které potřebuje zvládat. Podle toho sestavíme osnovu, tempo a praktická cvičení.",
    includes: "Co může být obsahem",
    items: [
      "Programování a data: Python, webový vývoj, databáze a SQL nebo další technologie podle vašeho prostředí.",
      "AI v běžné práci: výběr nástrojů, praktické zadávání úloh, ověřování výstupů a pravidla zacházení s daty.",
      "AI ve vývoji: asistované programování, příprava testů a kontrola navrženého kódu v kontextu vašeho projektu.",
    ],
    output: "Dostanete školení podle dohodnuté osnovy, praktické úlohy a materiály pro další práci. Formu, rozsah a velikost skupiny potvrdíme předem.",
  },
  software: {
    title: "Software na míru",
    intro: "Začínáme tím, jak vaše firma pracuje a co jí dnes nevyhovuje. Společně upřesníme požadavky, navrhneme technické řešení a rozdělíme vývoj do ověřitelných kroků.",
    includes: "Co můžeme vytvořit",
    items: [
      "Webové aplikace a portály pro vaše zákazníky, partnery nebo zaměstnance.",
      "Interní systémy a nástroje pro evidenci, schvalování, reporting a další firemní postupy.",
      "Integrace existujících systémů, rozhraní API a aplikace s AI tam, kde má v konkrétní úloze smysl.",
    ],
    output: "Dostanete otestované řešení v dohodnutém rozsahu, dokumentaci a předání týmu. Hosting, průběžnou údržbu a další rozvoj domluvíme podle potřeby.",
  },
  outputLabel: "Co si odnesete",
  process: {
    title: "Jak spolupráce probíhá",
    intro: "Objednat si můžete samostatnou konzultaci či analýzu, týmové školení, pilotní ověření nebo vývoj a integraci řešení. Začneme rozsahem, který odpovídá vaší situaci.",
    steps: [
      { title: "Probereme problém", text: "Popíšete současný postup, kdo s ním pracuje a co se má zlepšit. Doplníme otázky k nástrojům, datům, omezením a očekávanému výsledku." },
      { title: "Dohodneme rozsah a cenu", text: "Navrhneme konkrétní výstup, způsob ověření, termín a cenu. Pokud je vhodný pilot, oddělíme jeho rozsah i rozhodnutí o dalším pokračování." },
      { title: "Dodáme a předáme", text: "Průběžně ověřujeme výsledek s vaším týmem. Součástí dohodnutého předání je vysvětlení používání a dokumentace; další podporu sjednáme zvlášť." },
    ],
    note: "Cena vychází z rozsahu školení nebo projektu, náročnosti integrací a požadavků na provoz. Nabídku včetně případných licencí a provozních nákladů si potvrdíme před zahájením práce.",
  },
  team: {
    title: "Zkušený tým vývojářů",
    intro: "Máme zkušenosti s vývojem webových aplikací, backendových systémů, prací s daty a automatizací. Technická řešení vysvětlujeme srozumitelně a navrhujeme je s ohledem na každodenní práci vašeho týmu.",
  },
  faq: {
    eyebrow: "", title: "Otázky před spoluprací", intro: "",
    items: [
      { question: "Potřebujeme technické zadání?", answer: "Ne. Stačí popsat problém a současný způsob práce. Pomůžeme upřesnit požadavky, možnosti i omezení. Pokud je potřeba podrobnější analýza, nejprve si potvrdíme její rozsah a cenu." },
      { question: "Můžeme začít jen školením nebo menší úlohou?", answer: "Ano. Školení, konzultace i pilot mohou být samostatnou zakázkou. Není nutné objednávat celý projekt. Po ověření výsledku se rozhodnete, zda a jak pokračovat." },
      { question: "Umíte navázat na naše současné systémy?", answer: "Ano, integrace jsou součástí nabídky. Nejprve ověříme dostupná rozhraní, oprávnění, kvalitu dat a omezení dodavatele. Teprve podle toho potvrdíme proveditelnost a rozsah propojení." },
      { question: "Musí naše data do veřejné AI služby?", answer: "Ne každé řešení ji potřebuje. Posoudíme vhodné nasazení podle vašich požadavků, včetně privátního prostředí nebo vlastní infrastruktury. Tok dat, přístupy a podmínky poskytovatelů vyjasníme před zpracováním firemních dat; samotné označení interní AI není zárukou soukromí." },
    ],
  },
  enquiry: {
    title: "Co potřebujete vyřešit?",
    intro: "Popište nám, co dnes zabírá čas, co vašemu týmu chybí nebo jaký nástroj potřebujete. Technické řešení nemusíte znát předem.",
    formTitle: "Nezávazná firemní poptávka",
    direct: "Můžete se ozvat i přímo",
    note: "Nezávazný první krok. Rozsah a cenu potvrdíme před zahájením práce.",
    close: "Zavřít firemní poptávku",
  },
}

export type BusinessCopy = typeof cs

const en: BusinessCopy = {
  meta: { title: "For businesses: training, AI, automation and custom software", description: "Employee training, practical AI, process automation and custom software. Bring eXpansePi a problem, even without a detailed technical specification." },
  home: { title: "Training, AI and software for businesses", intro: "We develop team skills, automate repetitive work and build business tools. Bring a defined brief or a problem whose solution is still open.", action: "Explore business services", metaTitle: "IT courses and business services | eXpansePi", metaDescription: "Practical IT courses for individuals. Employee training, AI, process automation and custom software for businesses, delivered by practising developers." },
  hero: { title: "Training, AI and software for businesses", intro: "We help your people use new technologies and your operations reduce unnecessary manual work. We design and build tools around the problem you need to solve.", note: "You do not need a technical specification. We start with your problem.", action: "Discuss your needs", secondary: "How we can help" },
  services: { title: "What we can help with", intro: "For smaller businesses and teams within larger organisations. We work with management, HR, operations and IT teams; you do not need technical expertise to start the conversation.", items: [
    { id: "skoleni", title: "Employee training", text: "Your team needs skills it can use at work. We adapt the content and pace to your people and the technologies they use.", action: "Training for your team" },
    { id: "ai-automatizace", title: "AI and automation", text: "Manual data entry, scattered information or repetitive tasks. We identify a suitable approach and test it on a specific task.", action: "AI in everyday work" },
    { id: "software", title: "Custom software", text: "Spreadsheets or off-the-shelf tools no longer fit. We build applications, internal systems and connections between your existing tools.", action: "Development for your needs" },
  ] },
  ai: { eyebrow: "Practical use, measurable value", title: "AI and automation", intro: "From consulting and choosing useful tasks to building a tool and integrating it into operations. We assess expected value, data quality and costs. Where conventional automation is enough, there is no need to add AI.", output: "Depending on the brief, we deliver recommendations and an AI adoption plan, validate a chosen use case in a pilot, or build a custom AI tool and integration. Evaluation criteria and training for the people using the solution are agreed as part of the scope.", cases: [
    { title: "You retype data from documents", text: "Extract information from orders, forms and other documents. Send results for review before writing them into your system." },
    { title: "Information is scattered across tools", text: "An internal assistant over selected documentation, knowledge search and answers linked to source material. We agree the sources and access rules together." },
    { title: "Your tools do not share data", text: "API connections, automated reports, request processing and follow-up tasks. Less repetitive copying between systems." },
  ], workflow: { title: "Example: from an incoming order to a system record", steps: ["Incoming document", "AI extracts fields", "A person reviews them", "Write to the system"], note: "An illustrative workflow, not a client case study. Automation, error handling and approvals are designed for the specific process." }, private: { title: "Private / internal AI", intro: "A company assistant can search your documentation, work with selected internal data and connect to existing systems. An internal tool does not automatically mean that data stays inside your company.", items: [
    { title: "Sources and permissions", text: "Define which material the assistant may access and who may see particular answers. Design integration with your access controls." },
    { title: "Appropriate deployment", text: "Assess an external service, a private environment or your own infrastructure. The choice depends on data sensitivity, provider terms, costs and operational capacity." },
    { title: "Validation before deployment", text: "Check answer quality, use of sources and access rules on agreed tasks. Define document updates, operational ownership and the solution's limits." },
  ] } },
  training: { title: "Employee training", intro: "A workshop or a series of sessions for a specific team. We start with its experience, tools and real tasks, then design the syllabus, pace and practical exercises.", includes: "Possible training topics", items: [
    "Programming and data: Python, web development, databases and SQL, or other technologies used in your environment.",
    "AI at work: choosing tools, practical prompting, checking outputs and rules for handling data.",
    "AI-assisted development: coding, preparing tests and reviewing suggested code in the context of your project.",
  ], output: "Training to the agreed syllabus, practical exercises and materials for continued practice. Format, scope and group size are confirmed in advance." },
  software: { title: "Custom software", intro: "We start with how your company works and what is not working well. Together we clarify requirements, design a technical solution and divide development into testable steps.", includes: "What we can build", items: [
    "Web applications and portals for your customers, partners or employees.",
    "Internal systems and tools for records, approvals, reporting and other business workflows.",
    "System integrations, APIs and AI-powered applications where AI serves a specific task.",
  ], output: "A tested solution within the agreed scope, documentation and handover to your team. Hosting, maintenance and further development are agreed as needed." },
  outputLabel: "What you receive",
  process: { title: "How we work together", intro: "You can commission a standalone consultation or assessment, team training, a pilot, or software development and integration. We start with a scope that fits your situation.", steps: [
    { title: "Discuss the problem", text: "Describe the current process, who uses it and what should improve. We ask about tools, data, constraints and the expected outcome." },
    { title: "Agree scope and price", text: "Define a deliverable, validation criteria, timeline and price. If a pilot makes sense, its scope and the decision to proceed further are separate." },
    { title: "Deliver and hand over", text: "We validate the result with your team along the way. The agreed handover includes an explanation of use and documentation; further support is arranged separately." },
  ], note: "Price depends on the training or project scope, integration complexity and operational requirements. We confirm the proposal, including any licence and running costs, before work starts." },
  team: { title: "An experienced development team", intro: "Our experience spans web applications, backend systems, data and automation. We explain technical solutions clearly and design them around your team's everyday work." },
  faq: { eyebrow: "", title: "Before we work together", intro: "", items: [
    { question: "Do we need a technical specification?", answer: "No. Describe the problem and how you currently work. We help clarify requirements, options and constraints. If a detailed assessment is needed, we agree its scope and price first." },
    { question: "Can we start with training or a small task?", answer: "Yes. Training, consulting and pilots can be standalone engagements. You do not need to commission an entire project. After evaluating the result, you decide whether and how to continue." },
    { question: "Can you work with our existing systems?", answer: "Yes, integrations are part of the offer. We first check available interfaces, permissions, data quality and vendor constraints, then confirm feasibility and scope." },
    { question: "Does our data have to go to a public AI service?", answer: "Not every solution needs one. We assess deployment options against your requirements, including a private environment or your own infrastructure. Data flows, access and provider terms are clarified before processing company data; the label internal AI is not a privacy guarantee." },
  ] },
  enquiry: { title: "What do you need to solve?", intro: "Tell us what takes too much time, what skills your team needs or which tool is missing. You do not need to know the technical solution yet.", formTitle: "Nonbinding business enquiry", direct: "You can also contact us directly", note: "A nonbinding first step. Scope and price are confirmed before work starts.", close: "Close business enquiry" },
}

const ru: BusinessCopy = {
  meta: { title: "Для компаний: обучение, AI, автоматизация и разработка", description: "Обучение сотрудников, практическое применение AI, автоматизация процессов и разработка на заказ. Обратитесь в eXpansePi с задачей, даже без технического задания." },
  home: { title: "Обучение, AI и разработка для компаний", intro: "Развиваем навыки команд, автоматизируем повторяющуюся работу и создаём инструменты для бизнеса. Можно прийти с готовым заданием или с проблемой, решение которой ещё предстоит найти.", action: "Услуги для компаний", metaTitle: "IT-курсы и услуги для компаний | eXpansePi", metaDescription: "Практические IT-курсы для частных лиц. Для компаний: обучение команд, AI, автоматизация процессов и разработка на заказ от практикующих разработчиков." },
  hero: { title: "Обучение, AI и разработка для компаний", intro: "Помогаем сотрудникам освоить технологии, а компании сократить лишнюю ручную работу. Проектируем и создаём инструменты под задачу, которую нужно решить.", note: "Готовое техническое задание не нужно. Начнём с вашей проблемы.", action: "Обсудить задачу", secondary: "Чем мы можем помочь" },
  services: { title: "С чем к нам обратиться", intro: "Для небольших компаний и команд крупных организаций. Работаем с руководителями, HR, операционными и IT-командами. Для первого разговора не нужно быть техническим специалистом.", items: [
    { id: "skoleni", title: "Обучение сотрудников", text: "Команде нужны навыки для работы. Адаптируем содержание и темп к опыту людей и используемым технологиям.", action: "Обучение для вашей команды" },
    { id: "ai-automatizace", title: "AI и автоматизация", text: "Ручной ввод данных, поиск информации, повторяющиеся задачи. Подберём подход и проверим его на конкретной задаче.", action: "AI в повседневной работе" },
    { id: "software", title: "Разработка на заказ", text: "Таблиц и готовых инструментов уже недостаточно. Создадим приложение, внутреннюю систему или связь между вашими инструментами.", action: "Разработка под ваши задачи" },
  ] },
  ai: { eyebrow: "Практическое применение и проверяемый результат", title: "AI и автоматизация", intro: "От консультации и выбора полезных задач до собственного инструмента и его интеграции. Оценим ожидаемую пользу, качество данных и затраты. Если достаточно обычной автоматизации, добавлять AI не нужно.", output: "В зависимости от задачи подготовим рекомендации и план внедрения AI, проверим выбранный сценарий в пилоте или создадим AI-инструмент и интеграцию. Согласуем критерии оценки и обучение сотрудников, которые будут пользоваться решением.", cases: [
    { title: "Данные из документов вводятся вручную", text: "Извлечение данных из заказов, форм и других документов. Результат можно отправить на проверку перед записью в вашу систему." },
    { title: "Информация находится в разных местах", text: "Внутренний ассистент по выбранной документации, поиск знаний и ответы со ссылками на источники. Перечень источников и права доступа определим вместе." },
    { title: "Инструменты не обмениваются данными", text: "Связь приложений через API, автоматические отчёты, обработка запросов и последующие действия. Меньше повторяющегося копирования между системами." },
  ], workflow: { title: "Пример: от полученного заказа к записи в системе", steps: ["Входящий документ", "AI извлекает данные", "Человек проверяет", "Запись в систему"], note: "Иллюстративный процесс, не кейс клиента. Автоматизацию, обработку ошибок и согласование настроим под конкретный процесс." }, private: { title: "Частный / внутренний AI", intro: "Ассистент компании может искать по документации, работать с выбранными внутренними данными и подключаться к существующим системам. Внутренний инструмент не означает автоматически, что данные не покидают компанию.", items: [
    { title: "Источники и права доступа", text: "Определим доступные ассистенту материалы и кто вправе видеть конкретные ответы. Спроектируем интеграцию с управлением доступом." },
    { title: "Подходящее размещение", text: "Оценим внешнюю службу, частную среду или вашу инфраструктуру. Выбор зависит от чувствительности данных, условий поставщика, затрат и возможностей сопровождения." },
    { title: "Проверка до внедрения", text: "На согласованных задачах проверим качество ответов, работу с источниками и права доступа. Определим обновление материалов, ответственность за эксплуатацию и ограничения решения." },
  ] } },
  training: { title: "Обучение сотрудников", intro: "Практический семинар или серия занятий для конкретной команды. Начнём с её опыта, инструментов и рабочих задач, затем составим программу, темп и упражнения.", includes: "Что может входить в обучение", items: [
    "Программирование и данные: Python, веб-разработка, базы данных и SQL или другие технологии вашей команды.",
    "AI в работе: выбор инструментов, постановка задач, проверка результатов и правила обращения с данными.",
    "Разработка с AI: написание кода, подготовка тестов и проверка предложений в контексте вашего проекта.",
  ], output: "Обучение по согласованной программе, практические задания и материалы для дальнейшей работы. Формат, объём и размер группы подтвердим заранее." },
  software: { title: "Разработка на заказ", intro: "Начинаем с того, как работает компания и что её не устраивает. Вместе уточняем требования, проектируем техническое решение и делим разработку на проверяемые этапы.", includes: "Что мы можем создать", items: [
    "Веб-приложения и порталы для клиентов, партнёров или сотрудников.",
    "Внутренние системы и инструменты для учёта, согласований, отчётности и других рабочих процессов.",
    "Интеграции систем, API и приложения с AI там, где он решает конкретную задачу.",
  ], output: "Протестированное решение в согласованном объёме, документация и передача команде. Хостинг, сопровождение и дальнейшее развитие согласуем по необходимости." },
  outputLabel: "Что вы получите",
  process: { title: "Как проходит сотрудничество", intro: "Можно заказать отдельную консультацию или анализ, обучение команды, пилот, разработку и интеграцию решения. Начинаем с объёма, подходящего вашей ситуации.", steps: [
    { title: "Обсудим проблему", text: "Вы опишете текущий процесс, его участников и желаемые улучшения. Уточним инструменты, данные, ограничения и ожидаемый результат." },
    { title: "Согласуем объём и цену", text: "Определим результат, критерии проверки, сроки и стоимость. Если нужен пилот, отдельно согласуем его объём и решение о продолжении." },
    { title: "Реализуем и передадим", text: "По ходу работы проверяем результат с вашей командой. Передача включает объяснение использования и документацию; дальнейшую поддержку согласуем отдельно." },
  ], note: "Цена зависит от объёма обучения или проекта, сложности интеграций и требований к эксплуатации. До начала работ подтвердим предложение, включая возможные лицензии и эксплуатационные расходы." },
  team: { title: "Опытная команда разработчиков", intro: "Наш опыт охватывает веб-приложения, backend-системы, работу с данными и автоматизацию. Понятно объясняем технические решения и проектируем их с учётом повседневной работы вашей команды." },
  faq: { eyebrow: "", title: "Вопросы перед началом", intro: "", items: [
    { question: "Нужно ли техническое задание?", answer: "Нет. Опишите проблему и текущий способ работы. Поможем уточнить требования, варианты и ограничения. Если нужен подробный анализ, сначала согласуем его объём и стоимость." },
    { question: "Можно начать с обучения или небольшой задачи?", answer: "Да. Обучение, консультации и пилот могут быть самостоятельным заказом. Не нужно заказывать весь проект. После оценки результата вы решите, продолжать ли работу и как." },
    { question: "Можно подключиться к нашим системам?", answer: "Да, интеграции входят в предложение. Сначала проверим доступные интерфейсы, права, качество данных и ограничения поставщика. Затем подтвердим реализуемость и объём подключения." },
    { question: "Данные обязательно передавать в публичный AI-сервис?", answer: "Не каждому решению он нужен. Оценим варианты размещения с учётом ваших требований, включая частную среду или вашу инфраструктуру. Потоки данных, доступ и условия поставщиков проясним до обработки данных компании. Название внутренний AI само по себе не гарантирует конфиденциальность." },
  ] },
  enquiry: { title: "Какую задачу нужно решить?", intro: "Расскажите, что отнимает время, каких навыков не хватает команде или какой инструмент нужен. Знать техническое решение заранее не обязательно.", formTitle: "Запрос от компании без обязательств", direct: "Можно связаться и напрямую", note: "Первый шаг без обязательств. Объём и стоимость подтвердим до начала работ.", close: "Закрыть запрос от компании" },
}

const businessCopy: Record<Language, BusinessCopy> = { cs, en, ru }

export function getBusinessCopy(lang: Language): BusinessCopy {
  return businessCopy[lang]
}