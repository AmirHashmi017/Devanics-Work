'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import Image from 'next/image';
import FormControl from '@/app/component/formControl';
import TertiaryHeading from '@/app/component/headings/tertiary';
import Description from '@/app/component/description';
import { Skeleton } from 'antd';

import { useDispatch, useSelector } from 'react-redux';
import {
  reduxMaterialsData,
  reduxMaterialsLoading,
} from '@/redux/company/settingSlices/settingSelector';
import { AppDispatch } from '@/redux/store';
import { fetchMaterials } from '@/redux/company/settingSlices/setting.thunk';
import { materialService } from '@/app/services/material.service';
import { updateMaterialData } from '@/redux/company/settingSlices/materials.slice';
import QuaternaryHeading from '@/app/component/headings/quaternary';
import ImportMaterialModal from './importMaterialModal';
import NoData from './NoData';
import CustomButton from '@/app/component/customButton/button';
import { IMaterialSetting } from '@/app/interfaces/settings/material-settings.interface';
import { SelectComponent } from '@/app/component/customSelect/Select.component';
import _ from 'lodash';

type InitialValuesTypes = {
  unitLabourHour: string;
  unitMaterialCost: string;
  unitEquipments: string;
  category: string;
  subCategory: string;
  _id?: string;
};
const Materials = () => {
  const dispatch = useDispatch<AppDispatch>();

  const materialsData = useSelector(reduxMaterialsData);
  const materialsLoading = useSelector(reduxMaterialsLoading);
  const [search, setSearch] = useState('');
  const [materialModal, setMaterialModal] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [collapsed, setCollapsed] = useState('');
  const [meterialDataWithCategories, setMeterialDataWithCategories] = useState<
    IMaterialSetting[]
  >([]);

  const fetchMaterialsData = useCallback(async () => {
    let result: any = await dispatch(fetchMaterials({ page: 1, limit: 10 }));
    if (result.payload.data.length) {
      setMeterialDataWithCategories(result.payload.data);
      setCollapsed(
        result.payload.data[0]._id
          ? result.payload.data[0]._id.subcategoryId
          : ''
      );
    }
  }, []);

  useEffect(() => {
    fetchMaterialsData();
  }, []);

  const initialValues: InitialValuesTypes = {
    unitLabourHour: '',
    unitMaterialCost: '',
    unitEquipments: '',
    category: '',
    subCategory: '',
  };

  const validationSchema = Yup.object({
    unitLabourHour: Yup.string().required('Unit Labor Hour is required!'),
    unitMaterialCost: Yup.string().required('Unit Material Cost is required!'),
    unitEquipments: Yup.string().required('Unit Equipment is required!'),
  });

  const handleUpdateMaterial = async ({
    unitEquipments,
    unitLabourHour,
    unitMaterialCost,
  }: InitialValuesTypes) => {
    const { statusCode, data } = await materialService.httpUpdateMaterial(
      selectedRowId,
      { unitEquipments, unitLabourHour, unitMaterialCost }
    );

    if (statusCode === 200) {
      setSelectedRowId('');
      fetchMaterialsData();
      updateMaterialData(data);
    }
  };
  const filteredData = meterialDataWithCategories
    .filter((item) => {
      if (!search) {
        return true;
      }
      return (
        item._id.categoryName.toLowerCase().includes(search.toLowerCase()) ||
        item._id.subcategoryName.toLowerCase().includes(search.toLowerCase())
      );
    })
    .filter((item) => {
      if (!categoryFilter) {
        return true;
      }
      return item._id.subcategoryId === categoryFilter;
    });

  const dropdownOptions = _.uniqBy(
    meterialDataWithCategories.map((item) => {
      return {
        label: `${item._id.categoryName} - ${item._id.subcategoryName}`,
        value: item._id.subcategoryId,
      };
    }),
    'value'
  );

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={handleUpdateMaterial}
      >
        {({ handleSubmit, values, setFieldValue }) => {
          return (
            <Form
              name="basic"
              onSubmit={handleSubmit}
              autoComplete="off"
              className="mt-2"
            >
              {materialsLoading ? (
                <Skeleton />
              ) : materialsData?.length ? (
                <>
                  <div className="flex justify-between items-center gap-4">
                    <TertiaryHeading title="Materials" />
                    <div className="flex gap-4 items-center">
                      <div className="rounded-lg border border-Gainsboro w-[335px] h-[40px]  flex items-center px-3">
                        <input
                          type="search"
                          name=""
                          id=""
                          placeholder="Search..."
                          onChange={(e) => setSearch(e.target.value)}
                          value={search}
                          className="w-full h-full bg-transparent outline-none"
                        />
                        <Image
                          src={'/search.svg'}
                          alt="search icon "
                          width={16}
                          height={16}
                          className="cursor-pointer"
                        />
                      </div>
                      <SelectComponent
                        label=""
                        placeholder="Category"
                        name="category"
                        field={{
                          value: categoryFilter ? categoryFilter : undefined,
                          options: dropdownOptions,
                          onChange(val) {
                            setCategoryFilter(val);
                          },
                          allowClear: true,
                          onClear() {
                            setCategoryFilter('');
                          },
                          dropdownStyle: {
                            width: 300,
                          },
                        }}
                      />
                      <CustomButton
                        type="button"
                        text="Import Materials"
                        className="!w-auto !p-2.5"
                        icon="/plus.svg"
                        iconwidth={20}
                        iconheight={20}
                        onClick={() => setMaterialModal(true)}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="grid grid-cols-8 sm:grid-cols-8 md:grid-cols-8 lg:grid-cols-8 xl:grid-cols-8 overflow-x-auto !bg-schestiLightGray p-3 rounded-lg gap-4 mt-7 bg-opacity-10">
                      <Description title="Description" className="col-span-2" />
                      <Description title="Unit" className="col-span-1" />
                      <Description
                        title="Unit Labor Hour"
                        className="col-span-1"
                      />
                      <Description
                        title="Unit material cost"
                        className="col-span-1"
                      />
                      <Description
                        title="Unit equipment's"
                        className="col-span-1"
                      />
                      <Description
                        title="Actions"
                        className="col-span-1 text-center"
                      />
                    </div>
                    <div className="gap-4">
                      {materialsLoading && !filteredData.length ? (
                        <div className="mt-4">
                          <Skeleton />
                        </div>
                      ) : (
                        filteredData.map(
                          ({ _id: category, materialsData }, i: number) => {
                            return (
                              <div key={i}>
                                <div className="flex items-center gap-3 mt-4 border-b pb-2">
                                  <QuaternaryHeading
                                    title={category.categoryName}
                                    className="font-bold capitalize"
                                  />
                                  <QuaternaryHeading
                                    title={category.subcategoryName}
                                    className="!text-[#667085] capitalize"
                                  />
                                  <div className="bg-silverGray rounded-s border border-solid border-Gainsboro cursor-pointer w-5 h-5 flex justify-center items-center">
                                    <Image
                                      src={'/chevron-down.svg'}
                                      alt="icon"
                                      width={16}
                                      height={16}
                                      className="cursor-pointer"
                                      onClick={() => {
                                        if (
                                          collapsed === category.subcategoryId
                                        ) {
                                          setCollapsed('');
                                        } else {
                                          setCollapsed(category.subcategoryId);
                                        }
                                      }}
                                    />
                                  </div>
                                </div>
                                {collapsed === category.subcategoryId &&
                                  materialsData?.map(
                                    ({
                                      _id,
                                      description,
                                      unit,
                                      unitLabourHour,
                                      unitMaterialCost,
                                      unitEquipments,
                                    }: any) => (
                                      <div key={_id} className="mt-3">
                                        <div className="grid grid-cols-8 gap-2 border border-b-graphiteGray border-transparent p-3 mt-3 border-opacity-20 bg-opacity-10 items-center">
                                          <Description
                                            title={description}
                                            className="col-span-2"
                                          />
                                          <Description
                                            title={unit}
                                            className="col-span-1"
                                          />
                                          <div className="col-span-1">
                                            <FormControl
                                              control="simpleInput"
                                              type="text"
                                              value={
                                                _id === selectedRowId
                                                  ? values.unitLabourHour
                                                  : unitLabourHour
                                              }
                                              disabled={_id !== selectedRowId}
                                              placeholder="Labour Hour"
                                              name="unitLabourHour"
                                            />
                                          </div>
                                          <div className="col-span-1">
                                            <FormControl
                                              control="simpleInput"
                                              type="text"
                                              value={
                                                _id === selectedRowId
                                                  ? values.unitMaterialCost
                                                  : unitMaterialCost
                                              }
                                              disabled={_id !== selectedRowId}
                                              placeholder="Material Cost"
                                              name="unitMaterialCost"
                                              prefix="$"
                                            />
                                          </div>
                                          <div className="col-span-1 flex gap-2">
                                            <FormControl
                                              control="simpleInput"
                                              type="text"
                                              value={
                                                _id === selectedRowId
                                                  ? values.unitEquipments
                                                  : unitEquipments
                                              }
                                              disabled={_id !== selectedRowId}
                                              placeholder="Unit Equipment"
                                              name="unitEquipments"
                                              prefix="$"
                                            />
                                          </div>
                                          <div className="col-span-1 flex justify-center items-center">
                                            {_id === selectedRowId ? (
                                              <button
                                                className="bg-transparent cursor-pointer text-[#7138DF] border-[1px] border-[#7138DF] text-[16px] rounded p-1"
                                                type="submit"
                                              >
                                                Update
                                              </button>
                                            ) : (
                                              <>
                                                <Image
                                                  src={
                                                    _id === selectedRowId
                                                      ? '/hand-drawn-tick.svg'
                                                      : '/edit-05.svg'
                                                  }
                                                  className="cursor-pointer w-8 h-5"
                                                  width={20}
                                                  height={20}
                                                  alt="edit"
                                                  onClick={() => {
                                                    if (_id !== selectedRowId) {
                                                      setFieldValue(
                                                        'unitMaterialCost',
                                                        unitMaterialCost
                                                      );
                                                      setFieldValue(
                                                        'unitLabourHour',
                                                        unitLabourHour
                                                      );
                                                      setFieldValue(
                                                        'unitEquipments',
                                                        unitEquipments
                                                      );
                                                      setSelectedRowId(_id);
                                                    }
                                                  }}
                                                />
                                                <Image
                                                  src="/trash-2.svg"
                                                  className="cursor-pointer w-8"
                                                  width={20}
                                                  height={20}
                                                  alt="delete"
                                                  onClick={async () => {
                                                    const { statusCode } =
                                                      await materialService.httpDeleteMaterial(
                                                        _id
                                                      );
                                                    if (statusCode === 200) {
                                                      fetchMaterialsData();
                                                      // dispatch(deleteMaterialData(data));
                                                    }
                                                  }}
                                                />
                                              </>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )}
                              </div>
                            );
                          }
                        )
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <NoData setMaterialModal={setMaterialModal} />
              )}
            </Form>
          );
        }}
      </Formik>
      <ImportMaterialModal
        materialModal={materialModal}
        fetchMaterialsData={fetchMaterialsData}
        setMaterialModal={setMaterialModal}
      />
    </>
  );
};

export default Materials;
