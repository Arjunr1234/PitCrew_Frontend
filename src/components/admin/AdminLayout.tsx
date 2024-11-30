import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaUser, FaUsers, FaStore, FaSignOutAlt, } from 'react-icons/fa'; 
import { FiCalendar, FiSettings } from "react-icons/fi"
import { useAppDispatch } from '../../interface/hooks';
import { adminLogoutThunk } from '../../redux/thunk/admin';
import { resetSuccess } from '../../redux/slice/adminSlice';
import Swal from 'sweetalert2';
import { toast } from 'sonner';

function AdminLayout() {

   const dispatch = useAppDispatch();
   const navigate = useNavigate()
 
   
   const handleLogout = async () => {
    try {
      await dispatch(adminLogoutThunk()).unwrap(); 
      navigate('/admin/login'); 
      dispatch(resetSuccess()); 
      toast.success("Logout Successfull")
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const confirmLogout = () => {
    
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of your admin account!',
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
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-violet-400 text-white">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
          <ul className="space-y-7">
            <li>
              <Link to="/admin/dashboard" className=" text-black py-2 px-4 rounded hover:bg-gray-700 hover:text-white flex items-center">
                <FaTachometerAlt className="mr-3" /> {/* Dashboard Icon */}
                Dashboard
              </Link>
            </li>
           
            <li>
              <Link to="/admin/users" className=" text-black py-2 px-4 rounded hover:bg-gray-700 hover:text-white flex items-center">
                <FaUsers className="mr-3" /> {/* Users Icon */}
                Users
              </Link>
            </li>
            <li>
              <Link to="/admin/providers" className=" text-black py-2 px-4 rounded hover:bg-gray-700 hover:text-white flex items-center">
                <FaStore className="mr-3" /> {/* Providers Icon */}
                Providers
              </Link>
            </li>
            <li>
              <Link to="/admin/bookings" className=" text-black py-2 px-4 rounded hover:bg-gray-700 hover:text-white flex items-center">
                <FiCalendar className="mr-3" /> {/* Profile Icon */}
                Bookings
              </Link>
            </li>
            <li>
              <Link to="/admin/services" className="text-black py-2 px-4 rounded hover:bg-gray-700 hover:text-white flex items-center">
                <FiSettings className="mr-3" /> {/* Services Icon */}
                Services
              </Link>
            </li>
            <li>
              <button onClick={confirmLogout} className="w-full text-black py-2 px-4 rounded hover:bg-red-700 hover:text-white flex items-center">
                <FaSignOutAlt className="mr-3" /> {/* Logout Icon */}
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-100">
          <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
