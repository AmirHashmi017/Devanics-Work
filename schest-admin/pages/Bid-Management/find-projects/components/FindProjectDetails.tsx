import { Avatar, Divider } from 'antd';
import { Country } from 'country-state-city';
import moment from 'moment';
import CustomButton from 'src/components/CustomButton/button';
import SenaryHeading from 'src/components/Headings/SenaryHeading';
import { AdminGetAllProjectsType } from 'src/interfaces/bid-management/bid-management.interface';
import { UsCurrencyFormat } from 'src/utils/common';
import { SendEmailModal } from '../../components/SendEmail';
import { downloadFile } from 'src/utils/downloadFile';
import { useNavigate } from 'react-router-dom';
import { useCurrencyFormatter } from 'src/hooks/useCurrencyFormatter';

type Project = AdminGetAllProjectsType['projects'][0];
type Props = {
  project: Project;
};
export function FindProjectItemDetails({ project }: Props) {
  const currency = useCurrencyFormatter();
  const navigate = useNavigate();
  const downloadAllFiles = async (files: any[]) => {
    files.forEach(async (file: any) => {
      downloadFile(file.url, file.name);
    });
  };

  return (
    <div className="py-[24px] px-[17px] rounded-lg mt-3 border border-[#E9E9EA]">
      <div className="flex items-center justify-between">
        <SenaryHeading
          title={`Posted: ${moment(project.createdAt).format(
            'DD MMM YYYY, hh:mm'
          )}`}
          className="text-[#475467] text-sm leading-4 font-normal"
        />
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-schestiLightPrimary py-[5px] px-[11px]">
            <SenaryHeading
              title={project.stage}
              className="text-schestiPrimary font-normal text-xs leading-4"
            />
          </div>

          {/* <img src="/assets/icons/black-trash.svg" alt="" width={16} height={16} /> */}
          <SendEmailModal
            projectId={project._id}
            to={project.userData.email}
            Component={
              <img
                src="/assets/icons/black-mail.svg"
                alt=""
                width={16}
                height={16}
              />
            }
          />
        </div>
      </div>

      <div className="mt-[14px]">
        <SenaryHeading
          title={project.projectName}
          className="text-[#475467] text-base leading-6 font-semibold"
        />

        <SenaryHeading
          title={project.description}
          className="text-[#475467] text-[14px] leading-6 font-normal mt-2"
        />
        <div
          className="text-schestiPrimary underline underline-offset-2 text-[14px] leading-6 font-normal cursor-pointer"
          onClick={() => {
            navigate('/projects/details/' + project._id);
          }}
        >
          View full details
        </div>
      </div>
      <Divider />
      <div className="my-4 space-y-3">
        <div className="flex items-center space-x-1">
          <SenaryHeading
            title="Location:"
            className="text-[#475467] text-sm leading-4 font-normal"
          />
          <SenaryHeading
            title={`${project.city}, ${Country.getCountryByCode(project.country)
              ?.name}`}
            className="text-[#475467] text-sm leading-4 font-semibold"
          />
        </div>

        <div className="flex items-center space-x-1">
          <SenaryHeading
            title="Project Value:"
            className="text-[#475467] text-sm leading-4 font-normal"
          />
          <SenaryHeading
            title={`${currency.format(
              project.projectValue,
              project.currency?.locale,
              project.currency?.code
            )}`}
            className="text-[#475467] text-sm leading-4 font-semibold"
          />
        </div>
        <div className="flex items-center space-x-1">
          <SenaryHeading
            title="Bid Date:"
            className="text-[#475467] text-sm leading-4 font-normal"
          />
          <SenaryHeading
            title={`${moment(project.bidDueDate).format('DD MMM YYYY, hh:mm')}`}
            className="text-[#475467] text-sm leading-4 font-semibold"
          />
        </div>
      </div>
      <Divider />

      <div>
        <div className="flex items-center space-x-3">
          <SenaryHeading
            title="Who is bidding the project?"
            className="text-[#475467] text-base leading-6 font-semibold"
          />

          {project.isForSubContractor ? (
            <SenaryHeading
              title="Reposted"
              className="text-schestiPrimary rounded-full text-xs px-2 bg-schestiLightPrimary  py-1 font-semibold"
            />
          ) : null}
        </div>

        <div className="bg-schestiLightPrimary mt-3 rounded-md  p-3 border border-[#EBEAEC]">
          <div className="flex justify-between">
            <div className="flex mt-1 space-x-2">
              <Avatar
                size={24}
                src={project.userData?.avatar || project.userData?.companyLogo}
              >
                {project.userData.name[0]}
              </Avatar>

              <SenaryHeading
                title={
                  project.userData.companyName ||
                  project.userData.organizationName
                }
                className="text-[#475467] text-[14px] leading-6 font-semibold"
              />
            </div>

            <div className="">
              <SenaryHeading
                title={
                  project.userData.userRole === 'owner'
                    ? 'Owner'
                    : 'Representative'
                }
                className="text-schestiPrimary underline underline-offset-2 text-[14px] leading-6 font-normal"
              />
              <SenaryHeading
                title={project.userData.name}
                className="text-[#475467] text-[14px] leading-6 font-normal"
              />
            </div>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <SenaryHeading
              title={`Phone: ${
                project.userData.phone ? project.userData.phone : ''
              }`}
              className="text-[#475467] text-[14px] leading-6 font-normal"
            />

            <SenaryHeading
              title={`Email: ${project.userData.email}`}
              className="text-[#475467] text-[14px] leading-6 font-normal"
            />
          </div>
        </div>
      </div>
      <Divider className="my-2" />

      <div className="flex items-center py-[5px] px-[11px] space-x-2 cursor-pointer">
        {project.projectFiles.length > 0 && (
          <>
            <img
              alt="cloud icon"
              src={'/assets/icons/uploadcloud.svg'}
              width={16}
              height={16}
            />
            <SenaryHeading
              title="Download all files"
              className="text-schestiPrimary text-xs leading-4 font-semibold underline underline-offset-2"
              onClick={() => downloadAllFiles(project.projectFiles)}
            />
          </>
        )}
      </div>

      <div className="space-y-3 mt-3">
        {/* <CustomButton 
            text="Archive"
                className="!border-schestiLightPrimary !text-schestiPrimary !bg-schestiLightPrimary"
            /> */}
        <SendEmailModal
          Component={
            <CustomButton
              text="Send an email"
              className="!text-schestiPrimary !bg-white"
            />
          }
          projectId={project._id}
          to={project.userData.email}
        />
      </div>
    </div>
  );
}
