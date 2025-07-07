import {Router} from "express"
import { AddhabitBreakerDto } from "./dto/addhabitBreaker.dto"
import { UpdatehabitBreakerDto } from "./dto/updatehabitBreaker.dto"
import { validateDTO } from "../../middlewares/validation.middleware";
import { authorizeRequest } from "../../middlewares/authorization.middleware";
import habitBreakerController from "./habitBreaker.controller"

export const habitBreakerRoutes = Router()

// Add Habit Breaker
habitBreakerRoutes.post(
    "/create",authorizeRequest,
    validateDTO(AddhabitBreakerDto),
    habitBreakerController.createhabitBreaker
)

// Update Habit Breaker
habitBreakerRoutes.patch(
    "/update/:id",authorizeRequest,
    validateDTO(UpdatehabitBreakerDto),
    habitBreakerController.updatehabitBreaker
)

// Get all Habit Breakers by UserId
habitBreakerRoutes.get(
    "/list",authorizeRequest,
    habitBreakerController.gethabitBreaker
)

// Get all Habit Breakers on Admin Side
habitBreakerRoutes.get(
    "/listall",
    habitBreakerController.getallhabitBreaker
)

// Delete a Habit Breaker
habitBreakerRoutes.delete(
    "/delete/:id",authorizeRequest,
    habitBreakerController.deletehabitBreaker
)