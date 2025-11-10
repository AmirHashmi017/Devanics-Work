import { Request } from 'express';
import { ResponseMessage } from '../../enums/resMessage.enum';
import { CustomError } from '../../errors/custom.error';
import { EHttpStatus } from '../../enums/httpStatus.enum';
import {
  UserDashboardKey,
  IUserDashboardAnalytics,
} from './user-dashboard.interface';
import _ from 'lodash';
import estimateService from '../../modules/estimates/estimate.service';
import analyticsService from './analytics.service';
import mongoose, { PipelineStage } from 'mongoose';
import ProjectProposal from '../../modules/proposals/proposal.model';
import { CrmContractModel } from '../../modules/crm/contract/crm-contract.model';
import { DailyWorkModal } from '../../modules/crm/daily-work-lead/daily-work.model';
import BidsManagement from '../../modules/bids-management/bids-management.model';
import Invoices from '../../modules/invoices/invoices.model';
import ClientInvoice from '../../modules/invoices-client/client-invoices.model';
import { FinancialExpense } from '../../modules/financials/expense/financial-expense.model';
import { NewTakeOfSummariesModal } from '../../modules/takeoff-summary/takeoff-summary.model';
import CrmModel from '../../modules/crm/crm.model';
import GenerateEstimateModel from '../../modules/estimates/generatedEstimates.model';
import periodWiseFeatureService from './period-wise-feature.service';
import { IPeriod } from '../../contants/types';
import { getDateRange } from '../../utils/dateUtils';
import Meeting from '../../modules/meeting/meeting.model';

class UserDashboardService {
  async getAnalytics(req: Request) {
    let period: string | [string, string] = req.query?.period as string;
    if (period) {
      // split and remove any whitespaces from the string
      period = _.trim(period).split(',') as [string, string];
    } else {
      period = undefined;
    }
    let result: IUserDashboardAnalytics = this.initialValue;
    result = await this.getEstimateAnalytics(
      result,
      req.payload._id,
      period as [string, string]
    );
    result = await this.getTakeoffAnalytics(
      result,
      req.payload._id,
      period as [string, string]
    );
    result = await this.getSubmittedProposalBidsAnalytics(
      result,
      req.payload._id,
      period as [string, string]
    );
    result = await this.getContractsAnalytics(
      result,
      req.payload._id,
      period as [string, string]
    );
    result = await this.getDailyLeadAnalytics(
      result,
      req.payload._id,
      period as [string, string]
    );
    result = await this.getMeetingsAnalytics(
      result,
      req.payload._id,
      period as [string, string]
    );
    result = await this.getBidProjectsAnalytics(
      result,
      req.payload._id,
      period as [string, string]
    );
    result = await this.getFinancialAnalytics(
      result,
      req.payload._id,
      period as [string, string]
    );
    result = await this.getCrmAnalytics(
      result,
      req.payload._id,
      period as [string, string]
    );
    result = await this.getEstimateReport(
      result,
      req.payload._id,
      period as [string, string]
    );
    result = await this.getSocialMediaAnalytics(
      result,
      req.payload._id,
      period as [string, string]
    );
    return {
      statusCode: 200,
      message: ResponseMessage.SUCCESSFUL,
      data: result,
    };
  }

  async getFeatureAnalyticsByPeriod(req: Request) {
    let { key, period, yearlyPeriod } = req.query as {
      key: UserDashboardKey;
      period?: 'lastWeek' | 'lastMonth' | 'lastYear';
      yearlyPeriod?: 'currentYear' | 'lastYear';
    };

    const response = await periodWiseFeatureService.getFeatureAnalytics(
      req.payload._id,
      key,
      period || yearlyPeriod
    );

    return {
      statusCode: 200,
      message: ResponseMessage.SUCCESSFUL,
      data: {
        key,
        data: response,
      },
    };
  }

