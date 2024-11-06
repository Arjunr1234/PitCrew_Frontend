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
      </Route>
   </Routes>
   
   </>
  ) 
}

export default UserRoute
