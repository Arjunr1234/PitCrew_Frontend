import React, { useEffect, useState } from 'react'
import { FaCar, FaChevronDown, FaChevronUp, FaCircle, FaCommentAlt, FaEnvelope, FaGasPump, FaIdCard, FaMotorcycle, FaPhoneAlt, FaRoad, FaUser } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom'
import { changeBookingStatus } from '../../services/provider/providerService';
import { toast } from 'sonner';

function BookingView() {

  const location = useLocation();
  const navigate = useNavigate()
  const booking = location?.state?.bookingData;
  const [bookingDetails, setBookingDetails] = useState<any>();
  const [isUserDetailsVisble, setIsUserDetailsVisible] = useState(false);
  const [isVehicleDetailsVisible, setIsVehicleDetailsVisible] = useState(false)
  const [currentStatus, setCurrentStatus] = useState("");
  const statusOptions = ["pending", "work progress", "ready for delivery", "delayed"];



  useEffect(() => {
    if (booking) {
      setBookingDetails(booking);
      setCurrentStatus(booking.status || "NA");
      console.log("This is booking details: ", booking);
    }
  }, [booking]);


  const toggleUserDetails = () => {
    setIsUserDetailsVisible(!isUserDetailsVisble)
  }

  const toggleVehicleDetails = () => {
    setIsVehicleDetailsVisible(!isVehicleDetailsVisible)
  }

  const handleChangeStatus = async (e: React.ChangeEvent<HTMLSelectElement>) => {
     console.log("Status; ",e.target.value)
    try {
      const status = e.target.value
      const response = await changeBookingStatus(booking._id, status);
      console.log("This si booking_id and bookingStatus: ", booking._id, booking.status)
      if (response.success) {
        setCurrentStatus(status);
        toast.success("Updated successfully!!")
      }
      console.log("Status updated to:", e.target.value);

    } catch (error) {
      console.log("Error in changeStatus: ", error)

    }

  };
  return (
    <div className='p-2 h-full'>
      <div className="bg-gray-200 rounded-lg w-full h-full flex gap-y-2 flex-col shadow-lg relative">
        <div className="flex flex-row p-2 items-center pb-5 justify-between">
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
              onClick={() => navigate('/provider/bookings/provider-chat', { state: { bookingData: booking } })}
            >
              <FaCommentAlt size={20} />
            </button>
          </div>
        </div>

        {/* status section */}

        <div className="flex flex-row justify-around items-center p-4 bg-gray-200 border  rounded-md">
          {/* Current Status */}
          <div className="flex items-center">
            <h1 className="text-xl font-semibold mr-2">Status:</h1>
            <h1 className="text-xl font-semibold text-orange-300">{currentStatus}</h1>
          </div>

          {/* Dropdown for Status Change */}
          <div className="flex items-center">
            <h1 className="mr-2 text-black font-semibold">Change Status:</h1>
            <select
              value={currentStatus}
              onChange={handleChangeStatus}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-row gap-y-2 px-4 mt-5">
          <div className={`flex-1 bg-blue-100 p-4 rounded-lg shadow-lg ${!isUserDetailsVisble? 'bg-blue-400 text-white':""}`}>
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={toggleUserDetails}
            >
              <h2 className="text-lg font-semibold">User Details</h2>
              {isUserDetailsVisble ? (
                <FaChevronUp className="text-gray-500" />
              ) : (
                <FaChevronDown className="text-white" />
              )}
            </div>
            {isUserDetailsVisble && (
              <div className="mt-3">
                <div className="flex items-center mb-2">
                  <FaUser className="text-gray-500 mr-2" />
                  <span className="font-semibold text-sm">Name:</span>
                  <span className="text-sm ml-2">
                    {bookingDetails?.userData?.name || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center mb-2">
                  <FaPhoneAlt className="text-gray-500 mr-2" />
                  <span className="font-semibold text-sm">Phone:</span>
                  <span className="text-sm ml-2">
                    {bookingDetails?.userData?.phone || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center mb-2">
                  <FaEnvelope className="text-gray-500 mr-2" />
                  <span className="font-semibold text-sm">Email:</span>
                  <span className="text-sm ml-2">
                    {bookingDetails?.userData?.email || 'N/A'}
                  </span>
                </div>

              </div>
            )}
          </div>
        </div>

        {/* vehicle Details */}

        <div className="flex flex-row gap-1 px-4 py-2">
          <div className={`flex-1 bg-blue-100 p-4 rounded-lg shadow-lg ${!isVehicleDetailsVisible? 'bg-blue-400 text-white':""}`}>
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={toggleVehicleDetails}
            >
              <h2 className="text-lg font-semibold">Vehicle Details</h2>
              {isVehicleDetailsVisible ? (
                <FaChevronUp className="text-gray-500" />
              ) : (
                <FaChevronDown className="text-white" />
              )}
            </div>
            {isVehicleDetailsVisible && (
              <div className="mt-3">
                <div className="flex items-center mb-2">
                  <FaIdCard className="text-gray-500 mr-2" />
                  <span className="font-semibold text-sm">Vehicle Number:</span>
                  <span className="text-sm ml-2">
                    {bookingDetails?.vehicleDetails?.number || 'number'}
                  </span>
                </div>
                <div className="flex items-center mb-2">
                  <FaCircle className="text-gray-500 mr-2" />
                  <span className="font-semibold text-sm">Vehicle Model:</span>
                  <span className="text-sm ml-2">
                    {bookingDetails?.vehicleDetails?.model || 'model'}
                  </span>
                </div>
                <div className="flex items-center mb-2">
                  <FaCar className="text-gray-500 mr-2" />
                  <span className="font-semibold text-sm">Vehicle Brand:</span>
                  <span className="text-sm ml-2">
                    {bookingDetails?.vehicleDetails?.brand || 'brand'}
                  </span>
                </div>
                <div className="flex items-center mb-2">
                  <FaRoad className="text-gray-500 mr-2" />
                  <span className="font-semibold text-sm">Kilometer run:</span>
                  <span className="text-sm ml-2">
                    {bookingDetails?.vehicleDetails?.kilometersRun || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center mb-2">
                  <FaGasPump className="text-gray-500 mr-2" />
                  <span className="font-semibold text-sm">Fuel Type:</span>
                  <span className="text-sm ml-2">
                    {bookingDetails?.vehicleDetails?.fuelType === "petrol" ? "Petrol" : "Diesel"}
                  </span>
                </div>
                <div className="flex items-center">
                  <FaMotorcycle className="text-gray-500 mr-2" />
                  <span className="font-semibold text-sm">Vehicle Type: </span>
                  <span className="text-sm ml-2">
                    {bookingDetails?.vehicleDetails?.vehicleType === "twoWheeler" ? "Two Wheller" : "Four Wheller"}
                  </span>
                </div>

              </div>
            )}
          </div>
        </div>

        {/* price Details */}

        <div className=" p-4 bg-gray-50 rounded-lg shadow-md">
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-customGrey text-white">
                <th className="border border-customGrey px-6 py-3 text-left font-semibold uppercase">
                  Service Type
                </th>
                <th className="border border-customGrey px-6 py-3 text-right font-semibold uppercase">
                  Starting Price (₹)
                </th>
              </tr>
            </thead>
            <tbody>
              {bookingDetails?.selectedSubServices.map((service: any, index: number) => (
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
                  {bookingDetails?.selectedSubServices.reduce(
                    (total: any, service: any) => total + parseFloat(service.startingPrice),
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
                  ₹{bookingDetails?.platformFee}
                </td>
              </tr>
              {/* Grand Total Row */}
              <tr className="bg-customGrey text-white font-bold">
                <td className=" px-6 py-3 text-right">
                  Grand Total
                </td>
                <td className=" px-6 py-3 text-right">
                  ₹{bookingDetails?.subTotal}
                </td>
              </tr>
            </tbody>
          </table>
        </div>


      </div>
    </div>
  )
}

export default BookingView
