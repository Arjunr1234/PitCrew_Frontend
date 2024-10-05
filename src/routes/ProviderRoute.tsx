import { Routes, Route } from 'react-router-dom';
import ProviderSignup from '../pages/provider/auth/ProviderSignup';
import ProviderOtp from '../pages/provider/auth/ProviderOtp';
import AddAddress from '../pages/provider/auth/AddAddress';
import ProviderLogin from '../pages/provider/auth/ProviderLogin';
import ProviderHome from '../pages/provider/ProivderHome';


function ProviderRoute() {
  return (
     <div>
         <Routes>
             <Route path={'/register'} element={<ProviderSignup/>}/>
             <Route path={'/otp'} element={<ProviderOtp/>}/>
             <Route path={'/login'} element={<ProviderLogin/>}/>
             <Route path={'/add-address'} element={<AddAddress/>}/>
             <Route path={'/provider-home'} element={<ProviderHome/>}/>
         </Routes>
    </div>
  )
}

export default ProviderRoute
