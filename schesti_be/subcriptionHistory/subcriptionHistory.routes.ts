import { Router } from 'express';
import { authorizeRequest } from '../../middlewares/authorization.middleware';
import { adminAuthorizeRequest } from '../../middlewares/adminAuthorization.middleware';
import { validateDTO } from '../../middlewares/validation.middleware';
import SubcriptionHistoryController from './subcription.controller';

export const subcriptionRoutes = Router();

subcriptionRoutes.get(
  '/getSubcriptionHistories',
  adminAuthorizeRequest,
  SubcriptionHistoryController.getSubcriptionHistories
);

subcriptionRoutes.get(
  '/my-history',
  authorizeRequest,
  SubcriptionHistoryController.getUserSubscriptions
);
