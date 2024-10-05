import { createSlice } from "@reduxjs/toolkit";
import { ProviderInitialState } from "../../interface/provider/iProviderAuth";
import { loginThunk, signupThunk } from "../thunk/provider";

const provide = localStorage.getItem('provider');
const provider = provide ? JSON.parse(provide) : null;

const initialState: ProviderInitialState = {
  providerInfo: provider ? provider : null,
  success: null,
  isLoading: false,
  errorMessage: null,
  error: false,
  message: null,
};

const providerSlice = createSlice({
  name: 'provider',
  initialState,
  reducers: {
    reset: (state) => {
      state.providerInfo = null;
      state.isLoading = false;
      state.error = false;
    },
    resetMessage: (state) => {
      state.message = null;
    },
    resetSuccess: (state) => {
      state.success = null;
      state.message = null;
    },
    resetError: (state) => {
      state.error = false;
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
     .addCase(signupThunk.pending, (state) => {
         state.isLoading = true,
         state.error = false
     }).addCase(signupThunk.fulfilled, (state,action) => {
        console.log("Entered into signup fullfilled")
         state.message = action.payload.message + "Please wait admin to Verify";
         state.success = true;
         state.isLoading = false;
     }).addCase(signupThunk.rejected, (state) => {
         state.isLoading = true,
         state.error = false
     })
      
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = false;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        console.log("Enter into the addCase for loginThunk", action.payload.provider);

        
        state.providerInfo = {
          id: action.payload.provider._id,
          ownername: action.payload.provider.ownerName,
          workshopname: action.payload.provider.workshopName,
          email: action.payload.provider.email,
          mobile: action.payload.provider.mobile,
          requested: action.payload.provider.requested,
          blocked: action.payload.provider.blocked,
        };
        state.success = action.payload.success;
        state.message = action.payload.message;
        state.isLoading = false;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMessage = action.payload as string;
      });
  },
});

export default providerSlice.reducer;
