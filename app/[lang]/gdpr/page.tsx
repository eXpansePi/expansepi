import type { Metadata } from "next"
import Navigation from "../components/Navigation"
import Footer from "../components/Footer"
import { getTranslations } from "@/i18n/index"
import { isValidLanguage, defaultLanguage, type Language } from "@/i18n/config"
import { getRoutePath } from "@/lib/routes"

interface GdprPageProps {
    params: Promise<{ lang: string }>
}

export function generateStaticParams() {
    return [
        { lang: 'cs' },
        { lang: 'en' },
        { lang: 'ru' }
    ]
}

export async function generateMetadata({ params }: GdprPageProps): Promise<Metadata> {
    const resolvedParams = await params
    const lang = isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage
    const t = getTranslations(lang)
    return {
        title: t.common.gdpr,
        description: "Zásady ochrany osobních údajů",
    }
}

export default async function GdprPage({ params }: GdprPageProps) {
    const resolvedParams = await params
    const lang = (isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage) as Language
    const t = getTranslations(lang)

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navigation activePage={getRoutePath(lang, 'gdpr')} lang={lang} t={t} />

            <main className="flex-grow">
                {/* ── Hero Section ───────────────────────────────────────────────── */}
                <section className="relative pt-24 sm:pt-28 pb-10 sm:pb-14 px-4 sm:px-6 bg-gradient-to-br from-blue-50/80 via-white to-emerald-50/60 overflow-hidden">
                    <div className="absolute top-16 right-0 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-30 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-20 pointer-events-none" />

                    <div className="max-w-4xl mx-auto relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100/80 text-blue-700 rounded-full text-sm font-medium mb-5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            GDPR
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
                            Zásady ochrany osobních údajů
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                            Vaše soukromí je pro nás důležité. Zde najdete přehledné informace o tom, jak nakládáme s vašimi daty.
                        </p>
                    </div>
                </section>

                {/* ── Content Section ─────────────────────────────────────────── */}
                <section className="px-4 sm:px-6 pb-16 sm:pb-20 -mt-6">
                    <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10">

                        {/* Article 1 & 2 */}
                        <article className="glow-box bg-white rounded-2xl shadow-lg overflow-hidden relative">
                            <div className="h-1.5 bg-gradient-to-r from-blue-600 via-sky-400 to-sky-300" />
                            <div className="p-6 sm:p-8 text-gray-700">

                                <div className="mb-8 relative z-10">
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">I.</span>
                                        Základní ustanovení
                                    </h3>
                                    <ul className="space-y-3 list-none pl-11 text-base sm:text-lg leading-relaxed relative">
                                        <li className="relative before:content-['•'] before:absolute before:-left-6 before:text-blue-500 before:font-bold">
                                            <strong>Správcem osobních údajů</strong> podle čl. 4 bod 7 nařízení Evropského parlamentu a Rady (EU) 2016/679 (GDPR) je <strong>eXpansePi s.r.o</strong>, IČ 19145535, se sídlem Rybná 716/24, Staré Město, 110 00 Praha (dále jen: „správce“).
                                        </li>
                                        <li className="relative before:content-['•'] before:absolute before:-left-6 before:text-blue-500 before:font-bold">
                                            <strong>Kontaktní údaje správce:</strong>
                                            <div className="mt-2 pl-4 py-3 bg-gray-50 rounded-xl space-y-1 text-sm sm:text-base border border-gray-100">
                                                <p><strong>Adresa:</strong> Rybná 716/24, Staré Město, 110 00 Praha</p>
                                                <p><strong>Email:</strong> info@expansepi.com</p>
                                                <p><strong>Telefon:</strong> +420 775 715 700</p>
                                            </div>
                                        </li>
                                        <li className="relative before:content-['•'] before:absolute before:-left-6 before:text-blue-500 before:font-bold">
                                            Osobními údaji se rozumí veškeré informace o identifikované nebo identifikovatelné fyzické osobě.
                                        </li>
                                        <li className="relative before:content-['•'] before:absolute before:-left-6 before:text-blue-500 before:font-bold">
                                            Správce nejmenoval pověřence pro ochranu osobních údajů.
                                        </li>
                                    </ul>
                                </div>

                                <hr className="border-gray-100 my-6" />

                                <div className="relative z-10">
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">II.</span>
                                        Zdroje a kategorie zpracovávaných osobních údajů
                                    </h3>
                                    <ul className="space-y-3 list-none pl-11 text-base sm:text-lg leading-relaxed relative">
                                        <li className="relative before:content-['•'] before:absolute before:-left-6 before:text-blue-500 before:font-bold">
                                            Správce zpracovává osobní údaje, které jste mu poskytl/a nebo osobní údaje, které správce získal na základě plnění Vaší objednávky.
                                        </li>
                                        <li className="relative before:content-['•'] before:absolute before:-left-6 before:text-blue-500 before:font-bold">
                                            Správce zpracovává Vaše identifikační a kontaktní údaje a údaje nezbytné pro plnění smlouvy.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </article>

                        {/* Article 3 & 4 */}
                        <article className="glow-box bg-white rounded-2xl shadow-lg overflow-hidden relative">
                            <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400" />
                            <div className="p-6 sm:p-8 text-gray-700">
                                <div className="mb-8 relative z-10">
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold">III.</span>
                                        Zákonný důvod a účel
                                    </h3>
                                    <div className="pl-11 space-y-6 text-base sm:text-lg leading-relaxed">
                                        <div>
                                            <p className="font-semibold text-gray-900 mb-2">Zákonným důvodem zpracování je:</p>
                                            <ul className="space-y-2 list-none pl-2">
                                                <li className="relative pl-6 before:content-['✓'] before:absolute before:left-0 before:text-emerald-500 before:font-bold">Plnění smlouvy mezi Vámi a správcem.</li>
                                                <li className="relative pl-6 before:content-['✓'] before:absolute before:left-0 before:text-emerald-500 before:font-bold">Plnění zákonných povinností vyplývajících z předpisů upravujících akreditace (zákon č. 563/2004 Sb. a vyhláška č. 176/2009 Sb.).</li>
                                                <li className="relative pl-6 before:content-['✓'] before:absolute before:left-0 before:text-emerald-500 before:font-bold">Oprávněný zájem správce na poskytování přímého marketingu.</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 mb-2">Účelem zpracování je:</p>
                                            <ul className="space-y-2 list-none pl-2">
                                                <li className="relative pl-6 before:content-['✓'] before:absolute before:left-0 before:text-emerald-500 before:font-bold">Vyřízení Vaší objednávky a výkon práv ze smluvního vztahu. Bez nutných údajů není možné smlouvu uzavřít.</li>
                                                <li className="relative pl-6 before:content-['✓'] before:absolute before:left-0 before:text-emerald-500 before:font-bold">Zasílání obchodních sdělení a další marketingové aktivity.</li>
                                            </ul>
                                        </div>
                                        <p className="text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                                            Ze strany správce nedochází k automatickému individuálnímu rozhodování ve smyslu čl. 22 GDPR.
                                        </p>
                                    </div>
                                </div>

                                <hr className="border-gray-100 my-6" />

                                <div className="relative z-10">
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold">IV.</span>
                                        Doba uchovávání údajů
                                    </h3>
                                    <ul className="space-y-3 list-none pl-11 text-base sm:text-lg leading-relaxed relative">
                                        <li className="relative before:content-['•'] before:absolute before:-left-6 before:text-emerald-500 before:font-bold">
                                            Správce uchovává osobní údaje po dobu nezbytnou k výkonu práv a povinností ze smluvního vztahu (<strong>po dobu 10 let</strong> z důvodu zákonné archivační povinnosti u akreditovaných kurzů).
                                        </li>
                                        <li className="relative before:content-['•'] before:absolute before:-left-6 before:text-emerald-500 before:font-bold">
                                            Údaje pro marketingové účely jsou uchovávány nejdéle 3 roky nebo do odvolání souhlasu. Po uplynutí doby správce údaje vymaže.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </article>

                        {/* Article 5 & 6 */}
                        <article className="glow-box bg-white rounded-2xl shadow-lg overflow-hidden relative">
                            <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                            <div className="p-6 sm:p-8 text-gray-700">

                                <div className="mb-8 relative z-10">
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">V.</span>
                                        Příjemci osobních údajů
                                    </h3>
                                    <ul className="space-y-3 list-none pl-11 text-base sm:text-lg leading-relaxed relative">
                                        <li className="relative before:content-['•'] before:absolute before:-left-6 before:text-indigo-500 before:font-bold">Osoby podílející se na dodání služeb a realizaci plateb na základě smlouvy.</li>
                                        <li className="relative before:content-['•'] before:absolute before:-left-6 before:text-indigo-500 before:font-bold">Osoby zajišťující provoz technických služeb a marketingové služby.</li>
                                        <li className="relative before:content-['•'] before:absolute before:-left-6 before:text-indigo-500 before:font-bold"><strong>Ministerstvo školství, mládeže a tělovýchovy (MŠMT)</strong> a <strong>Úřad práce ČR</strong> (administrace a kontrola rekvalifikací).</li>
                                        <li className="relative before:content-['•'] before:absolute before:-left-6 before:text-indigo-500 before:font-bold"><strong>Poskytovatelé analytických a marketingových nástrojů</strong> (zejména společnost Google LLC za účelem optimalizace reklamních kampaní).</li>
                                    </ul>
                                    <div className="mt-4 pl-11">
                                        <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 text-sm sm:text-base">
                                            <strong>Předávání do třetích zemí:</strong> V souvislosti s využíváním služeb společnosti Google LLC dochází k předávání do USA, zabezpečeno na základě rozhodnutí o odpovídající ochraně (Data Privacy Framework).
                                        </div>
                                    </div>
                                </div>

                                <hr className="border-gray-100 my-6" />

                                <div className="relative z-10">
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">VI.</span>
                                        Vaše práva
                                    </h3>
                                    <ul className="space-y-3 list-none pl-11 text-base sm:text-lg leading-relaxed relative">
                                        <li className="relative before:content-['•'] before:absolute before:-left-6 before:text-indigo-500 before:font-bold">Právo na přístup, opravu, omezení zpracování, výmaz, přenositelnost a právo vznést námitku.</li>
                                        <li className="relative before:content-['•'] before:absolute before:-left-6 before:text-indigo-500 before:font-bold">Právo odvolat souhlas písemně nebo elektronicky na adresu správce.</li>
                                        <li className="relative before:content-['•'] before:absolute before:-left-6 before:text-indigo-500 before:font-bold">Právo podat stížnost u Úřadu pro ochranu osobních údajů.</li>
                                    </ul>
                                </div>

                            </div>
                        </article>

                        {/* Article 7 & 8 */}
                        <article className="glow-box bg-white rounded-2xl shadow-lg overflow-hidden relative border border-gray-100">
                            <div className="h-1.5 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-200" />
                            <div className="p-6 sm:p-8 text-gray-700 bg-gradient-to-br from-white to-gray-50/50">

                                <div className="mb-8 relative z-10">
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-sm font-bold">VII.</span>
                                        Zabezpečení údajů
                                    </h3>
                                    <ul className="space-y-3 list-none pl-11 text-base sm:text-lg leading-relaxed relative">
                                        <li className="relative before:content-['•'] before:absolute before:-left-6 before:text-gray-400 before:font-bold">Správce přijal veškerá technická a organizační opatření (šifrování, hesla) k zabezpečení úložišť dat.</li>
                                        <li className="relative before:content-['•'] before:absolute before:-left-6 before:text-gray-400 before:font-bold">Nezpracováváme osobní údaje v listinné podobě.</li>
                                        <li className="relative before:content-['•'] before:absolute before:-left-6 before:text-gray-400 before:font-bold">Přístup mají pouze pověřené osoby.</li>
                                    </ul>
                                </div>

                                <hr className="border-gray-200 my-6" />

                                <div className="relative z-10">
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-sm font-bold">VIII.</span>
                                        Závěrečná ustanovení
                                    </h3>
                                    <ul className="space-y-3 list-none pl-11 text-base sm:text-lg leading-relaxed relative mb-6">
                                        <li className="relative before:content-['•'] before:absolute before:-left-6 before:text-gray-400 before:font-bold">Odesláním objednávky potvrzujete, že jste seznámen/a s těmito podmínkami a přijímáte je.</li>
                                        <li className="relative before:content-['•'] before:absolute before:-left-6 before:text-gray-400 before:font-bold">Souhlasíte s nimi zaškrtnutím souhlasu ve formuláři (či odesláním).</li>
                                        <li className="relative before:content-['•'] before:absolute before:-left-6 before:text-gray-400 before:font-bold">Správce je oprávněn tyto podmínky měnit a nové verze zveřejnit na webu.</li>
                                    </ul>

                                    <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-center font-medium border border-emerald-100 shadow-sm mt-8">
                                        Tyto podmínky nabývají účinnosti dnem 6. 3. 2026.
                                    </div>
                                </div>

                            </div>
                        </article>

                    </div>
                </section>
            </main>

            <Footer lang={lang} />
        </div>
    )
}
