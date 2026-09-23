/**
 * Privacy policy content for every supported language.
 *
 * Translations of the Czech source text, with the recipients and cookie
 * sections describing the processors this codebase actually contacts
 * (Google, Vercel and the transactional email provider). Factual details —
 * legal entity, identifiers, contact points, retention periods, legal bases —
 * are identical across languages by design.
 *
 * @module app/[lang]/gdpr/policy-content
 */

import type { Language } from "@/i18n/config"

export interface PolicyItem {
  /** Rendered in bold ahead of the text, matching the source document. */
  lead?: string
  text?: string
  /** Rendered as a highlighted block, used for the contact details. */
  lines?: string[]
}

export type PolicyBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: PolicyItem[] }
  | { kind: "note"; lead?: string; text: string }

export interface PolicyChapter {
  number: string
  title: string
  blocks: PolicyBlock[]
}

export interface PolicyDocument {
  eyebrow: string
  title: string
  lead: string
  tableOfContents: string
  effective: string
  chapters: PolicyChapter[]
}

const CONTROLLER = "eXpansePi s.r.o"
const REGISTRATION = "19145535"
const ADDRESS = "Rybná 716/24, Staré Město, 110 00 Praha"
const EMAIL = "info@expansepi.com"
const PHONE = "+420 775 715 700"

