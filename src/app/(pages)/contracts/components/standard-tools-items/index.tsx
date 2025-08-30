import Image from 'next/image';
import { PdfContractMode, ToolState } from '../../types';
import ModalComponent from '@/app/component/modal';
import { Popups } from '@/app/(pages)/bid-management/components/Popups';
import { DateInputComponent } from '@/app/component/cutomDate/CustomDateInput';
import dayjs from 'dayjs';
import { InputComponent } from '@/app/component/customInput/Input';
import { Spin, Tabs, Upload } from 'antd';
import CustomButton from '@/app/component/customButton/button';
import { toast } from 'react-toastify';
import { useEffect, useRef, useState } from 'react';
import {
  ChooseFont,
  ChooseFontType,
  SignatureFonts,
} from '@/app/component/fonts';
import AwsS3 from '@/app/utils/S3Intergration';
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import {
  ContractPartyType,
  ICrmContract,
} from '@/app/interfaces/crm/crm-contract.interface';
import { GetStandardToolIcon } from './GetIcon';
import SignaturePad from 'react-signature-pad-wrapper';
import { FileInterface } from '@/app/interfaces/file.interface';
import moment from 'moment';

type Props = {
  item: ToolState;
  mode: PdfContractMode;
  onDelete?: () => void;
  onClick?: () => void;
  onClose?: () => void;
  selectedTool: ToolState | null;
  onChange?: (_item: ToolState, _shouldClose?: boolean) => void;
  contract: ICrmContract;
  color: string;
  tools?: ToolState[];
  receipt: ContractPartyType | null;
  // This field is just for representing which tool to fill, this field is to be used with sign contract page
  toolToFill?: ToolState;
};
export function StandardToolItem({
  item,
  mode,
  onDelete,
  onClick,
  onClose,
  selectedTool,
  onChange,
  contract,
  color,
  tools,
  receipt,
  toolToFill,
}: Props) {
  if (mode === 'add-values') {
    return (
      <div
        style={{
          position: 'absolute',
          left: item.position.x,
          top: item.position.y,
          cursor: 'pointer',
          padding: 0,
          margin: 0,
          backgroundColor: 'transparent',
        }}
      >
        {selectedTool ? (
          <ModalComponent
            open={true}
            setOpen={() => {}}
            width={'300px'}
            key={selectedTool.tool}
            className={'!bg-transparent !h-fit'}
          >
            <Popups
              title="Add Standard Tools"
              onClose={onClose ? onClose : () => {}}
            >
              <StandardToolInput
                contract={contract}
                item={selectedTool}
                onChange={onChange}
                tools={tools}
                receipt={receipt}
              />
            </Popups>
          </ModalComponent>
        ) : null}
        <Item
          receipt={receipt}
          color={color}
          item={item}
          mode={mode}
          onClick={onClick}
          toolToFill={toolToFill}
        />
      </div>
    );
  } else if (mode === 'view-fields' || mode === 'view-values') {
    return (
      <div
        style={{
          position: 'absolute',
          left: item.position.x,
          top: item.position.y,
          padding: 0,
          margin: 0,
          backgroundColor: 'transparent',
        }}
      >
        <Item receipt={receipt} color={color} item={item} mode={mode} />
      </div>
    );
  } else if (mode === 'edit-fields') {
    return (
      <Item
        receipt={null}
        color={color}
        item={item}
        mode={mode}
        onDelete={onDelete}
      />
    );
  }
  return null;
}

