import { useEffect, useState } from "react"
import { fetchBookingsService } from "../../services/provider/providerService";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

function BookingsComp() {

  const [bookingDetails, setBookingDetails] = useState([]);
  const providerId = useSelector((state:any) => state.provider?.providerInfo?.id);
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchBookingDetails = async() => {
       const response = await fetchBookingsService(providerId)
        if(response.success){
          toast.success("Successfully get the data");
          console.log("This si the response", response)
          setBookingDetails(response.bookingData)
        }else{
          toast.error("Failed to fetch the data!!");
        }
        
    }
    fetchBookingDetails()
  },[])

  useEffect(() => {
    console.log("This is bookingDetails: ", bookingDetails)
  },[])

  const handleViewBooking = (booking:any) => {
         navigate('/provider/bookings/booking-view',{state:{bookingData:booking}})
  }
  return (
    <>
     <div className="p-4">
  <table className="w-full text-left table-auto shadow-lg rounded-lg overflow-hidden">
    <thead>
      <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <th className="px-6 py-4">Date</th>
        <th className="px-6 py-4">Service Name</th>
        <th className="px-6 py-4">User Name</th>
        <th className="px-6 py-4">Status</th>
        <th className="px-6 py-4">Action</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {bookingDetails.map((booking: any, index) => (
        <tr
          key={index}
          className="hover:bg-gray-100 transition duration-200"
        >
          <td className="px-6 py-4">
            {booking?.bookingDate
              ? new Date(booking.bookingDate).toLocaleDateString("en-GB")
              : "N/A"}
          </td>
          <td className="px-6 py-4">
            {booking?.serviceDetails?.serviceType || "N/A"}
          </td>
          <td className="px-6 py-4">{booking?.userData?.name || "N/A"}</td>
          <td className="px-6 py-4">
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                booking?.status === "Completed"
                  ? "bg-green-100 text-green-800"
                  : booking?.status === "Pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {booking?.status || "N/A"}
            </span>
          </td>
          <td className="px-6 py-4">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md"
              onClick={() => handleViewBooking(booking)}
            >
              View
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


    </>
  )
}

export default BookingsComp
