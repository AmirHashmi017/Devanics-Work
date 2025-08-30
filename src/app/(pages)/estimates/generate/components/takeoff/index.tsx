import {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useCallback,
} from 'react';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'next/navigation';

import CustomButton from '@/app/component/customButton/button';
import CustomWhiteButton from '@/app/component/customButton/white';
import QuaternaryHeading from '@/app/component/headings/quaternary';
import TertiaryHeading from '@/app/component/headings/tertiary';
import MinDesc from '@/app/component/description/minDesc';
import { generateEstimateDetailAction } from '@/redux/estimate/estimateRequest.slice';
import { bg_style, senaryHeading } from '@/globals/tailwindvariables';
import { estimateRequestService } from '@/app/services/estimates.service';
import { byteConverter } from '@/app/utils/byteConverter';
import { useRouterHook } from '@/app/hooks/useRouterHook';

interface Props {
  setPrevNext: Dispatch<SetStateAction<number>>;
  pevNext: number;
}

const TakeOff = ({ setPrevNext, pevNext }: Props) => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const estimateId: null | string = searchParams.get('estimateId');
  const router = useRouterHook();

  const [showEstimateDetails, setShowEstimateDetails] = useState(true);
  const [showTakeoffDocs, setShowTakeoffDocs] = useState(true);
  const [estimateRequestDetail, setEstimateRequestDetail] = useState<any>({});

  const fetchEstimateDetail = useCallback(async () => {
    const result =
      await estimateRequestService.httpGetEstimateDetail(estimateId);
    setEstimateRequestDetail(result.data.estimateDetail);
  }, []);

  useEffect(() => {
    fetchEstimateDetail();
  }, []);

  const nextStepHandler = () => {
    setPrevNext((prev) => prev + 1);
    dispatch(
      generateEstimateDetailAction({
        estimateRequestIdDetail: estimateRequestDetail,
      })
    );
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <TertiaryHeading
          title="Take Off Measurements"
          className="text-graphiteGray font-semibold"
        />
        <div className="flex gap-3 items-center">
          {pevNext !== 0 ? (
            <CustomWhiteButton text="Previous" className="md:w-32" />
          ) : (
            <CustomWhiteButton
              text="Cancel"
              className="md:w-32"
              onClick={() => router.push('/estimates/requests')}
            />
          )}

          <CustomButton
            text="Next"
            className="md:w-32"
            onClick={nextStepHandler}
          />
        </div>
      </div>

      <div className={`${bg_style} p-5 mt-4`}>
        <div className="flex justify-between items-center ">
          <QuaternaryHeading
            title="Estimate Details"
            className="text-graphiteGray font-bold"
          />
          <div
            className="bg-silverGray rounded-s border border-solid border-Gainsboro cursor-pointer p-1"
            onClick={() => setShowEstimateDetails((prev) => !prev)}
          >
            <Image src="/chevron-down.svg" alt="icon" width={16} height={16} />
          </div>
        </div>
        <div
          className={`mt-4 md:grid-cols-4 md:grid-rows-2 gap-y-6 ${
            showEstimateDetails ? 'grid' : 'hidden'
          }`}
        >
          <div>
            <MinDesc
              title="Client Name"
              className="font-popin text-base text-lightyGray font-normal"
            />
            <MinDesc
              title={estimateRequestDetail?.clientName}
              className="font-popin text-base text-midnightBlue mt-2 break-words"
            />
          </div>

          <div>
            <MinDesc
              title="Company Name"
              className="font-popin font-normal text-base text-lightyGray"
            />
            <MinDesc
              title={estimateRequestDetail?.companyName}
              className="font-popin text-base text-midnightBlue mt-2 break-words"
            />
          </div>

          <div>
            <MinDesc
              title="Phone Number"
              className="font-popin text-base font-normal text-lightyGray"
            />
            <MinDesc
              title={estimateRequestDetail?.phone}
              className="font-popin text-base text-midnightBlue my-2"
            />
            {/* <div className="flex items-center gap-1">
              <MinDesc
                title="(938) 861-8764"
                className="font-popin text-base text-midnightBlue "
              />
              <MinDesc
                title="(Alternate)"
                className="font-popin text-base text-lightyGray"
              />
            </div> */}
          </div>
          {/* 4 */}
          <div>
            <MinDesc
              title="Email"
              className="font-popin text-base font-normal text-lightyGray"
            />
            <MinDesc
              title={estimateRequestDetail?.email}
              className="font-popin text-base text-midnightBlue my-2 text-wrap break-words"
            />
          </div>
          {/* 5 */}
          <div>
            <MinDesc
              title="Project name"
              className="font-popin font-normal text-base text-lightyGray"
            />
            <MinDesc
              title={estimateRequestDetail?.projectName}
              className="font-popin text-base text-midnightBlue mt-2 break-words"
            />
          </div>
          {/* 6 */}
          <div>
            <MinDesc
              title="Sale person"
              className="font-popin font-normal text-base text-lightyGray"
            />
            <MinDesc
              title={
                estimateRequestDetail?.salePerson
                  ? `${estimateRequestDetail?.salePerson?.firstName} ${estimateRequestDetail?.salePerson?.lastName}`
                  : 'N/A'
              }
              className="font-popin text-base text-midnightBlue mt-2 break-words"
            />
          </div>
          {/* 7 */}
          <div>
            <MinDesc
              title="Estimator"
              className="font-popin  font-normal text-base text-lightyGray"
            />
            <MinDesc
              title={
                estimateRequestDetail?.estimator
                  ? `${estimateRequestDetail?.estimator?.firstName} ${estimateRequestDetail?.estimator?.lastName}`
                  : 'N/A'
              }
              className="font-popin text-base text-midnightBlue mt-2 break-words"
            />
          </div>
          {/* 8 */}
          <div>
            <MinDesc
              title="Project Information"
              className="font-popin font-normal text-base text-lightyGray"
            />
            <MinDesc
              title={estimateRequestDetail?.projectInformation}
              className="font-popin text-base text-midnightBlue mt-2 break-words"
            />
          </div>
        </div>
      </div>
      <div className={`${bg_style} p-5 mt-6`}>
        <div className="flex justify-between">
          <QuaternaryHeading
            title="Take off"
            className="text-graphiteGray font-bold"
          />
          <div
            className="bg-silverGray rounded-s border border-solid border-Gainsboro cursor-pointer p-1"
            onClick={() => setShowTakeoffDocs((prev) => !prev)}
          >
            <Image
              src={'/chevron-down.svg'}
              alt="icon"
              width={16}
              height={16}
            />
          </div>
        </div>
        <div className={` gap-3 mt-4 ${showTakeoffDocs ? 'flex' : 'hidden'}`}>
          <div>
            <p
              className={`${senaryHeading} !text-[14px] text-midnightBlue font-popin mb-2`}
            >
              Drawings
            </p>

            {estimateRequestDetail?.drawingsDocuments?.map(
              (doc: { name: string; size: number; url: string }) => (
                <div
                  key={doc.size}
                  className={`p-4  max-w-32 border-2 border-silverGray pb-4 rounded-lg `}
                >
                  <Image
                    src={'/documentIcon.svg'}
                    alt="documentIcon icon"
                    width={20}
                    height={20}
                  />

                  <p className="text-[#353535] text-[16px] font-[500] mt-2 truncate">
                    {doc?.name}
                  </p>
                  <p className="text-[#989692] text-[12px] font-[400] my-2">
                    {byteConverter(doc?.size, 'KB').size} KB
                  </p>
                  <a
                    href={doc.url}
                    className="text-goldenrodYellow text-[12px] font-[400] my-2"
                    target="_blank"
                  >
                    Click to View
                  </a>
                </div>
              )
            )}
          </div>
          <div>
            <p
              className={`${senaryHeading} !text-[14px] text-midnightBlue font-popin mb-2`}
            >
              {estimateRequestDetail?.takeOffReports?.length
                ? 'Takeoff Reports'
                : null}
            </p>
            {estimateRequestDetail?.takeOffReports?.map(
              (doc: { name: string; size: number; url: string }) => (
                <div
                  key={doc.size}
                  className={`p-4  max-w-32 border-2 border-silverGray pb-4 rounded-lg `}
                >
                  <Image
                    src={'/documentIcon.svg'}
                    alt="documentIcon icon"
                    width={20}
                    height={20}
                  />

                  <p className="text-[#353535] text-[16px] font-[500] mt-2 truncate">
                    {doc?.name}
                  </p>
                  <p className="text-[#989692] text-[12px] font-[400] my-2">
                    {byteConverter(doc?.size, 'KB').size} KB
                  </p>
                  <a
                    href={doc.url}
                    className="text-goldenrodYellow text-[12px] font-[400] my-2"
                    target="_blank"
                  >
                    Click to View
                  </a>
                </div>
              )
            )}
          </div>
          <div>
            <p
              className={`${senaryHeading} !text-[14px] text-midnightBlue font-popin mb-2`}
            >
              {estimateRequestDetail?.otherDocuments?.length
                ? 'Other Documents'
                : null}
            </p>
            {estimateRequestDetail?.otherDocuments?.map(
              (doc: { name: string; size: number; url: string }) => (
                <div
                  key={doc.size}
                  className={`p-4  max-w-32 border-2 border-silverGray pb-4 rounded-lg `}
                >
                  <Image
                    src={'/documentIcon.svg'}
                    alt="documentIcon icon"
                    width={20}
                    height={20}
                  />

                  <p className="text-[#353535] text-[16px] font-[500] mt-2 truncate">
                    {doc?.name}
                  </p>
                  <p className="text-[#989692] text-[12px] font-[400] my-2">
                    {byteConverter(doc?.size, 'KB').size} KB
                  </p>
                  <a
                    href={doc.url}
                    className="text-goldenrodYellow text-[12px] font-[400] my-2"
                    target="_blank"
                  >
                    Click to View
                  </a>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TakeOff;
