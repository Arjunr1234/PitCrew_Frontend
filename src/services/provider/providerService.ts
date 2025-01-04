import { axiosInstance } from "../../api/common";
import { URL } from "../../utils/api";
import { IAddBrandData, IAddSubServiceData, IProviderProfileData, IRemoveSubServiceData, IServiceData } from "../../interface/provider/iProvider";
import store from "../../redux/store";
import { toast } from "sonner";
import { reset } from "../../redux/slice/providerAuthSlice";


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




export const getAllServices = async (providerId:string, vehicleType:number) => {
  try {
      const response = await axiosInstance.get(URL + `/api/provider/add-service/get-all-provider-service?id=${providerId}&vehicleType=${vehicleType}`);
      console.log("This is the getall servicedata received : ", response.data)
      return response.data;
      
  } catch (error) {
      console.log("Error in getAllServices: ", error);
      handleError(error);
      throw error; 
  }
}

export const getAllBrands = async (id: string) => {
  try {
    const response = await axiosInstance.get(`http://localhost:3000/api/provider/add-service/get-all-brands?id=${id}`);
    console.log(response.data)
    return response.data

  } catch (error: any) {
 
     handleError(error)
     throw error
    

   }
}



export const addBrand = async(data:IAddBrandData) => {
      try {
         const response = await axiosInstance.post(URL + '/api/provider/add-service/add-brand',data);
         console.log("This is addBrands: ",response);
         return response.data
        
      } catch (error) {
          handleError(error)
          throw error
        
      }
}

export const removeBrand = async(providerId:string, brandId:string) => {
       try {
         const response = await axiosInstance.patch(URL + `/api/provider/add-service/remove-brand?providerId=${providerId}&brandId=${brandId}`);
         console.log("This is the response: ", response)
         return response.data
        
       } catch (error) {
           console.log("Error in removeBrand service: ",error);
           handleError(error)
           throw error
       }
}

export const addGenralRoadServices = async (data: IServiceData) => {
  try {
    const twoWheelerId = "670f584ed53b8715190c2de9";
    const fourWheelerId = "671b3eb40f7b3bea4621af3e";
    const vehicleType = data.vehicleType==="fourWheeler"?fourWheelerId:twoWheelerId

    const sendingData = {
        typeId:data.serviceId,
        category:data.category,
        providerId:data.providerId,
        vehicleType
    }
    
    
    const response = await axiosInstance.post(URL + `/api/provider/add-service/add-general-road-services`, sendingData);
  
    return response.data
  } catch (error) {
    console.log("Error in addGeneral service: ", error);
    handleError(error);
    throw error

  }
}





export const addSubService = async(data:IAddSubServiceData) => {

      try {

           const response = await axiosInstance.post(URL + '/api/provider/add-service/add-subtype',data);
           console.log(response.data);
           return response.data
        
      } catch (error) {
          console.log("Error in addSubService: ", error);
          handleError(error);
          throw error
      }
         
}

export const removeSubService = async(data: IRemoveSubServiceData) => {
  try {
    console.log("This is the data before delete: ", data);
    const { providerId, serviceId, subServiceId, vehicleType } = data;

    
    // const response = await axiosInstance.delete(
    //   `${URL}/api/provider/add-service/remove-subtype?providerId=${providerId}&serviceId=${serviceId}&type=${subServiceId}&vehicleType=${vehicleType}`
    // );
    const response = await axiosInstance.delete(
      `${URL}/api/provider/add-service/remove-subtype/${providerId}/${serviceId}/${subServiceId}/${vehicleType}`
    );

    return response.data;
  } catch (error) {
    console.log("Error in removeSubService: ", error);
    handleError(error)
    throw error;
  }
};

export const removeService = async (providerId:string, serviceId:string, vehicleType:string) => {
             try {

              // const response = await axiosInstance.delete(URL + `/api/provider/add-service/remove-service?providerId=${providerId}&serviceId=${serviceId}&vehicleType=${vehicleType}`);
              const response = await axiosInstance.delete(URL + `/api/provider/add-service/remove-service/${providerId}/${serviceId}/${vehicleType}`);

              return response.data
              
             } catch (error) {
                console.log("Error in removeService: ",error);
                handleError(error)
                throw error
              
             }
}


