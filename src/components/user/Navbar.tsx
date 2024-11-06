import {  useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'; // Icons for mobile menu
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useAppDispatch } from '../../interface/hooks'; 
import { toast } from 'sonner'; // Assuming you're using this for toast notifications
import logo from '../../../public/images/logo.jpg';
import { logoutThunk, resetSuccessAndMessage } from '../../redux/slice/userAuthSlice';
import Swal from 'sweetalert2';

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  
  const { userInfo } = useSelector((state: RootState) => state.user);
  

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutThunk()); 
      toast.success('Logged out successfully!');
      dispatch(resetSuccessAndMessage())
     
    } catch (error) {
      toast.error('Failed to log out');
      console.error(error);
    }
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

  const isProviderServiceView = location.pathname.includes('/provider-service-view');
  const navBarClass = isProviderServiceView ? 'bg-darkBlue' : 'bg-customBlue'
  const navBartextColor = isProviderServiceView ? 'text-white' : 'text-black'

  return (
    <nav className={` p-4 rounded  ${navBarClass}`}>
      <div className="container mx-auto flex justify-between items-center ">
        
        {/* Left Section: Logo and Site Name */}
        <div className=" animate-pulse flex items-center">
          <img src={logo} alt="Site Logo" className="h-8 w-8 mr-2" />
          <span className="text-black text-4xl font-bold">PitCrew</span>
        </div>

        {/* Right Section: Buttons (hidden on mobile) */}
        <div className={`hidden md:flex text-xl space-x-5 ${navBartextColor}`}>
          <button className=" font-bold hover:bg-gray-700 px-3 py-2 rounded hover:text-white"
          onClick={() => navigate('/')}>
            Home
          </button>
          <button className=" font-bold hover:bg-gray-700 px-3 py-2 rounded hover:text-white"
          onClick={() => navigate('/services')}>
            Service
          </button>
          <button className=" font-bold hover:bg-gray-700 px-3 py-2 rounded hover:text-white"
          >
            About
          </button>
          <button className=" font-bold hover:bg-gray-700 px-3 py-2 rounded hover:text-white">
            Contact
          </button>
          <button className=" font-bold hover:bg-gray-700 px-3 py-2 rounded hover:text-white" onClick={() => navigate('/provider/register')}>
            Add Workshop
          </button>

          
          {userInfo ? (
            <button className="text-white bg-gray-700 px-3 py-2 rounded-full" onClick={confirmLogout}>
              Logout
            </button>
          ) : (
            <button className="text-white bg-gray-700 px-3 py-2 rounded-full" onClick={() => navigate('/login')}>
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Menu Icon (visible on small screens) */}
        <div className="md:hidden">
          <button onClick={handleMobileMenuToggle}>
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (visible when toggled) */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 flex flex-col space-y-3">
          <button className="text-black font-bold hover:bg-gray-700 px-3 py-2 rounded hover:text-white">
            Home
          </button>
          <button className="text-black font-bold hover:bg-gray-700 px-3 py-2 rounded hover:text-white">
            Service
          </button>
          <button className="text-black font-bold hover:bg-gray-700 px-3 py-2 rounded hover:text-white">
            About
          </button>
          <button className="text-black font-bold hover:bg-gray-700 px-3 py-2 rounded hover:text-white">
            Contact
          </button>
          <button className="text-black font-bold hover:bg-gray-700 px-3 py-2 rounded hover:text-white" onClick={() => navigate('/provider/register')}>
            Add Workshop
          </button>

          {/* Conditionally render Sign In or Logout in mobile menu */}
          {userInfo ? (
            <button className="text-white bg-gray-700 px-3 py-2 rounded-full" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button className="text-white bg-gray-700 px-3 py-2 rounded-full" onClick={() => navigate('/login')}>
              Sign In
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
