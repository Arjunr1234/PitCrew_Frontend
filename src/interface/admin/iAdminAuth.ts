

export interface IAdminIntialState {
  isLoading:boolean,
  isAdmin:boolean,
  success:boolean,
  message:string | null,
  error:boolean,
  errorMessage:string | null
}

export interface ILoginData{
  email:string,
  password:string
}

export interface IAdminLoginResponse{
   success:false,
   message:string
}