const cs: PolicyDocument = {
  eyebrow: "GDPR / eXpansePi",
  title: "Zásady ochrany osobních údajů",
  lead: "Vaše soukromí je pro nás důležité. Zde najdete přehledné informace o tom, jak nakládáme s vašimi daty.",
  tableOfContents: "Obsah dokumentu",
  effective: "Tyto podmínky nabývají účinnosti dnem 6. 3. 2026.",
  chapters: [
    {
      number: "I.",
      title: "Základní ustanovení",
      blocks: [
        {
          kind: "list",
          items: [
            { lead: "Správcem osobních údajů", text: ` podle čl. 4 bod 7 nařízení Evropského parlamentu a Rady (EU) 2016/679 (GDPR) je ${CONTROLLER}, IČ ${REGISTRATION}, se sídlem ${ADDRESS} (dále jen: „správce“).` },
            { lead: "Kontaktní údaje správce:", lines: [`Adresa: ${ADDRESS}`, `Email: ${EMAIL}`, `Telefon: ${PHONE}`] },
            { text: "Osobními údaji se rozumí veškeré informace o identifikované nebo identifikovatelné fyzické osobě." },
            { text: "Správce nejmenoval pověřence pro ochranu osobních údajů." },
          ],
        },
      ],
    },
    {
      number: "II.",
      title: "Zdroje a kategorie zpracovávaných osobních údajů",
      blocks: [
        {
          kind: "list",
          items: [
            { text: "Správce zpracovává osobní údaje, které jste mu poskytl/a nebo osobní údaje, které správce získal na základě plnění Vaší objednávky." },
            { text: "Správce zpracovává Vaše identifikační a kontaktní údaje a údaje nezbytné pro plnění smlouvy." },
            { lead: "Kontaktní formulář:", text: " při odeslání nezávazné poptávky zpracováváme jméno, e-mail, nepovinné telefonní číslo a text zprávy. Tyto údaje slouží výhradně k vyřízení Vašeho dotazu." },
          ],
        },
      ],
    },
    {
      number: "III.",
      title: "Zákonný důvod a účel",
      blocks: [
        { kind: "paragraph", text: "Zákonným důvodem zpracování je:" },
        {
          kind: "list",
          items: [
            { text: "Plnění smlouvy mezi Vámi a správcem." },
            { text: "Plnění zákonných povinností vyplývajících z předpisů upravujících akreditace (zákon č. 563/2004 Sb. a vyhláška č. 176/2009 Sb.)." },
            { text: "Oprávněný zájem správce na poskytování přímého marketingu." },
            { text: "Váš souhlas v případě analytických a reklamních cookies a souvisejících nástrojů." },
          ],
        },
        { kind: "paragraph", text: "Účelem zpracování je:" },
        {
          kind: "list",
          items: [
            { text: "Vyřízení Vaší objednávky a výkon práv ze smluvního vztahu. Bez nutných údajů není možné smlouvu uzavřít." },
            { text: "Zasílání obchodních sdělení a další marketingové aktivity." },
            { text: "Měření návštěvnosti a účinnosti reklamy, pokud jste k tomu udělil/a souhlas." },
          ],
        },
        { kind: "note", text: "Ze strany správce nedochází k automatickému individuálnímu rozhodování ve smyslu čl. 22 GDPR." },
      ],
    },
    {
      number: "IV.",
      title: "Doba uchovávání údajů",
      blocks: [
        {
          kind: "list",
          items: [
            { text: "Správce uchovává osobní údaje po dobu nezbytnou k výkonu práv a povinností ze smluvního vztahu (po dobu 10 let z důvodu zákonné archivační povinnosti u akreditovaných kurzů)." },
            { text: "Údaje pro marketingové účely jsou uchovávány nejdéle 3 roky nebo do odvolání souhlasu. Po uplynutí doby správce údaje vymaže." },
            { text: "Váš záznam o souhlasu s cookies je uložen ve Vašem prohlížeči po dobu 12 měsíců; poté se Vás zeptáme znovu." },
          ],
        },
      ],
    },
    {
      number: "V.",
      title: "Příjemci osobních údajů",
      blocks: [
        {
          kind: "list",
          items: [
            { text: "Osoby podílející se na dodání služeb a realizaci plateb na základě smlouvy." },
            { text: "Osoby zajišťující provoz technických služeb a marketingové služby." },
            { lead: "Ministerstvo školství, mládeže a tělovýchovy (MŠMT) a Úřad práce ČR", text: " (administrace a kontrola rekvalifikací)." },
            { lead: "Vercel Inc.", text: " – provozovatel hostingu tohoto webu. Zpracovává technické údaje nezbytné pro doručení stránky (IP adresa, typ prohlížeče) a po udělení souhlasu také anonymní statistiku návštěvnosti bez cookies." },
            { lead: "Google Ireland Ltd. / Google LLC", text: " – měření návštěvnosti a účinnosti reklamy. Načítá se výhradně po udělení souhlasu." },
            { lead: "Poskytovatel e-mailových služeb", text: " – doručení zprávy z kontaktního formuláře do naší schránky." },
          ],
        },
        { kind: "note", lead: "Předávání do třetích zemí:", text: " V souvislosti s využíváním služeb společností Google a Vercel dochází k předávání do USA, zabezpečeno na základě rozhodnutí o odpovídající ochraně (Data Privacy Framework)." },
      ],
    },
    {
      number: "VI.",
      title: "Cookies a nástroje třetích stran",
      blocks: [
        {
          kind: "list",
          items: [
            { lead: "Nezbytné cookies:", text: " web nepoužívá žádné reklamní ani analytické cookies, dokud nevyjádříte souhlas. Vaše rozhodnutí o souhlasu ukládáme do úložiště prohlížeče (localStorage), nikoli do cookie, a neodesíláme je na server." },
            { lead: "Analytické a reklamní cookies:", text: " po udělení souhlasu načítáme Google Ads (gtag.js) a anonymní měření návštěvnosti Vercel. Před udělením souhlasu se tyto nástroje vůbec nenačtou a neproběhne žádný požadavek na jejich servery." },
            { lead: "Rozšířené konverze:", text: " odešlete-li po udělení souhlasu přihlášku ke kurzu, předáváme společnosti Google Vaši e-mailovou adresu a telefonní číslo v nevratně zašifrované podobě (otisk SHA-256), aby bylo možné přiřadit konverzi k reklamě. Nepředáváme je v čitelné podobě." },
            { lead: "Odvolání souhlasu:", text: " souhlas můžete kdykoli změnit odkazem „Nastavení cookies“ v patičce webu. Odvoláním souhlasu se nástroje přestanou načítat a již vytvořené cookies Google odstraníme." },
          ],
        },
      ],
    },
    {
      number: "VII.",
      title: "Vaše práva",
      blocks: [
        {
          kind: "list",
          items: [
            { text: "Právo na přístup, opravu, omezení zpracování, výmaz, přenositelnost a právo vznést námitku." },
            { text: "Právo odvolat souhlas písemně nebo elektronicky na adresu správce." },
            { text: "Právo podat stížnost u Úřadu pro ochranu osobních údajů." },
          ],
        },
      ],
    },
    {
      number: "VIII.",
      title: "Zabezpečení údajů",
      blocks: [
        {
          kind: "list",
          items: [
            { text: "Správce přijal veškerá technická a organizační opatření (šifrování, hesla) k zabezpečení úložišť dat." },
            { text: "Veškerá komunikace s tímto webem probíhá výhradně šifrovaně (HTTPS)." },
            { text: "Nezpracováváme osobní údaje v listinné podobě." },
            { text: "Přístup mají pouze pověřené osoby." },
          ],
        },
      ],
    },
    {
      number: "IX.",
      title: "Závěrečná ustanovení",
      blocks: [
        {
          kind: "list",
          items: [
            { text: "Odesláním objednávky potvrzujete, že jste seznámen/a s těmito podmínkami a přijímáte je." },
            { text: "Souhlasíte s nimi zaškrtnutím souhlasu ve formuláři (či odesláním)." },
            { text: "Správce je oprávněn tyto podmínky měnit a nové verze zveřejnit na webu." },
          ],
        },
      ],
    },
  ],
}

