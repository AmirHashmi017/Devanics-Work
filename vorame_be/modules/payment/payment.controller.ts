import { generateErrorResponse } from "../../helper/errorResponse";
import { Request, Response } from "express";
import paymentService from "./payment.service";

class PaymentController {

    async createPaymentIntent(req: Request, res: Response) {
        try {
            const result = await paymentService.createPaymentIntent(req);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            let errorMessage = generateErrorResponse(error);
            return res.status(errorMessage.statusCode).json(errorMessage);
        }
    }

    async verifyPromoCode(req: Request, res: Response) {
        try {
            const result = await paymentService.verifyPromoCode(req);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            let errorMessage = generateErrorResponse(error);
            return res.status(errorMessage.statusCode).json(errorMessage);
        }
    }


    async cancelSubscription(req: Request, res: Response) {
        try {
            const result = await paymentService.cancelSubscription(req);
            return res.status(result.statusCode).json(result);

        } catch (error) {
            let errorMessage = generateErrorResponse(error);
            return res.status(errorMessage.statusCode).json(errorMessage);
        }
    }

}

export default new PaymentController()