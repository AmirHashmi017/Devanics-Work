import ModalComponent from '@/app/component/modal';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import WhiteButton from '@/app/component/customButton/white';
import CustomButton from '@/app/component/customButton/button';
import { DeleteOutlined } from '@ant-design/icons';

type ItemType = {
  email: string;
};

type Props<T extends ItemType> = {
  data: T[];
  duplicates?: T[];
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  columns: ColumnsType<T>;
  setData: React.Dispatch<React.SetStateAction<T[]>>;
};
export function PreviewCSVImportFileModal<T extends ItemType>({
  data,
  onClose,
  onConfirm,
  isLoading,
  columns,
  setData,
  title = 'CSV Preview',
  duplicates = [],
}: Props<T>) {
  function isDuplicate(record: T) {
    return duplicates.some((item) => item.email === record.email);
  }

  return data.length ? (
    <ModalComponent open={data.length > 0} setOpen={() => {}} width="70%">
      <div className="bg-white p-5 rounded-md">
        <div className="my-2 mb-6 text-schestiPrimary font-semibold text-[16px] leading-5">
          {title}
        </div>
        <Table
          dataSource={data}
          columns={[
            ...columns.slice(0, columns.length - 2),
            {
              title: 'Action',
              render(record) {
                return (
                  <DeleteOutlined
                    className="text-red-400 cursor-pointer text-base"
                    onClick={() => {
                      setData(
                        data.filter((item) => item.email !== record.email)
                      );
                    }}
                  />
                );
              },
            },
          ]}
          pagination={{ position: ['bottomCenter'] }}
          rowClassName={(record) => (isDuplicate(record) ? 'bg-red-100' : '')}
        />

        <div className="flex justify-end space-x-3">
          <WhiteButton text="Cancel" onClick={onClose} className="!w-fit" />
          <CustomButton
            text="Import Data"
            className="!w-fit"
            onClick={onConfirm}
            isLoading={isLoading}
          />
        </div>
      </div>
    </ModalComponent>
  ) : null;
}
