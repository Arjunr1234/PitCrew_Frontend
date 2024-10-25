import { createAsyncThunk } from "@reduxjs/toolkit";
import { IAdminLoginResponse, ILoginData } from "../../interface/admin/iAdminAuth";
import { AdminLoginApi, adminLogoutApi } from "../../services/admin/AdminAuthService";


export const adminloginThunk = createAsyncThunk<IAdminLoginResponse, ILoginData>(
  'admin/login',
  async (logData, { rejectWithValue }) => {
    try {
      console.log("Entered into logData: ", logData);
      
      const response = await AdminLoginApi(logData);
      console.log("This is the response: ", response)
      return response;
      

    } catch (error: any) {
      console.error(error);

      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

interface IAdminLogoutResponse{
   success:boolean,
   message:string
}

export const adminLogoutThunk = createAsyncThunk<IAdminLogoutResponse>(
  'admin/logout',
  async () => {
    try {
      const response = await adminLogoutApi(); 
      return response
    } catch (error) {
        console.log(error)
      
    }
  }
);


