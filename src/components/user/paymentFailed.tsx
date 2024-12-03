
import React from 'react';
import { useNavigate } from 'react-router-dom';

function paymentFailed() {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate('/provider-service-view'); // Replace with your payment route
  };

  setTimeout(() => {
     navigate('/')
  },3000)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-center px-4">
      <div className="animate-bounce">
        <div className="w-20 h-20 flex items-center justify-center bg-red-100 rounded-full shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
            />
          </svg>
        </div>
      </div>
      <h1 className="mt-6 text-2xl font-semibold text-red-700">
        Payment Failed
      </h1>
      <p className="mt-2 text-gray-600">
        We're sorry, but your payment could not be processed. Please try again.
      </p>
      {/* <button
        onClick={handleRetry}
        className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none"
      >
        Retry Payment
      </button> */}
      {/* <button
        onClick={() => navigate('/')}
        className="mt-3 text-red-600 hover:underline focus:outline-none"
      >
        Go to Home
      </button> */}
    </div>
  );
}

export default paymentFailed;

