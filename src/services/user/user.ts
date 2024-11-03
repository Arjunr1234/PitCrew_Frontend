import { axiosInstance } from "../../api/common"
import { URL } from "../../utils/api"




export const getAllServices = async() => {
        try {
            const response = await axiosInstance.get(URL + '/api/user/services/get-all-services');
            return response.data
          
        } catch (error) {
             console.log("Error in getAllservices: ",error)
             throw error
        }

}

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

export const vehicleDetailsService = async(data:IVehicleDetailsData) => {
      try {
           console.log("This is the data from the service seciton: ", data)
           const response = await axiosInstance.post(URL + `/api/user/services/search-providers`, data);
           console.log("This is the resposne: ", response)
           return response.data
        
      } catch (error) {
         console.log("Error in vehicleDetailsService: ",error)
         throw error
        
      }

}


export const fetchBrandService = async() => {
      try {
            const response = await axiosInstance.get(URL + `/api/user/services/get-all-brands`);
            
            return response.data
        
      } catch (error) {
          console.log("Error in fetchBrand: ",error)
          throw error
      }
}