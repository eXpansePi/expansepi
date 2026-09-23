import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
import { getLecturerCredentials } from "../data/team"

const base = process.env.E2E_URL || "http://localhost:3000"
const widths = [320, 360, 375, 390, 430, 600, 768, 820, 900, 1024, 1100, 1152, 1200, 1280, 1440, 1600, 1920, 2200, 2560]
const pythonPath = "/cs/kurzy/programator-www-aplikaci-v-pythonu"

test.setTimeout(120000)
test.use({ browserName: process.env.E2E_BROWSER === "webkit" ? "webkit" : "chromium" })

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.addInitScript(() => {
    localStorage.setItem("cookie_consent", "denied")
    localStorage.setItem("cookie_consent_updated_at", new Date().toISOString())
  })
  await page.route("**/api/contact", route => route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ success: false }) }))
})

for (const [name, path] of [["home", "/cs"], ["catalog", "/cs/kurzy"], ["course", pythonPath], ["contact", "/cs/kontakt"], ["about", "/cs/o-nas"], ["blog", "/cs/blog"], ["article", "/cs/blog/zaciname-s-pythonem-prvni-kroky"], ["vacancies", "/cs/volne-pozice"], ["privacy", "/cs/gdpr"]]) {
  test(`${name}: responsive layout and accessible content`, async ({ page }, testInfo) => {
    const errors: string[] = []
    page.on("pageerror", error => errors.push(error.message))
    const response = await page.goto(`${base}${path}`)
    expect(response?.status()).toBe(200)
    await expect(page.locator("h1")).toHaveCount(1)
    await expect(page.locator("footer.site-footer")).toHaveCount(1)
    await page.evaluate(async () => { await document.fonts.ready })
    await page.locator(".site-footer").scrollIntoViewIfNeeded()
    await expect.poll(() => page.locator(".site-footer img").evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true)
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }))
    for (const width of widths) {
      await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 })
      await expect(page.locator(".site-header")).toHaveCSS("height", `${width < 768 ? 68 : width < 1024 ? 72 : 80}px`)
      const overflow = await page.evaluate(() => {
        const viewport = document.documentElement.clientWidth
        return Array.from(document.querySelectorAll("main *, header *, footer *"))
          .filter(element => {
            const bounds = element.getBoundingClientRect()
            const style = getComputedStyle(element)
            return bounds.width > 0 && bounds.height > 0 && style.position !== "absolute" && (bounds.right > viewport + 1 || bounds.left < -1)
          })
          .slice(0, 6).map(element => `${element.tagName}.${element.className}`)
      })
      expect(overflow, `${name} at ${width}px`).toEqual([])
      const dimensions = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: innerWidth, client: document.documentElement.clientWidth, overflow: Array.from(document.querySelectorAll("body *")).filter(element => element.getBoundingClientRect().width > 0 && element.getBoundingClientRect().right > innerWidth + 1).map(element => `${element.tagName}.${element.className}`).slice(0, 8) }))
      expect(dimensions.width, `${name} ${width}px: ${JSON.stringify(dimensions)}`).toBeLessThanOrEqual(dimensions.viewport + 1)
      const undersizedTargets = await page.locator(".wordmark, .icon-button, .button, .text-link, .desktop-nav a, .footer-links a, .footer-links button, .footer-contact a, .footer-tools a, .language-switcher summary, .course-local-nav a, .breadcrumbs a, .policy-toc a").evaluateAll(elements => elements.filter(element => {
        const bounds = element.getBoundingClientRect()
        return bounds.width > 0 && bounds.height > 0 && (bounds.width < 43.9 || bounds.height < 43.9)
      }).map(element => ({ text: element.textContent?.trim().slice(0, 50), width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height })))
      expect(undersizedTargets, `${name} target sizes at ${width}px`).toEqual([])
      if ([320, 768, 1024, 1280, 1440, 1920, 2560].includes(width)) {
        await page.screenshot({ path: testInfo.outputPath(`${name}-${width}.png`), fullPage: true, animations: "disabled" })
      }
    }
    await page.setViewportSize({ width: 390, height: 844 })
    const accessibility = await new AxeBuilder({ page }).exclude("nextjs-portal").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()
    expect(accessibility.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) }))).toEqual([])
    expect(errors).toEqual([])
  })
}

