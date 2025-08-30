import CustomButton from '@/app/component/customButton/button';
import WhiteButton from '@/app/component/customButton/white';
import { InputComponent } from '@/app/component/customInput/Input';
import TertiaryHeading from '@/app/component/headings/tertiary';
import { PhoneNumberInputWithLable } from '@/app/component/phoneNumberInput/PhoneNumberInputWithLable';
import { IResponseInterface } from '@/app/interfaces/api-response.interface';
import {
  IBidManagement,
  IBidManagementProjectTeamMember,
} from '@/app/interfaces/bid-management/bid-management.interface';
import {
  CreateTeamMemberType,
  bidManagementService,
} from '@/app/services/bid-management.service';
import { postProjectActions } from '@/redux/post-project/post-project.slice';
import { AppDispatch, RootState } from '@/redux/store';
import { Drawer, Dropdown, Table } from 'antd';
import { AxiosError } from 'axios';
import { type FormikProps, useFormik } from 'formik';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { DeletePopup } from './DeletePopup';
import { isValidPhoneNumber } from 'react-phone-number-input';

type Props = {
  children?: React.ReactNode;
  formik: FormikProps<IBidManagement>;
};

const DesignTeamMemberSchema = Yup.object().shape({
  // matches should have a regex that contains at least one letter
  name: Yup.string()
    .matches(/[a-zA-Z]/, { message: 'Atleast 1 character is required' })
    .max(30, 'Name must have max 30 characters')
    .required('Name is required'),
  role: Yup.string()
    .matches(/[a-zA-Z]/, { message: 'Atleast 1 character is required' })
    .max(20, 'Role must have 20 characters')
    .required('Role is required'),
  companyName: Yup.string()
    .matches(/[a-zA-Z]/, { message: 'Atleast 1 character is required' })
    .max(50, 'Company name must have 50 characters.')
    .required('Company Name is required'),
  location: Yup.string()
    .matches(/[a-zA-Z]/, { message: 'Atleast 1 character is required' })
    .max(30, 'Location must have 30 characters.')
    .required('Location is required'),
  phoneNumber: Yup.string()
    .optional()
    .test({
      test: (value) => {
        if (value) {
          return isValidPhoneNumber(value);
        }
        return true;
      },
      message: 'Invalid phone number',
    }),
  email: Yup.string().email('Invalid email'),
});

