import { useLayoutEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectToken } from 'src/redux/authSlices/auth.selector';
import { HttpService } from 'src/services/base.service';
import { UserManagementLayout } from '../components/UserManagementPageLayout';
import { TopHeader } from '../components/TopHeader';
import { UserManagementTabs } from '../components/Tabs';
import { UserManagementTableTabs } from '../types';
import { UserManagementActiveTable } from '../components/tables/ActiveTable';
import { UserManagementExpiredTable } from '../components/tables/ExpiredTable';
import { UserManagementVerificationRequestTable } from '../components/tables/VerificationRequest';
import { UserManagementInvitedTable } from '../components/tables/InvitedTable';
import { USER_ROLE_ENUM } from 'src/constants/roles.constants';
import ModalComponent from 'src/components/modal';
import { UserManagementEmailTemplate } from '../components/EmailTemplate';
import { useNavigate } from 'react-router-dom';
import { Routes } from 'src/pages/Plans/utils';
import { toast } from 'react-toastify';
import { UserManagementBlockedTable } from './tables/BlockedTable';

type Props = {
  role: USER_ROLE_ENUM;
};
export function UserManagementPageBody({ role }: Props) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<UserManagementTableTabs>('Active');
  const token = useSelector(selectToken);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [tableEmails, setTableEmails] = useState<string[]>([]);

  const navigate = useNavigate();

  const activeTableRef = useRef<{
    handleExport: () => void;
  } | null>(null);

  const expiredTableRef = useRef<{
    handleExport: () => void;
  } | null>(null);

  const blockedTableRef = useRef<{
    handleExport: () => void;
  } | null>(null);

  const verificationRequestTableRef = useRef<{
    handleExport: () => void;
  } | null>(null);

  const invitedTableRef = useRef<{
    handleExport: () => void;
  } | null>(null);

  useLayoutEffect(() => {
    if (token) {
      HttpService.setToken(token);
    }
  }, [token]);
  return (
    <UserManagementLayout>
      <TopHeader
        title={role}
        addNewBtn={{
          onClick() {
            navigate(`${Routes.User_Management.Add_User}?role=${role}`);
          },
        }}
        emailBtn={{
          onClick() {
            if (tableEmails.length) {
              setShowEmailModal(true);
            } else {
              toast.error('No Row Selected');
            }
          },
        }}
        exportBtn={{
          onClick() {
            if (activeTab === 'Active') {
              activeTableRef.current?.handleExport();
            } else if (activeTab === 'Expired') {
              expiredTableRef.current?.handleExport();
            } else if (activeTab === 'Verification Request') {
              verificationRequestTableRef.current?.handleExport();
            } else if (activeTab === 'Invited') {
              invitedTableRef.current?.handleExport();
            } else if (activeTab === 'Blocked') {
              blockedTableRef.current?.handleExport();
            }
          },
        }}
        inviteBtn={{
          onClick() {
            setShowInviteModal(true);
          },
        }}
        search={search}
        onSearch={(val) => setSearch(val)}
      />

      <ModalComponent
        open={showEmailModal}
        setOpen={setShowEmailModal}
        width="600px"
      >
        <UserManagementEmailTemplate
          setEmailModal={setShowEmailModal}
          submitHandler={() => {
            setTableEmails([]);
          }}
          to={tableEmails.join(',')}
          title="Send Email To All"
        />
      </ModalComponent>

      <ModalComponent
        open={showInviteModal}
        setOpen={setShowInviteModal}
        width="600px"
      >
        <UserManagementEmailTemplate
          setEmailModal={setShowInviteModal}
          submitHandler={() => {}}
          to=""
          title="Invite User"
          isInviting
        />
      </ModalComponent>

      <UserManagementTabs
        activeTabKey={activeTab}
        setActiveTabKey={(tab) => {
          setActiveTab(tab);
          setSearch('');
          setTableEmails([]);
        }}
        role={role}
        children={
          activeTab === 'Active' ? (
            <UserManagementActiveTable
              ref={activeTableRef}
              search={search}
              role={role}
              selectedRowKeys={tableEmails}
              setSelectedRowKeys={setTableEmails}
            />
          ) : activeTab === 'Blocked' ? (
            <UserManagementBlockedTable
              ref={blockedTableRef}
              role={role}
              search={search}
              selectedRowKeys={tableEmails}
              setSelectedRowKeys={setTableEmails}
            />
          ) : activeTab === 'Expired' ? (
            <UserManagementExpiredTable
              ref={expiredTableRef}
              role={role}
              search={search}
              selectedRowKeys={tableEmails}
              setSelectedRowKeys={setTableEmails}
            />
          ) : activeTab === 'Verification Request' ||
            activeTab === 'New Request' ? (
            <UserManagementVerificationRequestTable
              search={search}
              role={role}
              ref={verificationRequestTableRef}
              selectedRowKeys={tableEmails}
              setSelectedRowKeys={setTableEmails}
            />
          ) : activeTab === 'Invited' ? (
            <UserManagementInvitedTable
              role={role}
              search={search}
              ref={invitedTableRef}
              selectedRowKeys={tableEmails}
              setSelectedRowKeys={setTableEmails}
            />
          ) : null
        }
      />
    </UserManagementLayout>
  );
}
