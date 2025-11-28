import dayjs from 'dayjs';
import type { FormikProps } from 'formik';
import { DateInputComponent } from 'src/components/customDate/CustomDateInput';
import { TimeInputComponent } from 'src/components/customDate/CustomTimeInput';
import { IBidManagement } from 'src/interfaces/bid-management/bid-management.interface';

export function RfiDeadline({
  formik,
}: {
  formik: FormikProps<IBidManagement>;
}) {
  if (!formik.values.rfiDeadline?.isChecked) return null;
  return (
    <div className="space-y-2 mt-3">
      <div className="flex items-center space-x-3">
        <div>
          <DateInputComponent
            label=""
            name="rfiDeadline.date"
            placeholder="Select Date"
            fieldProps={{
              value:
                formik.values.rfiDeadline && formik.values.rfiDeadline.date
                  ? dayjs(formik.values.rfiDeadline.date)
                  : undefined,
              onChange: (date, dateString) => {
                formik.setFieldValue('rfiDeadline.date', dateString as string);
              },
              onBlur: formik.handleBlur,
            }}
            hasError={
              // @ts-ignore
              formik.touched.rfiDeadline?.date &&
              Boolean((formik.errors.rfiDeadline as any)?.date)
            }
            errorMessage={
              // @ts-ignore
              formik.errors.rfiDeadline?.date
            }
          />
        </div>
        <div>
          <TimeInputComponent
            label=""
            name="rfiDeadline.time"
            placeholder="Select Time"
            fieldProps={{
              use12Hours: true,
              format: 'h:mm a',
              value:
                formik.values.rfiDeadline && formik.values.rfiDeadline.time
                  ? dayjs(formik.values.rfiDeadline.time, 'h:mm a')
                  : undefined,
              onChange: (time, timeString) => {
                formik.setFieldValue('rfiDeadline.time', timeString as string);
              },
              showNow: false,
              onBlur: formik.handleBlur,
            }}
            hasError={
              // @ts-ignore
              formik.touched.rfiDeadline?.time &&
              Boolean((formik.errors.rfiDeadline as any)?.time)
            }
            errorMessage={
              // @ts-ignore
              formik.errors.rfiDeadline?.time
            }
          />
        </div>
      </div>
    </div>
  );
}
