import { IAdminIntialState } from "../../interface/admin/iAdminAuth";
import { createSlice } from "@reduxjs/toolkit";
import { adminloginThunk,adminLogoutThunk } from "../thunk/admin";



const adminData = JSON.parse(localStorage.getItem('isAdmin') ||  '{}');


const initialState : IAdminIntialState = {
  isLoading:false,
  isAdmin:adminData.isAdmin?adminData.isAdmin:false,
  success:false,
  message:null,
  error:false,
  errorMessage:null
}


const adminSlice = createSlice({
          name:'admin',
          initialState,
          reducers:{
            resetAdminState:(state) => {
              state.isAdmin = false;
              state.errorMessage = null;
              state.error = false;
              state.success = false;
              state.isLoading = false;
              state.message = null;

            },
            resetSuccess: (state) => {
              state.success = false;
              state.message = null;
            },
            resetError: (state) => {
              state.error = false;
              state.errorMessage = null;
            }
          },
          extraReducers:(builder) => {
              builder
                .addCase(adminloginThunk.pending, (state) => {
                    state.isLoading = true;
                    
                }).addCase(adminloginThunk.fulfilled,(state, action)=>{
                  console.log("Entered into adminlognThunk fullfilled case ")
                   const {message, success} = action.payload;
                   if(success){
                     state.isAdmin = true,
                     state.message = message;
                     state.success = success

                   }
                }).addCase(adminloginThunk.rejected, (state, action) => {
                   state.isLoading = false;
                   state.error = true;
                   state.errorMessage = action.error.message || 'Login Failed'
                })

                .addCase(adminLogoutThunk.pending,(state) => {
                     state.isLoading = true;
                }).addCase(adminLogoutThunk.fulfilled, (state, action) => {
                     state.success = action.payload.success;
                     state.message = action.payload.message;
                     state.isAdmin = false;
                     state.isLoading = false;
                }).addCase(adminLogoutThunk.rejected,(state)=> {
                     state.error = true;
                     state.errorMessage = "Error occured While logout"
                })
          }
})

export const {resetAdminState, resetSuccess, resetError} = adminSlice.actions
export default adminSlice.reducer



