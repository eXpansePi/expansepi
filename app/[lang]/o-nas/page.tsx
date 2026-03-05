import type { Metadata } from "next"
import Navigation from "../components/Navigation"
import Footer from "../components/Footer"
import { getTranslations } from "@/i18n/index"
import { isValidLanguage, defaultLanguage, type Language } from "@/i18n/config"
import { getRoutePath } from "@/lib/routes"
import { getAllTeamMembers, getAllLecturers } from "@/data/team"
import TeamMemberCard from "./components/TeamMemberCard"
import LecturerCard from "./components/LecturerCard"

interface AboutPageProps {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const lang = isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage
  const t = getTranslations(lang)
  return {
    title: t.about.title,
    description: t.about.description,
  }
}

// Helper function to convert **text** to <strong>text</strong> and handle line breaks
function formatText(text: string) {
  const result: React.ReactNode[] = []
  let remainingText = text
  let keyCounter = 0

  // Process text: find bold sections (including those with newlines) and regular text
  while (remainingText.length > 0) {
    // Look for **text** pattern (may contain newlines)
    const boldMatch = remainingText.match(/^\*\*((?:[^*]|\*(?!\*))*?)\*\*/)

    if (boldMatch) {
      // Found bold text - handle newlines within it
      const boldContent = boldMatch[1]
      const boldLines = boldContent.split('\n')

      result.push(
        <strong key={keyCounter++}>
          {boldLines.map((line, lineIdx) => (
            <span key={lineIdx}>
              {line}
              {lineIdx < boldLines.length - 1 && <br />}
            </span>
          ))}
        </strong>
      )
      remainingText = remainingText.slice(boldMatch[0].length)
    } else {
      // No bold marker - find next bold marker or end of text
      const nextBold = remainingText.indexOf('**')
      if (nextBold === -1) {
        // No more bold markers - handle remaining text with newlines
        const lines = remainingText.split('\n')
        lines.forEach((line, lineIdx) => {
          if (line) result.push(<span key={keyCounter++}>{line}</span>)
          if (lineIdx < lines.length - 1) result.push(<br key={keyCounter++} />)
        })
        break
      } else {
        // Add text before next bold marker, handling newlines
        const beforeBold = remainingText.slice(0, nextBold)
        const lines = beforeBold.split('\n')
        lines.forEach((line, lineIdx) => {
          if (line) result.push(<span key={keyCounter++}>{line}</span>)
          if (lineIdx < lines.length - 1) result.push(<br key={keyCounter++} />)
        })
        remainingText = remainingText.slice(nextBold)
      }
    }
  }

  return result
}

