import { URL } from "../../utils/api";
import { axiosInstance } from "../../api/common";



export const getAllBrands = async() => {
     try {
         const response = await axiosInstance.get(URL + '/api/admin/services/get-all-brands')
         console.log("kfdslkfdslkfjlskdf: ",response.data)
         return response.data
        
     } catch (error) {
          console.error("Error in fetching Brand: ", error)
          throw error
     }
}

export const addBrand = async (brand:string) => {
    try {
        const response = await axiosInstance.post(URL + '/api/admin/services/add-brands', {brand})
        return response.data

      
    } catch (error) {
        throw error
      
    }
}

export const deleteBrand = async (id: string) => {
    try {
        console.log("This is Id: ", id);
        const response = await axiosInstance.delete(`${URL}/api/admin/services/delete-brands?id=${id}`); // Using route parameter
        console.log("This is the response from the deleteBrand: ", response.data);
        return response.data;
    } catch (error:any) {
        console.error("Some error occurred during:", error.response ? error.response.data : error.message);
        throw error;
    }
}

export const addService = async(formData:FormData) => {
            try {
                 
                  const response = await axiosInstance.post(`${URL}/api/admin/services/add-service`,formData, {
                    headers:{
                        'Content-Type':'multipart/form-data'
                    }
                  });
                  return response.data
                
            } catch (error) {
                 console.log("Error in addind service: ", error)
                 throw error
            }


}

export const getAllGeneralServices = async () => {
    try {
        const response = await axiosInstance.get(`${URL}/api/admin/services/get-all-general-service`);
        console.log("This iis the getall general service: ", response.data)
        return response.data;  
       
    } catch (error: any) {
        
        if (error.response) {
            console.error("Error in getting all general services:", {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers,
            });
        } else {
            console.error("Error in getting all general services:", error.message);
        }
        throw error;  
    }
};


export const getAllRoadService = async () => {
    try {
        const response = await axiosInstance.get(`${URL}/api/admin/services/get-all-road-service`);
        return response.data; 
    } catch (error: any) {
        
        if (error.response) {
            console.error("Error in getting all road services:", {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers,
            });
        } else {
            console.error("Error in getting all road services:", error.message);
        }
        throw error;  
    }
};

export const deleteService = async(id:string) => {
      try {
           const response = await axiosInstance.delete(`${URL}/api/admin/services/remove-service?id=${id}`)
           return response.data
           
      } catch (error) {
           console.log("Error in deleteing services: ", error)
           throw error
      }
}

export const addSubService = async(id:string, subService:string) => {
        try {
             const response = await axiosInstance.post(`${URL}/api/admin/services/add-subservice`, {id, subService})
             console.log("This is the response addSubServic: ", response.data)
             return response.data

            
        } catch (error) {
             console.log("Error occure while adding subService: ", error);
             throw error
            
        }
}



