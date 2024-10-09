import {  useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'; // Icons for mobile menu
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useAppDispatch } from '../../interface/hooks'; 
import { toast } from 'sonner'; // Assuming you're using this for toast notifications
import logo from '../../../public/images/logo.jpg';
import { logoutThunk, resetSuccessAndMessage } from '../../redux/slice/userAuthSlice';

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Select user state from Redux to check if the user is logged in
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


  return (
    <nav className="bg-white p-4 rounded ">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Left Section: Logo and Site Name */}
        <div className="flex items-center">
          <img src={logo} alt="Site Logo" className="h-8 w-8 mr-2" />
          <span className="text-black text-2xl font-bold">PitCrew</span>
        </div>

        {/* Right Section: Buttons (hidden on mobile) */}
        <div className="hidden md:flex space-x-5">
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
