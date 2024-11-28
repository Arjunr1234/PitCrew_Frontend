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
} from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { IBookingDetails } from '../../interface/user/user';
import { toast } from 'sonner';

function BookingView() {
  const [selectedBooking, setSelectedBooking] = useState<IBookingDetails | null>(null);
  const [isProviderDetailsVisible, setIsProviderDetailsVisible] = useState(false);
  const [isVehicleDetailsVisible, setIsVehicleDetailsVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const booking:IBookingDetails = location?.state?.booking[0];

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

  return (
    <div>
      <div className="fixed inset-0 flex items-center justify-center z-50 rounded-xl">
        <div className="bg-gray-200 rounded-lg w-full h-full flex flex-col shadow-lg relative">
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
                onClick={() => navigate('/user-profile/user-chat',{state:{providerDetails:booking.providerDetails, bookingDetails:booking || null}})}
              >
                <FaCommentDots size={20} />
              </button>
            </div>
          </div>

          <div>
            <h1 className="text-xl font-semibold text-center p-5">
              Status:
              <span
                className={`px-4 py-3 text-center font-semibold ${
                  selectedBooking?.status === 'Completed'
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
                    <FaCar className="text-gray-500 mr-2" />
                    <span className="font-semibold text-sm">Vehicle:</span>
                    <span className="text-sm ml-2">
                      {selectedBooking?.vehicleDetails?.model || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    <FaGasPump className="text-gray-500 mr-2" />
                    <span className="font-semibold text-sm">Fuel Type:</span>
                    <span className="text-sm ml-2">
                      {selectedBooking?.vehicleDetails?.fuelType || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaCogs className="text-gray-500 mr-2" />
                    <span className="font-semibold text-sm">Transmission:</span>
                    <span className="text-sm ml-2">
                      {selectedBooking?.vehicleDetails?.brand || 'N/A'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingView;

