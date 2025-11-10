import { Router } from 'express';
import { authorizeRequest } from '../../middlewares/authorization.middleware';
import userDashboardController from './user-dashboard.controller';

const routes = Router();

routes.get('/', authorizeRequest, userDashboardController.getAnalytics);

routes.get(
  '/feature-analytics',
  authorizeRequest,
  userDashboardController.getFeatureAnalyticsByPeriod
);

// Construction Estimate
routes.get(
  '/construction-estimate',
  authorizeRequest,
  userDashboardController.getConstructionEstimate
);
// Quantity Takeoff
routes.get(
  '/quantity-takeoff',
  authorizeRequest,
  userDashboardController.getQuantityTakeoff
);

// Time Schedule
routes.get(
  '/time-schedule',
  authorizeRequest,
  userDashboardController.getTimeSchedule
);
// Project Management
routes.get(
  '/project-management',
  authorizeRequest,
  userDashboardController.getProjectManagement
);
// Preconstruction
routes.get(
  '/preconstruction',
  authorizeRequest,
  userDashboardController.getPreconstruction
);

// Daily Work
routes.get(
  '/daily-work',
  authorizeRequest,
  userDashboardController.getDailyWork
);
// Bid Management
routes.get(
  '/bid-management',
  authorizeRequest,
  userDashboardController.getBidManagement
);
// Financial Management
routes.get(
  '/financial-management',
  authorizeRequest,
  userDashboardController.getFinancialManagement
);
// Social Media Comments
routes.get(
  '/social-media-comments',
  authorizeRequest,
  userDashboardController.getSocialMediaComments
);
// Social Media Likes
routes.get(
  '/social-media-likes',
  authorizeRequest,
  userDashboardController.getSocialMediaLikes
);
// Social Media Shares
routes.get(
  '/social-media-shares',
  authorizeRequest,
  userDashboardController.getSocialMediaShares
);
// CRM
routes.get('/crm', authorizeRequest, userDashboardController.getCRM);
// Estimate Reports
routes.get(
  '/estimate-reports',
  authorizeRequest,
  userDashboardController.getEstimateReports
);

export default routes;
