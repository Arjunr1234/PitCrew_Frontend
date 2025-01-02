import axios from "axios";
//import { URL } from "../utils/api";


export const axiosInstance = axios.create({
  baseURL: 'https://api.pitcrew.shop',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});


// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => { 
//     return Promise.reject(error);
//   }
// );

