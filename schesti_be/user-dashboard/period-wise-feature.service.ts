import mongoose from 'mongoose';
import analyticsService from './analytics.service';
import { UserDashboardKey } from './user-dashboard.interface';
import GenerateEstimateModel from '../estimates/generatedEstimates.model';

import ProjectProposal from '../../modules/proposals/proposal.model';
import { CrmContractModel } from '../../modules/crm/contract/crm-contract.model';
import { DailyWorkModal } from '../../modules/crm/daily-work-lead/daily-work.model';
import BidsManagement from '../../modules/bids-management/bids-management.model';
import Invoices from '../../modules/invoices/invoices.model';
import ClientInvoice from '../../modules/invoices-client/client-invoices.model';
import { FinancialExpense } from '../../modules/financials/expense/financial-expense.model';
import { NewTakeOfSummariesModal } from '../../modules/takeoff-summary/takeoff-summary.model';
import CrmModel from '../../modules/crm/crm.model';
import { getDateRange } from '../../utils/dateUtils';
import { CustomError } from '../../errors/custom.error';
import { EHttpStatus } from '../../enums/httpStatus.enum';

export class PeriodWiseFeatureAnalytics {
  async getFeatureAnalytics(
    userId: string,
    key: UserDashboardKey,
    period: 'lastWeek' | 'lastMonth' | 'lastYear' | 'currentYear' = 'lastMonth'
  ) {
    return await this.byPeriod(
      userId,
      key,
      period as 'lastWeek' | 'lastMonth' | 'lastYear'
    );
  }

