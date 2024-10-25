import { string } from "yup";
import { axiosInstance } from "../../api/common";
import { URL } from "../../utils/api";
import { IAddBrandData, IServiceData } from "../../interface/provider/iProvider";
const twoWheelerId = "670f584ed53b8715190c2de9";
const fourWheelerId = "671b3eb40f7b3bea4621af3e"







export const getAllServices = async (providerId:string, vehicleType:number) => {
  try {
      const response = await axiosInstance.get(URL + `/api/provider/add-service/get-all-provider-service?id=${providerId}&vehicleType=${vehicleType}`);
      console.log("This is the getall servicedata received : ", response.data)
      return response.data;
      
  } catch (error) {
      console.log("Error in getAllServices: ", error);
      throw error; 
  }
}

export const getAllBrands = async(id:string) => {
       try {
           const response = await axiosInstance.get(`http://localhost:3000/api/provider/add-service/get-all-brands?id=${id}`);
           console.log(response.data)
           return response.data
        
       } catch (error) {
           console.log("Error in getAllServices: ",error);
           throw error
        
       }
}



export const addBrand = async(data:IAddBrandData) => {
      try {
         const response = await axiosInstance.post(URL + '/api/provider/add-service/add-brand',data);
         console.log("This is addBrands: ",response);
         return response.data
        
      } catch (error) {
          console.log("Error in addBrand: ", error);
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
           throw error
        
       }
}

export const addGenralServices = async (data: IServiceData) => {
  try {
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
    throw error

  }
}