const en: PolicyDocument = {
  eyebrow: "GDPR / eXpansePi",
  title: "Privacy policy",
  lead: "Your privacy matters to us. This page explains clearly how we handle your data.",
  tableOfContents: "Contents",
  effective: "These terms take effect on 6 March 2026.",
  chapters: [
    {
      number: "I.",
      title: "General provisions",
      blocks: [
        {
          kind: "list",
          items: [
            { lead: "The data controller", text: ` under Article 4(7) of Regulation (EU) 2016/679 of the European Parliament and of the Council (GDPR) is ${CONTROLLER}, company ID ${REGISTRATION}, registered office ${ADDRESS}, Czech Republic (the “controller”).` },
            { lead: "Controller contact details:", lines: [`Address: ${ADDRESS}, Czech Republic`, `Email: ${EMAIL}`, `Phone: ${PHONE}`] },
            { text: "Personal data means any information relating to an identified or identifiable natural person." },
            { text: "The controller has not appointed a data protection officer." },
          ],
        },
      ],
    },
    {
      number: "II.",
      title: "Sources and categories of personal data processed",
      blocks: [
        {
          kind: "list",
          items: [
            { text: "The controller processes the personal data you have provided, or personal data obtained in order to fulfil your order." },
            { text: "The controller processes your identification and contact details and the data necessary to perform the contract." },
            { lead: "Contact form:", text: " when you send a non-binding enquiry we process your name, email address, optional phone number and the text of your message. This data is used solely to answer your enquiry." },
          ],
        },
      ],
    },
    {
      number: "III.",
      title: "Legal basis and purpose",
      blocks: [
        { kind: "paragraph", text: "The legal basis for processing is:" },
        {
          kind: "list",
          items: [
            { text: "Performance of the contract between you and the controller." },
            { text: "Compliance with legal obligations arising from the rules governing accreditation (Act No. 563/2004 Coll. and Decree No. 176/2009 Coll.)." },
            { text: "The controller's legitimate interest in direct marketing." },
            { text: "Your consent, in the case of analytics and advertising cookies and related tools." },
          ],
        },
        { kind: "paragraph", text: "The purpose of processing is:" },
        {
          kind: "list",
          items: [
            { text: "Handling your order and exercising rights arising from the contractual relationship. Without the necessary data the contract cannot be concluded." },
            { text: "Sending commercial communications and other marketing activities." },
            { text: "Measuring traffic and advertising effectiveness, where you have given consent." },
          ],
        },
        { kind: "note", text: "The controller does not carry out automated individual decision-making within the meaning of Article 22 GDPR." },
      ],
    },
    {
      number: "IV.",
      title: "Retention period",
      blocks: [
        {
          kind: "list",
          items: [
            { text: "The controller retains personal data for the period necessary to exercise rights and obligations arising from the contractual relationship (10 years, due to the statutory archiving obligation for accredited courses)." },
            { text: "Data processed for marketing purposes is retained for a maximum of 3 years or until consent is withdrawn. After that period the controller erases the data." },
            { text: "Your cookie consent record is stored in your browser for 12 months; after that we ask you again." },
          ],
        },
      ],
    },
    {
      number: "V.",
      title: "Recipients of personal data",
      blocks: [
        {
          kind: "list",
          items: [
            { text: "Parties involved in delivering services and processing payments under the contract." },
            { text: "Parties providing technical operations and marketing services." },
            { lead: "The Ministry of Education, Youth and Sports and the Czech Labour Office", text: " (administration and inspection of reskilling programmes)." },
            { lead: "Vercel Inc.", text: " – the hosting provider for this website. It processes the technical data required to deliver the page (IP address, browser type) and, once consent is given, cookieless aggregate traffic statistics." },
            { lead: "Google Ireland Ltd. / Google LLC", text: " – measurement of traffic and advertising effectiveness. Loaded only after consent is given." },
            { lead: "Email service provider", text: " – delivery of contact form messages to our mailbox." },
          ],
        },
        { kind: "note", lead: "Transfers to third countries:", text: " Using Google and Vercel services involves transfers to the USA, safeguarded by an adequacy decision (Data Privacy Framework)." },
      ],
    },
    {
      number: "VI.",
      title: "Cookies and third-party tools",
      blocks: [
        {
          kind: "list",
          items: [
            { lead: "Essential cookies:", text: " the site sets no advertising or analytics cookies until you give consent. Your consent decision is stored in your browser's local storage rather than in a cookie, and is never sent to our server." },
            { lead: "Analytics and advertising cookies:", text: " once consent is given we load Google Ads (gtag.js) and Vercel's cookieless traffic measurement. Before consent these tools are not loaded at all and no request is made to their servers." },
            { lead: "Enhanced conversions:", text: " if you submit a course application after giving consent, we send Google your email address and phone number in irreversibly hashed form (SHA-256) so that a conversion can be attributed to an advertisement. We do not send them in readable form." },
            { lead: "Withdrawing consent:", text: " you can change your choice at any time using the “Cookie settings” link in the site footer. Withdrawing consent stops the tools from loading and removes the Google cookies already created." },
          ],
        },
      ],
    },
    {
      number: "VII.",
      title: "Your rights",
      blocks: [
        {
          kind: "list",
          items: [
            { text: "The right of access, rectification, restriction of processing, erasure, portability, and the right to object." },
            { text: "The right to withdraw consent in writing or electronically to the controller's address." },
            { text: "The right to lodge a complaint with the Czech Office for Personal Data Protection." },
          ],
        },
      ],
    },
    {
      number: "VIII.",
      title: "Data security",
      blocks: [
        {
          kind: "list",
          items: [
            { text: "The controller has taken all technical and organisational measures (encryption, passwords) to secure its data stores." },
            { text: "All communication with this website is encrypted (HTTPS)." },
            { text: "We do not process personal data in paper form." },
            { text: "Access is limited to authorised persons." },
          ],
        },
      ],
    },
    {
      number: "IX.",
      title: "Final provisions",
      blocks: [
        {
          kind: "list",
          items: [
            { text: "By submitting an order you confirm that you are aware of these terms and accept them." },
            { text: "You agree to them by ticking the consent box in the form (or by submitting it)." },
            { text: "The controller is entitled to amend these terms and publish new versions on the website." },
          ],
        },
      ],
    },
  ],
}

