import { generateErrorResponse } from "../../helper/errorResponse";
import loungeService from "./lounge.service";
import LoungeService from "./lounge.service";
import { Request, Response } from "express";

export class LoungeController {
  // Add reaction to message
  async addReactionToMessage(req: Request, res: Response) {
    try {
      const lounge = await LoungeService.addReactionToMessage(req);
      return res.status(lounge.statusCode).json(lounge);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
  // Create lounge
  async createLounge(req: Request, res: Response) {
    try {
      const lounge = await LoungeService.createLounge(req.body);
      return res.status(lounge.statusCode).json(lounge);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Get lounge list
  async loungeList(req: Request, res: Response) {
    try {
      const lounges = await LoungeService.loungeList(req);
      return res.status(lounges.statusCode).json(lounges);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
  // lounge report list
  async reportList(req: Request, res: Response) {
    try {
      const lounges = await LoungeService.reportList(req);
      return res.status(lounges.statusCode).json(lounges);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Single lounge
  async singleLounge(req: Request, res: Response) {
    try {
      const lounge = await LoungeService.singleLounge(req.body);
      return res.status(lounge.statusCode).json(lounge);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Update lounge
  async updateLounge(req: Request, res: Response) {
    try {
      const updatedLounge = await LoungeService.updateLounge(req.body);
      return res.status(updatedLounge.statusCode).json(updatedLounge);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Update lounge status
  async updateStats(req: Request, res: Response) {
    try {
      const updateStatus = await LoungeService.updateStatus(req.body);
      return res.status(updateStatus.statusCode).json(updateStatus);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Delete library
  async deleteLounge(req: Request, res: Response) {
    try {
      const deletedLounge = await LoungeService.deleteLounge(req.params);
      return res.status(deletedLounge.statusCode).json(deletedLounge);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
  // get chat list
  async loungeChat(req: Request, res: Response) {
    try {
      const lounge = await LoungeService.loungeChat(req);
      return res.status(lounge.statusCode).json(lounge);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // get chat message
  async addChatMessage(req: Request, res: Response) {
    try {
      const lounge = await LoungeService.addChatMessage(req);
      return res.status(lounge.statusCode).json(lounge);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
  //Add reply to a message
  async addReplyMessage(req:Request, res: Response)
  {
    try {
      const lounge = await LoungeService.addReplyMessage(req);
      return res.status(lounge.statusCode).json(lounge);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
  //Start and Unstar Message
  async starMessage(req:Request,res:Response)
  {
    try{
      const lounge= await loungeService.starMessage(req)
      return res.status(lounge.statusCode).json(lounge)
    }
    catch(error)
    {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  //Pin and Unpin Message
  async pinMessage(req:Request,res:Response)
  {
    try{
      const lounge= await loungeService.pinMessage(req)
      return res.status(lounge.statusCode).json(lounge)
    }
    catch(error)
    {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
  // Get Starred Messages
  async getStarredMessages(req:Request,res:Response)
  {
    try
    {
      const lounge= await loungeService.getStarredMessages(req)
      return res.status(lounge.statusCode).json(lounge)
    }
    catch(error)
    {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Get Pinned Messages
  async getPinnedMessages(req:Request,res:Response)
  {
    try
    {
      const lounge= await loungeService.getPinnedMessages(req)
      return res.status(lounge.statusCode).json(lounge)
    }
    catch(error)
    {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // update chat message
  async updateChatMessage(req: Request, res: Response) {
    try {
      const lounge = await LoungeService.updateChatMessage(req);
      return res.status(lounge.statusCode).json(lounge);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // read chat message
  async readChatMessages(req: Request, res: Response) {
    try {
      const lounge = await LoungeService.readChatMessages(req);
      return res.status(lounge.statusCode).json(lounge);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
  // update chat message
  async reportMessage(req: Request, res: Response) {
    try {
      const lounge = await LoungeService.reportMessage(req);
      return res.status(lounge.statusCode).json(lounge);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
  // get chat message
  async deleteChatMessage(req: Request, res: Response) {
    try {
      const lounge = await LoungeService.deleteChatMessage(req);
      return res.status(lounge.statusCode).json(lounge);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

}

export default new LoungeController();
