'use client';
import { useEffect, useState } from 'react';
import { Pagination } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { withAuth } from '@/app/hoc/withAuth';
import { CommunityLayout } from '../components/CommunityLayout';
import { InputComponent } from '@/app/component/customInput/Input';
import { BsSearch } from 'react-icons/bs';
import CustomButton from '@/app/component/customButton/button';
import { JobItem } from './components/JobItem';
import { careerService } from '@/app/services/career.service';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouterHook } from '@/app/hooks/useRouterHook';

type Career = {
  _id: string;
  title: string;
  brief?: string;
  location?: string;
  salary?: number;
  jobType?: string;
  createdAt?: string;
  jobCompany?: {
    organizationName?: string;
    name?: string;
    socialName?: string;
    companyLogo?: string;
    avatar?: string;
    socialAvatar?: string;
    currency?: { symbol?: string };
  };
};

function JobsPage() {
  const router = useRouterHook();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<Career[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [typing, setTyping] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const limit = 6;

  // Sync state from URL
  useEffect(() => {
    const p = Number(searchParams.get('page') || '1');
    if (Number.isFinite(p) && p !== page) setPage(p);
    setSearchText(searchParams.get('search') || '');
  }, [searchParams]);

  // Push search term to URL as user types (debounced)
  useEffect(() => {
    const t = setTimeout(() => {
      const sp = new URLSearchParams(searchParams.toString());
      if (searchText.trim()) sp.set('search', searchText.trim());
      else sp.delete('search');
      sp.set('page', '1');
      router.push(`${pathname}?${sp.toString()}`);
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await careerService.httpGetCareerList({
        offset: (page - 1) * limit,
        limit,
        search: searchParams.get('search') || undefined,
        jobTypes: searchParams.get('jobTypes') || undefined,
        minSalary: searchParams.get('minSalary') || undefined,
        salaryPeriod: searchParams.get('salaryPeriod') || undefined,
        datePosted: searchParams.get('datePosted') || undefined,
      });
      const careers: Career[] = (res as any)?.data?.careers || [];
      const totalCount: number = (res as any)?.pagination?.total || 0;
      setJobs(careers);
      setTotal(totalCount);
    } catch (err) {
      setJobs([]);
      setTotal(0);
    } finally {
      setLoading(false);
      setTyping(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchParams]);

  return (
    <CommunityLayout>
      <div className="p-4 space-y-4">
        <div className="flex items-center  gap-4">
          <h1 className="text-2xl font-bold">
            Jobs <span className="font-normal text-[#667085]">{total}</span>
          </h1>

          <div className="flex-1">
            <InputComponent
              label=""
              name="search"
              type="text"
              placeholder="Search"
              prefix={<BsSearch />}
              value={searchText}
              field={{
                onChange: (e: any) => {
                  setSearchText(e?.target?.value || '');
                  setTyping(true);
                },
                onPressEnter: () => {
                  const sp = new URLSearchParams(searchParams.toString());
                  if (searchText.trim()) sp.set('search', searchText.trim());
                  else sp.delete('search');
                  sp.set('page', '1');
                  router.push(`${pathname}?${sp.toString()}`);
                },
              }}
              suffix={typing || loading ? <LoadingOutlined spin /> : undefined}
            />
          </div>

          <CustomButton
            text="Add New Job"
            className="w-fit"
            onClick={() => router.push(`${pathname}/create`)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {loading && (
            <>
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-full max-w-4xl rounded-lg border border-gray-100 bg-white p-6 shadow-sm animate-pulse"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start">
                    <div className="h-[112px] w-[112px] flex-shrink-0 rounded bg-gray-200" />
                    <div className="flex-1">
                      <div className="h-5 w-40 bg-gray-200 rounded" />
                      <div className="mt-2 h-8 w-72 bg-gray-200 rounded" />
                      <div className="mt-4 flex gap-4">
                        <div className="h-4 w-24 bg-gray-200 rounded" />
                        <div className="h-4 w-24 bg-gray-200 rounded" />
                        <div className="h-4 w-16 bg-gray-200 rounded" />
                        <div className="h-4 w-20 bg-gray-200 rounded" />
                      </div>
                      <div className="mt-6 h-5 w-full bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {!loading && jobs.length === 0 && (
            <div className="text-sm text-[#707070]">No jobs found</div>
          )}

          {!loading &&
            jobs.map((job) => (
              <JobItem
                id={job._id}
                onClick={() => router.push(`${pathname}/${job._id}`)}
                key={job._id}
                companyName={
                  job?.jobCompany?.organizationName ||
                  job?.jobCompany?.name ||
                  job?.jobCompany?.socialName ||
                  '-'
                }
                companyLogo={
                  job?.jobCompany?.companyLogo ||
                  job?.jobCompany?.socialAvatar ||
                  job?.jobCompany?.avatar ||
                  undefined
                }
                title={job.title}
                location={job.location}
                jobType={job.jobType}
                salary={job.salary}
                currencySymbol={job?.jobCompany?.currency?.symbol || '$'}
                createdAt={job.createdAt}
                brief={job.brief}
              />
            ))}
        </div>

        <div className="flex justify-center">
          <Pagination
            current={page}
            pageSize={limit}
            total={total}
            showSizeChanger={false}
            onChange={(p) => {
              setPage(p);
              const sp = new URLSearchParams(searchParams.toString());
              sp.set('page', String(p));
              router.push(`${pathname}?${sp.toString()}`);
              if (typeof window !== 'undefined') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          />
        </div>
      </div>
    </CommunityLayout>
  );
}

export default withAuth(JobsPage);
