import { useEffect, useState } from 'react'; 
import { FaBars, FaTimes } from 'react-icons/fa'; 
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'; 
import { FaTachometerAlt, FaPlus, FaUser, FaStore, FaSignOutAlt } from 'react-icons/fa';
import { FiCalendar } from 'react-icons/fi';
import { useAppDispatch } from '../../interface/hooks';
import { providerLogoutThunk } from '../../redux/thunk/provider';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { resetSuccess } from '../../redux/slice/providerAuthSlice';
import { toast } from 'sonner';

function ProviderLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation(); 
  const { providerInfo, message, success } = useSelector((state: any) => state.provider);

  useEffect(() => {
    console.log("//////////////////////",providerInfo);
    
      if(!providerInfo){
         navigate('/provider/login', {replace:true});
         toast.success(message)
         dispatch(resetSuccess())
      }
  },[providerInfo])

  const handleLogout = async () => {
     const logoutResponse = await dispatch(providerLogoutThunk()).unwrap()
     if(logoutResponse.success){
     }
     console.log("This is the logoutResponse: ",logoutResponse)
  };

  const confirmLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of your account!',
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

  // Function to determine if a route is active
  const isActiveRoute = (route: string) => {
    return location.pathname === route;
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Mobile Menu Button */}
      <div className="lg:hidden p-4 bg-providerGreen text-white flex justify-between items-center">
        <h1 className="text-xl font-bold">Workshop Panel</h1>
        <button
          className="p-2 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />} {/* Hamburger/Close Icon */}
        </button>
      </div>

      {/* Sidebar as dropdown from top on small screens */}
      <div
        className={`lg:hidden bg-providerGreen text-white absolute top-0 left-0 w-full z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="p-4">
          {/* Close Button */}
          <button
            className="mb-4 p-2 bg-red-500 text-white rounded focus:outline-none"
            onClick={() => setIsMenuOpen(false)}
          >
            Close
          </button>
          <ul className="space-y-7">
            <li>
              <Link
                to="/provider/dashboard"
                onClick={() => setIsMenuOpen(false)} // Close menu on link click
                className={`text-black py-2 px-4 rounded hover:bg-gray-700 hover:text-white flex items-center ${
                  isActiveRoute('/provider/dashboard') ? 'bg-gray-700 text-white' : ''
                }`}
              >
                <FaTachometerAlt className="mr-3" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/provider/profile"
                onClick={() => setIsMenuOpen(false)}
                className={`text-black py-2 px-4 rounded hover:bg-gray-700 hover:text-white flex items-center ${
                  isActiveRoute('/provider/profile') ? 'bg-gray-700 text-white' : ''
                }`}
              >
                <FaUser className="mr-3" />
                Profile
              </Link>
            </li>
            <li>
              <Link
                to="/provider/bookings"
                onClick={() => setIsMenuOpen(false)}
                className={`text-black py-2 px-4 rounded hover:bg-gray-700 hover:text-white flex items-center ${
                  isActiveRoute('/provider/bookings') ? 'bg-gray-700 text-white' : ''
                }`}
              >
                <FiCalendar className="mr-3" />
                Bookings
              </Link>
            </li>
            <li>
              <Link
                to="/provider/services"
                onClick={() => setIsMenuOpen(false)}
                className={`text-black py-2 px-4 rounded hover:bg-gray-700 hover:text-white flex items-center ${
                  isActiveRoute('/provider/services') ? 'bg-gray-700 text-white' : ''
                }`}
              >
                <FaStore className="mr-3" />
                Services
              </Link>
            </li>
            <li>
              <Link
                to="/provider/add-service"
                onClick={() => setIsMenuOpen(false)}
                className={`text-black py-2 px-4 rounded hover:bg-gray-700 hover:text-white flex items-center ${
                  isActiveRoute('/provider/add-service') ? 'bg-gray-700 text-white' : ''
                }`}
              >
                <FaPlus className="mr-3" />
                Add service
              </Link>
            </li>
            <li>
              <button
                onClick={confirmLogout}
                className="w-full text-black py-2 px-4 rounded hover:bg-red-700 hover:text-white flex items-center"
              >
                <FaSignOutAlt className="mr-3" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Sidebar for larger screens */}
      <div className="w-64 bg-providerGreen text-white hidden lg:flex lg:flex-col sticky top-0 h-screen"> {/* Make sidebar sticky */}
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Workshop Panel</h1>
          <ul className="space-y-7">
            <li>
              <Link
                to="/provider/dashboard"
                className={`text-black py-2 px-4 rounded hover:bg-gray-700 hover:text-white flex items-center ${
                  isActiveRoute('/provider/dashboard') ? 'bg-gray-700 text-white' : ''
                }`}
              >
                <FaTachometerAlt className="mr-3" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/provider/profile"
                className={`text-black py-2 px-4 rounded hover:bg-gray-700 hover:text-white flex items-center ${
                  isActiveRoute('/provider/profile') ? 'bg-gray-700 text-white' : ''
                }`}
              >
                <FaUser className="mr-3" />
                Profile
              </Link>
            </li>
            <li>
              <Link
                to="/provider/bookings"
                className={`text-black py-2 px-4 rounded hover:bg-gray-700 hover:text-white flex items-center ${
                  isActiveRoute('/provider/bookings') ? 'bg-gray-700 text-white' : ''
                }`}
              >
                <FiCalendar className="mr-3" />
                Bookings
              </Link>
            </li>
            <li>
              <Link
                to="/provider/services"
                className={`text-black py-2 px-4 rounded hover:bg-gray-700 hover:text-white flex items-center ${
                  isActiveRoute('/provider/services') ? 'bg-gray-700 text-white' : ''
                }`}
              >
                <FaStore className="mr-3" />
                Services
              </Link>
            </li>
            <li>
              <Link
                to="/provider/add-service"
                className={`text-black py-2 px-4 rounded hover:bg-gray-700 hover:text-white flex items-center ${
                  isActiveRoute('/provider/add-service') ? 'bg-gray-700 text-white' : ''
                }`}
              >
                <FaPlus className="mr-3" />
                Add service
              </Link>
            </li>
            <li>
              <button
                onClick={confirmLogout}
                className="w-full text-black py-2 px-4 rounded hover:bg-red-700 hover:text-white flex items-center"
              >
                <FaSignOutAlt className="mr-3" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100 overflow-auto h-screen"> {/* Ensure the outlet section is scrollable */}
        <Outlet /> {/* This is where the page content will render */}
      </div>
    </div>
  );
}

export default ProviderLayout;