  /**
   * Sets the estimate values in the result object
   *
   * @param {IUserDashboardAnalytics} result - The result object to be modified
   * @param {string} userId - The id of the user
   * @returns {IUserDashboardAnalytics} - The modified result object
   */
  private async getEstimateAnalytics(
    result: IUserDashboardAnalytics,
    userId: string,
    period?: IPeriod | [string, string]
  ) {
    try {
      const response = await estimateService.getAnalytics(userId, period);
      result = this.setValue(
        result,
        'dashboardConstruction.estimate.value',
        response
      );
    } catch (error) {
      console.log('estimate service analytics error', error);
    }

    try {
      let fullYearData = await estimateService.getFullYearAnalytics(userId);
      result = this.setValue(result, 'preconstruct.estimate', fullYearData);
    } catch (error) {
      console.log('estimate service full year analytics error', error);
    }

    return result;
  }

  async getTakeoffAnalytics(
    result: IUserDashboardAnalytics,
    userId: string,
    period?: IPeriod | [string, string]
  ) {
    try {
      const response = await analyticsService.getAnalytics(
        NewTakeOfSummariesModal,
        {
          createdBy: new mongoose.Types.ObjectId(userId),
        },
        period
      );
      result = this.setValue(
        result,
        'dashboardConstruction.takeoff.value',
        response
      );
    } catch (error) {
      console.log('takeoff service analytics error', error);
    }

    try {
      let fullYearData = await analyticsService.getMonthlyAnalytics(
        NewTakeOfSummariesModal,
        {
          createdBy: new mongoose.Types.ObjectId(userId),
        }
      );
      result = this.setValue(result, 'preconstruct.takeoff', fullYearData);
    } catch (error) {
      console.log('takeoff service full year analytics error', error);
    }
    return result;
  }

  private async getSubmittedProposalBidsAnalytics(
    result: IUserDashboardAnalytics,
    userId: string,
    period?: IPeriod | [string, string]
  ) {
    try {
      const response = await analyticsService.getAnalytics(
        ProjectProposal,
        {
          user: new mongoose.Types.ObjectId(userId),
        },
        period
      );
      result = this.setValue(
        result,
        'dashboardConstruction.bids.value',
        response
      );
    } catch (error) {
      console.log('proposal service analytics error', error);
    }

    try {
      let fullYearData = await analyticsService.getMonthlyAnalytics(
        ProjectProposal,
        {
          user: new mongoose.Types.ObjectId(userId),
        }
      );
      result = this.setValue(result, 'preconstruct.bids', fullYearData);
    } catch (error) {
      console.log('proposal service full year analytics error', error);
    }

    return result;
  }

  private async getContractsAnalytics(
    result: IUserDashboardAnalytics,
    userId: string,
    period?: IPeriod | [string, string]
  ) {
    try {
      const response = await analyticsService.getAnalytics(
        CrmContractModel as any,
        {
          user: new mongoose.Types.ObjectId(userId),
        },
        period
      );
      result = this.setValue(
        result,
        'dashboardConstruction.contracts.value',
        response
      );
    } catch (error) {
      console.log('Contracts service analytics error', error);
    }

    return result;
  }

  private async getDailyLeadAnalytics(
    result: IUserDashboardAnalytics,
    userId: string,
    period?: IPeriod | [string, string]
  ) {
    let start, end;
    if (period) {
      const range = getDateRange(period);
      start = range.start;
      end = range.end;
    }
    try {
      const dailyleads = await DailyWorkModal.find({
        user: new mongoose.Types.ObjectId(userId),
        createdAt: {
          $gte: start,
          $lte: end,
        },
      })
        .populate('status')
        .populate('priority')
        .sort({ createdAt: -1 })
        .limit(5);
      result = this.setValue(result, 'dailyLeads', dailyleads);
    } catch (error) {
      console.log('daily leads error', error);
    }
    return result;
  }

  private async getMeetingsAnalytics(
    result: IUserDashboardAnalytics,
    userId: string,
    period?: IPeriod | [string, string]
  ) {
    try {
      const response = await analyticsService.getAnalytics(
        Meeting,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
        },
        period
      );
      result = this.setValue(result, 'meetings.total', response);
    } catch (error) {
      console.log('meetings service analytics error', error);
    }

