import { Popups } from '@/app/(pages)/bid-management/components/Popups';
import CustomButton from '@/app/component/customButton/button';
import WhiteButton from '@/app/component/customButton/white';
import { InputComponent } from '@/app/component/customInput/Input';
import ModalComponent from '@/app/component/modal';
import { IDailyWorkPriorty } from '@/app/interfaces/crm/crm-daily-work.interface';
import { useState } from 'react';
import * as Yup from 'yup';
import { dailyWorkColors } from '../utils';
import { useFormik } from 'formik';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import crmDailyWorkService from '@/app/services/crm/crm-daily-work.service';
import Image from 'next/image';
import { ChooseColor } from './ChooseColor';
import { Spin, Tooltip } from 'antd';
import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import { DisplayPriority } from './DisplayPriority';

type Props = {
  priorities: IDailyWorkPriorty[];
  onCreate: (_priority: IDailyWorkPriorty) => void;
  isFetching: boolean;
  onUpdate: (_priority: IDailyWorkPriorty) => void;
  onDelete: (_priority: IDailyWorkPriorty) => void;
};

const ValidationSchema = Yup.object().shape({
  name: Yup.string().required('Priority Name is required!'),
});

export function ManagePriority({
  priorities,
  onCreate,
  isFetching,
  onUpdate,
  onDelete,
}: Props) {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik<{
    name: string;
    color?: string;
    _id?: string;
  }>({
    initialValues: {
      name: '',
    },
    validationSchema: ValidationSchema,
    onSubmit: (values) => {
      if (values._id) {
        updatePriority({ ...values } as any);
      } else {
        createPriority({
          ...values,
          color: dailyWorkColors[dailyWorkColors.length - 1],
        });
      }
    },
    enableReinitialize: true,
  });

  async function createPriority(values: { name: string; color: string }) {
    setIsSubmitting(true);
    try {
      const response =
        await crmDailyWorkService.httpCreateDailyWorkPriority(values);
      if (response.data) {
        toast.success('Priority created successfully');
        formik.resetForm();
        onCreate(response.data);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function updatePriority(values: {
    name: string;
    color: string;
    _id: string;
  }) {
    setIsSubmitting(true);
    try {
      const response =
        await crmDailyWorkService.httpUpdateDailyWorkPriority(values);
      if (response.data) {
        toast.success('Priority updated successfully');
        onUpdate(response.data);
        formik.resetForm();
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleOnClose() {
    setShowModal(false);
    formik.resetForm();
  }

  function deletePriorityById(id: string) {
    setIsSubmitting(true);
    crmDailyWorkService
      .httpDeleteDailyWorkPriority(id)
      .then((response) => {
        if (response.data) {
          toast.success('Priority deleted successfully');
          onDelete(response.data);
          formik.resetForm();
        }
      })
      .catch((error) => {
        const err = error as AxiosError<{ message: string }>;
        toast.error(err.response?.data.message || 'An error occurred');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <>
      <ModalComponent
        open={!isFetching && showModal}
        setOpen={handleOnClose}
        width="600px"
        destroyOnClose
      >
        <Popups title="Manage Priority" onClose={handleOnClose}>
          <Spin spinning={isSubmitting} indicator={<LoadingOutlined spin />}>
            <div className="space-y-3">
              <InputComponent
                label="Priority"
                name="name"
                type="text"
                placeholder="Enter Priority"
                field={{
                  value: formik.values.name,
                  onChange: formik.handleChange,
                  onBlur: formik.handleBlur,
                }}
                hasError={formik.touched.name && Boolean(formik.errors.name)}
                errorMessage={
                  formik.touched.name && formik.errors.name
                    ? formik.errors.name
                    : ''
                }
              />
              <div className="max-h-[300px] overflow-y-auto">
                {priorities.length === 0 ? (
                  <p className="text-center font-semibold text-base">
                    No Priority
                  </p>
                ) : (
                  priorities.map((priority, index) => {
                    return (
                      <div
                        key={index}
                        className="flex hover:bg-gray-50 cursor-pointer relative items-center px-3 justify-between border-b border-[#E5E7EB] py-3"
                        onClick={() => {
                          formik.setFieldValue('name', priority.name);
                          formik.setFieldError('name', '');
                          formik.setFieldValue('_id', priority._id);
                        }}
                      >
                        <DisplayPriority item={priority} />

                        <Tooltip
                          overlayStyle={{
                            minWidth: '230px',
                          }}
                          title={
                            <div>
                              <Spin spinning={isSubmitting}>
                                <ChooseColor
                                  onSelectColor={(color) => {
                                    updatePriority({
                                      _id: priority._id,
                                      name: priority.name,
                                      color,
                                    });
                                  }}
                                  itemColor={priority.color}
                                />
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deletePriorityById(priority._id);
                                  }}
                                  className="border-t text-red-500 space-x-2 text-base cursor-pointer py-3 flex items-center border-gray-200"
                                >
                                  <DeleteOutlined className="text-xl" />
                                  <span>Delete</span>
                                </div>
                              </Spin>
                            </div>
                          }
                          placement="bottom"
                          color="#fff"
                        >
                          <Image
                            src="/menuIcon.svg"
                            alt="logo white icon"
                            width={20}
                            height={20}
                            className="cursor-pointer"
                          />
                        </Tooltip>
                      </div>
                    );
                  })
                )}
              </div>
              {formik.values.name ? (
                <div className="flex justify-end ">
                  <CustomButton
                    text="Save"
                    className="!w-fit"
                    onClick={formik.handleSubmit}
                  />
                </div>
              ) : null}
            </div>
          </Spin>
        </Popups>
      </ModalComponent>
      <WhiteButton
        text="Manage Priority"
        className="!w-fit !py-2.5"
        onClick={() => setShowModal(!showModal)}
        isLoading={isFetching}
        loadingText="Loading..."
      />
    </>
  );
}
