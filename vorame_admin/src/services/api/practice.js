import api from "../../utils/axios";
import {
  PRACTICE,
} from "../constants";

class PracticeApi {
  static sharedInstance = new PracticeApi();

  constructor() {
    if (PracticeApi.sharedInstance !== null) {
      return PracticeApi.sharedInstance;
    }
  }

  // Get all practices
  async getPractices() {
    try {
      const response = await api.get(`${PRACTICE}list`);
      if (response?.status === 200) {
        return response?.data?.data?.practices;
      } else {
        return null;
      }
    } catch (error) {
      return error.response.data;
    }
  }

  // Get single practice
  async getSinglePractice(body) {
    try {
      const response = await api.post(`${PRACTICE}single-practice`, body);
      return response?.data?.data;
    } catch (error) {
      return error.response.data;
    }
  }

  // Create practice
  async createPractice(body) {
    try {
      const response = await api.post(`${PRACTICE}create`, body);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  // Update practice
  async updatePractice(body) {
    try {
      const response = await api.post(`${PRACTICE}update`, body);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  // Update practice status
  async updatePracticeStatus(body) {
    try {
      const response = await api.post(`${PRACTICE}update-status`, body);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  // Delete practice
  async deletePractice(id) {
    try {
      const response = await api.delete(`${PRACTICE}delete/${id}`);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
}

export default PracticeApi.sharedInstance; 