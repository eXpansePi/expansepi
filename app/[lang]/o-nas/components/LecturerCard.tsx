import { Lecturer } from "@/types/team"
import Image from "next/image"

interface LecturerCardProps {
  lecturer: Lecturer
}

export default function LecturerCard({ lecturer }: LecturerCardProps) {
  return (
    <article className="glow-box bg-white rounded-xl shadow-lg p-4 sm:p-5 transition-all duration-300 flex flex-col hover:shadow-xl">
      {lecturer.photo && (
        <div className="mb-3 flex items-center justify-center">
          <Image
            src={lecturer.photo}
            alt={lecturer.name}
            width={128}
            height={128}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover"
          />
        </div>
      )}

      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5">{lecturer.name}</h3>
      <p className="text-sm sm:text-base text-blue-600 font-semibold mb-2 whitespace-pre-line">{lecturer.title}</p>
      {lecturer.specializations && lecturer.specializations.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {lecturer.specializations.map((spec, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
            >
              {spec}
            </span>
          ))}
        </div>
      )}
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{lecturer.description}</p>
    </article>
  )
}

