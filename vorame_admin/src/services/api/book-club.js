import api from "../../utils/axios";
import {
  CREATE_BOOK_CLUB,
  DELETE_BOOK_CLUB,
  GET_BOOK_CLUBS,
  GET_SINGLE_BOOK_CLUB,
  UPDATE_BOOK_CLUB,
  UPDATE_BOOK_CLUB_FAVOURITE,
  UPDATE_BOOK_CLUB_STATUS,
} from "../constants";

class BlogApi {
  static sharedInstance = new BlogApi();

  constructor() {
    if (BlogApi.sharedInstance !== null) {
      return BlogApi.sharedInstance;
    }
  }

  //   Get blogs
  async getBookClubs() {
    try {
      const response = await api.get(GET_BOOK_CLUBS);
      if (response?.status === 200) {
        return response?.data?.data?.books;
      } else {
        return null;
      }
    } catch (error) {
      return error.response.data;
    }
  }

  // Get single blog
  async getSingleBookClub(body) {
    try {
      const response = await api.post(GET_SINGLE_BOOK_CLUB, body);
      return response?.data?.data;
    } catch (error) {
      return error.response.data;
    }
  }

  // Create blog
  async createBookClub(body) {
    try {
      const response = await api.post(CREATE_BOOK_CLUB, body);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
  // Update blog
  async updateBookClub(body) {
    try {
      const response = await api.post(UPDATE_BOOK_CLUB, body);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
  // Update blog status
  async updateBookClubStatus(body) {
    try {
      const response = await api.post(UPDATE_BOOK_CLUB_STATUS, body);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  // Update blog favourite
  async updateBookClubFavourite(body) {
    try {
      const response = await api.post(UPDATE_BOOK_CLUB_FAVOURITE, body);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  // delete blog
  async deleteBookClub(id) {
    try {
      const response = await api.delete(`${DELETE_BOOK_CLUB}/${id}`);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
}

export default BlogApi.sharedInstance;
