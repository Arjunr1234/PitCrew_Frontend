import { useEffect, useState } from "react";
import { MdBook, MdCancel, MdAddCircle } from "react-icons/md";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";

function BookingComp() {

        const location = useLocation();
        const navigate = useNavigate()
        const [activeLink, setActiveLink] = useState('');


        useEffect(() => {
            if(location.pathname === '/provider/bookings'){
               navigate('/provider/bookings/bookings-list')
            }
            if(location.pathname.includes('bookings-list')){
               setActiveLink('bookings-list');
            }
            if(location.pathname.includes('cancelled-bookings')){
               setActiveLink('cancelled-bookings');
            }
            if(location.pathname.includes('add-slot')){
               setActiveLink('add-slot');
            }
        },[location.pathname, navigate])
  return (
    <>
      <div className="flex flex-col h-screen ">
      <div className="bg-gray-200 p-4 flex flex-row items-center justify-around h-[15%] rounded-md text-white gap-4">
        {/* Bookings Tab */}
        <Link to={'/provider/bookings/bookings-list'}>
          <div className={`flex-1   bg-gray-500 rounded-lg p-4  cursor-pointer transition-all duration-200 shadow-md flex items-center justify-center gap-2   ${activeLink === 'bookings-list' ? 'bg-green-400  ':'hover:ring-4 hover:ring-violet-500'}`}>
           <MdBook size={24} />
           <h1 className="text-center font-semibold">Bookings</h1>
          </div>
        </Link>
        

        {/* Cancelled Bookings Tab */}
        <Link to={'/provider/bookings/cancelled-bookings'}>
           <div className={`flex-1   bg-gray-500 rounded-lg p-4  cursor-pointer transition-all duration-200 shadow-md flex items-center justify-center gap-2  ${activeLink === 'cancelled-bookings' ? 'bg-green-400    ':'hover:ring-4 hover:ring-violet-500'}`}>
           <MdCancel size={24} />
           <h1 className="text-center font-semibold">Cancelled Bookings</h1>
           </div>
        </Link>
        

        {/* Add Slot Tab */}
        <Link to={'/provider/bookings/add-slot'}>
           <div className={`flex-1   bg-gray-500 rounded-lg p-4  cursor-pointer transition-all duration-200 shadow-md flex items-center justify-center gap-2  ${activeLink === 'add-slot' ? 'bg-green-400 ':'hover:ring-4 hover:ring-violet-500'}`}>
           <MdAddCircle size={24} />
           <h1 className="text-center font-semibold">Booking Slot</h1>
           </div>
        </Link>
        
      </div>

      <div className="flex-1 bg-gray-100 p-4">
        <Outlet/>
      </div>
    </div>
      
    </>
  );
}

export default BookingComp;
