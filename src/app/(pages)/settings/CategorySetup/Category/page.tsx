'use client';

import React, { useRef, useState } from 'react';
import { bg_style } from '@/globals/tailwindvariables';
import TertiaryHeading from '@/app/component/headings/tertiary';
import CustomButton from '@/app/component/customButton/button';
import WhiteButton from '@/app/component/customButton/white';
import * as Yup from 'yup';
import FormikController from '@/app/component/formControl';
import { Form, Formik } from 'formik';
import { categoriesService } from '@/app/services/categories.service';
import { voidFc } from '@/app/utils/types';
import CategoryTable from './Table';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  addNewCategoryData,
  insertManyCategoriesAction,
  setCategoryData,
  updateCategoryData,
} from '@/redux/company/settingSlices/categories/category.slice';
import { withAuth } from '@/app/hoc/withAuth';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { ISettingCategoryParsedType } from '@/app/interfaces/settings/categories-settings.interface';
import ModalComponent from '@/app/component/modal';
import { Alert, Table } from 'antd';
import Image from 'next/image';

export interface DataType {
  categoryId: string;
  companyName: string;
  _id: string;
  action: string;
}

export type CategoryInitTypes = {
  name: string;
  categoryId: string;
};
const validationSchema = Yup.object({
  name: Yup.string().required('Category Name is required!'),
  categoryId: Yup.string().required('DIV is required!'),
});

