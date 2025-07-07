import { Router } from "express";
import { AddBlogDto } from "./dto/addBlog.dto";
import { UpdateBlogDto } from "./dto/updateBlog.dto";
import { updateStatusDto } from "./dto/updateStatus.dto";
import { updateFavouriteDto } from "./dto/updateFavourite.dto";
import BlogController from "./blog.controller";
import { validateDTO } from "../../middlewares/validation.middleware";
import { authorizeRequest } from "../../middlewares/authorization.middleware";

export const blogRoutes = Router();

blogRoutes.post("/create", authorizeRequest, validateDTO(AddBlogDto), BlogController.createBlog);
blogRoutes.get("/list", authorizeRequest, BlogController.blogList);
blogRoutes.post("/favourite", authorizeRequest, BlogController.favoriteBlogs);
blogRoutes.post("/single-blog", authorizeRequest, BlogController.singleBlog);
blogRoutes.post(
  "/update", authorizeRequest,
  validateDTO(UpdateBlogDto),
  BlogController.updateBlog
);
blogRoutes.post(
  "/update-status", authorizeRequest,
  validateDTO(updateStatusDto),
  BlogController.updateStats
);
blogRoutes.post(
  "/update-favourite", authorizeRequest,
  validateDTO(updateFavouriteDto),
  BlogController.updateFavourite
);

blogRoutes.delete("/delete/:id", authorizeRequest, BlogController.deleteBlog);
