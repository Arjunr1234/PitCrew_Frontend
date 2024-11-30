import { useEffect, useState } from "react";
import { FaCar, FaChevronDown, FaChevronUp, FaCircle, FaEnvelope, FaGasPump, FaIdCard, FaMapMarkedAlt, FaMotorcycle, FaPhoneAlt, FaRoad, FaUser } from "react-icons/fa";
import { useLocation } from "react-router-dom"
import { toast } from "sonner";


function BookingView() {

  const location = useLocation();
  const [bookingData, setBookingData] = useState<any>();
  const [isUserDetailsVisble, setIsUserDetailsVisible] = useState(false);
  const [isVehicleDetailsVisible, setIsVehicleDetailsVisible] = useState(false);
  const [isProviderDetailsVisible, setIsProviderDetailsVisible] = useState(false)


  useEffect(() => {
    if (location.state?.bookingDetails) {
      setBookingData(location.state.bookingDetails);
    }else{
      toast.error("Something went wrong!!")
    }
  }, [location.state]);

  const toggleUserDetails = () => {
    setIsUserDetailsVisible(!isUserDetailsVisble)
  }

  const toggleVehicleDetails = () => {
    setIsVehicleDetailsVisible(!isVehicleDetailsVisible)
  }

  const toggleProviderDetails = () => {
     setIsProviderDetailsVisible(!isProviderDetailsVisible)
  }


  return (
      <div className="h-auto  p-1 ">
         <div className="flex flex-col gap-y-3">
           {/* header section */}
           <div className="bg-customGrey rounded-xl p-4 w-[100%] border-gray-500">
             <h1 className="text-3xl font-mono text-center">{bookingData?.serviceName}</h1>
           </div>

           <div className='flex  items-center p-5 justify-around'>
            <div>
            <h1 className="text-xl font-semibold text-center p-5">
              Status:
              <span
                className={`px-4 py-3 text-center font-semibold ${bookingData?.status === 'Delivered'
                    ? 'text-green-500'
                    : bookingData?.status === 'pending'
                      ? 'text-yellow-500'
                      : 'text-red-500'
                  }`}
              >
                {bookingData?.status || 'Unknown'}
              </span>
            </h1>
            </div>

          {bookingData?.status === 'Delivered' ? (
                 <div className="text-xl">Rating: <span className="text-2xl text-green-400">4.3</span> </div>
          ) : ''}


          </div>

           {/* userDetails */}

          <div className="flex flex-row gap-y-2 px-4 mt-5">
          <div className={`flex-1 bg-blue-100 p-4 rounded-lg shadow-lg ${!isUserDetailsVisble? 'bg-violet-400 text-white':""}`}>
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
                    {bookingData?.userDetails?.name || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center mb-2">
                  <FaPhoneAlt className="text-gray-500 mr-2" />
                  <span className="font-semibold text-sm">Phone:</span>
                  <span className="text-sm ml-2">
                    {bookingData?.userDetails?.phone || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center mb-2">
                  <FaEnvelope className="text-gray-500 mr-2" />
                  <span className="font-semibold text-sm">Email:</span>
                  <span className="text-sm ml-2">
                    {bookingData?.userDetails?.email || 'N/A'}
                  </span>
                </div>

              </div>
            )}
          </div>
        </div>
         
         {/* providerDetails */}
         <div className="flex flex-row gap-y-2 px-4">
            <div className={`flex-1 bg-blue-100 p-4 rounded-lg shadow-lg ${!isProviderDetailsVisible? 'bg-violet-400 text-white':""}`}>
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={toggleProviderDetails}
              >
                <h2 className="text-lg font-semibold">Provider Details</h2>
                {isProviderDetailsVisible ? (
                  <FaChevronUp className="text-gray-500" />
                ) : (
                  <FaChevronDown className="text-white" />
                )}
              </div>
              {isProviderDetailsVisible && (
                <div className="mt-3">
                  <div className="flex items-center mb-2">
                    <FaUser className="text-gray-500 mr-2" />
                    <span className="font-semibold text-sm">Owner:</span>
                    <span className="text-sm ml-2">
                      {bookingData?.providerDetails?.ownerName || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    <FaPhoneAlt className="text-gray-500 mr-2" />
                    <span className="font-semibold text-sm">Phone:</span>
                    <span className="text-sm ml-2">
                      {bookingData?.providerDetails?.mobile || 'N/dA'}
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    <FaEnvelope className="text-gray-500 mr-2" />
                    <span className="font-semibold text-sm">Email:</span>
                    <span className="text-sm ml-2">
                      {bookingData?.providerDetails?.email || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaMapMarkedAlt className="text-gray-500 mr-2" />
                    <span className="font-semibold text-sm">Location:</span>
                    <span className="text-sm ml-2">
                      {bookingData?.providerDetails?.workshopDetails?.address || 'N/A'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* vehicle Details */}

          <div className="flex flex-row gap-1 px-4 ">
            <div className={`flex-1 bg-blue-100 p-4 rounded-lg shadow-lg ${!isVehicleDetailsVisible? 'bg-violet-400 text-white':""}`}>
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
                      {bookingData?.vehicleDetails?.number || 'number'}
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    <FaCircle className="text-gray-500 mr-2" />
                    <span className="font-semibold text-sm">Vehicle Model:</span>
                    <span className="text-sm ml-2">
                      {bookingData?.vehicleDetails?.model || 'model'}
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    <FaCar className="text-gray-500 mr-2" />
                    <span className="font-semibold text-sm">Vehicle Brand:</span>
                    <span className="text-sm ml-2">
                      {bookingData?.vehicleDetails?.brand || 'brand'}
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    <FaRoad className="text-gray-500 mr-2" />
                    <span className="font-semibold text-sm">Kilometer run:</span>
                    <span className="text-sm ml-2">
                      {bookingData?.vehicleDetails?.kilometersRun || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    <FaGasPump className="text-gray-500 mr-2" />
                    <span className="font-semibold text-sm">Fuel Type:</span>
                    <span className="text-sm ml-2">
                      {bookingData?.vehicleDetails?.fuelType === "petrol" ? "Petrol" : "Diesel"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaMotorcycle className="text-gray-500 mr-2" />
                    <span className="font-semibold text-sm">Vehicle Type: </span>
                    <span className="text-sm ml-2">
                      {bookingData?.vehicleDetails?.vehicleType === "twoWheeler" ? "Two Wheller" : "Four Wheller"}
                    </span>
                  </div>

                </div>
              )}
            </div>
          </div>

          {/* selected services */}

          <div className=" p-4 bg-gray-50 rounded-lg shadow-md">
            <table className="table-auto w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-customGrey text-white">
                  <th className=" px-6 py-3 text-left font-semibold uppercase">
                    Service Type
                  </th>
                  <th className="  px-6 py-3 text-right font-semibold uppercase">
                    Starting Price (₹)
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookingData?.selectedSubServices.map((service:any, index:number) => (
                  <tr
                    key={service._id}
                    className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"
                      } hover:bg-blue-100 transition-colors`}
                  >
                    <td className=" border-gray-200 px-6 py-3 flex items-center gap-2">
                      
                      {service.type}
                    </td>
                    <td className="border border-gray-200 px-6 py-3 text-right">
                      ₹{service.startingPrice}
                    </td>
                  </tr>
                ))}
                {/* Subtotal Row */}
                <tr className="bg-gray-100 font-bold">
                  <td className="border border-gray-200 px-6 py-3 text-right text-yellow-400">Subtotal</td>
                  <td className="border border-gray-200 px-6 py-3 text-right">
                    ₹
                    {bookingData?.selectedSubServices.reduce(
                      (total:number, service:any) => total + parseFloat(service.startingPrice),
                      0
                    )}
                  </td>
                </tr>
                {/* Platform Fee Row */}
                <tr className="bg-white font-bold">
                  <td className=" px-6 py-3 text-right">
                    Platform Fee
                  </td>
                  <td className="  px-6 py-3 text-right">
                    ₹{bookingData?.platformFee}
                  </td>
                </tr>
                {/* Grand Total Row */}
                <tr className="bg-customGrey text-white font-bold">
                  <td className=" px-6 py-3 text-right">
                    Grand Total
                  </td>
                  <td className="border  px-6 py-3 text-right">
                    ₹{bookingData?.subTotal}
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
