import React from 'react';
import { dataInterface } from '../captureComponent';
import Image from 'next/image';
// import Image from 'next/image';

interface Props {
  entity: dataInterface[];
}

const ReportCard: React.FC<Props> = ({ entity }) => {
  console.log(entity, ' ===> Entity Inside Sindle record card');
  return (
    <div>
      <div className="pb-4 font-semibold ">
        {(entity[0].details.projectName || 'Length Measurement') +
          `(${entity.length})`}
      </div>
      {entity.map((item, index) => (
        <>
          <div className=" flex items-center justify-between py-4 ">
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
                  {/* {item?.details?.date ? item?.details?.date?.toDateString() : ''} */}
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
          </div>
          {index !== entity.length - 1 && (
            <hr className="h-[0.3px] w-full bg-gray-400 "></hr>
          )}
        </>
      ))}
    </div>
  );
};

export default ReportCard;
