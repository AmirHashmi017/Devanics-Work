import { IPeriod, IYearPeriod } from '../../contants/types';
import moment from 'moment';
import mongoose from 'mongoose';
import { FilterQuery } from 'mongoose';
import { PipelineStage } from 'mongoose';
import { getDateRange } from '../../utils/dateUtils';
import {
  PostModel,
  PostShare,
} from '../../modules/social-media/social-media.model';

class DashboardAnalyticsService {
  private async buildAnalyticsPipeline(
    initialFilter: any,
    period?:any
  ): Promise<any> {
    const pipeline: PipelineStage[] = [];
    const match: FilterQuery<{}> = {
      ...initialFilter,
    };

    if (period) {
      const { start, end } = getDateRange(period);
      match.createdAt = {
        $gte: start,
        $lt: end,
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

  private async buildPipelineByDate(
    startDate: Date,
    endDate: Date,
    initialFilter: { [key: string]: any }
  ): Promise<PipelineStage[]> {
    const pipeline: PipelineStage[] = [];
    const match: FilterQuery<{}> = {
      ...initialFilter,
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    };

    pipeline.push({
      $match: match,
    });

    pipeline.push({
      $count: 'value',
    });

    return pipeline;
  }

  async getAnalyticsByDate(
    model: any,
    range: { start: Date; end: Date; currentStart: Date; currentEnd: Date },
    initialFilter: { [key: string]: any }
  ) {
    const pipeline1 = await this.buildPipelineByDate(
      range.start,
      range.end,
      initialFilter
    );
    const pipeline2 = await this.buildPipelineByDate(
      range.currentStart,
      range.currentEnd,
      initialFilter
    );
    const result1 = await model.aggregate(pipeline1);
    const result2 = await model.aggregate(pipeline2);
    const difference = (result2[0]?.value || 0) - (result1[0]?.value || 0);
    return {
      analytics: {
        type: difference > 0 || difference === 0 ? 'profit' : 'loss',
        value: Math.abs(difference),
      },
    };
  }

  async getAnalytics(
    model: any,
    initialFilter: { [key: string]: any },
    //   period?: IPeriod |
    // [string, string] it will be start and end date
    period?: IPeriod | [string, string]
  ) {
    const pipeline = await this.buildAnalyticsPipeline(initialFilter, period);
    const result = await model.aggregate(pipeline);
    return result[0]?.value || 0;
  }

  async getMonthlyAnalytics(
    model: any,
    inititalFilter: { [key: string]: any },
    yearPeriod?: IYearPeriod
  ) {
    const pipeline: PipelineStage[] = [];
    let match: Record<string, any> = {
      ...inititalFilter,
    };
    if (yearPeriod && yearPeriod === 'lastYear') {
      const { start, end } = getDateRange(yearPeriod);
      match.createdAt = {
        $gte: start,
        $lt: end,
      };
    } else {
      //  consider it as current year
      const start = moment().startOf('year');
      const end = moment().endOf('year');
      match.createdAt = {
        $gte: start.toDate(),
        $lte: end.toDate(),
      };
    }

    pipeline.push({
      $match: match,
    });

    pipeline.push({
      $project: {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
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

  async getSocialMediaCommentAnalytics(
    userId: string,
    period?: IPeriod | [string, string]
  ) {
    const matchPipeline: PipelineStage[] = [
      {
        $match: {
          associatedCompany: new mongoose.Types.ObjectId(userId),
        },
      },
    ];

    if (period) {
      const { start, end } = getDateRange(period);
      matchPipeline.push({
        $match: {
          createdAt: {
            $gte: start,
            $lte: end,
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
    return result[0]?.total || 0;
  }

  async getSocialMediaCommentAnalyticsByDate(
    userId: string,
    range: { start: Date; end: Date; currentStart: Date; currentEnd: Date }
  ) {
    const pipeline1: PipelineStage[] = [
      {
        $match: {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          createdAt: {
            $gte: range.start,
            $lte: range.end,
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
            $gte: range.currentStart,
            $lte: range.currentEnd,
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
      analytics: {
        type: difference > 0 || difference === 0 ? 'profit' : 'loss',
        value: Math.abs(difference),
      },
    };
  }

  async getSocialMediaLikesAnalytics(
    userId: string,
    period?: IPeriod | [string, string]
  ) {
    const matchPipeline: PipelineStage[] = [
      {
        $match: {
          associatedCompany: new mongoose.Types.ObjectId(userId),
        },
      },
    ];

    if (period) {
      const { start, end } = getDateRange(period);
      matchPipeline.push({
        $match: {
          createdAt: {
            $gte: start,
            $lte: end,
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
    return result[0]?.totalReactions || 0;
  }

  async getSocialMediaLikesAnalyticsByDate(
    userId: string,
    range: { start: Date; end: Date; currentStart: Date; currentEnd: Date }
  ) {
    const pipeline1 = [
      {
        $match: {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          createdAt: {
            $gte: range.start,
            $lte: range.end,
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
            $gte: range.currentStart,
            $lte: range.currentEnd,
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

    const result1 = await PostModel.aggregate(pipeline1);
    const result2 = await PostModel.aggregate(pipeline2);
    const difference =
      (result2[0]?.totalReactions || 0) - (result1[0]?.totalReactions || 0);
    return {
      analytics: {
        type: difference > 0 || difference === 0 ? 'profit' : 'loss',
        value: Math.abs(difference),
      },
    };
  }

  async getSocialMediaSharesAnalytics(
    userId: string,
    period?: IPeriod | [string, string]
  ) {
    const matchPipeline: PipelineStage[] = [
      {
        $match: {
          associatedCompany: new mongoose.Types.ObjectId(userId),
        },
      },
    ];

    if (period) {
      const { start, end } = getDateRange(period);
      matchPipeline.push({
        $match: {
          createdAt: {
            $gte: start,
            $lte: end,
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
    return result[0]?.totalShares || 0;
  }

  async getSocialMediaSharesAnalyticsByDate(
    userId: string,
    range: { start: Date; end: Date; currentStart: Date; currentEnd: Date }
  ) {
    const pipeline1: PipelineStage[] = [
      {
        $match: {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          createdAt: {
            $gte: range.start,
            $lte: range.end,
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
        $match: {
          associatedCompany: new mongoose.Types.ObjectId(userId),
          createdAt: {
            $gte: range.currentStart,
            $lte: range.currentEnd,
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
      analytics: {
        type: difference > 0 || difference === 0 ? 'increase' : 'decrease',
        value: Math.abs(difference),
      },
    };
  }
}

export default new DashboardAnalyticsService();
