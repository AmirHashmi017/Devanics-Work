import QuaternaryHeading from '@/app/component/headings/quaternary';
import TertiaryHeading from '@/app/component/headings/tertiary';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
  G7State,
  IAIAInvoice,
} from '@/app/interfaces/client-invoice.interface';
import { clientInvoiceService } from '@/app/services/client-invoices.service';
import { ConfigProvider, Tabs } from 'antd';
import moment from 'moment';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { G703Component } from './G703';
import { generateData } from '../utils';
import { G702Component } from './G702';
import CustomButton from '@/app/component/customButton/button';
import WhiteButton from '@/app/component/customButton/white';
import { useScreenshot } from '@breezeos-dev/use-react-screenshot';
import jsPDF from 'jspdf';
import { ClientInvoiceFooter } from '../../../components/ClientInvoiceFooter';
import { ClientInvoiceHeader } from '../../../components/ClientInvoiceHeader';
import { IUpdateCompanyDetail } from '@/app/interfaces/companyInterfaces/updateCompany.interface';
import QuinaryHeading from '@/app/component/headings/quinary';

type Props = {
  parentInvoice: IAIAInvoice;
};
const G703_KEY = 'G703';
const G702_KEY = 'G702';

export function PhaseComponent({ parentInvoice }: Props) {
  const auth = useSelector((state: RootState) => state.auth);
  const user = auth.user?.user as IUpdateCompanyDetail | undefined;

  // selected phase will be from allPhases and will be the latest last phase
  const [selectedPhase, setSelectedPhase] = useState<IAIAInvoice | null>(null);
  const [tab, setTab] = useState(G703_KEY);
  const ref = useRef<HTMLDivElement>();
  const [image, takeScreenshot] = useScreenshot();
  const [isDownloading, setIsDownloading] = useState(false);

  // all phases of the parent invoice
  const [allPhases, setAllPhases] = useState<IAIAInvoice[]>([]);
  const [g7State, setG7State] = useState<G7State>({
    applicationNo: '',
    invoiceName: '',
    applicationDate: new Date().toString(),
    periodTo: new Date().toString(),
    projectNo: '',
    data: generateData(),
    address: '',
    distributionTo: ['Architect'],
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

  useEffect(() => {
    if (parentInvoice._id) {
      (async function () {
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
        }
      })();
    }
  }, [parentInvoice]);

  useEffect(() => {
    takeScreenshot(ref.current);
  }, [g7State]);

  function updateG7StateFromPhase(phase: IAIAInvoice) {
    const data = updatePreviousApplicationColumn(phase);
    setG7State({ ...phase, data });
  }
  function handleG7State<K extends keyof G7State>(
    key: K,
    value: (typeof g7State)[K]
  ) {
    setG7State((prev) => {
      return { ...prev, [key]: value };
    });
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

  function downloadPdf() {
    setIsDownloading(true);
    var doc = new jsPDF('portrait', 'in', 'a0');
    if (image) {
      const imgProps = doc.getImageProperties(image);
      const width = doc.internal.pageSize.getWidth();
      const ratio = width / imgProps.width;
      const height = ratio * imgProps.height;
      doc.internal.pageSize.height = height;
      doc.addImage(image, 'JPEG', 0, 0, width, height);
      setTimeout(() => {
        doc.save(`${parentInvoice.invoiceName}-invoice.pdf`);
      }, 500);
    }
    setIsDownloading(false);
  }

  return (
    <section className="mx-16 my-2">
      <div className="p-5 shadow-md rounded-lg border border-silverGray  bg-white">
        <div className="flex space-x-3">
          <TertiaryHeading title="Invoice name:" className="font-medium" />
          <TertiaryHeading title={`${parentInvoice.invoiceName}`} />
        </div>
      </div>

      <div className="px-4 py-2 my-5 shadow-md rounded-lg border border-silverGray  bg-white">
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
          <Tabs
            destroyInactiveTabPane
            onChange={(key) => {
              setTab(key);
            }}
            activeKey={tab}
            items={[G703_KEY, G702_KEY].map((type) => {
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
                      phases={allPhases}
                      handleState={handleG7State}
                      state={g7State}
                      sumColumns={sumColumns}
                    >
                      <CustomButton
                        onClick={() => setTab(G702_KEY)}
                        text="Next"
                        className="!w-40"
                      />
                    </G703Component>
                  ) : (
                    <G702Component
                      handleState={handleG7State}
                      updateRetainage={updateRetainage}
                      state={g7State}
                      previousPhaseState={selectedPhase}
                      sumColumns={sumColumns}
                    >
                      <WhiteButton
                        onClick={() => {
                          setTab(G703_KEY);
                        }}
                        text="Previous"
                        className="!w-40"
                      />
                      <CustomButton
                        loadingText="Downloading..."
                        isLoading={isDownloading}
                        text={'Download PDF'}
                        onClick={() => downloadPdf()}
                        className="!w-40"
                      />
                    </G702Component>
                  ),
              };
            })}
          />
        </ConfigProvider>
      </div>
      <div
        ref={ref as MutableRefObject<HTMLDivElement>}
        className="space-y-5 w-full absolute z -left-[2500px] border p-6"
        // className="space-y-5 w-full border p-6"
      >
        <ClientInvoiceHeader />
        <div className="flex justify-end w-full">
          {/* <div>
            <img width={100} height={100}  alt='logo' src={user?.avatar ? user?.avatar : '/logo.svg'} />
          </div> */}
          <div>
            <QuinaryHeading title={user!.name} />
            <QuinaryHeading title={user!.email || ''} className="mt-1" />
          </div>
        </div>
        <div className=""></div>
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
            handleState={handleG7State}
            updateRetainage={updateRetainage}
            state={g7State}
            previousPhaseState={selectedPhase}
            sumColumns={sumColumns}
          />

          <ClientInvoiceFooter />

          <G703Component
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
            phases={allPhases}
            handleState={handleG7State}
            state={g7State}
            sumColumns={sumColumns}
          />
        </ConfigProvider>
        {/* <div className="flex justify-end">
          <Image width={100} height={20} alt="logo" src="/powered-by.png" />
        </div> */}
        <ClientInvoiceFooter />
      </div>
    </section>
  );
}
