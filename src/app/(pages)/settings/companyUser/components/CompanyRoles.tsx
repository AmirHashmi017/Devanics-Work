import { DeletePopup } from '@/app/(pages)/bid-management/post/components/DeletePopup';
import Button from '@/app/component/customButton/button';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { ISettingCompanyRole } from '@/app/interfaces/settings/comapny-role-settings.interface';
import companyRoleService from '@/app/services/company-role.service';
import { OtherRoutes, Plans } from '@/app/utils/plans.utils';
import { removeCompanyRoleAction } from '@/redux/company-roles/company-roles.slice';
import { AppDispatch, RootState } from '@/redux/store';
import { Checkbox, Collapse, Dropdown, Skeleton } from 'antd';
import { AxiosError } from 'axios';
import Image from 'next/image';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export function CompanyRoles() {
  const [search, setSearch] = useState('');
  const router = useRouterHook();
  const [selectedCompanyRole, setSelectedCompanyRole] =
    useState<ISettingCompanyRole | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showRoleDeleteModal, setShowRoleDeleteModal] = useState(false);
  const companyRolesState = useSelector(
    (state: RootState) => state.companyRoles
  );
  const dispatch = useDispatch<AppDispatch>();

  async function deleteCompanyRole(id: string) {
    setIsDeleting(true);
    try {
      const response = await companyRoleService.httpDeleteCompanyRoleById(id);
      if (response.data) {
        toast.success('Role deleted successfully');
        dispatch(
          removeCompanyRoleAction({
            _id: response.data._id,
          })
        );
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsDeleting(false);
      setShowRoleDeleteModal(false);
      setSelectedCompanyRole(null);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <div
          className="rounded-lg border border-Gainsboro
                      w-[464px] h-[40px] 
                      my-5 flex items-center gap-2 px-3.5 py-2.5"
        >
          <Image
            src={'/search.svg'}
            alt="search icon "
            width={16}
            height={16}
            className="cursor-pointer"
          />
          <input
            type="search"
            name=""
            id=""
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-full bg-transparent outline-none"
          />
        </div>
        <Button
          text="Create new role"
          className="!w-auto "
          icon="/plus.svg"
          iconwidth={20}
          iconheight={20}
          onClick={() => {
            router.push(`${OtherRoutes.Settings.Company_Roles}`);
          }}
        />
      </div>
      {selectedCompanyRole ? (
        <DeletePopup
          closeModal={() => {
            setShowRoleDeleteModal(false);
            setSelectedCompanyRole(null);
          }}
          message="Are you sure you want to delete this role?"
          onConfirm={() => {
            deleteCompanyRole(selectedCompanyRole._id);
          }}
          open={showRoleDeleteModal}
          title="Delete Role"
          isLoading={isDeleting}
        />
      ) : null}
      <div className="mt-4">
        {companyRolesState.loading ? (
          <div>
            <Skeleton active />
            <Skeleton active />
            <Skeleton active />
          </div>
        ) : (
          companyRolesState.data
            .filter((role) =>
              role.name?.toLowerCase().includes(search.toLowerCase())
            )
            .map((role) => {
              return (
                <Collapse
                  key={role._id}
                  collapsible="header"
                  className="my-3"
                  defaultActiveKey={[role._id]}
                  items={[
                    {
                      key: role._id,
                      label: (
                        <p className="text-schestiPrimaryBlack font-medium text-[18px] leading-5 mt-1">
                          {role.name}
                        </p>
                      ),
                      children: (
                        <div className="grid mt-3 grid-cols-3 gap-3">
                          {Object.keys(Plans).map((planKey) => {
                            const value = Plans[planKey as keyof typeof Plans];
                            const isChecked = role.permissions.includes(value);
                            return (
                              <Checkbox
                                key={planKey}
                                checked={isChecked}
                                disabled={!isChecked}
                                className="text-schestiPrimaryBlack font-normal"
                              >
                                {planKey}
                              </Checkbox>
                            );
                          })}
                        </div>
                      ),
                      extra: (
                        <Dropdown
                          menu={{
                            items: [
                              {
                                key: 'edit',
                                label: <p>Edit</p>,
                                onClick: ({ domEvent }) => {
                                  domEvent.stopPropagation();
                                  router.push(
                                    `${OtherRoutes.Settings.Company_Roles}?roleId=${role._id}`
                                  );
                                },
                              },
                              {
                                key: 'delete',
                                label: <p>Delete</p>,
                                onClick: ({ domEvent }) => {
                                  domEvent.stopPropagation();
                                  setSelectedCompanyRole(role);
                                  setShowRoleDeleteModal(true);
                                },
                              },
                            ],
                          }}
                        >
                          <Image
                            src={'/menuIcon.svg'}
                            width={16}
                            height={16}
                            className="cursor-pointer"
                            alt="menu icon"
                          />
                        </Dropdown>
                      ),
                    },
                  ]}
                  expandIconPosition="right"
                  expandIcon={() => (
                    <Image
                      src={'/chevron-up.svg'}
                      width={20}
                      height={20}
                      className="cursor-pointer"
                      alt="menu icon"
                    />
                  )}
                />
              );
            })
        )}
      </div>
    </div>
  );
}
