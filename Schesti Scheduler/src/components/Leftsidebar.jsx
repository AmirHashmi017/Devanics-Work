// // import Image from 'next/image';
// import { ConfigProvider, Menu } from 'antd';
// import logo from "../images/logoss.svg";

// import { planFeatureOptions } from './plans';
// import {
//   HomeOutlined,
//   MenuFoldOutlined,
//   MenuUnfoldOutlined,
// } from '@ant-design/icons';
// import { SettingIcon } from './component-icons/SettingIcon'
// import { useNavigate } from 'react-router-dom'
// import { useState } from 'react';
// import { shesti_original_app_url } from '../constants/api';


// const HOVERED_WIDTH = 'w-[240px]';
// const UNHOVERED_WIDTH = 'w-[80px]';

// function collectKeys(items) {
//   let keys = [];
//   if (items && items.length) {
//     items?.forEach((item) => {
//       if (item?.key) {
//         keys.push(item.key);
//       }
//       if (item && 'children' in item) {
//         keys = keys.concat(collectKeys(item.children));
//       }
//     });
//   }

//   return keys;
// }

// function filterMenuItemsByPermissions(
//   items,
//   permissions
// ) {
//   return permissions.map((permission) => {
//     const item = items?.find((item) => {
//       if (item && 'key' in item && item.key?.toString().includes(permission)) {
//         return item;
//       }
//     });

//     return item
//       ? item
//       : {
//         key: permission,
//         label: undefined,
//       };
//   });
// }

// const Leftsidebar = (props) => {
//   // const { isOpened, toggleCollapsed } = props;
//   const [isOpened, setisOpened] = useState(false);

//   const toggleCollapsed = () => {
//     setisOpened(!isOpened);
//   };
//   const navigate = useNavigate()
//   const router = {
//     push:(url)=>{navigate(url)}
//   };
//   const authenticatedUser = true;
//   // const authenticatedUser = useSelector(
//   //   (state) => state.auth.user
//   // );
//   // function resetPostProjectState(canCall) {
//   //   if (canCall) {
//   //     dispatch(resetPostProjectAction());
//   //   }
//   // }

//   // const isCompanyEmployee =
//   //   authenticatedUser?.user && authenticatedUser.user.associatedCompany;
//   // // employee links to show on sidebar
//   // const companyEmployeePermissions =
//   //   authenticatedUser?.user &&
//   //     authenticatedUser.user.associatedCompany &&
//   //     authenticatedUser.user.roles
//   //     ? authenticatedUser.user.roles
//   //       .map((role) => (typeof role !== 'string' ? role.permissions : ''))
//   //       .flat()
//   //     : [];
//    const isCompanyEmployee = true;

//   let menuItems = [
//     {
//       label: 'Dashboard',
//       key: '/dashboard',
//       icon: <HomeOutlined className="!text-2xl" />,
//       onClick() {
//         window.location.replace(shesti_original_app_url+'/dashboard')
//       },
//     },
//     ...planFeatureOptions.map((feature) => {
//       if (feature.options) {
//         return {
//           label: feature.label,
//           key: feature.value ? feature.value : feature.label,
//           icon: <feature.Icon />,

//           children: feature.options?.map((option) => {
//             return {
//               label: option.label,
//               key: option.value,
//               onClick() {
//                 if (option.value) {
//                   window.location.replace(shesti_original_app_url+option.value)
//                 }
//                 if ('isAction' in option) {
//                   // resetPostProjectState(Boolean(option.isAction));
//                   ()=>{}
//                 }
//               },
//               children:
//                 'children' in option
//                   ? option.children?.map((item) => {
//                     return {
//                       key: item.value,
//                       label: item.label,
//                       onClick() {
//                         window.location.replace(shesti_original_app_url+item.value)
//                       },
//                     };
//                   })
//                   : undefined,
//             };
//           }),
//         };
//       }

//       return {
//         label: feature.label,
//         key: feature.value,
//         icon: <feature.Icon />,
//         onClick() {
//           if(feature.value != '/'){
//             window.location.replace(shesti_original_app_url+feature.value)
//           }
//         },
//       };
//     }),
//     {
//       type: 'divider',
//       style: {
//         borderColor: 'white',
//         margin: '10px 0',
//       },
//     },
//     {
//       label: 'Settings',
//       key: '/settings',
//       icon: <SettingIcon />,
//       onClick() {
//         router.push('/settings/general');
//         window.location.replace(shesti_original_app_url+'/settings/general')
//       },
//     },
//   ];

