import Navigation from "../components/Navigation"

export default function VolnePozice() {
  const positions = [
    {
      title: "Senior Python Developer",
      location: "Praha / Remote",
      type: "Plný úvazek",
      description: "Hledáme zkušeného Python vývojáře pro práci na moderních projektech.",
    },
    {
      title: "Data Analyst",
      location: "Brno",
      type: "Plný úvazek",
      description: "Příležitost pro datového analytika s pokročilými znalostmi Pythonu a SQL.",
    },
    {
      title: "Frontend Developer",
      location: "Praha / Remote",
      type: "Plný úvazek",
      description: "Hledáme frontend vývojáře se znalostmi React a TypeScript.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation activePage="/volne-pozice" />

      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">Volné pozice</h1>
          <p className="text-lg sm:text-xl text-gray-700 mb-8 sm:mb-12">
            Přidejte se k našemu týmu a pomozte nám budovat budoucnost IT vzdělávání.
          </p>

          <div className="space-y-4 sm:space-y-6">
            {positions.map((position, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4">
                  <div className="mb-3 sm:mb-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{position.title}</h2>
                    <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                      <span>{position.location}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{position.type}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">{position.description}</p>
                <button className="w-full sm:w-auto px-6 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                  Více informací
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

