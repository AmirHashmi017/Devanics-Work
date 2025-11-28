import { USER_ROLE_ENUM } from 'src/constants/roles.constants';
import { OwnerForm } from './OwnerForm';
import { ContractorForm } from './ContractorForm';
import { OtherRoleForm } from './OtherRoleForm';
import { ProfessorStudentForm } from './ProfessorOrStudentForm';
import NoData from 'src/components/noData';

type Props = {
  role: USER_ROLE_ENUM;
};
export function GetUserForm({ role }: Props) {
  if (role === USER_ROLE_ENUM.OWNER) {
    return <OwnerForm />;
  }

  if (role === USER_ROLE_ENUM.CONTRACTOR) {
    return <ContractorForm />;
  }

  if (role === USER_ROLE_ENUM.SUBCONTRACTOR) {
    return <OtherRoleForm role={role} />;
  }

  if (role === USER_ROLE_ENUM.ARCHITECT) {
    return <OtherRoleForm role={role} />;
  }

  if (role === USER_ROLE_ENUM.PROFESSOR) {
    return <ProfessorStudentForm role={role} />;
  }
  if (role === USER_ROLE_ENUM.STUDENT) {
    return <ProfessorStudentForm role={role} />;
  }
  if (role === USER_ROLE_ENUM.VENDOR) {
    return <OtherRoleForm role={role} />;
  }

  return (
    <NoData
      title="Invalid Request"
      description="Seems like there is no form for this role"
    />
  );
}
