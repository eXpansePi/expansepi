import Link from "next/link"
import teamData from "@/data/team.json"
import { getRoutePath } from "@/lib/routes"
import { type Language } from "@/i18n/config"

interface CourseTrustSectionProps {
    lang: Language
    lecturerIds?: string[]
}

interface LecturerLangData {
    specializations: string[]
    description: string
}

const translations = {
    cs: {
        sectionTitle: "Kdo vás bude učit",
        sectionSubtitle: "Naši lektoři jsou aktivní vývojáři z firem jako Rapid7, Grant Thornton a Azul Systems. Učí vás to, co sami denně používají v praxi.",
        viewTeam: "Zobrazit celý tým →",
        trustTitle: "Proč nám důvěřovat",
        trustAccreditation: "Akreditováno MŠMT ČR",
        trustAccreditationDesc: "Kurz je oficiálně schválený Ministerstvem školství. Získáte uznávané osvědčení o rekvalifikaci.",
        trustLecturers: "Lektoři z praxe",
        trustLecturersDesc: "Vývojáři z firem Rapid7, Grant Thornton a Azul Systems s diplomy z MFF UK a ČVUT.",
        trustSupport: "Podpora i po kurzu",
        trustSupportDesc: "Pomůžeme vám s portfoliem, přípravou na pohovor a propojíme vás s naší komunitou absolventů.",
    },
    en: {
        sectionTitle: "Meet your lecturers",
        sectionSubtitle: "Our lecturers are active developers at companies like Rapid7, Grant Thornton, and Azul Systems. They teach what they use daily in practice.",
        viewTeam: "View full team →",
        trustTitle: "Why trust us",
        trustAccreditation: "MŠMT Accredited",
        trustAccreditationDesc: "The course is officially approved by the Ministry of Education. You'll receive a recognized retraining certificate.",
        trustLecturers: "Industry lecturers",
        trustLecturersDesc: "Developers from Rapid7, Grant Thornton, and Azul Systems with degrees from Charles University and CTU Prague.",
        trustSupport: "Support after the course",
        trustSupportDesc: "We'll help with your portfolio, interview preparation, and connect you with our graduate community.",
    },
    ru: {
        sectionTitle: "Ваши преподаватели",
        sectionSubtitle: "Наши преподаватели — действующие разработчики из Rapid7, Grant Thornton и Azul Systems. Они учат тому, что сами используют каждый день.",
        viewTeam: "Показать всю команду →",
        trustTitle: "Почему нам доверяют",
        trustAccreditation: "Аккредитовано МШМТ",
        trustAccreditationDesc: "Курс официально одобрен Министерством образования. Вы получите признанный сертификат переподготовки.",
        trustLecturers: "Преподаватели-практики",
        trustLecturersDesc: "Разработчики из Rapid7, Grant Thornton и Azul Systems с дипломами Карлова университета и ЧВУТ.",
        trustSupport: "Поддержка после курса",
        trustSupportDesc: "Поможем с портфолио, подготовкой к собеседованию и подключим вас к сообществу выпускников.",
    },
}

function parseTitleLines(title: string) {
    return title.split("\n").filter(Boolean)
}

export default function CourseTrustSection({ lang, lecturerIds = ["5"] }: CourseTrustSectionProps) {
    const t = translations[lang]

    const allMembers = [...teamData.lecturers, ...teamData.teamMembers]
    const featuredLecturers = allMembers.filter(l =>
        lecturerIds.includes(l.id)
    )

    return (
        <>
            {/* ── Lecturers Section ────────────────────────────────────── */}
            <section className="px-4 sm:px-6 mb-8 sm:mb-10">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        {t.sectionTitle}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-500 mb-6 max-w-3xl">
                        {t.sectionSubtitle}
                    </p>

                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 mb-4">
                        {featuredLecturers.map((lecturer) => {
                            const langData = lecturer.languages?.[lang] as LecturerLangData | undefined
                            const titleLines = parseTitleLines(lecturer.title)
                            return (
                                <Link
                                    key={lecturer.id}
                                    href={`${getRoutePath(lang, 'about')}#lecturer-${lecturer.id}`}
                                    className="glow-box bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 block"
                                >
                                    <div className="h-1 bg-gradient-to-r from-blue-600 to-sky-400" />
                                    <div className="p-5">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                <span className="text-blue-700 font-bold text-sm">
                                                    {lecturer.name.split(" ").map(n => n[0]).join("")}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{lecturer.name}</p>
                                                {titleLines.length > 0 && (
                                                    <p className="text-xs text-gray-500">{titleLines.filter(l => l.trim()).join(" • ")}</p>
                                                )}
                                            </div>
                                        </div>
                                        {langData && (
                                            <div className="flex flex-wrap gap-1.5">
                                                {langData.specializations.slice(0, 3).map((spec, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                                        {spec}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            )
                        })}
                    </div>

                    <Link
                        href={getRoutePath(lang, 'about')}
                        className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                        {t.viewTeam}
                    </Link>
                </div>
            </section>

            {/* ── Trust Signals Section ─────────────────────────────────── */}
            <section className="px-4 sm:px-6 mb-8 sm:mb-10">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                        {t.trustTitle}
                    </h2>
                    <div className="grid sm:grid-cols-3 gap-4 sm:gap-5">
                        {/* Accreditation */}
                        <div className="glow-box bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                            <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-400" />
                            <div className="p-5 sm:p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <h3 className="text-base font-bold text-gray-900">{t.trustAccreditation}</h3>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">{t.trustAccreditationDesc}</p>
                            </div>
                        </div>

                        {/* Lecturers */}
                        <div className="glow-box bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                            <div className="h-1 bg-gradient-to-r from-blue-600 to-sky-400" />
                            <div className="p-5 sm:p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-base font-bold text-gray-900">{t.trustLecturers}</h3>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">{t.trustLecturersDesc}</p>
                            </div>
                        </div>

                        {/* Post-course support */}
                        <div className="glow-box bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                            <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-400" />
                            <div className="p-5 sm:p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-base font-bold text-gray-900">{t.trustSupport}</h3>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">{t.trustSupportDesc}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
