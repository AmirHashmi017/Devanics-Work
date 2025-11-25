'use client';
import QuaternaryHeading from '@/app/component/headings/quaternary';
import { useEffect, useState } from 'react';
import TertiaryHeading from '@/app/component/headings/tertiary';
// import FormControl from '@/app/component/formControl';
// import { Formik, Form } from 'formik';
// import { PhoneNumberInputWithLable } from '@/app/component/phoneNumberInput/PhoneNumberInputWithLable';
import CustomButton from '@/app/component/customButton/button';
// import { IClient } from '@/app/interfaces/companyInterfaces/companyClient.interface';
// import { PhoneNumberRegex } from '@/app/utils/regex.util';
// import { userService } from '@/app/services/user.service';
// import { toast } from 'react-toastify';
import { Progress } from 'antd';

interface Props {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  files?: any;
  pages?: any;
  isLoading?: boolean;
  processFiles?: any;
  fullData?: any;
  setisLoading?: any;
  makeApiCall?: any;
  isApiCalling?: any;
}

const CreateProgressModal = ({
  setModalOpen,
  isLoading,
  processFiles,
  fullData,
  setisLoading,
  makeApiCall,
}: Props) => {
  // const [fLoading, setfLoading] = useState<boolean>(false)
  const [isCancelAble, setisCancelAble] = useState<boolean>(true);
  const [shouldContinue, setshouldContinue] = useState<boolean>(false);
  // const getLoading = () => {
  //   let trueArr = [];
  //   for (let i = 0; i < fullData?.files?.length; i++) {
  //     const totalPages = fullData?.files[i]?.totalPages;
  //     const filteredArr = fullData?.pages?.filter((it: any) => { return it?.fileId == fullData?.files[i]?.fileId })
  //     console.log(filteredArr?.length, totalPages, fullData, " true array ilteredArr?.length == totalPages Full Data")
  //     if (filteredArr?.length == totalPages) {
  //       trueArr.push(true)
  //     } else {
  //       trueArr.push(false)
  //     }
  //   }
  //   console.log(trueArr, " true array Full Data")
  //   if (trueArr?.length > 0 && trueArr?.every((i: any) => { return i == true })) {
  //     console.log(fullData, " ===> here is fullData Object fully loaded")
  //     // setisLoading(false)
  //     // setshouldContinue(true)
  //     if(!isApiCalling){
  //       setTimeout(()=>{},500)
  //     }
  //     return false;
  //   } else {
  //     return true
  //   }
  // }
  // console.log(getLoading(), " ===> Get loading true array Full Data");
  useEffect(() => {
    // setfLoading(getLoading)
    // getLoading()
    if (Array.isArray(fullData?.pages) && fullData?.pages?.length > 0) {
      if (
        fullData?.files?.every((i: any) => {
          return (
            i?.totalPages ==
            fullData?.pages?.filter((pg: any) => i?.fileId == pg?.fileId)
              ?.length
          );
        })
      ) {
        setisLoading(false);
        setshouldContinue(true);
      }
    }
  }, [fullData]);

  // useEffect(()=>{
  //   if(shouldContinue == true){
  //     makeApiCall()
  //   }
  // },[shouldContinue])

  return (
    <div className="py-2.5 px-6 bg-white border border-solid border-elboneyGray rounded-[4px] z-50">
      <section className="w-full">
        <div className="flex justify-between items-center border-b-Gainsboro ">
          <div>
            <QuaternaryHeading
              title="Create Progress"
              className="text-graphiteGray font-bold"
            />
            {/* <QuinaryHeading
              title="Select any existing client from here."
              className="text-coolGray"
            /> */}
          </div>
          {/* <Image
            src={'/crossblack.svg'}
            alt="close icon"
            width={24}
            height={24}
            className="cursor-pointer"
            onClick={() => setModalOpen(false)}
          /> */}
        </div>
        <div className="p-5 flex flex-col rounded-lg border border-silverGray shadow-secondaryShadow2 bg-white">
          <TertiaryHeading
            className="text-graphiteGray mb-4 "
            title="Processing Files"
          />
          <p>
            {
              "This is one time process and might take few minutes. Kindly don't close or reload tabs to continue."
            }
          </p>
          <div className="flex flex-col gap-y-10 w-full p-5">
            {fullData?.files &&
              Array.isArray(fullData?.files) &&
              fullData?.files?.length > 0 &&
              fullData?.files?.map((item: any, index: number) => {
                const successProgress = fullData?.pages?.filter((i: any) => {
                  return i?.fileId == item?.fileId && i?.success == true;
                });
                const failedProgress = fullData?.pages?.filter((i: any) => {
                  return i?.fileId == item?.fileId && i?.success == false;
                });
                const totalProgress = fullData?.pages?.filter((i: any) => {
                  return i?.fileId == item?.fileId;
                });

                return (
                  <div key={index} className="flex gap-2 flex-col">
                    <div className="flex gap-2">
                      <p className="whitespace-nowrap">
                        {item?.name?.slice(0, 12) ?? ''}
                      </p>
                      <Progress
                        percent={
                          totalProgress && Array.isArray(totalProgress)
                            ? Math.ceil(
                                (totalProgress?.length / item?.totalPages) * 100
                              )
                            : 0
                        }
                      />
                    </div>
                    <div className="flex gap-3">
                      <Progress
                        size={'small'}
                        type="circle"
                        percent={
                          successProgress && Array.isArray(successProgress)
                            ? Math.ceil(
                                (successProgress?.length / item?.totalPages) *
                                  100
                              )
                            : 0
                        }
                      />
                      <Progress
                        size={'small'}
                        type="circle"
                        percent={
                          failedProgress && Array.isArray(failedProgress)
                            ? Math.ceil(
                                (failedProgress?.length / item?.totalPages) *
                                  100
                              )
                            : 0
                        }
                        status="exception"
                      />
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="self-end flex justify-end items-center gap-5 md:mt-4 my-3">
            {isCancelAble && (
              <div>
                <CustomButton
                  className=" !border-celestialGray !shadow-scenarySubdued2 !text-graphiteGray !bg-snowWhite"
                  text="Cancel"
                  onClick={() => {
                    setModalOpen(false);
                  }} //router.back()
                  isLoading={isLoading}
                />
              </div>
            )}
            <div>
              <CustomButton
                isLoading={isLoading} //isLoading
                text={shouldContinue ? 'Continue' : 'Start Process'}
                onClick={() => {
                  if (shouldContinue == true) {
                    makeApiCall();
                  } else {
                    if (processFiles) {
                      processFiles();
                      setisCancelAble(false);
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </section>
      {/* <div className="flex justify-end gap-4 mt-5 mb-2">
        <div>
          <Button
            text="Cancel"
            className="!bg-snowWhite !text-abyssalBlack !py-1.5 "
            onClick={() => setModalOpen(false)}
          />
        </div>
        <div>
          <Button
            text="Calibrate"
            onClick={handleCalibrate}
            className="!py-1.5"
          />
        </div>
      </div> */}
    </div>
  );
};

export default CreateProgressModal;
