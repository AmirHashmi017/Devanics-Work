type JobExperience = {
  _id: string;
  jobTitle: string;
  companyName: string;
  startDate: string;
  endDate: string | null;
};

type ProfileWorkExperienceProps = {
  user: {
    jobExperience?: JobExperience[];
  };
};

export function ProfileWorkExperience({ user }: ProfileWorkExperienceProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  const calculateDuration = (startDate: string, endDate: string | null) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffInMonths =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());

    const years = Math.floor(diffInMonths / 12);
    const months = diffInMonths % 12;

    let duration = '';
    if (years > 0) {
      duration += `${years} yr${years > 1 ? 's' : ''}`;
    }
    if (months > 0) {
      if (duration) duration += ' ';
      duration += `${months} mo${months > 1 ? 's' : ''}`;
    }

    return duration || '1 mo';
  };

  const experiences = user?.jobExperience || [];

  if (experiences.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-2xl font-bold text-[#1d2026]">
          WORK EXPERIENCE
        </h2>
        <p className="text-[#6e7485]">No work experience available.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold text-[#1d2026]">
        WORK EXPERIENCE
      </h2>
      <div className="space-y-6">
        {experiences.map((experience, index) => (
          <div key={experience._id}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="h-16 w-16 rounded-full bg-[#007ab6]"></div>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-[#000000]">
                  {experience.jobTitle}
                </h3>
                <p className="text-[#717171]">{experience.companyName}</p>
                <div className="flex flex-wrap items-center gap-2 text-[#717171]">
                  <span>
                    {formatDate(experience.startDate)} -{' '}
                    {experience.endDate
                      ? formatDate(experience.endDate)
                      : 'Continued'}
                  </span>
                  <span className="ml-1">
                    {calculateDuration(
                      experience.startDate,
                      experience.endDate
                    )}
                  </span>
                </div>
              </div>
            </div>
            {index < experiences.length - 1 && (
              <div className="mt-6 border-b border-[#e2e2e2]"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