test("team credentials stay prominent and readable across languages and widths", async ({ page }, testInfo) => {
  for (const [lang, educationLabel, experienceLabel] of [
    ["cs", "Absolventi univerzit", "Praxe v mezinárodních firmách"],
    ["en", "University graduates", "Experience at international companies"],
    ["ru", "Выпускники университетов", "Опыт в международных компаниях"],
  ]) {
    await page.goto(`${base}/${lang}`)
    const aboutPath = await page.locator("#team .team-bottom a").getAttribute("href")
    const coursePath = await page.locator("#kurzy .catalog-card a").first().getAttribute("href")
    expect(aboutPath).toBeTruthy()
    expect(coursePath).toBeTruthy()
    for (const path of [`/${lang}`, aboutPath!, coursePath!]) {
      await page.goto(`${base}${path}`)
      await page.evaluate(async () => { await document.fonts.ready })
      const credentials = page.locator("#team .team-credentials")
      await expect(credentials.locator("dt")).toHaveText([educationLabel, experienceLabel])
      const expected = getLecturerCredentials(lang)
      await expect(credentials.locator(".team-credential-names li")).toHaveText([...expected.universities, ...expected.currentEmployers])
      await expect(credentials.locator(".team-credential-names li").first()).toHaveCSS("border-top-width", "1px")
      await expect(credentials.locator(".team-credential-names li").first()).toHaveCSS("background-color", "rgb(241, 244, 248)")
      await expect(page.locator("#team .team-bottom p")).toBeVisible()
      for (const width of [320, 360, 390, 430, 768, 900, 960, 1024, 1280, 1440, 1920, 2560]) {
        await page.setViewportSize({ width, height: 1000 })
        await expect(page.locator(".site-header")).toHaveCSS("height", `${width < 768 ? 68 : width < 1024 ? 72 : 80}px`)
        await expect(credentials.locator(".team-credential-names").first()).toHaveCSS("font-size", "28px")
        await expect(credentials.locator(".team-credential-detail").first()).toHaveCSS("font-size", `${width < 768 ? 15 : 16}px`)
        const layout = await credentials.evaluate(element => {
          const bounds = element.getBoundingClientRect()
          const groups = Array.from(element.children).map(group => ({
            top: group.getBoundingClientRect().top,
            bottom: group.getBoundingClientRect().bottom,
            tracks: ["dt", ".team-credential-names", ".team-credential-detail"].map(selector => group.querySelector(selector)!.getBoundingClientRect().top),
          }))
          const overflow = Array.from(element.querySelectorAll("*")).filter(child => {
            const childBounds = child.getBoundingClientRect()
            return childBounds.left < bounds.left - 1 || childBounds.right > bounds.right + 1 || child.scrollWidth > child.clientWidth + 1
          }).map(child => child.textContent)
          return { groups, overflow, bottom: bounds.bottom, rosterTop: document.querySelector("#team .team-grid")!.getBoundingClientRect().top }
        })
        expect(layout.overflow, `${path} credentials at ${width}px`).toEqual([])
        expect(layout.bottom).toBeLessThan(layout.rosterTop)
        if (width <= 768) expect(layout.groups[1].top).toBeGreaterThan(layout.groups[0].bottom)
        if (width >= 1024) {
          for (let track = 0; track < 3; track++) expect(Math.abs(layout.groups[0].tracks[track] - layout.groups[1].tracks[track]), `${path} credential alignment at ${width}px`).toBeLessThanOrEqual(1)
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
        if (path === `/${lang}` && [390, 768, 1440, 2560].includes(width)) await credentials.screenshot({ path: testInfo.outputPath(`credentials-${lang}-${width}.png`), animations: "disabled" })
      }
      await page.setViewportSize({ width: 390, height: 844 })
      const accessibility = await new AxeBuilder({ page }).include("#team").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()
      expect(accessibility.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) })), `${path} team accessibility`).toEqual([])
    }
  }
})

test("team credentials accommodate more institutions and enlarged text", async ({ page }, testInfo) => {
  await page.goto(`${base}/ru`)
  await expect.poll(() => page.locator(".hero-scene canvas").evaluate(element => (element as HTMLCanvasElement).width)).toBeGreaterThan(300)
  const credentials = page.locator("#team .team-credentials")
  const institutions = [
    ["MFF UK", "ČVUT", "Massachusetts Institute of Technology"],
    ["Rapid7", "Grant Thornton", "Azul Systems", "Microsoft", "Google", "LongInstitutionNameWithoutSpaces"],
  ]
  await credentials.locator(".team-credential-names").evaluateAll((lists, groups) => {
    lists.forEach((list, index) => list.replaceChildren(...groups[index].map(name => {
      const item = document.createElement("li")
      item.textContent = name
      return item
    })))
  }, institutions)
  for (const width of [320, 390, 768, 1024, 1440, 2560]) {
    await page.setViewportSize({ width, height: 1000 })
    await expect(page.locator(".site-header")).toHaveCSS("height", `${width < 768 ? 68 : width < 1024 ? 72 : 80}px`)
    await expect(credentials.locator("li")).toHaveText(institutions.flat())
    const overflow = await credentials.locator("li").evaluateAll(items => items.filter(item => {
      const bounds = item.getBoundingClientRect()
      return bounds.left < 0 || bounds.right > innerWidth || item.scrollWidth > item.clientWidth + 1
    }).map(item => item.textContent))
    expect(overflow, `Additional institutions at ${width}px`).toEqual([])
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
    if ([390, 1440].includes(width)) await credentials.screenshot({ path: testInfo.outputPath(`expanded-institutions-${width}.png`), animations: "disabled" })
  }
  await page.setViewportSize({ width: 320, height: 1000 })
  await credentials.locator(".team-credential-names, dt, .team-credential-detail").evaluateAll(elements => {
    for (const element of elements) (element as HTMLElement).style.fontSize = `${parseFloat(getComputedStyle(element).fontSize) * 2}px`
  })
  const clipping = await credentials.locator("li, dt, .team-credential-detail").evaluateAll(elements => elements.filter(element => element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1).map(element => element.textContent))
  expect(clipping, "Institutions and labels with 200% text size").toEqual([])
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
})

