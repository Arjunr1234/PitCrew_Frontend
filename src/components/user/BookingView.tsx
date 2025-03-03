import  { useEffect, useLayoutEffect, useState } from 'react';
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaCar,
  FaGasPump,
  FaPhoneAlt,
  FaCommentDots,
  FaChevronDown,
  FaChevronUp,
  FaUser,
  FaMotorcycle, FaRoad, FaIdCard, FaCircle,
} from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { IBookingDetails, IReviewData } from '../../interface/user/user';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { changeBookingStatus, fetchSingleBookingService } from '../../services/provider/providerService';
import { addRatingService } from '../../services/user/user';
import { useSocket } from '../../Context/SocketIO';




function BookingView() {
  const [selectedBooking, setSelectedBooking] = useState<IBookingDetails | null>(null);
  const [isProviderDetailsVisible, setIsProviderDetailsVisible] = useState(false);
  const [isVehicleDetailsVisible, setIsVehicleDetailsVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const booking: IBookingDetails = location?.state?.booking;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [isReivewAdded, setIsReviewAdded] = useState<boolean>();

  const {socket} = useSocket();
  const details = {
    _id:selectedBooking?._id,
    userId:selectedBooking?.userId,
    providerId:selectedBooking?.providerId, 
    providerDetails:selectedBooking?.providerDetails, 
    userData:selectedBooking?.userData
 }


  // useEffect(() => {
  //    console.log("This is booking syndrome: ", booking);
  //    console.log("This is selected booking syndrome: ", selectedBooking)
  // },[selectedBooking]);


  useEffect(() => {
    if(location.state.navigateToChat && selectedBooking){

      navigate('/user-profile/user-chat', { state: { bookingDetails:details } })

    }
   
  },[selectedBooking])

  useLayoutEffect(() => {
    if (booking._id) {
      
      const fetchBooking = async () => {
        try {
          const response = await fetchSingleBookingService(booking._id)
          if (response.success) {
            
            setSelectedBooking(response.bookingData)

          }

        } catch (error: any) {
          console.log("Error in fetchBooking: ", error);
          toast.error(error.response.data.message)

        }
      }
      fetchBooking()
      
    } else {
      toast.error('No booking');
    }
  }, [booking,isReivewAdded]);

  const toggleProviderDetails = () => {
    setIsProviderDetailsVisible(!isProviderDetailsVisible);
  };

  const toggleVehicleDetails = () => {
    setIsVehicleDetailsVisible(!isVehicleDetailsVisible);
  };

  const handleAcceptVehicle = async (bookingId: string) => {
    try {

      const response = await changeBookingStatus(bookingId, 'Delivered');
      if (response.success) {
        toast.success('Delivered Successfully');
        setSelectedBooking((prev) =>
          prev
            ? {
              ...prev,
              status: 'Delivered',
            }
            : null
        );
      }

    } catch (error) { 
      console.log("Error in handleAcceptVehicle: ", error);
      throw error

    }
  }

  const confimAccept = (bookingId: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'By accepting, you confirm that you have received the vehicle',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Confirm',
    }).then((result) => {
      if (result.isConfirmed) {
        handleAcceptVehicle(bookingId);
      }
    });

  }


  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  // const handleFeedbackChange = (e: any) => {
  //   setFeedback(e.target.value);
  // };


  const handleSubmitFeedback = async () => {

    console.log('Feedback submitted:', feedback);
    console.log('Rating:', rating);
    const data: IReviewData = {
      userId: selectedBooking?.userId || '',
      bookingId: selectedBooking?._id || '',
      providerId: selectedBooking?.providerId || '',
      serviceId: selectedBooking?.serviceId || '',
      rating: rating,
      feedback: feedback
    }
    const response = await addRatingService(data)
    if (response.success) {
      toast.success(response.message);
      setIsReviewAdded(true)
    }


    setFeedback('')
    setRating(1)
    handleCloseModal();
  };

  const handleOpenRatingModal = () => {
    setIsModalOpen(true)
  }
  

  const handleStarClick = (rating: number) => {
    setRating(rating);
  };

  

  const handleCallButtonClick = () => {
    
    socket?.emit("checkPersonIsOnline", {userId:selectedBooking?.userId, providerId:selectedBooking?.providerId, caller:'user'})
 
};

  useEffect(() => {
       if(socket){
        socket?.on("isPersonIsOnline",(response) => {
        if(!response.success){
          toast.warning("Provider is in Offline")
        }else{ 
          if(selectedBooking){
            navigate(`/voice-call/${selectedBooking?.providerId}`);
          }       
          
        }
     });
       }
       return()=> {
          socket?.off("isPersonIsOnline");
       }
  },[socket, selectedBooking])
  
  


 


  return (
    <div>
      <div className="fixed inset-0 flex items-center justify-center z-50 rounded-xl">
        <div className=" overflow-x-auto bg-gray-200 rounded-lg w-full h-full flex flex-col shadow-lg relative">
          <div className="flex flex-row p-2 items-center justify-between">
            <button
              className="p-3 rounded-lg bg-blue-400"
              onClick={() => navigate('/user-profile/booking-details')}
            >
              Back
            </button>

            <h1 className="text-3xl font-atma">
              {selectedBooking?.providerDetails?.workshopName || 'No Name'}
              
            </h1>

            <div className="flex flex-row gap-4">
              <button
               // className="p-2 bg-gray-200 text-gray-200 rounded-full  transition duration-300"
               className="p-2 bg-green-500 text-white-200 rounded-full hover:bg-green-600 transition duration-300"

                title="Call"
                onClick={handleCallButtonClick}
              >
                <FaPhoneAlt size={20} />
              </button>

              

              <button
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300"
                title="Chat"
                //onClick={() => navigate('/user-profile/user-chat', { state: { providerDetails: booking.providerDetails, bookingDetails: booking || null } })}
                onClick={() => navigate('/user-profile/user-chat', { state: { providerDetails: booking.providerDetails, bookingDetails: details  } })}
              >
                <FaCommentDots size={20} />
              </button>
            </div>
          </div>

          <div className='flex  items-center p-5 justify-around'>
            <div>
              <h1 className="text-xl font-semibold text-center p-5">
                Status:
                <span
                  className={`px-4 py-3 text-center font-semibold ${selectedBooking?.status === 'Delivered'
                    ? 'text-green-500'
                    : selectedBooking?.status === 'pending'
                      ? 'text-yellow-500'
                      : 'text-red-500'
                    }`}
                >
                  {selectedBooking?.status || 'Unknown'}
                </span>
              </h1>
            </div>

            {selectedBooking?.status === 'ready for delivery' ? (
              <div className="flex items-center flex-col justify-center">
                <button className="p-3 px-7 bg-green-400 text-white font-semibold rounded-lg shadow-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-300"
                  onClick={() => confimAccept(selectedBooking._id)}>
                  Accept
                </button>
                <p className='text-orange-400 text-sm animate-pulse animate-infinite'>Please Accept request to receive the vehicle</p>
              </div>
            ) : ''}

            {
              (selectedBooking?.status === 'Delivered' && !selectedBooking.reviewAdded ) ? (
                <div
                  onClick={handleOpenRatingModal}>
                  <button className='p-2 bg-blue-300 rounded-lg'>Add Review</button>
                </div>
              ) : ''
            }

            {selectedBooking?.reviewAdded ? (
              <div className="flex items-center mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-7 h-7 ms-1 cursor-pointer ${star <= (selectedBooking.rating?.rating ?? 1) ? "text-yellow-600" : "text-gray-300"
                      }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                    aria-hidden="true"
                  >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                ))}
              </div>
            ) : (
              ''
            )}

            {/* Modal Section */}


            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-lg p-6 md:p-8 w-full max-w-2xl shadow-lg h-auto  relative">
                  <h1 className="font-bold text-2xl">
                    {"Write a Review"}
                  </h1>
                  <h1 className="font-medium mt-3">Select Your Rating</h1>

                  {/* Star Rating System */}
                  <div className="text-yellow-600 text-lg">
                    <div className="flex items-center mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          onClick={() => handleStarClick(star)}
                          className={`w-7 h-7 ms-1 cursor-pointer ${star <= rating ? "text-yellow-600" : "text-gray-300"
                            }`}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 22 20"
                          aria-hidden="true"
                        >
                          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                        </svg>
                      ))}
                    </div>
                  </div>

                  {/* Review Comment Textarea */}
                  <div className="mt-3">
                    <textarea
                      onChange={(e) => setFeedback(e.target.value)}
                      className="w-full border rounded-md p-2 text-gray-700 focus:outline-none ring-2 focus:ring-blue-500"
                      placeholder="Write your review here..."
                      rows={6}
                      value={feedback}
                    />
                  </div>

                  {/* Modal Buttons */}
                  <div className="flex justify-end gap-4 mt-4">
                    <button
                      className="bg-red-500 px-3 py-2 rounded-md text-white"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Close
                    </button>

                    {/* Submit or Edit Review */}

                    <button
                      onClick={handleSubmitFeedback}
                      className="bg-blue-500 px-3 py-2 rounded-md text-white"
                    >
                      Submit
                    </button>

                  </div>
                </div>
              </div>
            )}

          </div>




          {/* Provider Details Section */}
          <div className="flex flex-row gap-y-2 px-4">
            <div className="flex-1 bg-blue-100 p-4 rounded-lg shadow-lg">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={toggleProviderDetails}
              >
                <h2 className="text-lg font-semibold">Provider Details</h2>
                {isProviderDetailsVisible ? (
                  <FaChevronUp className="text-gray-500" />
                ) : (
                  <FaChevronDown className="text-gray-500" />
                )}
              </div>
              {isProviderDetailsVisible && (
                <div className="mt-3">
                  <div className="flex items-center mb-2">
                    <FaUser className="text-gray-500 mr-2" />
                    <span className="font-semibold text-sm">Owner:</span>
                    <span className="text-sm ml-2">
                      {selectedBooking?.providerDetails?.ownerName || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    <FaPhoneAlt className="text-gray-500 mr-2" />
                    <span className="font-semibold text-sm">Phone:</span>
                    <span className="text-sm ml-2">
                      {selectedBooking?.providerDetails?.mobile || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    <FaEnvelope className="text-gray-500 mr-2" />
                    <span className="font-semibold text-sm">Email:</span>
                    <span className="text-sm ml-2">
                      {selectedBooking?.providerDetails?.email || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-gray-500 mr-2" />
                    <span className="font-semibold text-sm">Location:</span>
                    <span className="text-sm ml-2">
                      {selectedBooking?.providerDetails?.workshopDetails?.address || 'N/A'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Vehicle Details Section */}
          <div className="flex flex-row gap-1 px-4 py-2">
            <div className="flex-1 bg-blue-100 p-4 rounded-lg shadow-lg">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={toggleVehicleDetails}
              >
                <h2 className="text-lg font-semibold">Vehicle Details</h2>
                {isVehicleDetailsVisible ? (
                  <FaChevronUp className="text-gray-500" />
                ) : (
                  <FaChevronDown className="text-gray-500" />
                )}
              </div>
              {isVehicleDetailsVisible && (
                <div className="mt-3">
                  <div className="flex items-center mb-2">
                    <FaIdCard className="text-gray-500 mr-2" />
                    <span className="font-semibold text-sm">Vehicle Number:</span>
                    <span className="text-sm ml-2">
                      {selectedBooking?.vehicleDetails?.number || 'number'}
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    <FaCircle className="text-gray-500 mr-2" />
                    <span className="font-semibold text-sm">Vehicle Model:</span>
                    <span className="text-sm ml-2">
                      {selectedBooking?.vehicleDetails?.model || 'model'}
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    <FaCar className="text-gray-500 mr-2" />
                    <span className="font-semibold text-sm">Vehicle Brand:</span>
                    <span className="text-sm ml-2">
                      {selectedBooking?.vehicleDetails?.brand || 'brand'}
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    <FaRoad className="text-gray-500 mr-2" />
                    <span className="font-semibold text-sm">Kilometer run:</span>
                    <span className="text-sm ml-2">
                      {selectedBooking?.vehicleDetails?.kilometersRun || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    <FaGasPump className="text-gray-500 mr-2" />
                    <span className="font-semibold text-sm">Fuel Type:</span>
                    <span className="text-sm ml-2">
                      {selectedBooking?.vehicleDetails?.fuelType === "petrol" ? "Petrol" : "Diesel"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaMotorcycle className="text-gray-500 mr-2" />
                    <span className="font-semibold text-sm">Vehicle Type: </span>
                    <span className="text-sm ml-2">
                      {selectedBooking?.vehicleDetails?.vehicleType === "twoWheeler" ? "Two Wheller" : "Four Wheller"}
                    </span>
                  </div>

                </div>
              )}
            </div>
          </div>

          {/* selected service section */}
          <div className=" p-4 bg-gray-50 rounded-lg shadow-md">
            <table className="table-auto w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-blue-100 text-black">
                  <th className="border border-blue-100 px-6 py-3 text-left font-semibold uppercase">
                    Service Type
                  </th>
                  <th className="border border-blue-100 px-6 py-3 text-right font-semibold uppercase">
                    Starting Price (₹)
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedBooking?.selectedSubServices.map((service, index) => (
                  <tr
                    key={service._id}
                    className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"
                      } hover:bg-blue-100 transition-colors`}
                  >
                    <td className="border border-gray-200 px-6 py-3 flex items-center gap-2">

                      {service.type}
                    </td>
                    <td className="border border-gray-200 px-6 py-3 text-right">
                      ₹{service.startingPrice}
                    </td>
                  </tr>
                ))}
                {/* Subtotal Row */}
                <tr className="bg-gray-100 ">
                  <td className="border border-gray-200 px-6 py-3 text-right">Subtotal</td>
                  <td className="border border-gray-200 px-6 py-3 text-right">
                    ₹
                    {selectedBooking?.selectedSubServices.reduce(
                      (total, service) => total + parseFloat(service.startingPrice),
                      0
                    )}
                  </td>
                </tr>
                {/* Platform Fee Row */}
                <tr className="bg-white ">
                  <td className="border border-gray-200 px-6 py-3 text-right">
                    Platform Fee
                  </td>
                  <td className="border border-gray-200 px-6 py-3 text-right">
                    ₹{selectedBooking?.platformFee}
                  </td>
                </tr>
                {/* Grand Total Row */}
                <tr className="bg-blue-100 text-black font-bold">
                  <td className="border border-blue-100 px-6 py-3 text-right">
                    Grand Total
                  </td>
                  <td className="border border-blue-100 px-6 py-3 text-right">
                    ₹{selectedBooking?.subTotal}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>




        </div>

      </div>


    </div>
  );
}

export default BookingView;

