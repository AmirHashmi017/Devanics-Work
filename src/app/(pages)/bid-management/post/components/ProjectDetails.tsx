import { InputComponent } from '@/app/component/customInput/Input';
import { SelectComponent } from '@/app/component/customSelect/Select.component';
import { DateInputComponent } from '@/app/component/cutomDate/CustomDateInput';
import TertiaryHeading from '@/app/component/headings/tertiary';
import { TextAreaComponent } from '@/app/component/textarea';
import { IBidManagement } from '@/app/interfaces/bid-management/bid-management.interface';
import type { FormikProps } from 'formik';
import {
  bidBuildingUse,
  bidDurationType,
  bidProjectTypes,
  bidStages,
} from './data';
import { dayjs } from '@/app/utils/date.utils';
import { useCurrencyFormatter } from '@/app/hooks/useCurrencyFormatter';

type Props = {
  children?: React.ReactNode;
  formik: FormikProps<IBidManagement>;
};

export function PostProjectDetails({ formik, children }: Props) {
  const currency = useCurrencyFormatter({ currency: formik.values.currency });
  return (
    <div className=" bg-white shadow-[0_4px_30px_0px_#2E2D740D] rounded-xl border p-4">
      <TertiaryHeading
        title="Project Details"
        className="text-[20px] leading-[30px]"
      />

      <div className=" mt-4 space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <SelectComponent
              label="Project Type"
              name="projectType"
              placeholder="Project Type"
              field={{
                options: bidProjectTypes,
                mode: 'multiple',
                showSearch: true,
                defaultValue: formik.values.projectType,
                onChange(value: string[]) {
                  formik.setFieldValue('projectType', value);
                },
                onClear() {
                  formik.setFieldValue('projectType', '');
                },
                onBlur: formik.handleBlur,
              }}
              hasError={
                formik.touched.projectType && Boolean(formik.errors.projectType)
              }
              errorMessage={
                formik.touched.projectType && formik.errors.projectType
                  ? (formik.errors.projectType as string)
                  : ''
              }
            />
          </div>

          <div>
            <SelectComponent
              label="Project Building Use"
              name="projectBuildingUse"
              placeholder="Project Building Use"
              field={{
                options: bidBuildingUse,
                mode: 'multiple',
                showSearch: true,
                defaultValue: formik.values.projectBuildingUse,
                onChange(value: string[]) {
                  formik.setFieldValue('projectBuildingUse', value);
                },
                onClear() {
                  formik.setFieldValue('projectBuildingUse', '');
                },
                onBlur: formik.handleBlur,
              }}
              hasError={
                formik.touched.projectBuildingUse &&
                Boolean(formik.errors.projectBuildingUse)
              }
              errorMessage={
                formik.touched.projectBuildingUse &&
                formik.errors.projectBuildingUse
                  ? (formik.errors.projectBuildingUse as string)
                  : ''
              }
            />
          </div>
        </div>

        <SelectComponent
          label="Stage"
          name="stage"
          placeholder="Stage"
          field={{
            options: bidStages,
            showSearch: true,
            value: formik.values.stage,
            onChange: (value) => formik.setFieldValue('stage', value),
            onBlur: formik.handleBlur,
            allowClear: true,
            onClear() {
              formik.setFieldValue('stage', '');
            },
          }}
          hasError={formik.touched.stage && Boolean(formik.errors.stage)}
          errorMessage={
            formik.touched.stage && formik.errors.stage
              ? formik.errors.stage
              : ''
          }
        />

        <div className="grid grid-cols-2 gap-2">
          <DateInputComponent
            label="Estimated Start Date"
            name="estimatedStartDate"
            fieldProps={{
              value: formik.values.estimatedStartDate
                ? dayjs(formik.values.estimatedStartDate)
                : undefined,
              onChange: (v, dateString: any) => {
                formik.setFieldValue('estimatedStartDate', dateString);

                //  set estimatedCompletionDate to estimatedStartDate +1 if it's value is less than estimatedStartDate
                if (formik.values.estimatedCompletionDate) {
                  if (
                    dayjs(formik.values.estimatedCompletionDate).isBefore(
                      dayjs(dateString)
                    )
                  ) {
                    formik.setFieldValue(
                      'estimatedCompletionDate',
                      dayjs(dateString).add(1, 'day').format('YYYY-MM-DD')
                    );
                  }
                }
              },
              onBlur: formik.handleBlur,
              disabledDate: (current) => {
                return dayjs(current).isBefore(dayjs().subtract(1, 'day'));
              },
            }}
            hasError={
              formik.touched.estimatedStartDate &&
              Boolean(formik.errors.estimatedStartDate)
            }
            errorMessage={
              formik.touched.estimatedStartDate &&
              formik.errors.estimatedStartDate
                ? formik.errors.estimatedStartDate
                : ''
            }
          />

          <DateInputComponent
            label="Bid Due Date"
            name="bidDueDate"
            fieldProps={{
              value: formik.values.bidDueDate
                ? dayjs(formik.values.bidDueDate)
                : undefined,
              onChange: (v, dateString) => {
                formik.setFieldValue('bidDueDate', dateString);
              },
              onBlur: formik.handleBlur,
              disabledDate: (current) => {
                return dayjs(current).isBefore(dayjs().subtract(1, 'day'));
              },
            }}
            hasError={
              formik.touched.bidDueDate && Boolean(formik.errors.bidDueDate)
            }
            errorMessage={
              formik.touched.bidDueDate && formik.errors.bidDueDate
                ? formik.errors.bidDueDate
                : ''
            }
          />

          <DateInputComponent
            label="Estimated Completion Date"
            name="estimatedCompletionDate"
            fieldProps={{
              value: formik.values.estimatedCompletionDate
                ? dayjs(formik.values.estimatedCompletionDate)
                : undefined,
              onChange: (v, dateString) => {
                formik.setFieldValue('estimatedCompletionDate', dateString);
              },
              onBlur: formik.handleBlur,
              disabledDate: (current) => {
                if (formik.values.estimatedStartDate) {
                  return current < dayjs(formik.values.estimatedStartDate);
                }
                return dayjs(current).isBefore(dayjs().subtract(1, 'day'));
              },
            }}
            hasError={
              formik.touched.estimatedCompletionDate &&
              Boolean(formik.errors.estimatedCompletionDate)
            }
            errorMessage={
              formik.touched.estimatedCompletionDate &&
              formik.errors.estimatedCompletionDate
                ? formik.errors.estimatedCompletionDate
                : ''
            }
          />

          <InputComponent
            label="Square Footage"
            name="squareFootage"
            placeholder="Square Footage"
            type="text"
            field={{
              value: formik.values.squareFootage,
              onChange: formik.handleChange,
              onBlur: formik.handleBlur,
            }}
            hasError={
              formik.touched.squareFootage &&
              Boolean(formik.errors.squareFootage)
            }
            errorMessage={
              formik.touched.squareFootage && formik.errors.squareFootage
                ? formik.errors.squareFootage
                : ''
            }
          />

          <InputComponent
            label="Project Value"
            name="projectValue"
            placeholder="Project Value"
            type="number"
            field={{
              value: formik.values.projectValue,
              onChange: (e) =>
                formik.setFieldValue('projectValue', `${e.target.value}`),
              onBlur: formik.handleBlur,
              prefix: currency.currency.symbol,
            }}
            hasError={
              formik.touched.projectValue && Boolean(formik.errors.projectValue)
            }
            errorMessage={
              formik.touched.projectValue && formik.errors.projectValue
                ? formik.errors.projectValue
                : ''
            }
          />

          <InputComponent
            label="Duration"
            name="estimatedDuration"
            placeholder="Duration"
            type=""
            field={{
              type: 'number',
              styles: {
                input: {
                  padding: 10,
                },
              },
              value: formik.values.estimatedDuration,
              onChange: (e) =>
                formik.setFieldValue('estimatedDuration', `${e.target.value}`),
              onBlur: formik.handleBlur,
              className: '!py-1.5',
              addonAfter: (
                <SelectComponent
                  label=""
                  name="durationType"
                  field={{
                    className: '!w-28 !pb-1',
                    options: bidDurationType,
                    dropdownStyle: {
                      width: 100,
                    },
                    defaultValue: 'days',
                    value: formik.values.durationType,
                    onChange(value) {
                      formik.setFieldValue('durationType', value);
                    },
                  }}
                  hasError={
                    formik.touched.durationType &&
                    Boolean(formik.errors.durationType)
                  }
                  errorMessage={
                    formik.touched.durationType && formik.errors.durationType
                      ? formik.errors.durationType
                      : ''
                  }
                />
              ),
            }}
            hasError={
              formik.touched.estimatedDuration &&
              Boolean(formik.errors.estimatedDuration)
            }
            errorMessage={
              formik.touched.estimatedDuration &&
              formik.errors.estimatedDuration
                ? formik.errors.estimatedDuration
                : ''
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <TextAreaComponent
            label="Project Description"
            name="description"
            placeholder="Enter Project Description"
            field={{
              rows: 5,
              value: formik.values.description,
              onChange: (e) =>
                formik.setFieldValue('description', e.target.value),
              onBlur: formik.handleBlur,
            }}
            hasError={
              formik.touched.description && Boolean(formik.errors.description)
            }
            errorMessage={
              formik.touched.description &&
              formik.touched.description &&
              formik.errors.description
                ? formik.errors.description
                : ''
            }
          />

          <TextAreaComponent
            label="Special Instructions"
            name="specialInstructions"
            placeholder="Enter Special Instructions"
            field={{
              rows: 5,
              value: formik.values.specialInstructions,
              onChange: (e) =>
                formik.setFieldValue('specialInstructions', e.target.value),
              onBlur: formik.handleBlur,
            }}
            hasError={
              formik.touched.specialInstructions &&
              Boolean(formik.errors.specialInstructions)
            }
            errorMessage={
              formik.touched.specialInstructions &&
              formik.errors.specialInstructions
                ? formik.errors.specialInstructions
                : ''
            }
          />
        </div>
      </div>
      {children}
    </div>
  );
}
