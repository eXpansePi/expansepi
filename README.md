# eXpansePi - IT Education Platform

A multilingual website for practical IT education and career-transition courses. Built with Next.js 16 App Router, React 19, TypeScript, and Tailwind CSS 4.

All visual and UX work **MUST** follow [design-principles.md](design-principles.md), the repository's mandatory design source of truth. Review new pages and component changes against its [required review checklist](design-principles.md#required-review).

## 🌍 Features

- **Localized Routes**: Czech (cs), English (en), Russian (ru)
- **Expandable Course Catalog**: Course-specific content, dates, prices, and publication status managed in JSON
- **Application Flow**: Shared nonbinding enquiry form, course selection, accessible dialogs, and persistent success/error feedback
- **Shared Design System**: Responsive reading scales, aligned content grids, native FAQ disclosures, and reduced-motion support
- **Blog System**: Publish Markdown articles with draft/published status
- **Job Vacancies**: Dynamic job postings with multilingual support
- **SEO**: Structured data, published-content sitemap, canonical URLs, and language alternates
- **Verification**: Course-data regressions and Playwright layout, accessibility, and interaction tests in Chromium and WebKit

## 🚀 Getting Started

### Prerequisites

- Node.js 22.6 or later, including support for the TypeScript regression-test runner
- npm; the repository includes a committed lockfile

### Installation

```bash
# Install dependencies
npm ci

# Run development server
npm run dev
```

