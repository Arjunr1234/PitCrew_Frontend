import axios from "axios";
import { ILoginData } from "../../interface/admin/iAdminAuth";
import { URL } from "../../utils/api";


export const AdminLoginApi = async (logData:ILoginData) => {
     
         try {

          const response = await axios.post(URL + '/api/admin/auth/login', logData);
          if(response.data.success){
            localStorage.setItem('isAdmin',JSON.stringify({isAdmin:true}))
          }

          return response.data
          
         } catch (error:any) {
             console.log(error)
             throw error
          
         }
}

export const adminLogoutApi = async () => {
    try {
       const response = await axios.get(URL + '/api/admin/auth/logout')
       return response.data
      
    } catch (error:any) {
        console.log(error)
        throw error
      
    }
}