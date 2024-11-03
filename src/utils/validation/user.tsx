import { toast } from "sonner"




export const validationInputData = (vehicleNumber: string, vehicleModel: string, kilometers: number, vehicleType: string,
  fuelType: string, vehicleBrand: { id: string, brandName: string } | null, location:{place_name:string,coordinates:[number, number]} | undefined) => {
  if (!vehicleNumber) {
    toast.error("Please add vehicle number")
    return
  }
  if (!vehicleModel) {
    toast.error("Please Vehicle Model")
    return
  }
  if (!vehicleType) {
    toast.error('Please add vehicle type')
    return
  }
  if (!kilometers) {
    toast.error("Please add Kilometers travelled")
    return
  }
  if (!vehicleBrand) {
    toast.error("Please Select Vehicle Brand!!")
  }
  if(!fuelType){
    toast.error("Please add Fuel Type!!")
    return
  }
  console.log("location: ", location)
  if(!location){
    toast.error("Please add Location!!")
  }

}