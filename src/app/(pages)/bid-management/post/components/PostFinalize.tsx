import { SelectComponent } from '@/app/component/customSelect/Select.component';
import SenaryHeading from '@/app/component/headings/senaryHeading';
import TertiaryHeading from '@/app/component/headings/tertiary';
import { IBidManagement } from '@/app/interfaces/bid-management/bid-management.interface';
import { Checkbox, Divider, Radio, Spin, Switch } from 'antd';
import Dragger from 'antd/es/upload/Dragger';
import type { FormikProps } from 'formik';
import moment from 'moment';
import Image from 'next/image';
import { getTimezoneFromCountryAndState } from '@/app/utils/date.utils';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { fetchUsers } from '@/redux/userSlice/user.thunk';
import { toast } from 'react-toastify';
import type { RcFile } from 'antd/es/upload';
import { useMutation } from 'react-query';
import { bidManagementService } from '@/app/services/bid-management.service';
import { EventOnlineForm } from './event/EventOnline';
import { EventOnSiteForm } from './event/OnSite';
import { EventSiteWalkThroughForm } from './event/EventSiteWalkthrough';
import { RfiDeadline } from './event/RFIDeadline';
import Paragraph from 'antd/es/typography/Paragraph';
import { useCurrencyFormatter } from '@/app/hooks/useCurrencyFormatter';

type Props = {
  children?: React.ReactNode;
  formik: FormikProps<IBidManagement>;
};

