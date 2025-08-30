import React, { useEffect, useState } from 'react';
import { dataInterface } from '../captureComponent';
import Image from 'next/image';
import { DownOutlined, FolderOutlined } from '@ant-design/icons';
import moment from 'moment';
// import Image from 'next/image';

interface Props {
  entity: any[];
}
interface MType {
  subcategory: string;
  things: dataInterface[];
}

const ReportCard: React.FC<Props> = ({ entity }) => {
  console.log(entity, ' ===> Entity Inside Sindle record card');
  const getSubCategrized = (ent: dataInterface[]): MType[] => {
    let retArr: MType[] = [];
    for (let i = 0; i < ent?.length; i++) {
      const cur = ent[i];
      const exist = retArr.find(
        (j) => j.subcategory == cur.details.subcategory
      );
      if (exist) {
        exist.things.push(cur);
      } else {
        retArr.push({ subcategory: cur.details.subcategory, things: [cur] });
      }
    }
    return retArr;
  };
  const [data, setdata] = useState<MType[]>([]);
  useEffect(() => {
    setdata(getSubCategrized(entity));
  }, [entity]);
  useEffect(() => {
    console.log(data, data.length, ' ===> Data after subcategorized');
  }, [data]);
  return (
    <div>
      <div className="font-semibold bg-gray-100 rounded-t-2xl border flex items-center gap-2">
        <DownOutlined className="h-full p-3 border-r" />
        <FolderOutlined />{' '}
        {(entity[0].details.category || 'Length Measurement') +
          `(${entity.length})`}
      </div>
      <>
        {data?.map((ite, ind) => {
          return (
            <>
              {ite.subcategory && (
                <div
                  key={ind}
                  className="bg-gray-100 border font-semibold flex items-center gap-2"
                >
                  <DownOutlined className="h-full p-3 px-8 border-r" />
                  <FolderOutlined /> {ite.subcategory}
                </div>
              )}
              <div className="grid grid-cols-2">
                {ite.things?.map((thing, index) => {
                  return (
                    <div
                      key={ind}
                      className=" flex gap-x-5 items-center justify-between p-4 border"
                    >
                      {/* <div className="border-2  w-fit h-fit cover max-w-[50%]"> */}
                      <Image
                        src={thing.image}
                        width={100}
                        height={100}
                        alt={`Captured content ${index}`}
                        style={{ width: '50%', height: '100%' }}
                        className="image-cover border-2 max-w-[50%]"
                      />
                      {/* </div> */}
                      <div className="grow grid grid-cols-4 gap-5 text-xs text-gray-500">
                        {/* <span className="font-medium block text-black">
                        {thing.details.projectName || 'Length Measurement'}
                      </span> */}
                        <span>
                          Subject
                          <span className="font-sm block text-black">
                            {thing.details.projectName}
                          </span>
                        </span>
                        <span>
                          Page Label
                          <span className="font-sm block text-black">
                            {thing.details.pageLabel}
                          </span>
                        </span>
                        <span>
                          Author
                          <span className="font-sm block text-black">
                            {' '}
                            {thing.details.user?.name ||
                              thing.details.user?.email ||
                              '---'}
                          </span>
                        </span>
                        <span>
                          Date
                          <span className="font-sm block text-black">
                            {moment(thing.details.dateTime).format(
                              'D MMMM YYYY h:mm a'
                            )}
                          </span>
                        </span>
                        {/* <span>Status</span> */}
                        <span className="flex">
                          Color{' '}
                          {thing?.details?.color && (
                            <div
                              className="w-4 h-3 ml-2 rounded-2xl border-[1px] border-gray-500"
                              style={{
                                background: thing?.details?.color,
                              }}
                            ></div>
                          )}
                        </span>
                        {/* <span>
                          Layer{' '}
                          <span className="font-sm block text-black">
                            {' '}
                            {'---'}
                          </span>
                        </span>
                        <span>
                          Space{' '}
                          <span className="font-sm block text-black">
                            {' '}
                            {'---'}
                          </span>
                        </span> */}
                        <span>
                          Value
                          <span className="font-sm block text-black">
                            {' '}
                            {thing.details.text ?? '---'}
                          </span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          );
        })}
        {/* <div className="pb-4 font-semibold ">
            {item?.details?.subcategory}
          </div>
          {
            entity?.filter((i) => (i.details.subcategory == item.details.subcategory)).map((ite, ind) => {
              return <div key={ind} className=" flex items-center justify-between py-4 ">
                <div className="border-2  w-fit h-fit cover max-w-[50%]">
                  <Image
                    src={ite.image}
                    width={100}
                    height={100}
                    alt={`Captured content ${index}`}
                    style={{ width: '100%', height: '100%' }}
                    className="image-cover"
                  />
                </div>
                <div className="flex flex-col items-end text-xs text-gray-500">
                  <span className="font-medium text-black">
                    {ite.details.projectName || 'Length Measurement'}
                  </span>
                  <span>
                    Page Label
                    <span className="font-sm text-black">
                      {ite.details.pageLabel}
                    </span>
                  </span>
                  <span>
                    Author
                    <span className="font-sm text-black">
                      {' '}
                      {ite.details.author || '---'}
                    </span>
                  </span>
                  <span>
                    Date
                    <span className="font-sm text-black">
                      {' '}
                    </span>
                  </span>
                  <span>Status</span>
                  <span className="flex">
                    Color{' '}
                    {ite?.details?.color && (
                      <div
                        className="w-4 h-3 ml-2 rounded-2xl border-[1px] border-gray-500"
                        style={{
                          background: ite?.details?.color,
                        }}
                      ></div>
                    )}
                  </span>
                  <span>
                    Layer <span className="font-sm text-black"> {'---'}</span>
                  </span>
                  <span>
                    Space <span className="font-sm text-black"> {'---'}</span>
                  </span>
                  <span>
                    Value
                    <span className="font-sm text-black">
                      {' '}
                      {ite.details.comment ?? '---'}
                    </span>
                  </span>
                </div>
              </div>
            })
          } */}
        {/* <div className=" flex items-center justify-between py-4 ">
            <div className="border-2  w-fit h-fit cover max-w-[50%]">
              <Image
                src={item.image}
                width={100}
                height={100}
                alt={`Captured content ${index}`}
                style={{ width: '100%', height: '100%' }}
                className="image-cover"
              />
            </div>
            <div className="flex flex-col items-end text-xs text-gray-500">
              <span className="font-medium text-black">
                {item.details.projectName || 'Length Measurement'}
              </span>
              <span>
                Page Label
                <span className="font-sm text-black">
                  {item.details.pageLabel}
                </span>
              </span>
              <span>
                Author
                <span className="font-sm text-black">
                  {' '}
                  {item.details.author || '---'}
                </span>
              </span>
              <span>
                Date
                <span className="font-sm text-black">
                  {' '}
                </span>
              </span>
              <span>Status</span>
              <span className="flex">
                Color{' '}
                {item?.details?.color && (
                  <div
                    className="w-4 h-3 ml-2 rounded-2xl border-[1px] border-gray-500"
                    style={{
                      background: item?.details?.color,
                    }}
                  ></div>
                )}
              </span>
              <span>
                Layer <span className="font-sm text-black"> {'---'}</span>
              </span>
              <span>
                Space <span className="font-sm text-black"> {'---'}</span>
              </span>
              <span>
                Value
                <span className="font-sm text-black">
                  {' '}
                  {item.details.comment ?? '---'}
                </span>
              </span>
            </div>
          </div> */}
        {/* {index !== entity.length - 1 && (
            <hr className="h-[0.3px] w-full bg-gray-400 "></hr>
          )} */}
      </>
    </div>
  );
};

export default ReportCard;
