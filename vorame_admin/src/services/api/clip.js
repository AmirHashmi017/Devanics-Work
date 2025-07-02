import api from "../../utils/axios";
import {
  GET_CLIPS,
  CREATE_CLIP,
  UPDATE_CLIP,
  UPDATE_CLIP_FAVOURITE,
  UPDATE_CLIP_STATUS,
  DELETE_CLIP,
  GET_SINGLE_CLIP,
} from "../constants";

class ClipApi {
  static sharedInstance = new ClipApi();

  constructor() {
    if (ClipApi.sharedInstance !== null) {
      return ClipApi.sharedInstance;
    }
  }

  //   Get clips
  async getClips() {
    try {
      const response = await api.get(GET_CLIPS);
      if (response?.status === 200) {
        return response?.data?.data?.clips;
      } else {
        return null;
      }
    } catch (error) {
      return error.response.data;
    }
  }

  // Get single clip
  async getSingleClip(body) {
    try {
      const response = await api.post(GET_SINGLE_CLIP, body);
      return response?.data?.data;
    } catch (error) {
      return error.response.data;
    }
  }

  // Create clip
  async createClip(body) {
    try {
      const response = await api.post(CREATE_CLIP, body);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  // Update clip
  async updateClip(body) {
    try {
      const response = await api.post(UPDATE_CLIP, body);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  // Update clip status
  async updateClipStatus(body) {
    try {
      const response = await api.post(UPDATE_CLIP_STATUS, body);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  // Update clip favourite
  async updateClipFavourite(body) {
    try {
      const response = await api.post(UPDATE_CLIP_FAVOURITE, body);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  // delete clip
  async deleteClip(id) {
    try {
      const response = await api.delete(`${DELETE_CLIP}/${id}`);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
}

export default ClipApi.sharedInstance;
