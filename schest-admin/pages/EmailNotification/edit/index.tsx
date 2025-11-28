import { AxiosError } from 'axios';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import SkeletonLoader from 'src/components/loader/Skeleton';
import NoData from 'src/components/noData';
import { IEmailNotification } from 'src/interfaces/email-notification.interface';
import { Routes } from 'src/pages/Plans/utils';
import { selectToken } from 'src/redux/authSlices/auth.selector';
import { HttpService } from 'src/services/base.service';
import emailNotifiicationService from 'src/services/email-notifiication.service';
import { EmailNotificationForm } from '../components/EmailNotificationForm';
import * as Yup from 'yup';
import { USER_ROLE_ENUM } from 'src/constants/roles.constants';
import { useFormik } from 'formik';
import { EmailPreview } from '../components/preview';

const ValidationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  message: Yup.string().required('Message is required'),
  roles: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one role is required')
    .required('Roles are required'),
});

export function EditEmailNotificationPage() {
  const params = useParams<{ id: string }>();
  const [isloading, setIsLoading] = useState(false);
  const token = useSelector(selectToken);
  const [notification, setNotification] = useState<null | IEmailNotification>(
    null
  );
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useLayoutEffect(() => {
    if (token) {
      HttpService.setToken(token);
    }
  }, [token]);
  useEffect(() => {
    if (params.id) {
      getEmailNotificationById(params.id);
    }
  }, [params.id]);

  const formik = useFormik({
    initialValues: notification
      ? {
          title: notification.title,
          roles: notification.roles,
          message: notification.message,
          type: notification?.type,
          invitees: notification?.invitees,
          cc: notification?.cc ?? [],
        }
      : {
          title: '',
          roles: [] as any[],
          message: '',
          type: 'custom' as 'custom' | 'marketing',
          invitees: [] as string[],
          cc: [] as string[],
        },
    onSubmit: async (values) => {
      if (!notification) {
        toast.error('No email notification found');
        return;
      }
      setIsSubmitting(true);
      try {
        const response =
          await emailNotifiicationService.httpUpdateEmailNotification(
            notification._id,
            values
          );
        if (response.data) {
          toast.success('Email notification updated successfully');
          navigate(Routes.Email_Notification.List);
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(err.response?.data?.message);
      } finally {
        setIsSubmitting(false);
      }
    },
    validationSchema: ValidationSchema,
    enableReinitialize: notification ? true : false,
  });

  async function getEmailNotificationById(id: string) {
    setIsLoading(true);
    try {
      const res =
        await emailNotifiicationService.httpGetEmailNotificationById(id);
      if (res.data) {
        setNotification(res.data);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data.message);
    } finally {
      setIsLoading(false);
    }
  }

  if (isloading) {
    return (
      <div>
        <SkeletonLoader />
        <SkeletonLoader />
        <SkeletonLoader />
        <SkeletonLoader />
        <SkeletonLoader />
        <SkeletonLoader />
      </div>
    );
  }

  if (!notification) {
    return (
      <NoData
        title="Email Notification"
        description="Email Notification not found. Please try again"
        btnText="Go back"
        link={Routes.Email_Notification.List}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <EmailNotificationForm
        formTitle="Update Email Notification"
        isLoading={isSubmitting}
        formik={formik}
      />
      <EmailPreview formik={formik} />
    </div>
  );
}
