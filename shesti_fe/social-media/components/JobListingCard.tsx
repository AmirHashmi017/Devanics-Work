'use client';

// import { BsX } from 'react-icons/bs';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { careerService } from '@/app/services/career.service';

type Career = {
  _id: string;
  title: string;
  location?: string;
  jobCompany?: {
    companyLogo?: string;
    socialAvatar?: string;
    avatar?: string;
    organizationName?: string;
  };
};

export default function JobListingCard() {
  const router = useRouter();
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await careerService.httpGetCareerList({
          offset: 0,
          limit: 3,
        });
        const list: Career[] = (res as any)?.data?.careers || [];
        if (mounted) setCareers(list);
      } catch (e) {
        if (mounted) setCareers([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const getLogo = (c: Career) =>
    c?.jobCompany?.companyLogo ||
    c?.jobCompany?.socialAvatar ||
    c?.jobCompany?.avatar ||
    '/placeholder.svg?height=64&width=64';

  return (
    <div className="max-w-xl mx-auto p-6 border rounded-3xl shadow">
      <h5 className="text-[#191919] text-xl font-normal mb-6">Jobs</h5>

      <div className="space-y-4">
        {loading && (
          <div className="text-sm text-[#707070]">Loading jobs...</div>
        )}

        {!loading && careers.length === 0 && (
          <div className="text-sm text-[#707070]">No jobs found</div>
        )}

        {!loading &&
          careers.map((job, index) => (
            <div
              key={job._id}
              className="relative cursor-pointer hover:bg-gray-50 rounded-lg"
              onClick={() => router.push(`/social-media/jobs/${job._id}`)}
            >
              <div className="flex items-start gap-4 pb-4">
                {!imageErrors[job._id] &&
                getLogo(job) !== '/placeholder.svg?height=64&width=64' ? (
                  <div className="w-16 h-16 bg-[#191919] flex-shrink-0 overflow-hidden rounded">
                    <Image
                      src={getLogo(job)}
                      alt={job?.jobCompany?.organizationName || 'Company logo'}
                      width={64}
                      height={64}
                      className="object-cover w-16 h-16"
                      onError={() =>
                        setImageErrors((prev) => ({ ...prev, [job._id]: true }))
                      }
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 flex-shrink-0 rounded bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {(job?.jobCompany?.organizationName || job.title)
                        ?.charAt(0)
                        ?.toUpperCase() || '?'}
                    </span>
                  </div>
                )}

                <div className="flex-grow">
                  <h5 className="text-[#007ab6] text-base font-medium">
                    {job.title}
                  </h5>
                  <p className="text-[#707070] text-sm mt-1">
                    {job.location || '-'}
                  </p>
                </div>
              </div>

              {index < careers.length - 1 && (
                <div className="border-b border-[#dddddd] w-full" />
              )}
            </div>
          ))}
      </div>

      <button
        type="button"
        onClick={() => router.push('/social-media/jobs')}
        className="flex items-center text-[#007ab6] mt-6 font-medium back bg-white hover:cursor-pointer"
      >
        Show more
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ml-1"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
    </div>
  );
}
