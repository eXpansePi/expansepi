"use client"

import { useState } from "react"
import { type Language } from "@/i18n/config"

interface ExpandableSyllabusProps {
  syllabus: string[]
  lang: Language
}

export default function ExpandableSyllabus({ syllabus, lang }: ExpandableSyllabusProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const toggleLabel = lang === 'cs' 
    ? (isExpanded ? 'Skrýt obsah' : 'Zobrazit obsah kurzu')
    : lang === 'en'
    ? (isExpanded ? 'Hide content' : 'Show course content')
    : (isExpanded ? 'Скрыть содержание' : 'Показать содержание курса')

  return (
    <div className="mb-6 sm:mb-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg hover:from-blue-100 hover:to-sky-100 transition-all duration-200 mb-3"
      >
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
          {lang === 'cs' ? 'Obsah kurzu' : lang === 'en' ? 'Course Content' : 'Содержание курса'}
        </h2>
        <svg
          className={`w-5 h-5 text-blue-600 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg p-4 sm:p-5 mt-3">
          <ul className="space-y-2 sm:space-y-2.5">
            {syllabus.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs sm:text-sm leading-relaxed text-gray-700">
                <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

