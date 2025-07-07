import { generateErrorResponse } from "../../helper/errorResponse";
import promoCodeService from "./promo-code.service";
import { Request, Response } from "express";

class PromoCodeController {
    async create(req: Request, res: Response) {
        try {
            const result = await promoCodeService.create(req);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            let errorMessage = generateErrorResponse(error);
            return res.status(errorMessage.statusCode).json(errorMessage);
        }

    }

    async list(req: Request, res: Response) {
        try {
            const result = await promoCodeService.list(req);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            let errorMessage = generateErrorResponse(error);
            return res.status(errorMessage.statusCode).json(errorMessage);
        }

    }

    async delete(req: Request, res: Response) {
        try {
            const result = await promoCodeService.delete(req);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            let errorMessage = generateErrorResponse(error);
            return res.status(errorMessage.statusCode).json(errorMessage);
        }

    }

}

export default new PromoCodeController()