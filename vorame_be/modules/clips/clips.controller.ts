import { generateErrorResponse } from "../../helper/errorResponse";
import ClipService from "./clips.service";
import { Request, Response } from "express";

export class ClipController {
  // Create clip
  async createClip(req: Request, res: Response) {
    try {
      const clips = await ClipService.createClip(req.body);
      return res.status(clips.statusCode).json(clips);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  //   Gett clip list
  async clipList(req: Request, res: Response) {
    try {
      const clip = await ClipService.clipList(req.body);
      return res.status(clip.statusCode).json(clip);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Single clip
  async singleClip(req: Request, res: Response) {
    try {
      const clip = await ClipService.singleClip(req.body);
      return res.status(clip.statusCode).json(clip);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Update clip
  async updateClip(req: Request, res: Response) {
    try {
      const updatedClip = await ClipService.updateClip(req.body);
      return res.status(updatedClip.statusCode).json(updatedClip);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Update clip status
  async updateStats(req: Request, res: Response) {
    try {
      const updateStatus = await ClipService.updateStatus(req.body);
      return res.status(updateStatus.statusCode).json(updateStatus);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Update clip favourite
  async updateFavourite(req: Request, res: Response) {
    try {
      const updateFavourite = await ClipService.updateFavourite(req.body);
      return res.status(updateFavourite.statusCode).json(updateFavourite);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Favourite clips list
  async favouriteClips(req: Request, res: Response) {
    try {
      const favourites = await ClipService.favouriteClips(req.body);
      return res.status(favourites.statusCode).json(favourites);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Delete clip
  async deleteClip(req: Request, res: Response) {
    try {
      const deletedClip = await ClipService.deleteClip(req.params);
      return res.status(deletedClip.statusCode).json(deletedClip);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
}

export default new ClipController();
