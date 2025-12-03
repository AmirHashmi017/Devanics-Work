type ProfileSkillsProps = {
  user: {
    skills?: string[];
  };
};

export function ProfileSkills({ user }: ProfileSkillsProps) {
  const skills = user?.skills || [];

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold text-[#1d2026]">SKILLS</h2>
      {skills.length === 0 ? (
        <p className="text-[#6e7485]">No skills available.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, idx) => (
            <span
              key={`${skill}-${idx}`}
              className="px-3 py-1 rounded-full bg-[#f2f5f8] text-[#1d2026] text-sm border border-[#e2e2e2]"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
