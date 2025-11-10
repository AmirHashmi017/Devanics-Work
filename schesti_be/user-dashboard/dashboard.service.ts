import { Request } from 'express';
import moment from 'moment';
import mongoose, { FilterQuery, PipelineStage } from 'mongoose';

// Types
import { IDateRange } from '../../contants/types';
// Models
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
import { ObjectId } from '../../utils';
import { ResponseMessage } from '../../enums/resMessage.enum';
import { EHttpStatus } from '../../enums/httpStatus.enum';
import Meeting from '../../modules/meeting/meeting.model';
import {
  PostModel,
  PostShare,
} from '../../modules/social-media/social-media.model';
import Schedule from '../schedular/Models/Project';
import SavedUserBidsProjects from '../../modules/bids-management/user-bids-project.model';
import _ from 'lodash';

type IDifferenceRange = [string, string, string, string];

class Analytics {
  private async buildAnalyticsPipeline(
    initialFilter: { [key: string]: any },
    period?: IDateRange,
    matchKey = 'createdAt'
  ): Promise<PipelineStage[]> {
    const pipeline: PipelineStage[] = [];
    const match: FilterQuery<{}> = {
      ...initialFilter,
    };

    if (period) {
      const start = moment(period[0]);
      const end = moment(period[1]);
      match[matchKey] = {
        $gte: start.toDate(),
        $lt: end.toDate(),
      };
    }

    pipeline.push({
      $match: match,
    });

    pipeline.push({
      $count: 'value',
    });

    return pipeline;
  }

  async getAnalytics(
    model: mongoose.Model<any>,
    initialFilter: { [key: string]: any },
    //   period?: IPeriod |
    // [string, string] it will be start and end date
    period?: IDateRange,
    matchKey = 'createdAt'
  ) {
    const pipeline = await this.buildAnalyticsPipeline(
      initialFilter,
      period,
      matchKey
    );
    const result: (mongoose.Document & { value: number })[] =
      await model.aggregate(pipeline);
    return result[0]?.value || 0;
  }

  async getAnalyticsByDifferenceRange(
    model: mongoose.Model<any>,
    initialFilter: { [key: string]: any },
    period?: IDifferenceRange,
    matchKey = 'createdAt'
  ) {
    if (period) {
      const start = period[0];
      const end = period[1];
      const currentStart = period[2];
      const currentEnd = period[3];

      const result1 = await this.getAnalytics(
        model,
        initialFilter,
        [start, end],
        matchKey
      );
      const result2 = await this.getAnalytics(
        model,
        initialFilter,
        [currentStart, currentEnd],
        matchKey
      );
      const difference = (result2 || 0) - (result1 || 0);
      return {
        analytics: {
          type: difference > 0 || difference === 0 ? 'profit' : 'loss',
          value: Math.abs(difference),
        },
        value: result1 + result2,
      };
    }

    return null;
  }

  async getTweleveMonthAnalyticsByDifferenceRange(
    model: mongoose.Model<any>,
    initialFilter: { [key: string]: any },
    period?: IDateRange,
    matchDateKey = 'createdAt'
  ) {
    const pipeline: PipelineStage[] = [];
    let match: Record<string, any> = {
      ...initialFilter,
    };
    if (period) {
      const [start, end] = period;

      match[matchDateKey] = {
        $gte: moment(start).toDate(),
        $lte: moment(end).toDate(),
      };
    }

    pipeline.push({
      $match: match,
    });

    pipeline.push({
      $project: {
        year: { $year: `$${matchDateKey}` },
        month: { $month: `$${matchDateKey}` },
      },
    });

    pipeline.push({
      $group: {
        _id: { year: '$year', month: '$month' },
        count: {
          $sum: 1,
        },
      },
    });

    const result: { _id: { year: number; month: number }; count: number }[] =
      await model.aggregate(pipeline);
    const monthlyData = Array(12).fill(0); // Initialize with 0 for each month

    result?.forEach((item: { _id: { month: number }; count: number }) => {
      monthlyData[item._id.month - 1] = item.count; // Set the count for the respective month
    });

    return monthlyData;
  }
}

const analytics = new Analytics();

class DashboardService {
  private getDateRangeFromString(value?: string) {
    if (value) {
      return value.split(',');
    }
    return undefined;
  }

