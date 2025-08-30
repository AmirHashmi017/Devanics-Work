'use client';

import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import Image from 'next/image';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

// module imports
import Description from '@/app/component/description';
import FormControl from '@/app/component/formControl';
import CustomButton from '@/app/component/customButton/button';
// redux imports

// support tickets service
import {
  ISupportTicket,
  ITicketFile,
} from '@/app/interfaces/supportTicket.interface';
import { supportTicketService } from '@/app/services/supportTicket.service';
import {
  bg_style,
  minHeading,
  senaryHeading,
} from '@/globals/tailwindvariables';
import { twMerge } from 'tailwind-merge';
import { byteConverter } from '@/app/utils/byteConverter';
import AwsS3 from '@/app/utils/S3Intergration';
import CustomNavbar from '@/app/component/customNavbar';
import { withAuth } from '@/app/hoc/withAuth';
import { FileView } from '@/app/component/file-view/FileView';
import { useRouterHook } from '@/app/hooks/useRouterHook';

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required!'),
  description: Yup.string().required('Description is required!'),
});

const initialValues: ISupportTicket = {
  title: '',
  description: '',
  file: undefined,
};

const CreateTicket = () => {
  const router = useRouterHook();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarLoading, setavatarLoading] = useState(false);

  const onSubmit = async (values: ISupportTicket) => {
    setIsLoading(true);
    supportTicketService
      .httpAddNewSupportTicket({ ...values })
      .then((response: any) => {
        setIsLoading(false);
        if (response.statusCode == 201) {
          setIsLoading(false);
          toast.success(response.message);
          router.push('/settings/supporttickets');
        }
      })
      .catch(({ response }: any) => {
        setIsLoading(false);
        toast.error(response.data.message);
      });
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
        <section className="w-full col-span-8">
          <div className="flex gap-1 items-center">
            <Description
              title="Support Ticket"
              className="font-base text-slateGray cursor-pointer"
              onClick={() => router.push('/settings/supporttickets')}
            />
            <Image
              src={'/chevron-right.svg'}
              alt="chevron-right icon"
              width={16}
              height={16}
            />
            <Description
              title="Create New Ticket"
              className="text-schestiPrimary"
            />
          </div>
          <div className="mt-6 ">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
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

                    {/* Upload Image Div */}
                    {values.file ? (
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
                          {avatarLoading ? (
                            <p>Uploading...</p>
                          ) : (
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
                                accept="image/*"
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
                          )}

                          <p className={`text-steelGray ${minHeading}`}>
                            SVG, PNG, JPG or GIF (max. 800x400px)
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-end gap-2 mt-6">
                      <span>
                        <CustomButton
                          onClick={() =>
                            router.push('/settings/supporttickets')
                          }
                          text="Cancel"
                          className="!bg-white !text-graphiteGray !border !border-celestialGray"
                        />
                      </span>
                      <span>
                        <CustomButton
                          text="Create New Ticket"
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
        </section>
      </div>
    </CustomNavbar>
  );
};

export default withAuth(CreateTicket);