export default async function AboutPage({ params }: AboutPageProps) {
  const resolvedParams = await params
  const lang = (isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage) as Language
  const t = getTranslations(lang)

  const teamMembers = getAllTeamMembers(lang)
  const lecturers = getAllLecturers(lang)

  // Extract content with type assertion for new fields
  const content = t.about.content as string[] | undefined
  const goalTitle = t.about.goalTitle as string | undefined
  const goalContent = t.about.goalContent as string[] | undefined

  // Separate motto (first element) from regular content
  const motto = content && content.length > 0 ? content[0] : undefined
  const regularContent = content && content.length > 1 ? content.slice(1) : undefined

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation activePage={getRoutePath(lang, 'about')} lang={lang} t={t} />

      <main className="flex-grow">
        {/* ── Hero Section ───────────────────────────────────────────────── */}
        <section className="relative pt-24 sm:pt-28 pb-6 sm:pb-8 px-4 sm:px-6 bg-gradient-to-br from-blue-50/80 via-white to-sky-50/60 overflow-hidden">
          {/* Decorative blurs */}
          <div className="absolute top-16 right-0 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-30 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-100 rounded-full blur-3xl opacity-20 pointer-events-none" />

          <div className="max-w-5xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100/80 text-blue-700 rounded-full text-sm font-medium mb-5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {lang === 'cs' ? 'Náš tým' : lang === 'en' ? 'Our team' : 'Наша команда'}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
              {t.about.title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-500 max-w-2xl leading-relaxed">
              {t.about.description}
            </p>
          </div>
        </section>

        {/* ── Who We Are Section ─────────────────────────────────────────── */}
        <section className="px-4 sm:px-6 py-8 sm:py-10">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
              {t.about.whoWeAre}
            </h2>

            {/* Motto - Hero Quote */}
            {motto && (
              <div className="mb-8 sm:mb-10">
                <div className="glow-box relative bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl shadow-lg p-6 sm:p-8 overflow-hidden">
                  {/* Accent bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-600 via-sky-400 to-emerald-400 rounded-l-2xl" />
                  <blockquote className="text-xl sm:text-2xl md:text-3xl font-semibold text-blue-600 leading-relaxed pl-4">
                    {formatText(motto)}
                  </blockquote>
                </div>
              </div>
            )}

            {/* Regular Content Paragraphs */}
            {regularContent && regularContent.length > 0 && (
              <div className="mb-8 sm:mb-10">
                <article className="glow-box bg-white rounded-2xl shadow-lg overflow-hidden">
                  {/* Top accent gradient */}
                  <div className="h-1 bg-gradient-to-r from-blue-600 via-sky-400 to-emerald-400" />
                  <div className="p-6 sm:p-8">
                    {regularContent.map((paragraph, index) => (
                      <p key={index} className="text-base sm:text-lg leading-relaxed mb-6 text-gray-700 last:mb-0">
                        {formatText(paragraph)}
                      </p>
                    ))}
                  </div>
                </article>
              </div>
            )}

            {/* Goal Section */}
            {goalTitle && (
              <div className="mb-8 sm:mb-10">
                <article className="glow-box bg-white rounded-2xl shadow-lg overflow-hidden">
                  {/* Top accent gradient */}
                  <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400" />
                  <div className="p-6 sm:p-8">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      {goalTitle}
                    </h3>
                    <div className="space-y-4">
                      {goalContent && Array.isArray(goalContent) && goalContent.length > 0 && goalContent.map((paragraph, index) => (
                        <p key={index} className="text-base sm:text-lg leading-relaxed text-gray-700">
                          {formatText(paragraph)}
                        </p>
                      ))}
                    </div>
                  </div>
                </article>
              </div>
            )}
          </div>
        </section>

        {/* ── Team Members Section ──────────────────────────────────────── */}
        {teamMembers.length > 0 && (
          <section aria-labelledby="team-heading" className="px-4 sm:px-6 pb-14 sm:pb-18" id="team">
            <div className="max-w-5xl mx-auto">
              <div className="mb-8">
                <h2 id="team-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {t.about.teamTitle}
                </h2>
                <p className="text-gray-500 text-sm sm:text-base">
                  {lang === 'cs' ? 'Lidé, kteří stojí za eXpansePi' : lang === 'en' ? 'The people behind eXpansePi' : 'Люди, стоящие за eXpansePi'}
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {teamMembers.map((member, index) => (
                  <TeamMemberCard key={member.id} member={member} index={index} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Lecturers Section ─────────────────────────────────────────── */}
        {lecturers.length > 0 && (
          <section aria-labelledby="lecturers-heading" className="px-4 sm:px-6 pb-16 sm:pb-20" id="lecturers">
            <div className="max-w-5xl mx-auto">
              <div className="mb-8">
                <h2 id="lecturers-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {t.about.lecturersTitle}
                </h2>
                {t.about.lecturerDefinition && (
                  <p className="text-gray-500 text-sm sm:text-base">
                    {t.about.lecturerDefinition}
                  </p>
                )}
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {lecturers.map((lecturer, index) => (
                  <LecturerCard key={lecturer.id} lecturer={lecturer} index={index} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer lang={lang} />
    </div>
  )
}
