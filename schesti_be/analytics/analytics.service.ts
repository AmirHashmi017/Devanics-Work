import { ResponseMessage } from '../../enums/resMessage.enum';
import { EHttpStatus } from '../../enums/httpStatus.enum';
import SubscriptionHistory from '../subcriptionHistory/subcriptionHistory.model';
import Users from '../user/user.model';
import SupportTickets from '../supportTickets/supportTicket.model';
import { ETicketStatus } from '../supportTickets/enums/suppportTicketStatus.enum';
import { stripe as StripeHelper } from '../../helper/stripe.helper';
import axios from 'axios';
const moment = require('moment');

// Simple in-memory cache for exchange rates to avoid hammering the API
const _exchangeRateCache: Record<string, { rate: number; ts: number }> = {};

async function getExchangeRate(base = 'GBP', target = 'USD') {
  try {
    const cacheKey = `${base}_${target}`;
    const cached = _exchangeRateCache[cacheKey];
    // cache for 1 hour
    if (cached && Date.now() - cached.ts < 60 * 60 * 1000) {
      return cached.rate;
    }

    const key = process.env.EXCHANGERATE_API_KEY;
    if (!key) {
      console.warn('EXCHANGERATE_API_KEY not set, falling back to rate=1');
      return 1;
    }

    const url = `https://v6.exchangerate-api.com/v6/${key}/pair/${base}/${target}`;
    const resp = await axios.get(url);
    // API returns conversion_rate on success
    const rate = resp?.data?.conversion_rate;
    if (rate && typeof rate === 'number') {
      _exchangeRateCache[cacheKey] = { rate, ts: Date.now() };
      return rate;
    }
    console.error('Unexpected exchange rate API response', resp?.data);
  } catch (error) {
    console.error('Error fetching exchange rate', error?.message || error);
  }
  // fallback to 1 (no conversion)
  return 1;
}

class analyticsService {
  async totalRevenue(req) {
    const charges = await StripeHelper.charges.list();
    const totalRevenue = charges.data
      .filter((charge) => charge.paid && !charge.refunded)
      .reduce((total, charge) => total + charge.amount, 0);

    // console.log("Total Revenue", totalRevenue / 100);

    // const result = await SubscriptionHistory.aggregate([
    //   {
    //     $lookup: {
    //       from: 'pricingplans', // Collection name of the plans
    //       localField: 'planId', // Field in SubscriptionHistory to populate
    //       foreignField: '_id', // Field in Plan to match
    //       as: 'plan',
    //     },
    //   },
    //   {
    //     $unwind: '$plan', // Unwind the array to deconstruct plan object
    //   },
    //   {
    //     $group: {
    //       _id: null, // Group all documents together
    //       totalRevenue: { $sum: { $ifNull: ['$plan.price', 0] } }, // Sum the prices of all plans
    //     },
    //   },
    // ]);
    // Convert stripe (cents) to USD and add Paymob GBP converted to USD
    try {
      const stripeUSD = totalRevenue / 100;
      const paymobSubs = await SubscriptionHistory.find({
        paymentMethod: { $regex: /^paymob$/i },
        canceledAt: null,
        status: { $nin: ['cancelled', 'canceled', 'refunded'] },
      }).select('amount');
      const paymobSumGBP = paymobSubs.reduce(
        (s, sub) => s + (sub.amount || 0),
        0
      );
      const rate = await getExchangeRate('GBP', 'USD');
      const paymobUSD = paymobSumGBP * rate;

      return {
        message: ResponseMessage.SUCCESSFUL,
        statusCode: EHttpStatus.OK,
        data: Math.round(stripeUSD + paymobUSD),
      };
    } catch (err) {
      console.error('Error including Paymob in totalRevenue:', err);
      return {
        message: ResponseMessage.SUCCESSFUL,
        statusCode: EHttpStatus.OK,
        data: totalRevenue / 100,
      };
    }
  }