test("reading sizes and section rhythm stay balanced across viewports", async ({ page }, testInfo) => {
  await page.goto(`${base}/cs`)
  await page.evaluate(async () => { await document.fonts.ready })
  const questionOrder = await page.locator(".faq-item summary").allTextContents()
  for (const width of [320, 390, 768, 1024, 1440, 2560]) {
    await page.setViewportSize({ width, height: 1000 })
    await expect(page.locator(".site-header")).toHaveCSS("height", `${width < 768 ? 68 : width < 1024 ? 72 : 80}px`)
    const minimumBody = width < 768 ? 16 : width < 1024 ? 17 : 18
    await expect(page.locator("body")).toHaveCSS("font-size", `${minimumBody}px`)
    const bodyStyles = await page.locator(".section-intro, .catalog-description, .audience-item p, .format-item p, .funding-price p, .steps-list p, .person-description").evaluateAll(elements => elements.map(element => {
      const style = getComputedStyle(element)
      return { text: element.textContent?.slice(0, 50), font: parseFloat(style.fontSize), leading: parseFloat(style.lineHeight) / parseFloat(style.fontSize) }
    }))
    expect(bodyStyles.filter(style => style.font < minimumBody || style.leading < 1.65), `Reading scale at ${width}px`).toEqual([])
    const markers = await page.locator("#financovani .step-marker").allTextContents()
    expect(markers).toEqual(["01", "02", "03"])
    await expect(page.locator("#financovani .step-marker").first()).toHaveCSS("font-size", "12px")
    await expect(page.locator(".funding-disclaimer")).toHaveCSS("font-size", `${width < 768 ? 15 : 16}px`)
    const sectionPadding = await page.locator(".section").evaluateAll(elements => elements.map(element => parseFloat(getComputedStyle(element).paddingTop)))
    expect(Math.max(...sectionPadding)).toBeLessThanOrEqual(width < 768 ? 48 : width < 1024 ? 64 : 80)
    await expect(page.locator(".hero-inner")).toHaveCSS("min-height", "0px")
    const placeholders = await page.locator(".person-card-no-photo .person-portrait").evaluateAll(elements => elements.map(element => element.getBoundingClientRect().height))
    expect(Math.max(...placeholders)).toBeLessThanOrEqual(100)
    if (width >= 768 && width < 1200) {
      const biographyWidths = await page.locator(".person-description").evaluateAll(elements => elements.map(element => element.getBoundingClientRect().width))
      expect(Math.min(...biographyWidths)).toBeGreaterThan(350)
    }
    const faqColumns = await page.locator(".faq-columns").evaluate(element => getComputedStyle(element).gridTemplateColumns.split(" ").length)
    expect(faqColumns).toBe(width < 768 ? 1 : 2)
    expect(await page.locator(".faq-item summary").allTextContents()).toEqual(questionOrder)
    await page.locator(".faq-item summary").first().click()
    await expect(page.locator(".faq-item[open]").first().locator("p")).toBeVisible()
    await expect(page.locator(".faq-item[open]").first().locator("p")).toHaveCSS("font-size", `${minimumBody}px`)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
    await page.locator(".faq-item summary").first().click()
    if ([390, 768, 1440].includes(width)) await page.locator("#financovani").screenshot({ path: testInfo.outputPath(`funding-${width}.png`), animations: "disabled" })
  }
})

test("navigation and supporting text remain readable without header collisions", async ({ page }, testInfo) => {
  for (const lang of ["cs", "en", "ru"]) {
    await page.goto(`${base}/${lang}`)
    await page.evaluate(async () => { await document.fonts.ready })
    for (const width of [320, 390, 768, 1024, 1280, 1440, 1920, 2560]) {
      await page.setViewportSize({ width, height: 1000 })
      await expect(page.locator(".site-header")).toHaveCSS("height", `${width < 768 ? 68 : width < 1024 ? 72 : 80}px`)
      const minimumMeta = width < 768 ? 13 : 14
      const smallText = await page.locator(".fact dt, .price-inline > span, .catalog-topics, .catalog-accreditation, .person-role, .partner-link > span:last-child").evaluateAll(elements => elements.map(element => ({ text: element.textContent?.slice(0, 60), size: parseFloat(getComputedStyle(element).fontSize) })))
      expect(smallText.filter(element => element.size < minimumMeta), `${lang} metadata at ${width}px`).toEqual([])
      await expect(page.locator(".hero-funding")).toHaveCSS("font-size", `${width < 768 ? 15 : 16}px`)
      await expect(page.locator(".footer-links a").first()).toHaveCSS("font-size", `${width < 768 ? 15 : 16}px`)
      await expect(page.locator(".language-switcher summary")).toHaveCSS("font-size", "15px")
      if (width >= 1024) {
        await expect(page.locator(".desktop-nav a").first()).toHaveCSS("font-size", "17px")
        await expect(page.locator(".header-apply")).toHaveCSS("font-size", "16px")
        const fits = await page.locator(".header-inner").evaluate(header => {
          const logo = header.querySelector(".wordmark")!.getBoundingClientRect()
          const navigation = header.querySelector(".desktop-nav")!.getBoundingClientRect()
          const actions = header.querySelector(".header-actions")!.getBoundingClientRect()
          return logo.right < navigation.left && navigation.right < actions.left && actions.right <= innerWidth
        })
        expect(fits, `${lang} header at ${width}px`).toBe(true)
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
      if (lang === "cs" && [1024, 1440, 1920].includes(width)) await page.locator(".site-header").screenshot({ path: testInfo.outputPath(`header-${width}.png`) })
    }
  }
  await page.goto(`${base}/cs/kontakt`)
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    await expect(page.locator('.field label[for$="-name"]')).toHaveCSS("font-size", `${width < 768 ? 13 : 14}px`)
    await expect(page.locator(".form-privacy")).toHaveCSS("font-size", "15px")
  }
})

