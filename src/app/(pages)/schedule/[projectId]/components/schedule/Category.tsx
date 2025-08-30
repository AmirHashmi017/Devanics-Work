import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';

import FormControl from '@/app/component/formControl';
import CustomButton from '@/app/component/customButton/button';
import WhiteButton from '@/app/component/customButton/white';
import { categoriesService } from '@/app/services/categories.service';
import CustomModal from '@/app/component/modal';
import { CloseOutlined } from '@ant-design/icons';
import TertiaryHeading from '@/app/component/headings/tertiary';
import { IWBSType } from '@/app/interfaces/schedule/createSchedule.interface';

type Props = {
  setCategoryModal: Dispatch<SetStateAction<boolean>>;
  categoryModal: boolean;
  addWbsHandler: any;
  updateWBsHandler: any;
  projectCategoryEditDetail?: IWBSType;
};

type InitialValuesTypes = {
  category: string;
  subCategory: string;
};
const initialValues: InitialValuesTypes = {
  category: '',
  subCategory: '',
};

const validationSchema = Yup.object({
  category: Yup.string().required('Category is required'),
  subCategory: Yup.string().required('Subcategory is required'),
});

export function CategoryModal({
  categoryModal,
  setCategoryModal,
  addWbsHandler,
  updateWBsHandler,
  projectCategoryEditDetail,
}: Props) {
  const [categories, setCategories] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const [subCategories, setSubCategories] = useState<
    {
      label: string;
      value: string;
      categoryId: string;
    }[]
  >([]);

  const fetchCategories = useCallback(async () => {
    const result = await categoriesService.httpGetAllCategories(1, 9);
    let modifyCategories = result.data.map(
      (cat: { name: string; _id: string }) => {
        return {
          label: cat.name,
          value: cat._id,
        };
      }
    );
    setCategories(modifyCategories);
  }, []);

  const fetchSubCategories = useCallback(async () => {
    const result = await categoriesService.httpGetAllSubcategories(1, 9);
    const flattenedSubcategories: any[] = [];

    result.data.forEach((category: any) => {
      category.subcategories.forEach((subcategory: any) => {
        const flattenedSubcategory = {
          label: subcategory.name,
          value: subcategory._id,
          categoryId: subcategory.categoryId,
        };
        flattenedSubcategories.push(flattenedSubcategory);
      });
    });
    setSubCategories(flattenedSubcategories);
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const categoriSubmitHandler = (values: any, { resetForm }: any) => {
    const categoryName: any = categories.find(
      (cat: { value: string }) => cat.value === values.category
    );
    const subCategoryName: any = subCategories.find(
      (cat: { value: string }) => cat.value === values.subCategory
    );

    if (projectCategoryEditDetail) {
      updateWBsHandler(
        projectCategoryEditDetail._id,
        categoryName?.label ? categoryName?.label : values.category,
        subCategoryName?.label ? subCategoryName?.label : values.subCategory
      );
    } else {
      addWbsHandler(
        categoryName?.label ? categoryName?.label : values.category,
        subCategoryName?.label ? subCategoryName?.label : values.subCategory
      );
    }
    setCategoryModal(false);
    resetForm();
  };

  return (
    <CustomModal setOpen={() => setCategoryModal(false)} open={categoryModal}>
      <div
        className="rounded-lg z-50 bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#D0D5DD]  p-2 border-[#D0D5DD] flex  py-2.5 justify-between">
          <TertiaryHeading
            title="Select Project WBS"
            className="text-graphiteGray"
          />
          <CloseOutlined
            className="cursor-pointer"
            style={{ width: '24px', height: '24px' }}
            onClick={() => setCategoryModal(false)}
          />
        </div>

        <Formik
          initialValues={
            projectCategoryEditDetail
              ? projectCategoryEditDetail
              : initialValues
          }
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={categoriSubmitHandler}
        >
          {({ handleSubmit, values, setFieldValue }) => {
            return (
              <Form
                name="basic"
                onSubmit={handleSubmit}
                autoComplete="off"
                className="mt-2"
              >
                <div className="px-5">
                  <FormControl
                    control="inputselect"
                    type="text"
                    label="Category"
                    options={categories}
                    className="w-full mb-3"
                    name="category"
                    placeholder="Select Category"
                    setCustomState={() => setFieldValue('subCategory', '')}
                  />
                  <FormControl
                    control="inputselect"
                    type="text"
                    label="Sub-category"
                    options={subCategories.filter(
                      (cat: any) => cat.categoryId === values.category
                    )}
                    className="w-full mb-3"
                    name="subCategory"
                    placeholder="Select Subcategory"
                  />

                  <div className="flex mt-3 justify-end py-2 space-x-2">
                    <WhiteButton
                      text="Cancel"
                      className="!w-28"
                      onClick={() => setCategoryModal(false)}
                    />
                    {projectCategoryEditDetail ? (
                      <CustomButton
                        text="Update"
                        className="!w-28"
                        type="submit"
                      />
                    ) : (
                      <CustomButton
                        text="Done"
                        className="!w-28"
                        type="submit"
                      />
                    )}
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </CustomModal>
  );
}
