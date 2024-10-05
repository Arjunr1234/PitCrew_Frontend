import {Route, Routes} from 'react-router-dom'
import UserRegister from '../pages/user/auth/UserRegister'
import UserLogin from '../pages/user/auth/UserLogin'
import UserOtp from '../pages/user/auth/UserOtp'
import UserHome from '../pages/user/userHome'



function UserRoute() {
  return (
   <>
     <Routes>
        <Route path={'/register'} element={<UserRegister/>}/>
        <Route path={'/login'} element={<UserLogin/>}/>
        <Route path={'/otp'} element={<UserOtp/>}/>
        <Route path={'/'} element={<UserHome/>}/>
        
     </Routes>
   
   </>
  ) 
}

export default UserRoute
