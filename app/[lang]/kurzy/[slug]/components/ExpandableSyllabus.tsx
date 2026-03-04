"use client"

import { useState } from "react"
import { type Language } from "@/i18n/config"

interface ExpandableSyllabusProps {
  syllabus: string[]
  lang: Language
}

export default function ExpandableSyllabus({ syllabus, lang }: ExpandableSyllabusProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div>
      <article className="glow-box bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Accent bar */}
        <div className="h-1 bg-gradient-to-r from-indigo-500 to-blue-400" />

        {/* Toggle button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-5 sm:p-6 hover:bg-gray-50/50 transition-colors duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-4.5 h-4.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              {lang === 'cs' ? 'Obsah kurzu' : lang === 'en' ? 'Course Content' : 'Содержание курса'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium hidden sm:block">
              {isExpanded
                ? (lang === 'cs' ? 'Skrýt' : lang === 'en' ? 'Hide' : 'Скрыть')
                : (lang === 'cs' ? 'Zobrazit' : lang === 'en' ? 'Show' : 'Показать')
              }
            </span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {/* Expandable content */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="px-5 sm:px-6 pb-5 sm:pb-6">
            <div className="bg-gradient-to-br from-indigo-50/50 to-blue-50/50 rounded-xl p-4 sm:p-5 border border-indigo-100/50">
              <ul className="space-y-2.5 sm:space-y-3">
                {syllabus.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm sm:text-base leading-relaxed text-gray-700">
                    <div className="w-6 h-6 rounded-md bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3.5 h-3.5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
