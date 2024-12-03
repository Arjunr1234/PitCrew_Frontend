import  { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { changePaymentStatusService } from "../../services/user/user";
import { toast } from "sonner";

function PaymentSuccess() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const sessionId = searchParams.get("session_id");
  const bookId = searchParams.get("book_id");

  useEffect(() => {
    const changePaymentStatus = async () => {
      if (sessionId && bookId) {
        const response = await changePaymentStatusService(sessionId, bookId);
        toast.success("Successfully changed payment status");
        console.log("Payment status changed:", response);
      } else {
        console.error("Session ID or Book ID is missing");
        toast.error("Session ID and Book ID are missing");
      }
    };

    changePaymentStatus();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-200">
      <div className="bg-white rounded-lg p-10 shadow-lg max-w-md text-center animate-fade-in-up">
        <div className="flex justify-center mb-4">
          <FaCheckCircle className="text-green-500 text-6xl animate-bounce" />
        </div>
        <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-4">
          Thank you for your booking. Your payment has been processed successfully.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate("/",{replace:true})}
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300"
          >
            Go to Home
          </button>
          <button
            onClick={() => navigate(`/user-profile/booking-details`, {replace:true})}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
          >
            View Booking
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