//   const companyEmployeePermissions = []

//   // if (isCompanyEmployee) {
//   //   // company employee links to show on sidebar
//   //   // exclude menu if the key is not in menuItems

//   //   menuItems = filterMenuItemsByPermissions(
//   //     menuItems,
//   //     companyEmployeePermissions
//   //   )?.filter((item) => item && 'label' in item && item.label !== undefined);
//   // }

//   // set activeKey if menuItems key includes in pathname
//   const allKeys = collectKeys(menuItems);
//   const activeKeys = allKeys
//     .map((key) => key.toString())
//     .filter((key) => {
//       return window.location.href.includes(key.toString());
//     });

//   return (
//     <div
//     style={{zIndex:1000}}
//       className={`fixed top-0 h-full overflow-y-auto overflow-x-hidden bg-[#007ab6] transition-all duration-300 ease-in-out ${isOpened ? HOVERED_WIDTH : UNHOVERED_WIDTH}`}
//     >
//       {/* Logo */}
//       <div className="flex justify-center mt-4">
//         <img
//           src={logo}
//           alt="Schest Logo"
//           width={79}
//           height={20}
//           className={'px-1'}
//         />
//       </div>

//       {/* Toggle Button */}
//       <div
//         onClick={toggleCollapsed}
//         className="absolute border bg-white rounded-full px-3 py-2 top-12 -right-3 cursor-pointer"
//       >
//         {isOpened ? (
//           <MenuUnfoldOutlined className=" text-lg text-[#007ab6]" />
//         ) : (
//           <MenuFoldOutlined className=" text-lg text-[#007ab6]" />
//         )}
//       </div>

//       {/* Navigation */}
//       <div className="mt-14 w-full">
//         <ConfigProvider
//           theme={{
//             components: {
//               Menu: {
//                 itemBg: '#007AB6',
//                 itemColor: 'white',
//                 fontWeightStrong: 600,

//                 itemSelectedBg: 'white',
//                 itemHoverBg: '#FFFFFF17',
//                 itemHoverColor: 'white',

//                 itemSelectedColor: '#007AB6',
//                 itemActiveBg: '#FFFFFF',

//                 popupBg: '#007AB6',

//                 // colorItemBgSelected: "#fff",
//                 // controlItemBgActive: "#fff",
//               },
//             },
//           }}
//         >
//           <Menu
//             inlineCollapsed={!isOpened}
//             mode="vertical"
//             // if user not authenticated then don't show sidebar
//             items={!authenticatedUser ? [] : menuItems}
//             triggerSubMenuAction="click"
//             selectedKeys={activeKeys}
//           />
//         </ConfigProvider>
//       </div>

//       {/* <div className="mt-6 flex flex-col space-y-3">
//             <NavItem
//                 icon={{
//                     height: ICON_HEIGHT,
//                     width: ICON_WIDTH,
//                     name: "home"
//                 }}
//                 iconName=""
//                 isParentHovered={isHovering}
//                 label="Dashboard"
//                 value="/dashboard"
//                 isActive={pathname.includes("dashboard")}
//             />

//             {planFeatureOptions.map(feature => {

//                 return <NavItem
//                     key={feature.title}
//                     isParentHovered={isHovering}
//                     isActive={
//                         feature.value ? pathname.includes(feature.value) : Boolean(feature.options?.find((option) =>
//                             option.children?.find(child => child.value.includes(pathname)) || option.value.includes(pathname)
//                         ))
//                     }
//                     icon={{
//                         name: feature.iconName as any,
//                         height: ICON_HEIGHT,
//                         width: ICON_WIDTH
//                     }}
//                     {...feature}
//                 />
//             })}


//             <Divider className="border-white" />
//             <NavItem
//                 isParentHovered={isHovering}
//                 label="Settings"
//                 value="/settings/general"
//                 icon={{
//                     name: "setting",
//                     height: ICON_HEIGHT,
//                     width: ICON_WIDTH
//                 }}
//                 iconName=""
//                 isActive={pathname.includes("settings")}
//             />
//         </div> */}
//     </div>
//   );
// };

