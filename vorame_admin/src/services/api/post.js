import api from "../../utils/axios";
import {
  GET_POSTS,
  GET_LIKES,
  GET_COMMENTS,
  GET_REPORTS,
  DELETE_POST,
  DELETE_COMMENT,
  BLOCK_POST_USER,
} from "../constants";

class PostApi {
  static sharedInstance = new PostApi();

  constructor() {
    if (PostApi.sharedInstance !== null) {
      return PostApi.sharedInstance;
    }
  }

  //   Get Posts
  async getPosts({ limit = 25, offset = 0 } = {}) {
    try {
      const response = await api.get(`${GET_POSTS}?limit=${limit}&offset=${offset}`);
      if (response?.status === 200) {
        return response?.data;
      } else {
        return null;
      }
    } catch (error) {
      return error.response.data;
    }
  }
  //Get Post by ID
  async getPostDetails(id) {
    try {
      const response = await api.get(`${GET_POSTS}/${id}`);
      if (response?.status === 200) {
        return response?.data;
      } else {
        return null;
      }
    } catch (error) {
      return error.response.data;
    }
  }

  //Block Unblock User
  async blockUser(id) {
    try {
      const response = await api.patch(`${BLOCK_POST_USER}/${id}`);
      if (response?.status === 200) {
        return response?.data
      } else {
        return null;
      }
    } catch (error) {
      return error.response.data;
    }
  }

  // GET POST COMMENTS
  async getComments(id) {
    try {
      const response = await api.get(`${GET_COMMENTS}/${id}`);
      if (response?.status === 200) {
        return response?.data;
      } else {
        return null;
      }
    } catch (error) {
      return error.response.data;
    }
  }

  // Get Post Likes
  async getLikes(id) {
    try {
      const response = await api.get(`${GET_LIKES}/${id}`);
      if (response?.status === 200) {
        return response?.data;
      } else {
        return null;
      }
    } catch (error) {
      return error.response.data;
    }
  }

  // GET POST REPORTS
  async getReports(id) {
    try {
      const response = await api.get(`${GET_REPORTS}/${id}`);
      if (response?.status === 200) {
        return response?.data;
      } else {
        return null;
      }
    } catch (error) {
      return error.response.data;
    }
  }

  // Delete Post
  async deletePost(id) {
    try {
      const response = await api.delete(`${DELETE_POST}/${id}`);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  // Delete Comment
  async deleteComment(id) {
    try {
      const response = await api.delete(`${DELETE_COMMENT}/${id}`);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
}

export default PostApi.sharedInstance;