type ItemProps = {
  item: ToolState;
  mode: PdfContractMode;
  onDelete?: () => void;
  color: string;
  onClick?: () => void;
  receipt: ContractPartyType | null;
  toolToFill?: ToolState;
};
// Item component is a placeholder for the standard tools, it will be shown if there is no value for the standard tool
function Item({
  item,
  receipt,
  mode,
  onClick,
  onDelete,
  color,
  toolToFill,
}: ItemProps) {
  return (
    <div
      onClick={() => {
        if (mode == 'edit-fields') {
          return;
        }

        onClick?.();
      }}
      className={`p-3 rounded-lg border-2 h-fit text-xs relative font-semibold  flex items-center space-x-2 border-dashed m-0 ${toolToFill?.id === item.id ? 'shadow-2xl' : ''}`}
      style={{
        borderColor:
          toolToFill?.id === item.id && !item.value
            ? 'red'
            : item.value
              ? 'transparent'
              : !item.value
                ? `${color}`
                : '#848c9d',
        backgroundColor: item.value ? 'transparent' : 'white',
        color,
      }}
    >
      {!item.value ? <GetStandardToolIcon type={item.tool} /> : null}

      <RenderStandardInputValue receipt={receipt} item={item} mode={mode} />

      {mode === 'edit-fields' && (
        <CloseOutlined
          onClick={(e) => {
            onDelete?.();
            e.stopPropagation();
            console.log('Delete');
          }}
          className="cursor-pointer p-0.5 absolute text-white -top-2 bg-black rounded-full -right-1 text-sm"
          alt="delete"
        />
      )}
    </div>
  );
}

type InputProps = {
  item: ToolState;
  onChange?: (_item: ToolState, _shouldClose?: boolean) => void;
  contract: ICrmContract;
  tools?: ToolState[];
  receipt: ContractPartyType | null;
};

function StandardToolInput({
  item,
  onChange,
  contract,
  tools,
  receipt,
}: InputProps) {
  if (item.tool === 'date') {
    return (
      <DateInputComponent
        label="Date"
        name="date"
        fieldProps={{
          value: item.value ? dayjs(item.value as string) : undefined,
          onChange(_date, dateString) {
            if (onChange) {
              onChange({ ...item, value: dateString as string });
            }
          },
        }}
      />
    );
  } else if (item.tool === 'initials') {
    return (
      <GetInitialToolValue
        contract={contract}
        item={item}
        onChange={onChange}
        tools={tools}
        receipt={receipt}
      />
    );
  } else if (item.tool === 'comment') {
    return <GetCommentToolValue item={item} onChange={onChange} />;
  } else if (item.tool === 'signature') {
    return (
      <GetSignatureValue item={item} onChange={onChange} receipt={receipt} />
    );
  }

  return '';
}

