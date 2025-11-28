import { Popups } from 'src/pages/Bid-Management/components/Popups';
import CustomButton from '../CustomButton/button';
import WhiteButton from '../CustomButton/white';
import ModalComponent from '../modal';
import { InputComponent } from '../CustomInput/Input';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const ValidationSchema = Yup.object().shape({
  width: Yup.number()
    .min(320, 'Minimum width is 320')
    .max(680, 'Maximum width is 680')
    .required('Width is required'),
  height: Yup.number()
    .min(180, 'Minimum height is 180')
    .max(720, 'Maximum height is 720')
    .required('Height is required'),
  url: Yup.string()
    .test('url', (value) => {
      if (!value) return false; // Allow empty values, adjust if necessary
      const urlRegex = /^https:\/\/www\.youtube\.com\/.*/;
      return urlRegex.test(value);
    })
    .required('URL is required'),
});

export function GetYoutubeURL({
  open,
  setOpen,
  onSuccess,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess: (obj: { width: string; height: string; url: string }) => void;
}) {
  const formik = useFormik({
    initialValues: {
      width: '320',
      height: '180',
      url: '',
    },
    onSubmit: (values) => {
      onSuccess(values);
    },
    validationSchema: ValidationSchema,
  });

  return (
    <ModalComponent
      open={open}
      setOpen={setOpen}
      title="Add Youtube URL"
      width="w-[600px]"
    >
      <Popups title="Add Youtube URL" onClose={() => setOpen(false)}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <InputComponent
              label="Width"
              placeholder="Width"
              name="width"
              type="number"
              field={{
                value: formik.values.width ? formik.values.width : undefined,
                onChange: formik.handleChange,
                onBlur: formik.handleBlur,
                min: 320,
                max: 1024,
              }}
              hasError={formik.touched.width && Boolean(formik.errors.width)}
              errorMessage={
                formik.touched.width && formik.errors.width
                  ? formik.errors.width
                  : undefined
              }
            />

            <InputComponent
              label="Height"
              placeholder="Height"
              name="height"
              type="text"
              field={{
                value: formik.values.height ? formik.values.height : undefined,
                onChange: formik.handleChange,
                onBlur: formik.handleBlur,
                min: 180,
                max: 720,
              }}
              hasError={formik.touched.height && Boolean(formik.errors.height)}
              errorMessage={
                formik.touched.height && formik.errors.height
                  ? formik.errors.height
                  : undefined
              }
            />

            <div className="col-span-2">
              <InputComponent
                label="URL"
                placeholder="URL"
                name="url"
                type="text"
                field={{
                  value: formik.values.url ? formik.values.url : undefined,
                  onChange: formik.handleChange,
                  onBlur: formik.handleBlur,
                }}
                hasError={formik.touched.url && Boolean(formik.errors.url)}
                errorMessage={
                  formik.touched.url && formik.errors.url
                    ? formik.errors.url
                    : undefined
                }
              />
            </div>
          </div>

          <div className="flex justify-end items-center">
            <WhiteButton
              text="Cancel"
              className="!mr-3 !w-fit"
              onClick={() => setOpen(false)}
            />
            <CustomButton
              text="Submit"
              className="!w-fit"
              onClick={formik.handleSubmit}
            />
          </div>
        </div>
      </Popups>
    </ModalComponent>
  );
}