Open [http://localhost:3000/cs](http://localhost:3000/cs). English and Russian entry points are `/en` and `/ru`.

Browsing the site does not require email credentials. Real enquiry delivery requires the server configuration described below.

### Build for Production

```bash
npm run build
npm start
```

### Verification

```bash
npm test
npx tsc --noEmit
npm run lint
npx playwright install chromium webkit
```

With a development server running, execute the browser tests in a separate terminal:

```bash
E2E_URL=http://localhost:3000 npm run test:browser
E2E_URL=http://localhost:3000 E2E_BROWSER=webkit npm run test:browser
```

The suite checks layouts from 320px to 2560px, shared alignment, translated routes, varied course-card content, accessibility, navigation, and form feedback/focus behavior. Screenshots are saved under the ignored `test-results/` directory. Form requests are intercepted; API checks use invalid or honeypot payloads only, so the tests do not send real enquiries.

### Independent Review Preview

To avoid conflicting with another Next.js process, use a separate port and output directory:

```bash
NEXT_OUTPUT_DIR=.next/review WATCHPACK_POLLING=true npm run dev -- --port 3001 --webpack
```

Open [http://localhost:3001/cs](http://localhost:3001/cs) and use `E2E_URL=http://localhost:3001` for its browser tests. File polling makes stylesheet updates reliable in this workspace. `NEXT_OUTPUT_DIR` is optional; normal development and builds use `.next`.

## 📁 Project Structure

```text
expansepi/
|-- app/
|   |-- [lang]/
|   |   |-- page.tsx         # Main language homepage
|   |   |-- components/     # Shared sections, navigation, forms, and visuals
|   |   |-- kurzy/          # Course catalog and detail pages
|   |   |-- blog/           # Article listing and Markdown detail pages
|   |   |-- kontakt/        # Contact page and course enquiry selector
|   |   |-- o-nas/          # About page and team roster
|   |   |-- gdpr/           # Privacy document
|   |   `-- volne-pozice/   # Vacancy listing and details
|   |-- api/contact/        # Validated, rate-limited email endpoint
|   |-- globals.css         # Typography, color, grid, and responsive rules
|   `-- sitemap.ts          # Published-content sitemap
|-- data/                   # JSON records and TypeScript data loaders
|-- i18n/
|   |-- site.ts             # Shared customer-journey copy in CS/EN/RU
|   `-- locales/            # General interface translations
|-- lib/                    # Routes, schedules, SEO, consent, and form utilities
|-- types/                  # Content models
|-- public/                 # Assets, including original partner logos
`-- tests/
  |-- course-experience.test.mjs
  `-- site.spec.ts
```

## 📚 Documentation

- **[design-principles.md](design-principles.md)** - Mandatory visual/UX rules, rationale, tokens, reusable patterns, and acceptance checklist
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Course publishing, composition rules, brand guidance, and verification workflow
- **[CHANGES.md](./CHANGES.md)** - Recent changes and updates
- **[SEO_IMPLEMENTATION.md](./SEO_IMPLEMENTATION.md)** - SEO setup guide

## 🎯 Key Features

### Multilingual Content

The interface and routes support Czech (`cs`, default), English (`en`), and Russian (`ru`). Courses, vacancies, and team records can provide language-specific content. Add translations when publishing; a localized URL does not automatically translate its content. Existing blog records and the privacy document currently use Czech copy.

Blog records may declare `contentLanguage` (`cs`, `en`, or `ru`); legacy records default to Czech. This source language controls article markup and structured data independently of the interface language.

Multilingual records use a `languages` object; the data loaders provide fallback behavior where applicable. For example, a course in preparation can use:

```json
{
  "slug": "example",
  "status": "upcoming",
  "topics": ["Example"],
  "languages": {
    "cs": { "title": "...", "description": "...", "duration": "", "level": "Upřesníme" },
    "en": { "title": "...", "description": "...", "duration": "", "level": "To be confirmed" },
    "ru": { "title": "...", "description": "...", "duration": "", "level": "Уточняется" }
  }
}
```

### Dynamic Data Management

- **Courses**: [data/courses.json](data/courses.json)
- **Blog Posts**: [data/posts.json](data/posts.json)
- **Vacancies**: [data/vacancies.json](data/vacancies.json)
- **Team Members & Lecturers**: [data/team.json](data/team.json)

Use the TypeScript data loaders when rendering content. Course availability and facts must come from the course record, not hardcoded homepage assumptions.

### Publishing Courses

- `active` courses appear in the catalog, enquiry selector, and sitemap. The homepage previews up to six in source order, with a link to the full catalog.
- `upcoming` courses are clearly marked as being prepared and cannot be enrolled in. C#, Java, JavaScript, AI, and other future directions must remain in this state until their offers are ready.
- `sessions` stores ISO start/end dates. Already-started cohorts are excluded using the Prague calendar day; the homepage's next-start link considers all published courses.
- `price` is the confirmed full CZK price. Omit it or use `null` when unconfirmed. Possible Labour Office funding is conditional and must not become a guaranteed free offer.
- Each course owns its level, format, curriculum, funding, assessment, and FAQ. `experience: "python-web"` enables only the existing Python-specific learning demo and format content; do not copy that flag into unrelated courses.

The legacy localized `/home` routes redirect to the main language homepage. Public course paths are `/cs/kurzy`, `/en/courses`, and `/ru/kursy`.

### Design And Brand

[design-principles.md](design-principles.md) defines the mandatory brand, typography, color, composition, component, accessibility, and responsive rules. [app/globals.css](app/globals.css) implements the tokens, with reusable sections under [app/[lang]/components](app/%5Blang%5D/components). When changing a shared rule, update the principles, implementation, and relevant checks together; existing styles are not an exemption from the rules.

### SEO Features

- Automatic sitemap generation
- Structured data (JSON-LD) for courses, blog posts, and job postings
- Hreflang tags for all language variants
- Open Graph and Twitter Card metadata
- Canonical URLs

## 🔧 Configuration

### Environment Variables

Set these in your local environment or deployment provider. Never commit credentials.

```bash
NEXT_PUBLIC_SITE_URL=https://expansepi.com
```

`NEXT_PUBLIC_SITE_URL` defines canonical URLs and the allowed production origin for the contact API. Set it to the exact public origin of the deployment.

#### Transactional email

The contact form picks a provider at runtime, preferring the one with the narrower credential:

1. `RESEND_API_KEY` — **preferred**. A Resend API key is scoped to sending and can be revoked on its own. Requires the sending domain to be verified in Resend.
2. `GMAIL_USER` + `GMAIL_PASS` — fallback via SMTP. A Gmail app password grants full access to the mailbox, including reading it, and bypasses 2FA, so treat it as a high-value credential and migrate to Resend when practical.

If neither is configured the form returns a generic failure and logs the error type; it never reveals the configuration state to the caller. Never expose either credential as a `NEXT_PUBLIC_*` value.

#### Abuse controls

The contact API rate-limits per client IP, which requires a proxy that rewrites forwarding headers. On Vercel this is automatic (`VERCEL=1`). When self-hosting behind such a proxy, set `TRUST_PROXY_HEADERS=true`; without it the API cannot distinguish clients and applies a single shared bucket instead of trusting a spoofable header. A per-instance ceiling applies in both cases.

#### Analytics

Optional Google Ads configuration uses `NEXT_PUBLIC_GOOGLE_ADS_ID` and `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL`. No analytics or advertising tag is loaded until the visitor accepts cookies. `NEXT_OUTPUT_DIR` selects an isolated Next.js build directory when needed.

### Adding New Content

See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed instructions on:
- Adding new courses
- Publishing blog posts
- Managing job vacancies
- Adding team members and lecturers
- Customizing styles

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🚢 Deploy

The easiest way to deploy is using [Vercel](https://vercel.com):

```bash
npm run build
vercel deploy
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Before Launch

- Confirm any unresolved course prices, timetables, attendance rules, and funding conditions.
- Supply real instructor photographs and replace unfinished article content; do not invent student outcomes or substitute portraits.
- Verify live email delivery with the deployment's configured origin and credentials. Browser tests intentionally do not exercise real email delivery.
- Run `npm audit` and review dependency advisories before deployment. The design review identified advisories in existing dependencies, including Next.js; a successful build is not a security clearance.

## 📝 License

Copyright © eXpansePi. All rights reserved.
