import { useEffect, useState } from "react";
import { fetchBookingsService } from "../../services/provider/providerService";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

function BookingsComp() {
  const [bookingDetails, setBookingDetails] = useState([]);
  const [filteredBookingDetails, setFilteredBookingDetails] = useState([]);
  const providerId = useSelector((state: any) => state.provider?.providerInfo?.id);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState(""); 
  const usersPerPage = 5;

  useEffect(() => {
    const fetchBookingDetails = async () => {
      const response = await fetchBookingsService(providerId);
      if (response.success) {
        setBookingDetails(response.bookingData);
        setFilteredBookingDetails(response.bookingData); 
      } else {
        toast.error("Failed to fetch the data!!");
      }
    };
    fetchBookingDetails();
  }, []);

  const handleViewBooking = (booking: any) => {
    navigate("/provider/bookings/booking-view", { state: { bookingData: booking } });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
  };

  const applyFilter = () => {
    if (filterStatus) {
      const filtered = bookingDetails.filter(
        (booking: any) => booking?.status?.toLowerCase() === filterStatus.toLowerCase()
      );
      setFilteredBookingDetails(filtered);
      setCurrentPage(1); 
    } else {
      setFilteredBookingDetails(bookingDetails); 
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentBooking = filteredBookingDetails.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredBookingDetails.length / usersPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      <div className="p-4">
        <div className="flex flex-row justify-center items-center mb-4 space-x-4">
          
          <select
            className="border border-gray-300 rounded px-4 py-2"
            value={filterStatus}
            onChange={handleFilterChange}
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Delivered">Delivered</option>
            <option value="work progress">work progress</option>
            <option value="ready for delivery">Ready for Delivery</option>
          </select>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={applyFilter}
          >
            Apply
          </button>
        </div>

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
            {currentBooking.map((booking: any, index) => (
              <tr key={index} className="hover:bg-gray-100 transition duration-200">
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

        <div className="flex justify-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 mx-1 bg-gray-300 rounded hover:bg-gray-400 disabled:bg-gray-200"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 mx-1 ${
                currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-300"
              } rounded hover:bg-gray-400`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 mx-1 bg-gray-300 rounded hover:bg-gray-400 disabled:bg-gray-200"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default BookingsComp;
