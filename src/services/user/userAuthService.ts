import axios from "axios";
import { URL } from "../../utils/api";
import { IuserSignupData, MainResponse, SigninData, UserResponse, logoutResponse } from "../../interface/user/iuserAuth";
import { axiosInstance } from "../../api/common";



export  const signInApi = async (signInData: SigninData): Promise<UserResponse> => {
  try {
    const response = await axiosInstance.post<UserResponse>(`${URL}/api/user/auth/login`, signInData, );

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
            const response = await axiosInstance.get(`${URL}/api/user/auth/logout`);
            if(response.data.success){
              localStorage.removeItem('user')
            }
            console.log("This is the response logoutApi: ", response)
            return response.data
          
        } catch (error:any) {
           return {success:false, message:"something went wrong"}
          
        }
} 

export const verifyAndSignupApi = async (userData: IuserSignupData, otp: string): Promise<MainResponse> => {
  try {
    const response = await axiosInstance.post(`${URL}/api/user/auth/signup/verify-otp`, { userData, otp });
    console.log("This is the response from verifyAndSignupApi: ", response);

    if (response.data.success) {
      return response.data;
    } else {
      // Throw an error to trigger the rejected state
      throw new Error(response.data.message || "OTP verification failed!");
    }
  } catch (error:any) {
    console.error("Error during OTP verification:", error);
    // Rethrow the error to propagate it to createAsyncThunk's rejected case
    throw new Error(error.response?.data?.message || "Otp Verification failed!!");
  }
};