  async getConstructionEstimate(req: Request) {
    const period = this.getDateRangeFromString(req.query.period as string) as
      | IDateRange
      | undefined;
    const range = this.getDateRangeFromString(
      req.query.range as string
    ) as IDifferenceRange;
    const userId = req.payload._id;
    if (range) {
      const result = await analytics.getAnalyticsByDifferenceRange(
        GenerateEstimateModel,
        {
          associatedCompany: ObjectId(userId),
        },
        range
      );
      return {
        message: ResponseMessage.SUCCESSFUL,
        statusCode: EHttpStatus.OK,
        data: result,
      };
    } else {
      const result = await analytics.getAnalytics(
        GenerateEstimateModel,
        {
          associatedCompany: ObjectId(userId),
        },
        period
      );
      return {
        message: ResponseMessage.SUCCESSFUL,
        statusCode: EHttpStatus.OK,
        data: {
          value: result,
        },
      };
    }
  }

  async getQuantityTakeoff(req: Request) {
    const period = this.getDateRangeFromString(req.query.period as string) as
      | IDateRange
      | undefined;
    const range = this.getDateRangeFromString(
      req.query.range as string
    ) as IDifferenceRange;
    const userId = req.payload._id;

    if (range) {
      const result = await analytics.getAnalyticsByDifferenceRange(
        NewTakeOfSummariesModal,
        {
          createdBy: ObjectId(userId),
        },
        range,
        'createdate'
      );
      return {
        message: ResponseMessage.SUCCESSFUL,
        statusCode: EHttpStatus.OK,
        data: result,
      };
    } else {
      const result = await analytics.getAnalytics(
        NewTakeOfSummariesModal,
        {
          createdBy: ObjectId(userId),
        },
        period,
        'createdate'
      );
      return {
        message: ResponseMessage.SUCCESSFUL,
        statusCode: EHttpStatus.OK,
        data: {
          value: result,
        },
      };
    }
  }

  async getTimeSchedule(req: Request) {
    const period = this.getDateRangeFromString(req.query.period as string) as
      | IDateRange
      | undefined;
    const range = this.getDateRangeFromString(
      req.query.range as string
    ) as IDifferenceRange;
    const userId = req.payload._id;

    if (range) {
      const result = await analytics.getAnalyticsByDifferenceRange(
        Schedule,
        {
          userId: ObjectId(userId),
        },
        range
      );
      return {
        message: ResponseMessage.SUCCESSFUL,
        statusCode: EHttpStatus.OK,
        data: result,
      };
    } else {
      const result = await analytics.getAnalytics(
        Schedule,
        {
          userId: ObjectId(userId),
        },
        period
      );
      return {
        message: ResponseMessage.SUCCESSFUL,
        statusCode: EHttpStatus.OK,
        data: {
          value: result,
        },
      };
    }
  }

  async getProjectManagement(req: Request) {
    const period = this.getDateRangeFromString(req.query.period as string) as
      | IDateRange
      | undefined;
    const range = this.getDateRangeFromString(
      req.query.range as string
    ) as IDifferenceRange;
    const userId = req.payload._id;

    if (range) {
      // contracts
      const totalContracts = await analytics.getAnalyticsByDifferenceRange(
        CrmContractModel,
        {
          user: ObjectId(userId),
          status: 'signed',
          isDeleted: false,
        },
        range,
        'startDate'
      );

      // takeoff
      const totalTakeoff = await analytics.getAnalyticsByDifferenceRange(
        NewTakeOfSummariesModal,
        {
          createdBy: ObjectId(userId),
        },
        range
      );
      // estimate
      const totalEstimate = await analytics.getAnalyticsByDifferenceRange(
        GenerateEstimateModel,
        {
          associatedCompany: ObjectId(userId),
        },
        range
      );
      // scheduled projects

      const scheduled = await analytics.getAnalyticsByDifferenceRange(
        Schedule,
        {
          userId: ObjectId(userId),
        },
        range
      );

      // meetings
      const meetings = await analytics.getAnalyticsByDifferenceRange(
        Meeting,
        {
          associatedCompany: ObjectId(userId),
        },
        range
      );

      return {
        message: ResponseMessage.SUCCESSFUL,
        statusCode: EHttpStatus.OK,
        data: {
          contracts: totalContracts.value,
          estimates: totalEstimate.value,
          meetings: meetings.value,
          scheduled: scheduled.value,
          takeoffs: totalTakeoff.value,
        },
      };
    } else {
      // contracts
      const totalContracts = await analytics.getAnalytics(
        CrmContractModel,
        {
          user: ObjectId(userId),
          status: 'signed',
          isDeleted: false,
        },
        period,
        'startDate'
      );

      // takeoff
      const totalTakeoff = await analytics.getAnalytics(
        NewTakeOfSummariesModal,
        {
          createdBy: ObjectId(userId),
        },
        period
      );
      // estimate
      const totalEstimate = await analytics.getAnalytics(
        GenerateEstimateModel,
        {
          associatedCompany: ObjectId(userId),
        },
        period
      );
      // scheduled projects

      const scheduled = await analytics.getAnalytics(
        Schedule,
        {
          userId: ObjectId(userId),
        },
        period
      );

      // meetings
      const meetings = await analytics.getAnalytics(
        Meeting,
        {
          associatedCompany: ObjectId(userId),
        },
        period
      );
      return {
        message: ResponseMessage.SUCCESSFUL,
        statusCode: EHttpStatus.OK,
        data: {
          contracts: totalContracts,
          estimates: totalEstimate,
          meetings: meetings,
          scheduled: scheduled,
          takeoffs: totalTakeoff,
        },
      };
    }
  }

