'use client';

import { useState } from 'react';
// import { CommunityLayout } from '../../components/CommunityLayout';
import { InputComponent } from '@/app/component/customInput/Input';
import { TextAreaComponent } from '@/app/component/textarea';
import CustomButton from '@/app/component/customButton/button';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { SelectComponent } from '@/app/component/customSelect/Select.component';
import { careerService } from '@/app/services/career.service';
import { toast } from 'react-toastify';

type ListField = string[];

export default function CreateJobPage() {
  const router = useRouterHook();
  const [title, setTitle] = useState('');
  const [brief, setBrief] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState<number | ''>('');
  const [jobType, setJobType] = useState<string>('temporary');
  // const [shareToSocial, setShareToSocial] = useState<boolean>(true);
  const [roleDescription, setRoleDescription] = useState<ListField>([
    '',
    '',
    '',
    '',
  ]);
  const [jobRequirements, setJobRequirements] = useState<ListField>([
    '',
    '',
    '',
    '',
  ]);
  const [jobQualifications, setJobQualifications] = useState<ListField>([
    '',
    '',
    '',
    '',
  ]);
  const [jobBenefits, setJobBenefits] = useState<ListField>(['', '', '', '']);
  const [loading, setLoading] = useState(false);

  const handleListChange = (
    setter: (v: ListField) => void,
    list: ListField,
    idx: number,
    value: string
  ) => {
    const next = [...list];
    next[idx] = value;
    setter(next);
  };

  const onCreate = async () => {
    if (!title.trim() || !brief.trim()) {
      toast.error('Job title and brief are required');
      return;
    }
    try {
      setLoading(true);
      const payload = {
        title: title.trim(),
        brief: brief.trim(),
        location: location.trim(),
        salary: Number(salary) || 0,
        jobType,
        roleDescription: roleDescription.filter((s) => s && s.trim()),
        jobRequirements: jobRequirements.filter((s) => s && s.trim()),
        jobQualifications: jobQualifications.filter((s) => s && s.trim()),
        jobBenefits: jobBenefits.filter((s) => s && s.trim()),
      };
      const res = await careerService.httpCreateCareer(payload);
      toast.success((res as any)?.message || 'Job created successfully');
      router.push('/social-media/jobs');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  const renderList = (
    label: string,
    list: ListField,
    setter: (v: ListField) => void
  ) => (
    <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
      <h3 className="text-lg font-medium text-[#141414]">{label}</h3>
      {list.map((v, i) => (
        <InputComponent
          key={`${label}-${i}`}
          label=""
          name={`${label}-${i}`}
          type="text"
          placeholder={`${label} - ${i + 1}`}
          value={v}
          onChange={(e: any) =>
            handleListChange(setter, list, i, e?.target?.value || '')
          }
        />
      ))}
    </div>
  );

  return (
    <div>
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
          <span className="mx-2">›</span>
          <span className="text-[#101010]">Create New Job</span>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-6">
          <h2 className="text-xl font-semibold text-[#141414]">Job Setting</h2>
          <InputComponent
            label="Job Title"
            name="title"
            type="text"
            placeholder="Job Title"
            value={title}
            onChange={(e: any) => setTitle(e?.target?.value || '')}
          />
          <TextAreaComponent
            label="Job Brief"
            name="brief"
            placeholder="Job Brief"
            value={brief}
            onChange={(e: any) => setBrief(e?.target?.value || '')}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputComponent
              label="Location"
              name="location"
              type="text"
              placeholder="City / State"
              value={location}
              onChange={(e: any) => setLocation(e?.target?.value || '')}
            />
            <InputComponent
              label="Salary"
              name="salary"
              type="number"
              placeholder="e.g. 150000"
              value={salary.toString()}
              onChange={(e: any) => setSalary(e?.target?.value || '')}
            />
            <SelectComponent
              label="Job Type"
              name="jobType"
              placeholder="Select job type"
              field={{
                value: jobType,
                options: [
                  { value: 'temporary', label: 'Temporary' },
                  { value: 'full-time', label: 'Full time' },
                  { value: 'part-time', label: 'Part time' },
                ],
                onChange: (value: string) => setJobType(value),
                className: '!h-auto',
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputComponent
            label="Location"
            name="location"
            type="text"
            placeholder="City / State"
            field={{
              value: location,
              onChange: (e: any) => setLocation(e?.target?.value || ''),
            }}
            value=""
          />
          <InputComponent
            label="Salary"
            name="salary"
            type="number"
            placeholder="e.g. 150000"
            field={{
              value: salary,
              onChange: (e: any) => setSalary(e?.target?.value || ''),
            }}
            value=""
          />
          <SelectComponent
            label="Job Type"
            name="jobType"
            placeholder="Select job type"
            field={{
              value: jobType,
              options: [
                { value: 'temporary', label: 'Temporary' },
                { value: 'FullTime', label: 'Full time' },
                { value: 'PartTime', label: 'Part time' },
              ],
              onChange: (value: string) => setJobType(value),
              className: '!h-auto',
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderList('Role Description', roleDescription, setRoleDescription)}
        {renderList('Job Requirements', jobRequirements, setJobRequirements)}
        {renderList(
          'Job Qualifications',
          jobQualifications,
          setJobQualifications
        )}
        {renderList('Job Benefits', jobBenefits, setJobBenefits)}
      </div>

      <div className="flex items-center justify-between">
        <div></div>
        <div className="flex items-center gap-4">
          <CustomButton
            text="Cancel"
            className="w-32 py-2 bg-white text-[#101010] border-[#d0d5dd] hover:bg-gray-50"
            onClick={() => router.push('/social-media/jobs')}
          />
          <CustomButton
            text="Create"
            className="w-36 py-2 bg-[#007ab6] border-[#007ab6] hover:bg-[#00689a]"
            isLoading={loading}
            onClick={onCreate}
          />
        </div>
      </div>
    </div>
  );
}
