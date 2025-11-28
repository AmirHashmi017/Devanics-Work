import { FormikProps } from 'formik';
import { CreatePromoType } from 'src/services/promo-code.service';
import CustomButton from 'src/components/CustomButton/button';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { InputComponent } from 'src/components/CustomInput/Input';
import { SelectComponent } from 'src/components/customSelect/Select.component';

type Props = {
  formik: FormikProps<CreatePromoType>;
  isLoading?: boolean;
  btnText: string;
};

export function PromoCodeForm({ formik, isLoading, btnText }: Props) {
  const navigate = useNavigate();

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex flex-col gap-y-6 gap-x-4 mt-8"
    >
      <div>
        <InputComponent
          type="text"
          label="Promo Code"
          placeholder="Promo Code"
          name="promoCode"
          field={{
            value: formik.values.promoCode,
            onChange: formik.handleChange,
            onBlur: formik.handleBlur,
          }}
          suffix={
            <p
              className="text-[14px] select-none leading-[22px] text-[#EF9F28] underline cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                let promoCode = uuidv4();
                promoCode = promoCode.slice(0, 8).toUpperCase();

                formik.setFieldValue('promoCode', promoCode);
              }}
            >
              Generate Code
            </p>
          }
        />
        {formik.errors.promoCode ? (
          <p className="text-red-500 text-sm">{formik.errors.promoCode}</p>
        ) : null}
      </div>
      <div>
        <SelectComponent
          label="Type"
          placeholder="Type"
          name="type"
          field={{
            options: [
              { value: 'percentage', label: 'Percentage' },
              { value: 'dollar', label: 'Amount' },
            ],
            value: formik.values.type,
            onChange(value) {
              formik.setFieldValue('type', value);
            },
          }}
        />
        {formik.errors.type ? (
          <p className="text-red-500 text-sm">{formik.errors.type}</p>
        ) : null}
      </div>
      <div>
        <InputComponent
          type="number"
          label="Discount Value"
          placeholder="Discount Value"
          name="discount"
          field={{
            value: formik.values.discount,
            onChange: formik.handleChange,
            onBlur: formik.handleBlur,
          }}
        />
        {formik.errors.discount ? (
          <p className="text-red-500 text-sm">{formik.errors.discount}</p>
        ) : null}
      </div>
      <div>
        <InputComponent
          type="number"
          label="Quantity"
          placeholder="Quantity"
          name="quantity"
          field={{
            value: formik.values.quantity,
            onChange: formik.handleChange,
            onBlur: formik.handleBlur,
          }}
        />
        {formik.errors.quantity ? (
          <p className="text-red-500 text-sm">{formik.errors.quantity}</p>
        ) : null}
      </div>

      <div>
        <SelectComponent
          label="Duration"
          placeholder="Duration"
          name="duration"
          field={{
            options: [
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
            ],
            onChange(value, option) {
              formik.setFieldValue('duration', value);
            },
            onBlur: formik.handleBlur,
            value: formik.values.duration,
          }}
        />
        {formik.errors.duration ? (
          <p className="text-red-500 text-sm">{formik.errors.duration}</p>
        ) : null}
      </div>

      <div className="flex justify-between gap-2 mt-6">
        <span>
          <CustomButton
            text="Cancel"
            className="!px-5 !py-3 !shadow-scenarySubdued !bg-white border !border-celestialGray !text-graphiteGray"
            onClick={() => navigate('/promo-code')}
          />
        </span>
        <span>
          <CustomButton
            text={btnText}
            className="!px-7 !py-3"
            type="submit"
            isLoading={isLoading}
            loadingText="Creating Promo Code..."
          />
        </span>
      </div>
    </form>
  );
}
