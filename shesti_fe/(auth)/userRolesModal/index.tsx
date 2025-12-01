import React from 'react';
import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';

import ModalComponent from '@/app/component/modal';

interface roleObject {
  role: string;
  desc: string;
  avatar: string;
}
interface IProps {
  viewUserRoleModal: boolean;
  userRoles: roleObject[];
  setViewUserRoleModal: Dispatch<SetStateAction<boolean>>;
  userRoleSelectionHandler: Function;
}

const UserRolesModel = ({
  viewUserRoleModal,
  setViewUserRoleModal,
  userRoleSelectionHandler,
  userRoles,
}: IProps) => {
  return (
    <div>
      <ModalComponent
        open={viewUserRoleModal}
        setOpen={setViewUserRoleModal}
        width="700px"
      >
        <div
          className="bg-white !rounded-t-xl"
          style={{ borderRadius: '12px' }}
        >
          <div className="flex justify-between p-4 bg-schestiLightPrimary rounded-t-xl">
            <p className="text=[#344054] font-semibold text=[18px]">
              {' '}
              Select User’s{' '}
            </p>

            <Image
              className="cursor-pointer"
              src={'/closeicon.svg'}
              alt="close icon"
              width={20}
              height={20}
              onClick={() => setViewUserRoleModal(false)}
            />
          </div>
          <div className="p-4">
            <div>
              {userRoles?.map((role) => (
                <div
                  key={'doc.name'}
                  className={`p-4 border-2 border-[#D0D5DD] rounded-lg w-full mb-4 cursor-pointer`}
                  onClick={() => userRoleSelectionHandler(role?.role)}
                >
                  <div className="grid grid-cols-6 gap-4">
                    <Image
                      src={`/${role.avatar}.svg`}
                      alt="documentIcon icon"
                      width={80}
                      height={80}
                    />

                    <div className="flex flex-col items-start justify-start gap-[8px] col-start-2 col-span-4">
                      <div className="leading-[20px] font-semibold capitalize">
                        {role?.role.includes('owner')
                          ? 'Owner/Client'
                          : role?.role}
                      </div>
                      <div className="text-sm leading-[24px] text-gray-400">
                        {role.desc}
                      </div>
                    </div>
                    <div className="grid justify-items-end">
                      <Image
                        src={'/auth_modal_arrow.svg'}
                        alt="documentIcon icon"
                        width={32}
                        height={32}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ModalComponent>
    </div>
  );
};

export default UserRolesModel;
