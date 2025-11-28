import TertiaryHeading from '../../components/Headings/Tertiary';
import FormControl from 'src/components/FormControl';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import CustomButton from 'src/components/CustomButton/button';
import { bg_style, minHeading } from 'src/components/TailwindVariables';
import { useNavigate, useParams } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { IAdManagement, ICreateAd } from 'src/interfaces/ad.interface';
import { useCallback, useLayoutEffect, useState } from 'react';
import { byteConverter } from 'src/utils/byteConverter';
import { toast } from 'react-toastify';
import AwsS3 from 'src/utils/S3Intergration';
import { Image, Skeleton } from 'antd';
import { adService } from 'src/services/ad.service';

const initialValues = {
  clientName: '',
  duration: 0,
  expiryDate: '',
  startDate: '',
  imageURL: '',
};

const CreateAdSchema = Yup.object().shape({
  clientName: Yup.string().required('Client Name is required'),
  duration: Yup.number().required('Duration is required'),
  expiryDate: Yup.string().required('Expiry Date is required'),
  startDate: Yup.string().required('Start Date is required'),
  imageURL: Yup.string()
    .url('Image is not valid')
    .required('Image is required'),
});

const ViewAd = () => {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const [imageUploading, setImageUploading] = useState(false);
  const [ad, setAd] = useState<IAdManagement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAdHandler = useCallback(async () => {
    if (params.id) {
      const res = await adService.httpFindAdById(params.id);
      if (res.data?.ad) {
        setAd(res.data?.ad);
        setIsLoading(false);
      }
    }
  }, [params.id]);

  useLayoutEffect(() => {
    fetchAdHandler();
  }, []);

  const submitHandler = async (values: ICreateAd) => {};

  const UploadHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUploading(true);
    if (!e.target.files?.length) {
      setImageUploading(false);
      return;
    }
    if (
      e.target.files &&
      e.target.files[0] &&
      byteConverter(e.target.files[0].size, 'MB').size > 5
    ) {
      toast.warning('Cannot upload image more then 5 mb of size');
      setImageUploading(false);
      return;
    }

    try {
      const url = await new AwsS3(
        e.target.files![0],
        'documents/ads/'
      ).getS3URL();
      // setImageURL(url);
      return url;
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setImageUploading(false);
    }
  };
  if (isLoading) {
    return <Skeleton />;
  }

  return (
    <section className="p-16 py-4 rounded-xl">
      <div className={`${bg_style} p-5 border border-silverGray`}>
        <div className="max-w-[850px]">
          <TertiaryHeading
            title="Add Management"
            className="text-graphiteGray"
          />

          <Formik
            initialValues={ad ? ad : initialValues}
            validationSchema={CreateAdSchema}
            onSubmit={submitHandler}
          >
            {({ handleSubmit, errors, setFieldValue, values }) => {
              return (
                <Form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-y-6 gap-x-4 "
                >
                  <div>
                    <FormControl
                      control="input"
                      type="text"
                      label="Client Name"
                      placeholder="Client Name"
                      name="clientName"
                      disabled
                    />
                    {errors.clientName ? (
                      <p className="text-red-500 text-sm">
                        {errors.clientName}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <FormControl
                      control="input"
                      type="number"
                      label="Ad Duration"
                      placeholder="Ad Duration"
                      name="duration"
                      disabled
                      prefix="Seconds"
                    />
                    {errors.duration ? (
                      <p className="text-red-500 text-sm">{errors.duration}</p>
                    ) : null}
                  </div>
                  <div>
                    <FormControl
                      control="date"
                      name="startDate"
                      label="Start Date"
                      disabled
                      placeholder="Start Date"
                    />
                    {errors.startDate ? (
                      <p className="text-red-500 text-sm">{errors.startDate}</p>
                    ) : null}
                  </div>
                  <div>
                    <FormControl
                      control="date"
                      name="expiryDate"
                      label="Expiry Date"
                      disabled
                      placeholder=" Expiry Date"
                    />
                    {errors.expiryDate ? (
                      <p className="text-red-500 text-sm">
                        {errors.expiryDate}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <label
                      className="text-graphiteGray text-sm font-medium leading-6 capitalize col-span-1 flex items-center"
                      htmlFor="name"
                    >
                      Picture
                    </label>
                    <div
                      className={`p-4 flex items-center flex-col gap-2 border-2 ${
                        errors.imageURL ? 'border-red-300' : 'border-silverGray'
                      } pb-4 rounded-lg mt-3`}
                    >
                      <div
                        className={`px-6 py-4 flex flex-col items-center gap-3 `}
                      >
                        <div
                          className={
                            'bg-lightGrayish rounded-[28px] border border-solid  flex justify-center items-center p-2.5'
                          }
                        >
                          <img
                            src="/assets/icons/uploadcloud.svg"
                            alt="upload icon"
                            width={20}
                            height={20}
                          />
                        </div>
                        <div className="flex gap-2 items-center">
                          <p
                            className={`text-lightdark2 font-semibold ${minHeading}`}
                          >
                            Drop your files here or just
                          </p>
                          <label
                            htmlFor="picture"
                            className="font-semibold text-xs text-purpleDark cursor-pointer"
                          >
                            {' '}
                            Browse
                          </label>
                        </div>
                        <p className={twMerge(minHeading, 'mt-1')}>
                          Files should be in PDF, Word or PowerPoint format &
                          should be less than 5MB.
                        </p>
                        {imageUploading ? (
                          <label
                            htmlFor="picture"
                            className={`bg-purpleDark p-2 rounded-lg max-w-30 text-white`}
                          >
                            Uploading...
                          </label>
                        ) : values.imageURL ? (
                          <Image
                            src={values.imageURL}
                            alt="uploaded image"
                            width={100}
                            height={100}
                          />
                        ) : (
                          <label
                            htmlFor="picture"
                            className={`bg-purpleDark cursor-pointer p-2 rounded-lg max-w-30 text-white`}
                          >
                            Select File
                          </label>
                        )}
                        <input
                          className="hidden"
                          type="file"
                          name=""
                          id="picture"
                          disabled
                          onChange={async (e) => {
                            setFieldValue('imageURL', await UploadHandler(e));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </section>
  );
};

export default ViewAd;
