import { Router } from "express";
import { adminAuthorizeRequest } from "../../middlewares/adminAuthorization.middleware";
import validateDTO from "../../middlewares/validation.middleware";
import promoCodeController from "./promo-code.controller";
import { CreatePromoCodeDto, } from "./dto/promo-code.dto";

const router = Router()

router.post("/create", adminAuthorizeRequest, validateDTO(CreatePromoCodeDto), promoCodeController.create);
router.get("/list", adminAuthorizeRequest, promoCodeController.list);
router.delete("/delete/:id", adminAuthorizeRequest, promoCodeController.delete);


export default router;