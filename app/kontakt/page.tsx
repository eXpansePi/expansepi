import Navigation from "../components/Navigation"

export default function Kontakt() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation activePage="/kontakt" />

      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">Kontakt</h1>
          <p className="text-lg sm:text-xl text-gray-700 mb-8 sm:mb-12">
            Máte otázky? Rádi vám pomůžeme. Kontaktujte nás prostřednictvím formuláře nebo přímo.
          </p>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 border border-gray-100">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Kontaktní informace</h2>
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-600">
                <p>
                  <strong className="text-gray-900">Email:</strong><br />
                  info@expansepi.cz
                </p>
                <p>
                  <strong className="text-gray-900">Telefon:</strong><br />
                  +420 123 456 789
                </p>
                <p>
                  <strong className="text-gray-900">Adresa:</strong><br />
                  Praha, Česká republika
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 border border-gray-100">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Kontaktní formulář</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Jméno
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Zpráva
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Odeslat
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

