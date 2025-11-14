import { TeamMember } from "@/types/team"

interface TeamMemberCardProps {
  member: TeamMember
}

export default function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <article className="glow-box bg-white rounded-xl shadow-lg p-4 sm:p-5 transition-all duration-300 flex flex-col hover:shadow-xl">
      {member.photo && (
        <div className="mb-3 flex items-center justify-center">
          <img 
            src={member.photo} 
            alt={member.name}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover"
          />
        </div>
      )}
      
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5">{member.name}</h3>
      <p className="text-sm sm:text-base text-blue-600 font-semibold mb-2 whitespace-pre-line">{member.title}</p>
      {member.specializations && member.specializations.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {member.specializations.map((spec, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
            >
              {spec}
            </span>
          ))}
        </div>
      )}
      {member.description && (
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{member.description}</p>
      )}
    </article>
  )
}