// export default Leftsidebar;


//////////////////////////////////////New Design of Side Bar/////////////////////////////////////////////////


// import Image from 'next/image';
import { ConfigProvider, Menu } from 'antd';
import logo from "../images/schesti.svg";
import openCollapseImage from '../images/tabler_layout-sidebar-right-collapse.svg'

import { planFeatureOptions } from './plans';
import {
  HomeOutlined,
  LeftOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { SettingIcon } from './component-icons/SettingIcon'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react';
import { shesti_original_app_url } from '../constants/api';


const HOVERED_WIDTH = 'w-[240px]';
const UNHOVERED_WIDTH = 'w-[80px]';

function collectKeys(items) {
  let keys = [];
  if (items && items.length) {
    items?.forEach((item) => {
      if (item?.key) {
        keys.push(item.key);
      }
      if (item && 'children' in item) {
        keys = keys.concat(collectKeys(item.children));
      }
    });
  }

  return keys;
}

function filterMenuItemsByPermissions(
  items,
  permissions
) {
  return permissions.map((permission) => {
    const item = items?.find((item) => {
      if (item && 'key' in item && item.key?.toString().includes(permission)) {
        return item;
      }
    });

    return item
      ? item
      : {
        key: permission,
        label: undefined,
      };
  });
}

const Leftsidebar = (props) => {
  const { isOpened, toggleCollapsed } = props;
  // const [isOpened, setisOpened] = useState(false);

  // const toggleCollapsed = () => {
  //   setisOpened(!isOpened);
  // };
  const navigate = useNavigate()
  const router = {
    push: (url) => { navigate(url) }
  };
  const authenticatedUser = true;
  // const authenticatedUser = useSelector(
  //   (state) => state.auth.user
  // );
  // function resetPostProjectState(canCall) {
  //   if (canCall) {
  //     dispatch(resetPostProjectAction());
  //   }
  // }

  // const isCompanyEmployee =
  //   authenticatedUser?.user && authenticatedUser.user.associatedCompany;
  // // employee links to show on sidebar
  // const companyEmployeePermissions =
  //   authenticatedUser?.user &&
  //     authenticatedUser.user.associatedCompany &&
  //     authenticatedUser.user.roles
  //     ? authenticatedUser.user.roles
  //       .map((role) => (typeof role !== 'string' ? role.permissions : ''))
  //       .flat()
  //     : [];
  const isCompanyEmployee = true;

  let menuItems = [
    {
      label: 'Dashboard',
      key: '/dashboard',
      icon: <svg width="24" height="24" viewBox="0 0 20 21" fill="currentColor">
        <path d="M7.24 2H5.34C3.15 2 2 3.15 2 5.33V7.23C2 9.41 3.15 10.56 5.33 10.56H7.23C9.41 10.56 10.56 9.41 10.56 7.23V5.33C10.57 3.15 9.42 2 7.24 2Z" />
        <path d="M18.6699 2H16.7699C14.5899 2 13.4399 3.15 13.4399 5.33V7.23C13.4399 9.41 14.5899 10.56 16.7699 10.56H18.6699C20.8499 10.56 21.9999 9.41 21.9999 7.23V5.33C21.9999 3.15 20.8499 2 18.6699 2Z" />
        <path d="M18.6699 13.4297H16.7699C14.5899 13.4297 13.4399 14.5797 13.4399 16.7597V18.6597C13.4399 20.8397 14.5899 21.9897 16.7699 21.9897H18.6699C20.8499 21.9897 21.9999 20.8397 21.9999 18.6597V16.7597C21.9999 14.5797 20.8499 13.4297 18.6699 13.4297Z" />
        <path d="M7.24 13.4297H5.34C3.15 13.4297 2 14.5797 2 16.7597V18.6597C2 20.8497 3.15 21.9997 5.33 21.9997H7.23C9.41 21.9997 10.56 20.8497 10.56 18.6697V16.7697C10.57 14.5797 9.42 13.4297 7.24 13.4297Z" />
      </svg>,
      onClick() {
        window.location.replace(shesti_original_app_url + '/dashboard')
      },
    },
    ...planFeatureOptions.map((feature) => {
      if (feature.options) {
        return {
          label: feature.label,
          key: feature.value ? feature.value : feature.label,
          icon: <feature.Icon />,

          children: feature.options?.map((option) => {
            return {
              label: option.label,
              key: option.value,
              onClick() {
                if (option.value) {
                  window.location.replace(shesti_original_app_url + option.value)
                }
                if ('isAction' in option) {
                  // resetPostProjectState(Boolean(option.isAction));
                  () => { }
                }
              },
              children:
                'children' in option
                  ? option.children?.map((item) => {
                    return {
                      key: item.value,
                      label: item.label,
                      onClick() {
                        window.location.replace(shesti_original_app_url + item.value)
                      },
                    };
                  })
                  : undefined,
            };
          }),
        };
      }

      return {
        label: feature.label,
        key: feature.value,
        icon: <feature.Icon />,
        onClick() {
          if(feature.label == 'Schedule'){
            router.push('/')
          }
          if (feature.value != '/') {
            window.location.replace(shesti_original_app_url + feature.value)
          }
        },
      };
    }),
    {
      type: 'divider',
      style: {
        borderColor: 'white',
        margin: '10px 0',
      },
    },
    {
      label: 'Settings',
      key: '/settings',
      icon: <SettingIcon />,
      onClick() {
        router.push('/settings/general');
        window.location.replace(shesti_original_app_url + '/settings/general')
      },
    },
  ];

  const companyEmployeePermissions = []

  // if (isCompanyEmployee) {
  //   // company employee links to show on sidebar
  //   // exclude menu if the key is not in menuItems

  //   menuItems = filterMenuItemsByPermissions(
  //     menuItems,
  //     companyEmployeePermissions
  //   )?.filter((item) => item && 'label' in item && item.label !== undefined);
  // }

  // set activeKey if menuItems key includes in pathname
  const allKeys = collectKeys(menuItems);
  const activeKeys = allKeys
    .map((key) => key.toString())
    .filter((key) => {
      return window.location.href.includes(key.toString());
    });

  return (
    <div
      style={{ zIndex: 1000 }}
      className={`fixed h-full top-0 overflow-y-auto overflow-x-hidden bg-black transition-all duration-300 ease-in-out ${isOpened ? HOVERED_WIDTH : UNHOVERED_WIDTH}`}
    >
      {/* Logo */}
      <div className="flex justify-center !mt-4">
        <img
          src={logo}
          alt="Schest Logo"
          width={45}
          height={45}
          className={'px-1'}
        />
      </div>

      {/* Toggle Button */}
      {/* <div
        onClick={toggleCollapsed}
        className={`absolute rounded-full px-3 py-2 top-12 -right-3 cursor-pointer`}
      >
        <img src={openCollapseImage}
          width={24}
          height={24}
          alt='Open'
        />
      </div> */}
      <div
        onClick={toggleCollapsed}
        className="absolute rounded-full text-[#9AA6B2] bg-white text-xl  px-1 py-1 flex items-center z-[9999999] border-2 border-black top-6 -right-2 shadow-lg  cursor-pointer"
      >
        {/* {isOpened ? <IoIosArrowBack /> : <IoIosArrowForward />} */}
        {isOpened ? <LeftOutlined /> : <RightOutlined />}
      </div>

      {/* Navigation */}
      <div className="mt-8 w-full">
        <ConfigProvider
          theme={{
            components: {
              Menu: {
                itemBg: '#000',
                itemColor: 'white',
                fontWeightStrong: 600,

                itemSelectedBg: 'transparent',
                itemHoverBg: '#FFFFFF17',
                itemHoverColor: '#2CA6FF',

                itemSelectedColor: '#2CA6FF',
                itemActiveBg: 'transparent',

                popupBg: '#000',

                // colorItemBgSelected: "#fff",
                // controlItemBgActive: "#fff",
              },
            },
          }}
        >
          <Menu
            inlineCollapsed={!isOpened}
            mode="vertical"
            // if user not authenticated then don't show sidebar
            items={!authenticatedUser ? [] : menuItems}
            triggerSubMenuAction="click"
            selectedKeys={activeKeys}
          />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default Leftsidebar;