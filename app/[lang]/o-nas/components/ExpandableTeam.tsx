"use client"

import { useState } from "react"
import { type Language } from "@/i18n/config"
import TeamMemberCard from "./TeamMemberCard"
import LecturerCard from "./LecturerCard"
import { type TeamMember, type Lecturer } from "@/types/team"

interface ExpandableTeamProps {
  teamMembers: TeamMember[]
  lecturers: Lecturer[]
  lang: Language
  teamTitle: string
  lecturersTitle: string
  lecturerDefinition?: string
}

export default function ExpandableTeam({ 
  teamMembers, 
  lecturers, 
  lang, 
  teamTitle,
  lecturersTitle,
  lecturerDefinition 
}: ExpandableTeamProps) {
  const [isExpanded, setIsExpanded] = useState(true) // Expanded by default since we're on the about page

  const toggleLabel = lang === 'cs' 
    ? (isExpanded ? 'Skrýt tým' : 'Zobrazit tým')
    : lang === 'en'
    ? (isExpanded ? 'Hide team' : 'Show team')
    : (isExpanded ? 'Скрыть команду' : 'Показать команду')

  return (
    <div className="mb-6 sm:mb-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg hover:from-blue-100 hover:to-sky-100 transition-all duration-200 mb-3 glow-box"
        aria-expanded={isExpanded}
      >
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
          {lang === 'cs' ? 'Náš tým a lektoři' : lang === 'en' ? 'Our Team and Lecturers' : 'Наша команда и лекторы'}
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-blue-600 font-medium hidden sm:inline">
            {toggleLabel}
          </span>
          <svg
            className={`w-5 h-5 text-blue-600 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="space-y-12 sm:space-y-16">
          {/* Team Members Section */}
          {teamMembers.length > 0 && (
            <section aria-labelledby="team-heading">
              <h3 id="team-heading" className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8">
                {teamTitle}
              </h3>
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
              <h3 id="lecturers-heading" className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                {lecturersTitle}
              </h3>
              {lecturerDefinition && (
                <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8">
                  {lecturerDefinition}
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
      </div>
    </div>
  )
}

