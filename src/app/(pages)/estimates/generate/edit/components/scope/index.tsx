'use client';
import {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useCallback,
} from 'react';
import clsx from 'clsx';
import * as Yup from 'yup';
import '../scopeStyle.css';
import { Table } from 'antd';
import Image from 'next/image';
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';
import { twMerge } from 'tailwind-merge';
import { components } from 'react-select';
import { useSearchParams } from 'next/navigation';
import CreatableSelect from 'react-select/creatable';
import { useSelector, useDispatch } from 'react-redux';
//  module imports
import ModalComponent from '@/app/component/modal';
import FormControl from '@/app/component/formControl';
import { bg_style } from '@/globals/tailwindvariables';
import { byteConverter } from '@/app/utils/byteConverter';
import { formatNumberWithCommas } from '@/app/utils/helper';
import { PositiveNumberRegex } from '@/app/utils/regex.util';
import CustomButton from '@/app/component/customButton/button';
import TertiaryHeading from '@/app/component/headings/tertiary';
import EstimatesUnits from '@/app/constants/estimatesUnits.json';
import { materialService } from '@/app/services/material.service';
import CustomWhiteButton from '@/app/component/customButton/white';
import QuaternaryHeading from '@/app/component/headings/quaternary';
import { DeleteContent } from '@/app/component/delete/DeleteContent';
import { categoriesService } from '@/app/services/categories.service';
import { generateEstimateDetailAction } from '@/redux/estimate/estimateRequest.slice';
import { estimateRequestService } from '@/app/services/estimates.service';
import { selectGeneratedEstimateDetail } from '@/redux/estimate/estimateRequestSelector';
import {
  IinitialValues,
  IEstimateScopeInitialValue,
} from '@/app/interfaces/estimateRequests/estimateScopeInitialValue.interface';
import { AxiosError } from 'axios';
import { useCurrencyFormatter } from '@/app/hooks/useCurrencyFormatter';

const validationSchema = Yup.object({
  category: Yup.string().required('Category is required!'),
  // subCategory: Yup.string().required('SubCategory is required'),
  description: Yup.object().required('Description is required!'),
  unit: Yup.string().required('Unit is required!'),
  qty: Yup.string()
    .matches(PositiveNumberRegex, 'qty must be a positive number')
    .required('Quantity is required'),
  wastage: Yup.string().required('Wastage is required'),
  unitLabourHour: Yup.string()
    // .matches(PositiveNumberRegex, 'Unit labour hour must be a positive number')
    .required('Unit labour hour is required'),
  perHourLaborRate: Yup.string()
    // .matches(
    //   PositiveNumberRegex,
    //   'Per hour labour rate must be a positive number'
    // )
    .required('Per hour labour rate  is required!'),
  unitMaterialCost: Yup.string()
    // .matches(
    //   PositiveNumberRegex,
    //   'Unit material cost must be a positive number'
    // )
    .required('Unit material cost is required!'),
  unitEquipments: Yup.string()
    // .matches(PositiveNumberRegex, 'Unit equipments must be a positive number')
    .required('Unit equipments is required!'),
});
const descriptionInputStyle: any = {
  control: (styles: any) => ({
    ...styles,
    backgroundColor: 'white',
    border: '1px solid border-gray-200',
    boxShadow: 'none',
    borderColor: 'none',
  }),

  input: (styles: any) => ({ ...styles, outline: 'none' }),
  placeholder: (styles: any) => ({
    ...styles,
    color: '#98A2B3',
    fontSize: '14px',
  }),
  menu: (styles: any) => ({
    ...styles,
    zIndex: 3,
  }),
};

interface IProps {
  setPrevNext: Dispatch<SetStateAction<number>>;
}

const initialValues: IinitialValues = {
  category: '',
  subCategory: '',
  description: '',
  unit: '',
  qty: '',
  wastage: '5',
  unitLabourHour: '',
  perHourLaborRate: '',
  unitMaterialCost: '',
  unitEquipments: '',
};
const { DropdownIndicator } = components;
export const CustomDropdownIndicator = (props: any) => {
  return (
    <DropdownIndicator {...props}>
      <Image
        src={'/search.svg'}
        alt="search icon "
        width={16}
        height={16}
        className="cursor-pointer"
      />
    </DropdownIndicator>
  );
};

