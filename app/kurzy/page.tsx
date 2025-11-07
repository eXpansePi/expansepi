import Navigation from "../components/Navigation"

export default function Kurzy() {
  const courses = [
    {
      title: "Python pro začátečníky",
      description: "Naučte se základy programování v Pythonu od nuly.",
      duration: "8 týdnů",
    },
    {
      title: "Datová analýza",
      description: "Pokročilé techniky analýzy dat a vizualizace.",
      duration: "10 týdnů",
    },
    {
      title: "Web development",
      description: "Kompletní kurz vývoje moderních webových aplikací.",
      duration: "12 týdnů",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation activePage="/kurzy" />

      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">Naše kurzy</h1>
          <p className="text-lg sm:text-xl text-gray-700 mb-8 sm:mb-12 max-w-2xl">
            Vyberte si z nabídky rekvalifikačních kurzů — od základů Pythonu po pokročilou datovou analýzu.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {courses.map((course, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-xl transition-shadow border border-gray-100"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">{course.title}</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">{course.description}</p>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                  <span className="text-xs sm:text-sm text-gray-500">{course.duration}</span>
                  <button className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Více informací
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

