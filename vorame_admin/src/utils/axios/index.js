import axios from "axios";
import localStorage from "../../managers/auth";

const BACKEND_URL = process.env.REACT_APP_BASE_URL;
const api = axios.create({
  baseURL: BACKEND_URL,
});

// Setting auth header globally (if needed in apis authenication)

api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getToken();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  } catch (error) {
    throw new Error(`Error in setting auth header globally :${error}`);
  }
});

export default api;
