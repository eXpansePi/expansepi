import type { Metadata } from "next"
import Navigation from "../components/Navigation"
import Footer from "../components/Footer"
import { getTranslations } from "@/i18n/index"
import { isValidLanguage, defaultLanguage } from "@/i18n/config"
import { getRoutePath } from "@/lib/routes"
import { getPolicyDocument, type PolicyBlock } from "./policy-content"

interface GdprPageProps {
  params: Promise<{ lang: string }>
}

export function generateStaticParams() {
  return ["cs", "en", "ru"].map(lang => ({ lang }))
}

export async function generateMetadata({ params }: GdprPageProps): Promise<Metadata> {
  const { lang: routeLang } = await params
  const lang = isValidLanguage(routeLang) ? routeLang : defaultLanguage
  const policy = getPolicyDocument(lang)
  return { title: getTranslations(lang).common.gdpr, description: policy.title }
}

function PolicyBlocks({ blocks, chapterIndex }: { blocks: PolicyBlock[]; chapterIndex: number }) {
  return (
    <>
      {blocks.map((block, index) => {
        const key = `${chapterIndex}-${index}`
        if (block.kind === "paragraph") return <p key={key}>{block.text}</p>
        if (block.kind === "note") {
          return (
            <p className="policy-note" key={key}>
              {block.lead && <strong>{block.lead}</strong>}
              {block.text}
            </p>
          )
        }
        return (
          <ul key={key}>
            {block.items.map((item, itemIndex) => (
              <li key={`${key}-${itemIndex}`}>
                {item.lead && <strong>{item.lead}</strong>}
                {item.text}
                {item.lines && (
                  <div className="policy-note">
                    {item.lines.map(line => <p key={line}>{line}</p>)}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )
      })}
    </>
  )
}

export default async function GdprPage({ params }: GdprPageProps) {
  const { lang: routeLang } = await params
  const lang = isValidLanguage(routeLang) ? routeLang : defaultLanguage
  const t = getTranslations(lang)
  const policy = getPolicyDocument(lang)

  return (
    <>
      <Navigation activePage={getRoutePath(lang, "gdpr")} lang={lang} t={t} />
      <main id="main-content" className="site-main">
        <section className="page-intro"><div className="container"><p className="eyebrow">{policy.eyebrow}</p><h1>{policy.title}</h1><p className="lead">{policy.lead}</p></div></section>
        <div className="section"><div className="container policy-layout">
          <nav className="policy-toc" aria-labelledby="policy-toc-title"><h2 id="policy-toc-title">{policy.tableOfContents}</h2><ol>{policy.chapters.map((chapter, index) => <li key={chapter.number}><a href={`#policy-${index + 1}`}><span>{chapter.number}</span>{chapter.title}</a></li>)}</ol></nav>
          <article className="policy-document">
            {policy.chapters.map((chapter, index) => (
              <section className="policy-chapter" id={`policy-${index + 1}`} aria-labelledby={`policy-title-${index + 1}`} key={chapter.number}>
                <h2 id={`policy-title-${index + 1}`}><span>{chapter.number}</span>{chapter.title}</h2>
                <PolicyBlocks blocks={chapter.blocks} chapterIndex={index} />
              </section>
            ))}
            <p className="policy-effective">{policy.effective}</p>
          </article>
        </div></div>
      </main>
      <Footer lang={lang} />
    </>
  )
}