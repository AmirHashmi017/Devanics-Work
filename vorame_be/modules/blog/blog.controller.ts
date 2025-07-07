import { generateErrorResponse } from "../../helper/errorResponse";
import BlogService from "./blog.service";
import { Request, Response } from "express";

export class BlogController {
  // Create blog
  async createBlog(req: Request, res: Response) {
    try {
      const blog = await BlogService.createBlog(req.body);
      return res.status(blog.statusCode).json(blog);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  //   Get blogs list
  async blogList(req: Request, res: Response) {
    try {
      const blogs = await BlogService.blogList(req.body);
      return res.status(blogs.statusCode).json(blogs);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  //   Get blogs by favorite
  async favoriteBlogs(req: Request, res: Response) {
    try {
      const favorites = await BlogService.favouriteBlogs(req.body);
      return res.status(favorites.statusCode).json(favorites);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Single book
  async singleBlog(req: Request, res: Response) {
    try {
      const blog = await BlogService.singleBlog(req.body);
      return res.status(blog.statusCode).json(blog);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Update blog
  async updateBlog(req: Request, res: Response) {
    try {
      const updatedBlog = await BlogService.updateBlog(req.body);
      return res.status(updatedBlog.statusCode).json(updatedBlog);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Update blog status
  async updateStats(req: Request, res: Response) {
    try {
      const updateStatus = await BlogService.updateStatus(req.body);
      return res.status(updateStatus.statusCode).json(updateStatus);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Update blog favourite
  async updateFavourite(req: Request, res: Response) {
    try {
      const updateFavourite = await BlogService.updateFavourite(req.body);
      return res.status(updateFavourite.statusCode).json(updateFavourite);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Delete blog
  async deleteBlog(req: Request, res: Response) {
    try {
      const deletedBlog = await BlogService.deleteBlog(req.params);
      return res.status(deletedBlog.statusCode).json(deletedBlog);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
}

export default new BlogController();
