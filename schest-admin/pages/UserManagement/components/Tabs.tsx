import { Tabs } from 'antd';
import { UserManagementTableTabs } from '../types';
import { USER_ROLE_ENUM } from 'src/constants/roles.constants';

type Props = {
  activeTabKey: UserManagementTableTabs;
  setActiveTabKey: (key: UserManagementTableTabs) => void;
  children: React.ReactNode;
  role: USER_ROLE_ENUM;
};

const otherRoleTabs: UserManagementTableTabs[] = [
  'Active',
  'Expired',
  'Verification Request',
  'Invited',
  'Blocked',
];
const universityRoleTabs: UserManagementTableTabs[] = [
  'Active',
  'Expired',
  'New Request',
  'Invited',
  'Blocked',
];
export function UserManagementTabs({
  activeTabKey,
  setActiveTabKey,
  children,
  role,
}: Props) {
  return (
    <div className="mt-3">
      <Tabs
        activeKey={activeTabKey}
        onChange={(key) => setActiveTabKey(key as UserManagementTableTabs)}
        items={(role === USER_ROLE_ENUM.PROFESSOR ||
        role === USER_ROLE_ENUM.STUDENT
          ? universityRoleTabs
          : otherRoleTabs
        ).map((tab) => {
          return {
            key: tab,
            label:
              tab === activeTabKey ? (
                <p className="text-schestiPrimary">{tab}</p>
              ) : (
                <p className="text-schestiPrimaryBlack">{tab}</p>
              ),
            children,
          };
        })}
      />
    </div>
  );
}