test("translated homepages and catalogs keep partner assets, brand colors and valid links", async ({ page }) => {
  for (const [lang, catalog] of [["en", "courses"], ["ru", "kursy"]]) {
    await page.setViewportSize({ width: 320, height: 844 })
    await page.goto(`${base}/${lang}`)
    await expect(page.locator("html")).toHaveAttribute("lang", lang)
    await expect(page.locator('.hero a[href="#kurzy"]')).toBeVisible()
    const assets = await page.locator(".partner-section img").evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))
    expect(assets).toBe(true)
    await expect(page.locator(".site-footer .wordmark")).toHaveCSS("color", "rgb(17, 17, 17)")
    await expect(page.locator(".site-footer .wordmark span")).toHaveCSS("color", "rgb(36, 85, 232)")
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.goto(`${base}/${lang}/${catalog}`)
    const cards = page.locator("#nabidka .catalog-card")
    expect(await cards.count()).toBeGreaterThan(0)
    for (const href of await cards.locator("a").evaluateAll(links => links.map(link => link.getAttribute("href")))) {
      expect(href).toMatch(new RegExp(`^/${lang}/${catalog}/`))
    }
  }
})

test("six-course layout stays comparable on mobile, tablet and desktop", async ({ page }, testInfo) => {
  await page.goto(`${base}/cs`)
  await expect.poll(() => page.locator(".hero-scene canvas").evaluate(element => (element as HTMLCanvasElement).width)).toBeGreaterThan(300)
  await page.locator("#kurzy .course-grid").evaluate(grid => {
    const template = grid.firstElementChild!
    const fragments = ["Python", "C#", "Java", "JavaScript", "AI", "Data"].map((title, index) => {
      const card = template.cloneNode(true) as HTMLElement
      card.dataset.courseSlug = `layout-fixture-${index}`
      card.querySelector("h3")!.textContent = index % 2 ? `${title}: praktické dovednosti a vlastní projekty` : `${title}: základy`
      card.querySelector(".catalog-topic")!.textContent = title
      card.querySelector(".catalog-description")!.textContent = index % 2 ? "Praktické dovednosti pro další profesní krok. Vlastní projekty, nové nástroje a zkušenost se spoluprací." : "Praktický kurz pro začátečníky."
      card.querySelector(".price-inline > p")!.textContent = index % 2 ? "Cena a podmínky úhrady se potvrzují pro konkrétní běh kurzu. Před přihlášením si vyžádejte aktuální nabídku." : "Cena kurzu."
      return card
    })
    grid.classList.remove("course-grid-single")
    grid.replaceChildren(...fragments)
  })
  for (const width of widths) {
    await page.setViewportSize({ width, height: 1000 })
    await expect(page.locator(".site-header")).toHaveCSS("height", `${width < 768 ? 68 : width < 1024 ? 72 : 80}px`)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    const columns = await page.locator("#kurzy .course-grid").evaluate(grid => getComputedStyle(grid).gridTemplateColumns.split(" ").length)
    expect(columns).toBe(width < 768 ? 1 : width <= 1100 ? 2 : 3)
    if (width >= 768) {
      const rows = await page.locator("#kurzy .catalog-card").evaluateAll(cards => {
        const groups: Record<string, number[][]> = {}
        for (const card of cards) {
          const top = String(Math.round(card.getBoundingClientRect().top))
          const points = ["h3", ".catalog-description", ".catalog-card-details", ".catalog-card-footer", ".catalog-card-footer .button"].map(selector => card.querySelector(selector)!.getBoundingClientRect().top)
          ;(groups[top] ||= []).push(points)
        }
        return Object.values(groups)
      })
      for (const row of rows) for (let point = 0; point < row[0].length; point++) expect(Math.max(...row.map(card => card[point])) - Math.min(...row.map(card => card[point])), `Course alignment at ${width}px`).toBeLessThanOrEqual(1)
    }
    if ([320, 768, 1440].includes(width)) await page.locator("#kurzy").screenshot({ path: testInfo.outputPath(`six-courses-${width}.png`), animations: "disabled" })
  }
})

