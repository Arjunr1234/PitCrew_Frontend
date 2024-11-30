import { useEffect, useState } from 'react';
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaCar,
  FaGasPump,
  FaCogs,
  FaPhoneAlt,
  FaCommentDots,
  FaChevronDown,
  FaChevronUp,
  FaUser,
  FaMotorcycle, FaRupeeSign, FaRoad, FaIdCard, FaKey, FaCircle, FaHashtag
} from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { IBookingDetails } from '../../interface/user/user';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { changeBookingStatus } from '../../services/provider/providerService';

function BookingView() {
  const [selectedBooking, setSelectedBooking] = useState<IBookingDetails | null>(null);
  const [isProviderDetailsVisible, setIsProviderDetailsVisible] = useState(false);
  const [isVehicleDetailsVisible, setIsVehicleDetailsVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const booking: IBookingDetails = location?.state?.booking[0];

  useEffect(() => {
    if (booking) {
      console.log('This is booking: ', booking);
      setSelectedBooking(booking);
    } else {
      toast.error('No booking');
    }
  }, [booking]);

  const toggleProviderDetails = () => {
    setIsProviderDetailsVisible(!isProviderDetailsVisible);
  };

  const toggleVehicleDetails = () => {
    setIsVehicleDetailsVisible(!isVehicleDetailsVisible);
  };

  const handleAcceptVehicle = async(bookingId:string) => {
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

  const confimAccept = (bookingId:string) => {
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
                className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300"
                title="Call"
              >
                <FaPhoneAlt size={20} />
              </button>
              <button
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300"
                title="Chat"
                onClick={() => navigate('/user-profile/user-chat', { state: { providerDetails: booking.providerDetails, bookingDetails: booking || null } })}
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


          </div>

         

          {/* Provider Details Section */}
          <div className="flex flex-row gap-y-2 px-4">
            <div className="flex-1 bg-green-100 p-4 rounded-lg shadow-lg">
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
                <tr className="bg-blue-500 text-white">
                  <th className="border border-blue-500 px-6 py-3 text-left font-semibold uppercase">
                    Service Type
                  </th>
                  <th className="border border-blue-500 px-6 py-3 text-right font-semibold uppercase">
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
                <tr className="bg-gray-100 font-bold">
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
                <tr className="bg-white font-bold">
                  <td className="border border-gray-200 px-6 py-3 text-right">
                    Platform Fee
                  </td>
                  <td className="border border-gray-200 px-6 py-3 text-right">
                    ₹{selectedBooking?.platformFee}
                  </td>
                </tr>
                {/* Grand Total Row */}
                <tr className="bg-blue-500 text-white font-bold">
                  <td className="border border-blue-500 px-6 py-3 text-right">
                    Grand Total
                  </td>
                  <td className="border border-blue-500 px-6 py-3 text-right">
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

