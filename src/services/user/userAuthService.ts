import axios from "axios";
import { SigninData, UserResponse, logoutResponse } from "../../interface/user/iuserAuth";

export const URL = "http://localhost:3000";

export  const signInApi = async (signInData: SigninData): Promise<UserResponse> => {
  try {
    const response = await axios.post<UserResponse>(`${URL}/api/user/auth/login`, signInData);

    if (response.data.success) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;

  } catch (error:any) {
    if (error.response && error.response.data) {
      return {
        success: false,
        message: error.response.data.message || "An error occurred during login"
      };
    } else  {
      return {
        success: false,
        message: "Something went wrong. Please try again."
      };
    }
  }
};

export const logoutApi = async ():Promise<logoutResponse> =>{
        try {
            const response = await axios.get(`${URL}/api/user/auth/login`);
            if(response.data.success){
              localStorage.removeItem('user')
            }
            return response.data
          
        } catch (error:any) {
           return {success:false, message:"something went wrong"}
          
        }
} 
