'use client';
import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { PercentageOutlined } from '@ant-design/icons';

import EstimatesTable from '../estimatesTable';
import CustomButton from '@/app/component/customButton/button';
import TertiaryHeading from '@/app/component/headings/tertiary';
import { bg_style } from '@/globals/tailwindvariables';
import Description from '@/app/component/description/index';
import MinDesc from '@/app/component/description/minDesc';
import QuaternaryHeading from '@/app/component/headings/quaternary';
import QuinaryHeading from '@/app/component/headings/quinary';
import { selectGeneratedEstimateDetail } from '@/redux/estimate/estimateRequestSelector';
import { InputComponent } from '@/app/component/customInput/Input';
import { estimateRequestService } from '@/app/services/estimates.service';
import { generateEstimateDetailAction } from '@/redux/estimate/estimateRequest.slice';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { useCurrencyFormatter } from '@/app/hooks/useCurrencyFormatter';
// import { PDFDownloadLink } from '@react-pdf/renderer';
// import ClientPDF from '../clientPDF';
// import { headings } from './data';
interface Props {
  setPrevNext: Dispatch<SetStateAction<number>>;
}

interface basicInformation {
  clientName: string;
  companyName: string;
  phone: string;
  email: string;
  leadSource: string;
  projectName: string;
  projectValue: string;
  projectInformation: string;
  salePerson: {
    firstName: string;
    lastName: string;
  };
  estimator: {
    firstName: string;
    lastName: string;
  };
  drawingsDocuments: [];
  takeOffReports: [];
  otherDocuments: [];
}

