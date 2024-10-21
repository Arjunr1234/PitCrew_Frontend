import { Routes, Route } from 'react-router-dom';
import ProviderSignup from '../pages/provider/auth/ProviderSignup';
import ProviderOtp from '../pages/provider/auth/ProviderOtp';
import AddAddress from '../pages/provider/auth/AddAddress';
import ProviderLogin from '../pages/provider/auth/ProviderLogin';
import ProviderHome from '../pages/provider/ProivderHome';
import ProviderLayout from '../components/provider/ProviderLayout';
import ProviderProfile from '../pages/provider/providerProfile';
import ProviderBooking from '../pages/provider/ProviderBooking';
import ProviderService from '../pages/provider/ProviderService';
import ProviderAddService from '../pages/provider/ProviderAddService';
import TwoWheelerAddService from '../components/provider/TwoWheelerAddService';
import FourWheelerAddService from '../components/provider/FourWheelerAddService';
import AddBrands from '../components/provider/AddBrands';


function ProviderRoute() {
  return (
     <div>
         <Routes>
             <Route path={'/register'} element={<ProviderSignup/>}/>
             <Route path={'/otp'} element={<ProviderOtp/>}/>
             <Route path={'/login'} element={<ProviderLogin/>}/>
             <Route path={'/addaddress'} element={<AddAddress/>}/>
            
             <Route  element={<ProviderLayout/>}>
                <Route path='dashboard' element={<ProviderHome/>}/>
                <Route path='profile' element={<ProviderProfile/>}/>
                <Route path='bookings' element={<ProviderBooking/>}/>
                <Route path='services' element={<ProviderService/>}/>
                <Route path='add-service' element={<ProviderAddService/>}/>
                <Route path='add-service/two-wheeler-services' element={<TwoWheelerAddService/>}/>
                <Route path='add-service/four-wheeler-services' element={<FourWheelerAddService/>}/>
                <Route path='add-service/add-brands' element={<AddBrands/>}/>
             </Route>
         </Routes>
    </div>
  )
}

export default ProviderRoute
