import { bg_style } from '@/globals/tailwindvariables';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

const NoTakeOff = () => {
  const router = useRouter();
  return (
    <div
      className={`${bg_style} p-5 h-[75vh] flex items-center justify-center`}
    >
      {/* <div className="flex justify-between items-center mb-3">
        <TertiaryHeading title="No Records Measurements" />
        <Button
          text="Start Measurements"
          className="!w-auto"
          icon="plus.svg"
          iconwidth={20}
          iconheight={20}
          onClick={() => router.push('/takeoff/upload')}
        />
      </div>
      <Table handleEditClick={handleEditClick} /> */}
      {/* <Pagination /> */}
      <div className="h-[70%] w-[40%] flex justify-center flex-col items-center">
        <div className="h-[50%] flex items-end">
          <div className="p-8 bg-gray-100 rounded-full mb-5">
            <Image width={85} height={80} src={'/noRecordNew.png'} alt="" />
          </div>
        </div>
        <div className="h-[50%] flex flex-col items-center gap-1 pt-12">
          <div className="font-semibold font-inter text-[20px] leading-[34px] tracking-wide text-[#181818]">
            No Takeoff Record
          </div>
          <div className="text-center font-inter font-light text-[14px] text-[#667085]  break-words w-[90%] leading-[22px] tracking-wider">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis,
            eveniet. Iste earum necessitatibus quibusdam minima alias sapiente,
            modi nostrum temporibus.
          </div>
          <button
            onClick={() => router.push('/take-off/upload')}
            className="cursor-pointer mt-5 w-[60%] bg-lavenderPurpleReplica rounded-md text-white p-2 tracking-wide font-inter text-[14px]"
          >
            Create your takeoff
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoTakeOff;