const AddCategory = () => {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const inputFileRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [parsedData, setParsedData] = useState<ISettingCategoryParsedType[]>(
    []
  );
  const [isInsertingMany, setIsInsertingMany] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { categoryData } = useSelector(
    (state: RootState) => state.companySetupCategory
  );

  const initialValues: CategoryInitTypes = {
    name: categoryData?.name || '',
    categoryId: categoryData?.categoryId || '',
  };

  const submitHandler = async (
    values: CategoryInitTypes,
    { resetForm }: { resetForm: voidFc }
  ) => {
    if (categoryData) {
      const { statusCode, data } = await categoriesService.httpUpdateCategory(
        categoryData._id!,
        values
      );
      if (statusCode === 200) {
        console.log(data);
        dispatch(updateCategoryData(data));
        dispatch(setCategoryData(null));
        resetForm();
      }
    } else {
      const { statusCode, data } =
        await categoriesService.httpAddNewCategory(values);
      if (statusCode === 201) {
        dispatch(addNewCategoryData(data));
        resetForm();
      }
    }
    setShowForm(false);
  };

  const uploadCsvFileAndParse: React.ChangeEventHandler<
    HTMLInputElement
  > = async (e) => {
    if (e.target.files) {
      setIsUploading(true);
      try {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        const response =
          await categoriesService.httpParseCategoriesCSV(formData);
        if (response.data) {
          setParsedData(response.data);
          setShowPreviewModal(true);
        }
        e.target.value = '';
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const errMsg = err.response?.data.message || 'An error occurred';
        setError(errMsg);
      } finally {
        setIsUploading(false);
        if (inputFileRef.current) {
          inputFileRef.current.value = '';
        }
      }
    }
  };

  function removeItemFromParsedData(idx: number) {
    const sliceData = parsedData
      .slice(0, idx)
      .concat(parsedData.slice(idx + 1));
    setParsedData(sliceData);
  }

  async function insertManyCategories(data: ISettingCategoryParsedType[]) {
    setIsInsertingMany(true);
    try {
      const response = await categoriesService.httpInsertManyCategories(data);
      if (response.data) {
        dispatch(insertManyCategoriesAction(response.data));
        setShowPreviewModal(false);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errMsg = err.response?.data.message || 'An error occurred';
      toast.error(errMsg);
    } finally {
      setIsInsertingMany(false);
    }
  }

  return (
    <>
      {showForm ? (
        <div className={`${bg_style} p-5 w-full`}>
          <TertiaryHeading title="Category" className="text-graphiteGray" />
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={submitHandler}
          >
            {({ handleSubmit, errors }) => {
              console.log({ errors });
              return (
                <Form
                  name="basic"
                  onSubmit={handleSubmit}
                  autoComplete="off"
                  className="mt-2"
                >
                  <div className=" grid grid-cols-2 gap-2">
                    <FormikController
                      control="input"
                      label="ID"
                      type="text"
                      name="categoryId"
                      placeholder="Enter ID"
                    />
                    <FormikController
                      control="input"
                      label="Catgory Name"
                      type="text"
                      name="name"
                      placeholder="Enter Name"
                    />
                  </div>

                  <div className="flex justify-end mt-5 items-center">
                    <div className="flex space-x-2 justify-between mt-5 items-center">
                      {!categoryData ? (
                        <WhiteButton
                          text="Cancel"
                          className="!w-fit"
                          onClick={() => {
                            setShowForm(false);
                          }}
                        />
                      ) : null}
                      <div className="flex items-center gap-3">
                        <CustomButton
                          type="submit"
                          text={
                            categoryData ? 'Update Category' : 'Add Category'
                          }
                          className="!w-auto "
                          iconwidth={20}
                          iconheight={20}
                        />
                        {categoryData && (
                          <CustomButton
                            type="button"
                            text="Cancel"
                            onClick={() => {
                              dispatch(setCategoryData(null));
                              setShowForm(false);
                            }}
                            className="!w-auto !bg-red-500 border-none"
                            iconwidth={20}
                            iconheight={20}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      ) : null}

      <ModalComponent open={showPreviewModal} setOpen={() => {}} width="70%">
        <div className="bg-white p-5 rounded-md">
          <div className="my-2 mb-6 text-schestiPrimary font-semibold text-[16px] leading-5">
            Preview CSV
          </div>

          <Table
            columns={[
              { title: 'Category #', dataIndex: 'categoryId' },
              { title: 'Category Name', dataIndex: 'name' },
              {
                title: 'Action',
                render(value, record, index) {
                  return (
                    <Image
                      src="/trash-2.svg"
                      className="cursor-pointer"
                      width={20}
                      height={20}
                      alt="delete"
                      onClick={() => {
                        removeItemFromParsedData(index);
                      }}
                    />
                  );
                },
              },
            ]}
            dataSource={parsedData}
          />

          <div className="flex justify-end space-x-3">
            <WhiteButton
              text="Cancel"
              onClick={() => setShowPreviewModal(false)}
              className="!w-fit"
            />
            <CustomButton
              text="Import Data"
              className="!w-fit"
              isLoading={isInsertingMany}
              loadingText="Importing..."
              onClick={() => insertManyCategories(parsedData)}
            />
          </div>
        </div>
      </ModalComponent>

      {error.length ? (
        <Alert
          type="error"
          closable
          onClose={() => {
            setError('');
          }}
          message={'CSV Parse Error '}
          description={error}
          className="my-3"
        />
      ) : null}

      <div
        className={`${bg_style} border border-solid border-silverGray mt-4 p-5`}
      >
        <div className="flex justify-between items-center">
          <TertiaryHeading
            title={showForm ? 'Added Category' : 'Category'}
            className="text-graphiteGray"
          />

          {!showForm ? (
            <div className="flex gap-2 items-center">
              <WhiteButton
                text="Download Template"
                icon="/download-icon.svg"
                iconwidth={20}
                iconheight={20}
                className="!w-fit"
                onClick={() => {
                  window.open(
                    '/csvs/category.csv',
                    '_blank',
                    'noopener,noreferrer'
                  );
                }}
              />
              <WhiteButton
                text="Upload File"
                icon="/uploadcloud.svg"
                iconwidth={20}
                iconheight={20}
                className="!w-fit"
                onClick={() => {
                  if (inputFileRef.current) {
                    inputFileRef.current.click();
                  }
                }}
                isLoading={isUploading}
                loadingText="Uploading..."
              />

              <input
                ref={inputFileRef}
                type="file"
                name=""
                id=""
                className="hidden"
                onChange={uploadCsvFileAndParse}
              />
              <CustomButton
                text="Add Category"
                className="!w-fit"
                onClick={() => {
                  setShowForm(true);
                }}
              />
            </div>
          ) : null}
        </div>
        <CategoryTable
          onEdit={() => {
            setShowForm(true);
          }}
          onDelete={() => {}}
        />
      </div>
    </>
  );
};

export default withAuth(AddCategory);
