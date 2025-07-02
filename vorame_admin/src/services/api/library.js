import api from "../../utils/axios";
import {
  GET_LIBRARIES,
  GET_SINGLE_LIBRARY,
  CREATE_LIBRARY,
  UPDATE_LIBRARY_STATUS,
  UPDATE_LIBRARY,
  DELETE_LIBRARY,
} from "../constants";

class LibraryApi {
  static sharedInstance = new LibraryApi();

  constructor() {
    if (LibraryApi.sharedInstance !== null) {
      return LibraryApi.sharedInstance;
    }
  }

  //   Get libraries
  async getLibraries(body) {
    try {
      const response = await api.post(GET_LIBRARIES, body);
      if (response?.status === 200) {
        return response?.data?.data?.libraries;
      } else {
        return null;
      }
    } catch (error) {
      return error.response.data;
    }
  }

  // Get single library
  async getSingleLibrary(body) {
    try {
      const response = await api.post(GET_SINGLE_LIBRARY, body);
      return response?.data?.data;
    } catch (error) {
      return error.response.data;
    }
  }

  // Create library
  async createLibrary(body) {
    try {
      const response = await api.post(CREATE_LIBRARY, body);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  // Update library
  async updateLibrary(body) {
    try {
      const response = await api.post(UPDATE_LIBRARY, body);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  // Update library status
  async updateLibraryStatus(body) {
    try {
      const response = await api.post(UPDATE_LIBRARY_STATUS, body);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  // delete library
  async deleteLibrary(id) {
    try {
      const response = await api.delete(`${DELETE_LIBRARY}/${id}`);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
}

export default LibraryApi.sharedInstance;
