import React from 'react';
import { Link } from 'react-router-dom';

interface NotFoundProps {
  role: string;
}

const NotFound: React.FC<NotFoundProps> = ({ role }) => {
  
  const getRedirectPath = () => {
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'provider':
        return '/provider/dashboard';
      case 'user':
        return '/';
      default:
        return '/';
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200">
      
      <h1 className="text-8xl font-extrabold text-red-500 animate-bounce">404</h1>
      <p className="text-xl text-gray-800 mt-4 animate-fadeIn">
        Oops! The page you're looking for doesn't exist.
      </p>

      
      {role && (
        <p className="text-md text-gray-600 mt-2">
          You are logged in as <span className="font-bold">{role}</span>.
        </p>
      )}

      
      <div className="mt-4 w-24 h-1 bg-gradient-to-r from-red-500 to-blue-500 animate-pulse"></div>

      
      <Link
        to={getRedirectPath()}
        className="mt-8 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
      >
        Go Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
