'use client';
import { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

// module imports
import {
  bg_style,
  minHeading,
  senaryHeading,
} from '@/globals/tailwindvariables';
import CustomButton from '@/app/component/customButton/button';
import FormControl from '@/app/component/formControl';
import { twMerge } from 'tailwind-merge';
// redux module

// supportTicket service
import {
  ISupportTicket,
  ITicketFile,
} from '@/app/interfaces/supportTicket.interface';
import { supportTicketService } from '@/app/services/supportTicket.service';

import Description from '@/app/component/description';
import { selectSupportTickets } from '@/redux/supportTickets/supportTicketSelector';
import CustomNavbar from '@/app/component/customNavbar';
import { withAuth } from '@/app/hoc/withAuth';
import { byteConverter } from '@/app/utils/byteConverter';
import AwsS3 from '@/app/utils/S3Intergration';
import { FileView } from '@/app/component/file-view/FileView';
import { useRouterHook } from '@/app/hooks/useRouterHook';

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required!'),
  description: Yup.string().required('Description is required!'),
});

const initialValues = {
  title: '',
  description: '',
  file: {
    name: '',
    fileType: '',
    url: '',
  },
};

const EditSupportTicket = () => {
  const router = useRouterHook();
  const params = useParams();
  const supportTicketsData = useSelector(selectSupportTickets);

  const { id } = params;

  const [isLoading, setIsLoading] = useState(false);
  const [avatarLoading, setavatarLoading] = useState(false);
  const [supportTicketData, setSupportTicketData] =
    useState<ISupportTicket | null>(null);

  useEffect(() => {
    let selectedSupportTicket = supportTicketsData?.find(
      (item: any) => item._id === id
    );
    setSupportTicketData(selectedSupportTicket);
  }, [id, supportTicketsData]);

  const onSubmit = async ({ title, description, file }: any) => {
    setIsLoading(true);
    let updateSupportTicketBody = {
      title,
      description,
      file,
    };
    setIsLoading(true);
    let result = await supportTicketService.httpUpdateSupportTicket(
      updateSupportTicketBody,
      id
    );
    if (result.statusCode == 200) {
      setIsLoading(false);
      router.push('/settings/supporttickets');
    } else {
      setIsLoading(false);
      toast.error(result.message);
    }
  };

  const avatarUploadHandler = async (e: any) => {
    setavatarLoading(true);
    let fileObj: ITicketFile | undefined = undefined;

    if (byteConverter(e.target.files[0].size, 'MB').size > 5) {
      toast.warning('Cannot upload image more then 5 mb of size');
      setavatarLoading(false);
      return;
    }

    try {
      await Promise.all(
        Object.keys(e.target.files).map(async (key) => {
          const url = await new AwsS3(
            e.target.files[key],
            'documents/supportTickets/'
          ).getS3URL();
          fileObj = {
            name: e.target.files[key].name,
            fileType: e.target.files[key].type,
            url: url,
            size: e.target.files[key].size,
          };
        })
      );

      return fileObj;
    } catch (error) {
      console.error('Error uploading documents:', error);
    } finally {
      setavatarLoading(false);
    }
  };

  return (
    <CustomNavbar>
      <div className="grid grid-cols-12 gap-8 p-8">
        <div className="col-span-4">
          <Image
            alt="Service24-7"
            src="/Service24-7.svg"
            width={498}
            height={628}
          />
        </div>
        <section className="w-full  col-span-8">
          <div className="flex gap-1 items-center">
            <Description
              title="Support Ticket"
              className="font-base text-slateGray cursor-pointer"
              onClick={() => router.push('/settings/supporttickets')}
            />
            <Image
              src="/chevron-right.svg"
              alt="chevron-right icon"
              width={16}
              height={16}
            />
            <Description
              title="Update Ticket"
              className="text-schestiPrimary"
            />
          </div>
          <div className="mt-6 ">
            {/* <div>
          <Image
            src="/support-ticket.png"
            width={400}
            height={400}
            alt="support-img"
          />
        </div> */}
            <div className="col-span-2">
              <Formik
                initialValues={
                  supportTicketData
                    ? {
                        title: supportTicketData.title,
                        description: supportTicketData.description,
                        file: supportTicketData.file,
                      }
                    : initialValues
                }
                validationSchema={validationSchema}
                enableReinitialize
                onSubmit={onSubmit}
              >
                {({ handleSubmit, setFieldValue, values }) => {
                  return (
                    <Form
                      name="basic"
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-5 bg-white px-5 py-6 shadow-primaryGlow rounded-2xl"
                    >
                      <FormControl
                        control="input"
                        label="Title"
                        type="text"
                        name="title"
                        placeholder="Enter title"
                      />
                      <FormControl
                        control="textarea"
                        label="Description"
                        type="text"
                        name="description"
                        placeholder="Write message here"
                      />
                      {/* <div
                        className="p-6 flex items-center flex-col gap-2 border-2 border-silverGray pb-4 rounded-lg "
                      >
                        <Image
                          src="/uploadcloud.svg"
                          alt="upload icon"
                          width={20}
                          height={20}
                          className="rounded-3xl border-5 border-paleblueGray bg-lightGrayish"
                        />
                        <div className="flex gap-1 items-center">
                          <div>
                            <p
                              className={twMerge(
                                `${senaryHeading} text-schestiPrimary font-semibold`
                              )}
                            >
                              Doc
                            </p>
                          </div>
                          <MinDescription
                            className="text-steelGray font-popin text-center"
                            title="or drag and drop"
                          />
                        </div>
                        {values.avatar ? (
                          <Image
                            src={values.avatar!}
                            alt="upload icon"
                            width={100}
                            height={100}
                          />
                        ) : null}
                        <MinDescription
                          className="text-steelGray font-popin text-center"
                          title="SVG, PNG, JPG or GIF (max. 800x400px)"
                        />
                      </div> */}
                      {/* Upload Image Div */}
                      {values?.file ? (
                        <FileView
                          name={values.file.name}
                          extension={values.file.fileType.split('/')[1]}
                          url={values.file.url}
                          text="View"
                          actionIcon={{
                            icon: '/trash.svg',
                            width: 16,
                            height: 16,
                            onClick: () => {
                              setFieldValue('file', undefined);
                            },
                          }}
                        />
                      ) : (
                        <div className={`${bg_style} p-5 mt-4 `}>
                          <div
                            className={`px-6 py-4 flex flex-col items-center gap-3 ${bg_style}`}
                          >
                            <input type="text" id="upload" className="hidden" />
                            <div className="bg-lightGrayish rounded-[28px] border border-solid border-red flex justify-center items-center p-2.5">
                              <Image
                                src={'/uploadcloud.svg'}
                                alt="upload icon"
                                width={20}
                                height={20}
                              />
                            </div>
                            {avatarLoading ? <p>Uploading...</p> : null}
                            <div className="flex gap-2">
                              <label
                                htmlFor="uploadCompanyLogo"
                                className={twMerge(
                                  `${senaryHeading} text-schestiPrimary font-semibold cursor-pointer`
                                )}
                              >
                                Upload File
                              </label>
                              <input
                                type="file"
                                name="uploadLogo"
                                id="uploadCompanyLogo"
                                className="hidden"
                                onChange={async (e) => {
                                  setFieldValue(
                                    'file',
                                    await avatarUploadHandler(e)
                                  );
                                }}
                              />
                              <p className={`text-steelGray ${minHeading}`}>
                                or drag and drop
                              </p>
                            </div>

                            <p className={`text-steelGray ${minHeading}`}>
                              SVG, PNG, JPG or GIF (max. 800x400px)
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex justify-end gap-2 mt-6">
                        <span>
                          <CustomButton
                            text="Cancel"
                            className="!bg-white !text-graphiteGray !border !border-celestialGray"
                            onClick={() =>
                              router.push('/settings/supporttickets')
                            }
                          />
                        </span>
                        <span>
                          <CustomButton
                            text="Update Ticket"
                            type="submit"
                            isLoading={isLoading}
                          />
                        </span>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </div>
        </section>
      </div>
    </CustomNavbar>
  );
};

export default withAuth(EditSupportTicket);
