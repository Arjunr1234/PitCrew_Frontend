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
