import axios from "axios";
import { URL } from "../utils/api";
import { NavigateFunction, useNavigate } from "react-router-dom";
import {persistor} from '../redux/store'
import {store} from '../redux/store'

export const axiosInstance = axios.create({
  baseURL: URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// const handleNavigate = (navigate:NavigateFunction, path:string) => {
//   navigate(path);
// };


// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // Purge the persisted Redux state on unauthorized response
//       persistor.purge().then(() => {
//         console.log("Persisted state cleared due to unauthorized response.");
//         // Optionally, you can redirect to login or handle other logout operations here
//         window.location.href = "/login";
//       });
//     }
//     return Promise.reject(error);
//   }
// );