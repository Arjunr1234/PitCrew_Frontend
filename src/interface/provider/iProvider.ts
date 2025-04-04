export interface IServices{
  id:string,
  category:string,
  serviceType:string,
  isAdded:boolean
  imageUrl:string,
  

  subTypes:string[]
}

interface SubType {
  isAdded: boolean|undefined;
  type: string;
  priceRange?:string|undefined;
  _id: string;
}

 export interface IGeneralService {
  category: string;
  image: string;
  isAdded: boolean;
  subType: SubType[];
  typeid: string ;
  typename: string;
}

export interface IRoadService {
  category: string;
  image: string;
  isAdded: boolean;
  typeid: string;
  typename: string;
}

export interface IAddBrandData {
  brandId:string;
  providerId:string;
  brandName:string;
}

export  interface IServiceData{
  serviceId:string,
  category:string,
  providerId:string,
  vehicleType:string
}

export interface IAddSubServiceData{
  providerId:string,
  serviceId:string,
  newSubType:{type:string,startingPrice:number,vehicleType:string}
}

// remove subService

export interface IRemoveSubServiceData{
  providerId:string,
  serviceId:string,
  subServiceId:string,
  vehicleType:string
}

// providerProfile

export interface IProviderProfileData {
  workshopName: string;
  ownerName: string;
  phone: string;
  about: string;
  providerId: string;
}

// userDetails for chat 

export interface IUserDataChat {
  _id: string;
  name: string;
  phone: string;
  email: string;
  imageUrl: string;
}

// provider call

export type CallingState = 
| "calling" 
| "connected" 
| "callEnded" 
| "disconnected" 
| "failed To Connect" 
| "Rejected" 
| "trying To connect";