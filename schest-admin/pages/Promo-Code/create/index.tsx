import { useFormik } from 'formik';
import TertiaryHeading from 'src/components/Headings/Tertiary';
import { bg_style } from 'src/components/TailwindVariables';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import * as Yup from 'yup';
import {
  CreatePromoType,
  promoCodeService,
} from 'src/services/promo-code.service';
import { toast } from 'react-toastify';
import { PromoCodeForm } from '../components/PromoCodeForm';
import { Tabs } from 'antd';

const initialValues = {
  promoCode: '',
  type: 'dollar',
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

export function CreatePromoCodePage() {
  const navigate = useNavigate();
  const promoMutation = useMutation(
    ['createPromoCode'],
    (data: CreatePromoType) => {
      return promoCodeService.httpCreatePromo(data);
    },
    {
      onSuccess(res) {
        toast.success('Promo Code Created Successfully');
        navigate('/promo-code');
      },
      onError(err) {
        toast.error('Something went wrong');
      },
    }
  );

  const paymobPromoMutation = useMutation(
    ['createPromoCode'],
    (data: CreatePromoType) => {
      return promoCodeService.httpCreatePaymobPromo(data);
    },
    {
      onSuccess(res) {
        toast.success('Promo Code Created Successfully');
        navigate('/promo-code');
      },
      onError(err) {
        toast.error('Something went wrong');
      },
    }
  );

  async function submitHandler(values: CreatePromoType) {
    promoMutation.mutate({
      ...values,
      promoCode: values.promoCode.toUpperCase(),
    });
  }

  const stripeFormik = useFormik<CreatePromoType>({
    initialValues: {
      ...initialValues,
    } as CreatePromoType,
    onSubmit(values, formikHelpers) {
      submitHandler(values);
    },
    validationSchema: CreatePromoCodeSchema,
  });

  const paymobFormik = useFormik<CreatePromoType>({
    initialValues: {
      ...initialValues,
    } as CreatePromoType,
    onSubmit(values, formikHelpers) {
      paymobPromoMutation.mutate(values);
    },
    validationSchema: CreatePromoCodeSchema,
  });

  return (
    <section className="p-16 py-4 rounded-xl">
      <div className={`${bg_style} p-5 border border-silverGray`}>
        <div className="max-w-[850px]">
          <TertiaryHeading
            title="Create New Promo Code"
            className="text-graphiteGray"
          />

          <Tabs
            centered
            items={[
              {
                key: 'stripe',
                label: 'Stripe',
                children: (
                  <PromoCodeForm
                    formik={stripeFormik}
                    isLoading={promoMutation.isLoading}
                    btnText="Create Stripe Promo Code"
                  />
                ),
              },
              {
                key: 'paymob',
                label: 'Paymob',
                children: (
                  <PromoCodeForm
                    formik={paymobFormik}
                    isLoading={paymobPromoMutation.isLoading}
                    btnText="Create Paymob Promo Code"
                  />
                ),
              },
            ]}
          />

          {/* <Formik
            initialValues={initialValues as CreatePromoType}
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
                      suffix={
                        <p
                          className="text-[14px] select-none leading-[22px] text-[#EF9F28] underline cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            let promoCode = uuidv4();
                            promoCode = promoCode.slice(0, 8).toUpperCase();

                            setFieldValue('promoCode', promoCode);
                          }}
                        >
                          Generate Code
                        </p>
                      }
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
                      label="Duration"
                      placeholder="Duration"
                      name="duration"
                      options={[
                        { value: 1, label: '1 Month' },
                        { value: 2, label: '2 Month' },
                        { value: 3, label: '3 Month' },
                        { value: 4, label: '4 Month' },
                        { value: 5, label: '5 Month' },
                        { value: 6, label: '6 Month' },
                        { value: 7, label: '7 Month' },
                        { value: 8, label: '8 Month' },
                        { value: 9, label: '9 Month' },
                        { value: 10, label: '10 Month' },
                        { value: 0, label: 'Unlimited' },
                      ]}
                    />
                    {errors.duration ? (
                      <p className="text-red-500 text-sm">{errors.duration}</p>
                    ) : null}
                  </div>

                  <div className="flex justify-between gap-2 mt-6">
                    <span>
                      <CustomButton
                        text="Cancel"
                        className="!px-5 !py-3 !shadow-scenarySubdued !bg-white border !border-celestialGray !text-graphiteGray"
                        onClick={() => navigate('/ad-managment')}
                      />
                    </span>
                    <span>
                      <CustomButton
                        text="Create Promo Code"
                        className="!px-7 !py-3"
                        type="submit"
                        isLoading={promoMutation.isLoading}
                        loadingText="Creating Promo Code..."
                      />
                    </span>
                  </div>
                </Form>
              );
            }}
          </Formik> */}
        </div>
      </div>
    </section>
  );
}