function RenderStandardInputValue({
  item,
  mode,
  receipt,
}: {
  item: ToolState;
  mode: PdfContractMode;
  receipt: ContractPartyType | null;
}) {
  if (mode === 'add-values' || mode === 'view-values') {
    if (item.value) {
      if (typeof item.value === 'string') {
        return <p className="capitalize text-sm">{item.value}</p>;
      } else if ('url' in item.value && item.tool !== 'signature') {
        return (
          <Image
            alt="comment"
            src={item.value.url}
            width={80}
            height={40}
            objectFit="contain"
          />
        );
      } else if (item.tool === 'signature') {
        return (
          // <div className="text-[20px] text-center space-y-0.5">
          //   <ChooseFont text={item.value.value} chooseFont={item.value.font} />
          //   <div className="flex items-center space-x-0.5">
          //     {item.date ? (
          //       <div className="text-[10px]">
          //         {moment(new Date()).format('DD MMM YYYY')}
          //       </div>
          //     ) : null}
          //     {receipt ? (
          //       <div className="text-[10px]">{receipt.email}</div>
          //     ) : null}
          //     {'email' in item ? (
          //       <div className="text-[10px]">{item.email}</div>
          //     ) : null}
          //   </div>
          // </div>
          <div className="flex h-[35px]  w-fit">
            <div className="h-full  relative border-2 w-[10px] rounded-l-md border-schestiPrimary border-r-0">
              <div className="absolute text-schestiPrimaryBlack -top-2 -right-[50px] text-[10px]">
                Signed By
              </div>
              <div className="absolute text-schestiPrimaryBlack -bottom-3 left-3 font-bold whitespace-nowrap">
                {item.date ? (
                  <span className="text-schestiPrimaryBlack text-[8px] ">
                    {moment(new Date()).format('DD MMM YYYY')},{' '}
                  </span>
                ) : null}
                {receipt ? (
                  <span className="text-schestiPrimaryBlack text-[8px]">
                    {receipt.email}
                  </span>
                ) : null}
                {'email' in item ? (
                  <span className="text-schestiPrimaryBlack text-[8px]">
                    {item.email}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="h-full w-[100px] flex-1 border-schestiPrimaryBlack flex items-center justify-center">
              <div className="border-b border-schestiPrimaryBlack flex-1 p-1">
                {'font' in item.value && (
                  <ChooseFont
                    text={item.value.value}
                    chooseFont={item.value.font}
                  />
                )}
                {'url' in item.value && (
                  <Image
                    alt="comment"
                    src={item.value.url}
                    width={80}
                    height={20}
                    objectFit="contain"
                  />
                )}
              </div>
            </div>
          </div>
        );
      }
    } else {
      return <p className="capitalize text-sm">{item.tool}</p>;
    }
  } else {
    return <p className="capitalize text-sm">{item.tool}</p>;
  }
}

type TypeSignatureProps = {
  onChange?: (_item: ToolState, _shouldClose?: boolean) => void;
  item: ToolState;
  receipt: ContractPartyType | null;
};

function TypeSignature({ onChange, item, receipt }: TypeSignatureProps) {
  const [font, setFont] = useState<ChooseFontType>('satisfyFont');
  const [value, setValue] = useState(
    (item.value as any)?.value || receipt?.name || ''
  );

  return (
    <div className="h-[400px]">
      <InputComponent
        label="Type Signature"
        name="typeSignature"
        placeholder="Type Signature"
        type="text"
        field={{
          value: value ? value : undefined,
          onChange: (e) => {
            setValue(e.target.value);
          },
        }}
      />

      <div className="grid grid-cols-4 gap-4 mt-4 justify-center overflow-y-auto">
        {Object.keys(SignatureFonts).map((signatureFont) => {
          return (
            <div
              key={signatureFont}
              onClick={() => setFont(signatureFont as ChooseFontType)}
              className={`border rounded-md text-2xl leading-8 flex items-center mx-auto text-center cursor-pointer p-4 ${font === signatureFont ? 'border-schestiPrimary text-schestiPrimary' : ''}`}
            >
              <ChooseFont
                text={value || receipt?.name || ''}
                chooseFont={signatureFont as ChooseFontType}
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-end  items-center">
        <CustomButton
          text="Add Signature"
          className="!w-fit !bg-schestiLightPrimary !text-schestiPrimary !py-2 !border-schestiLightPrimary"
          onClick={() => {
            if (value && onChange) {
              onChange({
                ...item,
                tool: 'signature',
                value: {
                  font,
                  value,
                },
              });
            }
          }}
        />
      </div>
    </div>
  );
}

// function getReceiverName(receiver: ICrmContract['receiver']) {
//   if (typeof receiver !== 'string') {
//     if (
//       receiver.module === 'subcontractors' ||
//       receiver.module === 'partners'
//     ) {
//       return receiver.companyRep;
//     }
//     return `${receiver.firstName} ${receiver.lastName || ''}`;
//   }
//   return '';
// }
function GetInitialToolValue({
  item,
  onChange,
  receipt,
}: {
  onChange?: (_item: ToolState, _shouldClose?: boolean) => void;
  item: ToolState;
  contract: ICrmContract;
  tools?: ToolState[];
  receipt: ContractPartyType | null;
}) {
  const [activeTab, setActiveTab] = useState('type');

  // const signature =
  //   tools &&
  //   tools.find(
  //     (tool) =>
  //       tool.tool === 'signature' &&
  //       typeof tool.value !== 'undefined' &&
  //       'font' in tool.value
  //   );
  // get the first character of each word
  const initialVal = receipt ? receipt.name : '';
  // signature && typeof signature.value != 'undefined'
  //   ? (signature.value as any)?.value
  //       .split(' ')
  //       .map((word: string) => word.charAt(0))
  //       .join('')
  //   : '';
  const [value, setValue] = useState(
    // typeof item.value === 'string' || typeof item.value === 'undefined'
    //   ? item.value
    //   :
    initialVal
  );

  return (
    <div>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={['type', 'draw'].map((type) => {
          return {
            key: type,
            label:
              type === activeTab ? (
                <p className="capitalize text-base text-schestiPrimary">
                  {type}
                </p>
              ) : (
                <p className="capitalize text-base">{type}</p>
              ),
          };
        })}
      />
      {activeTab === 'type' ? (
        <div className="h-[400px] flex flex-col justify-between">
          <InputComponent
            label="Type Initials"
            name="typeSignature"
            placeholder="Type Initials"
            type="text"
            field={{
              value: value ? value : undefined,
              onChange: (e) => {
                setValue(e.target.value);
              },
            }}
          />
          <div className="flex justify-end">
            <CustomButton
              text="Add Initials"
              className="!w-fit !bg-schestiLightPrimary !text-schestiPrimary !py-2 !border-schestiLightPrimary"
              onClick={() => {
                if (value && onChange) {
                  onChange({
                    ...item,
                    tool: 'initials',
                    value: value,
                  });
                }
              }}
            />
          </div>
        </div>
      ) : activeTab === 'draw' ? (
        <DrawSignature item={item} onChange={onChange} type="initials" />
      ) : null}
    </div>
  );
}

function GetCommentToolValue({
  item,
  onChange,
}: {
  onChange?: (_item: ToolState, _shouldClose?: boolean) => void;
  item: ToolState;
}) {
  const [value, setValue] = useState(
    typeof item.value === 'string' || typeof item.value === 'undefined'
      ? item.value
      : ''
  );
  return (
    <div className="space-y-3">
      <InputComponent
        label="Comments"
        name="Comments"
        type="text"
        placeholder="Comments"
        field={{
          value: value,
          onChange(e) {
            setValue(e.target.value);
          },
        }}
      />

      <div className="flex justify-end">
        <CustomButton
          text="Add Comment"
          className="!w-fit !bg-schestiLightPrimary !text-schestiPrimary !py-2 !border-schestiLightPrimary"
          onClick={() =>
            onChange &&
            onChange({
              ...item,
              tool: 'comment',
              value: value,
            })
          }
        />
      </div>
    </div>
  );
}

function GetSignatureValue({
  item,
  onChange,
  receipt,
}: {
  onChange?: (_item: ToolState, _shouldClose?: boolean) => void;
  item: ToolState;
  receipt: ContractPartyType | null;
}) {
  const [activeTab, setActiveTab] = useState('type');
  const [isUploadingSignature, setIsUploadingSignature] = useState(false);

  return (
    <div>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={['type', 'draw', 'upload'].map((type) => {
          return {
            key: type,
            label:
              type === activeTab ? (
                <p className="capitalize text-base text-schestiPrimary">
                  {type}
                </p>
              ) : (
                <p className="capitalize text-base">{type}</p>
              ),
          };
        })}
      />
      {activeTab === 'upload' ? (
        <div className="h-[400px] flex flex-col justify-center">
          <Spin
            spinning={isUploadingSignature}
            indicator={<LoadingOutlined spin />}
          >
            <Upload.Dragger
              name={'file'}
              accept=".png, .jpeg, .jpg,"
              beforeUpload={async (_file, FileList) => {
                for (const file of FileList) {
                  const isLessThan500MB = file.size < 500 * 1024 * 1024; // 500MB in bytes
                  if (!isLessThan500MB) {
                    toast.error('File size should be less than 500MB');
                    return false;
                  }
                }
                if (onChange) {
                  setIsUploadingSignature(true);
                  const url = await new AwsS3(_file).getS3URL();
                  onChange({
                    ...item,
                    tool: 'signature',
                    value: {
                      extension: _file.name.split('.').pop() || '',
                      name: _file.name,
                      type: _file.type,
                      url: url,
                    },
                  });
                  setIsUploadingSignature(false);
                }
                return false;
              }}
              style={{
                borderStyle: 'dashed',
                borderWidth: 2,
                marginTop: 12,
                backgroundColor: 'transparent',
                borderColor: '#E2E8F0',
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
                text="Select File"
                className="!w-fit !px-6 !bg-schestiLightPrimary !text-schestiPrimary !py-2 !border-schestiLightPrimary"
              />
            </Upload.Dragger>
          </Spin>
        </div>
      ) : activeTab === 'type' ? (
        <TypeSignature item={item} onChange={onChange} receipt={receipt} />
      ) : activeTab === 'draw' ? (
        <DrawSignature item={item} onChange={onChange} type="signature" />
      ) : null}
    </div>
  );
}

function DrawSignature({
  item,
  onChange,
  type = 'signature',
}: {
  onChange?: (_item: ToolState, _shouldClose?: boolean) => void;
  item: ToolState;
  type: 'initials' | 'signature';
}) {
  const [isUploading, setIsUploading] = useState(false);
  const ref = useRef<SignaturePad | null>(null);

  // This will save the signature pad data in local storage
  useEffect(() => {
    const signaturePad = localStorage.getItem('signaturePad');
    if (signaturePad) {
      const data = JSON.parse(signaturePad) as FileInterface;
      if (ref.current) {
        ref.current.fromDataURL(data.url);
      }
    }
  }, []);

  function handleClear() {
    if (ref.current) {
      ref.current.instance.clear();
      localStorage.removeItem('signaturePad');
    }
  }

  async function handleSave() {
    if (ref.current) {
      if (ref.current.isEmpty()) {
        if (type === 'signature') {
          toast.error('Signature cannot be empty');
        } else if (type === 'initials') {
          toast.error('Initials cannot be empty');
        }
      } else {
        setIsUploading(true);
        const base64 = ref.current.toDataURL();
        try {
          const url = await new AwsS3(base64, type).getS3UrlFromBase64(base64);
          const data: FileInterface = {
            extension: 'png',
            name: `${type}-${Date.now()}.png`,
            type: 'image/png',
            url: url,
          };
          localStorage.setItem('signaturePad', JSON.stringify(data));
          onChange?.({
            ...item,
            tool: type,
            value: data,
          });
        } catch (error) {
          toast.error(`Error while uploading the ${type}`);
          console.log(error);
        } finally {
          setIsUploading(false);
        }
      }
    }
  }

  return (
    <div className="h-[400px] space-y-2">
      <div className="border w-full p-2  h-[340px] border-schestiLightPrimary">
        <SignaturePad
          canvasProps={{
            className: 'w-full h-full',
          }}
          // @ts-ignore
          ref={(cur) => {
            ref.current = cur;
          }}
        />
      </div>
      <div className="flex justify-end space-x-3">
        <CustomButton
          text="Clear"
          className="!w-fit !bg-white !text-schestiPrimary !py-2 !border-schestiLightPrimary"
          onClick={handleClear}
        />
        <CustomButton
          text={'Add ' + (type === 'signature' ? 'Signature' : 'Initials')}
          className="!w-fit !bg-schestiLightPrimary !text-schestiPrimary !py-2 !border-schestiLightPrimary"
          onClick={handleSave}
          isLoading={isUploading}
        />
      </div>
    </div>
  );
}
