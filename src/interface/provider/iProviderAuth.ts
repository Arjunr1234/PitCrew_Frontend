import { Provider } from "react-redux"


export interface ProviderInitialState {
  providerInfo: ProviderInfo | null
  isLoading: boolean,
  error: boolean,
  errorMessage: string | null
  message: string | null
  success: null | boolean
}
export interface ProviderInfo {
  id: string,
  ownername: string
  workshopname: string,
  email: string,
  mobile: string,
  requested: boolean,
  blocked: boolean
}

export interface LoginData{
  email:string,
  password:string,
}

export interface ProviderLoginResponse{
     message:string,
     success:false,
     provider:{
       _id:string,
       ownerName:string,
       workshopName:string,
       email:string,
       mobile:string,
       requested:boolean,
       workshopDetails:IworkshopDetails
       blocked:boolean
     }
}

interface IworkshopDetails{
  address:string,
  coordinates:{
    lat:number,
    long:number
  }
}

export interface workshopDetails {
  address: string,
  coordinates: {
    lat: number, 
    long: number
  }
}


export interface SignupData {
  workshopName: string,
  ownerName: string,
  mobile: string,
  email: string,
  password: string,
  workshopDetails: workshopDetails
}

export interface ProviderSignupResponse{
    success:boolean,
    message:string
}