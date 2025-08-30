import { useRouterHook } from '@/app/hooks/useRouterHook';
import { IPlanFeature } from '@/app/utils/plans.utils';
import { resetPostProjectAction } from '@/redux/post-project/post-project.slice';
import { AppDispatch } from '@/redux/store';
import { useHover } from 'ahooks';
import { Dropdown } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';

type IconName =
  | 'bid'
  | 'crm'
  | 'estimate'
  | 'financial'
  | 'home'
  | 'meeting'
  | 'networking'
  | 'quantity'
  | 'schedule'
  | 'setting'
  | 'social';

type IconProps = {
  name?: IconName;
  width: number;
  height: number;
};

type Props = {
  isParentHovered: boolean;
  icon: IconProps;
  isActive?: boolean;
} & IPlanFeature;

type IOptions = IPlanFeature['options'];

const ACTIVE_ICON_COLOR = 'cyan';
const DEACTIVE_ICON_COLOR = 'white';

export function NavItem({
  isParentHovered,
  isActive,
  icon,
  label,
  options,
  value,
}: Props) {
  const hoveredIcon = {
    src: `/sidebar/${icon.name}-${ACTIVE_ICON_COLOR}.svg`,
    width: icon.width,
    height: icon.height,
  };

  const unhoveredIcon = {
    src: `/sidebar/${icon.name}-${DEACTIVE_ICON_COLOR}.svg`,
    width: icon.width,
    height: icon.height,
  };

  return (
    <div>
      {isParentHovered ? (
        <HoverItem
          hoveredIcon={hoveredIcon}
          href={value ? value : ''}
          options={options}
          unhoveredIcon={unhoveredIcon}
          title={label}
          isActive={isActive}
        />
      ) : (
        <UnHoverItem
          hoveredIcon={hoveredIcon}
          unhoveredIcon={unhoveredIcon}
          isActive={isActive}
        />
      )}
    </div>
  );
}

function HoverItem({
  options,
  title,
  href,
  hoveredIcon,
  unhoveredIcon,
  isActive,
}: {
  options: IOptions;
  title: string;
  href: string;
  hoveredIcon: {
    src: string;
    width: number;
    height: number;
  };
  unhoveredIcon: {
    src: string;
    width: number;
    height: number;
  };
  isActive?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isHover = useHover(ref);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouterHook();

  const ChevronIconSrc =
    isHover || isActive
      ? '/chevron-right-cyan.svg'
      : '/chevron-right-white.svg';
  const IconSrc = isHover || isActive ? hoveredIcon.src : unhoveredIcon.src;
  function resetPostProjectState(canCall: boolean) {
    if (canCall) {
      dispatch(resetPostProjectAction());
    }
  }
  return (
    <div
      onClick={() => {
        if (options && options.length) {
          return;
        } else if (href.length > 0) {
          router.push(href);
        }
      }}
      ref={ref}
      className={`py-[14px] cursor-pointer mx-2 relative px-4 ${isHover || isActive ? 'bg-white rounded-md' : ''}`}
    >
      {options ? (
        <Dropdown
          menu={{
            items: options?.map((option, index) => {
              return {
                key: index,
                label:
                  'children' in option ? (
                    option.label
                  ) : (
                    <Link
                      href={option.value}
                      onClick={() => {
                        resetPostProjectState(Boolean(option.isAction));
                      }}
                    >
                      {option.label}
                    </Link>
                  ),
                type: option.children ? 'group' : undefined,
                children:
                  'children' in option
                    ? option.children?.map((item) => {
                        return {
                          key: item.value,
                          label: <Link href={item.value}>{item.label}</Link>,
                          value: item.value,
                        };
                      })
                    : undefined,
              };
            }),
          }}
          trigger={['hover']}
          placement="bottomLeft"
          // @ts-ignore
          getPopupContainer={(trigger) => trigger.parentNode}
        >
          <div className="flex items-center cursor-pointer justify-between  ">
            <div className="flex items-center space-x-2">
              <Image
                src={IconSrc}
                alt={'Nav Item'}
                width={hoveredIcon.width}
                height={hoveredIcon.height}
              />

              <p
                className={`text-[14px] font-medium ${isHover || isActive ? 'text-schestiPrimary' : 'text-white'} leading-5`}
              >
                {title}
              </p>
            </div>

            {options && options.length ? (
              <Image
                src={ChevronIconSrc}
                alt={'right'}
                width={24}
                height={24}
              />
            ) : null}
          </div>
        </Dropdown>
      ) : (
        <div className="flex items-center space-x-2">
          <Image
            src={IconSrc}
            alt={'Nav Item'}
            width={hoveredIcon.width}
            height={hoveredIcon.height}
          />

          <p
            className={`text-[14px] font-medium ${isHover || isActive ? 'text-schestiPrimary' : 'text-white'} leading-5`}
          >
            {title}
          </p>
        </div>
      )}
    </div>
  );
}

function UnHoverItem({
  isActive,
  unhoveredIcon,
  hoveredIcon,
}: {
  unhoveredIcon: {
    src: string;
    width: number;
    height: number;
  };
  isActive?: boolean;
  hoveredIcon: {
    src: string;
    width: number;
    height: number;
  };
}) {
  return (
    <div
      className={`flex justify-center rounded-md mx-2 py-2 px-4 ${isActive ? 'bg-white' : ''}`}
    >
      <div>
        {isActive ? (
          <Image
            alt="Nav Item"
            src={hoveredIcon.src}
            width={hoveredIcon.width}
            height={hoveredIcon.height}
          />
        ) : (
          <Image
            alt="Nav Item"
            src={unhoveredIcon.src}
            width={unhoveredIcon.width}
            height={unhoveredIcon.height}
          />
        )}
      </div>
    </div>
  );
}
