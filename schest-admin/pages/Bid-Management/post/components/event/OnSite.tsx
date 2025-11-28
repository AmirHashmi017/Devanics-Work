import dayjs from 'dayjs';
import type { FormikProps } from 'formik';
import { DateInputComponent } from 'src/components/customDate/CustomDateInput';
import { TimeInputComponent } from 'src/components/customDate/CustomTimeInput';
import { InputComponent } from 'src/components/CustomInput/Input';
import { TextAreaComponent } from 'src/components/textarea';
import { IBidManagement } from 'src/interfaces/bid-management/bid-management.interface';

type Props = {
  formik: FormikProps<IBidManagement>;
};
export function EventOnSiteForm({ formik }: Props) {
  if (
    formik.values.preBiddingMeeting?.isChecked &&
    formik.values.preBiddingMeeting?.type === 'Onsite'
  ) {
    return (
      <div className="space-y-2 mt-3">
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <InputComponent
              placeholder="Enter Location"
              label=""
              name="location"
              type="text"
              field={{
                suffix: (
                  <img
                    src="/assets/icons/navigation-cyan.svg"
                    width={17}
                    alt="location"
                  />
                ),
                value: formik.values?.preBiddingMeeting?.location,
                onChange: (e) =>
                  formik.setFieldValue(
                    'preBiddingMeeting.location',
                    e.target.value
                  ),
                onBlur: () =>
                  formik.setFieldTouched('preBiddingMeeting.location', true),
              }}
              hasError={
                // @ts-ignore
                formik.touched.preBiddingMeeting?.location &&
                Boolean((formik.errors.preBiddingMeeting as any)?.location)
              }
              errorMessage={
                // @ts-ignore
                formik.errors.preBiddingMeeting?.location
              }
            />
          </div>

          <div>
            <DateInputComponent
              label=""
              name="preBiddingMeeting.date"
              placeholder="Select Date"
              fieldProps={{
                format: 'MM/DD/YYYY',
                value:
                  formik.values.preBiddingMeeting &&
                  formik.values.preBiddingMeeting.date
                    ? dayjs(formik.values.preBiddingMeeting.date)
                    : undefined,
                onChange: (date, dateString) => {
                  formik.setFieldValue(
                    'preBiddingMeeting.date',
                    dateString as string
                  );
                },
                onBlur: () =>
                  formik.setFieldTouched('preBiddingMeeting.date', true),
              }}
              hasError={
                // @ts-ignore
                formik.touched.preBiddingMeeting?.date &&
                Boolean((formik.errors.preBiddingMeeting as any)?.date)
              }
              errorMessage={
                // @ts-ignore
                formik.errors.preBiddingMeeting?.date
              }
            />
          </div>
          <div>
            <TimeInputComponent
              label=""
              name=""
              placeholder="Select Time"
              fieldProps={{
                use12Hours: true,
                format: 'h:mm a',
                value:
                  formik.values.preBiddingMeeting &&
                  formik.values.preBiddingMeeting.time
                    ? dayjs(formik.values.preBiddingMeeting.time, 'h:mm a')
                    : undefined,
                onChange: (time, timeString) => {
                  formik.setFieldValue(
                    'preBiddingMeeting.time',
                    timeString as string
                  );
                },
                showNow: false,
                onBlur: () =>
                  formik.setFieldTouched('preBiddingMeeting.time', true),
              }}
              hasError={
                // @ts-ignore
                formik.touched.preBiddingMeeting?.time &&
                Boolean((formik.errors.preBiddingMeeting as any)?.time)
              }
              errorMessage={
                // @ts-ignore
                formik.errors.preBiddingMeeting?.time
              }
            />
          </div>
        </div>
        <TextAreaComponent
          label=""
          name="instruction"
          placeholder="Meeting Instructions"
          field={{
            value: formik.values.preBiddingMeeting?.instruction,
            onChange: (e) =>
              formik.setFieldValue(
                'preBiddingMeeting.instruction',
                e.target.value
              ),
            onBlur: () =>
              formik.setFieldTouched('preBiddingMeeting.instruction', true),
          }}
          hasError={
            // @ts-ignore
            formik.touched.preBiddingMeeting?.instruction &&
            Boolean((formik.errors.preBiddingMeeting as any)?.instruction)
          }
          errorMessage={
            // @ts-ignore
            formik.errors.preBiddingMeeting?.instruction
          }
        />
      </div>
    );
  }
  return null;
}
