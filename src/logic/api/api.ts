import axios from "axios";
import { redirect, RedirectType } from "next/navigation";
import {
  getAccessToken, getRefreshToken,
  setStorageTokens, isRefreshTokenAlreadyAccessed
} from "@/logic/state/tokenHelper";
import { API_BASE_URL } from "./env-vars";

axios.defaults.baseURL = API_BASE_URL;

const instance = axios.create({
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json; charset=UTF-8",
    "Authorization": `Bearer ${getAccessToken()}`
  }
});

instance.interceptors.request.use(
  request => {
    request.headers.Authorization = `Bearer ${getAccessToken()}`;
    return request;
  }
);

// instance.interceptors.response.use(
//   response => response,
//   error => {
//     return error;
//     // if (error.response != null && error.response.status === 401) {
//       // redirect("/login", RedirectType.push);
//     // }
//   }
// );

export function updateAuthData(access: string, refresh: string) {
  setStorageTokens(access, refresh);
}

export const axiosInstance = instance;
export default instance;
