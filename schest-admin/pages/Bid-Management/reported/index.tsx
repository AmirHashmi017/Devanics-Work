import { Avatar, List, Pagination } from 'antd';
import { AxiosError } from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CustomButton from 'src/components/CustomButton/button';
import { InputComponent } from 'src/components/CustomInput/Input';
import SenaryHeading from 'src/components/Headings/SenaryHeading';
import { IBidProjectReport } from 'src/interfaces/bid-management/bid-management.interface';
import { bidManagementService } from 'src/services/bid-management.service';
import { UserOutlined } from '@ant-design/icons';
import _ from 'lodash';

export function ReportedProjectsPage() {
  const [data, setData] = useState<{
    reportedProjects: IBidProjectReport[];
    total: number;
  }>({
    reportedProjects: [],
    total: 0,
  });
  const [search, setSearch] = useState('');

  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    getData();
  }, [pagination]);

  const getData = async () => {
    setLoading(true);
    try {
      const response =
        await bidManagementService.httpAdminGetReportedProjects(pagination);
      if (response.data) {
        setData(response.data);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 mb-[39px] mx-4 ">
      <section className="p-3 px-4 space-y-3">
        <div className="flex justify-between items-center">
          <SenaryHeading
            title="Reported Projects"
            className="text-[20px] text-schestiPrimaryBlack leading-7 font-semibold"
          />
          <div className="flex items-center space-x-3">
            <div className="w-96">
              <InputComponent
                label=""
                placeholder="Search"
                name=""
                type="text"
                field={{
                  prefix: (
                    <img
                      src="/assets/icons/search.svg"
                      width={20}
                      height={20}
                      alt="search"
                    />
                  ),
                  onChange: (e) => setSearch(e.target.value),
                  value: search,
                }}
              />
            </div>
            <div>
              {/* <WhiteButton
                        text="Export"
                        className="!w-fit"
                        icon="/assets/icons/uploadcloud.svg"
                        iconheight={20}
                        iconwidth={20}
                        />
                        */}
            </div>
          </div>
        </div>

        <List
          dataSource={data.reportedProjects.filter(
            (item) =>
              (typeof item.project !== 'string' &&
                item.project.projectName
                  .toLowerCase()
                  .includes(search.toLowerCase())) ||
              (item.reasonType || []).some((reason) =>
                reason.toLowerCase().includes(search.toLowerCase())
              ) ||
              (item.reason || '').toLowerCase().includes(search.toLowerCase())
          )}
          renderItem={(item) => {
            const project =
              typeof item.project === 'string' ? undefined : item.project;
            const user = typeof item.user === 'string' ? undefined : item.user;
            const projectCreator =
              project && typeof project.user != 'string'
                ? project.user
                : undefined;

            return (
              <List.Item
                style={{
                  padding: 16,
                }}
                className="mt-2 rounded-xl bg-white shadow-lg flex items-center justify-between  p-4 "
              >
                {/* Project and Report Information */}

                <div className="space-y-2">
                  <SenaryHeading
                    title={project ? project.projectName : ''}
                    className="text-[20px] text-schestiPrimaryBlack leading-7 font-semibold"
                  />

                  <div className="flex items-center space-x-3">
                    {/* Report Time */}
                    <div className="flex items-center space-x-2">
                      <SenaryHeading
                        title={'Report Time:'}
                        className="text-schestiLightBlack"
                      />
                      <SenaryHeading
                        title={moment(item.createdAt).format(
                          'MMM DD YYYY, h:mm:A'
                        )}
                      />
                    </div>

                    {/* Report Type */}
                    <div className="flex items-center space-x-2">
                      <SenaryHeading
                        title={'Reported Category:'}
                        className="text-schestiLightBlack"
                      />
                      <div className="grid grid-cols-3 items-center">
                        {item.reasonType.map((reason) => (
                          <div
                            key={reason}
                            className="px-2 py-0.5 bg-[#FEF3F2] rounded-xl"
                          >
                            <SenaryHeading
                              key={reason}
                              title={reason}
                              className="text-[#F68500] "
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Report Reason */}
                  <div className="flex items-center space-x-2 w-[300px]">
                    <SenaryHeading
                      title={'Report Reason:'}
                      className="text-schestiLightBlack"
                    />
                    <SenaryHeading
                      title={_.truncate(item.reason, { length: 100 })}
                      className="whitespace-pre-wrap break-words"
                    />
                  </div>
                </div>

                {/* User Information */}
                <div className="flex items-center gap-4">
                  {/* Project Posted By */}
                  <div className="space-y-2">
                    <SenaryHeading
                      title={'Project Posted By:'}
                      className="text-schestiLightBlack"
                    />
                    {projectCreator ? (
                      <div className="flex items-center space-x-2">
                        {projectCreator.companyLogo || projectCreator.avatar ? (
                          <Avatar
                            size="large"
                            src={
                              projectCreator.companyLogo ||
                              projectCreator.avatar
                            }
                          />
                        ) : (
                          <Avatar size="large" icon={<UserOutlined />} />
                        )}
                        <SenaryHeading
                          title={
                            projectCreator.companyName ||
                            projectCreator.organizationName
                          }
                          className="text-schestiPrimaryBlack"
                        />
                      </div>
                    ) : null}
                  </div>

                  {/* Reported By */}
                  <div className="space-y-2">
                    <SenaryHeading
                      title={'Reported By:'}
                      className="text-schestiLightBlack"
                    />

                    {user ? (
                      <div className="flex items-center ">
                        {user.companyLogo || user.avatar ? (
                          <Avatar
                            size="large"
                            src={user.companyLogo || user.avatar}
                          />
                        ) : (
                          <Avatar size="large" icon={<UserOutlined />} />
                        )}
                        <SenaryHeading
                          title={user.companyName || user.organizationName}
                          className="text-schestiPrimaryBlack"
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              </List.Item>
            );
          }}
          loading={loading}
          rowKey={(item) => item._id}
        />

        {data.reportedProjects.length > 0 ? (
          <div className="flex justify-center">
            <Pagination
              total={data.total}
              showSizeChanger
              current={pagination.page}
              onChange={(page, pageSize) =>
                setPagination({ ...pagination, page, limit: pageSize })
              }
            />
          </div>
        ) : null}
      </section>
    </div>
  );
}
