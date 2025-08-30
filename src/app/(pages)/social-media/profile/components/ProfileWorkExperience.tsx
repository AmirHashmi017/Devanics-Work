type ExperienceItem = {
    title: string
    company: string
    startDate: string
    endDate: string
    duration: string
}

export function ProfileWorkExperience() {
    const experiences: ExperienceItem[] = [
        {
            title: "UI/UX DESIGNER",
            company: "COMPANY NAME",
            startDate: "June 2019",
            endDate: "Jan 2022",
            duration: "2 yrs 3 mos",
        },
        {
            title: "UI/UX DESIGNER",
            company: "COMPANY NAME",
            startDate: "June 2019",
            endDate: "Jan 2022",
            duration: "2 yrs 3 mos",
        },
        {
            title: "UI/UX DESIGNER",
            company: "COMPANY NAME",
            startDate: "June 2019",
            endDate: "Jan 2022",
            duration: "2 yrs 3 mos",
        },
        {
            title: "UI/UX DESIGNER",
            company: "COMPANY NAME",
            startDate: "June 2019",
            endDate: "Jan 2022",
            duration: "2 yrs 3 mos",
        },
        {
            title: "UI/UX DESIGNER",
            company: "COMPANY NAME",
            startDate: "June 2019",
            endDate: "Jan 2022",
            duration: "2 yrs 3 mos",
        },
    ]

    return (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-[#1d2026]">WORK EXPERIENCE</h2>
            <div className="space-y-6">
                {experiences.map((experience, index) => (
                    <div key={index}>
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="h-16 w-16 rounded-full bg-[#007ab6]"></div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-base font-bold text-[#000000]">{experience.title}</h3>
                                <p className="text-[#717171]">{experience.company}</p>
                                <div className="flex flex-wrap items-center gap-2 text-[#717171]">
                                    <span>
                                        {experience.startDate} - {experience.endDate}
                                    </span>
                                    <span className="ml-1">{experience.duration}</span>
                                </div>
                            </div>
                        </div>
                        {index < experiences.length - 1 && <div className="mt-6 border-b border-[#e2e2e2]"></div>}
                    </div>
                ))}
            </div>
        </div>
    )
}
