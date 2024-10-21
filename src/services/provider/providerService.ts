import { axiosInstance } from "../../api/common";
import { URL } from "../../utils/api";







export const getAllServices = async () => {
  try {
      const response = await axiosInstance.get(URL + '/api/provider/add-service/get-all-sevices');
      return response.data;
  } catch (error) {
      console.log("Error in getAllServices: ", error);
      throw error; 
  }
}
