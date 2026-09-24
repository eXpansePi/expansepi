import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { createRequire } from "node:module"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import Markdown from "react-markdown"
import ts from "typescript"
import { test } from "node:test"
import { getUpcomingSessions, formatCourseDate } from "../lib/course-schedule.ts"
import { getCourseSchema, getBlogPostingSchema } from "../lib/seo.ts"

const courses = JSON.parse(readFileSync(new URL("../data/courses.json", import.meta.url), "utf8"))
const course = courses[0]

const require = createRequire(import.meta.url)
const root = fileURLToPath(new URL("../", import.meta.url))

function sourceLoader(overrides = {}) {
  const modules = new Map()
  function load(filename) {
    const resolved = [filename, `${filename}.ts`, `${filename}.tsx`, `${filename}.json`].find(path => existsSync(path))
    assert.ok(resolved, `Module exists: ${filename}`)
    if (modules.has(resolved)) return modules.get(resolved).exports
    if (resolved.endsWith(".json")) return JSON.parse(readFileSync(resolved, "utf8"))
    const loadedModule = { exports: {} }
    modules.set(resolved, loadedModule)
    const output = ts.transpileModule(readFileSync(resolved, "utf8"), { compilerOptions: { target: ts.ScriptTarget.ES2017, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText
    const localRequire = specifier => {
      if (specifier in overrides) return overrides[specifier]
      if (specifier === "next/link") return { __esModule: true, default: props => React.createElement("a", props) }
      if (specifier === "next/image") return { __esModule: true, default: props => React.createElement("img", props) }
      if (specifier === "next/navigation") return { usePathname: () => "/en" }
      if (specifier.startsWith("@/")) return load(resolve(root, specifier.slice(2)))
      if (specifier.startsWith(".")) return load(resolve(dirname(resolved), specifier))
      return require(specifier)
    }
    new Function("require", "module", "exports", output)(localRequire, loadedModule, loadedModule.exports)
    return loadedModule.exports
  }
  return path => load(resolve(root, path))
}

test("business routes preserve one localized destination across language switches", async () => {
  const load = sourceLoader()
  const { getRoutePath, getPublicPath, getInternalRoute, getAllRoutePaths } = load("lib/routes.ts")
  const paths = { cs: "/cs/pro-firmy", en: "/en/for-business", ru: "/ru/dlya-kompaniy" }
  assert.deepEqual(getAllRoutePaths("business"), paths)
  for (const [lang, path] of Object.entries(paths)) {
    assert.equal(getRoutePath(lang, "business"), path)
    assert.equal(getInternalRoute(path.split("/")[2]), "business")
    for (const source of Object.values(paths)) assert.equal(getPublicPath(source, lang), path)
    assert.equal(getPublicPath("/cs/pro-firmy", lang), path)
  }
  const rewrites = await load("next.config.ts").default.rewrites()
  for (const lang of ["en", "ru"]) {
    assert.ok(rewrites.some(route => route.source === paths[lang] && route.destination === `/${lang}/pro-firmy`))
  }
})

test("only cohorts that have not started are offered", () => {
  const sessions = getUpcomingSessions(course.sessions, new Date("2026-09-12T12:00:00Z"))
  assert.deepEqual(sessions, [{ start: "2026-10-03", end: "2027-01-30" }])
})

test("business enquiries reuse the form without course-only fields or commitments", () => {
  const EnquiryForm = sourceLoader()("app/[lang]/components/EnquiryForm.tsx").default
  for (const lang of ["cs", "en", "ru"]) {
    const business = renderToStaticMarkup(React.createElement(EnquiryForm, { lang, intent: "business" }))
    assert.match(business, /name="service"/)
    assert.match(business, /name="company"/)
    assert.match(business, /value="private-ai"/)
    assert.match(business, /aria-describedby=/)
    assert.equal((business.match(/required=""/g) || []).length, 2)
    assert.doesNotMatch(business, /name="course"|name="intent"/)
    const courseForm = renderToStaticMarkup(React.createElement(EnquiryForm, { lang, courseTitle: "Example course" }))
    assert.doesNotMatch(courseForm, /name="service"|name="company"|name="intent"/)
    const contact = renderToStaticMarkup(React.createElement(EnquiryForm, { lang, allowIntentSelection: true }))
    assert.equal((contact.match(/type="radio"/g) || []).length, 2)
    assert.match(contact, /name="course"/)
  }
})

test("business pages expose services, a collective team introduction and one shared enquiry dialog", async () => {
  const load = sourceLoader()
  const { default: BusinessPage, generateMetadata } = load("app/[lang]/pro-firmy/page.tsx")
  const { getBusinessCopy } = load("i18n/business.ts")
  const { getRoutePath } = load("lib/routes.ts")
  for (const lang of ["cs", "en", "ru"]) {
    const params = Promise.resolve({ lang })
    const copy = getBusinessCopy(lang)
    const html = renderToStaticMarkup(await BusinessPage({ params }))
    assert.equal((html.match(/<h1\b/g) || []).length, 1)
    assert.ok(html.includes(copy.hero.note))
    for (const id of ["skoleni", "ai-automatizace", "software", "privatni-ai", "spoluprace", "poptavka"]) assert.ok(html.includes(`id="${id}"`))
    assert.doesNotMatch(html, /<form\b|person-card|team-credentials|Ali Czech|Vlad Karpenko|Rapid7|Grant Thornton|Azul Systems/)
    assert.equal((html.match(/class="application-dialog"/g) || []).length, 1)
    const dialogControls = [...html.matchAll(/aria-haspopup="dialog" aria-controls="([^"]+)"/g)].map(match => match[1])
    assert.equal(dialogControls.length, 8)
    assert.equal(new Set(dialogControls).size, 1)
    assert.match(html, /OfferCatalog/)
    assert.ok(html.includes(renderToStaticMarkup(copy.team.intro)))
    assert.ok(html.includes(copy.ai.workflow.note))
    assert.doesNotMatch(html, /name="course"|href="[^"]*#prihlaska"/)
    const metadata = await generateMetadata({ params })
    assert.ok(metadata.alternates.canonical.endsWith(getRoutePath(lang, "business")))
    assert.equal(metadata.description, copy.meta.description)
    assert.equal(Object.keys(metadata.alternates.languages).length, 4)
  }
})

test("course and business dialogs reuse the form with the correct enquiry intent", () => {
  const load = sourceLoader()
  const EnquiryDialog = load("app/[lang]/components/EnquiryDialog.tsx").default
  const ApplyModal = load("app/[lang]/kurzy/[slug]/components/ApplyModal.tsx").default
  const { getBusinessCopy } = load("i18n/business.ts")
  for (const lang of ["cs", "en", "ru"]) {
    const copy = getBusinessCopy(lang)
    const business = renderToStaticMarkup(React.createElement(EnquiryDialog, { lang, title: copy.enquiry.formTitle, intro: copy.hero.note, closeLabel: copy.enquiry.close, intent: "business", isOpen: true, onClose() {} }))
    assert.match(business, /name="service"/)
    assert.match(business, /name="company"/)
    assert.ok(business.includes(copy.enquiry.close))
    const courseDialog = renderToStaticMarkup(React.createElement(ApplyModal, { lang, courseTitle: "Example course", isOpen: true, onClose() {} }))
    assert.match(courseDialog, /Example course/)
    assert.doesNotMatch(courseDialog, /name="service"|name="company"/)
  }
})

test("business submissions retain context within API limits and never track course conversions", async context => {
  const requests = []
  const conversions = []
  const values = new FormData()
  values.set("name", "QA Example")
  values.set("email", "qa@example.test")
  values.set("company", "C".repeat(160))
  values.set("message", "M".repeat(4600))
  values.set("service", "private-ai")
  context.mock.method(globalThis, "FormData", function () { return values })
  const load = sourceLoader({
    react: { ...React, useState: initial => [initial, () => {}], useId: () => "test-form", useRef: () => ({ current: null }), useEffect: () => {} },
    "@/lib/form-utils": {
      fetchWithTimeout: async (url, options) => {
        assert.equal(url, "/api/contact")
        requests.push(JSON.parse(options.body))
        return { ok: true, json: async () => ({ success: true }) }
      },
      trackApplicationConversion: async (...args) => { conversions.push(args) },
    },
  })
  const EnquiryForm = load("app/[lang]/components/EnquiryForm.tsx").default
  const event = { preventDefault() {}, currentTarget: {} }
  for (const lang of ["cs", "en", "ru"]) {
    await EnquiryForm({ lang, intent: "business" }).props.onSubmit(event)
    const payload = requests.at(-1)
    assert.ok(payload.subject.length <= 200)
    assert.match(payload.subject, /AI/)
    assert.ok(payload.message.includes(values.get("company")))
    assert.ok(payload.message.endsWith(values.get("message")))
    assert.ok(payload.message.length <= 5000)
  }
  assert.equal(conversions.length, 0)
  await EnquiryForm({ lang: "en", courseTitle: "Example course" }).props.onSubmit(event)
  assert.equal(requests.at(-1).subject, "Example course")
  assert.equal(conversions.length, 1)
})

test("business discovery joins navigation, homepage, footer and sitemap without replacing courses", async () => {
  const load = sourceLoader()
  const Home = load("app/[lang]/page.tsx").default
  const Navigation = load("app/[lang]/components/Navigation.tsx").default
  const Footer = load("app/[lang]/components/Footer.tsx").default
  const { getRoutePath } = load("lib/routes.ts")
  const { getTranslations } = load("i18n/index.ts")
  const entries = load("app/sitemap.ts").default()
  for (const lang of ["cs", "en", "ru"]) {
    const businessPath = getRoutePath(lang, "business")
    const coursePath = getRoutePath(lang, "courses")
    const navigation = renderToStaticMarkup(React.createElement(Navigation, { lang, t: getTranslations(lang) }))
    assert.equal(navigation.split(`href="${businessPath}"`).length - 1, 2)
    assert.equal(navigation.split(`href="${getRoutePath(lang, "contact")}"`).length - 1, 2)
    assert.doesNotMatch(navigation, /#otazky/)
    assert.ok(navigation.includes(`href="${coursePath}#nabidka"`))
    const home = renderToStaticMarkup(await Home({ params: Promise.resolve({ lang }) }))
    assert.match(home, /id="pro-firmy"/)
    assert.match(home, /id="kurzy"/)
    assert.ok(home.includes(`href="${businessPath}"`))
    const footer = renderToStaticMarkup(React.createElement(Footer, { lang }))
    assert.ok(footer.includes(`href="${businessPath}"`))
    assert.equal(entries.filter(entry => entry.url.endsWith(businessPath)).length, 1)
  }
})

test("expired and missing schedules have an honest empty state", () => {
  assert.deepEqual(getUpcomingSessions(course.sessions, new Date("2027-02-01")), [])
  assert.deepEqual(getUpcomingSessions(undefined), [])
})

test("cohort availability respects the Prague calendar day", () => {
  assert.equal(getUpcomingSessions(course.sessions, new Date("2026-10-03T21:59:59Z")).length, 1)
  assert.equal(getUpcomingSessions(course.sessions, new Date("2026-10-03T22:00:00Z")).length, 0)
})

test("invalid dates are rejected and source ordering is not mutated", () => {
  const sessions = [
    { start: "2026-10-03", end: "2027-01-30" },
    { start: "2026-09-05", end: "2026-12-26" },
    { start: "2026-02-30", end: "2026-03-30" },
    { start: "2026-09-07", end: "2026-09-01" },
  ]
  const before = structuredClone(sessions)
  assert.equal(getUpcomingSessions(sessions, new Date("2026-01-01"))[0].start, "2026-09-05")
  assert.equal(getUpcomingSessions(sessions, new Date("2026-01-01")).length, 2)
  assert.deepEqual(sessions, before)
})

test("dates are localized and the confirmed price is preserved", () => {
  for (const lang of ["cs", "en", "ru"]) {
    assert.match(formatCourseDate("2026-10-03", lang), /2026/)
    assert.match(course.languages[lang].funding, /schválení|approval|одобрения/)
  }
  assert.equal(course.price, 49900)
})

test("the confirmed course price agrees across rendered copy and schema", () => {
  const load = sourceLoader()
  const { getCourseBySlug } = load("data/courses.ts")
  const { CoursePrice } = load("app/[lang]/components/CourseSections.tsx")
  for (const lang of ["cs", "en", "ru"]) {
    const published = getCourseBySlug(course.slug, lang)
    const html = renderToStaticMarkup(React.createElement(CoursePrice, { course: published, lang }))
    const formatted = new Intl.NumberFormat(lang, { style: "currency", currency: "CZK", maximumFractionDigits: 0 }).format(49900)
    assert.ok(html.includes(formatted), `Localized price is visible in ${lang}`)
    assert.equal(getCourseSchema(published, lang, "https://example.test/course").offers.price, 49900)
  }
})

test("software licences are explicit course benefits with real assets", () => {
  const load = sourceLoader()
  const { getAllCourses, getCourseBySlug } = load("data/courses.ts")
  const Promo = load("app/[lang]/kurzy/[slug]/components/PyCharmPromo.tsx").default
  for (const lang of ["cs", "en", "ru"]) {
    const license = getCourseBySlug(course.slug, lang).softwareLicense
    assert.equal(license.product, "PyCharm Professional")
    assert.equal(license.months, 6)
    assert.ok(existsSync(resolve(root, "public", license.logo.slice(1))))
    const html = renderToStaticMarkup(React.createElement(Promo, { lang, license }))
    assert.match(html, /PyCharm Professional/)
    assert.match(html, /zdarma|free|бесплатно/)
    assert.doesNotMatch(html, /50|Microsoft|Google/)
    assert.equal(renderToStaticMarkup(React.createElement(Promo, { lang })), "")
    assert.ok(getAllCourses(lang).filter(item => item.slug !== course.slug).every(item => item.softwareLicense === undefined))
  }
})

test("course schema does not turn possible funding into a free offer", () => {
  const input = { title: "Example", description: "Example course", slug: "example", funding: "Subject to approval", duration: "120 teaching hours" }
  const schema = getCourseSchema(input, "en", "https://example.test/en/courses/example")
  assert.equal(schema.offers, undefined)
  assert.equal(schema.timeRequired, undefined)
  assert.equal(schema.educationalCredentialAwarded, undefined)
  assert.equal(schema.educationalLevel, undefined)
  assert.equal(getCourseSchema({ ...input, price: 12000 }, "en", "https://example.test").offers.price, 12000)
  assert.equal(getCourseSchema({ ...input, price: 12000, status: "upcoming" }, "en", "https://example.test").offers, undefined)
})

const catalogFixture = ["C#", "Java", "JavaScript", "AI", "Data", "Web"].map((topic, index) => ({
  slug: `fixture-${index}`,
  title: `${topic} course`,
  description: `Practice with ${topic}.`,
  topics: [topic],
  status: "active",
  duration: `${20 + index} teaching hours`,
  form: `Format ${index}`,
  level: index % 2 ? "Pokročilí" : "Začátečníci",
  levelLabel: index % 2 ? "Advanced" : "Beginner",
  price: 20000 + index * 1000,
  sessions: [{ start: `2099-10-0${index + 1}`, end: "2099-12-31" }],
}))

test("six published courses render their own facts with no Python inheritance", () => {
  const { CourseGrid } = sourceLoader()("app/[lang]/kurzy/components/CourseCard.tsx")
  const html = renderToStaticMarkup(React.createElement(CourseGrid, { courses: catalogFixture, lang: "en" }))
  assert.equal((html.match(/data-course-slug=/g) || []).length, 6)
  assert.doesNotMatch(html, /course-grid-single|Django|120 teaching hours|MŠMT accreditation/)
  for (const fixture of catalogFixture) {
    assert.ok(html.includes(fixture.title))
    assert.ok(html.includes(fixture.duration))
    assert.ok(html.includes(fixture.form))
    assert.ok(html.includes(`/en/courses/${fixture.slug}`))
  }
  assert.match(html, /Advanced/)
})

test("a single course has its own layout and preparation cannot be enrolled", () => {
  const { CourseGrid } = sourceLoader()("app/[lang]/kurzy/components/CourseCard.tsx")
  const html = renderToStaticMarkup(React.createElement(CourseGrid, { courses: [{ ...catalogFixture[0], status: "upcoming" }], lang: "en" }))
  assert.match(html, /course-grid-single/)
  assert.match(html, /In development/)
  assert.doesNotMatch(html, /href=|Course price|2099/)
})

test("the homepage renders six courses and routes global CTAs to course choice", async () => {
  const load = sourceLoader({ "@/data/courses": { getActiveCourses: () => catalogFixture, getUpcomingCourses: () => [] } })
  const Home = load("app/[lang]/page.tsx").default
  const html = renderToStaticMarkup(await Home({ params: Promise.resolve({ lang: "en" }) }))
  assert.equal((html.match(/data-course-slug=/g) || []).length, 6)
  assert.match(html, /href="\/en\/courses#nabidka"/)
  assert.match(html, /Our partners/)
  assert.match(html, /alt="Microsoft"/)
  assert.match(html, /alt="JetBrains"/)
  assert.doesNotMatch(html, /programator-www-aplikaci-v-pythonu|120 teaching hours|Junior Python developer/)
})

test("section topics and compact application copy remain explicit in every language", () => {
  const load = sourceLoader()
  const { getSiteCopy } = load("i18n/site.ts")
  const { ApplicationSection, AudienceSection, SectionHeading } = load("app/[lang]/components/CourseSections.tsx")
  for (const lang of ["cs", "en", "ru"]) {
    const copy = getSiteCopy(lang)
    const application = renderToStaticMarkup(React.createElement(ApplicationSection, { lang }))
    assert.ok(application.includes(copy.catalog.choose))
    assert.ok(application.includes(copy.catalog.help))
    assert.doesNotMatch(application, /process-steps/)
    const audience = renderToStaticMarkup(React.createElement(AudienceSection, { copy: copy.audience }))
    assert.doesNotMatch(audience, /item-index/)
    const faq = renderToStaticMarkup(React.createElement(SectionHeading, copy.faq))
    assert.ok(faq.includes(copy.faq.title))
    assert.doesNotMatch(faq, /class="eyebrow"/)
  }
  assert.equal(getSiteCopy("cs").funding.title, "Financování kurzu")
  assert.equal(getSiteCopy("cs").homeFormat.title, "Jak probíhá výuka")
})

test("learning examples connect the same records across every technology", () => {
  const load = sourceLoader()
  const { getSiteCopy } = load("i18n/site.ts")
  const { getLearningExample, default: LearningJourney } = load("app/[lang]/components/LearningJourney.tsx")
  for (const lang of ["cs", "en", "ru"]) {
    const copy = getSiteCopy(lang).journey
    const markup = getLearningExample(copy, 0)
    assert.equal(copy.steps.length, 5)
    assert.equal(markup.books.length, 3)
    for (const book of markup.books) assert.ok(markup.files[0].code.includes(book.title))
    for (const stage of [1, 2, 3, 4]) {
      const example = getLearningExample(copy, stage)
      assert.deepEqual(example.books.map(book => book.id), [1, 3])
      assert.ok(example.files.every(file => file.name && file.code))
    }
    assert.equal(getLearningExample(copy, 4, false).books.length, 3)
    const html = renderToStaticMarkup(React.createElement(LearningJourney, { copy }))
    assert.match(html, /example-books|example-code/)
    assert.doesNotMatch(html, /task-form|view-toggle|my-first-project/)
  }
})

test("lecturer credentials follow JSON changes without inferring from biographies", () => {
  const fixture = {
    teamMembers: [],
    lecturers: [
      { id: "first", name: "First lecturer", title: "Engineer", universities: ["MFF UK", " MFF UK ", "", 7], currentEmployers: [" Microsoft ", "Microsoft", null], languages: { cs: { description: "Previously at Oracle." }, en: { description: "Previously at Oracle." }, ru: { description: "Previously at Oracle." } } },
      { id: "second", name: "Second lecturer", title: "Engineer", universities: ["ČVUT"], currentEmployers: ["Google", "Microsoft"], description: "Professional experience." },
      { id: "legacy", name: "Legacy lecturer", title: "Engineer\nUnverified employer", universities: null, currentEmployers: "Unverified employer", description: "A biography mentioning another company." },
    ],
  }
  const before = structuredClone(fixture)
  const load = sourceLoader({ "./team.json": fixture })
  const { getAllLecturers, getLecturerCredentials } = load("data/team.ts")
  const { TeamSection } = load("app/[lang]/components/CourseSections.tsx")
  for (const lang of ["cs", "en", "ru"]) {
    assert.deepEqual(getLecturerCredentials(lang), { universities: ["MFF UK", "ČVUT"], currentEmployers: ["Microsoft", "Google"] })
    const legacy = getAllLecturers(lang).find(person => person.id === "legacy")
    assert.deepEqual(legacy.universities, [])
    assert.deepEqual(legacy.currentEmployers, [])
    const overview = renderToStaticMarkup(React.createElement(TeamSection, { lang }))
    assert.equal((overview.match(/<li>Microsoft<\/li>/g) || []).length, 1)
    assert.match(overview, /<li>Google<\/li>/)
    assert.doesNotMatch(overview, /<li>Rapid7<\/li>|<li>Oracle<\/li>|<li>Unverified employer<\/li>/)
    const full = renderToStaticMarkup(React.createElement(TeamSection, { lang, full: true }))
    assert.match(full, /class="person-role">Engineer · Microsoft · MFF UK<\/p>/)
  }
  assert.deepEqual(fixture, before)
  const changed = structuredClone(fixture)
  changed.lecturers[0].currentEmployers = ["New employer"]
  changed.lecturers[1].currentEmployers = ["Google"]
  changed.lecturers[1].universities = ["Another university"]
  const updatedLoad = sourceLoader({ "./team.json": changed })
  const updated = updatedLoad("data/team.ts").getLecturerCredentials("en")
  assert.deepEqual(updated.currentEmployers, ["New employer", "Google"])
  assert.deepEqual(updated.universities, ["MFF UK", "Another university"])
  const updatedHtml = renderToStaticMarkup(React.createElement(updatedLoad("app/[lang]/components/CourseSections.tsx").TeamSection, { lang: "en", full: true }))
  assert.match(updatedHtml, /<li>New employer<\/li>/)
  assert.match(updatedHtml, /<li>Another university<\/li>/)
  assert.match(updatedHtml, /class="person-role">Engineer · New employer · MFF UK<\/p>/)
  assert.doesNotMatch(updatedHtml, /Microsoft|ČVUT/)
  const emptyLoad = sourceLoader({ "./team.json": { teamMembers: [], lecturers: [] } })
  assert.deepEqual(emptyLoad("data/team.ts").getLecturerCredentials(), { universities: [], currentEmployers: [] })
  assert.doesNotMatch(renderToStaticMarkup(React.createElement(emptyLoad("app/[lang]/components/CourseSections.tsx").TeamSection, { lang: "en" })), /team-credentials/)
  const singleLoad = sourceLoader({ "./team.json": { teamMembers: [], lecturers: [{ ...fixture.lecturers[1], universities: [] }] } })
  const singleHtml = renderToStaticMarkup(React.createElement(singleLoad("app/[lang]/components/CourseSections.tsx").TeamSection, { lang: "en" }))
  assert.equal((singleHtml.match(/class="team-credential"/g) || []).length, 1)
  assert.match(singleHtml, /<li>Google<\/li>/)
  assert.doesNotMatch(singleHtml, /University graduates/)
})

test("featured profiles use concise summaries without losing full biographies", () => {
  const load = sourceLoader()
  const { getAllLecturers } = load("data/team.ts")
  const { getSiteCopy } = load("i18n/site.ts")
  const { TeamSection } = load("app/[lang]/components/CourseSections.tsx")
  for (const lang of ["cs", "en", "ru"]) {
    const people = getAllLecturers(lang).filter(person => ["2", "5"].includes(person.id))
    const overview = renderToStaticMarkup(React.createElement(TeamSection, { lang }))
    const about = renderToStaticMarkup(React.createElement(TeamSection, { lang, full: true }))
    assert.ok(overview.includes(getSiteCopy(lang).team.all))
    for (const html of [overview, about]) {
      assert.equal(html.match(/<article[^>]*id="([^"]+)"/)?.[1], "lecturer-example-founder")
      const founder = html.match(/<article[^>]*id="lecturer-example-founder"[\s\S]*?<\/article>/)?.[0]
      assert.ok(founder)
      assert.doesNotMatch(founder, /person-skills|s vazbou|with a connection|связанный/)
      assert.ok(founder.includes(getSiteCopy(lang).team.founderNote))
    }
    for (const person of people) {
      assert.ok(person.summary.length < person.description.length)
      assert.ok(overview.includes(person.summary))
      assert.ok(about.includes(person.description))
    }
  }
})

test("normalization preserves missing details and planned AI is not published", () => {
  const data = sourceLoader()("data/courses.ts")
  for (const lang of ["cs", "en", "ru"]) {
    const ai = data.getCourseBySlug("umela-inteligence", lang)
    assert.equal(ai.status, "upcoming")
    assert.equal(ai.level, "Upřesníme")
    assert.equal(ai.price, undefined)
    assert.equal(ai.sessions, undefined)
    assert.equal(ai.experience, undefined)
  }
})

test("the sitemap lists published courses but not drafts or the retired home", () => {
  const entries = sourceLoader()("app/sitemap.ts").default()
  for (const entry of entries) {
    assert.doesNotMatch(entry.url, /\/(home|domu|glavnaya)$/)
    assert.doesNotMatch(entry.url, /\/umela-inteligence$/)
  }
  assert.ok(entries.some(entry => entry.url.endsWith("/cs/kurzy/programator-www-aplikaci-v-pythonu")))
})

test("design principles cover the system and remain linked from the guides", () => {
  const document = readFileSync(resolve(root, "design-principles.md"), "utf8")
  const headings = new Set()
  const references = []
  function inspectDocument() {
    return tree => {
      function text(node) {
        return node.value || node.children?.map(text).join("") || ""
      }
      function visit(node) {
        if (node.type === "heading" && node.depth === 2) headings.add(text(node))
        if (node.type === "link") references.push(node.url)
        for (const child of node.children || []) visit(child)
      }
      visit(tree)
    }
  }
  renderToStaticMarkup(React.createElement(Markdown, { remarkPlugins: [inspectDocument], skipHtml: true }, document))
  for (const heading of ["Authority", "Product And Brand", "Layout And Composition", "Typography", "Color", "Components", "Responsive Design", "Motion And Interaction", "Imagery", "Content And UX", "Accessibility", "Performance", "Page-Level Consistency", "Design Decision Rules", "Examples", "Required Review", "Implementation Map"]) {
    assert.ok(headings.has(heading), `Required design topic: ${heading}`)
  }
  for (const reference of references.filter(value => !/^(https?:|mailto:|#)/.test(value))) {
    assert.ok(existsSync(resolve(root, decodeURIComponent(reference.split("#")[0]))), `Design reference exists: ${reference}`)
  }
  for (const guide of ["README.md", "DEVELOPMENT.md"]) {
    assert.match(readFileSync(resolve(root, guide), "utf8"), /MUST.*design-principles\.md/)
  }
  assert.match(document, /MUST NOT/)
  assert.match(document, /SHOULD NOT/)
})

test("article source language is independent from the localized route", () => {
  const post = sourceLoader()("data/posts.ts").getPublishedPosts()[0]
  assert.equal(post.contentLanguage, "cs")
  const czechArticle = getBlogPostingSchema(post, "en")
  assert.equal(czechArticle.inLanguage, "cs-CZ")
  assert.match(czechArticle.mainEntityOfPage["@id"], /\/en\/blog\//)
  assert.equal(getBlogPostingSchema({ ...post, contentLanguage: "en" }, "ru").inLanguage, "en-US")
})