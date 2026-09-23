import Image from "next/image"
import type { Course } from "@/types/course"

interface PyCharmPromoProps {
    lang: 'cs' | 'en' | 'ru'
    license?: Course["softwareLicense"]
}

export default function PyCharmPromo({ lang, license }: PyCharmPromoProps) {
    if (!license) return null
    const duration = new Intl.NumberFormat(lang, { style: "unit", unit: "month", unitDisplay: "long" }).format(license.months)
    const translations = {
        cs: {
            badge: "Licence od partnera JetBrains",
            title: `${license.product} na ${duration} zdarma`,
            description: "Díky našemu partnerství získáte licenci vývojového prostředí. Nabízí doplňování kódu, kontrolu chyb a nástroje pro ladění vašich projektů."
        },
        en: {
            badge: "A licence from our partner JetBrains",
            title: `${license.product} free for ${duration}`,
            description: "Our partnership gives you a development environment licence with code completion, error checking and tools for debugging your projects."
        },
        ru: {
            badge: "Лицензия от нашего партнёра JetBrains",
            title: `${license.product} бесплатно на ${duration}`,
            description: "Благодаря партнёрству вы получите лицензию среды разработки с дополнением кода, проверкой ошибок и инструментами для отладки проектов."
        }
    }

    const t = translations[lang]

    return (
        <aside className="software-benefit" aria-label={t.title}>
            <a href={license.url} target="_blank" rel="noopener noreferrer" className="software-benefit-logo" aria-label={license.product}>
                <Image src={license.logo} alt={license.product} width={266} height={79} />
            </a>
            <div>
                <p className="software-benefit-label">{t.badge}</p>
                <h2>{t.title}</h2>
                <p>{t.description}</p>
            </div>
        </aside>
    )
}
