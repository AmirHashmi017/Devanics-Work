'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
// import { CommunityLayout } from '../../components/CommunityLayout';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { careerService } from '@/app/services/career.service';
import Image from 'next/image';
import { Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import ModalComponent from '@/app/component/modal';
import { InputComponent } from '@/app/component/customInput/Input';
import { TextAreaComponent } from '@/app/component/textarea';
import CustomButton from '@/app/component/customButton/button';
import { uploadFilesToS3 } from '@/app/utils/utils';
import { useUser } from '@/app/hooks/useUser';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
} from 'react-share';

type Career = {
  _id: string;
  title: string;
  brief?: string;
  location?: string;
  salary?: number;
  jobType?: string;
  createdAt?: string;
  roleDescription?: string[];
  jobRequirements?: string[];
  jobQualifications?: string[];
  jobBenefits?: string[];
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

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouterHook();
  const user = useUser();
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<Career | null>(null);
  const [applyOpen, setApplyOpen] = useState(false);
  const [applyStep, setApplyStep] = useState<1 | 2>(1);
  const [isApplied, setIsApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [requiredInfo, setRequiredInfo] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumePreview, setResumePreview] = useState<string | null>(null);

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return window.location.href;
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        if (!id) return;
        const res = await careerService.httpGetCareer(id);
        const data: Career | undefined =
          (res as any)?.data?.career || (res as any)?.data;
        if (mounted) {
          setJob(data || null);
          if ((data as any)?.isApplied) setIsApplied(true);
        }
      } catch (e) {
        if (mounted) setJob(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  // const companyName =
  //   job?.jobCompany?.organizationName ||
  //   job?.jobCompany?.name ||
  //   job?.jobCompany?.socialName ||
  //   '';
  // const companyLogo =
  //   job?.jobCompany?.companyLogo ||
  //   job?.jobCompany?.socialAvatar ||
  //   job?.jobCompany?.avatar ||
  //   '/placeholder.svg?height=80&width=80';

  // On first render, if not marked applied, verify via applicants list
  useEffect(() => {
    const checkApplied = async () => {
      try {
        if (!user?._id || !id || isApplied) return;
        const res = await careerService.httpGetCareerApplicants(id);
        const arr: any[] =
          (res as any)?.data?.applicants || (res as any)?.data || [];
        const found = arr.some(
          (a: any) =>
            String(a?.appliedBy?._id || a?.appliedBy) === String(user?._id)
        );
        if (found) setIsApplied(true);
      } catch {
        console.log('');
      }
    };
    checkApplied();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id, id]);

  return (
    <>
      <div className="p-4 space-y-4">
        {/* Breadcrumbs */}
        <div className="text-sm text-[#667085]">
          <button
            className="text-[#007ab6] cursor-pointer bg-white"
            onClick={() => router.push('/social-media')}
          >
            Community
          </button>
          <span className="mx-2">›</span>
          <button
            className="text-[#007ab6] cursor-pointer bg-white"
            onClick={() => router.push('/social-media/jobs')}
          >
            Jobs
          </button>
          {job?.title ? (
            <>
              <span className="mx-2">›</span>
              <span className="text-[#101010]">{job.title}</span>
            </>
          ) : null}
        </div>

        {loading ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm animate-pulse">
            <div className="h-8 w-64 bg-gray-200 rounded" />
            <div className="mt-3 h-4 w-80 bg-gray-200 rounded" />
            <div className="mt-6 h-4 w-full bg-gray-200 rounded" />
            <div className="mt-2 h-4 w-full bg-gray-200 rounded" />
            <div className="mt-2 h-4 w-2/3 bg-gray-200 rounded" />
          </div>
        ) : !job ? (
          <div className="text-sm text-[#707070]">Job not found</div>
        ) : (
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="font-inter font-bold text-[35px] text-[#222733]">
                    {job.title}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-[#667085] mr-2">Share Job:</span>
                <FacebookShareButton url={shareUrl}>
                  <FacebookIcon className="rounded-full" size={32} />
                </FacebookShareButton>
                <LinkedinShareButton url={shareUrl}>
                  <LinkedinIcon className="rounded-full" size={32} />
                </LinkedinShareButton>
                <TwitterShareButton url={shareUrl}>
                  <TwitterIcon className="rounded-full" size={32} />
                </TwitterShareButton>
              </div>
            </div>

            {job.brief && (
              <p className="font-inter  text-[18px] text-[#475467]">
                {job.brief}
              </p>
            )}

            {Array.isArray(job.roleDescription) &&
              job.roleDescription.length > 0 && (
                <section>
                  <h2 className="font-inter font-bold text-[24px] text-[#222733] mb-3">
                    Role Description:
                  </h2>
                  <ul className="list-disc pl-6 space-y-2 text-[#475467] font-inter  text-[16px]">
                    {job.roleDescription.map((item, idx) => (
                      <li key={`role-${idx}`}>{item}</li>
                    ))}
                  </ul>
                </section>
              )}

            {Array.isArray(job.jobRequirements) &&
              job.jobRequirements.length > 0 && (
                <section>
                  <h2 className="font-inter font-bold text-[24px] text-[#222733] mb-3">
                    Job Requirements:
                  </h2>
                  <ul className="list-disc pl-6 space-y-2 text-[#475467] font-inter  text-[16px]">
                    {job.jobRequirements.map((item, idx) => (
                      <li key={`req-${idx}`}>{item}</li>
                    ))}
                  </ul>
                </section>
              )}

            {Array.isArray(job.jobQualifications) &&
              job.jobQualifications.length > 0 && (
                <section>
                  <h2 className="font-inter font-bold text-[24px] text-[#222733] mb-3">
                    Job Qualifications:
                  </h2>
                  <ul className="list-disc pl-6 space-y-2 text-[#475467] font-inter  text-[16px]">
                    {job.jobQualifications.map((item, idx) => (
                      <li key={`qual-${idx}`}>{item}</li>
                    ))}
                  </ul>
                </section>
              )}

            {Array.isArray(job.jobBenefits) && job.jobBenefits.length > 0 && (
              <section>
                <h2 className="font-inter font-bold text-[24px] text-[#222733] mb-3">
                  Job Benefits:
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-[#475467] font-inter  text-[16px]">
                  {job.jobBenefits.map((item, idx) => (
                    <li key={`ben-${idx}`}>{item}</li>
                  ))}
                </ul>
              </section>
            )}

            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-5 py-2 rounded-md border border-[#d0d5dd] bg-white text-[#101010] hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="button"
                disabled={isApplied}
                onClick={() => setApplyOpen(true)}
                className={`px-5 py-2 rounded-md ${isApplied ? 'bg-white text-[#007ab6] cursor-default border border-[#d0d5dd]' : 'bg-[#007ab6] hover:bg-[#00689a] text-white cursor-pointer'}`}
              >
                {isApplied ? 'Applied' : 'Apply'}
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Apply modal */}
      <ModalComponent
        open={applyOpen}
        setOpen={setApplyOpen}
        width="720px"
        destroyOnClose
        className="rounded-2xl bg-white p-6 shadow-lg"
      >
        <div className="bg-white p-6 rounded-2xl">
          <h2 className="text-2xl font-bold text-[#007ab6] text-center">
            Apply Now
          </h2>
          <p className="text-center text-[#667085]">
            Take your career to the next level, and join us
          </p>

          {applyStep === 1 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold text-[#141414]">
                Main Information
              </h3>
              <InputComponent
                label="Phone Number"
                name="phone"
                type="text"
                placeholder="Phone Number"
                field={{
                  value: phone,
                  onChange: (e: any) => setPhone(e?.target?.value || ''),
                }}
                value=""
              />
              <InputComponent
                label="Email"
                name="email"
                type="email"
                placeholder="Email"
                field={{
                  value: email,
                  onChange: (e: any) => setEmail(e?.target?.value || ''),
                }}
                value=""
              />
              <InputComponent
                label="Required Info"
                name="requiredInfo"
                type="text"
                placeholder="Required Info"
                field={{
                  value: requiredInfo,
                  onChange: (e: any) => setRequiredInfo(e?.target?.value || ''),
                }}
                value=""
              />
              <TextAreaComponent
                label="Tell Us About Yourself"
                name="aboutMe"
                placeholder="Tell Us About Yourself"
                field={{
                  value: aboutMe,
                  onChange: (e: any) => setAboutMe(e?.target?.value || ''),
                }}
                value=""
              />

              <div className="flex items-center justify-end gap-3">
                <CustomButton
                  text="Cancel"
                  className="w-28 bg-white text-[#101010] border-[#d0d5dd]"
                  onClick={() => setApplyOpen(false)}
                />
                <CustomButton
                  text="Next"
                  className="w-28 bg-[#007ab6] border-[#007ab6]"
                  onClick={() => setApplyStep(2)}
                />
              </div>
            </div>
          )}

          {applyStep === 2 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold text-[#141414]">
                Upload Resume
              </h3>
              <Upload.Dragger
                multiple={false}
                accept=".pdf,.doc,.docx,image/*"
                maxCount={1}
                beforeUpload={(file) => {
                  setResumeFile(file as any);
                  if (file.type?.startsWith('image/')) {
                    const url = URL.createObjectURL(file as any);
                    setResumePreview(url);
                  } else {
                    setResumePreview(null);
                  }
                  return false;
                }}
                onRemove={() => {
                  setResumeFile(null);
                  if (resumePreview) URL.revokeObjectURL(resumePreview);
                  setResumePreview(null);
                }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Upload a file or drag and drop here
                </p>
                <p className="ant-upload-hint">PDF, DOC, DOCX, or images</p>
              </Upload.Dragger>
              {resumeFile && (
                <div className="mt-3 flex items-center gap-3 relative">
                  {resumePreview ? (
                    <div className="h-16 w-16 overflow-hidden rounded border relative">
                      <Image
                        src={resumePreview}
                        alt="Preview"
                        width={64}
                        height={64}
                        className="h-16 w-16 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setResumeFile(null);
                          if (resumePreview) URL.revokeObjectURL(resumePreview);
                          setResumePreview(null);
                        }}
                        className="absolute top-0 right-0 -translate-x-1/4 -translate-y-1/4 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="h-16 w-16 flex items-center justify-center rounded border bg-gray-50 text-sm text-[#475467] relative">
                      {resumeFile.name.split('.').pop()?.toUpperCase()}
                      <button
                        type="button"
                        onClick={() => setResumeFile(null)}
                        className="absolute top-0 right-0 -translate-x-1/4 -translate-y-1/4 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  <div className="text-sm text-[#475467] truncate">
                    {resumeFile.name}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <CustomButton
                  text="Back"
                  className="w-28 bg-white text-[#101010] border-[#d0d5dd]"
                  onClick={() => setApplyStep(1)}
                />
                <CustomButton
                  text="Apply"
                  isLoading={applying}
                  className="w-28 bg-[#007ab6] border-[#007ab6]"
                  onClick={async () => {
                    if (!id) return;
                    try {
                      setApplying(true);
                      let files: any[] = [];
                      if (resumeFile) {
                        const uploaded: any = await uploadFilesToS3(
                          resumeFile as any,
                          'documents/career/'
                        );
                        files = [uploaded];
                      }
                      const body = {
                        phone,
                        email,
                        requiredInfo,
                        aboutMe,
                        files,
                      };
                      await careerService.httpAddCareerApplicant(id, body);
                      setIsApplied(true);
                      setApplyOpen(false);
                    } catch {
                      console.log('');
                    } finally {
                      setApplying(false);
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </ModalComponent>
    </>
  );
}
