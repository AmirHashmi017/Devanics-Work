import Users from "../../modules/user/user.model";
import { EHttpStatus } from "../../enums/httpStatus.enum";
import { ResponseMessage } from "../../enums/resMessage.enum";
import PurchaseHistory from "../../modules/purchase-history/purchase-history.model";
import { PipelineStage } from "mongoose";
import { duration } from "moment";

class DashboardService {
  constructor() { }

  private calculatePercentage(current: number, previous: number): number {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }
    return Math.round(((current - previous) / previous) * 100);
  }
  //   total users
  async getTotalUsers(duration = '', isPrevious = false) {
  const currentDate = new Date();

  let query: any = { userRole: { $ne: 'admin' } };

  if (duration === 'month') {
    const targetMonth = new Date(currentDate);
    if (isPrevious) {
      targetMonth.setMonth(currentDate.getMonth() - 2); // Previous month
    } else {
      targetMonth.setMonth(currentDate.getMonth() - 1); // Current month
    }

    const monthStart = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1);
    const monthEnd = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 1);

    query.createdAt = {
      $gte: monthStart,
      $lt: monthEnd
    };
  }
  else if (duration === 'year') {
    const targetYear = isPrevious ? currentDate.getFullYear() - 1 : currentDate.getFullYear();
    
    query.createdAt = {
      $gte: new Date(targetYear, 0, 1),
      $lt: new Date(targetYear + 1, 0, 1)
    };
  }

  const usersCount = await Users.find(query).countDocuments();
  return usersCount;
}

  //  get users
  async getUsers(status = 'paid', duration = '', isPrevious = false) {
  const currentDate = new Date();

  const matchCondition: any = {
    userRole: { $ne: 'admin' },
    $expr: status === 'paid' ? { $gt: [{ $size: '$purchaseHistory' }, 0] } : {
      $eq: [{ $size: '$purchaseHistory' }, 0]
    }
  };

  if (duration === 'month') {
    const targetMonth = new Date(currentDate);
    if (isPrevious) {
      targetMonth.setMonth(currentDate.getMonth() - 2); // Previous month
    } else {
      targetMonth.setMonth(currentDate.getMonth() - 1); // Current month
    }

    const monthStart = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1);
    const monthEnd = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 1);

    matchCondition.createdAt = {
      $gte: monthStart,
      $lt: monthEnd
    };
  }
  else if (duration === 'year') {
    const targetYear = isPrevious ? currentDate.getFullYear() - 1 : currentDate.getFullYear();
    
    matchCondition.createdAt = {
      $gte: new Date(targetYear, 0, 1),
      $lt: new Date(targetYear + 1, 0, 1)
    };
  }

  const users = await Users.aggregate([
    {
      $lookup: {
        from: 'purchasehistories',
        localField: '_id',
        foreignField: 'user',
        as: 'purchaseHistory'
      }
    },
    {
      $match: matchCondition
    }
  ]);

  return users.length;
}


  // total earning

  async getTotalEarning(duration = '', isPrevious = false) {
  const currentDate = new Date();

  const matchCondition: any = {};

  if (duration === 'month') {
    const targetMonth = new Date(currentDate);
    if (isPrevious) {
      targetMonth.setMonth(currentDate.getMonth() - 2); // Previous month
    } else {
      targetMonth.setMonth(currentDate.getMonth() - 1); // Current month
    }

    const monthStart = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1);
    const monthEnd = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 1);

    matchCondition.createdAt = {
      $gte: monthStart,
      $lt: monthEnd
    };
  }
  else if (duration === 'year') {
    const targetYear = isPrevious ? currentDate.getFullYear() - 1 : currentDate.getFullYear();
    
    matchCondition.createdAt = {
      $gte: new Date(targetYear, 0, 1),
      $lt: new Date(targetYear + 1, 0, 1)
    };
  }

  const total = await PurchaseHistory.find(matchCondition)
    .populate('planId')
    .then((purchaseHistories) => {
      return purchaseHistories.reduce((total, purchase) => {
        const purchaseData: any = purchase;
        if (purchase.planId) {
          total += purchaseData.planId.price || 0;
        }
        return total;
      }, 0);
    });

  return total;
}



  //  earning report
  async getEarningReport(reportType = "year") {
    console.log('earning')

    const currentYear = new Date().getFullYear();
    const year = currentYear

    let reportData;
    // yearly report pipeline
    if (reportType === 'year') {
      const yearlyPipeline: any = [
        {
          $lookup: {
            from: "plans", // Join with 'plans' collection
            localField: "planId",
            foreignField: "_id",
            as: "planDetails"
          }
        },
        {
          $lookup: {
            from: "users", // Join with 'users' collection
            localField: "user",
            foreignField: "_id",
            as: "userDetails"
          }
        },
        {
          $unwind: { path: "$planDetails", preserveNullAndEmptyArrays: true } // Unwind 'planDetails', preserve if no match
        },
        {
          $addFields: {
            isPaidUser: {
              $cond: [
                {
                  $and: [
                    { $ifNull: ["$planDetails._id", false] }, // Check if plan exists
                    { $or: [{ $gte: ["$endDate", new Date()] }, { $eq: ["$endDate", null] }] } // Check endDate conditions
                  ]
                },
                true,
                false
              ]
            }
          }
        },
        {
          $addFields: {
            month: { $month: "$startDate" }, // Extract month
            year: { $year: "$startDate" }    // Extract year
          }
        },
        {
          $group: {
            _id: { month: "$month", year: "$year" },
            totalPaidUsers: { $sum: { $cond: ["$isPaidUser", 1, 0] } }, // Count paid users
            totalFreeUsers: { $sum: { $cond: ["$isPaidUser", 0, 1] } }, // Count free users
            totalRevenue: {
              $sum: {
                $cond: [
                  "$isPaidUser",
                  { $ifNull: ["$planDetails.price", 0] }, // Sum the 'price' if user is paid
                  0
                ]
              }
            }
          }
        },
        {
          $addFields: {
            difference: { $subtract: ["$totalPaidUsers", "$totalFreeUsers"] } // Difference between paid and free users
          }
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 } // Sort by year and month
        }
      ];

      const report = await PurchaseHistory.aggregate(yearlyPipeline);

      // Generate all months for the specified year
      const allMonths = Array.from({ length: 12 }, (_, i) => ({
        _id: { year, month: i + 1 },
        totalRevenue: 0,
        totalSubscriptions: 0,
        activeSubscriptions: 0
      }));

      // Merge missing months with aggregation result
      const filledReport = allMonths.map((month) => {
        const found = report.find(
          (r) => r._id.year === month._id.year && r._id.month === month._id.month
        );
        return found || month;
      });

      const graphData = [
        {
          name: "Paid Users",
          data: filledReport.map(item => item.totalPaidUsers || 0)  // Extract paid user data
        },
        {
          name: "Free Users",
          data: filledReport.map(item => item.totalFreeUsers || 0)  // Extract free user data
        }
      ];
      // Fallback to demo data if all values are zero or missing
      const isEmpty = graphData.every(series => series.data.every(val => !val));
      if (isEmpty) {
        reportData = [
          { name: "Paid Users", data: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60] },
          { name: "Free Users", data: [10, 8, 6, 4, 2, 1, 0, 0, 0, 0, 0, 0] }
        ];
      } else {
        reportData = graphData;
      }
    } else {
      // monthly report data
      const monthlyPipeline: PipelineStage[] = [
        {
          $match: {
            startDate: { $lte: new Date() },  // Users who started before now
            $or: [
              { endDate: { $gte: new Date() } },  // Users whose subscription is active
              { endDate: { $eq: null } }  // Users with no end date are treated as active
            ]
          }
        },
        {
          $addFields: {
            dayOfMonth: { $dayOfMonth: "$startDate" },  // Extract the day from startDate
            month: { $month: "$startDate" },  // Extract the month from startDate
            year: { $year: "$startDate" }  // Extract the year from startDate
          }
        },
        {
          $group: {
            _id: { day: "$dayOfMonth", month: "$month", year: "$year" },
            totalPaidUsers: {
              $sum: { $cond: [{ $eq: ["$status", "paid"] }, 1, 0] }  // Count paid users
            },
            totalFreeUsers: {
              $sum: { $cond: [{ $ne: ["$status", "paid"] }, 1, 0] }  // Count free users
            }
          }
        },
        {
          $sort: { "_id.day": 1 }  // Sort by day of the month
        },
        {
          $project: {
            day: "$_id.day",  // Extract the day value for each record
            paid: "$totalPaidUsers",  // Get the count of paid users
            free: "$totalFreeUsers"   // Get the count of free users
          }
        }
      ];

      const report = await PurchaseHistory.aggregate(monthlyPipeline);
      // Fallback to demo data if report is empty
      if (!report || report.length === 0) {
        reportData = [
          { day: 1, paid: 2, free: 5 },
          { day: 2, paid: 3, free: 4 },
          { day: 3, paid: 4, free: 3 },
          { day: 4, paid: 5, free: 2 },
          { day: 5, paid: 6, free: 1 }
        ];
      } else {
        reportData = report;
      }
    }
    return reportData
  }


  //   dashboard stats
  async dashboardStats({ query }) {
  const { duration = "month" } = query || {};

  // Current period data
  const totalUsers = await this.getTotalUsers(duration);
  const paidUsers = await this.getUsers('paid', duration);
  const freeUsers = await this.getUsers('free', duration);
  const totalEarning = await this.getTotalEarning(duration);
  
  // Previous period data
  const prevTotalUsers = await this.getTotalUsers(duration, true);
  const prevPaidUsers = await this.getUsers('paid', duration, true);
  const prevTotalEarning = await this.getTotalEarning(duration, true);

  // Calculate percentages
  const totalUsersPercentage = this.calculatePercentage(totalUsers, prevTotalUsers);
  const paidUsersPercentage = this.calculatePercentage(paidUsers, prevPaidUsers);
  const earningPercentage = this.calculatePercentage(totalEarning, prevTotalEarning);

  // Determine trends
  const totalUsersTrend = totalUsers >= prevTotalUsers ? 'up' : 'down';
  const paidUsersTrend = paidUsers >= prevPaidUsers ? 'up' : 'down';
  const earningTrend = totalEarning >= prevTotalEarning ? 'up' : 'down';

  const reportData = await this.getEarningReport(duration || 'month');
  const countryStats = await this.getCountryWiseUsers(duration);

  return {
    message: ResponseMessage.SUCCESSFUL,
    statusCode: EHttpStatus.OK,
    data: { 
      totalUsers, 
      paidUsers, 
      freeUsers, 
      totalEarning, 
      reportData, 
      countryStats,
      // ADD THESE NEW FIELDS
      totalUsersPercentage: Math.abs(totalUsersPercentage),
      paidUsersPercentage: Math.abs(paidUsersPercentage),
      earningPercentage: Math.abs(earningPercentage),
      totalUsersTrend,
      paidUsersTrend,
      earningTrend
    }
  };
}


  //  earning for report section
  async earningReport({ query }) {
    const { duration = 'month' } = query;

    const reportData = await this.getEarningReport(duration);
    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data: { reportData }
    };
  }

  // Get country-wise user statistics
  async getCountryWiseUsers(duration = '') {
    const currentDate = new Date();

    let matchCondition: any = { 
      userRole: { $ne: 'admin' },
      countryName: { $exists: true, $nin: ['', null] }
    };

    if (duration === 'month') {
      const lastMonth = new Date(currentDate);
      lastMonth.setMonth(currentDate.getMonth() - 1);

      matchCondition.createdAt = {
        $gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
        $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      };
    }
    else if (duration === 'year') {
      matchCondition.createdAt = {
        $gte: new Date(currentDate.getFullYear(), 0, 1),
        $lt: new Date(currentDate.getFullYear() + 1, 0, 1)
      };
    }

    const countryStats = await Users.aggregate([
      {
        $match: matchCondition
      },
      {
        $group: {
          _id: { lower: { $toLower: '$countryName' } },
          totalUsers: { $sum: 1 },
          countryNames: { $push: '$countryName' }
        }
      },
      {
        $addFields: {
          countryName: { $arrayElemAt: ['$countryNames', 0] }
        }
      },
      {
        $project: {
          countryName: 1,
          totalUsers: 1,
          _id: 0
        }
      },
      {
        $sort: { totalUsers: -1 }
      }
    ]);

    return countryStats;
  }

}

export default new DashboardService();
