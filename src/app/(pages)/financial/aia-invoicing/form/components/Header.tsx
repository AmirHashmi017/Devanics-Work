import { CRMSendSMS } from '@/app/component/SMS';
import CustomButton from '@/app/component/customButton/button';
import WhiteButton from '@/app/component/customButton/white';
import CustomEmailTemplate from '@/app/component/customEmailTemplete';
import TertiaryHeading from '@/app/component/headings/tertiary';
import ModalComponent from '@/app/component/modal';
import { IAIAInvoice } from '@/app/interfaces/client-invoice.interface';
import emailService from '@/app/services/email.service';
import { QRCode } from 'antd';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';

type Props = {
  parentInvoice: IAIAInvoice;
  onDownloadInvoice?: () => void;
  barCodeValue: string;
};
export function AIAInvoiceFormHeader({
  parentInvoice,
  onDownloadInvoice,
  barCodeValue,
}: Props) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showSMSModal, setShowSMSModal] = useState(false);

  function handleDownload() {
    setIsDownloading(true);
    if (onDownloadInvoice) {
      onDownloadInvoice();
    }
    setIsDownloading(false);
  }

  return (
    <>
      <ModalComponent
        open={showEmailModal}
        setOpen={setShowEmailModal}
        width="50%"
      >
        <CustomEmailTemplate
          to=""
          setEmailModal={setShowEmailModal}
          isFileUploadShow={true}
          shouldUpdateTo
          submitHandler={async (formData) => {
            try {
              const response = await emailService.httpSendEmail(formData);
              if (response.statusCode === 200) {
                toast.success(response.message);
                setShowEmailModal(false);
              }
            } catch (error) {
              const err = error as AxiosError<{ message: string }>;
              toast.error(err.response?.data.message || 'An error occurred');
            }
          }}
        />
      </ModalComponent>

      <CRMSendSMS
        open={showSMSModal}
        onClose={() => setShowSMSModal(false)}
        client={parentInvoice.client as string}
        architect={parentInvoice.architect as string}
      />

      <div className="p-5 shadow-md flex justify-between items-center rounded-lg border border-silverGray  bg-white">
        <div className="flex space-x-3">
          <TertiaryHeading title="Invoice name:" className="font-medium" />
          <TertiaryHeading title={`${parentInvoice.invoiceName}`} />
        </div>

        <div className="flex items-center space-x-2">
          <QRCode value={barCodeValue} size={60} />

          <WhiteButton
            text="Send SMS"
            className="!w-fit"
            onClick={() => setShowSMSModal(true)}
          />

          <WhiteButton
            text="Email"
            className="!w-fit !bg-schestiLightPrimary !border-schestiLightPrimary"
            onClick={() => setShowEmailModal(true)}
          />
          <CustomButton
            text="Download invoice"
            className="!w-fit"
            onClick={handleDownload}
            isLoading={isDownloading}
          />
        </div>
      </div>
    </>
  );
}
