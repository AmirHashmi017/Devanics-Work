import { Popups } from '@/app/(pages)/bid-management/components/Popups';
import ModalComponent from '../modal';
import { SelectComponent } from '../customSelect/Select.component';
import { useFormik } from 'formik';
import { getCrmItemsThunk } from '@/redux/crm/crm.thunk';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { ICrmItem } from '@/app/interfaces/crm/crm.interface';
import CustomButton from '../customButton/button';
import WhiteButton from '../customButton/white';
import { ListCrmItems } from '@/app/(pages)/crm/components/ListCRMItems';
import TertiaryHeading from '../headings/tertiary';
import crmService from '@/app/services/crm/crm.service';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  client?: string;
  architect?: string;
};

const ValidationSchema = Yup.object().shape({
  client: Yup.string().required('Client is required'),
  architect: Yup.string().required('Architect is required'),
});

export function CRMSendSMS({
  open,
  onClose,
  architect,
  client,
  title = 'Send SMS',
}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const crmState = useSelector((state: RootState) => state.crm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getCrmItemsThunk({ module: 'clients' }));
    dispatch(getCrmItemsThunk({ module: 'architects' }));
    dispatch(getCrmItemsThunk({ module: 'contractors' }));
    dispatch(getCrmItemsThunk({ module: 'partners' }));
    dispatch(getCrmItemsThunk({ module: 'vendors' }));
    dispatch(getCrmItemsThunk({ module: 'subcontractors' }));
  }, []);

  const formik = useFormik({
    initialValues: {
      client: client ?? '',
      architect: architect ?? '',
      others: [] as string[],
    },
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await crmService.httpSendSMS(values);
        if (response.data) {
          toast.success('SMS sent successfully');
          onClose();
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(err.response?.data.message);
      } finally {
        setLoading(false);
      }
    },
    validationSchema: ValidationSchema,
  });

  return (
    <ModalComponent open={open} setOpen={onClose}>
      <Popups title={title} onClose={onClose}>
        <div className="space-y-3">
          <div className="mt-2">
            <SelectComponent
              label="Client"
              name="client"
              placeholder="Select Client"
              field={{
                value: formik.values.client ? formik.values.client : undefined,
                onChange: (val) => formik.setFieldValue('client', val),
                onBlur: formik.handleBlur,
                loading: crmState.loading,
                options: crmState.clients.map((item) => {
                  const client = item as unknown as ICrmItem;
                  return {
                    label: `${client.firstName} ${client.lastName} (${client.phone})`,
                    value: client._id,
                  };
                }),
              }}
              hasError={formik.touched.client && !!formik.errors.client}
              errorMessage={
                formik.touched.client && formik.errors.client
                  ? formik.errors.client
                  : ''
              }
            />
          </div>

          <div className="mt-2">
            <SelectComponent
              label="Architect"
              name="architect"
              placeholder="Select architect"
              field={{
                value: formik.values.architect
                  ? formik.values.architect
                  : undefined,
                onChange: (val) => formik.setFieldValue('architect', val),
                onBlur: formik.handleBlur,
                loading: crmState.loading,
                options: crmState.architects.map((item) => {
                  const architect = item as unknown as ICrmItem;
                  return {
                    label: `${architect.firstName} ${architect.lastName} (${architect.phone})`,
                    value: architect._id,
                  };
                }),
              }}
              hasError={formik.touched.architect && !!formik.errors.architect}
              errorMessage={
                formik.touched.architect && formik.errors.architect
                  ? formik.errors.architect
                  : ''
              }
            />
          </div>

          <div className="space-y-0.5">
            <TertiaryHeading title="Other" />
            <ListCrmItems
              onItemClick={(item) => {
                if (formik.values.others.includes(item._id)) {
                  formik.setFieldValue(
                    'others',
                    formik.values.others.filter((id) => id !== item._id)
                  );
                } else {
                  formik.setFieldValue('others', [
                    ...formik.values.others,
                    item._id,
                  ]);
                }
              }}
              selectedItems={formik.values.others}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <WhiteButton text="Cancel" className="!w-fit" onClick={onClose} />
            <CustomButton
              text="Send SMS Now"
              className="!w-fit"
              onClick={() => formik.handleSubmit()}
              isLoading={loading}
              loadingText="Sending..."
            />
          </div>
        </div>
      </Popups>
    </ModalComponent>
  );
}