test("shared compositions keep meaningful alignment across languages and widths", async ({ page }, testInfo) => {
  for (const lang of ["cs", "en", "ru"]) {
    await page.goto(`${base}/${lang}`)
    await page.evaluate(async () => { await document.fonts.ready })
    for (const width of [390, 768, 1024, 1280, 1440, 1920, 2560]) {
      await page.setViewportSize({ width, height: 1000 })
      await expect(page.locator(".site-header")).toHaveCSS("height", `${width < 768 ? 68 : width < 1024 ? 72 : 80}px`)
      if (width >= 1600) await expect(page.locator(".hero-inner")).toHaveCSS("width", `${width >= 2200 ? 1560 : 1400}px`)
      const issues = await page.evaluate(() => {
        const failures: string[] = []
        const aligned = (values: number[]) => Math.max(...values) - Math.min(...values) <= 1
        const logos = Array.from(document.querySelectorAll(".partner-logo-frame")).map(element => element.getBoundingClientRect().top)
        const captions = Array.from(document.querySelectorAll(".partner-link > span:last-child")).map(element => element.getBoundingClientRect().top)
        if (!aligned(logos) || !aligned(captions)) failures.push("Partner logo and caption rows")
        for (const header of document.querySelectorAll(".section-header:not(.section-header-solo)")) {
          const title = header.querySelector(".section-title")!.getBoundingClientRect()
          const intro = header.querySelector(".section-intro")!.getBoundingClientRect()
          if (!aligned([title.left, intro.left]) || intro.top < title.bottom + 8 || intro.top > title.bottom + 24) failures.push(`Stacked header: ${header.textContent?.slice(0, 40)}`)
        }
        const funding = document.querySelector("#financovani")!
        const options = funding.querySelector(".funding-options")!.getBoundingClientRect()
        const firstMarker = funding.querySelector(".step-marker")!.getBoundingClientRect()
        if (firstMarker.top - options.bottom < 23 || firstMarker.top - options.bottom > 33) failures.push("Funding-to-process spacing")
        const processBottom = funding.querySelector(".process-steps")!.getBoundingClientRect().bottom
        const footnoteTop = funding.querySelector(".section-footnote")!.getBoundingClientRect().top
        if (footnoteTop - processBottom < 23 || footnoteTop - processBottom > 33) failures.push("Funding conditions spacing")
        for (const step of funding.querySelectorAll(".process-steps li")) {
          if (parseFloat(getComputedStyle(step).borderTopWidth) !== 0) failures.push("Duplicate funding divider")
        }
        if (innerWidth >= 768) {
          for (const profile of document.querySelectorAll(".person-card")) {
            const points = [".person-portrait", ".person-heading", ".person-description"].map(selector => profile.querySelector(selector)!.getBoundingClientRect().top)
            if (!aligned(points)) failures.push("Profile identity and biography")
          }
          for (const row of document.querySelectorAll(".faq-row")) {
            const summaries = Array.from(row.querySelectorAll("summary")).map(element => element.getBoundingClientRect())
            if (!aligned(summaries.map(bounds => bounds.top)) || !aligned(summaries.map(bounds => bounds.bottom))) failures.push("FAQ row boundaries")
            const textTops = Array.from(row.querySelectorAll("summary")).map(summary => {
              const text = Array.from(summary.childNodes).find(node => node.nodeType === Node.TEXT_NODE)!
              const range = document.createRange()
              range.setStart(text, 0)
              range.setEnd(text, 1)
              return range.getBoundingClientRect().top
            })
            if (!aligned(textTops)) failures.push("FAQ first-line alignment")
          }
          const [funded, selfPaid] = Array.from(funding.querySelector(".funding-options")!.children).map(element => element.getBoundingClientRect())
          if (!aligned([funded.width, selfPaid.width]) || funded.right >= selfPaid.left) failures.push("Funding comparison columns")
        }
        if (innerWidth >= 1024) {
          for (const process of document.querySelectorAll(".process-steps")) {
            for (const selector of [".step-marker", "h3", "p"]) {
              if (!aligned(Array.from(process.querySelectorAll(selector)).map(element => element.getBoundingClientRect().top))) failures.push(`Process baseline: ${selector}`)
            }
          }
          const art = document.querySelector(".hero-scene-inner")!.getBoundingClientRect()
          const content = document.querySelector(".hero-inner")!.getBoundingClientRect()
          if (!aligned([art.left, content.left]) || !aligned([art.right, content.right])) failures.push("Hero art detached from content container")
        }
        for (const selector of [".audience-grid", ".format-grid"]) {
          const groups = new Map<number, Element[]>()
          for (const item of document.querySelector(selector)!.children) {
            const top = Math.round(item.getBoundingClientRect().top)
            groups.set(top, [...(groups.get(top) || []), item])
          }
          for (const row of groups.values()) {
            const bodyTops = row.map(item => item.querySelector("p")!.getBoundingClientRect().top)
            if (!aligned(bodyTops)) failures.push(`Repeated content baseline: ${selector}`)
          }
        }
        if (document.documentElement.scrollWidth > innerWidth + 1) failures.push("Page overflow")
        return failures
      })
      expect(issues, `${lang} composition at ${width}px`).toEqual([])
      if (lang === "cs" && [390, 768, 1280, 1920, 2560].includes(width)) await page.locator("#financovani").screenshot({ path: testInfo.outputPath(`funding-composition-${width}.png`), animations: "disabled" })
    }
  }
})

test("reading and contact columns have shared anchors and policy navigation works", async ({ page }) => {
  for (const width of [390, 768, 1280, 1920, 2560]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto(`${base}/cs/blog/zaciname-s-pythonem-prvni-kroky`)
    const article = await page.locator(".article-container").evaluateAll(elements => elements.map(element => element.getBoundingClientRect().left))
    expect(Math.max(...article) - Math.min(...article)).toBeLessThanOrEqual(1)
    await expect(page.locator(".article-content h2")).toBeVisible()
    await page.goto(`${base}/cs/kontakt`)
    const fields = page.locator(".field input, .field select")
    for (const field of await fields.all()) await expect(field).toHaveCSS("height", "50px")
    if (width >= 768) {
      const titles = await page.locator(".contact-form-heading").evaluateAll(elements => elements.map(element => element.getBoundingClientRect().top))
      expect(Math.max(...titles) - Math.min(...titles)).toBeLessThanOrEqual(1)
    }
  }
  await page.goto(`${base}/cs/gdpr`)
  await expect(page.locator(".policy-chapter")).toHaveCount(9)
  await expect(page.locator(".policy-toc a")).toHaveCount(9)
  await page.locator('.policy-toc a[href="#policy-6"]').click()
  await expect(page).toHaveURL(`${base}/cs/gdpr#policy-6`)
  await expect(page.locator("#policy-6")).toBeInViewport()
})

