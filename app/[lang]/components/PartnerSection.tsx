import Image from "next/image"
import type { Language } from "@/i18n/config"
import { getSiteCopy } from "@/i18n/site"

export default function PartnerSection({ lang }: { lang: Language }) {
  const copy = getSiteCopy(lang).partners

  return (
    <section className="partner-section" aria-labelledby="partners-title">
      <div className="container partners-inner">
        <div className="partner-intro">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 id="partners-title">{copy.title}</h2>
        </div>
        <a className="partner-link" href="https://www.microsoft.com/" target="_blank" rel="noopener noreferrer">
          <span className="partner-logo-frame"><Image src="/microsoft/microsoft-white.svg" alt="Microsoft" width={338} height={72} /></span>
          <span>{copy.microsoft}</span>
        </a>
        <a className="partner-link" href="https://www.jetbrains.com/" target="_blank" rel="noopener noreferrer">
          <span className="partner-logo-frame"><Image src="/jetbrains/jetbrains.svg" alt="JetBrains" width={298} height={64} /></span>
          <span>{copy.jetbrains}</span>
        </a>
      </div>
    </section>
  )
}