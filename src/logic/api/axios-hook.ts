import { makeUseAxios } from "axios-hooks";
import { axiosInstance } from "./api";

const useAxiosInstance = makeUseAxios({ axios: axiosInstance });

export const useAxios = useAxiosInstance;
