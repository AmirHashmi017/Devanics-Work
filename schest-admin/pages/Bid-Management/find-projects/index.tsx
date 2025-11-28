import { Pagination, Spin, Tabs } from 'antd';
import { AxiosError } from 'axios';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import WhiteButton from 'src/components/CustomButton/white';
import { InputComponent } from 'src/components/CustomInput/Input';
import SenaryHeading from 'src/components/Headings/SenaryHeading';
import { AdminGetAllProjectsType } from 'src/interfaces/bid-management/bid-management.interface';
import { selectToken } from 'src/redux/authSlices/auth.selector';
import { HttpService } from 'src/services/base.service';
import {
  AdminGetAllProjectsQuery,
  bidManagementService,
} from 'src/services/bid-management.service';
import { LoadingOutlined } from '@ant-design/icons';
import { FindProjectItemDetails } from './components/FindProjectDetails';
import { ProjectIntroCard } from '../components/ProjectIntroCard';
import { Popups } from '../components/Popups';
import { TradeSelectComponent } from '../components/TradeSelect.component';
import { CascaderComponent } from 'src/components/cascader/Cascader.component';
import { City, Country, State } from 'country-state-city';
import { SelectComponent } from 'src/components/customSelect/Select.component';
import CustomButton from 'src/components/CustomButton/button';

const ACTIVE_TAB = 'active';
const ARCHIVE_TAB = 'archived';

type TabType = 'active' | 'archived' | 'deleted';
type Project = AdminGetAllProjectsType['projects'][0];

