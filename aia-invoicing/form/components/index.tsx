import {
  MutableRefObject,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { ConfigProvider, QRCode, Tabs } from 'antd';
import QuaternaryHeading from '@/app/component/headings/quaternary';
import { G703Component } from './G703';
import { G702Component } from './G702';
import { generateData } from '../utils';
import {
  G7State,
  IAIAInvoice,
} from '@/app/interfaces/client-invoice.interface';
import { clientInvoiceService } from '@/app/services/client-invoices.service';
import { toast } from 'react-toastify';
import CustomButton from '@/app/component/customButton/button';
import WhiteButton from '@/app/component/customButton/white';
import { ClientInvoiceHeader } from '../../components/ClientInvoiceHeader';
import { ClientInvoiceFooter } from '../../components/ClientInvoiceFooter';
import QuinaryHeading from '@/app/component/headings/quinary';
import { IUpdateCompanyDetail } from '@/app/interfaces/companyInterfaces/updateCompany.interface';
import { AIAForms } from './Forms';
import { AIAInvoiceFormMode } from '../../types';
import moment from 'moment';
import {
  handleDownloadPdfFromRef,
  handleDownloadPdfFromRefAsync,
} from '@/app/utils/downloadFile';
import { FileInterface } from '@/app/interfaces/file.interface';
import AwsS3 from '@/app/utils/S3Intergration';
import { useDeepCompareEffect } from 'ahooks';
import _ from 'lodash';

const G703_KEY = 'G703';
const G702_KEY = 'G702';
const FORMS_KEY = 'Forms';

type Props = {
  parentInvoice: IAIAInvoice;
  setParentInvoice: React.Dispatch<React.SetStateAction<IAIAInvoice | null>>;
  mode: AIAInvoiceFormMode;
  barCodeValue: string;
};
export const AiaInvoicingForm = forwardRef<
  {
    handleDownloadPdf: () => void;
  },
  Props
>(({ parentInvoice, setParentInvoice, mode, barCodeValue }, downloadRef) => {
  const auth = useSelector((state: RootState) => state.auth);
  const user = auth.user?.user as IUpdateCompanyDetail | undefined;
  const [tab, setTab] = useState(G703_KEY);
  const ref = useRef<HTMLDivElement>();

  let AIA_TABS_KEYS = [G703_KEY, G702_KEY];

  // all phases of the parent invoice
  const [allPhases, setAllPhases] = useState<IAIAInvoice[]>([]);
  // selected phase will be from allPhases and will be the latest last phase
  const [selectedPhase, setSelectedPhase] = useState<IAIAInvoice | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<
    Pick<
      IAIAInvoice,
      | 'lienWaiverFiles'
      | 'otherFiles'
      | 'salesFiles'
      | 'materialsFiles'
      | 'federalPaperFiles'
    >
  >({
    federalPaperFiles: [],
    lienWaiverFiles: [],
    materialsFiles: [],
    otherFiles: [],
    salesFiles: [],
  });

  const [g7State, setG7State] = useState<G7State>({
    applicationNo: '',
    invoiceName: '',
    applicationDate: new Date().toISOString(),
    periodTo: '',
    projectNo: '',
    data: generateData(),
    address: '',
    distributionTo: [],
    project: '',
    phase: 0,
    toOwner: '',
    viaEngineer: '',

    totalAdditionPreviousMonth: 0,
    totalAdditionThisMonth: 0,
    totalDeductionPreviousMonth: 0,
    totalDeductionThisMonth: 0,

    p5aPercentage: 10,
    p5bPercentage: 2,

    totalAmount: 0,
    amountPaid: 0,
  });

  useImperativeHandle(downloadRef, () => ({
    handleDownloadPdf: () => downloadPdf(),
  }));

  useDeepCompareEffect(() => {
    if (parentInvoice._id && (mode === 'phase' || mode === 'view')) {
      getAllPhases();
    }
  }, [parentInvoice, mode]);

  useDeepCompareEffect(() => {
    if (parentInvoice) {
      setFiles({
        federalPaperFiles: parentInvoice.federalPaperFiles,
        lienWaiverFiles: parentInvoice.lienWaiverFiles,
        materialsFiles: parentInvoice.materialsFiles,
        otherFiles: parentInvoice.otherFiles,
        salesFiles: parentInvoice.salesFiles,
      });
    }
    if ((parentInvoice._id && mode === 'view') || mode === 'phase') {
      return;
    } else if (mode === 'edit') {
      setG7State((prev) => ({
        ...prev,
        invoiceName: parentInvoice.invoiceName,
        _id: parentInvoice._id,
        applicationNo: parentInvoice.applicationNo,
        address: parentInvoice.address,
        amountPaid: parentInvoice.amountPaid,
        applicationDate: parentInvoice.applicationDate,
        distributionTo: parentInvoice.distributionTo,
        p5aPercentage: parentInvoice.p5aPercentage,
        p5bPercentage: parentInvoice.p5bPercentage,
        periodTo: parentInvoice.periodTo,
        phase: parentInvoice.phase,
        project: parentInvoice.project,
        projectNo: parentInvoice.projectNo,
        toOwner: parentInvoice.toOwner,
        totalAdditionPreviousMonth: parentInvoice.totalAdditionPreviousMonth,
        totalAdditionThisMonth: parentInvoice.totalAdditionThisMonth,
        totalAmount: parentInvoice.totalAmount,
        totalDeductionPreviousMonth: parentInvoice.totalDeductionPreviousMonth,
        totalDeductionThisMonth: parentInvoice.totalDeductionThisMonth,
        viaEngineer: parentInvoice.viaEngineer,
        data:
          parentInvoice.data.length === 0 ? generateData() : parentInvoice.data,
      }));
    }
  }, [parentInvoice._id, parentInvoice.invoiceName, mode]);

  function handleFiles<
    k extends keyof Pick<
      IAIAInvoice,
      | 'lienWaiverFiles'
      | 'otherFiles'
      | 'salesFiles'
      | 'materialsFiles'
      | 'federalPaperFiles'
    >,
  >(key: k, value: FileInterface[]) {
    setFiles({
      ...files,
      [key]: value,
    });
  }

  async function getAllPhases() {
    try {
      // get all the phases of the invoice
      const response = await clientInvoiceService.httpGetInvoicePhases(
        parentInvoice._id
      );
      if (response.data) {
        // add parent phase as a previous phase
        const phases = [parentInvoice, ...response.data.invoices];
        // sort phases by date using moment
        phases.sort(
          (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix()
        );
        const _selectedPhase = phases[phases.length - 1];
        setAllPhases(phases);
        setSelectedPhase(_selectedPhase);
        // copy the values;
        updateG7StateFromPhase({ ..._selectedPhase });
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  }

  function handleG7State<K extends keyof G7State>(
    key: K,
    value: (typeof g7State)[K]
  ) {
    setG7State((prev) => {
      const changeOrder = handlePreviousAndNewChangeOrder(prev);
      if (
        key === 'data' ||
        key === 'p5aPercentage' ||
        key === 'p5bPercentage'
      ) {
        const data = [...prev.data];
        for (let index = 0; index < data.length; index++) {
          updateColumn6(data, index);
          updateColumn7(data, index);
          updateColumn8(data, index);
          updateColumn9(data, index);
        }
        return {
          ...prev,
          ...changeOrder,
          [key]: value,
        };
      }

      return { ...prev, [key]: value };
    });
  }

  function updateG7StateFromPhase(phase: IAIAInvoice) {
    const data = updatePreviousApplicationColumn(phase);
    if (mode !== 'view') {
      phase.applicationDate = '';
      phase.periodTo = '';
    }
    setG7State({ ...phase, data });
  }

  function updatePreviousApplicationColumn(_selectedPhase: IAIAInvoice) {
    let previousPhaseData = JSON.parse(
      JSON.stringify(_selectedPhase.data)
    ) as Array<string[]>;
    const data = [...previousPhaseData];
    const COLUMN_THIS_PERIOD = 4;
    const COLUMN_PREVIOUS_APPLICATION = 3;

    // loop over data
    data.forEach((row) => {
      const previousPhaseThisPeriodValue = Number(row[COLUMN_THIS_PERIOD]);
      const previousPhasePreviousApplicationValue = Number(
        row[COLUMN_PREVIOUS_APPLICATION]
      );
      const value =
        previousPhaseThisPeriodValue + previousPhasePreviousApplicationValue;
      row[COLUMN_PREVIOUS_APPLICATION] = value.toString();
      row[COLUMN_THIS_PERIOD] = '';
    });
    return data;
  }

  function sumColumns(rows: Array<string[]>, column: number): number {
    let sum = 0;
    rows.forEach((row) => {
      let val = Number(row[column]);
      sum += isNaN(val) ? 0 : val;
    });
    return isNaN(sum) ? 0 : sum;
  }

  function updateRetainage(value: number) {
    let dataCopy = [...g7State.data];
    for (let index = 0; index < dataCopy.length; index++) {
      dataCopy = updateColumn6(dataCopy, index);
      dataCopy = updateColumn7(dataCopy, index);
      dataCopy = updateColumn8(dataCopy, index);
      dataCopy = updateColumn9(dataCopy, index);
    }
    setG7State({
      ...g7State,
      data: dataCopy,
      p5aPercentage: value,
    });
  }

  function updateCellValue(
    row: number,
    column: number,
    value: number | string
  ) {
    let newData = [...g7State.data];
    newData[row][column] = `${value}`;
    newData = updateColumn6(newData, row);
    newData = updateColumn7(newData, row);
    newData = updateColumn8(newData, row);
    newData = updateColumn9(newData, row);
    handleG7State('data', newData);
  }

  function updateColumn6(data: Array<string[]>, rowIndex: number) {
    const newData = [...data];
    const row = newData[rowIndex];
    let columnD = row[3];
    let columnE = row[4];
    let columnF = row[5];
    let sum = Number(columnD) + Number(columnE) + Number(columnF);
    newData[rowIndex][6] = `${sum}`;
    return newData;
  }

  function handlePreviousAndNewChangeOrder(prevState: G7State) {
    const rowsWithNonNumericIndex = _.map(prevState.data, (row, index) => {
      return isNaN(Number(row[0])) ? index : undefined;
    }).filter((index) => index !== undefined);

    const changeOrder = {
      totalAdditionPreviousMonth: prevState.totalAdditionPreviousMonth,
      totalDeductionPreviousMonth: prevState.totalDeductionPreviousMonth,
      totalAdditionThisMonth: prevState.totalAdditionThisMonth,
      totalDeductionThisMonth: prevState.totalDeductionThisMonth,
    };

    /**
     * Calculate total addition and deduction for previous month from previous change order table
     * @param {G7State} prevState - previous state of G7
     * @returns {changeOrder} - object with total addition and deduction for previous month
     */
    if (rowsWithNonNumericIndex.length > 0) {
      // We need rows from rowsWithNonNumericIndex at second index + 1 and upto 3rd index exclusively
      const prevChangeOrderindex = rowsWithNonNumericIndex[1];

      const newChangeOrderIndex = rowsWithNonNumericIndex[2];
      if (prevChangeOrderindex) {
        const prev = prevState.data.slice(
          prevChangeOrderindex + 1,
          newChangeOrderIndex
        );
        const allpreviousChangeValues = _.map(prev, (row) => {
          let value = Number(row[2]);
          if (isNaN(value)) {
            value = 0;
          }
          return value;
        });

        const totalAdditionnPreviousMonth = _.sum(
          allpreviousChangeValues.filter((val) => val > 0)
        );
        const totalDeductionPreviousMonth = _.sum(
          allpreviousChangeValues.filter((val) => val < 0)
        );

        changeOrder.totalAdditionPreviousMonth = totalAdditionnPreviousMonth;
        changeOrder.totalDeductionPreviousMonth = totalDeductionPreviousMonth;
      }
      /**
       * Calculates total addition and deduction for this month from new change order table
       * @param {number} newChangeOrderIndex - index of new change order
       * @param {G7State['data']} data - data of G7 component
       * @returns {changeOrder} - object with total addition and deduction for this month
       */
      if (newChangeOrderIndex) {
        const newChangeOrder = prevState.data.slice(newChangeOrderIndex + 1);
        const allNewChangeValues = _.map(newChangeOrder, (row) => {
          let value = Number(row[2]);
          if (isNaN(value)) {
            value = 0;
          }
          return value;
        });
        const totalAdditionThisMonth = _.sum(
          allNewChangeValues.filter((val) => val > 0)
        );
        const totalDeductionThisMonth = _.sum(
          allNewChangeValues.filter((val) => val < 0)
        );
        changeOrder.totalAdditionThisMonth = totalAdditionThisMonth;
        changeOrder.totalDeductionThisMonth = totalDeductionThisMonth;
      }
    }
    return changeOrder;
  }

  function updateColumn7(data: Array<string[]>, rowIndex: number) {
    const newData = [...data];
    const row = newData[rowIndex];
    let columnC = Number(row[2]);
    let columnG = Number(row[6]);
    // % (G ÷ C)
    let result = (columnG / columnC) * 100;
    newData[rowIndex][7] = `${isNaN(result) ? 0 : result}`;
    return newData;
  }

  function updateColumn8(data: Array<string[]>, rowIndex: number) {
    const newData = [...data];
    const row = newData[rowIndex];
    let columnG = Number(row[6]);
    let columnC = Number(row[2]);
    let result = columnC - columnG;
    newData[rowIndex][8] = `${isNaN(result) ? 0 : result}`;
    return newData;
  }

  function updateColumn9(data: Array<string[]>, rowIndex: number) {
    const newData = [...data];
    const row = newData[rowIndex];
    let columnPreviousPeriod = row[3];
    let columnThisPeriod = row[4];
    // 10% of Column Previous Period and Column This Period
    let result =
      (g7State.p5aPercentage / 100) *
      (Number(columnPreviousPeriod) + Number(columnThisPeriod));
    newData[rowIndex][9] = `${isNaN(result) ? 0 : result}`;
    return newData;
  }

  async function handleSubmit(data: G7State) {
    // Get total Amount and Total Amount Paid
    const changeOrderSummaryAdditionSum =
      data.totalAdditionThisMonth + data.totalAdditionPreviousMonth;
    const changeOrderSummaryDeductionSum =
      data.totalDeductionThisMonth + data.totalDeductionPreviousMonth;
    const changeOrderNetChanges =
      changeOrderSummaryAdditionSum - changeOrderSummaryDeductionSum;
    const originalContractSum = sumColumns(data.data, 2);

    const totalAmount = originalContractSum + changeOrderNetChanges;
    const amountPaid = Number(sumColumns(data.data, 6).toFixed(2));

    setIsSubmitting(true);
    const pdfScreenShot = await handleDownloadPdfFromRefAsync(
      ref as any,
      parentInvoice.invoiceName,
      false,
      false
    );
    console.log('Uploading pdf screenshot');
    const pdf = await new AwsS3(
      pdfScreenShot.output('blob'),
      '/aia-invoicing'
    ).getS3URL();
    console.log('pdf', pdf);
    if (mode === 'edit') {
      clientInvoiceService
        .httpUpdateParentInvoice(parentInvoice._id, {
          ...data,
          totalAmount,
          amountPaid,
          ...files,
          pdf,
        })
        .then((response) => {
          if (response.statusCode == 201 && response.data) {
            toast.success('Data saved successfully');
            setParentInvoice(response.data?.invoice);
          }
        })
        .catch(({ response }: any) => {
          if (response?.data.message === 'Validation Failed') {
            toast.error('Please fill the required fields.');
          } else {
            toast.error(response?.data.message);
          }
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    } else if (mode === 'phase') {
      clientInvoiceService
        .httpCreateNewInvoicePhase(parentInvoice._id, {
          ...data,
          totalAmount,
          amountPaid,
          pdf,
        })
        .then((response) => {
          if (response.statusCode == 201 && response.data) {
            toast.success('Invoice created successfully');
            // setSelectedPhase(response.data.invoice);
            getAllPhases();
          }
        })
        .catch(({ response }) => {
          if (response?.data.message === 'Validation Failed') {
            toast.error('Please fill the required fields.');
          } else {
            toast.error(response?.data.message);
          }
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    } else {
      toast.error('Invalid mode');
    }
  }

  function downloadPdf() {
    // takeScreenshot(ref.current);
    // var doc = new jsPDF('portrait', 'in', 'a0');
    // if (image) {
    //     const imgProps = doc.getImageProperties(image);
    //     const width = doc.internal.pageSize.getWidth();
    //     const ratio = width / imgProps.width;
    //     const height = ratio * imgProps.height;
    //     doc.internal.pageSize.height = height;
    //     doc.addImage(image, 'JPEG', 0, 0, width, height);
    //     doc.save(`${parentInvoice.invoiceName}-invoice.pdf`);
    // }

    handleDownloadPdfFromRef(ref, parentInvoice.invoiceName, false);
  }

  if (mode !== 'view') {
    AIA_TABS_KEYS = [G703_KEY, G702_KEY, FORMS_KEY];
  }

  return (
    <>
      <div className="px-4 py-2 shadow-md rounded-lg border border-silverGray  bg-white">
        <ConfigProvider
          theme={{
            components: {
              Tabs: {
                // inkBarColor: '#8449EB',
                lineWidth: 5,
                lineWidthFocus: 5,
                lineWidthBold: 5,
              },
              Input: {
                padding: 0,
                borderRadius: 0,
                colorBorder: 'transparent',
                controlHeight: 32,
                colorTextDisabled: 'black',
              },
              InputNumber: {
                borderRadius: 0,
                colorBorder: 'transparent',
                controlHeight: 32,
              },
              Table: {
                cellPaddingBlock: 0,
                cellPaddingInline: 0,
              },
            },
          }}
        >
          <Tabs
            destroyInactiveTabPane
            onChange={(key) => {
              setTab(key);
            }}
            activeKey={tab}
            items={AIA_TABS_KEYS.map((type) => {
              return {
                key: type,
                label: (
                  <QuaternaryHeading
                    title={type}
                    className={`${
                      tab === type ? 'text-schestiPrimary' : 'text-black'
                    }`}
                  />
                ),
                tabKey: type,
                children:
                  tab === G703_KEY ? (
                    <G703Component
                      state={g7State}
                      handleState={handleG7State}
                      sumColumns={sumColumns}
                      updateCellValue={updateCellValue}
                      mode={mode}
                      phases={allPhases}
                      selectedPhase={selectedPhase}
                      parentInvoice={parentInvoice}
                      setSelectedPhase={(value) => {
                        let _selectedPhase = allPhases.find(
                          (phase) => phase._id === value
                        );
                        if (_selectedPhase) {
                          setSelectedPhase(_selectedPhase);
                          updateG7StateFromPhase({ ..._selectedPhase });
                        }
                      }}
                      showAddAndDelete={mode !== 'view'}
                    >
                      <CustomButton
                        onClick={() => setTab(G702_KEY)}
                        text="Next"
                        className="!w-40"
                      />
                    </G703Component>
                  ) : tab === G702_KEY ? (
                    <G702Component
                      state={g7State}
                      handleState={handleG7State}
                      updateRetainage={updateRetainage}
                      sumColumns={sumColumns}
                      previousPhaseState={selectedPhase}
                      mode={mode}
                      showValidation={mode !== 'view'}
                      parentInvoice={parentInvoice}
                    >
                      <WhiteButton
                        onClick={() => {
                          setTab(G703_KEY);
                        }}
                        text="Previous"
                        className="!w-40"
                      />
                      <CustomButton
                        text="Next"
                        className="!w-48"
                        onClick={() => {
                          setTab(FORMS_KEY);
                        }}
                      />
                    </G702Component>
                  ) : tab === FORMS_KEY ? (
                    <AIAForms
                      files={files}
                      handleFiles={handleFiles}
                      mode={mode}
                    >
                      <WhiteButton
                        onClick={() => {
                          setTab(G702_KEY);
                        }}
                        text="Previous"
                        className="!w-40"
                      />
                      <CustomButton
                        text="Submit"
                        className="!w-48"
                        onClick={() => {
                          handleSubmit(g7State);
                        }}
                        isLoading={isSubmitting}
                        loadingText="Submitting..."
                        disabled={isSubmitting}
                      />
                    </AIAForms>
                  ) : null,
              };
            })}
          />
        </ConfigProvider>
      </div>
      <div
        ref={ref as MutableRefObject<HTMLDivElement>}
        className="space-y-5 w-full fixed top-0 -left-[2500px] border p-6"
        // className="space-y-5 w-full border p-6"
      >
        <ClientInvoiceHeader />
        <div className="flex justify-end w-full space-x-3">
          <QRCode value={barCodeValue} size={60} />
          {/* <div>
                <img width={100} height={100}  alt='logo' src={user?.avatar ? user?.avatar : '/logo.svg'} />
              </div> */}
          <div>
            <QuinaryHeading title={user!.name} />
            <QuinaryHeading title={user!.email || ''} className="mt-1" />
          </div>
        </div>
        <ConfigProvider
          theme={{
            components: {
              Tabs: {
                // inkBarColor: '#8449EB',
              },
              Input: {
                padding: 0,
                borderRadius: 0,
                colorBorder: 'transparent',
                controlHeight: 32,
                colorTextDisabled: 'black',
              },
              InputNumber: {
                borderRadius: 0,
                colorBorder: 'transparent',
                controlHeight: 32,
              },
              Table: {
                cellPaddingBlock: 0,
                cellPaddingInline: 0,
              },
            },
          }}
        >
          <G702Component
            state={g7State}
            handleState={handleG7State}
            updateRetainage={updateRetainage}
            sumColumns={sumColumns}
            showValidation={false}
            mode={'view'}
            previousPhaseState={selectedPhase}
            parentInvoice={parentInvoice}
          />
          <ClientInvoiceFooter />
          <G703Component
            state={g7State}
            handleState={handleG7State}
            parentInvoice={parentInvoice}
            sumColumns={sumColumns}
            updateCellValue={updateCellValue}
            mode={'view'}
            showAddAndDelete={false}
            phases={allPhases}
            selectedPhase={selectedPhase}
            setSelectedPhase={(value) => {
              let _selectedPhase = allPhases.find(
                (phase) => phase._id === value
              );
              if (_selectedPhase) {
                setSelectedPhase(_selectedPhase);
                updateG7StateFromPhase({ ..._selectedPhase });
              }
            }}
          />
        </ConfigProvider>
        {/* <div className="flex justify-end mr-8">
              <Image width={100} height={20} alt="logo" src="/powered-by.png" />
            </div> */}
        <ClientInvoiceFooter />
      </div>
    </>
  );
});

AiaInvoicingForm.displayName = 'Invoicing Form';