const Summary = ({ setPrevNext }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouterHook();
  const dispatch = useDispatch();
  const estimateId: null | string = searchParams.get('estimateId');

  const { generateEstimateDetail } = useSelector(selectGeneratedEstimateDetail);

  const [estimateDetailsSummary, setEstimateDetailsSummary] = useState<{
    estimateRequestIdDetail: basicInformation;
    estimateScope: Object[];
  }>();
  const [isLoading, setIsLoading] = useState(false);
  const [subTotalcostRecord, setSubTotalCostRecord] = useState<number>(0);
  const [subcontractorCosts, setSubcontractorCosts] = useState<any>({});
  const [totalCostRecord, setTotalCostRecord] = useState<number>(0);
  const [estimatesRecords, setEstimatesRecords] = useState([]);
  const [totalMaterialBaseCost, setTotalMaterialBaseCost] = useState(0);

  const userCurrency = useCurrencyFormatter();

  const [materialPercentage, setMaterialPercentage] = useState<number>(5);
  const [overHeadProfitPercentage, setOverHeadProfitPercentage] = useState<
    number | string
  >(5);
  const [bondFeePercentage, setBondFeePercentage] = useState<number | string>(
    5
  );

  useEffect(() => {
    setEstimateDetailsSummary(generateEstimateDetail);

    if (generateEstimateDetail?.estimateScope?.length) {
      const updatedDataArray = generateEstimateDetail?.estimateScope.map(
        (titleObject: any) => {
          const totalCostForTitle = titleObject.scopeItems.reduce(
            (total: any, dataItem: any) => {
              return total + parseFloat(dataItem.totalCostRecord);
            },
            0
          );
          const totalMaterialCost = titleObject.scopeItems.reduce(
            (total: any, dataItem: any) => {
              let qtyWithWastage = dataItem.qty * (1 + dataItem.wastage / 100);
              let totalMaterialCost: any =
                dataItem.unitMaterialCost * qtyWithWastage;
              return total + parseFloat(totalMaterialCost);
            },
            0
          );
          return {
            ...titleObject,
            totalCostForTitle: totalCostForTitle.toFixed(2),
            totalMaterialCost: totalMaterialCost.toFixed(2),
          };
        }
      );

      const totalCostForAllRecords = updatedDataArray.reduce(
        (total: any, titleObject: any) => {
          return total + parseFloat(titleObject.totalCostForTitle);
        },
        0
      );
      const totalMaterialCostForAllRecord = updatedDataArray.reduce(
        (total: any, titleObject: any) => {
          return total + parseFloat(titleObject.totalMaterialCost);
        },
        0
      );

      setEstimatesRecords(updatedDataArray);
      setSubTotalCostRecord(totalCostForAllRecords);
      setTotalCostRecord(totalCostForAllRecords);
      setTotalMaterialBaseCost(totalMaterialCostForAllRecord);
    }
  }, [generateEstimateDetail]);

  const calculatePercentqge = (
    value: number | string,
    percentage: number | string
  ) => {
    value = Number(value);
    percentage = Number(percentage);
    return (percentage * value) / 100;
  };

  const generateBidHandler = async () => {
    setIsLoading(true);
    let obj = {
      totalBidDetail: {
        materialTax: calculatePercentqge(
          totalMaterialBaseCost,
          materialPercentage
        ),
        overheadAndProfit: calculatePercentqge(
          subTotalcostRecord +
            calculatePercentqge(totalMaterialBaseCost, materialPercentage),
          overHeadProfitPercentage
        ).toFixed(2),
        bondFee: calculatePercentqge(
          subTotalcostRecord +
            totalMaterialBaseCost +
            calculatePercentqge(subTotalcostRecord, overHeadProfitPercentage),
          bondFeePercentage
        ).toFixed(2),
      },
      totalCost: totalCostRecord,
      estimateRequestIdDetail: estimateId,
      estimateScope: generateEstimateDetail.estimateScope,
    };
    dispatch(generateEstimateDetailAction(obj));

    let result = await estimateRequestService.httpAddGeneratedEstimate(obj);

    if (result.statusCode == 201) {
      setIsLoading(false);
      router.push(`/estimates/generate/${result?.data?._id}`);
    } else {
      setIsLoading(false);
      toast.error('Something went wrong');
    }
  };

  const handleSubcontractorCostChange = (title: any, value: any) => {
    setSubcontractorCosts((prevCosts: any) => ({
      ...prevCosts,
      [title]: parseFloat(value) || 0,
    }));

    setEstimatesRecords((prevEstimates: any) =>
      prevEstimates.map((estimate: any) => {
        if (estimate.title === title) {
          const subcontractorCost = parseFloat(value) || 0;

          return {
            ...estimate,
            subContractorCost: subcontractorCost,
          };
        }
        return estimate;
      })
    );
  };

  let totalSum = 0;
  for (const key in subcontractorCosts) {
    if (Object.prototype.hasOwnProperty.call(subcontractorCosts, key)) {
      totalSum += subcontractorCosts[key];
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <TertiaryHeading title="" className="text-graphiteGray font-semibold" />
        <div className="flex gap-3 items-center lg:w-3/12">
          <CustomButton
            text="Previous"
            className="!text-graphiteGray !bg-snowWhite !shadow-scenarySubdued 
              border-2 border-solid !border-celestialGray"
            onClick={() => setPrevNext((prev) => prev - 1)}
          />

          <CustomButton
            text="Generate"
            className="!w-full"
            isLoading={isLoading}
            onClick={generateBidHandler}
          />
        </div>
      </div>
      {/* <PDFViewer className="h-full w-full">
        <ClientPDF
          data={estimateDetailsSummary}
          subcostRecord={subcostRecord}
          pdfData={pdfData}
          
        />
      </PDFViewer> */}
      <div>
        <div className={`${bg_style} p-5 mt-4`}>
          <div className="flex justify-between items-center">
            <QuaternaryHeading
              title="Client Information"
              className="font-bold"
            />
            {/* <div className="bg-silverGray rounded-s border border-solid border-Gainsboro cursor-pointer w-8 h-8 flex justify-center items-center">
            <Image
              src={'/chevron-down.svg'}
              alt="icon"
              width={16}
              height={16}
            />
          </div> */}
          </div>
          <div className="grid grid-cols-4 mt-4">
            <div>
              <QuinaryHeading title="Client Name" className="text-lightyGray" />
              <Description
                title={
                  estimateDetailsSummary?.estimateRequestIdDetail?.clientName!
                }
                className="text-midnightBlue font-popin break-words"
              />
            </div>
            {/* 1 */}
            <div>
              <QuinaryHeading
                title="Company Name"
                className="text-lightyGray"
              />
              <Description
                title={
                  estimateDetailsSummary?.estimateRequestIdDetail?.companyName!
                }
                className="text-midnightBlue font-popin break-words"
              />
            </div>
            {/* 2 */}
            <div>
              <QuinaryHeading
                title="Phone Number"
                className="text-lightyGray"
              />
              <Description
                title={estimateDetailsSummary?.estimateRequestIdDetail?.phone!}
                className="text-midnightBlue font-popin"
              />
            </div>
            {/* 3 */}
            <div>
              <QuinaryHeading title="Email" className="text-lightyGray" />
              <Description
                title={estimateDetailsSummary?.estimateRequestIdDetail?.email!}
                className="text-midnightBlue font-popin break-words"
              />
            </div>
          </div>
        </div>

        <div className={`${bg_style} p-5 mt-4`}>
          <div className="flex justify-between items-center">
            <QuaternaryHeading
              title={'Project Information'}
              className="font-bold"
            />
          </div>
          <div className="grid grid-cols-5 grid-rows-2 mt-2 gap-y-2">
            {/* 1 */}
            <div>
              <QuinaryHeading
                title="Project Name"
                className="text-lightyGray"
              />
              <Description
                title={
                  estimateDetailsSummary?.estimateRequestIdDetail?.projectName!
                }
                className="text-midnightBlue font-popin break-words"
              />
            </div>
            {/* 2 */}
            <div>
              <QuinaryHeading title="Lead Source" className="text-lightyGray" />
              <Description
                title={
                  estimateDetailsSummary?.estimateRequestIdDetail?.leadSource!
                }
                className="text-midnightBlue font-popin break-words"
              />
            </div>
            {/* 2 */}
            <div>
              <QuinaryHeading
                title="Project Value"
                className="text-lightyGray"
              />
              <Description
                title={
                  estimateDetailsSummary?.estimateRequestIdDetail?.projectValue!
                }
                className="text-midnightBlue font-popin break-words"
              />
            </div>
            {/* 3 */}
            <div>
              <QuinaryHeading title="Email" className="text-lightyGray" />
              <Description
                title={estimateDetailsSummary?.estimateRequestIdDetail?.email!}
                className="text-midnightBlue font-popin break-words"
              />
            </div>
            {/* 3 */}
            <div className="col-span-full row-span-2 text-start">
              <QuinaryHeading
                title="Project Description"
                className="text-lightyGray"
              />
              <Description
                title={
                  estimateDetailsSummary?.estimateRequestIdDetail
                    ?.projectInformation!
                }
                className="text-midnightBlue font-popin break-words"
              />
            </div>
          </div>
        </div>
        {/* center part */}
        <TertiaryHeading
          title="Estimates"
          className="text-graphiteGray font-semibold my-4"
        />
        <div>
          {estimatesRecords?.length
            ? estimatesRecords.map((estimate: any) => (
                <div key={estimate.title} className={`${bg_style} p-5 mt-3`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <QuaternaryHeading
                        title={estimate.categoryName}
                        className="font-semibold"
                      />
                      <QuaternaryHeading
                        title={estimate.subCategoryName}
                        className="!font=[#344054] font-light"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-[#344054] text-[18px]">
                        Sub-contractor Cost:
                      </p>
                      <div className="flex items-center border-b-2 focus:border-purple-500 rounded">
                        <p className="text-gray-700">
                          {userCurrency.currency.symbol}
                        </p>
                        <input
                          placeholder="000"
                          min="0"
                          className="appearance-none w-full py-2 text-gray-700 leading-tight focus:outline-none "
                          type="number"
                          value={subcontractorCosts[estimate.title] || ''}
                          onChange={(e) =>
                            handleSubcontractorCostChange(
                              estimate.title,
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <QuaternaryHeading
                        title={`Sub Total Cost: ${userCurrency.format(
                          estimate.totalCostForTitle
                        )}`}
                        className="font-semibold"
                      />
                    </div>
                  </div>
                  <div className="estimateTable_container">
                    <EstimatesTable estimates={estimate.scopeItems} />
                  </div>
                </div>
              ))
            : null}
        </div>

        <div className="bg-celestialGray h-px  w-full my-4"></div>
        <div className="flex justify-end">
          <div className="flex w-full justify-between flex-col gap-2 max-w-lg my-4">
            <div className="flex items-center justify-between">
              <MinDesc
                title="Total Sub-Contractor Amount"
                className="text-darkgrayish"
              />
              <Description
                title={`${userCurrency.format(totalSum)}`}
                className="font-medium"
              />
            </div>
            <div className="flex items-center justify-between">
              <MinDesc title="Sub Total Cost" className="text-darkgrayish" />
              <Description
                title={`${userCurrency.format(subTotalcostRecord)}`}
                className="font-medium"
              />
            </div>

            <div className="grid grid-cols-3 items-center">
              <MinDesc title="Material Tax %" className="text-darkgrayish" />
              <MinDesc
                title={`${userCurrency.format(
                  calculatePercentqge(totalMaterialBaseCost, materialPercentage)
                )}`}
                className="text-darkgrayish"
              />
              <InputComponent
                suffix={<PercentageOutlined />}
                // prefix={<p>$</p>}
                label=""
                type="number"
                name="materialTax"
                placeholder="Enter Material Tax"
                field={{
                  value: materialPercentage.toString(),
                  onChange: (e) =>
                    setMaterialPercentage(Number(e.target.value)),
                }}
              />
            </div>
            <div className="grid grid-cols-3 items-center">
              <MinDesc
                title="Overhead & Profit %"
                className="text-darkgrayish"
              />
              <MinDesc
                title={`${userCurrency.format(
                  calculatePercentqge(
                    subTotalcostRecord +
                      calculatePercentqge(
                        totalMaterialBaseCost,
                        materialPercentage
                      ),
                    overHeadProfitPercentage
                  )
                )}`}
                className="text-darkgrayish"
              />
              <InputComponent
                suffix={<PercentageOutlined />}
                // prefix={<p>$</p>}
                label=""
                type="number"
                name="overheadAndProfit"
                placeholder="Enter Overhead & Profit"
                field={{
                  value: overHeadProfitPercentage.toString(),
                  onChange: (e) => setOverHeadProfitPercentage(e.target.value),
                }}
              />
            </div>
            <div className="grid grid-cols-3 items-center">
              <MinDesc title="Bond Fee %" className="text-darkgrayish" />
              <MinDesc
                title={`${userCurrency.format(
                  calculatePercentqge(
                    subTotalcostRecord +
                      totalMaterialBaseCost +
                      calculatePercentqge(
                        subTotalcostRecord,
                        overHeadProfitPercentage
                      ),
                    bondFeePercentage
                  )
                )}`}
                className="text-darkgrayish"
              />
              <InputComponent
                suffix={<PercentageOutlined />}
                // prefix={<p>$</p>}
                label=""
                type="number"
                name="bondFee"
                placeholder="Enter Bond Fee"
                field={{
                  value: bondFeePercentage.toString(),
                  onChange: (e) => setBondFeePercentage(e.target.value),
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-celestialGray h-px w-full my-4"></div>
        <div className="flex justify-end">
          <div className="flex items-center w-full justify-between max-w-lg">
            <QuaternaryHeading title="Total Bid" className="font-semibold" />
            <Description
              title={`${userCurrency.format(
                totalCostRecord +
                  calculatePercentqge(
                    totalMaterialBaseCost,
                    materialPercentage
                  ) +
                  calculatePercentqge(
                    subTotalcostRecord,
                    overHeadProfitPercentage
                  ) +
                  calculatePercentqge(subTotalcostRecord, bondFeePercentage)
              )}`}
              className="font-semibold"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
