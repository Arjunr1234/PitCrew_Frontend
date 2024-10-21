import axios from "axios";
import { URL } from "../../utils/api";
import { LoginData, SignupData } from "../../interface/provider/iProviderAuth";
import { SigninData } from "../../interface/user/iuserAuth";
import { axiosInstance } from "../../api/common";

export const providerLoginApi = async (logData: LoginData) => {
  try {
    
    const response = await axios.post(URL + '/api/provider/auth/login', logData);
    
    return response.data;

  } catch (error: any) {
    
    console.error("Error occurred during provider login", error);
    throw error;  
  }
};

export const providerSignupApi = async (signupData: SignupData) => {
    try {
       const response = await axios.post(URL + '/api/provider/auth/create-provider', signupData);
       return response.data
      
    } catch (error) {
        
      console.log("Error occured during provider login: ",error);
      throw error
      
    }
}

export const providerLogoutApi = async () => {
      try {
        const response = await axiosInstance.get(URL + '/api/provider/auth/logout');
        return response.data
        
      } catch (error) {
          console.log("Error occured during provider logout: ", error)
        
      }
}
