import CustomButton from '@/app/component/customButton/button';
// import WhiteButton from '@/app/component/customButton/white';
import QuaternaryHeading from '@/app/component/headings/quaternary';
import TertiaryHeading from '@/app/component/headings/tertiary';
import { CloseOutlined } from '@ant-design/icons';
import * as Yup from 'yup';
import { Checkbox } from 'antd';
import { Formik, Form } from 'formik';
import { IProject } from '@/app/interfaces/schedule/project.schedule.interface';
import FormControl from '@/app/component/formControl';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

type Props = {
  initialValues: IProject;
  onClose: () => void;
  // onCancel: () => void;
  isFormSubmitLoading: Boolean;
  onConfirm: (values: IProject) => void;
};

const setWorkWeekValidationSchema = Yup.object({
  hoursPerDay: Yup.string().required('Hour per day  is required!'),
  // regularWorkingDays: Yup.array()
  //   .of(
  //     Yup.object().shape({
  //       isChecked: Yup.boolean().required('Checkbox status is required'),
  //       hours: Yup.number()
  //         .required('Hours are required')
  //         .min(1, 'Hours must be a positive number'),
  //     })
  //   )
});

export function SetWorkWeek({
  onClose,
  initialValues,
  isFormSubmitLoading,
  onConfirm,
}: Props) {
  const submitHandler = (values: IProject) => {
    onConfirm(values);
  };

  return (
    <div className="px-4 py-2 bg-white border border-solid border-elboneyGray rounded-[4px] z-50">
      <div className="flex  py-2.5 justify-between">
        <TertiaryHeading title="Set Workweek" className="text-graphiteGray" />
        <CloseOutlined
          className="cursor-pointer"
          style={{ width: '24px', height: '24px' }}
          onClick={onClose}
        />
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={setWorkWeekValidationSchema}
        onSubmit={submitHandler}
      >
        {({ handleSubmit, setFieldValue, errors, values }) => {
          return (
            <Form name="basic" autoComplete="off" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-3">
                <FormControl
                  control="input"
                  label="Hours per Day"
                  type="number"
                  min={0}
                  name="hoursPerDay"
                  placeholder="Set number of hours per day"
                />

                <div className="grid grid-cols-6 gap-4 items-center">
                  <QuaternaryHeading title=" Regular Working Days" />
                  <QuaternaryHeading title="Hours" />
                </div>

                {initialValues?.regularWorkingDays?.map(
                  (item: any, index: number) => {
                    return (
                      <div
                        className="grid grid-cols-12 gap-4 items-center"
                        key={index}
                      >
                        <div className="col-span-2">
                          <Checkbox
                            defaultChecked={item.isChecked}
                            name={`regularWorkingDays[${index}].isChecked`}
                            onChange={(e) => {
                              setFieldValue(
                                `regularWorkingDays[${index}].isChecked`,
                                e.target.checked
                              );
                              if (e.target.checked) {
                                setFieldValue(
                                  `regularWorkingDays[${index}].hours`,
                                  values.hoursPerDay
                                );
                              }
                            }}
                            className={twMerge(
                              clsx(
                                `border ${
                                  errors.regularWorkingDays
                                    ? 'border-red-500'
                                    : 'border-gray-400'
                                } border w-full px-3.5 py-[7px] mt-1.5 rounded-lg text-graphiteGray text-sm font-normal leading-6`
                              )
                            )}
                          >
                            {item.day}
                          </Checkbox>
                        </div>
                        <div className="col-span-3">
                          <FormControl
                            control="input"
                            type="number"
                            name={`regularWorkingDays[${index}].hours`}
                            placeholder="Set number of hours per day"
                          />
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
              <div className="flex justify-end space-x-4 mt-2">
                {/* <WhiteButton text="Skip" className="!w-40" onClick={onCancel} /> */}
                <CustomButton
                  isLoading={isFormSubmitLoading}
                  type="submit"
                  text="Setup"
                  className="!w-40"
                />
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
