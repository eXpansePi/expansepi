import Link from "next/link"
import Navigation from "../components/Navigation"

export default function Blog() {
  const posts = [
    {
      title: "Začínáme s Pythonem: První kroky",
      date: "15. ledna 2024",
      excerpt: "Průvodce pro úplné začátečníky, kteří se chtějí naučit programovat v Pythonu.",
      category: "Python",
    },
    {
      title: "5 důvodů, proč se rekvalifikovat do IT",
      date: "10. ledna 2024",
      excerpt: "Proč je IT sektor ideální volbou pro změnu kariéry a jak začít.",
      category: "Kariéra",
    },
    {
      title: "Datová analýza v praxi",
      date: "5. ledna 2024",
      excerpt: "Jak používat Python a pandas pro analýzu reálných datových sad.",
      category: "Data",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation activePage="/blog" />

      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">Blog</h1>
          <p className="text-lg sm:text-xl text-gray-700 mb-8 sm:mb-12">
            Články, tipy a návody z oblasti IT vzdělávání a programování.
          </p>

          <div className="space-y-6 sm:space-y-8">
            {posts.map((post, index) => (
              <article
                key={index}
                className="bg-white rounded-lg shadow-md p-6 sm:p-8 hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-semibold">
                    {post.category}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500">{post.date}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">{post.title}</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">{post.excerpt}</p>
                <Link
                  href="#"
                  className="text-sm sm:text-base text-blue-600 font-semibold hover:text-blue-700 transition-colors inline-flex items-center gap-2"
                >
                  Číst více →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

