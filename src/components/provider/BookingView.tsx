import React, { useEffect, useState } from 'react'
import { FaCommentAlt, FaPhoneAlt } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom'

function BookingView() {

       const location = useLocation();
       const navigate = useNavigate()
       const booking = location?.state?.bookingData;
       const [bookingDetails, setBookingDetails] = useState<any>()

       useEffect(() => {
         setBookingDetails(booking)
         console.log("This is bookingdetails: ", bookingDetails)
       },[booking])
  return (
    <div className='p-2 h-auto'>
       <div className="bg-gray-200 rounded-lg w-full h-full flex flex-col shadow-lg relative">
       <div className="flex flex-row p-2 items-center justify-between">
            <button
              className="p-3 rounded-lg bg-blue-400"
              onClick={() => navigate('/provider/bookings/bookings-list')}
            >
              Back
            </button>

            <h1 className="text-3xl font-atma">
              {bookingDetails?.userData?.name || 'No Name'}
            </h1>

            <div className="flex flex-row gap-4">
              <button
                className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300"
                title="Call"
              >
                <FaPhoneAlt size={20} />
              </button>
              <button
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300"
                title="Chat"
                onClick={() => navigate('/provider/bookings/provider-chat',{state:{userData:booking.userData}})}
              >
                <FaCommentAlt size={20} />
              </button>
            </div>
          </div>

          <div className='h-48 bg-slate-400'>
             this is the body section
          </div>


          <div className='h-48 bg-slate-600'>
            this is bill details section
          </div>
       </div>
    </div>
  )
}

export default BookingView
