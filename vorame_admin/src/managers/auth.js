import { TOKEN, USER } from "../constants";

class LocalStorage {
  static sharedInstance = new LocalStorage();

  constructor() {
    if (LocalStorage.sharedInstance !== null) {
      return LocalStorage.sharedInstance;
    }
  }

  //   Set user
  setUser(value) {
    try {
      return localStorage.setItem(USER, JSON.stringify(value));
    } catch (error) {
      console.log("Error in set user in local storage:", error);
      throw error;
    }
  }

  //   Get user
  getUser() {
    try {
      return JSON.parse(localStorage.getItem(USER));
    } catch (error) {
      throw error;
    }
  }

  //   Remove user
  removeUser() {
    try {
      return localStorage.removeItem(USER);
    } catch (error) {
      throw error;
    }
  }

  //   Set token
  setToken(value) {
    try {
      return localStorage.setItem(TOKEN, value);
    } catch (error) {
      throw error;
    }
  }

  //   Get token
  getToken() {
    try {
      return localStorage.getItem(TOKEN);
    } catch (error) {
      throw error;
    }
  }

  //   Remove token
  removeToken() {
    try {
      return localStorage.removeItem(TOKEN);
    } catch (error) {
      throw error;
    }
  }
}

export default LocalStorage.sharedInstance;
