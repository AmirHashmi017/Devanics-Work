import { Router } from "express";
import DashboardController from "./dashboard.controller";
import { authorizeRequest } from "../../middlewares/authorization.middleware";

export const dashboardRoutes = Router();

dashboardRoutes.get("/stats", authorizeRequest, DashboardController.dashboardStats);
// dashboardRoutes.get("/total-user", authorizeRequest, DashboardController.totalUsers);
// dashboardRoutes.get("/users", authorizeRequest, DashboardController.users);
// dashboardRoutes.get("/total-earning", authorizeRequest, DashboardController.totalEarning);
dashboardRoutes.get("/earning-report", authorizeRequest, DashboardController.earningReport);
