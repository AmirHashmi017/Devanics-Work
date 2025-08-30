import { InputComponent } from '@/app/component/customInput/Input';
import TertiaryHeading from '@/app/component/headings/tertiary';
import { IRFI } from '@/app/interfaces/rfi.interface';
import { rfiService } from '@/app/services/rfi.service';
import { SearchOutlined } from '@ant-design/icons';
import { Avatar, Skeleton } from 'antd';
import { AxiosError } from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { RFIReply } from './RFIReply';
import { CreateRFI } from '@/app/(pages)/bid-management/sub-contractor/components/CreateRFI';
import { UpdateRFI } from '@/app/(pages)/bid-management/sub-contractor/components/UpdateRFI';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { IUser } from '@/app/interfaces/companyEmployeeInterfaces/user.interface';
import dynamic from 'next/dynamic';
const ExportProjectRFIs = dynamic(
  () => import('../../../components/ExportProjectRFI'),
  { ssr: false }
);

type Props = {
  projectId: string;
};

export function ProjectRFICenter({ projectId }: Props) {
  const [rfis, setRfis] = useState<IRFI[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [search, setSearch] = useState('');
  const authUser = useSelector(
    (state: RootState) => state.auth.user as { user?: IUser }
  );

  useEffect(() => {
    fetchRFIs();
  }, [projectId]);

  async function fetchRFIs() {
    if (projectId) {
      setIsFetching(true);
      rfiService
        .httpGetAllProjectRFIs(projectId)
        .then((res) => {
          if (res.data) {
            setRfis(res.data.rfis);
          }
        })
        .catch((err) => {
          const error = err as AxiosError<{ message: string }>;
          toast.error(error.response?.data.message || 'An error occurred');
        })
        .finally(() => {
          setIsFetching(false);
        });
    }
  }

  if (isFetching) {
    return <Skeleton />;
  }

  const parentRfis = rfis.filter((rfi) => !rfi.responseTo);
  const rfiReplies = (rfiId: string) =>
    rfis.filter((rfi) => rfi.responseTo && rfi.responseTo === rfiId);

  return (
    <div className="mb-4 md:ms-[69px] md:me-[59px] mx-4  ">
      <div className="flex items-center justify-between">
        <TertiaryHeading
          title="RFI Center"
          className="text-[20px] leading-[30px]"
        />

        <div className="flex items-center space-x-2">
          <div className="pt-1">
            <ExportProjectRFIs rfis={rfis} />
          </div>

          <div className="w-96">
            <InputComponent
              label=""
              placeholder="Search"
              name="search"
              type="text"
              field={{
                prefix: <SearchOutlined className="text-xl" />,
                value: search,
                onChange: (e) => {
                  setSearch(e.target.value);
                },
              }}
            />
          </div>
        </div>
      </div>

      {parentRfis
        .filter((rfi) => {
          if (!search) {
            return true;
          }
          return rfi.description.toLowerCase().includes(search.toLowerCase());
        })
        .map((rfi) => {
          const user = rfi.user;

          return (
            <div
              key={rfi._id}
              className="px-2 bg-white rounded-lg shadow mt-4 space-y-2"
            >
              <div className="flex">
                <Avatar
                  src={
                    typeof rfi.user !== 'string'
                      ? rfi.user.avatar ?? rfi.user.companyLogo
                      : ''
                  }
                  size={40}
                  className="mt-4"
                />

                <div className="py-4 flex-1 px-4 space-y-2">
                  <div className="flex justify-between">
                    <TertiaryHeading
                      title={`${typeof user !== 'string' ? user.companyName || user.organizationName || user.name : ''} | ${moment(rfi.createdAt).format('MMM DD, YYYY, hh:mm A')}`}
                      className="text-[14px] leading-5 font-normal text-[#98A2B3]"
                    />
                    <div className="flex items-center space-x-4">
                      {rfi.type === 'private' ? (
                        <p className="py-[5px] rounded-full px-[11px] bg-[#E9EBF8] text-[#7138DF] text-xs leading-4">
                          Private
                        </p>
                      ) : null}

                      {/* current date === createdAt then display */}

                      {moment().isSame(rfi.createdAt, 'day') ? (
                        <p className="py-[5px] rounded-full px-[11px] bg-[#E9EBF8] text-[#7138DF] text-xs leading-4">
                          <CreateRFI
                            isProjectOwner={true}
                            onSuccess={() => {}}
                            projectId={projectId}
                          />
                        </p>
                      ) : null}
                      <RFIReply
                        key={rfi._id}
                        onSuccess={(rfi) => {
                          setRfis([rfi, ...rfis]);
                        }}
                        projectId={rfi.projectId}
                        messageId={rfi._id}
                        isDisabledPublic={rfi.type === 'private'}
                      />
                      {typeof rfi.user !== 'string' &&
                      rfi.user._id === authUser.user?._id ? (
                        <UpdateRFI
                          onSuccess={(_rfi) => {
                            const updatedRfis = [...rfis].map((rfiItem) => {
                              if (rfiItem._id === _rfi._id) {
                                return _rfi;
                              }
                              return rfiItem;
                            });
                            setRfis(updatedRfis);
                          }}
                          rfiData={rfi}
                          projectId={projectId}
                        />
                      ) : null}
                    </div>
                  </div>
                  <TertiaryHeading
                    title={rfi.description}
                    className="text-[#475467] text-[14px] leading-6 font-normal "
                  />

                  {rfi.file ? (
                    <div className="mt-2 p-2 flex items-center border border-[#E1E5EA] rounded-md w-[270px] space-x-2">
                      <div className="w-[44px] h-[44px] justify-center rounded-md items-center flex bg-[#FFEBC6]">
                        <Avatar
                          src={'/file-yellow.svg'}
                          alt="file icon"
                          size={'small'}
                          shape="square"
                        />
                      </div>

                      <div className="space-y-1">
                        <TertiaryHeading
                          title={`${rfi.file.name.slice(0, 12)}.${rfi.file.extension}`}
                          className="text-[14px] font-normal leading-5"
                        />

                        <a
                          href={rfi.file.url}
                          target="_blank"
                          className="text-xs hover:underline hover:underline-offset-2 cursor-pointer font-normal leading-5 text-[#929FB1]"
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
              {/* replies */}
              {rfiReplies(rfi._id).map((reply) => (
                <div key={reply._id} className="flex border-t">
                  <Avatar
                    src={
                      typeof reply.user !== 'string'
                        ? reply.user.avatar ?? reply.user.companyLogo
                        : ''
                    }
                    size={40}
                    className="mt-4"
                  />

                  <div className="py-4 flex-1 px-4 space-y-2">
                    <div className="flex justify-between">
                      <TertiaryHeading
                        title={`${typeof reply.user !== 'string' ? reply.user.companyName || reply.user.organizationName || reply.user.name : ''} | ${moment(reply.createdAt).format('MMM DD, YYYY, hh:mm A')}`}
                        className="text-[14px] leading-5 font-normal text-[#98A2B3]"
                      />
                      <div className="flex items-center space-x-4">
                        {reply.type === 'private' ? (
                          <p className="py-[5px] rounded-full px-[11px] bg-[#E9EBF8] text-[#7138DF] text-xs leading-4">
                            Private
                          </p>
                        ) : null}

                        {typeof reply.user !== 'string' &&
                        reply.user._id === authUser.user?._id ? (
                          <UpdateRFI
                            onSuccess={(_rfi) => {
                              const updatedRfis = [...rfis].map((rfiItem) => {
                                if (rfiItem._id === _rfi._id) {
                                  return _rfi;
                                }
                                return rfiItem;
                              });
                              setRfis(updatedRfis);
                            }}
                            rfiData={reply}
                            projectId={projectId}
                          />
                        ) : null}
                      </div>
                    </div>
                    <TertiaryHeading
                      title={reply.description}
                      className="text-[#475467] text-[14px] leading-6 font-normal "
                    />

                    {reply.file ? (
                      <div className="mt-2 p-2 flex items-center border border-[#E1E5EA] rounded-md w-[270px] space-x-2">
                        <div className="w-[44px] h-[44px] justify-center rounded-md items-center flex bg-[#FFEBC6]">
                          <Avatar
                            src={'/file-yellow.svg'}
                            alt="file icon"
                            size={'small'}
                            shape="square"
                          />
                        </div>

                        <div className="space-y-1">
                          <TertiaryHeading
                            title={`${reply.file.name.slice(0, 12)}.${reply.file.extension}`}
                            className="text-[14px] font-normal leading-5"
                          />

                          <a
                            href={reply.file.url}
                            target="_blank"
                            className="text-xs hover:underline hover:underline-offset-2 cursor-pointer font-normal leading-5 text-[#929FB1]"
                          >
                            Download
                          </a>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
    </div>
  );
}
