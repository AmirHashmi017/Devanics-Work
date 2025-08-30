import { InputComponent } from '@/app/component/customInput/Input';
import SenaryHeading from '@/app/component/headings/senaryHeading';
import { PhoneNumberInputWithLable } from '@/app/component/phoneNumberInput/PhoneNumberInputWithLable';
import { TextAreaComponent } from '@/app/component/textarea';
import { IBookingDemoForm } from '@/app/interfaces/booking-demo.interface';
import dayjs from 'dayjs';
import type { FormikProps } from 'formik';
import moment from 'moment';

type Props = {
  formik: FormikProps<IBookingDemoForm>;
  onEditClick: () => void;
};

export function PutInfo({ formik, onEditClick }: Props) {
  return (
    <div className="space-y-3 mt-5">
      <SenaryHeading
        title="Your Information"
        className="text-base font-medium text-schestiPrimaryBlack"
      />

      <div className="flex items-center gap-1">
        <SenaryHeading
          title={`${dayjs(formik.values.date).format('dddd, DD MMM YYYY,')} ${moment(formik.values.time, 'hh:mmA').format('hh:mm A')}`}
          className="text-base font-medium text-schestiPrimary"
        />

        <SenaryHeading
          title="Edit"
          className="text-base font-medium text-schestiWarning underline cursor-pointer"
          onClick={onEditClick}
        />
      </div>

      {/* Form */}
      <div className="flex gap-2 flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <InputComponent
            label="First Name"
            name="firstName"
            type="text"
            placeholder="i.e John"
            field={{
              value: formik.values.firstName
                ? formik.values.firstName
                : undefined,
              onChange: formik.handleChange,
              onBlur: formik.handleBlur,
            }}
            hasError={
              formik.touched.firstName && Boolean(formik.errors.firstName)
            }
            errorMessage={
              formik.touched.firstName && formik.errors.firstName
                ? formik.errors.firstName
                : ''
            }
          />
        </div>

        <div className="flex-1">
          <InputComponent
            label="Last Name"
            name="lastName"
            type="text"
            placeholder="i.e Doe"
            field={{
              value: formik.values.lastName
                ? formik.values.lastName
                : undefined,
              onChange: formik.handleChange,
              onBlur: formik.handleBlur,
            }}
            hasError={
              formik.touched.lastName && Boolean(formik.errors.lastName)
            }
            errorMessage={
              formik.touched.lastName && formik.errors.lastName
                ? formik.errors.lastName
                : ''
            }
          />
        </div>
      </div>

      <div className="flex gap-2 flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <PhoneNumberInputWithLable
            label="Phone Number"
            name="phone"
            onChange={(val) => {
              formik.setFieldValue('phone', val as string);
              formik.setFieldTouched('phone', true);
            }}
            onBlur={formik.handleBlur}
            value={formik.values.phone as any}
            hasError={formik.touched.phone && Boolean(formik.errors.phone)}
            errorMessage={
              formik.touched.phone && formik.errors.phone
                ? formik.errors.phone
                : ''
            }
            placeholder="i.e +1-234-567-7890"
          />
        </div>

        <div className="flex-1">
          <InputComponent
            label="Email"
            name="email"
            type="email"
            placeholder="i.e john@mail.com"
            field={{
              value: formik.values.email ? formik.values.email : undefined,
              onChange: formik.handleChange,
              onBlur: formik.handleBlur,
            }}
            hasError={formik.touched.email && Boolean(formik.errors.email)}
            errorMessage={
              formik.touched.email && formik.errors.email
                ? formik.errors.email
                : ''
            }
          />
        </div>
      </div>

      <InputComponent
        label="Company"
        name="company"
        type="text"
        placeholder="i.e Google"
        field={{
          value: formik.values.company ? formik.values.company : undefined,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
        }}
        hasError={formik.touched.company && Boolean(formik.errors.company)}
        errorMessage={
          formik.touched.company && formik.errors.company
            ? formik.errors.company
            : ''
        }
      />

      <TextAreaComponent
        label="What problem are you looking to solve?"
        name="problem"
        field={{
          value: formik.values.problem ? formik.values.problem : undefined,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
        }}
        hasError={formik.touched.problem && Boolean(formik.errors.problem)}
        errorMessage={
          formik.touched.problem && formik.errors.problem
            ? formik.errors.problem
            : ''
        }
      />

      <TextAreaComponent
        label="How did you hear about us?"
        name="hearAbout"
        field={{
          value: formik.values.hearAbout ? formik.values.hearAbout : undefined,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
        }}
        hasError={formik.touched.hearAbout && Boolean(formik.errors.hearAbout)}
        errorMessage={
          formik.touched.hearAbout && formik.errors.hearAbout
            ? formik.errors.hearAbout
            : ''
        }
      />
    </div>
  );
}
