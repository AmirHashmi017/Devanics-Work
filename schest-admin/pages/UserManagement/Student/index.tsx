import { USER_ROLE_ENUM } from 'src/constants/roles.constants';
import { UserManagementPageBody } from '../components/UserManagementPageBody';

export function UserManagementStudents() {
  return <UserManagementPageBody role={USER_ROLE_ENUM.STUDENT} />;
}
