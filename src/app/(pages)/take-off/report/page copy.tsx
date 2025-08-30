'use client';
import Button from '@/app/component/customButton/button';
import Image from 'next/image';
import SenaryHeading from '@/app/component/headings/senaryHeading';
import CaptureComponent from '@/app/component/captureComponent';
import { useEffect, useState } from 'react';
import generatePDF from '@/app/component/captureComponent/generatePdf';
import ModalComponent from '@/app/component/modal';
import ClientModal from '../components/createClientModal';
import { useSelector } from 'react-redux';
import { selectTakeoffSummaries } from '@/redux/takeoffSummaries/takeoffSummaries.Selector';

const Report = () => {
  const summaries = useSelector(selectTakeoffSummaries);
  const [name, setName] = useState('');
  const [save, setSave] = useState(0);
  const [saveLoader, setSaveLoader] = useState(false);
  const [clientModal, setclientModal] = useState<boolean>(false);
  const [selectecClient, setselectecClient] = useState<any>({});

  useEffect(() => {
    const urlSearch = new URLSearchParams(window.location.search);
    const id = urlSearch.get('edit_id');
    if (id) {
      const current = summaries?.find((i: any) => i?._id == id);
      console.log(current, ' Selected Takeoff summary');
      if (current) {
        setName(current?.name ?? '');
        setselectecClient(current?.client ?? {});
      }
    }
  }, [summaries]);

  return (
    <>
      <section className="md:px-16 px-8 pb-4">
        <div className="flex gap-4 items-center mt-6">
          <Image src={'/home.svg'} alt="home icon" width={20} height={20} />
          <Image
            src={'/chevron-right.svg'}
            alt="chevron-right icon"
            width={16}
            height={16}
          />
          <SenaryHeading title="Takeoff" className="font-base text-slateGray" />
          <Image
            src={'/chevron-right.svg'}
            alt="chevron-right icon"
            width={16}
            height={16}
          />

          <SenaryHeading
            title="Report"
            className="font-semibold text-lavenderPurple cursor-pointer underline"
          />
        </div>

        {/* search project */}
        <div className="bg-white flex justify-between items-end mt-6">
          <div className="flex items-end space-x-4">
            <div className="rounded-lg border border-Gainsboro bg-silverGray h-[51px] flex items-center px-3">
              <input
                type="name"
                value={name}
                placeholder="Enter project name"
                className="w-[350px] h-full bg-transparent outline-none"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Button
                text="Generate Report"
                onClick={() => generatePDF('capture')}
              />
            </div>
            <div>
              <Button text="Add Client" onClick={() => setclientModal(true)} />
            </div>
            {(selectecClient?.firstName ||
              selectecClient?.email ||
              selectecClient?.companyName) && (
              <div>
                <Button
                  text={`Client: ${selectecClient?.firstName ?? selectecClient?.email ?? selectecClient?.companyName ?? 'N/A'}`}
                  // onClick={() => setclientModal(true)}
                  className="!bg-slate-400 !border-transparent"
                  disabled
                />
              </div>
            )}
          </div>
          <div>
            <Button
              text="Save"
              disabled={saveLoader || save > 0}
              isLoading={saveLoader}
              onClick={() => {
                setSaveLoader(true);
                setSave(1);
              }}
              className="disabled:opacity-50 !py-2"
            />
          </div>
        </div>
      </section>
      <CaptureComponent
        name={name}
        save={save}
        onSaveSuccess={() => {
          setSaveLoader(false);
        }}
        selectedClient={selectecClient}
      />
      <ModalComponent open={clientModal} setOpen={setclientModal}>
        <ClientModal
          setModalOpen={setclientModal}
          setSelectedClient={setselectecClient}
          selectecClient={selectecClient}
        />
      </ModalComponent>
    </>
  );
};

export default Report;
