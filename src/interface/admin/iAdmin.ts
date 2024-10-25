export interface IService {
  _id: string;
  category: string;
  serviceTypes: string;
  imageUrl: string;
  subTypes: {type:string, _id:string}[];
}