import type { Metadata } from "next"
import Navigation from "../components/Navigation"
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

export default async function AboutPage({ params }: AboutPageProps) {
  const resolvedParams = await params
  const lang = (isValidLanguage(resolvedParams.lang) ? resolvedParams.lang : defaultLanguage) as Language
  const t = getTranslations(lang)

  const teamMembers = getAllTeamMembers(lang)
  const lecturers = getAllLecturers(lang)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation activePage={getRoutePath(lang, 'about')} lang={lang} t={t} />
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">{t.about.title}</h1>
          <div className="prose prose-sm sm:prose-base prose-gray max-w-none mb-8 sm:mb-12">
            <p className="text-base sm:text-lg leading-relaxed">{t.about.description}</p>
          </div>

          {/* Team Members Section */}
          {teamMembers.length > 0 && (
            <section aria-labelledby="team-heading" className="mb-12 sm:mb-16">
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
            <section aria-labelledby="lecturers-heading">
              <h2 id="lecturers-heading" className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-5">
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
    </div>
  )
}
