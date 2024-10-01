import { Routes, Route } from 'react-router-dom';
import ProviderSignup from '../pages/provider/auth/ProviderSignup';
import ProviderOtp from '../pages/provider/auth/ProviderOtp';


function ProviderRoute() {
  return (
     <div>
         <Routes>
             <Route path={'/register'} element={<ProviderSignup/>}/>
             <Route path={'/otp'} element={<ProviderOtp/>}/>
             <Route path={'/add-address'}/>
             <Route path={'/login'} />
         </Routes>
    </div>
  )
}

export default ProviderRoute