  async totalUsers(req) {
    const users = await Users.find({}).countDocuments();
    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data: users,
    };
  }

  async totalTickets(req) {
    const users = await SupportTickets.find({
      status: ETicketStatus.OPEN,
    }).countDocuments();
    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data: users,
    };
  }

  async lastMonthRevenue(req) {
    try {
      // const now = new Date();
      // const startOfLastMonth = new Date(
      //   now.getFullYear(),
      //   now.getMonth() - 1,
      //   1
      // ); // First day of last month
      // const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 1); // First day of this month

      // Fetch subscriptions created in the last month and populate plan details
      // const revenueData = await SubscriptionHistory.aggregate([
      //   {
      //     $match: {
      //       createdAt: {
      //         $gte: startOfLastMonth,
      //         $lt: endOfLastMonth,
      //       },
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: 'pricingplans', // Collection name of the plans
      //       localField: 'planId', // Field in SubscriptionHistory to populate
      //       foreignField: '_id', // Field in Plan to match
      //       as: 'plan',
      //     },
      //   },
      //   {
      //     $unwind: {
      //       path: '$plan',
      //       preserveNullAndEmptyArrays: true,
      //     },
      //   },
      //   {
      //     $group: {
      //       _id: null,
      //       lastMonthRevenue: { $sum: { $ifNull: ['$plan.price', 0] } }, // Sum of prices for the last month
      //     },
      //   },
      // ]);

      // // Get the total revenue for last month, default to 0 if no results
      // const lastMonthRevenue =
      //   revenueData.length > 0 ? revenueData[0].lastMonthRevenue : 0;

      const startOfLastMonth = moment().subtract(1, 'month').startOf('month');

      // Get the end of the previous month
      const endOfLastMonth = moment().subtract(1, 'month').endOf('month');

      const charges = await StripeHelper.charges.list({
        created: {
          gte: startOfLastMonth.unix(),
          lte: endOfLastMonth.unix(),
        },
      });
      const stripeTotal = charges.data
        .filter((charge) => charge.paid && !charge.refunded)
        .reduce((total, charge) => total + charge.amount, 0);

      // Include Paymob (GBP) subscriptions created in that month
      const paymobSubs = await SubscriptionHistory.find({
        paymentMethod: { $regex: /^paymob$/i },
        createdAt: {
          $gte: startOfLastMonth.toDate(),
          $lte: endOfLastMonth.toDate(),
        },
        canceledAt: null,
        status: { $nin: ['cancelled', 'canceled', 'refunded'] },
      }).select('amount');
      const paymobSumGBP = paymobSubs.reduce(
        (s, sub) => s + (sub.amount || 0),
        0
      );
      const rate = await getExchangeRate('GBP', 'USD');
      const paymobUSD = paymobSumGBP * rate;

      return {
        message: ResponseMessage.SUCCESSFUL,
        statusCode: EHttpStatus.OK,
        data: Math.round(stripeTotal / 100 + paymobUSD),
      };
    } catch (error) {
      console.error('Error fetching last month revenue:', error);
      return {
        message: 'Failed',
        statusCode: EHttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }
  }

  async lastMonthReport(req) {
    try {
      const lastMonthStart = moment()
        .subtract(1, 'months')
        .startOf('month')
        .toDate(); // Start of last month

      const lastMonthEnd = moment()
        .subtract(1, 'months')
        .endOf('month')
        .toDate(); // End of last month

      // Fetch subscriptions created in the last month and group by day and payment method
      const revenueReport = await SubscriptionHistory.aggregate([
        {
          $match: {
            createdAt: {
              $gte: lastMonthStart,
              $lte: lastMonthEnd,
            },
            canceledAt: null,
            status: { $nin: ['cancelled', 'canceled', 'refunded'] },
          },
        },
        {
          $lookup: {
            from: 'pricingplans', // Collection name of the plans
            localField: 'planId', // Field in SubscriptionHistory to populate
            foreignField: '_id', // Field in Plan to match
            as: 'plan',
          },
        },
        {
          $unwind: {
            path: '$plan',
            preserveNullAndEmptyArrays: true, // Keep documents even if there is no related plan
          },
        },
        {
          $group: {
            _id: {
              day: { $dayOfMonth: '$createdAt' }, // Group by the day of the month
              paymentMethod: '$paymentMethod', // Group by payment method
            },
            totalRevenue: { $sum: { $ifNull: ['$amount', 0] } }, // Sum the prices, handling null plans
          },
        },
        {
          $sort: { '_id.day': 1 }, // Sort by day in ascending order
        },
      ]);

      // If there are Paymob entries, get GBP->USD rate once and convert Paymob totals
      const hasPaymob = revenueReport.some(
        (item) => String(item._id.paymentMethod).toLowerCase() === 'paymob'
      );
      const paymobRate = hasPaymob ? await getExchangeRate('GBP', 'USD') : 1;

      // Format the data to return day-wise total revenue with payment method
      const daysInMonth = moment(lastMonthStart).daysInMonth();
      const formattedData = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const dayData = revenueReport.filter((item) => item._id.day === day);

        const paymentMethods = dayData.map(({ _id, totalRevenue }) => {
          const pm = _id.paymentMethod || 'None';
          const isPaymob = String(pm).toLowerCase() === 'paymob';
          const converted = isPaymob ? totalRevenue * paymobRate : totalRevenue;
          return {
            paymentMethod: pm,
            totalRevenue: Math.round(converted),
          };
        });

        return {
          day,
          paymentMethods: paymentMethods.length
            ? paymentMethods
            : [{ paymentMethod: 'None', totalRevenue: 0 }],
        };
      });

      return {
        message: ResponseMessage.SUCCESSFUL,
        statusCode: EHttpStatus.OK,
        data: formattedData,
      };
    } catch (error) {
      console.error('Error fetching full month report:', error);
      return {
        message: 'Failed to fetch report',
        statusCode: EHttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }
  }

  async yearlyReport(req) {
    try {
      const now = new Date();
      const startOfCurrentYear = new Date(now.getFullYear(), 0, 1); // First day of the current year
      const endOfCurrentYear = new Date(now.getFullYear() + 1, 0, 1); // First day of next year

      const revenueData = await SubscriptionHistory.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startOfCurrentYear,
              $lt: endOfCurrentYear,
            },
            canceledAt: null,
            status: { $nin: ['cancelled', 'canceled', 'refunded'] },
          },
        },
        {
          $lookup: {
            from: 'pricingplans', // Collection name of the plans
            localField: 'planId', // Field in SubscriptionHistory to populate
            foreignField: '_id', // Field in Plan to match
            as: 'plan',
          },
        },
        {
          $unwind: {
            path: '$plan',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: {
              month: { $month: '$createdAt' }, // Group by month
              paymentMethod: '$paymentMethod', // Group by paymentMethod
            },
            totalRevenue: { $sum: { $ifNull: ['$amount', 0] } }, // Sum the prices for each month and payment method
          },
        },
        {
          $sort: { '_id.month': 1 }, // Sort by month in ascending order
        },
      ]);

      // If there are Paymob entries, get GBP->USD rate once and convert Paymob totals
      const hasPaymob = revenueData.some(
        (item) => String(item._id.paymentMethod).toLowerCase() === 'paymob'
      );
      const paymobRate = hasPaymob ? await getExchangeRate('GBP', 'USD') : 1;

      const yearlyReport = Array.from({ length: 12 }, (_, i) => {
        const monthData = revenueData.filter(
          (data) => data._id.month === i + 1
        );
        const paymentMethods = monthData.map((data) => {
          const pm = data._id.paymentMethod;
          const isPaymob = String(pm).toLowerCase() === 'paymob';
          const converted = isPaymob
            ? data.totalRevenue * paymobRate
            : data.totalRevenue;
          return {
            paymentMethod: pm,
            totalRevenue: Math.round(converted),
          };
        });

        return {
          month: i + 1,
          paymentMethods: paymentMethods.length
            ? paymentMethods
            : [{ paymentMethod: '', totalRevenue: 0 }],
        };
      });

      return {
        message: ResponseMessage.SUCCESSFUL,
        statusCode: EHttpStatus.OK,
        data: yearlyReport,
      };
    } catch (error) {
      console.error('Error fetching monthly revenue report:', error);
      return {
        message: 'Failed',
        statusCode: EHttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }
  }

  async subscriptions(req) {
    try {
      // const planSubscriptions = await SubscriptionHistory.aggregate([
      //   {
      //     $group: {
      //       _id: '$planId', // Group by planId
      //       count: { $sum: 1 }, // Count the number of subscriptions for each plan
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: 'pricingplans', // Collection name of the plans
      //       localField: '_id', // Field in SubscriptionHistory (planId)
      //       foreignField: '_id', // Field in pricingplans collection
      //       as: 'plan',
      //     },
      //   },
      //   {
      //     $unwind: {
      //       path: '$plan',
      //       preserveNullAndEmptyArrays: true, // Include plans even if the plan is not found (optional)
      //     },
      //   },
      //   {
      //     $sort: { count: -1 }, // Sort by the count of subscriptions in descending order
      //   },
      //   {
      //     // Calculate the total subscriptions to use in percentage calculation
      //     $group: {
      //       _id: null, // Group all the documents together
      //       totalSubscriptions: { $sum: '$count' }, // Calculate total subscriptions
      //       plans: {
      //         $push: { _id: '$_id', plan: '$plan.planName', count: '$count' },
      //       }, // Store plan stats
      //     },
      //   },
      //   {
      //     // Unwind the plans array to calculate percentage for each plan
      //     $unwind: '$plans',
      //   },
      //   {
      //     // Add the percentage field to each plan
      //     $addFields: {
      //       'plans.percentage': {
      //         $multiply: [
      //           { $divide: ['$plans.count', '$totalSubscriptions'] },
      //           100,
      //         ],
      //       },
      //     },
      //   },
      //   {
      //     // Group everything back together to return the final result
      //     $group: {
      //       _id: null,
      //       total: { $first: '$totalSubscriptions' },
      //       plans: { $push: '$plans' },
      //     },
      //   },
      //   {
      //     // Project the result to return only the necessary fields
      //     $project: {
      //       _id: 0, // Remove the _id field from the output
      //       total: 1,
      //       plans: 1,
      //     },
      //   },
      // ]);

      const planSubscriptions = await SubscriptionHistory.aggregate([
        {
          $group: {
            _id: '$planId',
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: 3,
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$count' },
            plans: {
              $push: {
                planId: '$_id',
                count: '$count',
              },
            },
          },
        },
        {
          $unwind: '$plans',
        },
        {
          $project: {
            _id: 0,
            planId: '$plans.planId',
            count: '$plans.count',
            percentage: {
              $multiply: [{ $divide: ['$plans.count', '$total'] }, 100],
            },
          },
        },
        {
          $lookup: {
            from: 'pricingplans',
            localField: 'planId',
            foreignField: '_id',
            as: 'plan',
          },
        },
        {
          $unwind: {
            path: '$plan',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: {
            percentage: 1,
          },
        },
      ]);

      return {
        message: ResponseMessage.SUCCESSFUL,
        statusCode: EHttpStatus.OK,
        data: planSubscriptions,
      };
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      return {
        message: 'Failed to fetch subscriptions',
        statusCode: EHttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }
  }
  async recentSubscriptions({ query }) {
    try {
      const { searchTerm, limit = '10', offset = '0' } = query;

      console.log({ searchTerm, limit, offset });

      const subscriptionOffset = parseInt(offset as string);
      const subscriptionLimit = parseInt(limit as string);

      // Construct the search conditions
      let searchConditions;

      if (searchTerm) {
        searchConditions = [
          { 'plan.planName': { $regex: searchTerm, $options: 'i' } },
          { 'plan.type': { $regex: searchTerm, $options: 'i' } },
          { 'plan.duration': { $regex: searchTerm, $options: 'i' } },
          { 'plan.planDescription': { $regex: searchTerm, $options: 'i' } },
          { 'plan.price': { $regex: searchTerm, $options: 'i' } },
          { 'customer.name': { $regex: searchTerm, $options: 'i' } },
        ];
      }

      const totalSubscriptions = await SubscriptionHistory.aggregate([
        {
          $lookup: {
            from: 'pricingplans', // Lookup the plan details from pricingplans collection
            localField: 'planId', // Match with planId in SubscriptionHistory
            foreignField: '_id',
            as: 'plan',
          },
        },
        {
          $unwind: '$plan', // Unwind the populated plan field
        },
        {
          $lookup: {
            from: 'users', // Assuming customer data is in a collection called 'customers'
            localField: 'user', // Match with customerId in SubscriptionHistory
            foreignField: '_id',
            as: 'customer',
          },
        },
        {
          $unwind: '$customer', // Unwind the populated customer field
        },
        {
          $match: {
            $or: searchConditions ? searchConditions : [{}],
          },
        },
      ]);
      // Perform the aggregation with lookup and search
      const subscriptions = await SubscriptionHistory.aggregate([
        {
          $lookup: {
            from: 'pricingplans', // Lookup the plan details from pricingplans collection
            localField: 'planId', // Match with planId in SubscriptionHistory
            foreignField: '_id',
            as: 'plan',
          },
        },
        {
          $unwind: '$plan', // Unwind the populated plan field
        },
        {
          $lookup: {
            from: 'users', // Assuming customer data is in a collection called 'customers'
            localField: 'user', // Match with customerId in SubscriptionHistory
            foreignField: '_id',
            as: 'customer',
          },
        },
        {
          $unwind: '$customer', // Unwind the populated customer field
        },
        {
          $match: {
            $or: searchConditions ? searchConditions : [{}],
          },
        },
      ])
        .sort({ createdAt: -1 })
        .skip(subscriptionOffset)
        .limit(subscriptionLimit);

      return {
        message: ResponseMessage.SUCCESSFUL,
        statusCode: EHttpStatus.OK,
        data: {
          subscriptions,
          page: Math.ceil(totalSubscriptions.length / limit),
          total: totalSubscriptions.length,
        },
      };
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      return {
        message: 'Failed to fetch subscriptions',
        statusCode: EHttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }
  }
}

export default new analyticsService();
