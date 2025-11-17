import type { Metadata } from "next"
import Navigation from "../components/Navigation"
import Footer from "../components/Footer"
import { getTranslations } from "@/i18n/index"
import { isValidLanguage, defaultLanguage, type Language } from "@/i18n/config"
import { getRoutePath, getAllRoutePaths } from "@/lib/routes"
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
    description: t.about.title,
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
  const about = t.about as any
  const content = about.content as string[] | undefined
  const goalTitle = about.goalTitle as string | undefined
  const goalContent = about.goalContent as string[] | undefined

  // Separate motto (first element) from regular content
  const motto = content && content.length > 0 ? content[0] : undefined
  const regularContent = content && content.length > 1 ? content.slice(1) : undefined

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Navigation activePage={getRoutePath(lang, 'about')} lang={lang} t={t} />
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 flex-grow">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 sm:mb-10">{t.about.title}</h1>
          
          {/* Who We Are Section */}
          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
              {(t.about as any).whoWeAre || 'Kdo jsme'}
            </h2>
            
            {/* Motto - Hero Quote */}
            {motto && (
              <div className="mb-6 sm:mb-8">
                <div className="glow-box bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl shadow-lg p-6 sm:p-8 border-l-4 border-blue-600">
                  <blockquote className="text-xl sm:text-2xl md:text-3xl font-semibold text-blue-600 leading-relaxed">
                    {formatText(motto)}
                  </blockquote>
                </div>
              </div>
            )}

            {/* Regular Content Paragraphs */}
            {regularContent && regularContent.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <div className="glow-box bg-white rounded-xl shadow-lg p-6 sm:p-8">
                  {regularContent.map((paragraph, index) => (
                    <p key={index} className="text-base sm:text-lg leading-relaxed mb-6 text-gray-900 last:mb-0">
                      {formatText(paragraph)}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Divider */}
            {content && goalTitle && (
              <hr className="border-gray-300 my-8 sm:my-10" />
            )}

            {/* Goal Section */}
            {goalTitle && (
              <div className="mb-6 sm:mb-8">
                <div className="glow-box bg-white rounded-xl shadow-lg p-6 sm:p-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
                    {goalTitle}
                  </h3>
                  <div className="space-y-4">
                    {goalContent && Array.isArray(goalContent) && goalContent.length > 0 && goalContent.map((paragraph, index) => (
                      <p key={index} className="text-base sm:text-lg leading-relaxed text-gray-900">
                        {formatText(paragraph)}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Team Members Section */}
          {teamMembers.length > 0 && (
            <section aria-labelledby="team-heading" className="mb-16 sm:mb-20" id="team">
              <h2 id="team-heading" className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8">
                {t.about.teamTitle}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {teamMembers.map(member => (
                  <TeamMemberCard key={member.id} member={member} />
                ))}
              </div>
            </section>
          )}

          {/* Lecturers Section */}
          {lecturers.length > 0 && (
            <section aria-labelledby="lecturers-heading" id="lecturers">
              <h2 id="lecturers-heading" className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                {t.about.lecturersTitle}
              </h2>
              {t.about.lecturerDefinition && (
                <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8">
                  {t.about.lecturerDefinition}
                </p>
              )}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {lecturers.map(lecturer => (
                  <LecturerCard key={lecturer.id} lecturer={lecturer} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer lang={lang} />
    </div>
  )
}
