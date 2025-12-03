type EducationItem = {
  _id: string;
  school: string;
  grade?: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string | null;
};

type ProfileEducationProps = {
  user: {
    education?: EducationItem[];
  };
};

export function ProfileEducation({ user }: ProfileEducationProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  const calculateDuration = (startDate?: string, endDate?: string | null) => {
    if (!startDate) return '';
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return '';

    const diffInMonths =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    const years = Math.floor(diffInMonths / 12);
    const months = diffInMonths % 12;

    let duration = '';
    if (years > 0) duration += `${years} yr${years > 1 ? 's' : ''}`;
    if (months > 0)
      duration += `${duration ? ' ' : ''}${months} mo${months > 1 ? 's' : ''}`;
    return duration || '1 mo';
  };

  const education = user?.education || [];

  if (education.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-2xl font-bold text-[#1d2026]">EDUCATION</h2>
        <p className="text-[#6e7485]">No education available.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold text-[#1d2026]">EDUCATION</h2>
      <div className="space-y-6">
        {education.map((item, index) => {
          const titleParts = [item.degree, item.fieldOfStudy].filter(Boolean);
          const title = titleParts.length ? titleParts.join(' • ') : 'Student';
          const dateRange = [
            formatDate(item.startDate),
            item.endDate ? formatDate(item.endDate) : 'Continued',
          ]
            .filter(Boolean)
            .join(' - ');
          const duration = calculateDuration(item.startDate, item.endDate);

          return (
            <div key={item._id}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-full bg-[#007ab6]"></div>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-[#000000]">
                    {title}
                  </h3>
                  <p className="text-[#717171]">{item.school}</p>
                  <div className="flex flex-wrap items-center gap-2 text-[#717171]">
                    {dateRange && <span>{dateRange}</span>}
                    {duration && <span className="ml-1">{duration}</span>}
                  </div>
                  {item.grade && (
                    <p className="mt-1 text-sm text-[#717171]">
                      Grade: {item.grade}
                    </p>
                  )}
                </div>
              </div>
              {index < education.length - 1 && (
                <div className="mt-6 border-b border-[#e2e2e2]"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
