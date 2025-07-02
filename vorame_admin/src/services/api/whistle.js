import api from "../../utils/axios";
import {
  GET_WHISTLES,
  CREATE_WHISTLE,
  GET_SINGLE_WHISTLE,
  DELETE_WHISTLE,
  UPDATE_WHISTLE,
  UPDATE_WHISTLE_STATUS,
} from "../constants";

class WhistleApi {
  static sharedInstance = new WhistleApi();

  constructor() {
    if (WhistleApi.sharedInstance !== null) {
      return WhistleApi.sharedInstance;
    }
  }

  //   Get whistles
  async getWhistles(body) {
    try {
      const response = await api.post(GET_WHISTLES, body);
      if (response?.status === 200) {
        return response?.data?.data?.whistles;
      } else {
        return null;
      }
    } catch (error) {
      return error.response.data;
    }
  }

  // Get single whistle
  async getSingleWhistle(body) {
    try {
      const response = await api.post(GET_SINGLE_WHISTLE, body);
      return response?.data?.data;
    } catch (error) {
      return error.response.data;
    }
  }

  // Create whistle
  async createWhistle(body) {
    try {
      const response = await api.post(CREATE_WHISTLE, body);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  // Update whistle
  async updateWhistle(body) {
    try {
      const response = await api.post(UPDATE_WHISTLE, body);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  // Update whistle status
  async updateWhistleStatus(body) {
    try {
      const response = await api.post(UPDATE_WHISTLE_STATUS, body);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  // delete whistle
  async deleteWhistle(id) {
    try {
      const response = await api.delete(`${DELETE_WHISTLE}/${id}`);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
}

export default WhistleApi.sharedInstance;
