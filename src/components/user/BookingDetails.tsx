import { useEffect, useState } from "react"
import { getBookingsService } from "../../services/provider/providerService"
import { useSelector } from "react-redux"
import { IBookingDetails } from "../../interface/user/user";
import { FaPhoneAlt, FaCommentDots } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaMapMarkerAlt, FaCar, FaGasPump, FaCogs } from 'react-icons/fa';
import { toast } from "sonner";
import Swal from "sweetalert2";
import { cancellBookingService } from "../../services/user/user";

function BookingDetails() {

  
  const [bookings, setBookings] = useState<IBookingDetails[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] = useState<IBookingDetails | null>(null);
  const navigate = useNavigate()
  const { id } = useSelector((state: any) => state.user?.userInfo);

  

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getBookingsService(id);
        if (response.success) {
          const sortedBookings = response.bookingData.sort((a: any, b: any) => {
            return new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
          })
          setBookings(sortedBookings);

        }

      } catch (error) {
        console.log("Error in fetchBookings: ", error)
        throw error
      }
    }
    fetchBookings()
  }, [])

  const handleViewBookings = (bookingId: string) => {
    const selectBooking = bookings.filter((booking: IBookingDetails) => booking._id === bookingId);
    // setSelectedBooking(selectBooking[0]);
    // setIsModalOpen(true)
    if (selectBooking) {
      navigate('/user-profile/booking-view', { state: { booking: selectBooking } })
    } else {
      toast.error('No selectd')
    }
  }

  const handleCloseViewBooking = () => {
    setSelectedBooking(null);
    setIsModalOpen(false)
  }

  const handleCancellBooking = async(bookingId:string, reason:string) => {
     try {
        console.log('This is the bookingId: ', bookingId);
        console.log("This is the reason: ", reason);
        const response = await cancellBookingService(bookingId, reason);
        if(response.success){
           const changeStatusBooking = bookings.map((booking) => {
              if(booking._id === bookingId){
                 return { 
                  ...booking, status:"cancelled",reason:reason,
                 }
              }
              else{
                return booking
              }
           })
           setBookings(changeStatusBooking)
           toast.success("Successfully Cancelled!!")
        }


     } catch (error:any) {
       console.log("Error in handleCancellService: ", error)
       toast.error(error.response.data.message)
     }
  }


  const handleCancelTerms = async (bookingId: string) => {
    const { value: accept } = await Swal.fire({
      title: "Cancellation Terms and Conditions",
      html: `
        <div style="text-align: left; font-size: 14px;">
          <p>1. If you cancel at least 24 hours before the scheduled booking date, you will receive a full refund, excluding the platform fee.</p>
          <p>2. If you cancel within 24 hours of the scheduled booking date, 25% of the total payment will be deducted, and the remaining amount will be refunded.</p>
        </div>
      `,
      input: "checkbox",
      inputValue: 0,
      inputPlaceholder: "I agree to the terms and conditions",
      confirmButtonText: `
        Proceed&nbsp;<i class="fa fa-arrow-right"></i>
      `,
      inputValidator: (result) => {
        return !result && "You need to agree with the terms and conditions!";
      },
      showCancelButton: true,
      cancelButtonText: "Cancel",
    });
  
    if (accept) {
      // Show the second SweetAlert for additional input
      const { value: reason } = await Swal.fire({
        title: "Cancellation Reason",
        input: "textarea",
        inputLabel: "Reason for Cancellation",
        inputPlaceholder: "Type your cancellation reason here...",
        inputAttributes: {
          "aria-label": "Type your cancellation reason here",
        },
        confirmButtonText: "Submit",
        showCancelButton: true,
        cancelButtonText: "Cancel",
      });
  
      if (reason) {
           handleCancellBooking(bookingId, reason)
      } else {
        Swal.fire("Cancellation reason not provided!", "", "info");
      }
    } else {
      Swal.fire("Action canceled!", "", "error");
    }
  };
  
  
  return (
    <div className="overflow-x-auto rounded-lg">
      <table className="table-auto border-collapse border  border-gray-300 w-full shadow-md rounded-lg">
        <thead>
          <tr className="bg-gradient-to-r bg-providerBlueSecondary text-black rounded-t-lg">
            <th className=" px-4 py-3">Date</th>
            <th className=" px-2 py-3">Service Name</th>
            <th className=" px-4 py-3">Provider Name</th>
            <th className=" px-4 py-3">Status</th>
            <th className=" px-4 py-3">View</th>
            <th className=" px-4 py-3">Cancel</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking: any) => (
            <tr
              key={booking._id}
              className="bg-white hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105"
            >
              <td className=" px-4 py-3 text-center">
                {booking?.bookingDate
                  ? new Date(booking.bookingDate).toLocaleDateString('en-GB')
                  : 'N/A'}
              </td>
              <td className=" px-2 py-3 text-center">
                {booking?.serviceName}
              </td>
              <td className=" px-4 py-3 text-center">
                {booking?.providerDetails.workshopName}
              </td>
              <td
                className={` px-4 py-3 text-center font-semibold ${booking?.status === 'Completed'
                    ? 'text-green-500'
                    : booking?.status === 'pending'
                      ? 'text-yellow-500'
                      : 'text-red-500'
                  }`}
              >
                {booking?.status}
              </td>
              <td className=" px-4 py-3 text-center">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
                  onClick={() => handleViewBookings(booking._id)}>
                  View
                </button>
              </td>
              <td className=" px-4 py-3 text-center">
               {booking.status !== 'cancelled'?
               ( <button className="px-4 py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105"
                onClick={() => handleCancelTerms(booking._id)}>
                  Cancell
                </button>):("")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    
      {
        isModalOpen && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50 rounded-xl">
            <div className="bg-gray-200  rounded-lg w-full h-full flex flex-col shadow-lg relative">
              <div className="flex flex-row p-2 items-center justify-between">

                <button className="p-3 rounded-lg bg-blue-400"
                  onClick={handleCloseViewBooking}>
                  Back
                </button>


                <h1 className="text-3xl font-atma">{selectedBooking.providerDetails.workshopName}</h1>


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
                  >
                    <FaCommentDots size={20}
                      onClick={() => navigate('/user-profile/user-chat')} />
                  </button>
                </div>
              </div>

              <div>
                <h1 className="text-xl font-semibold text-center p-5">
                  Status:
                  <span className={`px-4 py-3 text-center font-semibold ${selectedBooking?.status === 'Completed'
                      ? 'text-green-500'
                      : selectedBooking?.status === 'pending'
                        ? 'text-yellow-500'
                        : 'text-red-500'
                    }`}>
                    {selectedBooking.status}
                  </span>
                </h1>
              </div>

              <div className="flex flex-row gap-4 p-4">

                {/* Provider Details Section */}
                <div className="flex-1 bg-green-100 p-4 rounded-lg shadow-lg">
                  <h2 className="text-lg font-semibold mb-3">Provider Details</h2>
                  <div className="flex items-center mb-2">
                    <FaPhoneAlt className="text-gray-500 mr-2" />
                    <span className="font-semibold text-sm">Phone:</span>
                    <span className="text-sm ml-2">{selectedBooking.providerDetails.mobile}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <FaEnvelope className="text-gray-500 mr-2" />
                    <span className="font-semibold text-sm">Email:</span>
                    <span className="text-sm ml-2">{selectedBooking.providerDetails.email}</span>
                  </div>
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-gray-500 mr-2" />
                    <span className="font-semibold text-sm">Location:</span>
                    <span className="text-sm ml-2">{selectedBooking.providerDetails.workshopDetails.address}</span>
                  </div>
                </div>

                {/* Vehicle Details Section */}
                <div className="flex-1 bg-orange-100 p-4 rounded-lg shadow-lg">
                  <h2 className="text-lg font-semibold mb-3">Vehicle Details</h2>
                  <div className="flex items-center mb-2">
                    <FaCar className="text-gray-500 mr-2" />
                    <span className="font-semibold text-sm">Vehicle Number:</span>
                    <span className="text-sm ml-2">{selectedBooking.vehicleDetails.number}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <FaCogs className="text-gray-500 mr-2" />
                    <span className="font-semibold text-sm">Model:</span>
                    <span className="text-sm ml-2">{selectedBooking.vehicleDetails.model}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <FaCar className="text-gray-500 mr-2" />
                    <span className="font-semibold text-sm">Brand:</span>
                    <span className="text-sm ml-2">{selectedBooking.vehicleDetails.brand}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <FaGasPump className="text-gray-500 mr-2" />
                    <span className="font-semibold text-sm">Kilometers:</span>
                    <span className="text-sm ml-2">{selectedBooking.vehicleDetails.kilometersRun}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <FaGasPump className="text-gray-500 mr-2" />
                    <span className="font-semibold text-sm">Fuel Type:</span>
                    <span className="text-sm ml-2">{selectedBooking.vehicleDetails.fuelType}</span>
                  </div>
                  <div className="flex items-center">
                    <FaCar className="text-gray-500 mr-2" />
                    <span className="font-semibold text-sm">Vehicle Type:</span>
                    <span className="text-sm ml-2">{selectedBooking.vehicleDetails.vehicleType}</span>
                  </div>
                </div>

              </div>
              <div className="flex selected_service_price flex-row p-4">
                <div className="w-full bg-blue-200 p-4 rounded-lg shadow-lg">
                  <h2 className="text-lg font-semibold mb-3">Selected Services</h2>
                  <table className="table-auto w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-200 px-4 py-2 text-left">Service</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedBooking.selectedSubServices.map((service, index) => (
                        <tr key={service._id || index} className="hover:bg-gray-50">
                          <td className="border border-gray-200 px-4 py-2">{service.type}</td>
                          <td className="border border-gray-200 px-4 py-2">₹{service.startingPrice}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>


                  <div className="mt-4">
                    <div className="flex justify-between px-4 py-2">
                      <span className="text-sm font-medium">Platform Fee:</span>
                      <span className="text-sm font-medium">₹{selectedBooking.platformFee}</span>
                    </div>
                    <div className="flex justify-between px-4 py-2 border-t border-gray-300 mt-2">
                      <span className="text-lg font-semibold">Total Amount:</span>
                      <span className="text-lg font-semibold">
                        ₹
                        {selectedBooking.selectedSubServices.reduce(
                          (total, service) => total + parseFloat(service.startingPrice),
                          (selectedBooking.platformFee)
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )
      }


    </div>

  )
}

export default BookingDetails
