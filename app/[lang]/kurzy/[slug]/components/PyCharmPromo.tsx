import Image from "next/image"

interface PyCharmPromoProps {
    lang: 'cs' | 'en' | 'ru'
}

export default function PyCharmPromo({ lang }: PyCharmPromoProps) {
    const translations = {
        cs: {
            badge: "LIMITOVANÁ AKCE PRO PRVNÍCH 50 PŘIHLÁŠENÝCH",
            title: "Získejte licenci PyCharm Professional na 6 měsíců ZDARMA",
            description: "Co to znamená? PyCharm je špičkový chytrý editor od JetBrains. Bude vaším osobním asistentem – sám vám bude napovídat při psaní kódu, odhalovat chyby a obrovsky vám usnadní učení. Začněte rovnou v nástroji, který používají profesionálové z Microsoftu nebo Googlu."
        },
        en: {
            badge: "LIMITED OFFER FOR THE FIRST 50 APPLICANTS",
            title: "Get a PyCharm Professional license for 6 months FREE",
            description: "What does this mean? PyCharm is a top-tier smart editor from JetBrains. It will act as your personal assistant – auto-completing your code, spotting errors, and massively accelerating your learning. Start out in the same tool used by professionals at Microsoft and Google."
        },
        ru: {
            badge: "ОГРАНИЧЕННАЯ АКЦИЯ ДЛЯ ПЕРВЫХ 50 УЧАСТНИКОВ",
            title: "Получите лицензию PyCharm Professional на 6 месяцев БЕСПЛАТНО",
            description: "Что это значит? PyCharm — это передовой умный редактор от JetBrains. Он станет вашим личным помощником: сам подскажет код, найдет ошибки и невероятно ускорит ваше обучение. Начните прямо сейчас в инструменте, который используют профессионалы из Microsoft и Google."
        }
    }

    const t = translations[lang]

    return (
        <div className="glow-box relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg overflow-hidden group border border-gray-100">
            {/* Background gradients for subtle accent */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-transparent to-sky-50/40 pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-sky-100/40 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-sky-400 to-emerald-400" />

            {/* Content wrapper */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-center gap-6 sm:gap-8">

                {/* Logo area */}
                <a
                    href="https://www.jetbrains.com/pycharm/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 bg-white p-5 sm:p-6 rounded-2xl border-2 border-blue-200 shadow-md group-hover:scale-105 transition-transform duration-500 flex items-center justify-center cursor-pointer ring-1 ring-blue-100"
                    title="Official JetBrains PyCharm website"
                >
                    <Image
                        src="/jetbrains/PyCharm.svg"
                        alt="PyCharm Logo"
                        width={160}
                        height={160}
                        className="w-24 h-24 sm:w-36 sm:h-36 object-contain drop-shadow-lg"
                    />
                </a>

                {/* Text area */}
                <div className="flex-1 text-center sm:text-left mt-1 sm:mt-0">
                    <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 text-white text-sm sm:text-base font-extrabold tracking-wider shadow-md">
                        {t.badge}
                    </div>
                    <h3 className="text-xl sm:text-xl font-extrabold text-gray-900 mb-3 tracking-tight leading-tight">
                        {t.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium">
                        {t.description}
                    </p>
                </div>

            </div>
        </div>
    )
}
