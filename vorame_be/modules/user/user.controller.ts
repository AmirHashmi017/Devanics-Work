import { generateErrorResponse } from "../../helper/errorResponse";
import userService from "./user.service";
import { Request, Response } from "express";

export class UserController {

  // get user accounts by admin
  async getUsersByAdmin(req: Request, res: Response) {
    try {
      const user = await userService.getUsersByAdmin(req);
      return res.status(user.statusCode).json(user);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // get user accounts by admin
  async getUsers(req: Request, res: Response) {
    try {
      const user = await userService.getUsers(req);
      return res.status(user.statusCode).json(user);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // get user by id
  async getUserById(req: Request, res: Response) {
    try {
      const user = await userService.getUserById(req);
      return res.status(user.statusCode).json(user);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const user = await userService.updateUser(req);
      return res.status(user.statusCode).json(user);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async getBlockedUsers(req: Request, res: Response) {
    try {
      const user = await userService.getBlockedUsers(req);
      return res.status(user.statusCode).json(user);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // user followers
  async followers(req: Request, res: Response) {
    try {
      const users = await userService.followers(req);
      return res.status(users.statusCode).json(users);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // user following
  async followings(req: Request, res: Response) {
    try {
      const users = await userService.following(req);
      return res.status(users.statusCode).json(users);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async contactUs(req, res: Response) {
    try {
      const data = await userService.contactUs(req);
      return res.status(data.statusCode).json(data);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }


  // Change password
  async changePassword(req: Request, res: Response) {
    try {
      const user = await userService.changePassword(req.body);
      return res.status(user.statusCode).json(user);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  //   Change profile picture
  async changeAvatar(req: Request, res: Response) {
    try {
      const user = await userService.changeAvatar(req.body);
      return res.status(user.statusCode).json(user);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // get user account
  async getAccount(req: Request, res: Response) {
    try {
      const user = await userService.getAccount(req);
      return res.status(user.statusCode).json(user);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // delete account
  async deleteAccount(req: Request, res: Response) {
    try {
      const account = await userService.deleteAccount(req.params);
      return res.status(account.statusCode).json(account);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
}

export default new UserController();
