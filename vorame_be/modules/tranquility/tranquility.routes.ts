import {Router} from "express"
import { AddTranquilityDTO } from "./dto/Addtranquility.dto";
import { UpdateTranquilityDto } from "./dto/updateTranquility.dto";
import { validateDTO } from "../../middlewares/validation.middleware";
import { authorizeRequest } from "../../middlewares/authorization.middleware";
import tranquilityController from "./tranquility.controller";

export const tranquilityRoutes= Router()

// Create Tranquility API
tranquilityRoutes.post(
    "/create",authorizeRequest,
    validateDTO(AddTranquilityDTO),
    tranquilityController.createTranquility
)

// Update Tranquility API
tranquilityRoutes.patch(
    "/update/:id",authorizeRequest,
    validateDTO(UpdateTranquilityDto),
    tranquilityController.updateTranquility
)

// Delete Tranquility API
tranquilityRoutes.delete(
    "/delete/:id",authorizeRequest,
    tranquilityController.deleteTranquility
)

// Get all Tranquilities
tranquilityRoutes.get(
    "/list",authorizeRequest,
    tranquilityController.getTranquility
)

// Get one Tranquility of specific ID
tranquilityRoutes.get(
    "/list/:id",authorizeRequest,
    tranquilityController.getOneTranquility
)