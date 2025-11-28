import { Formik, Form } from 'formik';
import TertiaryHeading from 'src/components/Headings/Tertiary';
import { bg_style } from 'src/components/TailwindVariables';
import FormControl from 'src/components/FormControl';

import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import * as Yup from 'yup';
import {
  CreatePromoType,
  promoCodeService,
} from 'src/services/promo-code.service';
import { Skeleton } from 'antd';
import { IResponseInterface } from 'src/interfaces/api-response.interface';
import { IPromoCode } from 'src/interfaces/promo-code.interface';

const initialValues = {
  promoCode: '',
  type: 'percentage',
  discount: 0,
  quantity: 30,
  duration: 1,
};

const CreatePromoCodeSchema = Yup.object().shape({
  promoCode: Yup.string()
    .max(8, ' Promo Code must be less than 8 characters')
    .required('Promo Code is required'),
  type: Yup.string().required('Type is required'),
  discount: Yup.number().min(1).required('Discount is required'),
  quantity: Yup.number().required('Quantity is required'),
  duration: Yup.number().required('Duration is required'),
});

export function ViewPromoCodePage() {
  const params = useParams<{ id: string }>();

  const promoQuery = useQuery<IResponseInterface<IPromoCode>>(
    ['getPromo', params.id],
    () => {
      return promoCodeService.httpGetPromo(params.id!);
    }
  );

  function submitHandler(values: IPromoCode | CreatePromoType) {}

  if (promoQuery.isLoading) {
    return <Skeleton />;
  }

  return (
    <section className="p-16 py-4 rounded-xl">
      <div className={`${bg_style} p-5 border border-silverGray`}>
        <div className="max-w-[850px]">
          <TertiaryHeading title="Promo Code" className="text-graphiteGray" />

          <Formik
            initialValues={
              promoQuery.data
                ? (promoQuery.data.data as CreatePromoType)
                : (initialValues as CreatePromoType)
            }
            validationSchema={CreatePromoCodeSchema}
            onSubmit={submitHandler}
          >
            {({ handleSubmit, errors, setFieldValue, values }) => {
              return (
                <Form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-y-6 gap-x-4 mt-8"
                >
                  <div>
                    <FormControl
                      control="input"
                      type="text"
                      label="Promo Code"
                      placeholder="Promo Code"
                      name="promoCode"
                      disabled
                    />
                    {errors.promoCode ? (
                      <p className="text-red-500 text-sm">{errors.promoCode}</p>
                    ) : null}
                  </div>
                  <div>
                    <FormControl
                      control="select"
                      label="Type"
                      placeholder="Type"
                      name="type"
                      options={[
                        { value: 'percentage', label: 'Percentage' },
                        { value: 'dollar', label: '$' },
                      ]}
                      disabled
                    />
                    {errors.type ? (
                      <p className="text-red-500 text-sm">{errors.type}</p>
                    ) : null}
                  </div>
                  <div>
                    <FormControl
                      control="input"
                      type="number"
                      label="Discount Value"
                      placeholder="Discount Value"
                      disabled
                      name="discount"
                      min={1}
                    />
                    {errors.discount ? (
                      <p className="text-red-500 text-sm">{errors.discount}</p>
                    ) : null}
                  </div>

                  <div>
                    <FormControl
                      control="input"
                      type="number"
                      label="Quantity"
                      placeholder="Quantity"
                      disabled
                      name="quantity"
                      min={1}
                    />
                    {errors.quantity ? (
                      <p className="text-red-500 text-sm">{errors.quantity}</p>
                    ) : null}
                  </div>

                  <div>
                    <FormControl
                      control="select"
                      label="Quantity"
                      disabled
                      placeholder="Quantity"
                      name="duration"
                      options={[
                        { value: 1, label: '1' },
                        { value: 2, label: '2' },
                        { value: 3, label: '3' },
                        { value: 4, label: '4' },
                        { value: 5, label: '5' },
                        { value: 6, label: '6' },
                        { value: 7, label: '7' },
                        { value: 8, label: '8' },
                        { value: 9, label: '9' },
                        { value: 10, label: '10' },
                        { value: 0, label: 'Unlimited' },
                      ]}
                    />
                    {errors.duration ? (
                      <p className="text-red-500 text-sm">{errors.duration}</p>
                    ) : null}
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </section>
  );
}
