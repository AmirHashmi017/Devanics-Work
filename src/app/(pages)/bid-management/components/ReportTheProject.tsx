import ModalComponent from '@/app/component/modal';
import { Popups } from './Popups';
import { SelectComponent } from '@/app/component/customSelect/Select.component';
import { TextAreaComponent } from '@/app/component/textarea';
import CustomButton from '@/app/component/customButton/button';
import WhiteButton from '@/app/component/customButton/white';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { bidManagementService } from '@/app/services/bid-management.service';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useState } from 'react';

interface ReportTheProjectProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  project: string;
}

const REASON_TYPES = [
  'Spam or Fake Project',
  'Offensive or Inappropriate Content',
  'Misleading Information',
  'Violates Terms and Conditions',
  'Others',
];

const ValidationSchema = Yup.object().shape({
  reasonType: Yup.array()
    .of(Yup.string().min(1, 'Reason Type is required'))
    .required('Reason Type is required'),
  reason: Yup.string().required('Reason is required'),
});

export function ReportTheProjectModal({
  onClose,
  open,
  project,
  title = 'Report the project',
}: ReportTheProjectProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formik = useFormik({
    initialValues: {
      reasonType: [] as string[],
      reason: '',
      project,
    },
    async onSubmit(values, formikHelpers) {
      setIsSubmitting(true);
      try {
        const response =
          await bidManagementService.httpReportTheBidProject(values);
        if (response.data) {
          toast.success(response.message);
          formikHelpers.resetForm();
          onClose();
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(
          err.response?.data.message || 'Unable to report the project'
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    validationSchema: ValidationSchema,
  });

  return (
    <ModalComponent open={open} setOpen={onClose} width="50%">
      <Popups title={title} onClose={onClose}>
        <div className="space-y-3">
          <SelectComponent
            label="Reason Type"
            name="reasonType"
            field={{
              options: REASON_TYPES.map((reasonType) => ({
                label: reasonType,
                value: reasonType,
              })),
              mode: 'multiple',
              showSearch: true,
              defaultValue: formik.values.reasonType,
              onChange(value: string[]) {
                formik.setFieldValue('reasonType', value);
              },
              onClear() {
                formik.setFieldValue('reasonType', []);
              },
              onBlur: formik.handleBlur,
            }}
            placeholder="Reason Type"
            hasError={
              formik.touched.reasonType && Boolean(formik.errors.reasonType)
            }
            errorMessage={
              formik.touched.reasonType && formik.errors.reasonType
                ? formik.errors.reasonType.toString()
                : ''
            }
          />

          <TextAreaComponent
            label="Reason"
            name="reason"
            placeholder="Reason"
            field={{
              value: formik.values.reason,
              onChange: formik.handleChange,
              onBlur: formik.handleBlur,
            }}
            hasError={formik.touched.reason && Boolean(formik.errors.reason)}
            errorMessage={
              formik.touched.reason && formik.errors.reason
                ? formik.errors.reason.toString()
                : ''
            }
          />

          <div className="flex justify-end space-x-2">
            <WhiteButton text="Cancel" onClick={onClose} className="!w-fit" />
            <CustomButton
              text="Submit"
              className="!w-fit"
              isLoading={isSubmitting}
              loadingText="Submitting..."
              onClick={() => formik.handleSubmit()}
            />
          </div>
        </div>
      </Popups>
    </ModalComponent>
  );
}
