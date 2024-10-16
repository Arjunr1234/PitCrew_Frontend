import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaUser, FaUsers, FaStore, FaSignOutAlt } from 'react-icons/fa'; // Importing icons from React Icons
import { useAppDispatch } from '../../interface/hooks';
import { adminLogoutThunk } from '../../redux/thunk/admin';
import { resetSuccess } from '../../redux/slice/adminSlice';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

function ProviderLayout() {

   const dispatch = useAppDispatch();
   const navigate = useNavigate();
   const {providerInfo} = useSelector((state:any) => state.provider)
   
   
   
   const handleLogout = async () => {
   
  };

  const confirmLogout = () => {
    
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of your  account!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, log me out!',
    }).then((result) => {
      if (result.isConfirmed) {
        handleLogout(); 
      }
    });
  };


  
  
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-providerGreen text-white">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
          <ul className="space-y-7">
            <li>
              <Link to="/provider/dashboard" className=" text-black py-2 px-4 rounded hover:bg-gray-700 hover:text-white flex items-center">
                <FaTachometerAlt className="mr-3" /> {/* Dashboard Icon */}
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/provider/profile" className=" text-black py-2 px-4 rounded hover:bg-gray-700 hover:text-white flex items-center">
                <FaUser className="mr-3" /> {/* Profile Icon */}
                Profile
              </Link>
            </li>
            <li>
              <Link to="/provider/users" className=" text-black py-2 px-4 rounded hover:bg-gray-700 hover:text-white flex items-center">
                <FaUsers className="mr-3" /> {/* Users Icon */}
                Users
              </Link>
            </li>
            <li>
              <Link to="/provider/service" className=" text-black py-2 px-4 rounded hover:bg-gray-700 hover:text-white flex items-center">
                <FaStore className="mr-3" /> {/* Providers Icon */}
                Service
              </Link>
            </li>
            <li>
              <button onClick={confirmLogout} className="w-full text-black py-2 px-4 rounded hover:bg-red-700 hover:text-white flex items-center">
                <FaSignOutAlt className="mr-3" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
}

export default ProviderLayout;
