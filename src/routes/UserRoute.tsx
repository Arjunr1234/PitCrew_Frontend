import {Route, Routes} from 'react-router-dom'
import UserRegister from '../pages/user/auth/UserRegister'
import UserLogin from '../pages/user/auth/UserLogin'
import UserOtp from '../pages/user/auth/UserOtp'
import UserHome from '../pages/user/userHome'
import Services from '../pages/user/services'
import GeneralServices from '../pages/user/GeneralServices'
import RoadServices from '../pages/user/RoadServices'
import AddVehicleDetails from '../pages/user/AddVehicleDetails'
import ProvidersShop from '../pages/user/ProvidersShop'
import ProviderServicesView from '../pages/user/ProviderServicesView'
import ProtectedRoute from '../utils/protecteRoutes/user'
import PaymentSuccess from '../components/user/paymentSuccess'
import Profile from '../pages/user/Profile'
import ProfileDetailsComp from '../components/user/ProfileDetailsComp'
import BookingDetails from '../components/user/BookingDetails'
import PaymentFailed from '../components/user/paymentFailed'
import ChatUser from '../components/user/ChatUser'
import BookingView from '../components/user/BookingView'
import ResetPassword from '../components/user/ResetPassword'





function UserRoute() {
  return (
   <>
    <Routes>
      // public routes
         <Route path={'/register'} element={<UserRegister/>}/>
         <Route path={'/login'} element={<UserLogin/>}/>
         <Route path={'/otp'} element={<UserOtp/>}/>
         <Route path={'/'} element={<UserHome/>}/>
         <Route path={'/services'} element={<Services/>}/>
        
      // protecteRoutes
      <Route element={<ProtectedRoute/>}>   
         <Route path={'/services/general-service'} element={<GeneralServices/>}/>
         <Route path={'/services/road-service'} element={<RoadServices/>}/>
         <Route path={'/add-vehicle-details'} element= {<AddVehicleDetails/>}/>
         <Route path={'/providers-shops'} element={<ProvidersShop/>}/>
         <Route path={'/provider-service-view'} element={<ProviderServicesView/>}/>
         <Route path={'/payment-success'} element={<PaymentSuccess/>}/>
         <Route path={'/payment-cancelled'} element={<PaymentFailed/>} />
         <Route path={'/user-profile'} element={<Profile/>}>
          <Route path={'/user-profile/reset-password'} element={<ResetPassword/>} />
           <Route path={'/user-profile/user-chat'} element={<ChatUser/>}/>
           <Route path={'/user-profile/profile-details'}  element={<ProfileDetailsComp/>} />
           <Route path={'/user-profile/booking-details'} element={<BookingDetails/>}/>
           <Route path={'/user-profile/booking-view'} element={<BookingView/>}/>
         </Route>
      </Route>
   </Routes>
   
   </>
  ) 
}

export default UserRoute
