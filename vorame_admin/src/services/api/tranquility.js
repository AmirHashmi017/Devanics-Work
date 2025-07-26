import api from "../../utils/axios";
import {
  CREATE_TRANQUILITY,
  UPDATE_TRANQUILITY,
  DELETE_TRANQUILITY,
  GET_TRANQUILITIES,
  GET_ONE_TRANQUILITY,
} from "../constants";

class TranquilityApi {
  static sharedInstance = new TranquilityApi();

  constructor() {
    if (TranquilityApi.sharedInstance !== null) {
      return TranquilityApi.sharedInstance;
    }
  }

  // Get all tranquilities (paginated)
  async getTranquilities(offset = 0, limit = 3) {
    try {
      const response = await api.get(`${GET_TRANQUILITIES}?offset=${offset}&limit=${limit}`);
      if (response?.status === 200) {
        return response?.data?.data;
      } else {
        return null;
      }
    } catch (error) {
      return error.response.data;
    }
  }

  // Get one tranquility by ID
  async getOneTranquility(id) {
    try {
      const response = await api.get(`${GET_ONE_TRANQUILITY}/${id}`);
      return response?.data?.data;
    } catch (error) {
      return error.response.data;
    }
  }

  // Create tranquility
  async createTranquility(body) {
    try {
      const response = await api.post(CREATE_TRANQUILITY, body);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  // Update tranquility
  async updateTranquility(id, body) {
    try {
      const response = await api.patch(`${UPDATE_TRANQUILITY}/${id}`, body);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  // Delete tranquility
  async deleteTranquility(id) {
    try {
      const response = await api.delete(`${DELETE_TRANQUILITY}/${id}`);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
}

export default TranquilityApi.sharedInstance; 