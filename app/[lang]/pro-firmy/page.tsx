import type { Metadata } from "next"
import { ArrowDown, ArrowRight, Code2, Database, FileText, GraduationCap, Mail, Phone, ScanText, UserRoundCheck, Workflow } from "lucide-react"
import { defaultLanguage, isValidLanguage } from "@/i18n/config"
import { getTranslations } from "@/i18n/index"
import { getBusinessCopy } from "@/i18n/business"
import { getAllRoutePaths, getRoutePath } from "@/lib/routes"
import { JsonLd } from "@/app/components/JsonLd"
import Navigation from "../components/Navigation"
import Footer from "../components/Footer"
import { BusinessEnquiry, BusinessEnquiryButton } from "../components/EnquiryDialog"
import { FAQSection, ProcessSteps, SectionHeading } from "../components/CourseSections"

interface BusinessPageProps {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: BusinessPageProps): Promise<Metadata> {
  const { lang: routeLang } = await params
  const lang = isValidLanguage(routeLang) ? routeLang : defaultLanguage
  const { title, description } = getBusinessCopy(lang).meta
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://expansepi.com"
  const routes = getAllRoutePaths("business")
  const url = `${baseUrl}${routes[lang]}`
  return {
    title,
    description,
    alternates: { canonical: url, languages: { cs: `${baseUrl}${routes.cs}`, en: `${baseUrl}${routes.en}`, ru: `${baseUrl}${routes.ru}`, "x-default": `${baseUrl}${routes.cs}` } },
    openGraph: { title, description, url, siteName: "eXpansePi", type: "website", locale: lang === "cs" ? "cs_CZ" : lang === "en" ? "en_US" : "ru_RU" },
    twitter: { card: "summary_large_image", title, description },
  }
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const { lang: routeLang } = await params
  const lang = isValidLanguage(routeLang) ? routeLang : defaultLanguage
  const t = getTranslations(lang)
  const copy = getBusinessCopy(lang)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://expansepi.com"
  const url = `${baseUrl}${getRoutePath(lang, "business")}`
  const serviceIcons = [GraduationCap, Workflow, Code2]
  const workflowIcons = [FileText, ScanText, UserRoundCheck, Database]

  return <BusinessEnquiry lang={lang} label={copy.hero.action} title={copy.enquiry.formTitle} intro={copy.hero.note} closeLabel={copy.enquiry.close}>
    <Navigation activePage={getRoutePath(lang, "business")} businessEnquiry lang={lang} t={t} />
    <main id="main-content" className="site-main business-page">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "OfferCatalog", name: copy.meta.title, url, itemListElement: copy.services.items.map(service => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: service.title, description: service.text, url: `${url}#${service.id}`, provider: { "@type": "Organization", name: "eXpansePi", url: baseUrl } } })) }} />
      <section className="page-intro business-intro" aria-labelledby="business-title">
        <div className="container">
          <p className="eyebrow">eXpansePi / {t.common.business}</p>
          <h1 id="business-title">{copy.hero.title}</h1>
          <p className="lead">{copy.hero.intro}</p>
          <p className="business-start-note">{copy.hero.note}</p>
          <div className="button-row"><BusinessEnquiryButton /><a className="text-link" href="#sluzby">{copy.hero.secondary}<ArrowDown aria-hidden="true" /></a></div>
        </div>
      </section>

      <section className="section" id="sluzby" aria-labelledby="services-title">
        <div className="container">
          <SectionHeading title={copy.services.title} text={copy.services.intro} id="services-title" />
          <div className="business-services">{copy.services.items.map((service, index) => {
            const Icon = serviceIcons[index]
            return <article className="business-service" key={service.id}><Icon className="business-service-icon" aria-hidden="true" /><h3>{service.title}</h3><p>{service.text}</p><a className="text-link" href={`#${service.id}`}>{service.action}<ArrowDown aria-hidden="true" /></a></article>
          })}</div>
        </div>
      </section>

      <section className="section surface-section" id="ai-automatizace" aria-labelledby="ai-title">
        <div className="container">
          <SectionHeading eyebrow={copy.ai.eyebrow} title={copy.ai.title} text={copy.ai.intro} id="ai-title" />
          <div className="audience-grid">{copy.ai.cases.map(item => <div className="audience-item" key={item.title}><h3>{item.title}</h3><p>{item.text}</p></div>)}</div>
          <figure className="business-workflow">
            <figcaption>{copy.ai.workflow.title}</figcaption>
            <ol>{copy.ai.workflow.steps.map((step, index) => {
              const Icon = workflowIcons[index]
              return <li key={step}><Icon className="workflow-icon" aria-hidden="true" /><span>{step}</span>{index < copy.ai.workflow.steps.length - 1 && <ArrowRight className="workflow-arrow" aria-hidden="true" />}</li>
            })}</ol>
            <p className="fine-print">{copy.ai.workflow.note}</p>
          </figure>
          <div className="business-private" id="privatni-ai">
            <h3>{copy.ai.private.title}</h3>
            <p className="reading-copy">{copy.ai.private.intro}</p>
            <dl className="business-private-options">{copy.ai.private.items.map(item => <div key={item.title}><dt>{item.title}</dt><dd>{item.text}</dd></div>)}</dl>
          </div>
          <div className="section-footnote"><p className="fine-print"><strong>{copy.outputLabel}. </strong>{copy.ai.output}</p><BusinessEnquiryButton className="text-link" /></div>
        </div>
      </section>

      <div className="container business-details">{[{ id: "skoleni", content: copy.training }, { id: "software", content: copy.software }].map(({ id, content }) => <section className="section business-detail" key={id} id={id} aria-labelledby={`${id}-title`}>
        <div><SectionHeading title={content.title} text={content.intro} id={`${id}-title`} /><p className="business-output"><strong>{copy.outputLabel}</strong>{content.output}</p></div>
        <div className="business-includes"><h3>{content.includes}</h3><ul>{content.items.map(item => <li key={item}>{item}</li>)}</ul><BusinessEnquiryButton className="text-link" /></div>
      </section>)}</div>

      <section className="section surface-section" id="spoluprace" aria-labelledby="business-process-title">
        <div className="container">
          <SectionHeading title={copy.process.title} text={copy.process.intro} id="business-process-title" />
          <ProcessSteps steps={copy.process.steps} />
          <div className="section-footnote"><p className="fine-print">{copy.process.note}</p><BusinessEnquiryButton className="text-link" /></div>
        </div>
      </section>

      <section className="section business-team" id="team" aria-labelledby="business-team-title"><div className="container"><SectionHeading title={copy.team.title} text={copy.team.intro} id="business-team-title" /></div></section>
      <FAQSection copy={copy.faq} />

      <section className="section application-section" id="poptavka" aria-labelledby="business-enquiry-title">
        <div className="container application-layout">
          <SectionHeading title={copy.enquiry.title} text={copy.enquiry.intro} id="business-enquiry-title" />
          <div className="application-action">
            <BusinessEnquiryButton />
            <p className="fine-print">{copy.enquiry.note}</p>
            <div className="business-contact"><p>{copy.enquiry.direct}</p><a className="text-link" href="mailto:info@expansepi.com"><Mail aria-hidden="true" />info@expansepi.com</a><a className="text-link" href="tel:+420775715700"><Phone aria-hidden="true" />+420 775 715 700</a></div>
          </div>
        </div>
      </section>
    </main>
    <Footer lang={lang} />
  </BusinessEnquiry>
}