import CustomButton from '@/app/component/customButton/button';
import { CheckOutlined } from '@ant-design/icons';
import { ColorPicker } from 'antd';
import Image from 'next/image';

type Props = {
  active?: string;
  onPrimaryClick: () => void;
  onSecondaryClick: (_color: string) => void;
};

export function SelectBrandingColor({
  active,
  onPrimaryClick,
  onSecondaryClick,
}: Props) {
  return (
    <div className="px-3 items-center flex justify-end space-x-3">
      <div className=" relative">
        <CustomButton
          text="Primary"
          // onClick={() => {
          //   setFieldValue('brandingColor', '');
          // }}
          onClick={onPrimaryClick}
          className="!w-40"
        />

        {!active ? (
          <CheckOutlined className="text-white text-xs bg-[#4CAF50] rounded-full p-1 absolute -top-1 right-0" />
        ) : (
          <CheckOutlined className="text-white text-xs bg-[#E7E7E7] rounded-full p-1 absolute -top-1 right-0" />
        )}
      </div>

      <div className=" relative">
        <ColorPicker
          value={active}
          onChange={(color) => {
            console.log(color.toHexString());
            onSecondaryClick(color.toHexString());
          }}
        >
          <button
            style={{
              backgroundColor: active ? active : '#001556',
              borderColor: active ? active : '#001556',
            }}
            type="button"
            className={`rounded-[8px] border border-solid text-white leading-6 font-semibold py-2 px-5  cursor-pointer shadow-scenarySubdued text-right h-auto text-sm w-40`}
          >
            <Image
              alt="color picker"
              src={'/Group.svg'}
              width={30}
              height={30}
            />
          </button>
          {active ? (
            <CheckOutlined className="text-white text-xs bg-[#4CAF50] rounded-full p-1 absolute -top-1 right-0" />
          ) : (
            <CheckOutlined className="text-white text-xs bg-[#E7E7E7] rounded-full p-1 absolute -top-1 right-0" />
          )}
        </ColorPicker>
      </div>
    </div>
  );
}