test("application errors preserve data and success keeps keyboard focus", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 })
  await page.goto(`${base}${pythonPath}`)
  const trigger = page.getByRole("button", { name: "Nezávazně se přihlásit", exact: true }).first()
  await trigger.click()
  const dialog = page.locator("dialog[open]")
  await dialog.getByLabel("Jméno a příjmení").fill("QA Example")
  await dialog.getByLabel("E-mail", { exact: true }).fill("qa@example.test")
  await dialog.getByLabel("Telefon", { exact: false }).fill("+420 123 456 789")
  await dialog.getByRole("button", { name: "Odeslat nezávazný zájem" }).click()
  await expect(dialog.getByRole("alert")).toBeVisible()
  await expect(dialog.getByLabel("Jméno a příjmení")).toHaveValue("QA Example")
  expect(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true)
  let submitted: Record<string, string> = {}
  await page.route("**/api/contact", route => {
    submitted = route.request().postDataJSON()
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true }) })
  })
  await dialog.getByRole("button", { name: "Odeslat nezávazný zájem" }).click()
  await expect(dialog.getByRole("status")).toBeFocused()
  expect(submitted.subject).toBe("Programátor www aplikací v jazyce Python")
  expect(submitted.message).toBeTruthy()
  await page.keyboard.press("Escape")
  await expect(dialog).toHaveCount(0)
  await expect(trigger).toBeFocused()
})

test("mobile navigation, cookie settings and course project are operable", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 })
  await page.goto(`${base}/cs`)
  await page.getByRole("button", { name: "Otevřít menu" }).click()
  await expect(page.locator("#mobile-navigation")).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(page.locator("#mobile-navigation")).not.toBeVisible()
  await expect(page.getByRole("button", { name: "Otevřít menu" })).toBeFocused()
  await page.getByRole("button", { name: "Otevřít menu" }).click()
  await page.locator("#mobile-navigation").getByRole("link", { name: "Kurzy", exact: true }).click()
  await expect(page).toHaveURL(`${base}/cs/kurzy`)
  await expect(page.locator("#mobile-navigation")).not.toBeVisible()
  await page.getByRole("button", { name: "Nastavení cookies" }).click()
  await expect(page.locator(".cookie-notice")).toBeVisible()
  await page.getByRole("button", { name: "Jen nezbytné", exact: true }).click()
  await expect(page.locator(".cookie-notice")).toHaveCount(0)
  await page.goto(`${base}${pythonPath}`)
  const firstTab = page.getByRole("tab").first()
  await firstTab.focus()
  await page.keyboard.press("End")
  await expect(page.getByRole("tab", { name: /Projekt/ })).toHaveAttribute("aria-selected", "true")
  await expect(page.locator(".example-book")).toHaveCount(2)
  const filter = page.getByRole("checkbox", { name: "Jen dostupné knihy", exact: true })
  await filter.uncheck()
  await expect(page.locator(".example-book")).toHaveCount(3)
  await filter.check()
  await expect(page.locator(".example-book")).toHaveCount(2)
})

test("learning example has meaningful outputs and accessible code at every step", async ({ page }, testInfo) => {
  for (const [lang, route] of [["cs", "kurzy"], ["en", "courses"], ["ru", "kursy"]]) {
    await page.goto(`${base}/${lang}/${route}/programator-www-aplikaci-v-pythonu`)
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 })
      for (let step = 0; step < 5; step++) {
        await page.getByRole("tab").nth(step).click()
        await expect(page.locator(".learning-example")).toHaveAttribute("data-stage", String(step))
        await expect(page.locator(".journey-description h3")).toBeVisible()
        if (step === 2) {
          await expect(page.locator(".example-table tbody tr")).toHaveCount(3)
          await expect(page.locator(".example-query-result p")).not.toBeEmpty()
        } else {
          await expect(page.locator(".example-book")).toHaveCount(step === 0 ? 3 : 2)
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
      }
      await page.locator(".example-code summary").click()
      await expect(page.locator(".example-code pre")).toBeVisible()
      await page.locator(".example-code summary").click()
      if (lang === "cs") await page.locator("#cesta").screenshot({ path: testInfo.outputPath(`learning-${width}.png`), animations: "disabled" })
    }
    const accessibility = await new AxeBuilder({ page }).include("#cesta").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()
    expect(accessibility.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) }))).toEqual([])
  }
})

test("hero canvas renders and responds without motion when reduced motion is requested", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(`${base}/cs`)
  const canvas = page.locator(".hero-scene canvas")
  await expect.poll(() => canvas.evaluate(element => {
    const image = element as HTMLCanvasElement
    const data = image.getContext("2d")!.getImageData(0, 0, image.width, image.height).data
    let blue = 0
    for (let offset = 0; offset < data.length; offset += 4) if (data[offset + 2] > 150 && data[offset] < 100 && data[offset + 3] > 100) blue++
    return blue
  })).toBeGreaterThan(1000)
  const before = await canvas.evaluate(element => (element as HTMLCanvasElement).toDataURL())
  await page.mouse.move(1100, 400)
  const after = await canvas.evaluate(element => (element as HTMLCanvasElement).toDataURL())
  expect(after).toBe(before)
})

