import axios from "axios";
import { IuserSignupData, MainResponse, SigninData, UserResponse, logoutResponse } from "../../interface/user/iuserAuth";

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
            const response = await axios.get(`${URL}/api/user/auth/logout`);
            if(response.data.success){
              localStorage.removeItem('user')
            }
            console.log("This is the response logoutApi: ", response)
            return response.data
          
        } catch (error:any) {
           return {success:false, message:"something went wrong"}
          
        }
} 

export const verifyAndSignupApi = async (userData:IuserSignupData,otp:string):Promise<MainResponse> => {
       try {
            const response = await axios.post(`${URL}/api/user/auth/signup/verify-otp`,{userData, otp});
            return response.data
            console.log("This is the response from verifyAndSignupApi: ", response)
        
       } catch (error) {
           return {success: false, message:"something went wrong"}
        
       }
}
