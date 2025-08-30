'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Form, Formik } from 'formik';

import { bg_style } from '@/globals/tailwindvariables';
import TertiaryHeading from '@/app/component/headings/tertiary';
import CustomButton from '@/app/component/customButton/button';
import WhiteButton from '@/app/component/customButton/white';
import * as Yup from 'yup';
import FormControl from '@/app/component/formControl';
import SubCategoryTable from './Table';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import {
  fetchCategories,
  fetchSubCategories,
} from '@/redux/company/settingSlices/companySetup.thunk';
import { ICategory } from '@/app/interfaces/companyInterfaces/setting.interface';
import {
  companySetupCategoriesData,
  companySetupSubcategoriesLoading,
} from '@/redux/company/companySelector';
import { categoriesService } from '@/app/services/categories.service';
import { voidFc } from '@/app/utils/types';
import {
  refetchSubCategories,
  setSubcategoryData,
} from '@/redux/company/settingSlices/categories/subcategory.slice';
import { withAuth } from '@/app/hoc/withAuth';
import { UploadSubCategoriesModal } from './UploadSubCategoriesModal';

export type SubcategoryInitValues = {
  name: string;
  price: number;
  category: string;
};
export interface DataType {
  categoryId: string;
  company: string;
  _id: string;
  action: string;
}
const validationSchema = Yup.object({
  category: Yup.string().required('Category Name is required!'),
  name: Yup.string().required('Sub Category is required!'),
  price: Yup.number()
    .min(1, 'Price must be greater than 0')
    .required('Price is required!'),
});

const AddSubcategory = () => {
  const [showForm, setShowForm] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { subcategoryData } = useSelector(
    (state: any) => state.companySetupSubcategory
  );

  const initialValues: SubcategoryInitValues = {
    name: subcategoryData?.subCategory || '',
    price: subcategoryData?.price || '',
    category: subcategoryData?.categoryId || '',
  };
  const categoriesReduxData = useSelector(companySetupCategoriesData);
  const categoriesReduxDataLoading = useSelector(
    companySetupSubcategoriesLoading
  );

  const fetchSubcategoriesHandler = useCallback(async () => {
    await dispatch(fetchSubCategories({ page: 1, limit: 10 }));
  }, []);

  useEffect(() => {
    fetchSubcategoriesHandler();
  }, []);

  const fetchCategoriesHandler = useCallback(async () => {
    await dispatch(fetchCategories({ page: 1, limit: 10 }));
  }, []);

  useEffect(() => {
    fetchCategoriesHandler();
  }, []);

  const submitHandler = async (
    values: SubcategoryInitValues,
    { resetForm }: { resetForm: voidFc }
  ) => {
    if (subcategoryData) {
      const { statusCode, data } =
        await categoriesService.httpUpdateSubcategory(subcategoryData._id, {
          ...values,
        });
      console.log(statusCode, data);
      if (statusCode === 200) {
        dispatch(setSubcategoryData(null));
        resetForm();
        dispatch(refetchSubCategories());
      }
    } else {
      const { statusCode, data } =
        await categoriesService.httpAddNewSubcategory(values);
      console.log(statusCode, data);
      if (statusCode === 201) {
        dispatch(refetchSubCategories());
        resetForm();
      }
      setShowForm(false);
    }
  };

  const options = categoriesReduxData
    ? categoriesReduxData.map(({ name, _id }: ICategory) => ({
        label: name,
        value: _id,
      }))
    : [];

  return (
    <>
      {showForm ? (
        <div className={`${bg_style} p-5`}>
          <TertiaryHeading title="Sub-Category" className="text-graphiteGray" />
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={submitHandler}
            enableReinitialize
          >
            {({ handleSubmit, values }) => {
              console.log({ values });
              return (
                <Form
                  name="basic"
                  onSubmit={handleSubmit}
                  autoComplete="off"
                  className="mt-2"
                >
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <FormControl
                      control="select"
                      label="Category Name"
                      type="text"
                      disabled={subcategoryData}
                      options={options}
                      searchable={true}
                      isLoading={categoriesReduxDataLoading}
                      name="category"
                      placeholder="Search Category Name"
                    />
                    <FormControl
                      control="input"
                      label="Sub-Category"
                      type="text"
                      name="name"
                      placeholder="Enter Sub-Category"
                    />
                    <FormControl
                      control="input"
                      label="Labour Per Hour"
                      type="number"
                      name="price"
                      placeholder="Enter Labour Per Hour"
                      prefix="$"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 mt-5 items-center">
                    {!subcategoryData ? (
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
                        text={
                          subcategoryData
                            ? 'Update Subcategory'
                            : 'Add Subcategory'
                        }
                        type="submit"
                        className="!w-auto "
                        iconwidth={20}
                        iconheight={20}
                      />
                      {subcategoryData && (
                        <CustomButton
                          type="button"
                          text="Cancel"
                          onClick={() => {
                            dispatch(setSubcategoryData(null));
                            setShowForm(false);
                          }}
                          className="!w-auto !bg-red-500 border-none"
                          iconwidth={20}
                          iconheight={20}
                        />
                      )}
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      ) : null}

      <UploadSubCategoriesModal
        open={showUploadModal}
        setOpen={setShowUploadModal}
        categories={categoriesReduxData ? categoriesReduxData : []}
      />

      <div
        className={`${bg_style} border border-solid border-silverGray mt-4 space-y-2 p-5`}
      >
        <div className="flex justify-between items-center">
          <TertiaryHeading
            title={'Sub Categories'}
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
                    '/csvs/sub-category.csv',
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
                loadingText="Uploading..."
                onClick={() => {
                  setShowUploadModal(true);
                }}
              />

              <input type="file" name="" id="" className="hidden" />
              <CustomButton
                text="Add Subcategory"
                className="!w-fit"
                onClick={() => {
                  setShowForm(true);
                }}
              />
            </div>
          ) : null}
        </div>
        <SubCategoryTable
          onEdit={() => {
            setShowForm(true);
          }}
          onDelete={() => {}}
        />
      </div>
    </>
  );
};

export default withAuth(AddSubcategory);