const Scope = ({ setPrevNext }: IProps) => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const generatedEstimateId: null | string = searchParams.get(
    'generatedEstimateId'
  );

  const { generateEstimateDetail } = useSelector(selectGeneratedEstimateDetail);

  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewPlansModel, setViewPlansModel] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [estimateDetail, setEstimateDetail] = useState<any>({});
  const [deletedItemIDs, setDeletedItemIDs] = useState({
    scopeId: '',
    scopeItemId: '',
  });
  const [planDocuments, setPlanDocuments] = useState<Object[]>([]);
  const [isAddingNewSubCategory, setIsAddingNewSubCategory] = useState(false);
  const [subCategories, setSubCategories] = useState<Object[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [estimateDescriptions, setEstimateDescriptions] = useState<any>([]);
  // const [selecteddescription, setsSelecteddescription] = useState('');
  const [editConfirmItem, setEditConfirmItem] = useState(false);
  // const [estiamteUnits, setEstiamteUnits] = useState<IUnits[] | undefined>([]);
  const [confirmEstimates, setConfirmEstimates] = useState<
    {
      title: string;
      categoryName: string;
      subCategoryName: string;
      scopeItems: Object[];
    }[]
  >([]);
  const [SingleEstimateData, setSingleEstimateData] = useState<any>({
    category: '',
    subCategory: '',
    description: '',
    unit: '',
    qty: '',
    wastage: '5',
    unitLabourHour: '',
    perHourLaborRate: '',
    unitMaterialCost: '',
    unitEquipments: '',
  });
  const userCurrency = useCurrencyFormatter({
    currency: generateEstimateDetail?.estimateRequestIdDetail?.currency,
  });
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

    const flattenedSubcategories: Object[] = [];
    result.data.forEach((subCategory: any) => {
      subCategory.subcategories.forEach((subcategory: any) => {
        const flattenedSubcategory = {
          label: subcategory.name,
          value: subcategory._id,
          perHourLaborRate: subcategory.price,
          categoryId: subcategory.categoryId,
        };
        flattenedSubcategories.push(flattenedSubcategory);
      });
    });
    setSubCategories(flattenedSubcategories);
  }, []);
  // const fetchMaterialUnits = useCallback(async () => {
  //   const unitsMaterials = await materialService.httpFetchMaterialUnits();
  //   setEstiamteUnits(unitsMaterials.data?.fetchedUnits);
  // }, []);

  const fetchMeterialDetail = useCallback(
    async (categoryId: string, subCategory: string) => {
      materialService
        .httpGetMeterialWithCategoryId(categoryId, subCategory)
        .then((result) => {
          let uniqueDescriptionsSet = new Set();
          // let uniqueUnitsSet = new Set();
          let fetchedDescriptions = result.data
            .map((material: IEstimateScopeInitialValue) => {
              const description = material.description;

              if (!uniqueDescriptionsSet.has(description)) {
                uniqueDescriptionsSet.add(description);
                return {
                  ...material,
                  label: description,
                  value: description,
                };
              } else {
                return null;
              }
            })
            .filter((description: any) => description !== null);

          // let fetchedUnits = result.data
          //   .map((material: IEstimateScopeInitialValue) => {
          //     const unit = material.unit;

          //     if (!uniqueUnitsSet.has(unit)) {
          //       uniqueUnitsSet.add(unit);
          //       return {
          //         ...material,
          //         label: unit,
          //         value: unit,
          //       };
          //     } else {
          //       return null;
          //     }
          //   })
          //   .filter((unit: any) => unit !== null);

          setEstimateDescriptions(fetchedDescriptions);
          // setEstiamteUnits(fetchedUnits);
        })
        .catch((error) => {
          console.log(error, 'error in fetch meterials');
        });
    },
    []
  );

  useEffect(() => {
    fetchCategories();
    // fetchEstimateDetail();
    // fetchMaterialUnits();
  }, []);
  useEffect(() => {
    if (selectedCategory) {
      fetchSubCategories();
      fetchMeterialDetail(selectedCategory, selectedSubCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategory && selectedSubCategory) {
      fetchMeterialDetail(selectedCategory, selectedSubCategory);
      const subCategoryPrice: any = subCategories.find(
        (cat: any) => cat.value === selectedSubCategory
      );
      setSingleEstimateData({
        ...SingleEstimateData,
        perHourLaborRate: subCategoryPrice?.perHourLaborRate
          ? subCategoryPrice?.perHourLaborRate
          : 0,
        category: selectedCategory,
        subCategory: selectedSubCategory,
      });

      setSingleEstimateData((prev: any) => ({
        ...prev,
        perHourLaborRate: subCategoryPrice?.perHourLaborRate
          ? subCategoryPrice?.perHourLaborRate
          : 0,
      }));
    }
  }, [selectedSubCategory]);
  // useEffect(() => {
  //   if (selecteddescription) {
  //     const findDescriptionDetail: any = estimateDescriptions.find(
  //       (desc: any) => desc.description === selecteddescription
  //     );

  //     setSingleEstimateData({
  //       ...SingleEstimateData,
  //       category: selectedCategory,
  //       subCategory: selectedSubCategory,
  //       description: selecteddescription,
  //       unit: findDescriptionDetail?.unit ? findDescriptionDetail?.unit : 0,
  //       unitLabourHour: findDescriptionDetail?.unitLabourHour
  //         ? findDescriptionDetail?.unitLabourHour
  //         : 0,
  //       unitMaterialCost: findDescriptionDetail?.unitMaterialCost
  //         ? findDescriptionDetail?.unitMaterialCost
  //         : 0,
  //       unitEquipments: findDescriptionDetail?.unitEquipments
  //         ? findDescriptionDetail?.unitEquipments
  //         : 0,
  //     });
  //   }
  // }, [selecteddescription]);

  useEffect(() => {
    if (generateEstimateDetail?.estimateScope?.length) {
      setConfirmEstimates(generateEstimateDetail?.estimateScope);
    }
    setEstimateDetail(generateEstimateDetail.estimateRequestIdDetail);
    setPlanDocuments([
      ...generateEstimateDetail.estimateRequestIdDetail.drawingsDocuments,
      ...generateEstimateDetail.estimateRequestIdDetail.otherDocuments,
      ...generateEstimateDetail.estimateRequestIdDetail.takeOffReports,
    ]);
  }, [generateEstimateDetail]);

  const submitHandler = (
    estimateTableItemValues: IinitialValues,
    actions: any
  ) => {
    estimateTableItemValues['description'] =
      estimateTableItemValues.description.value;

    let generateRandomNumber = Math.floor(Math.random() * 103440 + 1);

    const selectedCategoryName: any = categories.find(
      (cat: any) => cat.value === estimateTableItemValues.category
    );

    const selctedSubCategoryName: any = subCategories.find(
      (cat: any) => cat.value === estimateTableItemValues.subCategory
    );

    let selectedCategory = `${
      selectedCategoryName?.label
        ? selectedCategoryName?.label
        : estimateTableItemValues?.category
    } ${
      selctedSubCategoryName?.label
        ? selctedSubCategoryName?.label
        : estimateTableItemValues.subCategory
    }`;

    if (editConfirmItem) {
      const updateConfirmEstimateArray: any = confirmEstimates.map(
        (item: any) => {
          return {
            ...item,
            totalCostRecord: calculateTotalCost(item),
            scopeItems: item.scopeItems.map((dataItem: any) =>
              dataItem.index === estimateTableItemValues.index
                ? estimateTableItemValues
                : dataItem
            ),
          };
        }
      );
      setConfirmEstimates(updateConfirmEstimateArray);
      setEditConfirmItem(false);

      setSelectedSubCategory('');
      setSelectedCategory('');
      setSingleEstimateData({
        category: '',
        subCategory: '',
        description: '',
        unit: '',
        qty: '',
        wastage: '5',
        unitLabourHour: '',
        perHourLaborRate: '',
        unitMaterialCost: '',
        unitEquipments: '',
      });
      actions.resetForm({ values: initialValues });
    } else {
      let newValue = {
        title: selectedCategory,
        categoryName: selectedCategoryName?.label
          ? selectedCategoryName?.label
          : estimateTableItemValues?.category,
        subCategoryName: selctedSubCategoryName?.label
          ? selctedSubCategoryName?.label
          : estimateTableItemValues.subCategory,
        scopeItems: [
          { ...estimateTableItemValues, index: generateRandomNumber },
        ],
      };

      confirmEstimateHandler(newValue);

      setSelectedSubCategory('');
      setSelectedCategory('');
      setSingleEstimateData({
        category: '',
        subCategory: '',
        description: '',
        unit: '',
        qty: '',
        wastage: '5',
        unitLabourHour: '',
        perHourLaborRate: '',
        unitMaterialCost: '',
        unitEquipments: '',
      });
      actions.resetForm({ values: initialValues });
    }
  };

  const deleteConfirmEstimateRecordHandler = (record: any) => {
    setShowDeleteModal(true);

    const estimatedScopeItem: any = confirmEstimates.find((item) =>
      item.scopeItems.some((scopeItem: any) => scopeItem._id === record._id)
    );

    setDeletedItemIDs({
      scopeId: estimatedScopeItem._id,
      scopeItemId: record._id,
    });
  };
  // const editEstimateRecordHandler = (record: any) => {
  //   setSingleEstimateData(record);
  //   setEditItem(true);
  // };
  const editConfirmEstimateRecordHandler = (record: any) => {
    setSingleEstimateData({
      ...record,
      description: { value: record.description, label: record.description },
    });
    setSelectedCategory(record.category);
    setSelectedSubCategory(record.subCategory);
    // setEditItem(false);
    setEditConfirmItem(true);
    fetchMeterialDetail(record.category, record.subCategory);
  };

  const calculateTotalCost = (record: IEstimateScopeInitialValue) => {
    let perHourLaborRate = parseFloat(record.perHourLaborRate);
    let unitLabourHour = parseFloat(record.unitLabourHour);
    let quantity = parseFloat(record.qty);
    let unitMaterialCost = parseFloat(record.unitMaterialCost);
    let wastagePercentage = parseFloat(record.wastage);
    let qtyWithWastage = quantity * (1 + wastagePercentage / 100);
    let totalLabourHours = qtyWithWastage * unitLabourHour;
    let totalMeterialCost = unitMaterialCost * qtyWithWastage;
    let totalLabourCost = totalLabourHours * perHourLaborRate;
    let unitEquipments = parseFloat(record.unitEquipments);
    let totalEquipmentCost = unitEquipments * qtyWithWastage;
    let result = totalLabourCost + totalMeterialCost + totalEquipmentCost;
    return result;
  };

  const confirmColumns: any = [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      fixed: 'left',
      width: 200,
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      align: 'center',
      width: 80,
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      align: 'center',
      width: 80,
    },
    {
      title: 'Wastage',
      dataIndex: 'wastage',
      align: 'center',
      width: 90,
      render: (value: number) => {
        return `${value}%`;
      },
    },
    {
      title: 'Qty with wastage',
      dataIndex: 'qtyWithWastage',
      align: 'center',
      width: 100,
      render: (text: string, record: IEstimateScopeInitialValue) => {
        let quantity = parseFloat(record.qty);
        let wastagePercentage = parseFloat(record.wastage);
        let result = quantity * (1 + wastagePercentage / 100);
        return formatNumberWithCommas(result);
      },
    },
    {
      title: 'Total Labour Hours',
      dataIndex: 'totalLabourHours',
      align: 'center',
      width: 120,
      render: (text: string, record: IEstimateScopeInitialValue) => {
        let unitLabourHour = parseFloat(record.unitLabourHour);
        let wastagePercentage = parseFloat(record.wastage);
        let quantity = parseFloat(record.qty);
        let quantityWithWastage = quantity * (1 + wastagePercentage / 100);
        let result = quantityWithWastage * unitLabourHour;
        return `${formatNumberWithCommas(result)}`;
      },
    },
    {
      title: 'Per Hours Labor Rate',
      dataIndex: 'perHourLaborRate',
      align: 'center',
      width: 120,
      render: (value: number) => {
        return userCurrency.format(value);
      },
    },
    {
      title: 'Total Labor Cost',
      dataIndex: 'totalLaborCost',
      align: 'center',
      width: 120,
      render: (text: string, record: IEstimateScopeInitialValue) => {
        let unitLabourHour = parseFloat(record.unitLabourHour);
        let quantity = parseFloat(record.qty);
        let wastagePercentage = parseFloat(record.wastage);
        let quantityWithWastage = quantity * (1 + wastagePercentage / 100);
        let perHourLaborRate = parseFloat(record.perHourLaborRate);
        let totalLabourHours = quantityWithWastage * unitLabourHour;
        let result = totalLabourHours * perHourLaborRate;
        return userCurrency.format(result);
      },
    },
    {
      title: 'Unit Material Cost',
      dataIndex: 'unitMaterialCost',
      align: 'center',
      width: 120,
      render: (value: number) => {
        return userCurrency.format(value);
      },
    },
    {
      title: 'Total Material Cost',
      dataIndex: 'totalMaterialCost',
      align: 'center',
      width: 120,
      render: (text: string, record: IEstimateScopeInitialValue) => {
        let unitMaterialCost = parseFloat(record.unitMaterialCost);
        let quantity = parseFloat(record.qty);
        let wastagePercentage = parseFloat(record.wastage);
        let quantityWithWastage = quantity * (1 + wastagePercentage / 100);
        let result = unitMaterialCost * quantityWithWastage;
        return userCurrency.format(result);
      },
    },
    {
      title: 'Total Equipment Cost',
      dataIndex: 'totalEquipmentCost',
      align: 'center',
      width: 140,
      render: (text: string, record: IEstimateScopeInitialValue) => {
        let unitEquipments = parseFloat(record.unitEquipments);
        let quantity = parseFloat(record.qty);
        let wastagePercentage = parseFloat(record.wastage);
        let quantityWithWastage = quantity * (1 + wastagePercentage / 100);
        let result = unitEquipments * quantityWithWastage;
        return userCurrency.format(result);
      },
    },
    {
      title: 'Total Cost',
      dataIndex: 'totalCost',
      align: 'center',
      width: 150,
      render: (text: string, record: IEstimateScopeInitialValue) => {
        let result = calculateTotalCost(record);
        return userCurrency.format(result);
      },
    },

    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (text: string, record: IEstimateScopeInitialValue) => (
        <div className="flex gap-2 justify-center">
          <Image
            src="/edit.svg"
            className="cursor-pointer"
            width={20}
            height={20}
            alt="edit"
            onClick={() => editConfirmEstimateRecordHandler(record)}
          />
          <Image
            src="/trash.svg"
            className="cursor-pointer"
            width={20}
            height={20}
            alt="delete"
            onClick={() => deleteConfirmEstimateRecordHandler(record)}
          />
        </div>
      ),
    },
  ];
  const confirmEstimateHandler = (dataSource: {
    title: string;
    scopeItems: Object[];
  }) => {
    setSelectedCategory('');
    setSelectedSubCategory('');
    // setEstimateDescriptions([]);
    // setEstiamteUnits([]);
    setSingleEstimateData({
      category: '',
      subCategory: '',
      description: '',
      unit: '',
      qty: '',
      wastage: '5',
      unitLabourHour: '',
      perHourLaborRate: '',
      unitMaterialCost: '',
      unitEquipments: '',
    });

    const index = confirmEstimates.findIndex(
      (item) => item.title === dataSource.title
    );

    dataSource.scopeItems.forEach((record: any) => {
      record.totalCostRecord = calculateTotalCost(record);
    });

    if (index !== -1) {
      let modifyArray = confirmEstimates.map((item, i) =>
        i === index
          ? {
              ...item,
              scopeItems: [...item.scopeItems, ...dataSource.scopeItems],
            }
          : item
      );
      setConfirmEstimates(modifyArray);
    } else {
      let modifyArray: any = [...confirmEstimates, dataSource];
      setConfirmEstimates(modifyArray);
    }
  };

  const nextStepHandler = () => {
    if (!confirmEstimates.length) {
      toast.warning('Please add div first then move forward');
      return;
    } else {
      setPrevNext((prev) => prev + 1);
      dispatch(
        generateEstimateDetailAction({
          estimateScope: confirmEstimates,
          estimateRequestIdDetail:
            generateEstimateDetail.estimateRequestIdDetail,
        })
      );
    }
  };

  const deleteEstimateHandler = async () => {
    setIsDeleting(true);
    const newArray: any = confirmEstimates.map((item) => {
      return {
        ...item,
        scopeItems: item.scopeItems.filter(
          (dataItem: any) => dataItem._id !== deletedItemIDs.scopeItemId
        ),
      };
    });
    setConfirmEstimates(
      newArray.filter((item: any) => item && item.scopeItems.length > 0)
    );

    try {
      await estimateRequestService.deleteGeneratedEstimateItem(
        generatedEstimateId,
        deletedItemIDs.scopeId,
        deletedItemIDs.scopeItemId
      );
      setIsDeleting(false);
      setShowDeleteModal(false);
    } catch (error) {
      let err = error as AxiosError<{ message: string }>;
      let errMessage = err.response?.data.message || 'Error happing';
      setIsDeleting(false);
      setShowDeleteModal(false);
      toast.error(errMessage);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <TertiaryHeading title="" className="text-graphiteGray font-semibold" />
        {estimateDetail?.drawingsDocuments?.length && (
          <div className="grid grid-rows-1 md:grid-cols-3 gap-x-2">
            <CustomButton
              text="View Plans"
              className="!text-graphiteGray !bg-snowWhite !shadow-scenarySubdued 
                      border-2 border-solid !border-celestialGray "
              onClick={() => setViewPlansModel(true)}
            />

            <CustomButton
              text="Previous"
              className="!text-graphiteGray !bg-snowWhite !shadow-scenarySubdued 
                      border-2 border-solid !border-celestialGray"
              onClick={() => setPrevNext((prev) => prev - 1)}
            />

            <CustomButton
              disabled={confirmEstimates.length == 0}
              text="Next"
              className="!w-full"
              onClick={nextStepHandler}
            />
          </div>
        )}
      </div>
      <Formik
        initialValues={SingleEstimateData ? SingleEstimateData : initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={submitHandler}
      >
        {({ handleSubmit, values, setFieldValue, errors }) => {
          return (
            <>
              <Form
                name="basic"
                onSubmit={handleSubmit}
                autoComplete="off"
                className={`p-5 ${bg_style} mt-4`}
              >
                <div className="grid grid-cols-1 grid-rows-1 md:grid-cols-2 mb-3 gap-2">
                  <FormControl
                    control="inputselect"
                    label="Category"
                    labelStyle="font-normal"
                    type="text"
                    name="category"
                    options={categories}
                    placeholder="Enter or create category"
                    className="w-full h-10"
                    setCustomState={setSelectedCategory}
                    disabled={editConfirmItem}
                    onItemAdd={(newCategory: string) => {
                      setIsAddingNewCategory(true);
                      categoriesService
                        .httpAddNewCategory({
                          categoryId: categories.length.toString(),
                          name: newCategory,
                        })
                        .then((response) => {
                          fetchCategories();
                          if (response.data) {
                            setSelectedCategory(response.data._id as string);
                          }
                        })
                        .catch((err) => {
                          const error = err as AxiosError<{ message: string }>;
                          toast.error(error.response?.data.message);
                        })
                        .finally(() => {
                          setIsAddingNewCategory(false);
                        });
                    }}
                    onItemAddloading={isAddingNewCategory}
                  />
                  <FormControl
                    control="inputselect"
                    label="Sub Category"
                    labelStyle="font-normal"
                    name="subCategory"
                    options={subCategories.filter(
                      (cat: any) => cat.categoryId === values.category
                    )}
                    placeholder="Enter or create subcategory"
                    className="w-full h-10"
                    setCustomState={setSelectedSubCategory}
                    disabled={editConfirmItem}
                    onItemAddloading={isAddingNewSubCategory}
                    onItemAdd={(newSubCategory: string) => {
                      if (selectedCategory) {
                        categoriesService
                          .httpAddNewSubcategory({
                            category: selectedCategory,
                            name: newSubCategory,
                            price: 0,
                          })
                          .then((response) => {
                            if (response.data) {
                              fetchSubCategories();
                              setSelectedSubCategory(
                                response.data._id as string
                              );
                            }
                          })
                          .catch((err) => {
                            const error = err as AxiosError<{
                              message: string;
                            }>;
                            toast.error(error.response?.data.message);
                          })
                          .finally(() => {
                            setIsAddingNewSubCategory(false);
                          });
                      }
                    }}
                  />
                </div>
                <div className="bg-graylighty h-px w-full my-5"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-2 ">
                  <div className="md:col-start-1 md:col-end-3">
                    {/* <FormControl
                      control="input"
                      inputStyle="!py-2"
                      labelStyle="font-normal"
                      label="Description"
                      name="description"
                      // options={estimateDescriptions}
                      placeholder="Write Description"
                      mt="mt-0"
                      // setCustomState={setsSelecteddescription}
                    /> */}
                    <label
                      className={twMerge(
                        clsx(
                          'text-graphiteGray text-sm font-medium leading-6 capitalize'
                        )
                      )}
                    >
                      Description
                    </label>
                    <CreatableSelect
                      isClearable
                      placeholder="Search Description"
                      components={{
                        DropdownIndicator: CustomDropdownIndicator,
                      }}
                      onChange={(newValue) => {
                        setFieldValue('description', newValue);
                        setFieldValue('unit', newValue?.unit);
                        setFieldValue(
                          'unitLabourHour',
                          newValue?.unitLabourHour
                        );
                        setFieldValue(
                          'unitMaterialCost',
                          newValue?.unitMaterialCost
                        );
                        setFieldValue(
                          'unitEquipments',
                          newValue?.unitEquipments
                        );
                      }}
                      onCreateOption={(newDescriptionValue) => {
                        let newDescription = {
                          label: newDescriptionValue,
                          value: newDescriptionValue,
                        };
                        setFieldValue('description', newDescription);
                        setEstimateDescriptions((prev: any) => [
                          ...prev,
                          newDescription,
                        ]);
                      }}
                      isSearchable
                      options={estimateDescriptions}
                      value={values.description}
                      styles={descriptionInputStyle}
                      className={twMerge(
                        clsx(
                          `${errors.description ? 'border !border-red-500' : ''} !w-full !rounded-md focus:border-blue-500 !mt-1.5 `
                        )
                      )}
                    />
                  </div>
                  <FormControl
                    control="select"
                    inputStyle="!py-2"
                    labelStyle="font-normal"
                    label="Unit"
                    name="unit"
                    placeholder="Write Unit"
                    mt="mt-0"
                    options={EstimatesUnits}
                  />
                  <FormControl
                    control="input"
                    type="number"
                    inputStyle="!py-2"
                    labelStyle="font-normal"
                    label="Quantity"
                    name="qty"
                    placeholder="Write Quantity"
                    mt="mt-0"
                  />
                </div>
                <div className="grid grid-cols-1  grid-rows-1 md:grid-cols-6 gap-x-2 grid-y-5 mt-5">
                  {/* div close */}
                  <FormControl
                    control="input"
                    type="number"
                    name="wastage"
                    inputStyle="!py-2"
                    labelStyle="font-normal"
                    label="Wastage"
                    placeholder="Enter Wastage"
                    suffix="%"
                  />
                  <FormControl
                    control="input"
                    type="number"
                    name="unitLabourHour"
                    inputStyle="!py-2"
                    labelStyle="font-normal"
                    label="Unit labor hours"
                    placeholder="Write Unite Labor Hour"
                  />
                  <FormControl
                    control="input"
                    name="perHourLaborRate"
                    type="number"
                    inputStyle="!py-2"
                    labelStyle="font-normal"
                    label="Per hours labor rate"
                    placeholder="Enter Labor Rate"
                    min={0}
                    step="0.001"
                    prefix={userCurrency.currency?.symbol}
                  />
                  <FormControl
                    control="input"
                    inputStyle="!py-2"
                    type="number"
                    labelStyle="font-normal"
                    label="Unit material cost"
                    name="unitMaterialCost"
                    placeholder="Write Unit Material Cost"
                    min={0}
                    step="0.001"
                    prefix={userCurrency.currency?.symbol}
                  />
                  <FormControl
                    control="input"
                    type="number"
                    inputStyle="!py-2"
                    labelStyle="font-normal"
                    label="Unit equipment cost"
                    name="unitEquipments"
                    placeholder="Write Unit Equipment Cost"
                    min={0}
                    step="0.001"
                    prefix={userCurrency.currency?.symbol}
                  />
                  {editConfirmItem ? (
                    <CustomWhiteButton
                      type="submit"
                      text="Update Item"
                      className="self-end md:w-auto w-full md:my-0 mt-4 !bg-goldenrodYellow !p-2.5 !text-white"
                    />
                  ) : (
                    <CustomWhiteButton
                      type="submit"
                      text="Add Item"
                      className="self-end md:w-auto w-full md:my-0 mt-4 !bg-goldenrodYellow !p-2.5 !text-white"
                    />
                  )}
                </div>
                {/* {editConfirmItem ? (
                  <div className="flex justify-end space-x-4 mt-5">
                    <CustomWhiteButton
                      text="Cancel"
                      className="!w-32"
                      type="button"
                      onClick={() => {
                        setEditConfirmItem(false), setSingleEstimateData({});
                      }}
                    />
                  </div>
                ) : null} */}
              </Form>
              <div>
                {confirmEstimates.length
                  ? confirmEstimates.map((estimate) => (
                      <div
                        key={estimate.title}
                        className={`${bg_style} p-5 mt-3`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <QuaternaryHeading
                              title={estimate.categoryName}
                              className="font-semibold"
                            />
                            <QuaternaryHeading
                              title={estimate.subCategoryName}
                              className="!font=[#344054] font-light"
                            />
                          </div>
                        </div>
                        <div className="estimateTable_container">
                          <Table
                            className="mt-2"
                            loading={false}
                            columns={confirmColumns}
                            dataSource={
                              estimate.scopeItems as IEstimateScopeInitialValue[]
                            }
                            pagination={false}
                            scroll={{ x: 1000 }}
                          />
                        </div>
                      </div>
                    ))
                  : null}
              </div>
            </>
          );
        }}
      </Formik>

      <ModalComponent open={viewPlansModel} setOpen={setViewPlansModel}>
        <div
          className="bg-white !rounded-t-xl"
          style={{ borderRadius: '12px' }}
        >
          <div className="flex justify-between p-4 bg-[#F5F4FF] rounded-t-xl">
            <p className="text=[#344054] font-semibold text=[18px]">
              View Plan & Documents{' '}
            </p>

            <Image
              className="cursor-pointer"
              src={'/closeicon.svg'}
              alt="close icon"
              width={20}
              height={20}
              onClick={() => setViewPlansModel(false)}
            />
          </div>
          <div className="p-4">
            <div className="grid grid-cols-3 gap-4">
              {planDocuments?.map((doc: any) => (
                <div
                  key={doc.name}
                  className={`p-4  border-2 border-[#D0D5DD] rounded-lg `}
                >
                  <Image
                    src={'/documentIcon.svg'}
                    alt="documentIcon icon"
                    width={20}
                    height={20}
                  />

                  <p className="text-[#353535] text-[16px] font-[500] mt-2 truncate">
                    {doc?.name}
                  </p>
                  <p className="text-[#989692] text-[12px] font-[400] my-2">
                    {' '}
                    {byteConverter(doc?.size, 'KB').size} KB
                  </p>
                  <a
                    href={doc.url}
                    className="text-goldenrodYellow text-[12px] font-[400] my-2"
                    target="_blank"
                  >
                    Click to View
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ModalComponent>
      <ModalComponent
        open={showDeleteModal}
        setOpen={setShowDeleteModal}
        width="30%"
      >
        <DeleteContent
          onClick={deleteEstimateHandler}
          isLoading={isDeleting}
          onClose={() => setShowDeleteModal(false)}
        />
      </ModalComponent>
    </div>
  );
};

export default Scope;
