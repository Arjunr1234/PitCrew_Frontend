import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserResponse, SigninData, IuserInitialState, logoutResponse, IuserSignupData } from "../../interface/user/iuserAuth";
import {  logoutApi, signInApi, verifyAndSignupApi } from "../../services/user/userAuthService"; 
import { boolean } from "yup";


const storedUser = localStorage.getItem('user');
const user = storedUser? JSON.parse(storedUser) : null

export const signInThunk = createAsyncThunk<UserResponse, SigninData>(
  'user/signIn',
  async (userData: SigninData, { rejectWithValue }) => { 
    try {
      const response = await signInApi(userData); 
      console.log("This is the response: ", response)
      if (!response.success) {
        return rejectWithValue(response.message || 'Sign-in failed');
      }
      return response; 
    } catch (error: any) {
      
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred during sign-in'
      );
    }
  }
);

export const logoutThunk = createAsyncThunk<logoutResponse>('user/logout', async () => {
    try {
         const response = await logoutApi();
         return response
         console.log("This is the response of logoutthunk: ", response)
      
    } catch (error) {
       throw new Error(error instanceof Error ? error.message: "Error is occured in logout thunk ")
    }
})

export const otpVerifyAndSignupThunk = createAsyncThunk<
  UserResponse,
  { userData: IuserSignupData; otp: string },
  { rejectValue: string }
>(
  'user/verify-otp/signup',
  async ({ userData, otp }, { rejectWithValue }) => {
    try {
      const response = await verifyAndSignupApi(userData, otp);
      console.log("This is a kind of resonponse in thunk: ", response)
      return response;
      
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || "OTP verification failed");
      } else {
        return rejectWithValue('Otp vefication failedd');
      }
    }
  }
);





const initialState : IuserInitialState = {
     userInfo: user? user:null,
     success:null,
     isLoggedIn:user?true:false,
     isLoading:false,
     error:null ,
     message:"",
     errorMessage:""

}

const userSlice = createSlice({
             name:'user',
             initialState,
             reducers:{
               reset:(state)=>{
                state.userInfo = null,
                state.success = null
                state.isLoggedIn = false,
                state.isLoading = false,
                state.error = null;
               },
               resetMessage:(state) =>{
                  state.message = ""
               },
               resetSuccessAndMessage:(state) => {
                  state.success = null;
                  state.message = ''
               },
               resetErrorAndMessage:(state) => {
                  state.error = null;
                  state.message = ""
               },
               resetErrorAndErrorMessage:(state)=> {
                   state.error = null,
                   state.errorMessage = ""
               },
               urgentReset:(state) => {
                   state.message = "";
                   state.success = null;
                   state.error = null
               }
             },
             extraReducers:(builder) => {
                builder
                  
                   .addCase(signInThunk.pending, (state) => {
                       state.isLoading = true;
                       state.error = null
                   }).addCase(signInThunk.fulfilled, (state, action)=> {
                      console.log("Ented into succuess signin, ", action.payload)
                       state.isLoading = false;
                       state.message = action.payload.message;
                       state.success = action.payload.success;
                       state.userInfo = action.payload.user?action.payload.user:null;
                   }).addCase(signInThunk.rejected, (state, action) => {
                       console.log("Entered into loginthun reject: ", action.payload)
                       state.isLoading = false;
                       state.error = true
                       state.errorMessage = action.payload as string 
                   })

                   .addCase(otpVerifyAndSignupThunk.pending, (state) => {
                        state.isLoading = true;
                        state.error = null;
                   }).addCase(otpVerifyAndSignupThunk.fulfilled,(state,action) => {
                       console.log("Entered into otpverifySignupThunk: ",action.payload)
                        state.isLoading = false;
                        state.message = action.payload.message;
                        state.success = true;
                        state.userInfo = action.payload.user?action.payload.user:null;
                        state.isLoggedIn = true;
                        state.error = null;
                   }).addCase(otpVerifyAndSignupThunk.rejected, (state,action) => {
                        state.isLoading = false;
                        console.log("This is the rejectedCase of otpVerfiySignupThunk: ", action.payload)
                        state.message = action.payload as string
                      //  state.success= false
                        state.error = true  
                   })

                  

                   .addCase(logoutThunk.fulfilled,(state,action) => {
                       state.message= action.payload.message;
                       state.isLoading = false
                       state.success = action.payload.success
                       state.userInfo = null
                       state.error = null
                   }).addCase(logoutThunk.rejected, (state,action) => {
                       state.isLoading = false;
                       state.error = action.payload as string;
               } )
             }
})

export const {reset, resetMessage, resetErrorAndMessage,resetErrorAndErrorMessage, urgentReset,resetSuccessAndMessage} = userSlice.actions
export default userSlice.reducer