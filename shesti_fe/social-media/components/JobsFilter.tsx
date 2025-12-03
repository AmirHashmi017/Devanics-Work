'use client';

import { cn } from '@/app/utils/utils';
import * as React from 'react';
import { BsChevronDown } from 'react-icons/bs';
import { useSearchParams, usePathname } from 'next/navigation';
import { LoadingOutlined } from '@ant-design/icons';
import { useRouterHook } from '@/app/hooks/useRouterHook';

export function JobsFilter() {
  const router = useRouterHook();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [salaryPeriod, setSalaryPeriod] = React.useState<
    'hourly' | 'monthly' | 'yearly'
  >('yearly');
  const [locationOption, setLocationOption] = React.useState<string>('remote');
  const [salaryOption, setSalaryOption] = React.useState<string>('any');
  const [dateOption, setDateOption] = React.useState<string>('all');
  // const [experienceOption, setExperienceOption] = React.useState<string>('any');
  const [employmentTypes, setEmploymentTypes] = React.useState<string[]>([
    'full-time',
    'part-time',
    'temporary',
  ]);
  const [busy, setBusy] = React.useState<boolean>(false);

  const handleEmploymentTypeChange = (value: string) => {
    if (employmentTypes.includes(value)) {
      setEmploymentTypes(employmentTypes.filter((type) => type !== value));
    } else {
      setEmploymentTypes([...employmentTypes, value]);
    }
  };

  // Helpers to map UI values to API and back
  const uiToApi = React.useCallback((s: string) => {
    const map: Record<string, string> = {
      'full-time': 'FullTime',
      'part-time': 'PartTime',
      temporary: 'temporary',
    };
    return map[s] ?? s;
  }, []);

  const apiToUi = React.useCallback((s: string) => {
    const map: Record<string, string> = {
      FullTime: 'full-time',
      PartTime: 'part-time',
      temporary: 'temporary',
    };
    return map[s] ?? s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }, []);

  // Sync UI from URL when arriving on page or navigating back
  React.useEffect(() => {
    const period = (searchParams.get('salaryPeriod') as any) || 'yearly';
    const minSalary = searchParams.get('minSalary') || 'any';
    const posted = searchParams.get('datePosted') || 'all';
    const jobs = (searchParams.get('jobTypes') || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    // Map API job types like FullTime -> UI values like full-time
    const mapFromApi = (s: string) => apiToUi(s);
    setSalaryPeriod(
      (['hourly', 'monthly', 'yearly'] as any).includes(period)
        ? period
        : 'yearly'
    );
    setSalaryOption(minSalary || 'any');
    setDateOption(posted || 'all');
    if (jobs.length) setEmploymentTypes(jobs.map(mapFromApi));
    setBusy(false);
  }, [searchParams]);

  const pushFilters = (
    next: Partial<{
      salaryPeriod: string;
      minSalary: string;
      datePosted: string;
      employmentTypes: string[];
    }>
  ) => {
    const sp = new URLSearchParams(searchParams.toString());
    const setOrDelete = (key: string, val?: string) => {
      if (val && val !== 'any' && val !== 'all') sp.set(key, val);
      else sp.delete(key);
    };
    if (next.salaryPeriod !== undefined)
      setOrDelete('salaryPeriod', next.salaryPeriod);
    if (next.minSalary !== undefined) setOrDelete('minSalary', next.minSalary);
    if (next.datePosted !== undefined)
      setOrDelete('datePosted', next.datePosted);
    if (next.employmentTypes !== undefined) {
      const jt = next.employmentTypes.map(uiToApi).join(',');
      if (jt) sp.set('jobTypes', jt);
      else sp.delete('jobTypes');
    }
    sp.set('page', '1');
    router.push(`${pathname}?${sp.toString()}`);
    setBusy(true);
  };

  return (
    <div className="w-full bg-white rounded-lg border border-[#d0d5dd] p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#141414]">Filters</h1>
        {busy && <LoadingOutlined className="text-[#007ab6]" spin />}
      </div>

      {/* Area */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-[#141414] mb-2">Area</h2>
        <button className="w-full flex items-center justify-between px-4 py-2.5 border border-[#d0d5dd] rounded-lg text-[#98a2b3]">
          <span>Select area</span>
          <BsChevronDown className="h-5 w-5" />
        </button>
      </div>

      {/* Location */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-[#141414] mb-2">Location</h2>
        <div className="space-y-2">
          <RadioOption
            id="near-me"
            name="location"
            value="near-me"
            label="Near me"
            checked={locationOption === 'near-me'}
            onChange={() => setLocationOption('near-me')}
          />
          <RadioOption
            id="remote"
            name="location"
            value="remote"
            label="Remote job"
            checked={locationOption === 'remote'}
            onChange={() => setLocationOption('remote')}
          />
          <RadioOption
            id="exact"
            name="location"
            value="exact"
            label="Exact location"
            checked={locationOption === 'exact'}
            onChange={() => setLocationOption('exact')}
          />
          <RadioOption
            id="within-15"
            name="location"
            value="within-15"
            label="Within 15 km"
            checked={locationOption === 'within-15'}
            onChange={() => setLocationOption('within-15')}
          />
          <RadioOption
            id="within-30"
            name="location"
            value="within-30"
            label="Within 30 km"
            checked={locationOption === 'within-30'}
            onChange={() => setLocationOption('within-30')}
          />
          <RadioOption
            id="within-50"
            name="location"
            value="within-50"
            label="Within 50 km"
            checked={locationOption === 'within-50'}
            onChange={() => setLocationOption('within-50')}
          />
        </div>
      </div>

      {/* Salary */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-[#141414] mb-2">Salary</h2>
        <div className="flex border border-[#d0d5dd] rounded-lg text-[10px] mb-4 overflow-hidden">
          <button
            className={cn(
              'flex-1 py-2 text-center',
              salaryPeriod === 'hourly'
                ? 'bg-[#3575e2]/10 text-[#3575e2]'
                : 'bg-white text-[#475467]'
            )}
            onClick={() => {
              setSalaryPeriod('hourly');
              pushFilters({ salaryPeriod: 'hourly', minSalary: salaryOption });
            }}
          >
            Hourly
          </button>
          <button
            className={cn(
              'flex-1 py-2 text-center border-l border-r border-[#d0d5dd]',
              salaryPeriod === 'monthly'
                ? 'bg-[#3575e2]/10 text-[#3575e2]'
                : 'bg-white text-[#475467]'
            )}
            onClick={() => {
              setSalaryPeriod('monthly');
              pushFilters({ salaryPeriod: 'monthly', minSalary: salaryOption });
            }}
          >
            Monthly
          </button>
          <button
            className={cn(
              'flex-1 py-2 text-center',
              salaryPeriod === 'yearly'
                ? 'bg-[#3575e2]/10 text-[#3575e2]'
                : 'bg-white text-[#475467]'
            )}
            onClick={() => {
              setSalaryPeriod('yearly');
              pushFilters({ salaryPeriod: 'yearly', minSalary: salaryOption });
            }}
          >
            Yearly
          </button>
        </div>
        <div className="space-y-2">
          <RadioOption
            id="any-salary"
            name="salary"
            value="any"
            label="Any"
            checked={salaryOption === 'any'}
            onChange={() => {
              setSalaryOption('any');
              pushFilters({ minSalary: 'any' });
            }}
          />
          <RadioOption
            id="300k"
            name="salary"
            value="300k"
            label="> 300000k"
            checked={salaryOption === '300k'}
            onChange={() => {
              setSalaryOption('300k');
              pushFilters({ minSalary: '300k' });
            }}
          />
          <RadioOption
            id="500k"
            name="salary"
            value="500k"
            label="> 500000k"
            checked={salaryOption === '500k'}
            onChange={() => {
              setSalaryOption('500k');
              pushFilters({ minSalary: '500k' });
            }}
          />
          <RadioOption
            id="800k"
            name="salary"
            value="800k"
            label="> 800000k"
            checked={salaryOption === '800k'}
            onChange={() => {
              setSalaryOption('800k');
              pushFilters({ minSalary: '800k' });
            }}
          />
          <RadioOption
            id="1000k"
            name="salary"
            value="1000k"
            label="> 100000k"
            checked={salaryOption === '1000k'}
            onChange={() => {
              setSalaryOption('1000k');
              pushFilters({ minSalary: '1000k' });
            }}
          />
        </div>
      </div>

      {/* Date of posting */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-[#141414] mb-2">
          Date of posting
        </h2>
        <div className="space-y-2">
          <RadioOption
            id="all-time"
            name="date"
            value="all"
            label="All time"
            checked={dateOption === 'all'}
            onChange={() => {
              setDateOption('all');
              pushFilters({ datePosted: 'all' });
            }}
          />
          <RadioOption
            id="24-hours"
            name="date"
            value="24h"
            label="Last 24 hours"
            checked={dateOption === '24h'}
            onChange={() => {
              setDateOption('24h');
              pushFilters({ datePosted: '24h' });
            }}
          />
          <RadioOption
            id="3-days"
            name="date"
            value="3d"
            label="Last 3 days"
            checked={dateOption === '3d'}
            onChange={() => {
              setDateOption('3d');
              pushFilters({ datePosted: '3d' });
            }}
          />
          <RadioOption
            id="7-days"
            name="date"
            value="7d"
            label="Last 7 days"
            checked={dateOption === '7d'}
            onChange={() => {
              setDateOption('7d');
              pushFilters({ datePosted: '7d' });
            }}
          />
        </div>
      </div>

      {/* Type of employment */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-[#141414] mb-2">
          Type of employment
        </h2>
        <div className="space-y-2">
          <CheckboxOption
            id="full-time"
            value="full-time"
            label="Full-time"
            checked={employmentTypes.includes('full-time')}
            onChange={() => {
              handleEmploymentTypeChange('full-time');
              const next = employmentTypes.includes('full-time')
                ? employmentTypes.filter((t) => t !== 'full-time')
                : [...employmentTypes, 'full-time'];
              pushFilters({ employmentTypes: next });
            }}
          />
          <CheckboxOption
            id="temporary"
            value="temporary"
            label="Temporary"
            checked={employmentTypes.includes('temporary')}
            onChange={() => {
              handleEmploymentTypeChange('temporary');
              const next = employmentTypes.includes('temporary')
                ? employmentTypes.filter((t) => t !== 'temporary')
                : [...employmentTypes, 'temporary'];
              pushFilters({ employmentTypes: next });
            }}
          />
          <CheckboxOption
            id="part-time"
            value="part-time"
            label="Part-time"
            checked={employmentTypes.includes('part-time')}
            onChange={() => {
              handleEmploymentTypeChange('part-time');
              const next = employmentTypes.includes('part-time')
                ? employmentTypes.filter((t) => t !== 'part-time')
                : [...employmentTypes, 'part-time'];
              pushFilters({ employmentTypes: next });
            }}
          />
        </div>
      </div>
    </div>
  );
}

interface RadioOptionProps {
  id: string;
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}

function RadioOption({
  id,
  name,
  value,
  label,
  checked,
  onChange,
}: RadioOptionProps) {
  return (
    <label htmlFor={id} className="flex items-center space-x-2 cursor-pointer">
      <div className="relative flex items-center justify-center">
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div
          className={cn(
            'h-5 w-5 rounded-full border',
            checked ? 'border-[#007ab6]' : 'border-[#d0d5dd]'
          )}
        >
          {checked && (
            <div className="absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#007ab6]" />
          )}
        </div>
      </div>
      <span className="text-[#475467]">{label}</span>
    </label>
  );
}

interface CheckboxOptionProps {
  id: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}

function CheckboxOption({
  id,
  value,
  label,
  checked,
  onChange,
}: CheckboxOptionProps) {
  return (
    <label htmlFor={id} className="flex items-center space-x-2 cursor-pointer">
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          id={id}
          value={value}
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div
          className={cn(
            'h-5 w-5 rounded border',
            checked
              ? 'border-[#007ab6] bg-[#007ab6]'
              : 'border-[#d0d5dd] bg-white'
          )}
        >
          {checked && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>
      <span className="text-[#475467]">{label}</span>
    </label>
  );
}