test("no analytics or advertising tag loads before consent is given", async ({ page }) => {
  const thirdParty: string[] = []
  page.on("request", request => {
    if (/googletagmanager|google-analytics|doubleclick|googlesyndication|googleadservices|_vercel\/insights/.test(request.url())) {
      thirdParty.push(request.url())
    }
  })
  // Undo the suite-wide "denied" decision so this starts as a first-time visitor.
  await page.addInitScript(() => window.localStorage.clear())

  await page.goto(`${base}/cs`)
  await page.waitForTimeout(3000)

  expect(thirdParty, "no third-party request may precede consent").toEqual([])
  await expect(page.locator(".cookie-notice")).toBeVisible()
  expect(await page.locator('script[src*="googletagmanager"]').count()).toBe(0)
  expect(await page.evaluate(() => document.cookie)).toBe("")

  // Consent Mode defaults must still be declared, denying every purpose.
  const defaults = await page.evaluate(() => (window.dataLayer || []).map(entry => Array.from(entry)).find(entry => entry[0] === "consent" && entry[1] === "default"))
  expect(defaults?.[2]).toMatchObject({ ad_storage: "denied", analytics_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" })
})

test("withdrawing consent restores the banner and clears Google identifiers", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear())
  await page.goto(`${base}/cs`)

  await page.getByRole("button", { name: "Povolit" }).click()
  await expect(page.locator(".cookie-notice")).toHaveCount(0)
  expect(await page.evaluate(() => window.localStorage.getItem("cookie_consent"))).toBe("granted")

  // Stand in for the identifiers the Google tags would have written.
  await page.evaluate(() => { document.cookie = "_gcl_au=1.1.test; path=/"; document.cookie = "_ga=GA1.1.test; path=/" })

  await page.getByRole("button", { name: "Nastavení cookies" }).click()
  await expect(page.locator(".cookie-notice")).toBeVisible()
  expect(await page.evaluate(() => window.localStorage.getItem("cookie_consent"))).toBeNull()
  expect(await page.evaluate(() => document.cookie), "tracking cookies must be removed").toBe("")

  const update = await page.evaluate(() => (window.dataLayer || []).map(entry => Array.from(entry)).filter(entry => entry[0] === "consent" && entry[1] === "update").pop())
  expect(update?.[2]).toMatchObject({ ad_storage: "denied", analytics_storage: "denied" })
})

test("legacy home redirects and invalid requests never reach email delivery", async ({ request }) => {
  const legacy = await request.get(`${base}/cs/domu`, { maxRedirects: 0 })
  expect(legacy.status()).toBe(308)
  expect(legacy.headers().location).toBe("/cs")
  const foreign = await request.post(`${base}/api/contact`, { headers: { origin: "https://example.invalid" }, data: {} })
  expect(foreign.status()).toBe(403)
  const invalid = await request.post(`${base}/api/contact`, { headers: { origin: base }, data: { name: {}, email: "not-email", subject: "Test", message: "Test" } })
  expect(invalid.status()).toBe(400)
  const honeypot = await request.post(`${base}/api/contact`, { headers: { origin: base }, data: { surname: "automated-check" } })
  expect(honeypot.status()).toBe(200)
})

test("a direct draft-course visit offers no application or inherited Python curriculum", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(`${base}/en/courses/programator-csharp`)
  await expect(page.locator("h1")).toHaveText("C# development")
  await expect(page.locator(".header-apply")).toHaveAttribute("href", "/en/courses#nabidka")
  await expect(page.locator("#prihlaska, .application-dialog, #cesta")).toHaveCount(0)
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/)
})

test("confirmed price, licence and course navigation stay visible and consistent", async ({ page }) => {
  for (const [lang, route] of [["cs", "kurzy"], ["en", "courses"], ["ru", "kursy"]]) {
    await page.goto(`${base}/${lang}/${route}/programator-www-aplikaci-v-pythonu`)
    const price = new Intl.NumberFormat(lang, { style: "currency", currency: "CZK", maximumFractionDigits: 0 }).format(49900)
    await expect(page.locator(".course-summary .price-inline > strong")).toHaveText(price)
    await expect(page.locator("#financovani .price-inline > strong")).toHaveText(price)
    await expect(page.locator(".software-benefit h2")).toContainText("PyCharm Professional")
    await expect(page.locator(".software-benefit h2")).toContainText("6")
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 })
      const logo = page.locator(".software-benefit img")
      await logo.scrollIntoViewIfNeeded()
      await expect.poll(() => logo.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
      const bounds = await logo.boundingBox()
      expect(bounds!.width).toBeGreaterThanOrEqual(150)
      expect(bounds!.width / bounds!.height).toBeCloseTo(266 / 79, 1)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
    }
    const localTitle = await page.locator("#format-title").textContent()
    await expect(page.locator('.course-local-nav a[href="#jak-to-probiha"]')).toHaveText(localTitle!)
  }
})

test("planned courses stay available through an explicit disclosure", async ({ page }) => {
  await page.goto(`${base}/cs/kurzy`)
  await expect(page.locator("#nabidka .catalog-card")).toHaveCount(1)
  const disclosure = page.locator(".planned-courses")
  await expect(disclosure).not.toHaveAttribute("open")
  await disclosure.locator("summary").click()
  await expect(disclosure).toHaveAttribute("open", "")
  await expect(disclosure.locator(".catalog-card")).toHaveCount(7)
  await expect(disclosure.locator(".catalog-card a, .catalog-card button")).toHaveCount(0)
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    await expect(disclosure.locator(".catalog-card").last()).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
  }
})