const ru: PolicyDocument = {
  eyebrow: "GDPR / eXpansePi",
  title: "Политика конфиденциальности",
  lead: "Ваша конфиденциальность важна для нас. Здесь вы найдёте понятное описание того, как мы обращаемся с вашими данными.",
  tableOfContents: "Содержание документа",
  effective: "Настоящие условия вступают в силу 6 марта 2026 года.",
  chapters: [
    {
      number: "I.",
      title: "Общие положения",
      blocks: [
        {
          kind: "list",
          items: [
            { lead: "Администратором персональных данных", text: ` согласно ст. 4 п. 7 Регламента (ЕС) 2016/679 Европейского парламента и Совета (GDPR) является ${CONTROLLER}, ИНН ${REGISTRATION}, юридический адрес ${ADDRESS}, Чешская Республика (далее — «администратор»).` },
            { lead: "Контактные данные администратора:", lines: [`Адрес: ${ADDRESS}, Чешская Республика`, `E-mail: ${EMAIL}`, `Телефон: ${PHONE}`] },
            { text: "Под персональными данными понимается любая информация об идентифицированном или поддающемся идентификации физическом лице." },
            { text: "Администратор не назначал уполномоченного по защите персональных данных." },
          ],
        },
      ],
    },
    {
      number: "II.",
      title: "Источники и категории обрабатываемых персональных данных",
      blocks: [
        {
          kind: "list",
          items: [
            { text: "Администратор обрабатывает персональные данные, которые вы предоставили, либо данные, полученные в связи с выполнением вашего заказа." },
            { text: "Администратор обрабатывает ваши идентификационные и контактные данные, а также данные, необходимые для исполнения договора." },
            { lead: "Контактная форма:", text: " при отправке необязывающей заявки мы обрабатываем имя, адрес электронной почты, необязательный номер телефона и текст сообщения. Эти данные используются исключительно для ответа на ваш запрос." },
          ],
        },
      ],
    },
    {
      number: "III.",
      title: "Правовое основание и цель",
      blocks: [
        { kind: "paragraph", text: "Правовым основанием обработки является:" },
        {
          kind: "list",
          items: [
            { text: "Исполнение договора между вами и администратором." },
            { text: "Исполнение установленных законом обязанностей, вытекающих из норм об аккредитации (закон № 563/2004 Сб. и постановление № 176/2009 Сб.)." },
            { text: "Законный интерес администратора в прямом маркетинге." },
            { text: "Ваше согласие — в случае аналитических и рекламных cookie и связанных с ними инструментов." },
          ],
        },
        { kind: "paragraph", text: "Целью обработки является:" },
        {
          kind: "list",
          items: [
            { text: "Обработка вашего заказа и осуществление прав по договорным отношениям. Без необходимых данных заключение договора невозможно." },
            { text: "Рассылка коммерческих сообщений и иная маркетинговая деятельность." },
            { text: "Измерение посещаемости и эффективности рекламы при наличии вашего согласия." },
          ],
        },
        { kind: "note", text: "Администратор не осуществляет автоматизированное индивидуальное принятие решений в смысле ст. 22 GDPR." },
      ],
    },
    {
      number: "IV.",
      title: "Срок хранения данных",
      blocks: [
        {
          kind: "list",
          items: [
            { text: "Администратор хранит персональные данные в течение срока, необходимого для осуществления прав и обязанностей по договорным отношениям (10 лет в связи с установленной законом обязанностью архивирования для аккредитованных курсов)." },
            { text: "Данные для маркетинговых целей хранятся не более 3 лет или до отзыва согласия. По истечении срока администратор удаляет данные." },
            { text: "Запись о вашем согласии на cookie хранится в вашем браузере 12 месяцев; затем мы спросим вас снова." },
          ],
        },
      ],
    },
    {
      number: "V.",
      title: "Получатели персональных данных",
      blocks: [
        {
          kind: "list",
          items: [
            { text: "Лица, участвующие в предоставлении услуг и проведении платежей по договору." },
            { text: "Лица, обеспечивающие техническую эксплуатацию и маркетинговые услуги." },
            { lead: "Министерство образования, молодёжи и спорта ЧР и Управление труда ЧР", text: " (администрирование и контроль программ переподготовки)." },
            { lead: "Vercel Inc.", text: " — хостинг-провайдер этого сайта. Обрабатывает технические данные, необходимые для доставки страницы (IP-адрес, тип браузера), а после получения согласия — также анонимную статистику посещаемости без cookie." },
            { lead: "Google Ireland Ltd. / Google LLC", text: " — измерение посещаемости и эффективности рекламы. Загружается исключительно после получения согласия." },
            { lead: "Поставщик услуг электронной почты", text: " — доставка сообщений из контактной формы в наш почтовый ящик." },
          ],
        },
        { kind: "note", lead: "Передача в третьи страны:", text: " В связи с использованием служб Google и Vercel происходит передача данных в США, защищённая решением об адекватности (Data Privacy Framework)." },
      ],
    },
    {
      number: "VI.",
      title: "Cookie и инструменты третьих сторон",
      blocks: [
        {
          kind: "list",
          items: [
            { lead: "Необходимые cookie:", text: " сайт не использует рекламные или аналитические cookie до получения вашего согласия. Ваше решение сохраняется в локальном хранилище браузера (localStorage), а не в cookie, и не передаётся на наш сервер." },
            { lead: "Аналитические и рекламные cookie:", text: " после получения согласия мы загружаем Google Ads (gtag.js) и анонимное измерение посещаемости Vercel. До получения согласия эти инструменты вообще не загружаются и запросы к их серверам не отправляются." },
            { lead: "Расширенные конверсии:", text: " если после получения согласия вы отправите заявку на курс, мы передаём в Google ваш адрес электронной почты и номер телефона в необратимо зашифрованном виде (хеш SHA-256), чтобы сопоставить конверсию с рекламой. В читаемом виде они не передаются." },
            { lead: "Отзыв согласия:", text: " вы можете изменить своё решение в любой момент по ссылке «Настройки cookie» в нижнем колонтитуле сайта. После отзыва согласия инструменты перестают загружаться, а уже созданные cookie Google удаляются." },
          ],
        },
      ],
    },
    {
      number: "VII.",
      title: "Ваши права",
      blocks: [
        {
          kind: "list",
          items: [
            { text: "Право на доступ, исправление, ограничение обработки, удаление, переносимость данных и право на возражение." },
            { text: "Право отозвать согласие письменно или в электронной форме по адресу администратора." },
            { text: "Право подать жалобу в Управление по защите персональных данных ЧР." },
          ],
        },
      ],
    },
    {
      number: "VIII.",
      title: "Защита данных",
      blocks: [
        {
          kind: "list",
          items: [
            { text: "Администратор принял все технические и организационные меры (шифрование, пароли) для защиты хранилищ данных." },
            { text: "Всё взаимодействие с этим сайтом происходит в зашифрованном виде (HTTPS)." },
            { text: "Мы не обрабатываем персональные данные в бумажном виде." },
            { text: "Доступ имеют только уполномоченные лица." },
          ],
        },
      ],
    },
    {
      number: "IX.",
      title: "Заключительные положения",
      blocks: [
        {
          kind: "list",
          items: [
            { text: "Отправляя заказ, вы подтверждаете, что ознакомлены с настоящими условиями и принимаете их." },
            { text: "Вы соглашаетесь с ними, отметив согласие в форме (или отправив её)." },
            { text: "Администратор вправе изменять настоящие условия и публиковать новые версии на сайте." },
          ],
        },
      ],
    },
  ],
}

const documents: Record<Language, PolicyDocument> = { cs, en, ru }

export function getPolicyDocument(lang: Language): PolicyDocument {
  return documents[lang]
}