  private async byPeriod(
    userId: string,
    key: UserDashboardKey,
    period: 'lastWeek' | 'lastMonth' | 'lastYear'
  ) {
    if (key === 'dashboardConstruction.estimate') {
      const { currentEnd, currentStart, end, start } = getDateRange(period);
      const value = await analyticsService.getAnalytics(
        GenerateEstimateModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
        },
        period
      );

      const analytics = await analyticsService.getAnalyticsByDate(
        GenerateEstimateModel,
        {
          start,
          end,
          currentStart,
          currentEnd,
        },
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
        }
      );
      return {
        value,
        ...analytics,
      };
    } else if (key === 'dashboardConstruction.takeoff') {
      const { currentEnd, currentStart, end, start } = getDateRange(period);
      const value = await analyticsService.getAnalytics(
        NewTakeOfSummariesModal,
        {
          createdBy: new mongoose.Types.ObjectId(userId),
        },
        period
      );
      const analytics = await analyticsService.getAnalyticsByDate(
        NewTakeOfSummariesModal,
        {
          start,
          end,
          currentStart,
          currentEnd,
        },
        {
          createdBy: new mongoose.Types.ObjectId(userId),
        }
      );
      return {
        value,
        ...analytics,
      };
    } else if (key === 'dashboardConstruction.schedule') {
      return {
        value: 0,
        ...this.analytics,
      };
    } else if (key === 'preconstruct') {
      const takeoff = await analyticsService.getMonthlyAnalytics(
        NewTakeOfSummariesModal,
        {
          createdBy: new mongoose.Types.ObjectId(userId),
        },
        period as 'currentYear' | 'lastYear'
      );
      const estimate = await analyticsService.getMonthlyAnalytics(
        GenerateEstimateModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
        },
        period as 'currentYear' | 'lastYear'
      );
      const bids = await analyticsService.getMonthlyAnalytics(
        ProjectProposal,
        {
          user: new mongoose.Types.ObjectId(userId),
        },
        period as 'currentYear' | 'lastYear'
      );
      return {
        takeoff: takeoff,
        estimate: estimate,
        schedule: Array.from({ length: 12 }, () => 0),
        bids: bids,
      };
    } else if (key === 'dailyLeads') {
      const { end, start } = getDateRange(period);
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
      return dailyleads;
    } else if (key === 'bidManagement') {
      const { currentEnd, currentStart, end, start } = getDateRange(period);
      const active = await analyticsService.getAnalytics(
        BidsManagement,
        {
          user: new mongoose.Types.ObjectId(userId),
          status: 'active',
        },
        period
      );

      const draft = await analyticsService.getAnalytics(
        BidsManagement,
        {
          user: new mongoose.Types.ObjectId(userId),
          status: 'draft',
        },
        period
      );
      const archived = await analyticsService.getAnalytics(
        BidsManagement,
        {
          user: new mongoose.Types.ObjectId(userId),
          status: 'archived',
        },
        period
      );

      let total = await analyticsService.getAnalytics(
        BidsManagement,
        {
          user: new mongoose.Types.ObjectId(userId),
        },
        period
      );

      const analytics = await analyticsService.getAnalyticsByDate(
        BidsManagement,
        {
          start,
          end,
          currentStart,
          currentEnd,
        },
        {
          user: new mongoose.Types.ObjectId(userId),
        }
      );
      return {
        ...analytics,
        total: total,
        active: {
          value: active,
        },
        archived: {
          value: archived,
        },
        draft: {
          value: draft,
        },
      };
    } else if (key === 'crm') {
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

      const { currentEnd, currentStart, end, start } = getDateRange(period);

      const analytics = await analyticsService.getAnalyticsByDate(
        CrmModel as any,
        {
          start,
          end,
          currentStart,
          currentEnd,
        },
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
        }
      );

      return {
        ...analytics,
        client: {
          active: activeClients,
          inactive: inactiveClients,
          total: totalClients,
        },
        contractor: {
          active: activeContractors,
          inactive: inactiveContractors,
          total: totalContractors,
        },
        subContractor: {
          active: activeSubcontractors,
          inactive: inactiveSubcontractors,
          total: totalSubcontractors,
        },
        partner: {
          active: activePartners,
          inactive: inactivePartners,
          total: totalPartners,
        },
        architect: {
          active: activeArchitects,
          inactive: inactiveArchitects,
          total: totalArchitects,
        },
        vendor: {
          active: activeVendors,
          inactive: inactiveVendors,
          total: totalVendors,
        },
      };
    } else if (key === 'estimateReport') {
      const won = await analyticsService.getAnalytics(
        GenerateEstimateModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: 'won',
        },
        period
      );

      const poorQualification = await analyticsService.getAnalytics(
        GenerateEstimateModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: 'poorQualification',
        },
        period
      );

      const lost = await analyticsService.getAnalytics(
        GenerateEstimateModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: 'lost',
        },
        period
      );

      const active = await analyticsService.getAnalytics(
        GenerateEstimateModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: 'active',
        },
        period
      );

      return {
        won: {
          value: won,
        },
        lost: {
          value: lost,
        },
        active: {
          value: active,
        },
        poorQualification: {
          value: poorQualification,
        },
      };
    } else if (key === 'finance') {
      const paidInvoices = await analyticsService.getAnalytics(
        Invoices,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: 'paid',
        },
        period
      );
      const totalInvoices = await analyticsService.getAnalytics(
        Invoices,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
        },
        period
      );

      const paidExpenses = await analyticsService.getAnalytics(
        FinancialExpense as any,
        {
          user: new mongoose.Types.ObjectId(userId),
          status: 'paid',
        },
        period
      );

      const totalExpenses = await analyticsService.getAnalytics(
        FinancialExpense as any,
        {
          user: new mongoose.Types.ObjectId(userId),
        },
        period
      );

      const paidClientInvoices = await analyticsService.getAnalytics(
        ClientInvoice,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          $expr: {
            $eq: ['$totalAmount', '$amountPaid'],
          },
        },
        period
      );

      const totalClientInvoices = await analyticsService.getAnalytics(
        ClientInvoice,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
        },
        period
      );

      const { currentEnd, currentStart, end, start } = getDateRange(period);

      const invoicesAnalytics = await analyticsService.getAnalyticsByDate(
        Invoices,
        {
          start,
          end,
          currentStart,
          currentEnd,
        },
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
        }
      );
      const clientInvoicesAnalytics = await analyticsService.getAnalyticsByDate(
        ClientInvoice,
        {
          start,
          end,
          currentStart,
          currentEnd,
        },
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
        }
      );
      const expensesAnalytics = await analyticsService.getAnalyticsByDate(
        FinancialExpense as any,
        {
          start,
          end,
          currentStart,
          currentEnd,
        },
        {
          user: new mongoose.Types.ObjectId(userId),
        }
      );

      const analyticsResult: { type: 'profit' | 'loss'; value: number } = {
        value:
          (invoicesAnalytics.analytics.value || 0) +
          (clientInvoicesAnalytics.analytics.value || 0) +
          (expensesAnalytics.analytics.value || 0),
        type:
          invoicesAnalytics.analytics.type === 'profit' &&
          clientInvoicesAnalytics.analytics.type === 'profit' &&
          expensesAnalytics.analytics.type === 'profit'
            ? 'profit'
            : 'loss',
      };

      return {
        ...{
          analytics: {
            ...analyticsResult,
          },
        },
        total: paidClientInvoices + paidInvoices + paidExpenses,
        aiaInvoicing: {
          value: paidClientInvoices,
          total: totalClientInvoices,
        },
        standardInvoicing: {
          value: paidInvoices,
          total: totalInvoices,
        },
        expenses: {
          value: paidExpenses,
          total: totalExpenses,
        },
      };
    } else if (key === 'socialMedia.comments') {
      const { start, end, currentEnd, currentStart } = getDateRange(period);

      const comments = await analyticsService.getSocialMediaCommentAnalytics(
        userId,
        period
      );

      const analytics =
        await analyticsService.getSocialMediaCommentAnalyticsByDate(userId, {
          start,
          end,
          currentStart,
          currentEnd,
        });
      return {
        ...analytics,
        value: comments,
      };
    } else if (key === 'socialMedia.likes') {
      const { start, end, currentEnd, currentStart } = getDateRange(period);
      const likes = await analyticsService.getSocialMediaLikesAnalytics(
        userId,
        period
      );
      const analytics =
        await analyticsService.getSocialMediaLikesAnalyticsByDate(userId, {
          start,
          end,
          currentStart,
          currentEnd,
        });
      return {
        ...analytics,
        value: likes,
      };
    } else if (key === 'socialMedia.shares') {
      const { start, end, currentEnd, currentStart } = getDateRange(period);

      const shares = await analyticsService.getSocialMediaSharesAnalytics(
        userId,
        period
      );

      const sharesAnalytics =
        await analyticsService.getSocialMediaSharesAnalyticsByDate(userId, {
          start,
          end,
          currentStart,
          currentEnd,
        });
      return {
        ...sharesAnalytics,
        value: shares,
      };
    } else {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        `Invalid Feature Request ${key}`
      );
    }
  }

  private analytics(type: 'profit' | 'loss' = 'profit', value: number = 0) {
    return {
      analytics: {
        type: type,
        value: value,
      },
    };
  }
}

export default new PeriodWiseFeatureAnalytics();
