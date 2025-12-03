import { BsCalendar, BsClock } from 'react-icons/bs';
import { CiMapPin } from 'react-icons/ci';
import { FaDollarSign } from 'react-icons/fa6';
import Image from 'next/image';
import moment from 'moment';

export type JobItemProps = {
  id?: string;
  companyName: string;
  companyLogo?: string | null;
  title: string;
  location?: string | null;
  jobType?: string | null;
  salary?: number | null;
  currencySymbol?: string | null;
  createdAt?: string | Date | null;
  brief?: string | null;
  onClick?: () => void;
};

const toK = (value?: number | null) => {
  if (!value && value !== 0) return null;
  if (Math.abs(value) < 1000) return `${value}`;
  return `${Math.round(value / 1000)}k`;
};

const formatJobType = (t?: string | null) =>
  (t || '')
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim()
    .replace(/^./, (s) => s.toUpperCase());

export function JobItem({
  companyName,
  companyLogo,
  title,
  location,
  jobType,
  salary,
  currencySymbol,
  createdAt,
  brief,
  onClick,
}: JobItemProps) {
  const logoSrc = companyLogo || '/placeholder.svg?height=112&width=112';
  const when = createdAt ? moment(createdAt).fromNow() : '';
  const typeText = formatJobType(jobType);
  const salaryText =
    salary != null ? `${currencySymbol || ''}${toK(salary)}` : undefined;

  return (
    <div
      className="w-full max-w-4xl rounded-lg border border-gray-100 bg-white p-6 shadow-sm cursor-pointer hover:bg-gray-50 transition"
      role="button"
      onClick={onClick}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        {companyLogo ? (
          <div className="h-[112px] w-[112px] flex-shrink-0 overflow-hidden rounded bg-gray-100">
            <Image
              src={logoSrc}
              alt={companyName}
              width={112}
              height={112}
              className="h-[112px] w-[112px] object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = `
            <div class="h-[112px] w-[112px] flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-700 rounded">
              <span class="text-white text-4xl font-bold">${companyName?.charAt(0)?.toUpperCase() || '?'}</span>
            </div>
          `;
              }}
            />
          </div>
        ) : (
          <div className="h-[112px] w-[112px] flex-shrink-0 rounded bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
            <span className="text-white text-4xl font-bold">
              {companyName?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>
        )}
        <div className="flex-1">
          <h2 className="text-xl font-medium text-[#141414]">{companyName}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-semibold text-[#007ab6]">{title}</h1>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[#475467]">
            <div className="flex items-center gap-2">
              <CiMapPin className="h-5 w-5 text-gray-500" />
              <span>{location || '-'}</span>
            </div>
            <div className="flex items-center gap-2">
              <BsClock className="h-5 w-5 text-gray-500" />
              <span>{typeText || '-'}</span>
            </div>
            {salaryText && (
              <div className="flex items-center gap-2">
                <FaDollarSign className="h-5 w-5 text-gray-500" />
                <span>{salaryText}</span>
              </div>
            )}
            {when && (
              <div className="flex items-center gap-2">
                <BsCalendar className="h-5 w-5 text-gray-500" />
                <span>{when}</span>
              </div>
            )}
          </div>
          {brief && (
            <p className="mt-6 text-[#475467] truncate-2-lines">{brief}</p>
          )}
        </div>
      </div>
    </div>
  );
}
