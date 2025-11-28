import { IGetUserDetail } from 'src/services/user.service';
import { OwnerInfo } from './OwnerInfo';
import { OtherRoleInfo } from './ContractorInfo';
import { USER_ROLE_ENUM } from 'src/constants/roles.constants';
import { ProfessorOrStudentInfo } from './ProfessorOrStudentInfo';

type Props = {
  data: IGetUserDetail;
};
export function ViewUserInfo({ data }: Props) {
  if (data.userRole === USER_ROLE_ENUM.OWNER) {
    return <OwnerInfo data={data} />;
  } else if (
    data.userRole === USER_ROLE_ENUM.CONTRACTOR ||
    data.userRole === USER_ROLE_ENUM.SUBCONTRACTOR ||
    data.userRole === USER_ROLE_ENUM.ARCHITECT ||
    data.userRole === USER_ROLE_ENUM.VENDOR
  ) {
    return <OtherRoleInfo data={data} />;
  } else if (
    data.userRole === USER_ROLE_ENUM.PROFESSOR ||
    data.userRole === USER_ROLE_ENUM.STUDENT
  ) {
    return <ProfessorOrStudentInfo data={data} />;
  }
  return null;
}
