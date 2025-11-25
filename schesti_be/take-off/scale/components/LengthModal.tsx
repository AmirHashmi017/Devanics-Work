'use client';
import Image from 'next/image';
import { Input } from 'antd';
import { Measurements } from '../../types';

interface Props {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  measurements: Measurements;
}

const Length: React.FC<Props> = ({ setModalOpen, measurements }) => {
  return (
    <div className="py-2.5 w-[204px] bg-[#F2F2F2] border border-solid border-elboneyGray rounded-lg">
      <section className="w-full">
        <div className="flex justify-between items-center px-3">
          <div>
            <label>Length</label>
          </div>
          <Image
            src={'/crossblack.svg'}
            alt="close icon"
            width={24}
            height={24}
            className="cursor-pointer"
            onClick={() => setModalOpen(false)}
          />
        </div>
        <div className="border-b-[2px] mt-1.5"></div>
        <div className="mt-4 flex flex-col gap-4 px-3">
          <div className="flex flex-row items-center justify-between ">
            <label>Angle</label>
            <div className="w-[92px]">
              <Input
                value={`${measurements.angle} °`}
                className="!rounded-md pointer-events-none"
              />
            </div>
          </div>
          <div className="flex flex-row items-center justify-between ">
            <label>Segment</label>
            <div className="w-[92px]">
              <Input
                value={`${measurements?.parameter} ft`}
                className="!rounded-md pointer-events-none"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Length;
