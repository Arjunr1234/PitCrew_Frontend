import { Routes, Route } from 'react-router-dom';
import ProviderSignup from '../pages/provider/auth/ProviderSignup';
import ProviderOtp from '../pages/provider/auth/ProviderOtp';
import AddAddress from '../pages/provider/auth/AddAddress';
import ProviderLogin from '../pages/provider/auth/ProviderLogin';
import ProviderHome from '../pages/provider/ProivderHome';
import ProviderLayout from '../components/provider/ProviderLayout';


function ProviderRoute() {
  return (
     <div>
         <Routes>
             <Route path={'/register'} element={<ProviderSignup/>}/>
             <Route path={'/otp'} element={<ProviderOtp/>}/>
             <Route path={'/login'} element={<ProviderLogin/>}/>
             <Route path={'/addaddress'} element={<AddAddress/>}/>
             {/* <Route path={'/provider-home'} element={<ProviderHome/>}/> */}
             <Route  element={<ProviderLayout/>}>
                <Route path='dashboard' element={<ProviderHome/>}/>

             </Route>
         </Routes>
    </div>
  )
}

export default ProviderRoute
