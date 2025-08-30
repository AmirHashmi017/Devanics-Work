import CustomButton from '@/app/component/customButton/button';
import WhiteButton from '@/app/component/customButton/white';
import { SelectComponent } from '@/app/component/customSelect/Select.component';
import ModalComponent from '@/app/component/modal';
import { useCurrencyFormatter } from '@/app/hooks/useCurrencyFormatter';
import { ICategory } from '@/app/interfaces/companyInterfaces/setting.interface';
import { ISettingSubCategoryParsedType } from '@/app/interfaces/settings/categories-settings.interface';
import { categoriesService } from '@/app/services/categories.service';
import { fetchSubCategories } from '@/redux/company/settingSlices/companySetup.thunk';
import { AppDispatch } from '@/redux/store';
import { LoadingOutlined } from '@ant-design/icons';
import { Alert, Spin, Table, Upload } from 'antd';
import type { RcFile } from 'antd/es/upload';
import { AxiosError } from 'axios';
import Image from 'next/image';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  categories: ICategory[];
};

export function UploadSubCategoriesModal({ open, setOpen, categories }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<
    ICategory | undefined
  >(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const currency = useCurrencyFormatter();
  const [error, setError] = useState('');
  const [parsedData, setParsedData] = useState<ISettingSubCategoryParsedType[]>(
    []
  );
  const [isInsertingMany, setIsInsertingMany] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const categoryOptions = categories.map((category) => {
    return {
      label: (
        <p className="text-[14px] text-black font-normal space-x-2 leading-3">
          <span className="text-schestiLightBlack">{category.categoryId}</span>
          <span>{category.name}</span>
        </p>
      ),
      value: category._id!,
    };
  });

  async function handleUpload(file: RcFile) {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response =
        await categoriesService.httpParseSubCategoriesCSV(formData);
      if (response.data) {
        toast.success('Data parsed successfully');
        setParsedData(response.data);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errMessage =
        err.response?.data.message ||
        'An error occurred while uploading the file';
      setError(errMessage);
    } finally {
      setIsUploading(false);
    }
  }

  async function insertManySubCategories(
    category: ICategory,
    data: ISettingSubCategoryParsedType[]
  ) {
    setIsInsertingMany(true);
    try {
      const response = await categoriesService.httpInsertManySubCategories(
        data.map((item) => ({
          ...item,
          category: category._id!,
        }))
      );
      if (response.data) {
        await dispatch(fetchSubCategories({ page: 1, limit: 10 }));
        setSelectedCategory(undefined);
        setOpen(false);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data.message);
    } finally {
      setIsInsertingMany(false);
    }
  }

  return (
    <ModalComponent
      open={open}
      setOpen={setOpen}
      width={parsedData.length ? '70%' : '40%'}
    >
      <div className="bg-white rounded-md p-5 gap-3">
        <div className="flex justify-between items-center">
          <p className="text-base font-semibold text-schestiPrimaryBlack ">
            Upload Sub Category
          </p>
          <Image
            alt="close"
            src={'/closeicon.svg'}
            width={16}
            height={16}
            className="cursor-pointer"
            onClick={() => setOpen(false)}
          />
        </div>

        {error.length ? (
          <Alert
            type="error"
            message="CSV Parse Error"
            description={error}
            closable
            onClose={() => {
              setError('');
            }}
          />
        ) : null}

        <div className="py-3 gap-2 space-y-2">
          <SelectComponent
            label="Category"
            name=""
            placeholder="Chooose Category"
            labelStyle="!font-medium"
            field={{
              options: categoryOptions,
              showSearch: true,
              value: selectedCategory?._id,
              onChange(value) {
                const item = categories.find((category) => {
                  return category._id === value;
                });
                if (item) {
                  setSelectedCategory(item);
                }
              },
              allowClear: true,
              onClear() {
                setSelectedCategory(undefined);
              },
            }}
          />

          {parsedData.length ? (
            <div>
              <Table
                dataSource={parsedData}
                columns={[
                  { title: 'Sub Category Name', dataIndex: 'name' },
                  {
                    title: 'Labour Per Hour',
                    dataIndex: 'price',
                    render(value) {
                      return currency.format(Number(value));
                    },
                  },
                  {
                    title: 'Action',
                    render: (_value, _record, index) => {
                      return (
                        <Image
                          alt="trash"
                          src={'/trash-2.svg'}
                          width={20}
                          height={20}
                          className="cursor-pointer"
                          onClick={() => {
                            const slice = parsedData.slice(0, index);
                            const rest = parsedData.slice(index + 1);
                            setParsedData([...slice, ...rest]);
                          }}
                        />
                      );
                    },
                  },
                ]}
                pagination={{
                  position: ['bottomCenter'],
                }}
              />

              <div className="flex justify-end space-x-3">
                <WhiteButton
                  text="Cancel"
                  onClick={() => setParsedData([])}
                  className="!w-fit"
                />
                <CustomButton
                  text="Import Data"
                  className="!w-fit"
                  loadingText="Importing..."
                  isLoading={isInsertingMany}
                  onClick={() => {
                    if (selectedCategory) {
                      insertManySubCategories(selectedCategory, parsedData);
                    }
                  }}
                />
              </div>
            </div>
          ) : (
            <Spin spinning={isUploading} indicator={<LoadingOutlined spin />}>
              <Upload.Dragger
                name={'file'}
                accept=".csv, .xls, .xlsx"
                fileList={[]}
                disabled={!selectedCategory}
                beforeUpload={(_file, FileList) => {
                  for (const file of FileList) {
                    const isLessThan500MB = file.size < 500 * 1024 * 1024; // 500MB in bytes
                    if (!isLessThan500MB) {
                      toast.error('File size should be less than 500MB');
                      return false;
                    }
                  }
                  if (selectedCategory) {
                    handleUpload(_file);
                  }

                  return false;
                }}
                style={{
                  borderStyle: 'dashed',
                  borderWidth: 2,
                  marginTop: 12,
                  backgroundColor: 'transparent',
                }}
                itemRender={() => {
                  return null;
                }}
              >
                <p className="ant-upload-drag-icon">
                  <Image
                    src={'/uploadcloudcyan.svg'}
                    width={50}
                    height={50}
                    alt="upload"
                  />
                </p>
                <p className="text-[18px] font-semibold py-2 leading-5 text-[#2C3641]">
                  Drop your files here, or browse
                </p>

                <p className="text-sm font-normal text-center py-2 leading-5 text-[#2C3641]">
                  or
                </p>

                <CustomButton
                  disabled={!selectedCategory}
                  text="Select File"
                  className="!w-fit !px-6 !bg-schestiLightPrimary !text-schestiPrimary !py-2 !border-schestiLightPrimary"
                />
              </Upload.Dragger>
            </Spin>
          )}
        </div>
      </div>

      {error.length ? (
        <Alert
          type="error"
          message="CSV Parse Error"
          description={error}
          closable
          onClose={() => {
            setError('');
          }}
        />
      ) : null}
    </ModalComponent>
  );
}
