import { createAsyncThunk } from "@reduxjs/toolkit";
import { LoginData, ProviderLoginResponse, ProviderSignupResponse, SignupData } from "../../interface/provider/iProviderAuth";
import { providerLoginApi, providerSignupApi } from "../../services/provider/providerAuthService";




export const loginThunk = createAsyncThunk<ProviderLoginResponse, LoginData>(
  'provider/login',
  async (logData, { rejectWithValue }) => {
    try {
      console.log("entered into loginThunk")
      const response = await providerLoginApi(logData);
      console.log("This is the repsonse from loginThunk: ", response)
      
      return response;
    } catch (error: any) {
      
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Login failed');
      } else {
        return rejectWithValue('An error occurred during login');
      }
    }
  }
);




export const signupThunk = createAsyncThunk<ProviderSignupResponse, SignupData>(
  'provider/signup', 
  async (signInData, { rejectWithValue }) => {
    try {
      
      const response = await providerSignupApi(signInData);
      console.log("This is teh response from signup thunk: ",response)
      return response; 
    } catch (error: any) {
      
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Signup failed');
      }
      
      return rejectWithValue('An error occurred during signup');
    }
  }
);

