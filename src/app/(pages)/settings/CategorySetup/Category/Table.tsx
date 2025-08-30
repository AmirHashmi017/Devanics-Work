import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useCallback, useEffect } from 'react';
import { AppDispatch } from '@/redux/store';
import {
  deleteCategory,
  fetchCategories,
} from '@/redux/company/settingSlices/companySetup.thunk';
import {
  companySetupCategoriesData,
  companySetupCategoriesLoading,
} from '@/redux/company/companySelector';
import { setCategoryData } from '@/redux/company/settingSlices/categories/category.slice';
import { ICategory } from '@/app/interfaces/companyInterfaces/setting.interface';

export interface DataType {
  categoryId: string;
  companyName: string;
  name?: string;
  _id: string;
  action: string;
}

type Props = {
  onEdit: () => void;
  onDelete: () => void;
};

const CategoryTable = ({ onDelete, onEdit }: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const selectCompanySetupData = useSelector(companySetupCategoriesData);
  const companySetupLoading = useSelector(companySetupCategoriesLoading);

  const fetchCategoriesHandler = useCallback(async () => {
    await dispatch(fetchCategories({ page: 1, limit: 10 }));
  }, [dispatch]);

  useEffect(() => {
    fetchCategoriesHandler();
  }, []);

  const columns: ColumnsType<ICategory> = [
    {
      title: 'Category #',
      dataIndex: 'categoryId',
    },
    {
      title: 'Category  Name',
      dataIndex: 'name',
    },

    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      key: 'action',
      render: (_, categoryData) => (
        <div className="flex gap-2 justify-center">
          <Image
            src="/edit-2.svg"
            className="cursor-pointer"
            width={20}
            height={20}
            alt="edit"
            onClick={() => {
              onEdit();
              dispatch(setCategoryData(categoryData));
              console.log({ categoryData }, 'category data in edit');
            }}
          />
          <Image
            src="/trash-2.svg"
            className="cursor-pointer"
            width={20}
            height={20}
            alt="delete"
            onClick={() => {
              onDelete();
              console.log(categoryData, 'category data in edit delete');
              dispatch(deleteCategory(categoryData._id!));
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <Table
        loading={companySetupLoading}
        columns={columns}
        className="mt-4"
        dataSource={selectCompanySetupData ? selectCompanySetupData : []}
        pagination={{ position: ['bottomCenter'] }}
      />
    </div>
  );
};

export default CategoryTable;