export function FindProjectsPage() {
  const [activeTab, setActiveTab] = useState<TabType>(ACTIVE_TAB);
  const queryInitialData = {
    page: 1,
    limit: 10,
    tab: activeTab,
  };
  const [data, setData] = useState<AdminGetAllProjectsType | null>(null);
  const [selectedProject, setSelectedProject] = useState<null | Project>(null);
  const [query, setQuery] =
    useState<AdminGetAllProjectsQuery>(queryInitialData);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<{
    country?: string;
    state?: string;
    city?: string;
    trades?: string[];
    projectValue?: number;
  }>({
    country: undefined,
    state: undefined,
    city: undefined,
    projectValue: undefined,
    trades: undefined,
  });

  const token = useSelector(selectToken);

  useLayoutEffect(() => {
    if (token) {
      HttpService.setToken(token);
    }
  }, [token]);

  useEffect(() => {
    getProjects(query);
  }, [query, activeTab]);

  async function getProjects(params: AdminGetAllProjectsQuery) {
    setIsLoading(true);
    setSelectedProject(null);
    try {
      const response =
        await bidManagementService.httpAdminGetAllProjects(params);
      if (response.data) {
        setData(response.data);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data.message);
    } finally {
      setIsLoading(false);
    }
  }

  function closeFilters() {
    setShowFilters(false);
  }

  return (
    <div className="mt-6 mb-[39px] mx-4 ">
      <Tabs
        activeKey={activeTab}
        onChange={(key) => {
          setActiveTab(key as TabType);
          setQuery({ ...queryInitialData, tab: key as TabType });
        }}
        items={[ACTIVE_TAB, ARCHIVE_TAB].map((status) => {
          return {
            label:
              activeTab === status ? (
                <p className="text-schestiPrimary capitalize">
                  {status} Projects
                </p>
              ) : (
                <p className="capitalize">{status} Projects</p>
              ),
            key: status,
          };
        })}
      />
      <section className="rounded-xl bg-white shadow-xl p-3 px-4">
        <div className="flex justify-between items-center">
          <SenaryHeading
            title="Explore Projects"
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
            <div className="relative">
              <WhiteButton
                text="Advance Filters"
                className="!w-fit"
                icon="/assets/icons/filter.svg"
                iconheight={20}
                iconwidth={20}
                onClick={() => setShowFilters(!showFilters)}
              />
              {showFilters ? (
                <div className="absolute top-16 z-10 right-0">
                  <Popups title="Advance Filters" onClose={closeFilters}>
                    <div className="space-y-3">
                      <TradeSelectComponent
                        value={filters.trades}
                        onChange={(value) =>
                          setFilters({ ...filters, trades: value })
                        }
                      />

                      <InputComponent
                        label="Project Value"
                        name=""
                        type="number"
                        placeholder="Enter Project Value"
                        field={{
                          value: filters.projectValue,
                          onChange(e) {
                            setFilters({
                              ...filters,
                              projectValue: Number(e.target.value),
                            });
                          },
                        }}
                      />

                      <div className="flex items-center space-x-2">
                        <SelectComponent
                          label="Country"
                          name=""
                          placeholder="Select Country"
                          field={{
                            options: Country.getAllCountries().map(
                              (country) => {
                                return {
                                  label: country.name,
                                  value: country.isoCode,
                                };
                              }
                            ),
                            onChange(value) {
                              setFilters({
                                ...filters,
                                country: value as string,
                              });
                            },
                            value: filters.country,
                            showSearch: true,
                            allowClear: true,
                            onClear() {
                              setFilters({ ...filters, country: undefined });
                            },
                          }}
                        />
                        <SelectComponent
                          label="State"
                          name=""
                          placeholder="Select State"
                          field={{
                            options: filters.country
                              ? State.getStatesOfCountry(filters.country).map(
                                  (state) => {
                                    return {
                                      label: state.name,
                                      value: state.isoCode,
                                    };
                                  }
                                )
                              : [],
                            value: filters.state,
                            onChange(value) {
                              setFilters({
                                ...filters,
                                state: value as string,
                              });
                            },
                            disabled: !filters.country,
                            showSearch: true,
                            allowClear: true,
                            onClear() {
                              setFilters({ ...filters, state: undefined });
                            },
                          }}
                        />

                        <SelectComponent
                          label="City"
                          name=""
                          placeholder="Select City"
                          field={{
                            options:
                              filters.country && filters.state
                                ? City.getCitiesOfState(
                                    filters.country,
                                    filters.state
                                  ).map((city) => {
                                    return {
                                      label: city.name,
                                      value: city.name,
                                    };
                                  })
                                : [],
                            value: filters.city,
                            onChange(value) {
                              setFilters({ ...filters, city: value as string });
                            },
                            disabled: !filters.country && !filters.state,
                            showSearch: true,
                            allowClear: true,
                            onClear() {
                              setFilters({ ...filters, city: undefined });
                            },
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between py-1">
                        <WhiteButton
                          text="Cancel"
                          className="!w-fit"
                          onClick={closeFilters}
                        />
                        <CustomButton
                          text="Apply"
                          className="!w-fit"
                          onClick={() => {
                            setQuery({ ...queryInitialData, ...filters });
                            setShowFilters(false);
                          }}
                        />
                      </div>
                    </div>
                  </Popups>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <Spin spinning={isLoading} indicator={<LoadingOutlined spin />}>
          <div className="grid grid-cols-12 gap-2 justify-start">
            <div
              className={`${
                selectedProject?._id ? 'col-span-7' : 'col-span-12'
              }`}
            >
              {data
                ? data.projects.map((project) => {
                    return (
                      <ProjectIntroCard
                        key={project._id}
                        project={project}
                        selectedProject={selectedProject}
                        setSelectedProject={setSelectedProject}
                      />
                    );
                  })
                : null}
            </div>
            {selectedProject ? (
              <div className="col-span-5 h-full">
                <FindProjectItemDetails project={selectedProject} />
              </div>
            ) : null}
          </div>
        </Spin>

        <div className="flex justify-center my-4">
          {data ? (
            <Pagination
              total={data.count}
              showSizeChanger
              current={query.page}
              onChange={(page, pageSize) =>
                setQuery({ ...query, page, limit: pageSize })
              }
            />
          ) : null}
        </div>
      </section>
    </div>
  );
}
