import api from "../../utils/axios";
import {
  GET_BLOGS,
  DELETE_BLOG,
  UPDATE_BLOG_STATUS,
  UPDATE_BLOG_FAVOURITE,
  CREATE_BLOG,
  UPDATE_BLOG,
  GET_SINGLE_BLOG,
} from "../constants";

class BlogApi {
  static sharedInstance = new BlogApi();

  constructor() {
    if (BlogApi.sharedInstance !== null) {
      return BlogApi.sharedInstance;
    }
  }

  //   Get blogs
  async getBlogs() {
    try {
      const response = await api.get(GET_BLOGS);
      if (response?.status === 200) {
        return response?.data?.data?.blogs;
      } else {
        return null;
      }
    } catch (error) {
      return error.response.data;
    }
  }

  // Get single blog
  async getSingleBlog(body) {
    try {
      const response = await api.post(GET_SINGLE_BLOG, body);
      return response?.data?.data;
    } catch (error) {
      return error.response.data;
    }
  }

  // Create blog
  async createBlog(body) {
    try {
      const response = await api.post(CREATE_BLOG, body);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
  // Update blog
  async updateBlog(body) {
    try {
      const response = await api.post(UPDATE_BLOG, body);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
  // Update blog status
  async updateBlogStatus(body) {
    try {
      const response = await api.post(UPDATE_BLOG_STATUS, body);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  // Update blog favourite
  async updateBlogFavourite(body) {
    try {
      const response = await api.post(UPDATE_BLOG_FAVOURITE, body);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  // delete blog
  async deleteBlog(id) {
    try {
      const response = await api.delete(`${DELETE_BLOG}/${id}`);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
}

export default BlogApi.sharedInstance;
