import api from "../../utils/axios";
import {
  GET_BLUE_PRINTS,
  CREATE_BLUE_PRINT,
  UPDATE_BLUE_PRINT,
  GET_SINGLE_BLUE_PRINT,
  UPDATE_BLUE_PRINT_STATUS,
  DELETE_BLUE_PRINT,
} from "../constants";

class BluePrintApi {
  static sharedInstance = new BluePrintApi();

  constructor() {
    if (BluePrintApi.sharedInstance !== null) {
      return BluePrintApi.sharedInstance;
    }
  }

  //   Get blue prints
  async getBluePrints(body) {
    try {
      const response = await api.post(GET_BLUE_PRINTS, body);
      if (response?.status === 200) {
        return response?.data?.data?.prints;
      } else {
        return null;
      }
    } catch (error) {
      return error.response.data;
    }
  }

  // Get single blue print
  async getSingleBluePrint(body) {
    try {
      const response = await api.post(GET_SINGLE_BLUE_PRINT, body);
      return response?.data?.data;
    } catch (error) {
      return error.response.data;
    }
  }

  // Create blue print
  async createBluePrint(body) {
    try {
      const response = await api.post(CREATE_BLUE_PRINT, body);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  // Update blue print
  async updateBluePrint(body) {
    try {
      const response = await api.post(UPDATE_BLUE_PRINT, body);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  // Update blue print status
  async updateStatus(body) {
    try {
      const response = await api.post(UPDATE_BLUE_PRINT_STATUS, body);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  // delete blue print
  async deleteBluePrint(id) {
    try {
      const response = await api.delete(`${DELETE_BLUE_PRINT}/${id}`);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
}

export default BluePrintApi.sharedInstance;
