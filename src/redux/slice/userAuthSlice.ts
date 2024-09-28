import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserResponse, SigninData, IuserInitialState, logoutResponse } from "../../interface/user/iuserAuth";
import {  logoutApi, signInApi } from "../../services/user/userAuthService"; 


const storedUser = localStorage.getItem('user');
const user = storedUser? JSON.parse(storedUser) : null

export const signInThunk = createAsyncThunk<UserResponse, SigninData>(
  'user/signIn',
  async (userData: SigninData, { rejectWithValue }) => { 
    try {
      const response = await signInApi(userData); 
      console.log("This is the response: ", response)
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
      
    } catch (error) {
       throw new Error(error instanceof Error ? error.message: "Error is occured in logout thunk ")
    }
})





const initialState : IuserInitialState = {
     userInfo: user? user:null,
     success:null,
     isLoggedIn:user?true:false,
     isLoading:false,
     error:null,
     message:""

}

const userSlice = createSlice({
             name:'user',
             initialState,
             reducers:{
               reset:(state)=>{
                state.userInfo = null,
                state.isLoggedIn = false,
                state.isLoading = false,
                state.error = null;
               },
               resetMessage:(state) =>{
                  state.message = ""
               },
               resetSuccess:(state) => {
                  state.success = null;
               },
               resetError:(state) => {
                  state.error = null;
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
                       state.isLoading = false;
                       state.message = action.payload.message;
                       state.success = action.payload.success;
                       state.userInfo = action.payload.user?action.payload.user:null;
                   }).addCase(signInThunk.rejected, (state, action) => {
                       state.isLoading = false;
                       state.error = action.payload as string
                   })
             }
})

export const {reset, resetMessage, resetError, urgentReset} = userSlice.actions
export default userSlice.reducer