test("design policy: form boundaries have sufficient contrast and focus stays visible", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(`${base}/cs/kontakt`)
  const contrasts = await page.locator(".field input, .field select, .field textarea").evaluateAll(elements => {
    function luminance(color: string) {
      const channels = color.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(channel => {
        const value = channel / 255
        return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4
      })
      return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722
    }
    return elements.map(element => {
      const style = getComputedStyle(element)
      const border = luminance(style.borderTopColor)
      const background = luminance(style.backgroundColor)
      return (Math.max(border, background) + .05) / (Math.min(border, background) + .05)
    })
  })
  expect(Math.min(...contrasts)).toBeGreaterThanOrEqual(3)
  await page.getByRole("button", { name: "Nastavení cookies" }).click()
  const notice = page.locator(".cookie-notice")
  await expect(notice).toBeVisible()
  await expect.poll(() => page.evaluate(() => parseFloat(getComputedStyle(document.body).paddingBottom))).toBeGreaterThan(0)
  const footerLink = page.locator(".footer-tools a").last()
  await footerLink.focus()
  const footerBounds = await footerLink.boundingBox()
  const noticeBounds = await notice.boundingBox()
  expect(footerBounds!.y + footerBounds!.height).toBeLessThanOrEqual(noticeBounds!.y)
  await notice.getByRole("button", { name: "Jen nezbytné", exact: true }).click()
  await expect(notice).toHaveCount(0)
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.body).paddingBottom)).toBe("0px")
  await page.goto(`${base}${pythonPath}`)
  const application = page.locator("#prihlaska button[aria-haspopup='dialog']")
  await application.focus()
  const focusBounds = await application.boundingBox()
  const stickyBounds = await page.locator(".course-sticky").boundingBox()
  expect(focusBounds).not.toBeNull()
  expect(stickyBounds).not.toBeNull()
  expect(focusBounds!.y).toBeGreaterThanOrEqual(68)
  expect(focusBounds!.y + focusBounds!.height).toBeLessThanOrEqual(stickyBounds!.y)
})

test("design policy: fallback content declares its source language", async ({ page }) => {
  for (const lang of ["en", "ru"]) {
    await page.goto(`${base}/${lang}/blog`)
    for (const body of await page.locator(".editorial-body").all()) await expect(body).toHaveAttribute("lang", "cs")
    await page.goto(`${base}/${lang}/blog/zaciname-s-pythonem-prvni-kroky`)
    await expect(page.locator("h1")).toHaveAttribute("lang", "cs")
    await expect(page.locator(".article-content")).toHaveAttribute("lang", "cs")
    await expect(page.locator(".article-bottom a")).toHaveAttribute("lang", lang)
    const sourceLanguage = await page.locator('script[type="application/ld+json"]').evaluateAll(elements => elements.map(element => JSON.parse(element.textContent || "{}")).find(schema => schema["@type"] === "BlogPosting").inLanguage)
    expect(sourceLanguage).toBe("cs-CZ")
  }
})

test("the privacy policy is translated rather than served as Czech fallback", async ({ page }) => {
  const headings = { cs: "Zásady ochrany osobních údajů", en: "Privacy policy", ru: "Политика конфиденциальности" }
  for (const [lang, heading] of Object.entries(headings)) {
    await page.goto(`${base}/${lang}/gdpr`)
    await expect(page.locator("h1")).toHaveText(heading)
    // No source-language override: the document matches the surrounding page.
    await expect(page.locator("main")).not.toHaveAttribute("lang", "cs")
    await expect(page.locator(".policy-chapter")).toHaveCount(9)
    await expect(page.locator(".policy-toc a")).toHaveCount(9)
  }
})

test("the privacy policy discloses the processors the site actually contacts", async ({ page }) => {
  await page.goto(`${base}/cs/gdpr`)
  const policy = await page.locator(".policy-document").innerText()
  for (const disclosure of ["Vercel Inc.", "Google", "SHA-256", "Nastavení cookies"]) {
    expect(policy, `policy must mention ${disclosure}`).toContain(disclosure)
  }
})

test.describe("200% zoom-equivalent reflow", () => {
  test.use({ viewport: { width: 720, height: 500 }, deviceScaleFactor: 2 })

  test("course content and application controls remain available", async ({ page }, testInfo) => {
    await page.goto(`${base}${pythonPath}`)
    await expect(page.locator("h1")).toBeVisible()
    await expect(page.locator(".menu-toggle")).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
    const trigger = page.getByRole("button", { name: "Nezávazně se přihlásit", exact: true }).first()
    await trigger.click()
    const dialog = page.locator("dialog[open]")
    await dialog.getByLabel("Jméno a příjmení").fill("Zoom review")
    await dialog.getByLabel("E-mail", { exact: true }).fill("zoom@example.test")
    const submit = dialog.getByRole("button", { name: "Odeslat nezávazný zájem" })
    await submit.scrollIntoViewIfNeeded()
    const bounds = await submit.boundingBox()
    expect(bounds!.y).toBeGreaterThanOrEqual(0)
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(500)
    await submit.click()
    await expect(dialog.getByRole("alert")).toBeVisible()
    await expect(dialog.getByLabel("E-mail", { exact: true })).toHaveValue("zoom@example.test")
    await page.screenshot({ path: testInfo.outputPath("application-zoom-equivalent.png"), animations: "disabled" })
    await page.keyboard.press("Escape")
    await expect(dialog).toHaveCount(0)
    await expect(trigger).toBeFocused()
  })
})