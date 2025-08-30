import { InputComponent } from '@/app/component/customInput/Input';
import { DateInputComponent } from '@/app/component/cutomDate/CustomDateInput';
import { TimeInputComponent } from '@/app/component/cutomDate/CustomTimeInput';
import { TextAreaComponent } from '@/app/component/textarea';
import { IBidManagement } from '@/app/interfaces/bid-management/bid-management.interface';
import { Checkbox } from 'antd';
import dayjs from 'dayjs';
import type { FormikProps } from 'formik';
import Image from 'next/image';

type Props = {
  formik: FormikProps<IBidManagement>;
};
export function EventSiteWalkThroughForm({ formik }: Props) {
  if (!formik.values.siteWalkthrough?.isChecked) {
    return null;
  }

  return (
    <div className="space-y-2 mt-3">
      <Checkbox
        checked={formik.values.siteWalkthrough?.isMandatory}
        onChange={(e) =>
          formik.setFieldValue('siteWalkthrough.isMandatory', e.target.checked)
        }
      >
        {"It's a mandatory meeting"}
      </Checkbox>
      <div className="flex items-center space-x-3">
        <div className="flex-1">
          <InputComponent
            placeholder="Enter Location"
            label=""
            name="siteWalkthrough.location"
            type="text"
            field={{
              suffix: (
                <Image
                  src="/navigation-black.svg"
                  width={20}
                  height={20}
                  alt="location"
                />
              ),
              value: formik.values?.siteWalkthrough?.location,
              onChange: (e) =>
                formik.setFieldValue(
                  'siteWalkthrough.location',
                  e.target.value
                ),
              onBlur: formik.handleBlur,
            }}
            hasError={
              // @ts-ignore
              formik.touched.siteWalkthrough?.location &&
              Boolean((formik.errors.siteWalkthrough as any)?.location)
            }
            errorMessage={
              // @ts-ignore
              formik.errors.siteWalkthrough?.location
            }
          />
        </div>

        <div>
          <DateInputComponent
            label=""
            name="siteWalkthrough.date"
            placeholder="Select Date"
            fieldProps={{
              format: 'MM/DD/YYYY',
              // @ts-ignore
              value:
                formik.values.siteWalkthrough &&
                formik.values.siteWalkthrough.date
                  ? dayjs(formik.values.siteWalkthrough.date)
                  : undefined,
              onChange: (date, dateString) => {
                formik.setFieldValue(
                  'siteWalkthrough.date',
                  dateString as string
                );
              },
              onBlur: formik.handleBlur,
            }}
            hasError={
              // @ts-ignore
              formik.touched.siteWalkthrough?.date &&
              Boolean((formik.errors.siteWalkthrough as any)?.date)
            }
            errorMessage={
              // @ts-ignore
              formik.errors.siteWalkthrough?.date
            }
          />
        </div>
        <div>
          <TimeInputComponent
            label=""
            name="siteWalkthrough.time"
            placeholder="Select Time"
            fieldProps={{
              use12Hours: true,
              format: 'h:mm a',
              // @ts-ignore
              value:
                formik.values.siteWalkthrough &&
                formik.values.siteWalkthrough.time
                  ? dayjs(formik.values.siteWalkthrough.time, 'h:mm a')
                  : undefined,
              onChange: (time, timeString) => {
                formik.setFieldValue(
                  'siteWalkthrough.time',
                  timeString as string
                );
              },
              showNow: false,
              onBlur: formik.handleBlur,
            }}
            hasError={
              // @ts-ignore
              formik.touched.siteWalkthrough?.time &&
              Boolean((formik.errors.siteWalkthrough as any)?.time)
            }
            errorMessage={
              // @ts-ignore
              formik.errors.siteWalkthrough?.time
            }
          />
        </div>
      </div>
      <TextAreaComponent
        label=""
        name="siteWalkthrough.instruction"
        placeholder="Meeting Instructions"
        field={{
          value: formik.values.siteWalkthrough?.instruction,
          onChange: (e) =>
            formik.setFieldValue('siteWalkthrough.instruction', e.target.value),
          onBlur: formik.handleBlur,
        }}
        hasError={
          // @ts-ignore
          formik.touched.siteWalkthrough?.instruction &&
          Boolean((formik.errors.siteWalkthrough as any)?.instruction)
        }
        errorMessage={
          // @ts-ignore
          formik.errors.siteWalkthrough?.instruction
        }
      />
    </div>
  );
}
