import { Avatar, List, Spin } from 'antd';
import { useFormik } from 'formik';
import { useRef, useState } from 'react';
import CSVReader from 'react-csv-reader';
import CustomButton from 'src/components/CustomButton/button';
import WhiteButton from 'src/components/CustomButton/white';
import SenaryHeading from 'src/components/Headings/SenaryHeading';
import { SelectComponent } from 'src/components/customSelect/Select.component';
import { USER_ROLE_ENUM } from 'src/constants/roles.constants';
import publicNetworkService, {
  IPublicNetworkForm,
} from 'src/services/public-network.service';
import { removeEmptyRows } from 'src/utils/csv.utils';
import _ from 'lodash';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

const validationSchema = Yup.object({
  data: Yup.array()
    .min(1, 'At least one user is required')
    .required('At least one user is required'),
  role: Yup.string().required('Type of user is required'),
});

type Props = {
  onClose: () => void;
};

export function AddPublicMembers({ onClose }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isParsing, setIsParsing] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik<IPublicNetworkForm>({
    initialValues: {
      data: [],
      role: '',
    },
    async onSubmit(values) {
      setIsSubmitting(true);
      try {
        const response = await publicNetworkService.httpAddMembers(values);
        if (response.data) {
          toast.success('Members added successfully');
          onClose();
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(err.response?.data.message || 'An error occurred');
      } finally {
        setIsSubmitting(false);
      }
    },
    validationSchema,
  });

  return (
    <div className="space-y-2">
      <SelectComponent
        label="Type of User"
        name="role"
        placeholder="Select user type"
        field={{
          value: formik.values.role ? formik.values.role : undefined,
          options: [
            {
              value: USER_ROLE_ENUM.ARCHITECT,
              label: 'Architect',
            },
            {
              value: USER_ROLE_ENUM.CONTRACTOR,
              label: 'Contractor',
            },
            {
              value: USER_ROLE_ENUM.OWNER,
              label: 'Owner/Client',
            },
            {
              value: USER_ROLE_ENUM.SUBCONTRACTOR,
              label: 'Subcontractor',
            },
            {
              value: USER_ROLE_ENUM.VENDOR,
              label: 'Vendor',
            },
            {
              value: USER_ROLE_ENUM.STUDENT,
              label: 'Student',
            },
            {
              value: USER_ROLE_ENUM.PROFESSOR,
              label: 'Professor',
            },
          ] as { label: string; value: USER_ROLE_ENUM }[],

          onChange: (value) => {
            formik.setFieldValue('role', value);
          },
          onBlur: formik.handleBlur,
        }}
        hasError={Boolean(formik.errors.role) && formik.touched.role}
        errorMessage={
          formik.touched.role && formik.errors.role ? formik.errors.role : ''
        }
      />

      {formik.values.data.length ? (
        <div>
          <div className="p-3">
            <List
              dataSource={formik.values.data}
              style={{
                height: 400,
                overflowY: 'scroll',
              }}
              renderItem={(item) => (
                <List.Item key={item.email} className="mr-4">
                  <List.Item.Meta
                    avatar={<Avatar>{item.name[0]}</Avatar>}
                    title={<a href="https://ant.design">{item.name}</a>}
                    description={item.email}
                  />

                  <img
                    src="/assets/icons/closeicon.svg"
                    alt=""
                    className="cursor-pointer"
                    onClick={() => {
                      formik.setFieldValue(
                        'data',
                        formik.values.data.filter((user) => user.id !== item.id)
                      );
                    }}
                  />
                </List.Item>
              )}
              rowKey={(item) => item.id}
            />
          </div>
        </div>
      ) : null}

      <SenaryHeading
        title="OR"
        className="text-schestiLightBlack text-center text-xs"
      />

      <Spin spinning={isParsing}>
        <div>
          <SenaryHeading title="Upload your Excel sheet here" />

          <div
            className={`border border-dashed p-3 rounded-md flex items-center gap-3 ${
              formik.errors.data && formik.touched.data && 'border-red-400'
            }`}
          >
            <img
              src="/assets/icons/uploadcloud.svg"
              alt="upload icon"
              className="cursor-pointer"
            />

            <SenaryHeading title="Upload the Excel sheet" />

            <label
              htmlFor="excel-sheet"
              className="cursor-pointer text-schestiPrimary text-sm font-semibold"
              onClick={() => fileInputRef.current?.click()}
            >
              Browse here
            </label>

            <CSVReader
              ref={fileInputRef}
              cssInputClass="hidden"
              onFileLoaded={(data: Array<Array<string>>, _info, file) => {
                setIsParsing(true);
                const dataWithoutHeader = data.slice(1);
                const filteredData = removeEmptyRows(dataWithoutHeader);
                const dataArr: IPublicNetworkForm['data'] = [];
                for (let index = 0; index < filteredData.length; index++) {
                  const [
                    name,
                    phone,
                    email,
                    teamMember,
                    companyOrUniversity,
                    companyOrUniversityAddress,
                    trades,
                  ] = filteredData[index];
                  const obj: IPublicNetworkForm['data'][0] = {
                    address: companyOrUniversityAddress,
                    company: companyOrUniversity,
                    email,
                    name,
                    phone,
                    teamMembers: teamMember,
                    trades,
                    universityName: companyOrUniversity,
                    id: _.uniqueId(),
                  };
                  dataArr.push(obj);
                }
                formik.setFieldValue('data', dataArr);
                if (file) {
                  setFiles([...files, file]);
                }
                setIsParsing(false);
              }}
            />
          </div>

          <div className="flex items-center gap-3 mt-1 flex-wrap">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-full bg-schestiLightPrimary p-2 text-schestiPrimaryBlack"
              >
                <span>{file.name}</span>
                <img
                  src="/assets/icons/trash.svg"
                  alt="trash"
                  className="cursor-pointer"
                  onClick={() => {
                    setFiles(files.filter((f) => f.name !== file.name));
                  }}
                />
              </div>
            ))}
          </div>

          {formik.errors.data && formik.touched.data && (
            <p className="text-red-400 text-xs">
              {formik.errors.data as string}
            </p>
          )}
        </div>
      </Spin>
      <a
        href="/public-networking.csv"
        download={'/public-networking.csv'}
        className="text-schestiPrimary underline underline-offset-4"
      >
        Download Template
      </a>

      <div className="flex justify-end gap-2 items-center">
        <WhiteButton text="Cancel" className="!w-fit" onClick={onClose} />
        <CustomButton
          text="Add"
          className="!w-fit"
          onClick={formik.submitForm}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}
