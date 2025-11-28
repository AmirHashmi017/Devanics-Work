import { IResponseInterface } from '../interfaces/api-response.interface';
import {
  AdminGetAllProjectsType,
  IBidActivity,
  IBidManagement,
  IBidManagementProjectTeamMember,
  IBidProjectReport,
  IGetSavedUserBid,
  IProjectBiddingResponse,
  ISaveUserBid,
  IUpdateUserBid,
} from '../interfaces/bid-management/bid-management.interface';
import { HttpService } from './base.service';

export type CreateOwnerPostProjectType = Pick<
  IBidManagement,
  | 'projectName'
  | 'country'
  | 'city'
  | 'zipCode'
  | 'state'
  | 'constructionTypes'
  | 'address'
  | 'status'
>;

export type CreateTeamMemberType = Omit<
  IBidManagementProjectTeamMember,
  '_id' | 'createdAt' | 'updatedAt' | 'user'
>;

export type AdminGetAllProjectsQuery = {
  limit: number;
  page: number;
  tab?: 'active' | 'archived' | 'deleted';
  trades?: string[];
  projectValue?: number;
  state?: string;
  city?: string;
  country?: string;
};

class BidManagementService extends HttpService {
  private readonly prefix: string = 'api/bids';
  private readonly adminPrefix: string = 'api/admin/bids';

  httpCreateBidPostProject = (
    data: CreateOwnerPostProjectType
  ): Promise<IResponseInterface<{ createdProject: IBidManagement }>> =>
    this.post(`${this.prefix}/create-project`, data);

  httpGetBidProjectInvitedUsers = (): Promise<
    IResponseInterface<{ projects: IBidManagement[] }>
  > => this.get(`${this.prefix}/invited-projects`);

  httpUpdateBidPostProject = (
    projectId: string,
    data: Partial<IBidManagement>
  ): Promise<IResponseInterface<{ updatedProject: IBidManagement }>> =>
    this.put(`${this.prefix}/update-project/${projectId}`, data);

  httpCreateTeamDesignMember = (
    data: CreateTeamMemberType
  ): Promise<IResponseInterface<{ user: IBidManagementProjectTeamMember }>> =>
    this.post(`${this.prefix}/create-team-member`, data);

  httpUpdateTeamDesignMember = (
    data: Partial<CreateTeamMemberType & { userId: string }>
  ): Promise<
    IResponseInterface<{ updatedUser: IBidManagementProjectTeamMember }>
  > => this.put(`${this.prefix}/update-team-member`, data);

  httpDeleteTeamDesignMember = (
    userId: string
  ): Promise<
    IResponseInterface<{ deletedUser: IBidManagementProjectTeamMember }>
  > => this.delete(`${this.prefix}/delete-team-member/${userId}`);

  httpGetProjectById = (
    projectId: string | string[]
  ): Promise<IResponseInterface<{ project: IBidManagement }>> =>
    this.get(`${this.prefix}/project-detail/${projectId}`);

  httpGetProjectBiddingTeamByProjectId = (
    projectId: string | string[]
  ): Promise<IResponseInterface<{ project: IBidManagement }>> =>
    this.get(`${this.prefix}/project-bidding-team/${projectId}`);

  httpGetOwnerProjects = (
    params: any
  ): Promise<IResponseInterface<{ projects: IBidManagement[] }>> =>
    this.get(
      `${this.prefix}/get-all?projectValue=${
        params.projectValue
      }&trades=${params.trades?.toString()}`
    );

  httpGetOwnerProjectsWithoutFilters = (): Promise<
    IResponseInterface<{ projects: IBidManagement[] }>
  > => this.get(`${this.prefix}/get-all`);

  httpGetMyProjects = (
    params: any
  ): Promise<
    IResponseInterface<{
      records: any;
      paginationInfo: any;
      projects: IBidManagement[];
    }>
  > =>
    this.get(
      `${this.prefix}/my-projects?page=${params.page}&limit=${params.limit}`
    );

  httpSaveUserProjectBid = (
    data: any
  ): Promise<IResponseInterface<{ project: ISaveUserBid }>> =>
    this.post(`${this.prefix}/save-user-bid`, data);

  httpRemoveUserProjectBid = (
    biddingId: string
  ): Promise<IResponseInterface<{ project: ISaveUserBid }>> =>
    this.post(`${this.prefix}/remove-project-bidding/${biddingId}`, null);

  httpUpdateUserProjectBid = (
    data: IUpdateUserBid
  ): Promise<IResponseInterface<{ project: ISaveUserBid }>> =>
    this.post(`${this.prefix}/update-user-bid`, data);

  httpUpdateProjectStatus = (
    projectId: string,
    status: string
  ): Promise<
    IResponseInterface<{
      updatedBid: IBidManagement;
    }>
  > => this.put(`${this.prefix}/update-status`, { status, projectId });

  httpGetUserSavedBids = (
    params: IGetSavedUserBid
  ): Promise<IResponseInterface<{ savedBids: ISaveUserBid }>> =>
    this.get(
      `${this.prefix}/get-user-bids?page=${params.page}&limit=${params.limit}&status=${params.status}`
    );

  httpGetProjectSavedBids = (projectId: string) =>
    this.get(`${this.prefix}/get-saved-bid-details/${projectId}`);

  httpUploadCSVFile(data: FormData): Promise<{ data: string[][] }> {
    return this.post(`${this.prefix}/import-invited-members`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
  httpSendEmail(data: FormData): Promise<{ data: any }> {
    return this.post(`${this.prefix}/send-email`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  httpGetProjectActivities = (
    projectId: string
  ): Promise<IResponseInterface<{ bidsActivities: IBidActivity[] }>> =>
    this.get(`${this.prefix}/get-activities/${projectId}`);

  httpGetProjectBiddings = (
    projectId: string
  ): Promise<IResponseInterface<IProjectBiddingResponse>> =>
    this.get(`${this.prefix}/project-bidding/${projectId}`);

  httpUpdateProjectDocumentsById = (
    id: string,
    data: any
  ): Promise<IResponseInterface<{ project: IBidManagement }>> =>
    this.post(`${this.prefix}/update-project-documents/${id}`, data);

  httpAdminGetAllProjects = (
    query: AdminGetAllProjectsQuery
  ): Promise<IResponseInterface<AdminGetAllProjectsType>> =>
    this.get(`${this.adminPrefix}/all-projects`, query);

  httpAdminGetReportedProjects = (pagination: {
    page: number;
    limit: number;
  }): Promise<
    IResponseInterface<{
      reportedProjects: IBidProjectReport[];
      total: number;
    }>
  > =>
    this.get(
      `${this.adminPrefix}/all-reported-projects? page=${pagination.page}&limit=${pagination.limit}`
    );
}

export const bidManagementService = new BidManagementService();
