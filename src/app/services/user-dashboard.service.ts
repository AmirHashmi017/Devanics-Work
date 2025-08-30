import { IResponseInterface } from '../interfaces/api-response.interface';
import { ICrmDailyWork } from '../interfaces/crm/crm-daily-work.interface';
import { DashboardModuleRecord } from '../interfaces/user-dashboard.interface';
import { HttpService } from './base.service';

export type IDateRange = [string, string] | [string, string, string, string];

class UserDashboardService extends HttpService {
  private readonly prefix: string = 'api/user-dashboard';

  httpGetConstructionEstimate = (
    period?: IDateRange
  ): Promise<IResponseInterface<DashboardModuleRecord>> => {
    const params = this.getQueryParams(period);
    return this.get(`${this.prefix}/construction-estimate?${params}`);
  };

  httpGetQuantityTakeoff = (
    period?: IDateRange
  ): Promise<IResponseInterface<DashboardModuleRecord>> => {
    const params = this.getQueryParams(period);
    return this.get(`${this.prefix}/quantity-takeoff?${params}`);
  };

  httpGetTimeSchedule = (
    period?: IDateRange
  ): Promise<IResponseInterface<DashboardModuleRecord>> => {
    const params = this.getQueryParams(period);
    return this.get(`${this.prefix}/time-schedule?${params}`);
  };

  httpGetProjectManagement = (
    period?: IDateRange
  ): Promise<
    IResponseInterface<{
      takeoffs: number;
      estimates: number;
      scheduled: number;
      contracts: number;
      meetings: number;
    }>
  > => {
    const params = this.getQueryParams(period);
    return this.get(`${this.prefix}/project-management?${params}`);
  };

  httpGetPreconstruction = (
    period?: IDateRange
  ): Promise<
    IResponseInterface<{
      takeoffs: number[];
      estimates: number[];
      scheduled: number[];
      bids: number[];
    }>
  > => {
    const params = this.getQueryParams(period);
    return this.get(`${this.prefix}/preconstruction?${params}`);
  };

  httpGetDailyWorkLeads = (
    period?: IDateRange
  ): Promise<IResponseInterface<ICrmDailyWork[]>> => {
    const params = this.getQueryParams(period);
    return this.get(`${this.prefix}/daily-work?${params}`);
  };

  httpGetBidManagement = (
    period?: IDateRange
  ): Promise<
    IResponseInterface<{
      analytics?: DashboardModuleRecord['analytics'];
      total: number;
      archived: number;
      active: number;
      draft: number;
    }>
  > => {
    const params = this.getQueryParams(period);
    return this.get(`${this.prefix}/bid-management?${params}`);
  };

  httpGetFinancialManagement = (
    period?: IDateRange
  ): Promise<
    IResponseInterface<{
      aia: {
        paid: number;
        total: number;
      };
      standard: {
        paid: number;
        total: number;
      };
      expenses: {
        paid: number;
        total: number;
      };
      analytics?: DashboardModuleRecord['analytics'];
    }>
  > => {
    const params = this.getQueryParams(period);
    return this.get(`${this.prefix}/financial-management?${params}`);
  };

  httpGetSocialMediaComments = (
    period?: IDateRange
  ): Promise<
    IResponseInterface<{
      value: number;
      analytics?: DashboardModuleRecord['analytics'];
    }>
  > => {
    const params = this.getQueryParams(period);
    return this.get(`${this.prefix}/social-media-comments?${params}`);
  };

  httpGetSocialMediaLikes = (
    period?: IDateRange
  ): Promise<
    IResponseInterface<{
      value: number;
      analytics?: DashboardModuleRecord['analytics'];
    }>
  > => {
    const params = this.getQueryParams(period);
    return this.get(`${this.prefix}/social-media-likes?${params}`);
  };

  httpGetSocialMediaShares = (
    period?: IDateRange
  ): Promise<
    IResponseInterface<{
      value: number;
      analytics?: DashboardModuleRecord['analytics'];
    }>
  > => {
    const params = this.getQueryParams(period);
    return this.get(`${this.prefix}/social-media-shares?${params}`);
  };

  httpGetCrm = (
    period?: IDateRange
  ): Promise<
    IResponseInterface<{
      subcontractors: {
        total: number;
        active: number;
        inactive: number;
      };
      partners: {
        total: number;
        active: number;
        inactive: number;
      };
      clients: {
        total: number;
        active: number;
        inactive: number;
      };
      vendors: {
        total: number;
        active: number;
        inactive: number;
      };
      architects: {
        total: number;
        active: number;
        inactive: number;
      };
      contractors: {
        total: number;
        active: number;
        inactive: number;
      };
      analytics?: DashboardModuleRecord['analytics'];
    }>
  > => {
    const params = this.getQueryParams(period);
    return this.get(`${this.prefix}/crm?${params}`);
  };

  httpGetEstimateReports = (
    period?: IDateRange
  ): Promise<
    IResponseInterface<{
      won: number;
      poorQualification: number;
      lost: number;
      active: number;
      total: number;
    }>
  > => {
    const params = this.getQueryParams(period);
    return this.get(`${this.prefix}/estimate-reports?${params}`);
  };

  private getQueryParams(period?: IDateRange): string {
    const params = new URLSearchParams();
    if (period && period.length == 2) {
      params.append('period', period.join(','));
    } else if (period && period.length == 4) {
      params.append('range', period.join(','));
    }
    return params.toString();
  }
}

export const userDashboardService = new UserDashboardService();
