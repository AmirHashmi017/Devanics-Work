import { Link } from 'react-router-dom';
import PrimaryHeading from 'src/components/Headings/Primary';
import parse from 'html-react-parser';
import { Routes } from 'src/pages/Plans/utils';
import { EmailHeader } from './EmailHeader';
import { EmailCard } from './EmailCard';
import { FormikProps } from 'formik';
import { EmailNotificationData } from 'src/services/email-notifiication.service';
import SchestiMarketingEmailPreview from './MarketingEmailPreview';
import { EmailContact } from './EmailContact';

type Props = {
  formik: FormikProps<EmailNotificationData>;
};

export function EmailPreview({ formik }: Props) {
  return (
    <div className="p-8 space-y-3">
      <div className="flex justify-between items-center ">
        <PrimaryHeading title={'Email Preview'} className="text-[20px]" />
        {/* <Link
          to={Routes.Email_Notification.Preview}
          className="text-schestiPrimary no-underline"
        >
          Preview in New Tab
        </Link> */}
      </div>

      <div className="space-y-3 bg-white">
        <EmailHeader />

        <div className="p-5 ">
          <EmailCard
            buttonLink=""
            buttonText=""
            title={formik.values.title}
            showBtn={false}
          />
        </div>

        <div className="p-5 mx-5">
          <div className="w-full overflow-x-auto email-preview">
            {parse(formik.values.message)}
          </div>

          {formik.values.type === 'marketing' ? (
            <>
              <SchestiMarketingEmailPreview />
            </>
          ) : null}
          <EmailContact />
        </div>
      </div>
    </div>
  );
}
