import { FORGOT_PASSWORD, LOGIN, RESET_PASSWORD } from "../constants";
import api from "../../utils/axios";

class AuthApi {
  static sharedInstance = new AuthApi();

  constructor() {
    if (AuthApi.sharedInstance !== null) {
      return AuthApi.sharedInstance;
    }
  }

  //   Login
  async login(body) {
    try {
      const response = await api.post(LOGIN, body);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  // Forgot password
  async forgotPassword(body) {
    try {
      const response = await api.post(FORGOT_PASSWORD, body);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
  // Reset password
  async resetPassword(body) {
    try {
      const response = await api.post(RESET_PASSWORD, body);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
}

export default AuthApi.sharedInstance;
