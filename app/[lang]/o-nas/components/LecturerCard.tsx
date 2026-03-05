import { Lecturer } from "@/types/team"
import Image from "next/image"

const GRADIENT_PALETTES = [
  { bar: "from-blue-500 via-cyan-400 to-teal-400", bg: "from-blue-50/60 to-cyan-50/40", tag: "bg-blue-50 text-blue-700 border-blue-200", title: "text-blue-600" },
  { bar: "from-violet-500 via-fuchsia-400 to-pink-400", bg: "from-violet-50/60 to-fuchsia-50/40", tag: "bg-violet-50 text-violet-700 border-violet-200", title: "text-violet-600" },
  { bar: "from-emerald-500 via-teal-400 to-cyan-400", bg: "from-emerald-50/60 to-teal-50/40", tag: "bg-emerald-50 text-emerald-700 border-emerald-200", title: "text-emerald-600" },
  { bar: "from-amber-500 via-orange-400 to-yellow-400", bg: "from-amber-50/60 to-orange-50/40", tag: "bg-amber-50 text-amber-700 border-amber-200", title: "text-amber-600" },
  { bar: "from-rose-500 via-pink-400 to-fuchsia-400", bg: "from-rose-50/60 to-pink-50/40", tag: "bg-rose-50 text-rose-700 border-rose-200", title: "text-rose-600" },
  { bar: "from-indigo-500 via-blue-400 to-sky-400", bg: "from-indigo-50/60 to-sky-50/40", tag: "bg-indigo-50 text-indigo-700 border-indigo-200", title: "text-indigo-600" },
] as const

interface LecturerCardProps {
  lecturer: Lecturer
  index?: number
}

export default function LecturerCard({ lecturer, index = 0 }: LecturerCardProps) {
  const palette = GRADIENT_PALETTES[index % GRADIENT_PALETTES.length]

  return (
    <article className="glow-box bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 flex flex-col hover:shadow-xl hover:-translate-y-0.5">
      {/* Gradient accent bar */}
      <div className={`h-1.5 bg-gradient-to-r ${palette.bar}`} />

      <div className={`flex-1 flex flex-col p-4 sm:p-5 bg-gradient-to-br ${palette.bg}`}>
        {lecturer.photo && (
          <div className="mb-3 flex items-center justify-center">
            <Image
              src={lecturer.photo}
              alt={lecturer.name}
              width={128}
              height={128}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover ring-2 ring-white shadow-md"
            />
          </div>
        )}

        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5">{lecturer.name}</h3>
        <p className={`text-sm sm:text-base ${palette.title} font-semibold mb-2 whitespace-pre-line`}>{lecturer.title}</p>
        {lecturer.specializations && lecturer.specializations.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {lecturer.specializations.map((spec, i) => (
              <span
                key={i}
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${palette.tag}`}
              >
                {spec}
              </span>
            ))}
          </div>
        )}
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{lecturer.description}</p>
      </div>
    </article>
  )
}

