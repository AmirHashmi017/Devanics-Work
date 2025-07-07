import { Router } from "express";
import { authorizeRequest } from "../../middlewares/authorization.middleware";
import paymentController from "./payment.controller";
import validateDTO from "../../middlewares/validation.middleware";
import { CreatePaymentIntentDto, VerifyPromoCodeDto } from "./payment.dto";

const router = Router();

router.post("/intent", authorizeRequest, validateDTO(CreatePaymentIntentDto), paymentController.createPaymentIntent);
router.post("/verify-promo", authorizeRequest, validateDTO(VerifyPromoCodeDto), paymentController.verifyPromoCode);

router.put("/cancel-subscription", authorizeRequest, paymentController.cancelSubscription);


export default router