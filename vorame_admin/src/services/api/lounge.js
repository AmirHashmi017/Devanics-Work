import api from "../../utils/axios";
import {
  GET_LONGES,
  GET_SINGLE_LOUNGE,
  CREATE_LOUNGE,
  UPDATE_LOUNGE,
  UPDATE_LOUNGE_STATUS,
  DELETE_LOUNGE,
} from "../constants";

class LoungeApi {
  static sharedInstance = new LoungeApi();

  constructor() {
    if (LoungeApi.sharedInstance !== null) {
      return LoungeApi.sharedInstance;
    }
  }

  //   Get lounges list
  async getLounges() {
    try {
      const response = await api.get(GET_LONGES);
      if (response?.status === 200) {
        return response?.data?.data?.lounges;
      } else {
        return null;
      }
    } catch (error) {
      return error.response.data;
    }
  }

  // Get single lounge
  async getSingleLounge(body) {
    try {
      const response = await api.post(GET_SINGLE_LOUNGE, body);
      return response?.data?.data;
    } catch (error) {
      return error.response.data;
    }
  }

  // Create lounge
  async createLounge(body) {
    try {
      const response = await api.post(CREATE_LOUNGE, body);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  // Update lounge
  async updateLounge(body) {
    try {
      const response = await api.post(UPDATE_LOUNGE, body);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  // Update lounge status
  async updateStatus(body) {
    try {
      const response = await api.post(UPDATE_LOUNGE_STATUS, body);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  // delete lounge
  async deleteLounge(id) {
    try {
      const response = await api.delete(`${DELETE_LOUNGE}/${id}`);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
}

export default LoungeApi.sharedInstance;