export function PostDesignTeam({ formik, children }: Props) {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const postProjectState = useSelector((state: RootState) => state.postProject);
  const [selectedTeamMember, setSelectedTeamMember] =
    useState<IBidManagementProjectTeamMember | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (postProjectState.teamMembers.length !== 0) {
      formik.setFieldValue(
        'teamMembers',
        postProjectState.teamMembers.map((member) => member._id)
      );
    }
  }, [postProjectState.teamMembers]);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  function showDeletePopup(record: IBidManagementProjectTeamMember) {
    setIsOpen(true);
    setSelectedTeamMember(record);
  }

  function closeDeletePopup() {
    setIsOpen(false);
    setSelectedTeamMember(null);
  }

  const createTeamMemberMutation = useMutation<
    IResponseInterface<{ user: IBidManagementProjectTeamMember }>,
    AxiosError<{ message: string }>,
    CreateTeamMemberType
  >({
    mutationKey: 'createTeamMember',
    mutationFn: (values: CreateTeamMemberType) => {
      return bidManagementService.httpCreateTeamDesignMember(values);
    },
    onSuccess(res) {
      if (res.data && res.data.user) {
        toast.success('Team Member Added Successfully');
        dispatch(postProjectActions.pushTeamMemberAction(res.data.user));
      }
      onClose();
      designTeamFormik.resetForm();
    },
    onError(error) {
      if (error.response?.data) {
        toast.error(error.response?.data.message);
      }
    },
  });

  const updateTeamMemberMutation = useMutation<
    IResponseInterface<{ updatedUser: IBidManagementProjectTeamMember }>,
    AxiosError<{ message: string }>,
    CreateTeamMemberType & { userId: string }
  >({
    mutationKey: 'updateTeamMember',
    mutationFn: (values) => {
      return bidManagementService.httpUpdateTeamDesignMember(values);
    },
    onError(error) {
      if (error.response?.data) {
        toast.error(error.response?.data.message);
      }
    },
    onSuccess(res) {
      if (res.data && res.data.updatedUser) {
        // update the teamMembers in redux state
        dispatch(
          postProjectActions.updateTeamMemberAction(res.data.updatedUser)
        );
        toast.success('Team Member Updated Successfully');
        formik.resetForm();
        onClose();
        setSelectedTeamMember(null);
      }
    },
  });

  const deleteTeamMemberMutation = useMutation<
    IResponseInterface<{ deletedUser: IBidManagementProjectTeamMember }>,
    AxiosError<{ message: string }>,
    { userId: string }
  >({
    mutationKey: 'deleteTeamMember',
    mutationFn: (values) => {
      return bidManagementService.httpDeleteTeamDesignMember(values.userId);
    },
    onError(error) {
      if (error.response?.data) {
        toast.error(error.response?.data.message);
        closeDeletePopup();
      }
    },
    onSuccess(res) {
      console.log('deletedUser', res.data);
      if (res.data && res.data.deletedUser) {
        // update the teamMembers in redux state
        toast.success('Team Member Deleted Successfully');
        dispatch(
          postProjectActions.removeTeamMemberAction(res.data.deletedUser._id)
        );
        closeDeletePopup();
      }
    },
  });

  const designTeamFormik = useFormik({
    initialValues: selectedTeamMember
      ? { ...selectedTeamMember }
      : {
          name: '',
          role: '',
          companyName: '',
          location: '',
          phoneNumber: '',
          email: '',
        },
    validationSchema: DesignTeamMemberSchema,
    onSubmit: (values) => {
      if (!selectedTeamMember) {
        createTeamMemberMutation.mutate(values);
      } else {
        updateTeamMemberMutation.mutate({
          ...values,
          userId: selectedTeamMember._id,
        });
      }
    },
    enableReinitialize: true,
  });
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Action',
      key: 'action',
      render(_: any, record: any) {
        return (
          <Dropdown
            menu={{
              items: [
                {
                  key: 'edit',
                  label: <p>Edit</p>,
                },
                {
                  key: 'delete',
                  label: <p>Delete</p>,
                },
              ],
              onClick: ({ key }) => {
                if (key === 'edit') {
                  setSelectedTeamMember(record);
                  showDrawer();
                }
                if (key === 'delete') {
                  showDeletePopup(record);
                }
              },
            }}
            placement="bottomRight"
            trigger={['click']}
          >
            <Image
              src={'/menuIcon.svg'}
              alt="logo white icon"
              width={20}
              height={20}
              className="active:scale-105 cursor-pointer"
            />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div className=" bg-white shadow-[0_4px_30px_0px_#2E2D740D] rounded-xl border p-4">
      {selectedTeamMember ? (
        <DeletePopup
          closeModal={closeDeletePopup}
          message="Are you sure you want to delete this team member?"
          onConfirm={() =>
            deleteTeamMemberMutation.mutate({ userId: selectedTeamMember._id })
          }
          open={isOpen}
          title="Delete Team Member"
          isLoading={deleteTeamMemberMutation.isLoading}
        />
      ) : null}
      <div className="flex items-center justify-between">
        <TertiaryHeading
          title="Project Team"
          className="text-[20px] leading-[30px]"
        />
        <CustomButton
          text="Add New Member"
          className="!w-48"
          onClick={showDrawer}
        />
      </div>
      <Drawer
        title="Add New Member"
        placement="right"
        open={open}
        onClose={onClose}
        width={400}
        closable={false}
        extra={
          <Image
            src="/closeicon.svg"
            alt="close"
            width={20}
            height={20}
            className="cursor-pointer"
            onClick={onClose}
          />
        }
        headerStyle={{
          backgroundColor: '#E6F2F8',
        }}
      >
        <div className="space-y-3">
          <InputComponent
            label="Name"
            name="name"
            placeholder="Enter Name"
            type="text"
            field={{
              value: designTeamFormik.values.name,
              onChange: designTeamFormik.handleChange,
              onBlur: designTeamFormik.handleBlur,
            }}
            hasError={
              designTeamFormik.touched.name &&
              Boolean(designTeamFormik.errors.name)
            }
            errorMessage={
              designTeamFormik.touched.name && designTeamFormik.errors.name
                ? designTeamFormik.errors.name
                : ''
            }
          />
          <InputComponent
            label="Role"
            name="role"
            type="text"
            placeholder="Enter Role"
            field={{
              value: designTeamFormik.values.role,
              onChange: designTeamFormik.handleChange,
              onBlur: designTeamFormik.handleBlur,
            }}
            hasError={
              designTeamFormik.touched.role &&
              Boolean(designTeamFormik.errors.role)
            }
            errorMessage={
              designTeamFormik.touched.role && designTeamFormik.errors.role
                ? designTeamFormik.errors.role
                : ''
            }
          />
          <InputComponent
            label="Company Name"
            name="companyName"
            type="text"
            placeholder="Enter Company Name"
            field={{
              value: designTeamFormik.values.companyName,
              onChange: designTeamFormik.handleChange,
              onBlur: designTeamFormik.handleBlur,
            }}
            hasError={
              designTeamFormik.touched.companyName &&
              Boolean(designTeamFormik.errors.companyName)
            }
            errorMessage={
              designTeamFormik.touched.companyName &&
              designTeamFormik.errors.companyName
                ? designTeamFormik.errors.companyName
                : ''
            }
          />

          <InputComponent
            label="Location"
            name="location"
            type="text"
            placeholder="Enter Location"
            field={{
              value: designTeamFormik.values.location,
              onChange: designTeamFormik.handleChange,
              onBlur: designTeamFormik.handleBlur,
            }}
            hasError={
              designTeamFormik.touched.location &&
              Boolean(designTeamFormik.errors.location)
            }
            errorMessage={
              designTeamFormik.touched.location &&
              designTeamFormik.errors.location
                ? designTeamFormik.errors.location
                : ''
            }
          />

          <PhoneNumberInputWithLable
            label="Phone Number"
            //@ts-ignore
            onChange={(val) =>
              //@ts-ignore
              designTeamFormik.setFieldValue('phoneNumber', val)
            }
            //@ts-ignore
            value={designTeamFormik.values.phoneNumber}
            onBlur={() => designTeamFormik.setFieldTouched('phoneNumber', true)}
            defaultCountry="US"
            hasError={
              designTeamFormik.touched.phoneNumber &&
              Boolean(designTeamFormik.errors.phoneNumber)
            }
            errorMessage={
              designTeamFormik.touched.phoneNumber &&
              designTeamFormik.errors.phoneNumber
                ? designTeamFormik.errors.phoneNumber
                : ''
            }
          />

          <InputComponent
            label="Email"
            name="email"
            type="email"
            placeholder="Enter Email"
            field={{
              value: designTeamFormik.values.email,
              onChange: designTeamFormik.handleChange,
              onBlur: designTeamFormik.handleBlur,
            }}
            hasError={
              designTeamFormik.touched.email &&
              Boolean(designTeamFormik.errors.email)
            }
            errorMessage={
              designTeamFormik.touched.email && designTeamFormik.errors.email
                ? designTeamFormik.errors.email
                : ''
            }
          />

          <div className="flex items-center justify-between">
            <WhiteButton text="Cancel" className="!w-40" onClick={onClose} />
            <CustomButton
              text={selectedTeamMember ? 'Update' : 'Save'}
              className="!w-40"
              isLoading={createTeamMemberMutation.isLoading}
              loadingText="Saving..."
              onClick={() => designTeamFormik.handleSubmit()}
            />
          </div>
        </div>
      </Drawer>

      <div className="mt-5">
        <Table
          columns={columns}
          bordered
          dataSource={postProjectState.teamMembers}
        />
      </div>

      {children}
    </div>
  );
}
