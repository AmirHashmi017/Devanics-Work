import axios from 'axios';
import { store } from 'src/redux/store';

const BACKEND_URL = process.env.REACT_APP_BACKEND_BASE_URL;
const api = axios.create({
  baseURL: BACKEND_URL + '/api',
});

api.interceptors.request.use((config) => {
  try {
    const token = store.getState().auth.token;
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  } catch (error) {
    throw new Error(`Error in setting auth header globally :${error}`);
  }
});

export default api;

type ApiRequestFnParams = {
  method?: 'get' | 'post' | 'put' | 'delete' | 'patch';
  url: string;
  data?: any;
};

export const apiRequestFn = async ({
  method = 'get',
  url,
  data,
  ...rest
}: ApiRequestFnParams) => {
  const apiResponse = await api({
    method,
    url,
    data,
    ...rest,
  });
  return apiResponse.data;
};
