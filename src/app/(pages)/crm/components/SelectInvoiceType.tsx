import ModalComponent from '@/app/component/modal';
import { Popups } from '../../bid-management/components/Popups';
import { Radio, Space } from 'antd';
import { useState } from 'react';
import CustomButton from '@/app/component/customButton/button';

type Props = {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  onChange: (value: 'aia' | 'standard') => void;
};
export function SelectInvoiceType({ show, setShow, onChange }: Props) {
  const [value, setValue] = useState('aia');

  return (
    <ModalComponent open={show} setOpen={setShow} width="30%">
      <Popups title="Select Invoice Type" onClose={() => setShow(false)}>
        <div className="space-y-3">
          <div>
            <Radio.Group
              onChange={(e) => {
                setValue(e.target.value);
              }}
              value={value}
            >
              <Space direction="vertical">
                <Radio value={'aia'}>AIA Invoice</Radio>
                <Radio value={'standard'}>Standard Invoice</Radio>
              </Space>
            </Radio.Group>
          </div>

          <div className="flex justify-end">
            <CustomButton
              text="Continue"
              className="!text-schestiPrimary !bg-schestiLightPrimary !w-fit"
              onClick={() => {
                onChange(value as any);
                setShow(false);
              }}
            />
          </div>
        </div>
      </Popups>
    </ModalComponent>
  );
}