export function PostFinalize({ formik, children }: Props) {
  const { values } = formik;
  const [userData, setUserData] = useState<{ label: string; value: string }[]>(
    []
  );
  const dispatch = useDispatch<AppDispatch>();
  const currency = useCurrencyFormatter({
    currency: values.currency,
  });
  const fetchCompanyEmployeeHandler = useCallback(async () => {
    let result: any = await dispatch(fetchUsers({ limit: 9, page: 1 }));

    setUserData(
      result.payload?.data?.employees
        .filter((u: any) => !u.roles.includes('Subcontractor'))
        .map((user: any) => {
          return {
            label: `${user.firstName} ${user.lastName}`,
            value: user.email,
          };
        })
    );
  }, []);

  useEffect(() => {
    fetchCompanyEmployeeHandler();
  }, []);

  const readCSVMutation = useMutation({
    mutationKey: 'upload-csv',
    mutationFn: async (file: RcFile) => {
      const formData = new FormData();
      formData.append('import-excel', file);
      return bidManagementService.httpUploadCSVFile(formData);
    },
    onError: () => {
      toast.error('Error in the file');
    },
    onSuccess: (res) => {
      const invitedMembers = res.data.flat();
      formik.setFieldValue('invitedMembers', invitedMembers);
    },
  });

  return (
    <div className="space-y-6">
      <div className=" bg-white shadow-[0_4px_30px_0px_#2E2D740D] rounded-xl border p-4">
        <TertiaryHeading
          title="Summary"
          className="text-[20px] leading-[30px]"
        />
        <fieldset className="border-[2px] mt-[21px] space-y-4 p-4  rounded-lg border-dashed border-[#aeafb8] relative">
          <legend className="text-[#667085] text-[14px] leading-6 absolute -top-4 z-10 bg-white w-fit px-2">
            Basic Information
          </legend>

          <div className="grid grid-cols-4 gap-3">
            <div className="space-y-2">
              <SenaryHeading
                title="Project Name"
                className="text-[14px] leading-6 text-[#98A2B3] font-normal"
              />
              <p className="text-[#344054] text-[14px] leading-6 font-medium ">
                {values.projectName}
              </p>
            </div>
            <div className="space-y-2">
              <SenaryHeading
                title="Address"
                className="text-[14px] leading-6 text-[#98A2B3] font-normal"
              />
              <p className="text-[#344054] text-[14px] leading-6 font-medium ">
                {values.address}
              </p>
            </div>
            <div className="space-y-2">
              <SenaryHeading
                title="Zip Code"
                className="text-[14px] leading-6 text-[#98A2B3] font-normal"
              />
              <p className="text-[#344054] text-[14px] leading-6 font-medium ">
                {values.zipCode}
              </p>
            </div>
            <div className="space-y-2">
              <SenaryHeading
                title="City"
                className="text-[14px] leading-6 text-[#98A2B3] font-normal"
              />
              <p className="text-[#344054] text-[14px] leading-6 font-medium ">
                {values.city}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div className="space-y-2">
              <SenaryHeading
                title="Bid Due"
                className="text-[14px] leading-6 text-[#98A2B3] font-normal"
              />
              <p className="text-[#344054] text-[14px] leading-6 font-medium ">
                {moment(formik.values.bidDueDate).format('ll')}
              </p>
            </div>
            <div className="space-y-2">
              <SenaryHeading
                title="Estimated Start Date: "
                className="text-[14px] leading-6 text-[#98A2B3] font-normal"
              />
              <p className="text-[#344054] text-[14px] leading-6 font-medium ">
                {moment(values.estimatedStartDate).format('DD MMM YYYY')}
              </p>
            </div>
            <div className="space-y-2">
              <SenaryHeading
                title="Estimated Completion Date"
                className="text-[14px] leading-6 text-[#98A2B3] font-normal"
              />
              <p className="text-[#344054] text-[14px] leading-6 font-medium ">
                {moment(formik.values.estimatedCompletionDate).format('ll')}
              </p>
            </div>
            <div className="space-y-2">
              <SenaryHeading
                title="Time Zone"
                className="text-[14px] leading-6 text-[#98A2B3] font-normal"
              />
              <p className="text-[#344054] text-[14px] leading-6 font-medium ">
                {getTimezoneFromCountryAndState(values.country, values.state)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div className="space-y-2">
              <SenaryHeading
                title="Duration"
                className="text-[14px] leading-6 text-[#98A2B3] font-normal"
              />
              <p className="text-[#344054] text-[14px] leading-6 font-medium ">
                {values.estimatedDuration} {values.durationType}
              </p>
            </div>
            <div className="space-y-2">
              <SenaryHeading
                title="Square Footage"
                className="text-[14px] leading-6 text-[#98A2B3] font-normal"
              />
              <p className="text-[#344054] text-[14px] leading-6 font-medium ">
                {formik.values.squareFootage}
              </p>
            </div>
            <div className="space-y-2">
              <SenaryHeading
                title="Project Value"
                className="text-[14px] leading-6 text-[#98A2B3] font-normal"
              />
              <p className="text-[#344054] text-[14px] leading-6 font-medium ">
                {currency.format(formik.values.projectValue)}
              </p>
            </div>
            <div className="space-y-2">
              <SenaryHeading
                title="Stage"
                className="text-[14px] leading-6 text-[#98A2B3] font-normal"
              />
              <p className="text-[14px] leading-6 font-normal py-[7px] px-3 bg-[#ECFDF3] rounded-md w-fit text-[#027A48]">
                {values.stage}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-[8px]">
              <div className="space-y-[8px]">
                <SenaryHeading
                  title="Project Type"
                  className="text-[14px] leading-6 text-[#98A2B3] font-normal"
                />

                <div className="flex items-center space-x-3">
                  {values.projectType.map((pt) => (
                    <p
                      key={pt}
                      className="px-[12px] rounded py-[7px] bg-[#E6F2F8] text-[#475467] text-[14px] leading-4"
                    >
                      {pt}
                    </p>
                  ))}
                </div>
              </div>
              <div className="space-y-[8px]">
                <SenaryHeading
                  title="Project Building Use"
                  className="text-[14px] leading-6 text-[#98A2B3] font-normal"
                />

                <div className="grid grid-cols-3 gap-3 justify-center items-center">
                  {values.projectBuildingUse.map((building) => (
                    <div
                      key={building}
                      className="px-[12px] break-words rounded py-[7px] bg-[#E6F2F8] text-[#475467] text-[14px] leading-4"
                    >
                      {building}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-[8px] self-center">
              <div className="space-y-[8px]">
                <SenaryHeading
                  title="Construction Type"
                  className="text-[14px] leading-6 text-[#98A2B3] font-normal"
                />

                <div className="flex items-center space-x-3">
                  {values.constructionTypes.map((ct) => (
                    <p
                      key={ct}
                      className="px-[12px] rounded py-[7px] bg-[#E6F2F8] text-[#475467] text-[14px] leading-4"
                    >
                      {ct}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <SenaryHeading
                title="Project Description"
                className="text-[14px] leading-6 text-[#98A2B3] font-normal"
              />
              <Paragraph
                ellipsis={{
                  expandable: true,
                  rows: 2,
                  symbol: 'Read more',
                }}
                className="text-[#344054] text-[14px] leading-6 font-medium"
              >
                {values.description}
              </Paragraph>
            </div>
            {values.specialInstructions.length ? (
              <div className="space-y-2">
                <SenaryHeading
                  title="Special Instructions"
                  className="text-[14px] leading-6 text-[#98A2B3] font-normal"
                />
                <Paragraph
                  ellipsis={{
                    expandable: true,
                    rows: 2,
                    symbol: 'Read more',
                  }}
                  className="text-[#344054] text-[14px] leading-6 font-medium"
                >
                  {values.specialInstructions}
                </Paragraph>
              </div>
            ) : null}
          </div>
        </fieldset>
      </div>

      <div className=" bg-white shadow-[0_4px_30px_0px_#2E2D740D] rounded-xl border p-4">
        <TertiaryHeading
          title="Add Event"
          className="text-[20px] leading-[30px]"
        />

        <div className="mt-5">
          <div className="flex items-center space-x-10 ">
            <div className="flex items-center space-x-5">
              <Switch
                checkedChildren="ON"
                unCheckedChildren="OFF"
                checked={formik.values.preBiddingMeeting?.isChecked}
                onChange={(val) => {
                  formik.setFieldValue('preBiddingMeeting.isChecked', val);
                }}
              />
              <TertiaryHeading
                title="Required Pre-bid Meeting"
                className="text-[#344054] text-[16px] leading-7 font-normal"
              />
            </div>

            {formik.values.preBiddingMeeting?.isChecked ? (
              <div>
                <Radio.Group
                  value={formik.values.preBiddingMeeting?.type}
                  onChange={(e) => {
                    formik.setFieldValue(
                      'preBiddingMeeting.type',
                      e.target.value
                    );
                  }}
                >
                  <Radio value={'Onsite'}>Onsite</Radio>
                  <Radio value={'Online'}>Online</Radio>
                </Radio.Group>
              </div>
            ) : null}
          </div>
          {formik.values.preBiddingMeeting?.isChecked ? (
            <div className="my-2">
              <Checkbox
                checked={formik.values.preBiddingMeeting?.isMandatory}
                onChange={(e) => {
                  formik.setFieldValue(
                    'preBiddingMeeting.isMandatory',
                    e.target.checked
                  );
                }}
              >
                {"It's a mandatory meeting"}
              </Checkbox>
            </div>
          ) : null}
          <EventOnSiteForm formik={formik} />

          <EventOnlineForm formik={formik} />
        </div>

        <div className="mt-5">
          <div className="flex items-center space-x-5">
            <Switch
              checkedChildren="ON"
              unCheckedChildren="OFF"
              checked={formik.values.siteWalkthrough?.isChecked}
              onChange={(val) =>
                formik.setFieldValue('siteWalkthrough.isChecked', val)
              }
            />
            <TertiaryHeading
              title="Site Walkthrough"
              className="text-[#344054] text-[16px] leading-7 font-normal"
            />
          </div>

          <EventSiteWalkThroughForm formik={formik} />
        </div>

        <div className="mt-5">
          <div className="flex items-center space-x-5">
            <Switch
              checkedChildren="ON"
              unCheckedChildren="OFF"
              checked={formik.values.rfiDeadline?.isChecked}
              onChange={(val) =>
                formik.setFieldValue('rfiDeadline.isChecked', val)
              }
            />
            <TertiaryHeading
              title="RFI Deadline"
              className="text-[#344054] text-[16px] leading-7 font-normal"
            />
          </div>

          <RfiDeadline formik={formik} />
        </div>
      </div>

      <div className=" bg-white shadow-[0_4px_30px_0px_#2E2D740D] rounded-xl border p-4">
        <TertiaryHeading
          title="Invite and Finalize"
          className="text-[20px] leading-[30px]"
        />

        <div className="flex items-center space-x-4 mt-5">
          <button
            className={`justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border ${formik.values.platformType === 'Public' ? 'border-[#007AB6] bg-[#E6F2F8]' : 'border-[#E4E4E4] bg-white'} cursor-pointer disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 flex items-center space-x-2 rounded-lg   p-5`}
            onClick={() => {
              formik.setFieldValue('platformType', 'Public');
              formik.setFieldValue('isMatchingWithTrades', true);
            }}
          >
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
              className="text-[#007AB6]"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <span className="text-[#181818] text-[16px] font-normal leading-4">
              Public Planroom (Free)
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#828FA3]"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
          </button>

          <button
            className={`justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border ${formik.values.platformType === 'Private' ? 'border-[#007AB6] bg-[#E6F2F8]' : 'border-[#E4E4E4] bg-white'}  cursor-pointer disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 flex items-center space-x-2 rounded-lg  p-5`}
            onClick={() => {
              formik.setFieldValue('platformType', 'Private');

              formik.setFieldValue('isMatchingWithTrades', false);
            }}
          >
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
              className="text-[#EF9F28]"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span className="text-[#181818] text-[16px] font-normal leading-4">
              Private Planroom ( Free)
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#828FA3]"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
          </button>
        </div>

        <div className="mt-5">
          <SelectComponent
            label="Select your team members who can receive bids"
            name="selectedTeamMembers"
            labelStyle="text-[14px] leading-6 text-[#98A2B3] font-normal"
            placeholder="Estimating Team (You)"
            field={{
              mode: 'tags',
              value: formik.values.selectedTeamMembers,
              options: userData,
              onChange: (value) =>
                formik.setFieldValue('selectedTeamMembers', value),
              onBlur: formik.handleBlur,
              status:
                formik.touched.selectedTeamMembers &&
                Boolean(formik.errors.selectedTeamMembers)
                  ? 'error'
                  : undefined,
            }}
            hasError={
              formik.touched.selectedTeamMembers &&
              Boolean(formik.errors.selectedTeamMembers)
            }
            errorMessage={
              formik.touched.selectedTeamMembers &&
              Boolean(formik.errors.selectedTeamMembers) &&
              Array.isArray(formik.errors.selectedTeamMembers)
                ? formik.errors.selectedTeamMembers
                    .map(
                      (item: string, idx) =>
                        `'${formik.values.selectedTeamMembers![idx]}' ${item}`
                    )
                    .toString()
                : (formik.errors.selectedTeamMembers as string)
            }
          />
        </div>

        <Divider className="border-dashed border-t-2" />

        <div className="grid grid-cols-2 gap-6 mt-2">
          {formik.values.platformType === 'Public' ? (
            <div className="space-y-2">
              <Checkbox
                checked={formik.values.isMatchingWithTrades}
                // onChange={(e) => {
                //   formik.setFieldValue('isMatchingWithTrades', e.target.checked);
                // }}
              >
                <SenaryHeading
                  title="Schesti members with matching trades and region"
                  className="text-[#344054] font-normal leading-7 text-[14px]"
                />
              </Checkbox>

              <Checkbox
                checked={formik.values.sendInMyNetwork}
                onChange={(e) => {
                  formik.setFieldValue('sendInMyNetwork', e.target.checked);
                }}
              >
                <SenaryHeading
                  title="My In-Network members (Sends only to those with matching trades and regions)"
                  className="text-[#667085] font-normal leading-7 text-[14px] !w-fit"
                />
              </Checkbox>
            </div>
          ) : (
            <div></div>
          )}

          <div className="space-y-2">
            <SenaryHeading
              title="To send ITB to a full list overriding matching trades and regions, use saved lists below or upload/enter email addresses below."
              className="text-[#344054] text-[14px] leading-6"
            />

            <SelectComponent
              label="Add email address"
              name="invitedMembers"
              placeholder="Enter email address"
              field={{
                mode: 'tags',
                value: formik.values.invitedMembers,
                onChange: (value) =>
                  formik.setFieldValue('invitedMembers', value),
                onBlur: formik.handleBlur,
                status:
                  formik.touched.invitedMembers &&
                  Boolean(formik.errors.invitedMembers)
                    ? 'error'
                    : undefined,
                dropdownStyle: {
                  display: 'none',
                },
              }}
              hasError={
                formik.touched.invitedMembers &&
                Boolean(formik.errors.invitedMembers)
              }
              errorMessage={
                formik.touched.invitedMembers &&
                Boolean(formik.errors.invitedMembers) &&
                Array.isArray(formik.errors.invitedMembers)
                  ? formik.errors.invitedMembers
                      .map(
                        (item: string, idx) =>
                          `'${formik.values.invitedMembers![idx]}' ${item}`
                      )
                      .toString()
                  : (formik.errors.invitedMembers as string)
              }
            />

            <div className="space-y-1 px-1">
              <Dragger
                name={'file'}
                accept=".csv,.xlsx,.xls,"
                beforeUpload={(file) => {
                  const isLessThan2MB = file.size < 2 * 1024 * 1024;
                  if (!isLessThan2MB) {
                    toast.error('File size should be less than 2MB');
                    return false;
                  }

                  readCSVMutation.mutate(file);
                  return false;
                }}
                style={{
                  borderStyle: 'dashed',
                  borderWidth: 2,
                }}
                itemRender={() => {
                  return null;
                }}
              >
                <Spin spinning={readCSVMutation.isLoading}>
                  <p className="ant-upload-drag-icon">
                    <Image
                      src={'/uploadcloud.svg'}
                      width={34}
                      height={34}
                      alt="upload"
                    />
                  </p>
                  <p className="text-[12px] leading-3 text-[#98A2B3]">
                    Drop your emails here, or browse
                  </p>
                </Spin>
              </Dragger>

              <a
                className="text-schestiPrimary underline  underline-offset-2 text-[14px] leading-5"
                // downloadable
                href="/email-template.xlsx"
                download="email-template.xlsx"
              >
                Download format
              </a>
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
