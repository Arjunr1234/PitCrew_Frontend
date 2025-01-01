import { Routes, Route } from 'react-router-dom';
import ProviderSignup from '../pages/provider/auth/ProviderSignup';
import ProviderOtp from '../pages/provider/auth/ProviderOtp';
import AddAddress from '../pages/provider/auth/AddAddress';
import ProviderLogin from '../pages/provider/auth/ProviderLogin';
import ProviderHome from '../pages/provider/ProivderHome';
import ProviderLayout from '../components/provider/ProviderLayout';
import ProviderProfile from '../pages/provider/ProviderProfile';
import ProviderBooking from '../pages/provider/ProviderBooking';
import ProviderAddService from '../pages/provider/ProviderAddService';
import TwoWheelerAddService from '../components/provider/TwoWheelerAddService';
import FourWheelerAddService from '../components/provider/FourWheelerAddService';
import AddBrands from '../components/provider/AddBrands';
import ProtectedRoute from '../utils/protecteRoutes/provider';
import BookingsComp from '../components/provider/Bookings';
import CancellBookings from '../components/provider/CancellBookings';
import AddSlot from '../components/provider/AddSlot';
import BookingView from '../components/provider/BookingView';
import Chat from '../components/provider/Chat';
import ResetPassword from '../components/provider/ResetPassword';
import { useEffect, useState } from 'react';
import { useSocket } from '../Context/SocketIO';
import ReceivingCallModal from '../components/provider/RecevingCallModal';
import Call from '../pages/provider/Call';
import NotFound from '../components/common/NotFound';



function ProviderRoute() {
      interface IincommingResponse{success:boolean | null ,callerId: string | null, receiverId: string | null, callerData?:{name?:string, image?:string}}
      const [isCallModal, setIsCallModal] = useState<boolean>(false);
      const {socket} = useSocket();
      const [incommingResponse, setIncommingResponse] = useState<IincommingResponse>({success:null,callerId:null, receiverId:null});

      useEffect(() => {
          socket?.on("incommingCall", ({success, callerId, receiverId, callerData}) => {
          setIncommingResponse({success,callerId, receiverId, callerData});
          setIsCallModal(true);
          
          

          })

          return()=> {
            socket?.off('incommingCall')
          }
      });

      const handleAccept = () => {
         console.log("Call accepted!");
       };


       const changeModalState = () => {
           setIsCallModal(false)
       }



  return (
     <div>
         <Routes>
          // public routes
             <Route path={'/register'} element={<ProviderSignup/>}/>
             <Route path={'/otp'} element={<ProviderOtp/>}/>
             <Route path={'/login'} element={<ProviderLogin/>}/>
             <Route path={'/addaddress'} element={<AddAddress/>}/>
          // protected routes
         <Route element={<ProtectedRoute/>}>  
             <Route path={'*'} element={<NotFound role='provider'/>}/> 
             <Route  element={<ProviderLayout/>}>
                <Route path='reset-password' element={<ResetPassword/>}/>
                <Route path='dashboard' element={<ProviderHome/>}/>
                <Route path='profile' element={<ProviderProfile/>}/>
                <Route path="bookings" element={<ProviderBooking />}>
                   <Route path='provider-chat' element={<Chat/>}/>
                   <Route path='booking-view' element={<BookingView/>} />
                   <Route path="bookings-list" element={<BookingsComp />} />
                   <Route path="cancelled-bookings" element={<CancellBookings />} />
                   <Route path="add-slot" element={<AddSlot />} />
                </Route>
                {/* <Route path='services' element={<ProviderService/>}/> */}
                <Route path='add-service' element={<ProviderAddService/>}/>
                <Route path='add-service/two-wheeler-services' element={<TwoWheelerAddService/>}/>
                <Route path='add-service/four-wheeler-services' element={<FourWheelerAddService/>}/>
                <Route path='add-service/add-brands' element={<AddBrands/>}/>
             </Route>
             <Route path='/voice-call/:userId' element={<Call/>}/>
        </Route>  
         </Routes>

         {isCallModal  && <ReceivingCallModal changeModal={changeModalState}   success={incommingResponse?.success}  callerId={incommingResponse?.callerId} receiverId={incommingResponse?.receiverId } callerData={incommingResponse.callerData}/>}

    </div>
  )
}

export default ProviderRoute