export const addSlotService = async(providerId:string, startingDate:Date, endingDate:Date | null, count:string) => {
    try {
      const data = {
        providerId,
        startingDate: startingDate.toISOString(),
        endingDate: endingDate?.toISOString(),
        count
      };

        console.log("This is the data: ", data)
         const response = await axiosInstance.post(URL + '/api/provider/bookings/add-slot', data )
         console.log("This is respponse: ", response.data);
         return response.data
    } catch (error) {
        console.log("Error in addSlotService: ", error)
        handleError(error);
        throw error
      
    }
}

export const getAllSlotService = async(providerId:string) => {
     try {
           const response = await axiosInstance.get(URL + `/api/provider/bookings/get-all-slot?providerId=${providerId}`);
           return response.data
      
     } catch (error) {
         console.log("Error in  getAllSlotService: ", error)
      
     }
}

export const updateSlotCountService = async(slotId:string, state:number) => {
   try {
         const response = await axiosInstance.patch(URL + `/api/provider/bookings/update-slot`, {slotId, state});
         return response.data
    
   } catch (error) {
       console.log("Error in getAll service: ", error)
       handleError(error);
       throw error
   }
}

export const removeSlotService = async (slotId: string) => {
  try {

    const response = await axiosInstance.delete(URL + `/api/provider/bookings/remove-slot/${slotId}`);
    return response.data

  } catch (error) {
    console.log("Error in removeSlotService: ", error);
    handleError(error);
    throw error

  }
}

export const getProviderDetailsService = async (providerId: string) => {
  try {

    const response = await axiosInstance.get(URL + `/api/provider/profile/get-provider-details?providerId=${providerId}`);
    return response.data

  } catch (error) {
    console.log("Error in updateProviderProfile: ", error);
    handleError(error);
    throw error

  }
}




export const updatePoviderProfile = async (data: IProviderProfileData) => {
  try {
    const response = await axiosInstance.post(URL + '/api/provider/profile/edit-profile', data)
    return response.data
  } catch (error) {
    console.log("Error in updateProviderProfile: ", error);
    handleError(error)
    throw error

  }
}

export const updateProfilePicture = async (data: FormData) => {
  try {
    const response = await axiosInstance.post(URL + `/api/provider/profile/update-profile-pic`, data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  } catch (error) {
    console.log("Error ocuured in updateProfilePicture: ", error);
    handleError(error)
    throw error
  }
}
// shift to this to user
export const getBookingsService = async(userId:string) => {
    try {

        const response = await axiosInstance.get(URL + `/api/user/bookings/get-all-bookings?userId=${userId}`);
        return response.data
      
    } catch (error) {
        console.log("Error in getBookingService: ", error);
        handleError(error)
      
    }
}

export const fetchBookingsService = async(providerId:string) => {
      try {
        const response = await axiosInstance.get(URL + `/api/provider/bookings/get-all-bookings?providerId=${providerId}`);
        console.log("This is the repsoen servcie: ", response)
        return response.data
        
      } catch (error) {
        console.log("Error in getBookingService: ", error)
        handleError(error)
      }
}

export const changeBookingStatus = async (bookingId: string, status: string) => {
  try {

    const response = await axiosInstance.patch(URL + '/api/provider/bookings/change-status', { bookingId, status });
    return response.data
  } catch (error) {
    console.log("Error in changeBookingStatus: ", error);
    handleError(error);

  }
}

export const resetPasswordService = async(providerId:string, currentPassword:string, newPassword:string) => {
  try {
      //  const response = await axiosInstance.put(URL + '/api/provider/profile/reset-password',{providerId, currentPassword, newPassword});
      const response = await axiosInstance.put(URL + `/api/provider/profile/reset-password/${providerId}/${currentPassword}/${newPassword}`);

       return response.data
    
  } catch (error) {
      console.log('Error in resetPassword: ', error);
      handleError(error);
      throw error
    
  }
}

export const fetchSingleBookingService = async(bookingId:string) => {
    try {
        const response = await axiosInstance.get(URL + `/api/provider/bookings/get-single-booking?bookingId=${bookingId}`);
        return response.data
      
    } catch (error) {
        console.log("Error in fetchSingleBookingService; ", error)
        handleError(error);
        throw error
    }
}

export const fetchDashboardData = async(providerId:string) => {
    try {
         const response = await axiosInstance.get(URL + `/api/provider/bookings/dashboard-details?providerId=${providerId}`)
         return response.data
      
    } catch (error) {
       console.log('Error in fetchDashboardData: ', error);
       handleError(error);
       throw error
      
    }
}





