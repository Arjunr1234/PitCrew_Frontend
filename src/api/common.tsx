import axios from "axios";
import { URL } from "../utils/api";
import { useNavigate } from "react-router-dom";

export const axiosInstance = axios.create({
  baseURL: URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});


const navigateToLogin = () => {
  const navigate = useNavigate();
  navigate('/login'); 
};


axiosInstance.interceptors.response.use(
  (response) => {
  
    return response;
  },
  async (error) => {
    
    if (error.response) {
      
      switch (error.response.status) {
        case 401: 
          console.error("Unauthorized:", error.response.data);
          navigateToLogin();
          break;
        case 403: 
          console.error("Forbidden:", error.response.data);
          navigateToLogin();
          break;
        default:
          console.error("Error:", error.response.data);
          break;
      }
    } else if (error.request) {
      
      console.error("No Response:", error.request);
    } else {
      
      console.error("Error:", error.message);
    }

    return Promise.reject(error); 
  }
);
