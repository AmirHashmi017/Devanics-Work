import React, { useState } from 'react';
import NextImage from 'next/image';
import { twMerge } from 'tailwind-merge';
import { bg_style } from '@/globals/tailwindvariables';
import { SCALE_NAVIGATION, ScaleInterface } from '../../types';
import {
  CommentOutlined,
  Loading3QuartersOutlined,
  RadiusSettingOutlined,
} from '@ant-design/icons';
// import { Input} from 'antd';
// const { TextArea } = Input;

interface Props {
  tool: ScaleInterface;
  setTool: (data: ScaleInterface) => void;
  setShowModal: (data: boolean) => void;
  handleZoomIn?: any;
  handleZoomOut?: any;
  handleRoomColorChange?: any;
  fillColor?: string;
  countType?: string;
  setcountType?: any;
  selectedPage?: any;
  handleAddComment?: any;
}

const countIcon = (
  width: number,
  height: number,
  color: string,
  type: string
) => {
  const obj = {
    tick: (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M12.0893 0.715545C12.1634 0.784058 12.2232 0.866492 12.2653 0.958135C12.3075 1.04978 12.3312 1.14883 12.335 1.24963C12.3389 1.35043 12.3228 1.45101 12.2878 1.5456C12.2527 1.64019 12.1994 1.72694 12.1308 1.8009L5.21718 9.26408C5.08555 9.40838 4.92527 9.52365 4.74658 9.60251C4.5679 9.68138 4.37473 9.72211 4.17941 9.72211C3.98409 9.72211 3.79092 9.68138 3.61223 9.60251C3.43355 9.52365 3.27327 9.40838 3.14164 9.26408L0.257843 6.15155C0.119412 6.00212 0.0460094 5.80383 0.0537827 5.60028C0.061556 5.39674 0.149868 5.20462 0.299292 5.06619C0.448716 4.92776 0.647012 4.85435 0.850556 4.86213C1.0541 4.8699 1.24622 4.95821 1.38465 5.10764L4.04425 7.9798C4.11716 8.05854 4.24166 8.05854 4.31458 7.97981L11.004 0.756995C11.0725 0.682956 11.1549 0.623147 11.2466 0.580989C11.3382 0.538831 11.4372 0.515151 11.538 0.511301C11.6389 0.507452 11.7394 0.523509 11.834 0.558555C11.9286 0.593601 12.0154 0.646947 12.0893 0.715545ZM15.9272 0.715545C16.0013 0.784058 16.0611 0.866492 16.1032 0.958135C16.1454 1.04978 16.1691 1.14883 16.1729 1.24963C16.1768 1.35043 16.1607 1.45101 16.1257 1.5456C16.0906 1.64019 16.0373 1.72694 15.9687 1.8009L9.05584 9.26408C8.91741 9.41351 8.72529 9.50182 8.52175 9.50959C8.31821 9.51737 8.11991 9.44396 7.97049 9.30553C7.82106 9.1671 7.73275 8.97498 7.72498 8.77144C7.7172 8.56789 7.79061 8.3696 7.92904 8.22017L14.8426 0.756995C14.981 0.607696 15.1729 0.519458 15.3763 0.511685C15.5797 0.503912 15.7779 0.577241 15.9272 0.715545Z"
          fill={color}
        />
      </svg>
    ),
    cross: (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.8696 0.949707L1.81641 12.0029M1.81641 0.949707L12.8696 12.0029"
          stroke={color}
          stroke-width="1.84219"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
    branch: (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.3433 1.37549V19.7974M16.8564 4.07332L3.83015 17.0996M19.5542 10.5864H1.13232M16.8564 17.0996L3.83015 4.07332"
          stroke={color}
          stroke-width="1.84219"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
    info: (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.66289 7.76847C7.87945 7.15287 8.30688 6.63378 8.86949 6.30313C9.43209 5.97248 10.0936 5.85161 10.7368 5.96194C11.3799 6.07226 11.9633 6.40665 12.3836 6.90589C12.8038 7.40513 13.0339 8.03699 13.0329 8.68957C13.0329 10.5318 10.2696 11.4529 10.2696 11.4529M10.3433 15.1372H10.3525M19.5542 10.5318C19.5542 15.6188 15.4304 19.7427 10.3433 19.7427C5.25621 19.7427 1.13232 15.6188 1.13232 10.5318C1.13232 5.44469 5.25621 1.3208 10.3433 1.3208C15.4304 1.3208 19.5542 5.44469 19.5542 10.5318Z"
          stroke={color}
          stroke-width="1.84219"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
    home: (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.05322 9.31971C1.05322 8.79068 1.05322 8.52616 1.12141 8.28256C1.18181 8.06677 1.28107 7.86382 1.41432 7.68367C1.56474 7.48029 1.77354 7.31789 2.19114 6.99309L8.43829 2.13419C8.76189 1.8825 8.92369 1.75666 9.10236 1.70828C9.26 1.6656 9.42616 1.6656 9.58381 1.70828C9.76247 1.75666 9.92428 1.8825 10.2479 2.1342L16.495 6.99309C16.9126 7.31789 17.1214 7.48029 17.2719 7.68367C17.4051 7.86382 17.5044 8.06677 17.5648 8.28256C17.6329 8.52616 17.6329 8.79068 17.6329 9.31971V15.9838C17.6329 17.0155 17.6329 17.5314 17.4322 17.9254C17.2555 18.2721 16.9737 18.5539 16.6271 18.7305C16.233 18.9313 15.7172 18.9313 14.6854 18.9313H4.00073C2.969 18.9313 2.45314 18.9313 2.05908 18.7305C1.71245 18.5539 1.43063 18.2721 1.25401 17.9254C1.05322 17.5314 1.05322 17.0155 1.05322 15.9838V9.31971Z"
          stroke={color}
          stroke-width="1.84219"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
  };
  //@ts-ignore
  return obj[`${type ?? 'branch'}`];
};

const ScaleNavigation: React.FC<Props> = ({
  tool,
  setTool,
  setShowModal,
  setcountType,
  countType,
  selectedPage,
}) => {
  console.log(selectedPage, ' ===> selectedPage');
  const [cddOpen, setcddOpen] = useState<boolean>(false);
  // const [copen, setcOpen] = useState(false);
  // const [comment, setcomment] = useState("")
  return (
    <div
      className={twMerge(
        `h-auto w-30 py-5 px-1 flex flex-col justify-center items-center gap-4  ${bg_style} rounded-lg !fixed !z-[50] right-0 top-30 shadow-md`
      )}
    >
      {SCALE_NAVIGATION.map(
        ({ src, selectedSrc, height, width, alt, label }) => {
          return (
            <div
              key={src}
              className="flex flex-col items-center cursor-pointer p-2"
              onClick={() => {
                setShowModal(true);
                setTool({
                  selected: label,
                  ...((label === 'dynamic' || label === 'perimeter') && {
                    subSelected: 'create',
                  }),
                });
              }}
            >
              {tool.selected === label ? (
                <NextImage
                  src={selectedSrc}
                  alt={alt}
                  width={width}
                  height={height}
                />
              ) : (
                <NextImage src={src} alt={alt} width={width} height={height} />
              )}
              <span
                className={twMerge(
                  `text-xs capitalize ${
                    tool.selected === label ? 'text-lavenderPurpleReplica' : ''
                  }`
                )}
              >
                {label}
              </span>
            </div>
          );
        }
      )}

      {/* Zoom In */}
      {/* <div
        className="flex flex-col items-center cursor-pointer p-2"
        onClick={handleZoomIn}
      >
        <ZoomInOutlined width={19.97} height={11.31} />
        <span
          className={twMerge(
            `text-xs capitalize`
          )}
        >
          {"Zoom In"}
        </span>
      </div> */}
      {/* Count and drop down */}
      <div
        className="flex flex-col items-center cursor-pointer p-2"
        onClick={() => {
          setcddOpen(!cddOpen);
        }}
      >
        {/* <ZoomOutOutlined width={19.97} height={11.31} /> */}
        {countIcon(20, 20, 'GrayText', 'tick')}
        <span className={twMerge(`text-xs capitalize`)}>{'Count'}</span>
        {cddOpen && (
          <div className="bg-white shadow-lg absolute right-24 bottom-20 flex flex-col rounded-lg p-1">
            {/* <ZoomOutOutlined width={19.97} height={11.31} /> */}
            {['tick', 'cross', 'branch', 'home', 'info'].map(
              (type: string, index: number) => {
                return (
                  <span
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setcountType(type);
                      setShowModal(true);
                      setTool({
                        selected: 'count',
                      });
                    }}
                    className="p-3 cursor-pointer hover:bg-slate-200 flex items-center justify-center"
                  >
                    {countIcon(
                      20,
                      20,
                      countType == type ? '#007AB6' : 'GrayText',
                      type
                    )}
                  </span>
                );
              }
            )}
          </div>
        )}
      </div>

      {/* Zoom Out */}
      {/* <div
        className="flex flex-col items-center cursor-pointer p-2"
        onClick={handleZoomOut}
      >
        <ZoomOutOutlined width={19.97} height={11.31} />
        <span
          className={twMerge(
            `text-xs capitalize`
          )}
        >
          {"Zoom Out"}
        </span>
      </div> */}

      {/* Room Color */}
      {/* <div
        className="flex flex-col items-center cursor-pointer p-2"
      >
        <ColorPicker value={fillColor ?? '#ffffff'} onChangeComplete={(value) => { handleRoomColorChange(value?.toRgbString()) }} />
        <span
          className={twMerge(
            `text-xs capitalize`
          )}
        >
          {"Room Color"}
        </span>
      </div> */}

      {/* Comments Section Here */}

      {/* <Popover
        content={
          <div className="">
            {selectedPage?.comments &&
              Array.isArray(selectedPage?.comments) &&
              selectedPage?.comments?.map((i: any, ind: number) => {
                return (
                  <div key={ind}>
                    <span className="font-semibold">
                      {i?.user?.name ?? i?.user?.email} :{' '}
                    </span>
                    {i?.comment}
                  </div>
                );
              })}
            <TextArea
              size="large"
              onChange={(e) => {
                setcomment(e.target.value);
              }}
              value={comment}
            />
            <span className="w-full flex justify-end px-1">
              <Button
                onClick={() => {
                  handleAddComment(comment);
                  setcomment('');
                  setcOpen(false);
                }}
                size="middle"
                className="bg-lavenderPurpleReplica cursor-pointer mt-2 font-semibold !text-[12px] !text-white hover:!text-lavenderPurpleReplica"
              >
                Add
              </Button>
            </span>
          </div>
        }
        title="Comments"
        placement="left"
        trigger="click"
        open={copen}
        onOpenChange={(val: boolean) => { setcOpen(val) }}
      > */}
      {/* ARC */}
      <div
        className={`flex flex-col items-center cursor-pointer p-2 ${tool.selected == 'arc' ? '!text-lavenderPurpleReplica' : ''}`}
        onClick={() => {
          setTool({ selected: 'arc' });
        }}
      >
        <Loading3QuartersOutlined width={19.97} height={11.31} />
        {/* <ZoomOutOutlined width={19.97} height={11.31} /> */}
        <span className={twMerge(`text-xs capitalize`)}>{'Arc Length'}</span>
      </div>
      {/* CURVE */}
      <div
        className={`flex flex-col items-center cursor-pointer p-2 ${tool.selected == 'curve' ? '!text-lavenderPurpleReplica' : ''}`}
        onClick={() => {
          setTool({ selected: 'curve' });
        }}
      >
        <RadiusSettingOutlined width={19.97} height={11.31} />
        {/* <ZoomOutOutlined width={19.97} height={11.31} /> */}
        <span className={twMerge(`text-xs capitalize`)}>{'Curve Area'}</span>
      </div>
      {/* COMMENTS */}
      <div
        className={`flex flex-col items-center cursor-pointer p-2 ${tool.selected == 'comments' ? '!text-lavenderPurpleReplica' : ''}`}
        onClick={() => {
          setTool({ selected: 'comments' });
        }}
      >
        <CommentOutlined width={19.97} height={11.31} />
        {/* <ZoomOutOutlined width={19.97} height={11.31} /> */}
        <span className={twMerge(`text-xs capitalize`)}>{'Comments'}</span>
      </div>
      {/* </Popover> */}
    </div>
  );
};

export default ScaleNavigation;