    return result;
  }

  private async getBidProjectsAnalytics(
    result: IUserDashboardAnalytics,
    userId: string,
    period?: IPeriod | [string, string]
  ) {
    try {
      const active = await analyticsService.getAnalytics(
        BidsManagement,
        {
          user: new mongoose.Types.ObjectId(userId),
          status: 'active',
        },
        period
      );

      result = this.setValue(result, 'bidManagement.active.value', active);
    } catch (error) {
      console.log('active bid projects analytics error', error);
    }

    try {
      const draft = await analyticsService.getAnalytics(
        BidsManagement,
        {
          user: new mongoose.Types.ObjectId(userId),
          status: 'draft',
        },
        period
      );

      result = this.setValue(result, 'bidManagement.draft.value', draft);
    } catch (error) {
      console.log('draft bid projects analytics error', error);
    }

    try {
      const archived = await analyticsService.getAnalytics(
        BidsManagement,
        {
          user: new mongoose.Types.ObjectId(userId),
          status: 'archived',
        },
        period
      );

      result = this.setValue(result, 'bidManagement.archived.value', archived);
    } catch (error) {
      console.log('archived bid projects analytics error', error);
    }

    try {
      let total = await analyticsService.getAnalytics(
        BidsManagement,
        {
          user: new mongoose.Types.ObjectId(userId),
        },
        period
      );
      result = this.setValue(result, 'bidManagement.total', total);
    } catch (error) {
      console.log('bid management service full year analytics error', error);
    }

    return result;
  }

  private async getFinancialAnalytics(
    result: IUserDashboardAnalytics,
    userId: string,
    period?: IPeriod | [string, string]
  ) {
    try {
      const paid = await analyticsService.getAnalytics(
        Invoices,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: 'paid',
        },
        period
      );
      const standardInvoicingTotal = await analyticsService.getAnalytics(
        Invoices,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
        },
        period
      );

      result = this.setValue(result, 'finance.standardInvoicing.value', paid);
      result = this.setValue(
        result,
        'finance.standardInvoicing.total',
        standardInvoicingTotal
      );
    } catch (error) {
      console.log('Standard invoicing analytics error', error);
    }

    try {
      const paid = await analyticsService.getAnalytics(
        FinancialExpense as any,
        {
          user: new mongoose.Types.ObjectId(userId),
          status: 'paid',
        },
        period
      );

      result = this.setValue(result, 'finance.expense.value', paid);

      let total = await analyticsService.getAnalytics(
        FinancialExpense as any,
        {
          user: new mongoose.Types.ObjectId(userId),
        },
        period
      );
      result = this.setValue(result, 'finance.expense.total', total);
    } catch (error) {
      console.log('Financial Expenses', error);
    }

    try {
      const paid = await analyticsService.getAnalytics(
        ClientInvoice,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          $expr: {
            $eq: ['$totalAmount', '$amountPaid'],
          },
        },
        period
      );

      result = this.setValue(result, 'finance.aiaInvoicing.value', paid);

      const total = await analyticsService.getAnalytics(
        ClientInvoice,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
        },
        period
      );
      result = this.setValue(result, 'finance.aiaInvoicing.total', total);
    } catch (error) {
      console.log('Aia Invoicing ANalytics Error', error);
    }

    result = this.setValue(
      result,
      'finance.total',
      result.finance.standardInvoicing.value +
        result.finance.expenses.value +
        result.finance.aiaInvoicing.value
    );

    return result;
  }

  private async getCrmAnalytics(
    result: IUserDashboardAnalytics,
    userId: string,
    period?: IPeriod | [string, string]
  ) {
    try {
      let activeClients = await analyticsService.getAnalytics(
        CrmModel as any,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: true,
          module: 'clients',
        },
        period
      );
      let inactiveClients = await analyticsService.getAnalytics(
        CrmModel as any,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: false,
          module: 'clients',
        },
        period
      );
      let totalClients = await analyticsService.getAnalytics(
        CrmModel as any,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          module: 'clients',
        },
        period
      );

      result = this.setValue(result, 'crm.client.active', activeClients);
      result = this.setValue(result, 'crm.client.inactive', inactiveClients);
      result = this.setValue(result, 'crm.client.total', totalClients);

      let activeContractors = await analyticsService.getAnalytics(
        CrmModel as any,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: true,
          module: 'contractors',
        },
        period
      );
      let inactiveContractors = await analyticsService.getAnalytics(
        CrmModel as any,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: false,
          module: 'contractors',
        },
        period
      );
      let totalContractors = await analyticsService.getAnalytics(
        CrmModel as any,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          module: 'contractors',
        },
        period
      );

      result = this.setValue(
        result,
        'crm.contractor.active',
        activeContractors
      );
      result = this.setValue(
        result,
        'crm.contractor.inactive',
        inactiveContractors
      );
      result = this.setValue(result, 'crm.contractor.total', totalContractors);

      let activeSubcontractors = await analyticsService.getAnalytics(
        CrmModel as any,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: true,
          module: 'subcontractors',
        },
        period
      );
      let inactiveSubcontractors = await analyticsService.getAnalytics(
        CrmModel as any,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: false,
          module: 'subcontractors',
        },
        period
      );
      let totalSubcontractors = await analyticsService.getAnalytics(
        CrmModel as any,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          module: 'subcontractors',
        },
        period
      );

      result = this.setValue(
        result,
        'crm.subcontractor.active',
        activeSubcontractors
      );
      result = this.setValue(
        result,
        'crm.subcontractor.inactive',
        inactiveSubcontractors
      );
      result = this.setValue(
        result,
        'crm.subcontractor.total',
        totalSubcontractors
      );

      let activePartners = await analyticsService.getAnalytics(
        CrmModel as any,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: true,
          module: 'partners',
        },
        period
      );
      let inactivePartners = await analyticsService.getAnalytics(
        CrmModel as any,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: false,
          module: 'partners',
        },
        period
      );
      let totalPartners = await analyticsService.getAnalytics(
        CrmModel as any,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          module: 'partners',
        },
        period
      );

      result = this.setValue(result, 'crm.partner.active', activePartners);
      result = this.setValue(result, 'crm.partner.inactive', inactivePartners);
      result = this.setValue(result, 'crm.partner.total', totalPartners);

      let activeVendors = await analyticsService.getAnalytics(
        CrmModel as any,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: true,
          module: 'vendors',
        },
        period
      );
      let inactiveVendors = await analyticsService.getAnalytics(
        CrmModel as any,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: false,
          module: 'vendors',
        },
        period
      );
      let totalVendors = await analyticsService.getAnalytics(
        CrmModel as any,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          module: 'vendors',
        },
        period
      );

      result = this.setValue(result, 'crm.vendor.active', activeVendors);
      result = this.setValue(result, 'crm.vendor.inactive', inactiveVendors);
      result = this.setValue(result, 'crm.vendor.total', totalVendors);

      let activeArchitects = await analyticsService.getAnalytics(
        CrmModel as any,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: true,
          module: 'architects',
        },
        period
      );
      let inactiveArchitects = await analyticsService.getAnalytics(
        CrmModel as any,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: false,
          module: 'architects',
        },
        period
      );
      let totalArchitects = await analyticsService.getAnalytics(
        CrmModel as any,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          module: 'architects',
        },
        period
      );

      result = this.setValue(result, 'crm.architect.active', activeArchitects);
      result = this.setValue(
        result,
        'crm.architect.inactive',
        inactiveArchitects
      );
      result = this.setValue(result, 'crm.architect.total', totalArchitects);
    } catch (error) {
      console.log('crm analytics error', error);
    }

    return result;
  }

  private async getEstimateReport(
    result: IUserDashboardAnalytics,
    userId: string,
    period?: IPeriod | [string, string]
  ) {
    try {
      const won = await analyticsService.getAnalytics(
        GenerateEstimateModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: 'won',
        },
        period
      );
      result = this.setValue(result, 'estimateReport.won.value', won);
    } catch (error) {
      console.log('estimateReport.won error', error);
    }

    try {
      const poorQualification = await analyticsService.getAnalytics(
        GenerateEstimateModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: 'poorQualification',
        },
        period
      );
      result = this.setValue(
        result,
        'estimateReport.poorQualification.value',
        poorQualification
      );
    } catch (error) {
      console.log('estimateReport.poorQualification error', error);
    }

    try {
      const lost = await analyticsService.getAnalytics(
        GenerateEstimateModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: 'lost',
        },
        period
      );
      result = this.setValue(result, 'estimateReport.lost.value', lost);
    } catch (error) {
      console.log('estimateReport.lost error', error);
    }

    try {
      const active = await analyticsService.getAnalytics(
        GenerateEstimateModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: 'active',
        },
        period
      );
      result = this.setValue(result, 'estimateReport.active.value', active);
    } catch (error) {
      console.log('estimateReport.active error', error);
    }

    return result;
  }

  private async getSocialMediaAnalytics(
    result: IUserDashboardAnalytics,
    userId: string,
    period?: IPeriod | [string, string]
  ) {
    try {
      const comments = await analyticsService.getSocialMediaCommentAnalytics(
        userId,
        period
      );
      result = this.setValue(result, 'socialMedia.comments.value', comments);
    } catch (error) {
      console.log('Social Media analytics error', error);
    }

    try {
      const likes = await analyticsService.getSocialMediaLikesAnalytics(
        userId,
        period
      );
      result = this.setValue(result, 'socialMedia.likes.value', likes);
    } catch (error) {
      console.log('Social Media analytics error', error);
    }

    try {
      const shares = await analyticsService.getSocialMediaSharesAnalytics(
        userId,
        period
      );
      result = this.setValue(result, 'socialMedia.shares.value', shares);
    } catch (error) {
      console.log('Social Media analytics error', error);
    }

    return result;
  }

  private get initialValue(): IUserDashboardAnalytics {
    return {
      dashboardConstruction: {
        estimate: {
          value: 0,
        },
        bids: {
          value: 0,
        },
        schedule: {
          value: 0,
        },
        takeoff: {
          value: 0,
        },
        contracts: {
          value: 0,
        },
      },
      preconstruct: {
        bids: Array(12).fill(0),
        schedule: Array(12).fill(0),
        takeoff: Array(12).fill(0),
        estimate: Array(12).fill(0),
      },
      dailyLeads: [],
      meetings: {
        total: 0,
      },
      bidManagement: {
        active: {
          value: 0,
        },
        archived: {
          value: 0,
        },
        draft: {
          value: 0,
        },
        total: 0,
      },
      finance: {
        aiaInvoicing: {
          value: 0,
          total: 0,
        },

        expenses: {
          value: 0,
          total: 0,
        },
        standardInvoicing: {
          value: 0,
          total: 0,
        },
        total: 0,
      },

      crm: {
        architect: {
          active: 0,
          inactive: 0,
          total: 0,
        },
        client: {
          active: 0,
          inactive: 0,
          total: 0,
        },
        contractor: {
          active: 0,
          inactive: 0,
          total: 0,
        },
        partner: {
          active: 0,
          inactive: 0,
          total: 0,
        },
        subContractor: {
          active: 0,
          inactive: 0,
          total: 0,
        },
        vendor: {
          active: 0,
          inactive: 0,
          total: 0,
        },
      },
      estimateReport: {
        lost: {
          value: 0,
        },
        poorQualification: {
          value: 0,
        },
        active: {
          value: 0,
        },
        won: {
          value: 0,
        },
      },

      socialMedia: {
        comments: {
          value: 0,
        },
        likes: {
          value: 0,
        },
        shares: {
          value: 0,
        },
        impressions: {
          value: 0,
        },
      },
    };
  }

  private setValue(
    obj: IUserDashboardAnalytics,
    key: _.PropertyPath,
    value: any
  ) {
    return _.set(obj, key, value);
  }
}

export default new UserDashboardService();
