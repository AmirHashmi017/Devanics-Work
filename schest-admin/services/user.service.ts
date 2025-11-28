// auth.service.ts

// Importing base class
import { USER_ROLE_ENUM } from 'src/constants/roles.constants';
import { HttpService } from './base.service';

// Importing interfaces
import { IResponseInterface } from 'src/interfaces/api-response.interface';
import { IUserInterface } from 'src/interfaces/authInterfaces/user.interface';
import { ISubscriptionHistory } from 'src/interfaces/subscription-history.interface';
import { IPricingPlan } from 'src/interfaces/pricing-plan.interface';

type GetUserQueryType = {
  role: USER_ROLE_ENUM;
  page: number;
  limit: number;
};

export type IActiveUserResponse = {
  count: number;
  users: (IUserInterface & {
    subscription: null | ISubscriptionHistory;
  })[];
};

export type IExpiredUserResponse = IActiveUserResponse;
export type IBlockedUserResponse = IActiveUserResponse;

export type InviteUserDataType = {
  email: string;
  role: string;
  name: string;
  password: string;
  planId: string;
};

export type IGetUserDetail = IUserInterface & {
  subscriptions: ISubscriptionHistory[];
  plans: IPricingPlan[];
};

class UserService extends HttpService {
  private readonly userPrefix: string = 'api/user';
  private readonly adminUserPrefix = 'api/admin/user';

  httpGetAdminUsers = (
    page: number,
    limit: number = 9,
    queryRoles?: String
  ): Promise<IResponseInterface<any>> =>
    this.get(
      `${this.userPrefix}/admin/users?page=${page}&limit=${limit}&queryRoles=${queryRoles}`
    );

  updateSocialProfile = (
    id: string | string[],
    body: { socialName: string; socialAvatar?: string }
  ): Promise<IResponseInterface<any>> =>
    this.post(`${this.userPrefix}/updateSocialProfile/${id}`, body);

  httpBlockEmployee = (id: string): Promise<IResponseInterface<any>> =>
    this.post(`${this.userPrefix}/block/${id}`);

  httpGetCompanyInfo = (id: string): Promise<IResponseInterface> =>
    this.get(`${this.userPrefix}/companyDetail/${id}`);

  httpUnBlockEmployee = (id: string): Promise<IResponseInterface<any>> =>
    this.post(`${this.userPrefix}/unBlock/${id}`);

  httpIsBlocked = (): Promise<IResponseInterface<any>> =>
    this.get(`${this.userPrefix}/isBlocked`);

  // httpGetBlockedUsers = (

  // ): Promise<IResponseInterface<any>> =>
  //   this.get(
  //     `${this.userPrefix}/admin/blockedUsers`
  //   );

  httpGetActiveUsers = (
    query: GetUserQueryType
  ): Promise<IResponseInterface<IActiveUserResponse>> =>
    this.get(
      `${this.adminUserPrefix}/all-active?role=${query.role}&page=${query.page}&limit=${query.limit}`
    );

  httpGetExpiredUsers = (
    query: GetUserQueryType
  ): Promise<IResponseInterface<IExpiredUserResponse>> =>
    this.get(
      `${this.adminUserPrefix}/expired-users?role=${query.role}&page=${query.page}&limit=${query.limit}`
    );

  httpGetUsersWithVerificationRequest = (
    query: GetUserQueryType
  ): Promise<IResponseInterface<IActiveUserResponse>> =>
    this.get(
      `${this.adminUserPrefix}/verification-requests?role=${query.role}&page=${query.page}&limit=${query.limit}`
    );

  httpGetInvitedUsers = (
    query: GetUserQueryType
  ): Promise<IResponseInterface<IActiveUserResponse>> =>
    this.get(
      `${this.adminUserPrefix}/invited-users?role=${query.role}&page=${query.page}&limit=${query.limit}`
    );

  httpGetBlockedUsers = (
    query: GetUserQueryType
  ): Promise<IResponseInterface<IBlockedUserResponse>> =>
    this.get(
      `${this.adminUserPrefix}/blocked-users?role=${query.role}&page=${query.page}&limit=${query.limit}`
    );

  httpGetUserById = (query: {
    role?: USER_ROLE_ENUM;
    id: string;
  }): Promise<IResponseInterface<IGetUserDetail>> =>
    this.get(
      `${this.adminUserPrefix}/user-detail?role=${query.role}&id=${query.id}`
    );

  httpVerifyUser = (id: string): Promise<IResponseInterface<IUserInterface>> =>
    this.put(`${this.adminUserPrefix}/verify-user/${id}`);

  httpUnverifyUser = (
    id: string
  ): Promise<IResponseInterface<IUserInterface>> =>
    this.put(`${this.adminUserPrefix}/unverify-user/${id}`);

  httpInviteUser = (
    data: InviteUserDataType
  ): Promise<IResponseInterface<IUserInterface>> =>
    this.post(`${this.adminUserPrefix}/invite-user`, data);

  httpSendEmailToUsers = (data: FormData): Promise<IResponseInterface<any>> =>
    this.post(`${this.adminUserPrefix}/send-email`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

  httpAcceptStudentOrProfessor = (
    id: string
  ): Promise<IResponseInterface<IUserInterface>> =>
    this.put(`${this.adminUserPrefix}/accept-invite/${id}`);

  httpExtendUserActiveSubscription = (
    id: string,
    extendedDays: number
  ): Promise<IResponseInterface<IUserInterface>> =>
    this.put(`${this.adminUserPrefix}/extend-subscription/${id}`, {
      extendedDays,
    });

  httpBlockUser = (id: string): Promise<IResponseInterface<IUserInterface>> =>
    this.put(`${this.adminUserPrefix}/block-user/${id}`);
  httpUnblockUser = (id: string): Promise<IResponseInterface<IUserInterface>> =>
    this.put(`${this.adminUserPrefix}/unblock-user/${id}`);
}

export const userService = new UserService();
