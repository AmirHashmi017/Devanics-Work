import { Router } from 'express';
import { adminAuthorizeRequest } from '../../middlewares/adminAuthorization.middleware';
import AnalyticController from './analytics.controller';

export const analyticRoutes = Router();

analyticRoutes.get(
  '/revenue',
  adminAuthorizeRequest,
  AnalyticController.totalRevenue
);

analyticRoutes.get(
  '/users',
  adminAuthorizeRequest,
  AnalyticController.totalUsers
);

analyticRoutes.get(
  '/tickets',
  adminAuthorizeRequest,
  AnalyticController.totalTickets
);

analyticRoutes.get(
  '/revenue-last-month',
  adminAuthorizeRequest,
  AnalyticController.lastMonthRevenue
);

analyticRoutes.get(
  '/monthly-revenue-report',
  adminAuthorizeRequest,
  AnalyticController.monthlyReport
);

analyticRoutes.get(
  '/yearly-revenue-report',
  adminAuthorizeRequest,
  AnalyticController.yearlyReport
);

analyticRoutes.get(
  '/subscriptions',
  adminAuthorizeRequest,
  AnalyticController.subscriptions
);

analyticRoutes.get(
  '/recent-subscriptions',
  adminAuthorizeRequest,
  AnalyticController.recentSubscriptions
);
