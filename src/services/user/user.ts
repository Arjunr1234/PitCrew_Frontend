import { axiosInstance } from "../../api/common"
import axios from "axios";
import { reset } from "../../redux/slice/userAuthSlice";
import store from "../../redux/store";
import { URL } from "../../utils/api"
import { toast } from "sonner";


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