  async getPreconstruction(req: Request) {
    let period = this.getDateRangeFromString(req.query.period as string) as
      | IDateRange
      | undefined;

    if (!period) {
      period = [
        moment().startOf('year').toDate().toLocaleDateString(),
        moment().endOf('year').toDate().toLocaleDateString(),
      ];
    }
    const userId = req.payload._id;

    const takeoffs = await analytics.getTweleveMonthAnalyticsByDifferenceRange(
      NewTakeOfSummariesModal,
      {
        createdBy: ObjectId(userId),
      },
      period,
      'createdate'
    );
    const estimates = await analytics.getTweleveMonthAnalyticsByDifferenceRange(
      GenerateEstimateModel,
      {
        associatedCompany: ObjectId(userId),
      },
      period
    );

    const schedule = await analytics.getTweleveMonthAnalyticsByDifferenceRange(
      Schedule,
      {
        userId: ObjectId(userId),
      },
      period
    );

    const proposals = await analytics.getTweleveMonthAnalyticsByDifferenceRange(
      ProjectProposal,
      {
        user: ObjectId(userId),
      },
      period
    );

    const projects = await analytics.getTweleveMonthAnalyticsByDifferenceRange(
      BidsManagement,
      {
        user: ObjectId(userId),
      },
      period
    );

    const savedBids = await analytics.getTweleveMonthAnalyticsByDifferenceRange(
      SavedUserBidsProjects,
      {
        user: ObjectId(userId),
      },
      period
    );

    const bids = _.zipWith(proposals, projects, savedBids, (a, b, c) => {
      return Number(a) + Number(b) + Number(c);
    });

    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data: {
        takeoffs,
        estimates,
        scheduled: schedule,
        bids,
      },
    };
  }

  async getDailyWork(req: Request) {
    const period = this.getDateRangeFromString(req.query.period as string) as
      | IDateRange
      | undefined;
    const userId = req.payload._id;
    const match: Record<string, any> = {
      user: ObjectId(userId),
    };
    if (period) {
      match.createdAt = {
        $gte: new Date(period[0]),
        $lte: new Date(period[1]),
      };
    }
    const dailyleads = await DailyWorkModal.find(match)
      .populate('status')
      .populate('priority')
      .sort({ createdAt: -1 })
      .limit(5);

    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data: dailyleads,
    };
  }

  async getBidManagement(req: Request) {
    const period = this.getDateRangeFromString(req.query.period as string) as
      | IDateRange
      | undefined;
    const range = this.getDateRangeFromString(
      req.query.range as string
    ) as IDifferenceRange;
    const userId = req.payload._id;

    if (range) {
      const archived = await analytics.getAnalyticsByDifferenceRange(
        BidsManagement,
        {
          user: new mongoose.Types.ObjectId(userId),
          status: 'archived',
        },
        range
      );
      const active = await analytics.getAnalyticsByDifferenceRange(
        BidsManagement,
        {
          user: new mongoose.Types.ObjectId(userId),
          status: 'active',
        },
        range
      );
      const draft = await analytics.getAnalyticsByDifferenceRange(
        BidsManagement,
        {
          user: new mongoose.Types.ObjectId(userId),
          status: 'draft',
        },
        range
      );
      const total = await analytics.getAnalyticsByDifferenceRange(
        BidsManagement,
        {
          user: new mongoose.Types.ObjectId(userId),
        },
        range
      );
      return {
        message: ResponseMessage.SUCCESSFUL,
        statusCode: EHttpStatus.OK,
        data: {
          analytics: total.analytics,
          total: total.value,
          archived: archived.value,
          active: active.value,
          draft: draft.value,
        },
      };
    } else {
      const archived = await analytics.getAnalytics(
        BidsManagement,
        {
          user: new mongoose.Types.ObjectId(userId),
          status: 'archived',
        },
        period
      );
      const active = await analytics.getAnalytics(
        BidsManagement,
        {
          user: new mongoose.Types.ObjectId(userId),
          status: 'active',
        },
        period
      );
      const draft = await analytics.getAnalytics(
        BidsManagement,
        {
          user: new mongoose.Types.ObjectId(userId),
          status: 'draft',
        },
        period
      );
      const total = await analytics.getAnalytics(
        BidsManagement,
        {
          user: new mongoose.Types.ObjectId(userId),
        },
        period
      );
      return {
        message: ResponseMessage.SUCCESSFUL,
        statusCode: EHttpStatus.OK,
        data: {
          archived,
          active,
          draft,
          total,
        },
      };
    }
  }

  async getFinancialManagement(req: Request) {
    const period = this.getDateRangeFromString(req.query.period as string) as
      | IDateRange
      | undefined;
    const range = this.getDateRangeFromString(
      req.query.range as string
    ) as IDifferenceRange;
    const userId = req.payload._id;

    if (range) {
      const paidStandard = await analytics.getAnalyticsByDifferenceRange(
        Invoices,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: 'paid',
        },
        range
      );
      const standardInvoicingTotal =
        await analytics.getAnalyticsByDifferenceRange(
          Invoices,
          {
            associatedCompany: new mongoose.Types.ObjectId(userId),
          },
          range
        );

      const paidAIA = await analytics.getAnalyticsByDifferenceRange(
        ClientInvoice,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          $expr: {
            $eq: ['$totalAmount', '$amountPaid'],
          },
        },
        range
      );
      const aiaInvoicingTotal = await analytics.getAnalyticsByDifferenceRange(
        ClientInvoice,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
        },
        range
      );

      const paidExpenses = await analytics.getAnalyticsByDifferenceRange(
        FinancialExpense,
        {
          user: new mongoose.Types.ObjectId(userId),
          status: 'paid',
        },
        range
      );
      const expensesTotal = await analytics.getAnalyticsByDifferenceRange(
        FinancialExpense,
        {
          user: new mongoose.Types.ObjectId(userId),
        },
        range
      );

      const financialAnalytics =
        standardInvoicingTotal.analytics.value +
        aiaInvoicingTotal.analytics.value -
        expensesTotal.analytics.value;

      return {
        message: ResponseMessage.SUCCESSFUL,
        statusCode: EHttpStatus.OK,
        data: {
          analytics: {
            type: financialAnalytics > 0 ? 'profit' : 'loss',
            value: financialAnalytics,
          },
          aia: {
            paid: paidAIA.analytics.value,
            total: aiaInvoicingTotal.analytics.value,
          },
          standard: {
            paid: paidStandard.analytics.value,
            total: standardInvoicingTotal.analytics.value,
          },
          expenses: {
            paid: paidExpenses.analytics.value,
            total: expensesTotal.analytics.value,
          },
        },
      };
    } else {
      const paidStandard = await analytics.getAnalytics(
        Invoices,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: 'paid',
        },
        period
      );
      const standardInvoicingTotal = await analytics.getAnalytics(
        Invoices,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
        },
        period
      );

      const paidAIA = await analytics.getAnalytics(
        ClientInvoice,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          $expr: {
            $eq: ['$totalAmount', '$amountPaid'],
          },
        },
        period
      );
      const aiaInvoicingTotal = await analytics.getAnalytics(
        ClientInvoice,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
        },
        period
      );

      const paidExpenses = await analytics.getAnalytics(
        FinancialExpense,
        {
          user: new mongoose.Types.ObjectId(userId),
          status: 'paid',
        },
        period
      );
      const expensesTotal = await analytics.getAnalytics(
        FinancialExpense,
        {
          user: new mongoose.Types.ObjectId(userId),
        },
        period
      );

      return {
        message: ResponseMessage.SUCCESSFUL,
        statusCode: EHttpStatus.OK,
        data: {
          aia: {
            paid: paidAIA,
            total: aiaInvoicingTotal,
          },
          standard: {
            paid: paidStandard,
            total: standardInvoicingTotal,
          },
          expenses: {
            paid: paidExpenses,
            total: expensesTotal,
          },
        },
      };
    }
  }

  async getSocialMediaComments(req: Request) {
    const period = this.getDateRangeFromString(req.query.period as string) as
      | IDateRange
      | undefined;
    const range = this.getDateRangeFromString(
      req.query.range as string
    ) as IDifferenceRange;
    const userId = req.payload._id;

    if (range) {
      const [start, end, currentStart, currentEnd] = range;
      const pipeline1: PipelineStage[] = [
        {
          $match: {
            associatedCompany: new mongoose.Types.ObjectId(userId),
            createdAt: {
              $gte: moment(start).toDate(),
              $lte: moment(end).toDate(),
            },
          },
        },
        {
          $lookup: {
            from: 'usercomments',
            localField: '_id',
            foreignField: 'parentId',
            as: 'comments',
          },
        },
        {
          $project: {
            _id: 0,
            totalComments: {
              $size: {
                $filter: {
                  input: '$comments',
                  as: 'comment',
                  cond: {
                    $ne: [
                      '$$comment.associatedCompany',
                      new mongoose.Types.ObjectId(userId),
                    ],
                  },
                },
              },
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalComments' },
          },
        },
      ];

      const pipeline2: PipelineStage[] = [
        {
          $match: {
            associatedCompany: new mongoose.Types.ObjectId(userId),
            createdAt: {
              $gte: moment(currentStart).toDate(),
              $lte: moment(currentEnd).toDate(),
            },
          },
        },
        {
          $lookup: {
            from: 'usercomments',
            localField: '_id',
            foreignField: 'parentId',
            as: 'comments',
          },
        },
        {
          $project: {
            _id: 0,
            totalComments: {
              $size: {
                $filter: {
                  input: '$comments',
                  as: 'comment',
                  cond: {
                    $ne: [
                      '$$comment.associatedCompany',
                      new mongoose.Types.ObjectId(userId),
                    ],
                  },
                },
              },
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalComments' },
          },
        },
      ];
      const result1: { total: number }[] = await PostModel.aggregate(pipeline1);
      const result2: { total: number }[] = await PostModel.aggregate(pipeline2);
      const difference = (result2[0]?.total || 0) - (result1[0]?.total || 0);
      return {
        message: ResponseMessage.SUCCESSFUL,
        statusCode: EHttpStatus.OK,
        data: {
          analytics: {
            type: difference > 0 || difference === 0 ? 'profit' : 'loss',
            value: Math.abs(difference),
          },
          value: (result1[0]?.total || 0) + (result2[0]?.total || 0),
        },
      };
    } else {
      const matchPipeline: PipelineStage[] = [
        {
          $match: {
            associatedCompany: new mongoose.Types.ObjectId(userId),
          },
        },
      ];

      if (period) {
        let [start, end] = period;
        matchPipeline.push({
          $match: {
            createdAt: {
              $gte: moment(start).toDate(),
              $lte: moment(end).toDate(),
            },
          },
        });
      }

      const pipeline: PipelineStage[] = [
        ...matchPipeline,
        {
          $lookup: {
            from: 'usercomments',
            localField: '_id',
            foreignField: 'parentId',
            as: 'comments',
          },
        },
        {
          $project: {
            _id: 1,
            totalComments: {
              $size: {
                $filter: {
                  input: '$comments',
                  as: 'comment',
                  cond: {
                    $ne: [
                      '$$comment.associatedCompany',
                      new mongoose.Types.ObjectId(userId),
                    ],
                  },
                },
              },
            },
          },
        },

        {
          $group: {
            _id: null,
            total: { $sum: '$totalComments' },
          },
        },
      ];
      const result: { total: number }[] = await PostModel.aggregate(pipeline);
      return {
        message: ResponseMessage.SUCCESSFUL,
        statusCode: EHttpStatus.OK,
        data: {
          value: result.length > 0 ? result[0].total : 0,
        },
      };
    }
  }

  async getSocialMediaLikes(req: Request) {
    const period = this.getDateRangeFromString(req.query.period as string) as
      | IDateRange
      | undefined;
    const range = this.getDateRangeFromString(
      req.query.range as string
    ) as IDifferenceRange;
    const userId = req.payload._id;
    if (range) {
      let [start, end, currentStart, currentEnd] = range;
      console.log(start, end, currentStart, currentEnd);
      const pipeline1 = [
        {
          $match: {
            associatedCompany: new mongoose.Types.ObjectId(userId),
            createdAt: {
              $gte: moment(start).toDate(),
              $lte: moment(end).toDate(),
            },
          },
        },
        {
          $unwind: '$reactions',
        },
        {
          $match: {
            'reactions.associatedCompany': {
              $ne: new mongoose.Types.ObjectId(userId),
            },
          },
        },
        {
          $group: {
            _id: null,
            totalReactions: { $sum: 1 },
          },
        },
      ];

      const pipeline2 = [
        {
          $match: {
            associatedCompany: new mongoose.Types.ObjectId(userId),
            createdAt: {
              $gte: moment(currentStart).toDate(),
              $lte: moment(currentEnd).toDate(),
            },
          },
        },
        {
          $unwind: '$reactions',
        },
        {
          $match: {
            'reactions.associatedCompany': {
              $ne: new mongoose.Types.ObjectId(userId),
            },
          },
        },
        {
          $group: {
            _id: null,
            totalReactions: { $sum: 1 },
          },
        },
      ];

      const result1: ({ totalReactions: number } | null)[] =
        await PostModel.aggregate(pipeline1);
      const result2: ({ totalReactions: number } | null)[] =
        await PostModel.aggregate(pipeline2);
      const difference =
        (result2[0]?.totalReactions || 0) - (result1[0]?.totalReactions || 0);
      return {
        message: ResponseMessage.SUCCESSFUL,
        statusCode: EHttpStatus.OK,
        data: {
          analytics: {
            type: difference > 0 || difference === 0 ? 'profit' : 'loss',
            value: Math.abs(difference),
          },
          value:
            (result1[0]?.totalReactions || 0) +
            (result2[0]?.totalReactions || 0),
        },
      };
    } else {
      const matchPipeline: PipelineStage[] = [
        {
          $match: {
            associatedCompany: new mongoose.Types.ObjectId(userId),
          },
        },
      ];

      if (period) {
        let [start, end] = period;
        matchPipeline.push({
          $match: {
            createdAt: {
              $gte: moment(start).toDate(),
              $lte: moment(end).toDate(),
            },
          },
        });
      }

      const pipeline: PipelineStage[] = [
        ...matchPipeline,
        {
          $unwind: '$reactions',
        },
        {
          $match: {
            'reactions.associatedCompany': {
              $ne: new mongoose.Types.ObjectId(userId),
            },
          },
        },
        {
          $group: {
            _id: null,
            totalReactions: { $sum: 1 },
          },
        },
      ];
      const result = await PostModel.aggregate(pipeline);
      return {
        message: ResponseMessage.SUCCESSFUL,
        statusCode: EHttpStatus.OK,
        data: {
          value: result[0]?.totalReactions || 0,
        },
      };
    }
  }

  async getSocialMediaShares(req: Request) {
    const period = this.getDateRangeFromString(req.query.period as string) as
      | IDateRange
      | undefined;
    const range = this.getDateRangeFromString(
      req.query.range as string
    ) as IDifferenceRange;
    const userId = req.payload._id;

    if (range) {
      const [start, end, currentStart, currentEnd] = range;
      const pipeline1: PipelineStage[] = [
        {
          $lookup: {
            from: 'posts',
            localField: 'postId',
            foreignField: '_id',
            as: 'result',
          },
        },

        {
          $match: {
            'result.associatedCompany': new mongoose.Types.ObjectId(userId),
            createdAt: {
              $gte: moment(start).toDate(),
              $lte: moment(end).toDate(),
            },
          },
        },
        {
          $group: {
            _id: null,
            totalShares: { $sum: '$shareCount' },
          },
        },
      ];

      const pipeline2: PipelineStage[] = [
        {
          $lookup: {
            from: 'posts',
            localField: 'postId',
            foreignField: '_id',
            as: 'result',
          },
        },
        {
          $match: {
            'result.associatedCompany': new mongoose.Types.ObjectId(userId),
            createdAt: {
              $gte: moment(currentStart).toDate(),
              $lte: moment(currentEnd).toDate(),
            },
          },
        },
        {
          $group: {
            _id: null,
            totalShares: { $sum: '$shareCount' },
          },
        },
      ];

      const result1 = await PostShare.aggregate(pipeline1);
      const result2 = await PostShare.aggregate(pipeline2);
      const difference =
        (result2[0]?.totalShares || 0) - (result1[0]?.totalShares || 0);
      return {
        message: ResponseMessage.SUCCESSFUL,
        statusCode: EHttpStatus.OK,
        data: {
          analytics: {
            type: difference > 0 || difference === 0 ? 'profit' : 'loss',
            value: Math.abs(difference),
          },
          value:
            (result1[0]?.totalShares || 0) + (result2[0]?.totalShares || 0),
        },
      };
    } else {
      const matchPipeline: PipelineStage[] = [
        {
          $match: {
            associatedCompany: new mongoose.Types.ObjectId(userId),
          },
        },
      ];

      if (period) {
        const [start, end] = period;
        matchPipeline.push({
          $match: {
            createdAt: {
              $gte: moment(start).toDate(),
              $lte: moment(end).toDate(),
            },
          },
        });
      }

      const pipeline: PipelineStage[] = [
        ...matchPipeline,
        {
          $group: {
            _id: null,
            totalShares: { $sum: '$shareCount' },
          },
        },
      ];

      const result = await PostShare.aggregate(pipeline);

      return {
        message: ResponseMessage.SUCCESSFUL,
        statusCode: EHttpStatus.OK,
        data: {
          value: result[0]?.totalShares || 0,
        },
      };
    }
  }

  async getCRM(req: Request) {
    const period = this.getDateRangeFromString(req.query.period as string) as
      | IDateRange
      | undefined;
    const range = this.getDateRangeFromString(
      req.query.range as string
    ) as IDifferenceRange;
    const userId = req.payload._id;
    if (range) {
      const subcontractorsTotal = await analytics.getAnalyticsByDifferenceRange(
        CrmModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          module: 'subcontractors',
        },
        range
      );

      const activeSubcontractors =
        await analytics.getAnalyticsByDifferenceRange(
          CrmModel,
          {
            associatedCompany: new mongoose.Types.ObjectId(userId),
            status: true,
            module: 'subcontractors',
          },
          range
        );
      const inactiveSubcontractors =
        await analytics.getAnalyticsByDifferenceRange(
          CrmModel,
          {
            associatedCompany: new mongoose.Types.ObjectId(userId),
            status: false,
            module: 'subcontractors',
          },
          range
        );

      // Partners
      const partners = await analytics.getAnalyticsByDifferenceRange(
        CrmModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          module: 'partners',
        },
        range
      );

      const activePartners = await analytics.getAnalyticsByDifferenceRange(
        CrmModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: true,
          module: 'partners',
        },
        range
      );
      const inactivePartners = await analytics.getAnalyticsByDifferenceRange(
        CrmModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: false,
          module: 'partners',
        },
        range
      );

      // Clients
      const clients = await analytics.getAnalyticsByDifferenceRange(
        CrmModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),

          module: 'clients',
        },
        range
      );

      const activeClients = await analytics.getAnalyticsByDifferenceRange(
        CrmModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: true,
          module: 'clients',
        },
        range
      );
      const inactiveClients = await analytics.getAnalyticsByDifferenceRange(
        CrmModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: false,
          module: 'clients',
        },
        range
      );

      // Vendors
      const vendors = await analytics.getAnalyticsByDifferenceRange(
        CrmModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),

          module: 'vendors',
        },
        range
      );

      const activeVendors = await analytics.getAnalyticsByDifferenceRange(
        CrmModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: true,
          module: 'vendors',
        },
        range
      );
      const inactiveVendors = await analytics.getAnalyticsByDifferenceRange(
        CrmModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: false,
          module: 'vendors',
        },
        range
      );

      // Architects
      const architects = await analytics.getAnalyticsByDifferenceRange(
        CrmModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),

          module: 'architects',
        },
        range
      );

      const activeArchitects = await analytics.getAnalyticsByDifferenceRange(
        CrmModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: true,
          module: 'architects',
        },
        range
      );
      const inactiveArchitects = await analytics.getAnalyticsByDifferenceRange(
        CrmModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: false,
          module: 'architects',
        },
        range
      );

      // Contractors
      const contractors = await analytics.getAnalyticsByDifferenceRange(
        CrmModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),

          module: 'contractors',
        },
        range
      );

      const activeContractors = await analytics.getAnalyticsByDifferenceRange(
        CrmModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: true,
          module: 'contractors',
        },
        range
      );

      const inactiveContractors = await analytics.getAnalyticsByDifferenceRange(
        CrmModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: false,
          module: 'contractors',
        },
        range
      );

      const crm = await analytics.getAnalyticsByDifferenceRange(
        CrmModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
        },
        range
      );
      return {
        message: ResponseMessage.SUCCESSFUL,
        statusCode: EHttpStatus.OK,
        data: {
          analytics: crm.analytics,
          subcontractors: {
            total: subcontractorsTotal.value,
            active: activeSubcontractors.value,
            inactive: inactiveSubcontractors.value,
          },
          partners: {
            total: partners.value,
            active: activePartners.value,
            inactive: inactivePartners.value,
          },
          clients: {
            total: clients.value,
            active: activeClients.value,
            inactive: inactiveClients.value,
          },
          vendors: {
            total: vendors.value,
            active: activeVendors.value,
            inactive: inactiveVendors.value,
          },
          architects: {
            total: architects.value,
            active: activeArchitects.value,
            inactive: inactiveArchitects.value,
          },
          contractors: {
            total: contractors.value,
            active: activeContractors.value,
            inactive: inactiveContractors.value,
          },
        },
      };
    } else {
      const subcontractorsTotal = await analytics.getAnalytics(
        CrmModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          module: 'subcontractors',
        },
        period
      );

      const activeSubcontractors = await analytics.getAnalytics(
        CrmModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: true,
          module: 'subcontractors',
        },
        period
      );
      const inactiveSubcontractors = await analytics.getAnalytics(
        CrmModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: false,
          module: 'subcontractors',
        },
        period
      );

      // Partners
      const partners = await analytics.getAnalytics(
        CrmModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          module: 'partners',
        },
        period
      );

      const activePartners = await analytics.getAnalytics(
        CrmModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: true,
          module: 'partners',
        },
        period
      );
      const inactivePartners = await analytics.getAnalytics(
        CrmModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: false,
          module: 'partners',
        },
        period
      );

      // Clients
      const clients = await analytics.getAnalytics(
        CrmModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),

          module: 'clients',
        },
        period
      );

      const activeClients = await analytics.getAnalytics(
        CrmModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: true,
          module: 'clients',
        },
        period
      );
      const inactiveClients = await analytics.getAnalytics(
        CrmModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: false,
          module: 'clients',
        },
        period
      );

      // Vendors
      const vendors = await analytics.getAnalytics(
        CrmModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),

          module: 'vendors',
        },
        period
      );

      const activeVendors = await analytics.getAnalytics(
        CrmModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: true,
          module: 'vendors',
        },
        period
      );
      const inactiveVendors = await analytics.getAnalytics(
        CrmModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: false,
          module: 'vendors',
        },
        period
      );

      // Architects
      const architects = await analytics.getAnalytics(
        CrmModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),

          module: 'architects',
        },
        period
      );

      const activeArchitects = await analytics.getAnalytics(
        CrmModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: true,
          module: 'architects',
        },
        period
      );
      const inactiveArchitects = await analytics.getAnalytics(
        CrmModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: false,
          module: 'architects',
        },
        period
      );

      // Contractors
      const contractors = await analytics.getAnalytics(
        CrmModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),

          module: 'contractors',
        },
        period
      );

      const activeContractors = await analytics.getAnalytics(
        CrmModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: true,
          module: 'contractors',
        },
        period
      );
      const inactiveContractors = await analytics.getAnalytics(
        CrmModel,
        {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          status: false,
          module: 'contractors',
        },
        period
      );

      return {
        message: ResponseMessage.SUCCESSFUL,
        statusCode: EHttpStatus.OK,
        data: {
          subcontractors: {
            total: subcontractorsTotal,
            active: activeSubcontractors,
            inactive: inactiveSubcontractors,
          },
          partners: {
            total: partners,
            active: activePartners,
            inactive: inactivePartners,
          },
          clients: {
            total: clients,
            active: activeClients,
            inactive: inactiveClients,
          },
          vendors: {
            total: vendors,
            active: activeVendors,
            inactive: inactiveVendors,
          },
          architects: {
            total: architects,
            active: activeArchitects,
            inactive: inactiveArchitects,
          },
          contractors: {
            total: contractors,
            active: activeContractors,
            inactive: inactiveContractors,
          },
        },
      };
    }
  }

  async getEstimateReports(req: Request) {
    const period = this.getDateRangeFromString(req.query.period as string) as
      | IDateRange
      | undefined;
    const userId = req.payload._id;

    const won = await analytics.getAnalytics(
      GenerateEstimateModel,
      {
        associatedCompany: new mongoose.Types.ObjectId(userId),
        status: 'won',
      },
      period
    );
    const poorQualification = await analytics.getAnalytics(
      GenerateEstimateModel,
      {
        associatedCompany: new mongoose.Types.ObjectId(userId),
        status: 'poorQualification',
      },
      period
    );

    const lost = await analytics.getAnalytics(
      GenerateEstimateModel,
      {
        associatedCompany: new mongoose.Types.ObjectId(userId),
        reason: {
          $in: [
            'price',
            'competition',
            'budget',
            'timing',
            'poorQualification',
            'unresponsive',
            'noDecision',
            'other',
          ],
        },
      },
      period
    );

    const active = await analytics.getAnalytics(
      GenerateEstimateModel,
      {
        associatedCompany: new mongoose.Types.ObjectId(userId),
        status: 'active',
      },
      period
    );

    const total = await analytics.getAnalytics(
      GenerateEstimateModel,
      {
        associatedCompany: new mongoose.Types.ObjectId(userId),
      },
      period
    );

    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data: {
        won,
        poorQualification,
        lost,
        active,
        total,
      },
    };
  }
}

export default new DashboardService();
