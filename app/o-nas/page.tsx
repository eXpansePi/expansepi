import type { Metadata } from "next"
import Navigation from "../components/Navigation"

export const metadata: Metadata = {
  title: "O nás | eXpansePi - Rekvalifikační IT kurzy s experty z Matfyzu UK a ČVUT",
  description: "eXpansePi nabízí kvalitní rekvalifikační kurzy v IT. Naši lektoři jsou zkušení absolventi Matfyzu UK a ČVUT. Budujeme novou generaci softwarových inženýrů.",
  keywords: [
    "rekvalifikační kurzy IT",
    "IT kurzy Praha",
    "programování kurzy",
    "Python kurzy",
    "datová analýza kurzy",
    "web development kurzy",
    "Matfyz UK",
    "ČVUT",
    "softwarové inženýrství",
    "IT vzdělávání",
    "rekvalifikace IT",
    "IT kurzy pro začátečníky"
  ],
  openGraph: {
    title: "O nás | eXpansePi - Rekvalifikační IT kurzy",
    description: "Kvalitní rekvalifikační kurzy v IT s experty z Matfyzu UK a ČVUT. Budujeme novou generaci softwarových inženýrů.",
    type: "website",
    locale: "cs_CZ",
  },
  alternates: {
    canonical: "/o-nas",
  },
}

export default function ONas() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "eXpansePi",
    "description": "Moderní vzdělávací platforma zaměřená na rekvalifikační kurzy v oblasti IT",
    "url": "https://expansepi.cz",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Praha",
      "addressCountry": "CZ"
    },
    "educationalCredentialAwarded": "Rekvalifikační certifikát",
    "offers": {
      "@type": "Offer",
      "category": "Rekvalifikační kurzy IT"
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navigation activePage="/o-nas" />

        <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              O nás - Rekvalifikační IT kurzy s experty
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-lg sm:text-xl text-gray-700 mb-6 sm:mb-8">
                <strong>eXpansePi</strong> je moderní vzdělávací platforma zaměřená na <strong>rekvalifikační kurzy v oblasti IT</strong>. 
                Naším cílem je budovat novou generaci softwarových inženýrů a poskytovat kvalitní vzdělání, 
                které otevírá dveře do světa technologií.
              </p>

              <section className="mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Proč si vybrat eXpansePi?
                </h2>
                <ul className="space-y-3 sm:space-y-4 text-base sm:text-lg text-gray-700 list-none pl-0">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold text-xl mt-1">✓</span>
                    <span><strong>Zkušení lektoři</strong> - Naši lektoři jsou zkušení profesionálové, absolventi prestižních univerzit <strong>Matfyzu UK</strong> a <strong>ČVUT</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold text-xl mt-1">✓</span>
                    <span><strong>Praktické zaměření</strong> - Kurzy jsou zaměřené na praktické dovednosti potřebné v reálném IT prostředí</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold text-xl mt-1">✓</span>
                    <span><strong>Moderní technologie</strong> - Učíme nejnovější technologie a best practices z oboru</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold text-xl mt-1">✓</span>
                    <span><strong>Individuální přístup</strong> - Malé skupiny zajišťují individuální přístup ke každému studentovi</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold text-xl mt-1">✓</span>
                    <span><strong>Certifikace</strong> - Po úspěšném absolvování obdržíte certifikát o rekvalifikaci</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold text-xl mt-1">✓</span>
                    <span><strong>Kariérní podpora</strong> - Pomáháme s uplatněním v IT sektoru po absolvování kurzu</span>
                  </li>
                </ul>
              </section>

              <section className="mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Naši lektoři
                </h2>
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 sm:p-6 rounded-r-lg mb-6">
                  <p className="text-base sm:text-lg text-gray-700 mb-4">
                    Naši lektoři jsou <strong>zkušení profesionálové</strong> s bohatými praktickými zkušenostmi v IT sektoru. 
                    Všichni naši lektoři jsou <strong>absolventi prestižních českých univerzit</strong>:
                  </p>
                  <ul className="space-y-2 text-base sm:text-lg text-gray-700 list-none pl-0">
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold">•</span>
                      <span><strong>Matematicko-fyzikální fakulta Univerzity Karlovy (Matfyz UK)</strong> - Experti v oblasti matematiky, fyziky a počítačových věd</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold">•</span>
                      <span><strong>České vysoké učení technické v Praze (ČVUT)</strong> - Inženýři s praktickými zkušenostmi z reálných projektů</span>
                    </li>
                  </ul>
                  <p className="text-base sm:text-lg text-gray-700 mt-4">
                    Kombinace akademického vzdělání a praktických zkušeností zajišťuje, že naše kurzy jsou na nejvyšší úrovni 
                    a připravují studenty na skutečné výzvy IT průmyslu.
                  </p>
                </div>
              </section>

              <section className="mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Naše mise
                </h2>
                <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-gray-700">
                  <p>
                    Věříme, že <strong>každý má potenciál stát se úspěšným IT profesionálem</strong>, a proto nabízíme 
                    komplexní <strong>rekvalifikační kurzy</strong> od základů až po pokročilé techniky. Naše kurzy pokrývají 
                    širokou škálu oblastí včetně programování v Pythonu, datové analýzy, web developmentu a dalších moderních IT dovedností.
                  </p>
                  <p>
                    Zaměřujeme se nejen na teoretické znalosti, ale především na <strong>praktické dovednosti</strong>, které jsou 
                    skutečně potřebné v IT průmyslu. Naši studenti pracují na reálných projektech a získávají zkušenosti, 
                    které jim pomohou úspěšně se uplatnit na trhu práce.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Co nabízíme
                </h2>
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Rekvalifikační kurzy</h3>
                    <p className="text-gray-600">Komplexní kurzy pro změnu kariéry do IT sektoru</p>
                  </div>
                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Python programování</h3>
                    <p className="text-gray-600">Od základů až po pokročilé techniky programování</p>
                  </div>
                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Datová analýza</h3>
                    <p className="text-gray-600">Analýza dat a vizualizace s moderními nástroji</p>
                  </div>
                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Web development</h3>
                    <p className="text-gray-600">Vývoj moderních webových aplikací</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

