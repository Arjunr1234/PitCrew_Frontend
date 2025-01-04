import { useEffect, useState } from "react";
import { fetchAllBookingsService } from "../../services/admin/adminService";
import { useNavigate } from "react-router-dom";

function Bookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<any[]>([]); 
  const [filterStatus, setFilterStatus] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const itemsPerPage = 5; 

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    try {
      const response = await fetchAllBookingsService();
      if (response.success) {
        setBookings(response.bookingData);
        setFilteredBookings(response.bookingData); 
      }
    } catch (error) {
      console.log("Error in fetching all bookings:", error);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value); 
  };

  const applyFilter = () => {
    if (filterStatus) {
      const filtered = bookings.filter(
        (booking) => booking.status.toLowerCase() === filterStatus.toLowerCase()
      );
      setFilteredBookings(filtered);
    } else {
      setFilteredBookings(bookings); 
    }
    setCurrentPage(1); 
  };

  
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBookings = filteredBookings.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleViewBooking = (booking: any) => {
    navigate("/admin/booking-view", { state: { bookingDetails: booking } });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-2 flex flex-col justify-center gap-y-5">
      {/* <div className="p-5 ">
        <h1 className="text-3xl font-mono text-center">Booking Details</h1>
      </div> */}
     
      <div className="flex flex-row justify-center items-center mb-4 space-x-4">
        <h1>Status:</h1>
        <select
          className="border border-gray-300 rounded px-4 py-2"
          value={filterStatus}
          onChange={handleFilterChange}
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Delivered">Delivered</option>
          <option value="work progress">Work Progress</option>
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
            <th className="px-6 py-4">Provider Name</th>
            <th className="px-6 py-4">User Name</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentBookings.map((booking: any, index: number) => (
            <tr
              key={index}
              className="hover:bg-gray-100 transition duration-200"
            >
              <td className="px-6 py-4">
                {booking?.bookingDate
                  ? new Date(booking.bookingDate).toLocaleDateString("en-GB")
                  : "N/A"}
              </td>
              <td className="px-6 py-4">{booking?.serviceName}</td>
              <td className="px-6 py-4">
                {booking?.providerDetails?.workshopName}
              </td>
              <td className="px-6 py-4">{booking?.userDetails?.name}</td>
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
     
      <div className="flex justify-center mt-4 space-x-2">
        <button
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`px-3 py-1 rounded ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Bookings;
