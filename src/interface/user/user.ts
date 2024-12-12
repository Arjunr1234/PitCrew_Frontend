export interface IworkshopDetails{
  id:string,
  workshopName:string,
  ownerName:string,
  email:string,
  mobile:string,
  address:string,
  distance:number,
  coordinates:[number, number]

}


interface Location {
  type: string;
  coordinates: [number, number]; 
}


interface WorkshopDetails {
  address: string;
  location: Location;
}


interface ProviderDetails {
  _id: string;
  workshopName: string;
  ownerName: string;
  email: string;
  mobile: string;
  workshopDetails: WorkshopDetails;
  logoUrl: string;
  about: string;
}


interface ServiceSubType {
  type: string;
  startingPrice: number;
  _id: string;
  isAdded: boolean;
}


interface Services {
  typeId: string;
  category: string;
  subType: ServiceSubType[];
  _id: string;
}


export interface IProviderData {
  _id: string;
  workshopId: string;
  providerDetails: ProviderDetails;
  services: Services;
}

// This is

export interface IServiceSubType {
  type: string;
  startingPrice: number;
  _id: string;
  isAdded: boolean;
}

//Booking - payment

interface VehicleBrand {
  brandName: string;
  id: string;
}


interface VehicleDetails {
  fuelType: 'Petrol' | 'Diesel'; 
  kilometers: number;
  vehicleModel: string;
  vehicleNumber: string;
  vehicleType: 'twoWheeler' | 'fourWheeler'; 
  vehicleBrand: VehicleBrand;
}


interface LocationDetails {
  place_name: string;
  coordinates: [number, number];
}


export interface BookingData {
  providerId: string;
  userId: string;
  userPhone: string;
  serviceId: string;
  serviceName: string;
  totalPrice: number;
  vehicleDetails: VehicleDetails;
  location: LocationDetails;
}

//This is the details of editProfileData

export interface IProfileEditData{
  name:string,
  phone:string
}

// Booking Comp

export interface IBookingDetails {
  _id: string;
  serviceType: string;
  userId: string;
  providerId: string;
  slotId: string;
  serviceId: string;
  vehicleDetails: {
    number: string;
    model: string;
    brand: string;
    kilometersRun: number;
    fuelType: string;
    vehicleType: string;
  };
  location: {
    address: string;
    coordinates: [number, number];
  };
  userPhone: string;
  bookingDate: string;
  amount: number;
  platformFee: number;
  subTotal: number;
  paymentId: string;
  reason: string;
  paymentStatus: string;
  status: string;
  reviewAdded?:boolean;
  rating?:{
    rating: number ;
    feedback: string ;
};
  selectedSubServices: {
    type: string;
    startingPrice: string;
    _id: string;
    isAdded: boolean;
  }[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  serviceName: string;
  providerDetails:IProviderDetails
}
export interface IProviderDetails {
  _id: string;
  workshopName: string;
  ownerName: string;
  workshopDetails: any;
  email: string;
  mobile: string;
  logUrl:string;
}

// userChat section

export interface ChatMessage {
  sender: string; 
  message: string;
  type: "text" ;
  delete: boolean;
  seen:boolean,
  createdAt: string;
  updatedAt: string;
}
//reivew and rating

export interface IReviewData{
    userId:string,
    providerId:string,
    serviceId:string,
    bookingId:string,
    rating:number,
    feedback:string
}

// notification

// Interface for a single notification item
interface NotificationItem {
  content: string;
  type: string;
  bookingId: string;
  read: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
}


export interface Notification {
  _id: string;
  receiverId: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
  notifications: NotificationItem[];
}






