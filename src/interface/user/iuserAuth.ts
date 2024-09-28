export interface IuserInitialState {
  userInfo: userInfo | null
  isLoggedIn: boolean,
  isLoading: boolean,
  error: string | null
  message: string
  success: null | boolean
}

export interface userInfo {
  id: string,
  name: string,
  email: string,
  mobile: string,
  blocked: boolean
}

export interface SigninData{
  email:string,
  password:string
}

export interface UserResponse {
  message: string,
  success: boolean,
  user?:{
    id:string,
    name:string,
    email:string,
    mobile:string,
    blocked:boolean
  }
  
}

export interface logoutResponse{
  success:boolean,
  message:string
}


export interface Iusersignup {
  name: string,
  email: string,
  mobile: string,
  password: string

}


