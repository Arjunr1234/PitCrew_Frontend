import { axiosInstance } from "../../api/common"
import axios from "axios";
import { reset } from "../../redux/slice/userAuthSlice";
import store from "../../redux/store";
import { URL } from "../../utils/api"
import { toast } from "sonner";
import { BookingData, IProfileEditData } from "../../interface/user/user";


interface IVehicleDetailsData{
    
    serviceId:string,
    vehicleNumber:string,
    vehicleBrand:{brandName:string,id:string},
    vehicleModel:string,
    kilometers:number,
    vehicleType:string,
    fuelType:string,
    location:{place_name:string, coordinates:[number, number]}
}


const handleError = (error: any): void => {
    if (error.response) {
      const status = error.response.status;
      if (status === 403) {
        store.dispatch(reset());
        toast.error(error.response.data.message || "Forbidden access.");
      } else if (status === 401) {
        console.log("Unauthorized access. Redirecting to login.");
        store.dispatch(reset());
      }
    } else {
      console.log("An unexpected error occurred:", error);
    }
  };

  
  export const getAllServices = async () => {
      try {
          const response = await axiosInstance.get('/api/user/services/get-all-services');
          return response.data;
      } catch (error: any) {
          handleError(error);
          throw error
      }
  };
  



export const vehicleDetailsService = async(data:IVehicleDetailsData) => {
      try {
           console.log("This is the data from the service seciton: ", data)
           const response = await axiosInstance.post(URL + `/api/user/services/search-providers`, data);
           console.log("This is the resposne: ", response)
           return response.data
        
      } catch (error:any) {
         console.log("Error in vehicleDetailsService: ",error)
         handleError(error)
         throw error
        
      }

}


export const fetchBrandService = async () => {
    try {
      const response = await axiosInstance.get(URL + `/api/user/services/get-all-brands`);
      return response.data;
    } catch (error: any) {
       console.log("Error in fetchBrandservice; ",error)
       handleError(error);
    }
  };

export const getProviderDetailsWithSubService = async(providerId:string, vehicleType:string, serviceId:string) => {
    try {
        const data = {providerId, vehicleType, serviceId}
        const response = await axiosInstance.post(URL + `/api/user/services/provider-serivce-view`, data);
        return response.data
      
    } catch (error) {
       console.log("Error getProviderDetailsWithSubservice: ",error);
       handleError(error);
       throw error
    }
}

export const checkAvalibeSlotService = async (date:Date, providerId:string) => {
  try {
      console.log("This si the date: ", date)
      const formattedDate = date.toLocaleDateString("en-CA")
       console.log("This is the date: ", formattedDate)
       const response = await axiosInstance.get(URL + `/api/user/bookings/check-avaliable-slot?providerId=${providerId}&date=${formattedDate}`);
       return response.data
  } catch (error:any) {
      console.log("Error in checkAvaliableService: ", error);
      handleError(error);
      toast.error(error.response.data.message)
      throw error   
  }
}



export const paymentService = async(data:any) => {
   try {

       const response = await axiosInstance.post(URL + `/api/user/bookings/service-booking-payment`, {data});
        return response.data  
      
    
   } catch (error) {
       console.log("Error in paymentService: ", error)
       handleError(error);
       throw error
   }
}

export const changePaymentStatusService = async(paymentSessionId:string, bookId:string) => {
    try {
        const response = await axiosInstance.patch(URL + '/api/user/bookings/change-payment-status-success', {paymentSessionId, bookId})
        return response.data
      
    } catch (error) {
      handleError(error)
      
    }
}

export const getUserDetailsService = async(userId:string) => {
           try {

               const response = await axiosInstance.get(URL + `/api/user/profile/get-user?userId=${userId}`)
               return response.data
            
           } catch (error) {
              console.log("Error in getUserDetailsService: ", error);
              handleError(error)
            
           }         
}


export const editUserProfileService = async (data: IProfileEditData) => {
  try {
    const response = await axiosInstance.patch(URL + `/api/user/profile/edit-profile`, data)
    return response.data

  } catch (error) {
    console.log("Error in editUserProfile: ", error)
    handleError(error)
  }
}

export const updateProfilePicService = async (data: FormData) => {
  try {
    console.log("This is the formdata: ", data)
    const response = await axiosInstance.post(URL + '/api/user/profile/update-profile-img', data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data

  } catch (error) {
    console.log("Error in updateProfilePicService: ", error);
    handleError(error)

  }
}

export const fetchAllChatService = async (userId: string, providerId: string) => {
  try {

    const response = await axiosInstance.get(URL + `/api/chat/get-all-chats?userId=${userId}&providerId=${providerId}`);
    return response.data

  } catch (error) {
    console.log("Error in fetchAllChatService: ", error);
    handleError(error);
    throw error

  }
}

export const resetPasswordService = async(userId:string, currentPassword:string, newPassword:string) => {
  try {
       const response = await axiosInstance.put(URL + '/api/user/profile/reset-password',{userId, currentPassword, newPassword});
       return response.data
    
  } catch (error) {
      console.log('Error in resetPassword: ', error)
      handleError(error)
      throw error
    
  }
}

export const cancellBookingService = async (bookingId:string, reason:string) => {
    try {
         const response = await axiosInstance.put(URL + '/api/user/bookings/cancell-booking', {bookingId, reason});
         return response.data
      
    } catch (error) {
       console.log("Error in cancellBookingService: ", error);
       handleError(error);
       throw error
      
    }
}