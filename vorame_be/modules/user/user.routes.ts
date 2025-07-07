import { Router } from "express";
import { validateDTO } from "../../middlewares/validation.middleware";
import { ChangePasswordDto } from "./dto/changePassword.dto";
import UserController from "./user.controller";
import { ContactUsDto } from "./dto/contactUs.dto";
import { authorizeRequest } from "../../middlewares/authorization.middleware";
import { validateObjectId } from "../../middlewares/validateObjectId.middleware";

export const userRoutes = Router();

userRoutes.get("/list", authorizeRequest, UserController.getUsersByAdmin);
userRoutes.get("/users", authorizeRequest, UserController.getUsers);
userRoutes.patch(
  "/:id",
  authorizeRequest,
  validateObjectId,
  UserController.updateUser
);

userRoutes.post(
  "/contact-us",
  authorizeRequest,
  validateDTO(ContactUsDto),
  UserController.contactUs
);

userRoutes.get("/profile/:id", UserController.getUserById, authorizeRequest);

userRoutes.post(
  "/change-password",
  authorizeRequest,
  validateDTO(ChangePasswordDto),
  UserController.changePassword
);

userRoutes.post(
  "/change-avatar",
  authorizeRequest,
  UserController.changeAvatar
);

userRoutes.post("/get-account", authorizeRequest, UserController.getAccount);

userRoutes.delete(
  "/delete/:id",
  authorizeRequest,
  validateObjectId,
  validateObjectId,

  UserController.deleteAccount
);
userRoutes.get(
  "/blocked-users",
  authorizeRequest,
  UserController.getBlockedUsers
);
userRoutes.get(
  "/follow/:id",
  authorizeRequest,
  validateObjectId,
  UserController.followers
);
userRoutes.get(
  "/following/:id",
  authorizeRequest,
  validateObjectId,
  UserController.followings
);
