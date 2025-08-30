import { takeoffSummaryService } from '@/app/services/takeoffSummary.service';
import { bg_style } from '@/globals/tailwindvariables';
import { Button } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
interface IProps {
  setstep: any;
}
const InitialUpload = ({ setstep }: IProps) => {
  console.log(setstep);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const router = useRouter();
  const makeApiCall = async () => {
    try {
      setisLoading(true);
      // let asUs:any = [];
      // const data = await takeoffSummaryService.httpCreateTakeOffNew({ projectData, selectecClient, fullData, assignedUsers: asUs })
      const data = await takeoffSummaryService.httpCreateTakeOffNew({});
      console.log(data, ' ===> Data after creation');
      //@ts-ignore
      if (data?.createdTakeOff?._id && data?.createdTakeOff?._id?.length > 0) {
        //@ts-ignore
        router.push(`/take-off/upload?edit_id=${data?.createdTakeOff?._id}`);
      } else {
        router.push('/take-off');
      }
    } catch (error) {
      console.log(error, ' ===> Error while making api call');
      setisLoading(false);
    }
  };
  const [showAi, setshowAi] = useState<boolean>(false);
  return (
    <div className={`${bg_style} p-5 h-[75vh] flex justify-center mt-10`}>
      {showAi ? (
        <div className="flex flex-col gap-y-3 items-center justify-center !w-full h-full">
          {/* <div className="text-center font-inter font-light text-[14px] text-[#667085]  break-words w-[40%] leading-[22px] tracking-wider">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis,
          eveniet. Iste earum necessitatibus quibusdam minima alias
          sapiente, modi nostrum temporibus.
        </div> */}
          <Button
            className="!text-white bg-lavenderPurpleReplica font-bold hover:!text-white hover:!bg-lavenderPurpleReplica"
            size="large"
          >
            Coming Soon
          </Button>
          <Button
            className="font-bold"
            size="middle"
            onClick={() => {
              setshowAi(false);
            }}
          >
            Back
          </Button>
        </div>
      ) : (
        <div className="flex justify-between w-[90%] ">
          <div className="h-[80%] w-[45%]  flex justify-center flex-col items-center rounded-3xl my-10">
            <div className="h-[50%] flex items-end">
              <div className="p-8 bg-gray-100 rounded-full mb-5">
                <Image width={85} height={80} src={'/noRecordNew.png'} alt="" />
              </div>
            </div>
            <div className="h-[50%] flex flex-col items-center gap-1 pt-12">
              <div className="font-semibold font-inter text-[20px] leading-[34px] tracking-wide text-[#181818]">
                Upload
              </div>
              <div className="text-center font-inter font-light text-[14px] text-[#667085]  break-words w-[90%] leading-[22px] tracking-wider">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Corporis, eveniet. Iste earum necessitatibus quibusdam minima
                alias sapiente, modi nostrum temporibus.
              </div>
              <button
                disabled={isLoading}
                onClick={() => {
                  makeApiCall();
                }}
                className="cursor-pointer mt-5 w-[60%] bg-lavenderPurpleReplica rounded-md text-white p-2 tracking-wide font-inter text-[14px]"
              >
                Create your takeoff
              </button>
            </div>
          </div>
          <div className="h-[80%] relative w-[45%] flex justify-center flex-col items-center rounded-3xl my-10 bg-gradient-to-r from-lavenderPurpleReplica/5 to-[#6A56F6]/5">
            <span className="absolute right-5 top-3 border-[2px] border-yellow-200 rounded-[30px] text-yellow-400 py-1 px-3 font-semibold cursor-pointer bg-yellow-400 bg-opacity-10">
              Coming soon
            </span>
            <div className="h-[50%] flex items-end">
              <div className="p-8 rounded-full mb-5 bg-gradient-to-r from-lavenderPurpleReplica/10 to-[#6A56F6]/10">
                <Image width={85} height={80} src={'/ainew.png'} alt="" />
              </div>
            </div>
            <div className="h-[50%] flex flex-col items-center gap-1 pt-12">
              <div className="font-semibold font-inter text-[20px] leading-[34px] tracking-wide text-[#181818]">
                Takeoff by AI
              </div>
              <div className="text-center font-inter font-light text-[14px] text-[#667085]  break-words w-[90%] leading-[22px] tracking-wider">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Corporis, eveniet. Iste earum necessitatibus quibusdam minima
                alias sapiente, modi nostrum temporibus.
              </div>
              <button
                onClick={() => {
                  setshowAi(true);
                }}
                className="cursor-pointer mt-5 w-[60%] bg-transparent rounded-md p-2 tracking-wide font-inter text-[14px] border border-lavenderPurpleReplica text-lavenderPurpleReplica hover:text-white hover:!border-none hover:bg-gradient-to-r from-lavenderPurpleReplica to-[#6A56F6]"
              >
                Create AI takeoff
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InitialUpload;
