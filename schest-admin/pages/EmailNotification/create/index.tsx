import { useFormik } from 'formik';
import { EmailNotificationForm } from '../components/EmailNotificationForm';
import emailNotifiicationService from 'src/services/email-notifiication.service';
import { useLayoutEffect, useState } from 'react';
import * as Yup from 'yup';
import { USER_ROLE_ENUM } from 'src/constants/roles.constants';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { Routes } from 'src/pages/Plans/utils';
import { useSelector } from 'react-redux';
import { selectToken } from 'src/redux/authSlices/auth.selector';
import { HttpService } from 'src/services/base.service';
import { EmailPreview } from '../components/preview';

const ValidationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  message: Yup.string().required('Message is required'),
  roles: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one role is required')
    .required('Roles are required'),
});

export function CreateEmailNotificationPage() {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const token = useSelector(selectToken);

  useLayoutEffect(() => {
    if (token) {
      HttpService.setToken(token);
    }
  }, [token]);
  const formik = useFormik({
    initialValues: {
      title: '',
      roles: [] as any[],
      message: '',
      type: 'custom' as 'custom' | 'marketing',
      invitees: [] as string[],
      cc: [] as string[],
    },
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await emailNotifiicationService.httpCreate(values);
        if (response.data) {
          toast.success('Email notification created successfully');
          navigate(Routes.Email_Notification.List);
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(err.response?.data?.message);
      } finally {
        setIsLoading(false);
      }
    },
    validationSchema: ValidationSchema,
  });
  return (
    <div className="grid grid-cols-2 gap-2">
      <EmailNotificationForm
        formTitle="Create Email Notification"
        isLoading={isLoading}
        formik={formik}
      />
      <EmailPreview formik={formik} />
    </div>
  );
}
