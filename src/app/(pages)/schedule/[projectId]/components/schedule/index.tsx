import CustomButton from '@/app/component/customButton/button';
import Description from '@/app/component/description';
import SecondaryHeading from '@/app/component/headings/Secondary';
import TertiaryHeading from '@/app/component/headings/tertiary';
import { useState } from 'react';
import { CategoryModal } from './Category';
import {
  IWBSType,
  ActivityItem,
} from '@/app/interfaces/schedule/createSchedule.interface';
import { Collapse, Dropdown } from 'antd';
import { ScheduleTable } from './Table';
import Image from 'next/image';

type Props = {
  updateWbsScopeItems: (_id: string, _scopeItems: ActivityItem[]) => void;
  addWbsHandler: any;
  state: IWBSType[];
  updateWbs: any;
  deleteWbs(_id: string): void;
};

export function Schedule({
  addWbsHandler,
  state,
  updateWbsScopeItems,
  updateWbs,
  deleteWbs,
}: Props) {
  const [categoryModal, setCategoryModal] = useState(false);
  const [projectCategoryEditDetail, setProjectCategoryEditDetail] =
    useState<any>(null);

  return (
    <section>
      <div className=" flex items-center justify-between mt-4">
        <TertiaryHeading title="Schedule" className="text-lg tracking-wide" />
        <CustomButton
          text="Add New WBS"
          icon="/plus-yellow.svg"
          iconheight={20}
          iconwidth={20}
          className="!w-44 !bg-white !text-[#EF9F28] !border-[#EF9F28]"
          onClick={() => {
            setCategoryModal(true), setProjectCategoryEditDetail(null);
          }}
        />
      </div>
      <div className="rounded-xl">
        {state.length > 0 ? (
          <div>
            <Collapse
              ghost
              className="group"
              items={state.map((item: any, i) => {
                return {
                  key: i,
                  label: (
                    <div
                      className="flex items-center gap-5 max-md:flex-wrap space-x-2"
                      key={i}
                    >
                      <Image
                        src={'/arrow-down.svg'}
                        alt="arrow-down"
                        width={20}
                        height={20}
                        className="my-auto w-6 aspect-square stroke-[1px] stroke-gray-300"
                      />
                      <div className="flex  items-center gap-5 px-4 py-1 rounded-2xl">
                        <h3 className="grow my-auto text-lg font-semibold leading-9 whitespace-nowrap text-slate-700">
                          {item.category}
                        </h3>
                        <section className="flex-auto self-start  text-lg leading-9 text-slate-700">
                          {item.subCategory}
                        </section>
                        <div className="flex gap-2 justify-between opacity-20 group-hover:opacity-100 transition-all group-hover:translate-x-4">
                          <div className="flex justify-center items-center px-2  bg-gray-200 rounded-lg aspect-square">
                            <Image
                              loading="lazy"
                              src="/edit-icon.svg"
                              width={20}
                              height={20}
                              className="w-full aspect-square cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setProjectCategoryEditDetail(item);
                                setCategoryModal(true);
                              }}
                              alt="Edit"
                            />
                          </div>
                          <div className="flex justify-center items-center px-2  bg-gray-200 rounded-lg aspect-square">
                            <Dropdown
                              className="!bg-grey"
                              menu={{
                                items: [
                                  {
                                    key: 'delete',
                                    label: <p>Delete</p>,
                                    onClick(e) {
                                      e.domEvent.stopPropagation();
                                      deleteWbs(item._id);
                                    },
                                  },
                                ],
                              }}
                              placement="bottomCenter"
                              trigger={['click']}
                            >
                              <Image
                                loading="lazy"
                                src={'/menuIcon.svg'}
                                width={20}
                                height={20}
                                className="w-full aspect-square cursor-pointer"
                                alt="Menu"
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              />
                            </Dropdown>
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                  showArrow: false,
                  children: (
                    <ScheduleTable
                      updateWbsScopeItems={updateWbsScopeItems}
                      wbs={item}
                    />
                  ),
                };
              })}
            />
          </div>
        ) : (
          <div className="mx-4 rounded-xl h-[calc(100vh-450px)] grid items-center">
            <div className="grid place-items-center">
              <div className="max-w-[500px] flex flex-col items-center p-4">
                <SecondaryHeading
                  title="Create your project Schedule"
                  className="text-obsidianBlack2 mt-8"
                />
                <Description
                  title="Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content."
                  className="text-steelGray text-center font-normal"
                />
                <CustomButton
                  className="mt-7"
                  text={'Create WBS'}
                  onClick={() => setCategoryModal(true)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* this category modal responsible to create new div */}
      <CategoryModal
        categoryModal={categoryModal}
        setCategoryModal={setCategoryModal}
        addWbsHandler={addWbsHandler}
        updateWBsHandler={updateWbs}
      />

      {/* this category modal responsible to update existing div */}
      <CategoryModal
        categoryModal={categoryModal}
        setCategoryModal={setCategoryModal}
        updateWBsHandler={updateWbs}
        projectCategoryEditDetail={projectCategoryEditDetail}
        addWbsHandler={addWbsHandler}
      />
    </section>
  );
}
