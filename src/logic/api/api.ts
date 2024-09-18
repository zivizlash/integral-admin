import axios from "axios";
import {
  getAccessToken, 
  setStorageTokens
} from "@/logic/state/tokenHelper";
import { staticApiBase } from "../store/userStore";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_PATH;

const instance = axios.create({
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json; charset=UTF-8",
    // "Authorization": `Bearer ${getAccessToken()}`
  }
});

instance.interceptors.request.use(
  request => {
    request.headers.Authorization = `Bearer ${getAccessToken()}`;
    request.baseURL = staticApiBase!;
    return request;
  }
);

const clearInstance = axios.create({
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json; charset=UTF-8"
  }
});

export function updateAuthData(access: string, refresh: string) {
  setStorageTokens(access, refresh);
}

export const axiosInstance = instance;
export const axiosClearInstance = clearInstance;

export default instance;
