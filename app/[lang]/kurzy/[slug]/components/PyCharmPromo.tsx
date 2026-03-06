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
        <div className="glow-box relative bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden group">
            {/* Background gradients for premium feel */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-blue-500/10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

            {/* Content wrapper */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-center gap-6 sm:gap-8">

                {/* Logo area */}
                <a
                    href="https://www.jetbrains.com/pycharm/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 bg-white/5 p-5 sm:p-6 rounded-2xl border border-white/10 backdrop-blur-sm shadow-inner group-hover:scale-105 transition-transform duration-500 flex items-center justify-center cursor-pointer"
                    title="Official JetBrains PyCharm website"
                >
                    <Image
                        src="/jetbrains/PyCharm-white.svg"
                        alt="PyCharm Logo"
                        width={160}
                        height={160}
                        className="w-24 h-24 sm:w-36 sm:h-36 object-contain drop-shadow-lg"
                    />
                </a>

                {/* Text area */}
                <div className="flex-1 text-center sm:text-left mt-1 sm:mt-0">
                    <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm sm:text-base font-extrabold tracking-wider shadow-md border border-pink-400/30">
                        {t.badge}
                    </div>
                    <h3 className="text-xl sm:text-xl font-extrabold text-white mb-3 tracking-tight leading-tight">
                        {t.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-medium">
                        {t.description}
                    </p>
                </div>

            </div>
        </div>
    )
}
