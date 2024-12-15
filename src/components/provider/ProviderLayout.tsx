import { useEffect, useState } from 'react'; 
import { FaBars, FaBell, FaTimes } from 'react-icons/fa'; 
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'; 
import { FaTachometerAlt, FaPlus, FaUser, FaStore, FaSignOutAlt } from 'react-icons/fa';
import { FiCalendar } from 'react-icons/fi';
import { useAppDispatch } from '../../interface/hooks';
import { providerLogoutThunk } from '../../redux/thunk/provider';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { resetSuccess } from '../../redux/slice/providerAuthSlice';
import { toast } from 'sonner';
import { Notification, NotificationItem } from '../../interface/user/user';
import { getNotification, seenNotificationService } from '../../services/user/user';
import { RootState } from '../../redux/store';
import { useSocket } from '../../Context/SocketIO';

function ProviderLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation(); 
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [notification, setNotification] = useState<Notification>();
  const [notificationArray, setNotificationArray] = useState<NotificationItem[]>()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { providerInfo, message, success } = useSelector((state:RootState) => state.provider);
  const {socket} = useSocket()

  useEffect(() => {
    
    
      if(!providerInfo){
         navigate('/provider/login', {replace:true});
         toast.success(message)
         dispatch(resetSuccess())
      }
  },[providerInfo]);

  useEffect(() => {
     fetchNotification()
  },[]);

  const handleLogout = async () => {
     const logoutResponse = await dispatch(providerLogoutThunk()).unwrap()
     if(logoutResponse.success){
     }
     
  };

  const fetchNotification = async() => {
     try {
        const response = await getNotification(providerInfo?.id as string)
        setNotification(response.notification);
        setNotificationArray(response.notification.notifications)
        const readCount = response.notification.notifications.filter((item:any) => !item.read).length;
        setNotificationCount(readCount)
     } catch (error) {
        console.log("Error in fetchNotification: ", )
      
     }
  }

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

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleNotificationClick = async() => {
    try {
        await seenNotificationService(notification?._id as string)
      
    } catch (error) {
      console.log('Error in handleNotificationClick: ', error)
      
    }
    setIsSidebarOpen(true);
    setNotificationCount(0)
  }

  useEffect(() => {
    if(socket) {
        const handleNotification = (newNotification: any) => {
        console.log("This is the notify content:", newNotification);
        setNotificationArray((prev) => [
          newNotification,
          ...(prev || [])
        ])
        setNotificationCount((prevCount) => prevCount+1)
      };
  
      socket.on("receiveNotification", handleNotification);
  
      return () => {
        socket.off("receiveNotification", handleNotification);
      };
    }
  }, [socket]);

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
          {/* <h1 className="text-2xl font-bold mb-6">Workshop Panel</h1> */}
          <div className="flex mb-5 items-center justify-between p-4 rounded-lg bg-blue-200 border-b border-gray-300">
            <h1 className="text-2xl  font-bold text-gray-800">PitCrew</h1>
            <button
              className="relative flex items-center justify-center w-10 h-10 text-xl text-gray-700 transition duration-200 bg-white border border-gray-300 rounded-full hover:text-black hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Notifications"
              onClick={handleNotificationClick}
            >
              <FaBell />
              { notificationCount > 0 ?
              (
                <span
                className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full"
                
              >
                {notificationCount}
              </span>
              ):
             ('')}
              
            </button>
          </div>
          <ul className="space-y-7">
            <li>
              <Link
                to="/provider/dashboard"
                className={`text-black py-2 px-4 rounded hover:bg-gray-700 hover:text-white flex items-center ${isActiveRoute('/provider/dashboard') ? 'bg-gray-700 text-white' : ''
                  }`}
              >
                <FaTachometerAlt className="mr-3" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/provider/profile"
                className={`text-black py-2 px-4 rounded hover:bg-gray-700 hover:text-white flex items-center ${isActiveRoute('/provider/profile') ? 'bg-gray-700 text-white' : ''
                  }`}
              >
                <FaUser className="mr-3" />
                Profile
              </Link>
            </li>
            <li>
              <Link
                to="/provider/bookings"
                className={`text-black py-2 px-4 rounded hover:bg-gray-700 hover:text-white flex items-center ${isActiveRoute('/provider/bookings') ? 'bg-gray-700 text-white' : ''
                  }`}
              >
                <FiCalendar className="mr-3" />
                Bookings
              </Link>
            </li>

            <li>
              <Link
                to="/provider/add-service"
                className={`text-black py-2 px-4 rounded hover:bg-gray-700 hover:text-white flex items-center ${isActiveRoute('/provider/add-service') ? 'bg-gray-700 text-white' : ''
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

      <div
        className={`fixed top-0 z-50 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-bold">Notifications</h2>
          <button onClick={closeSidebar} className="text-gray-500 hover:text-gray-800">
            <FaTimes />
          </button>
        </div>
        {notificationArray ? (
          <ul className="space-y-4 p-4">
            {notificationArray.slice().
            sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).
            map((notificationItem) => (
              <li
                key={notificationItem?._id}
                className={`p-3 rounded shadow transition-colors cursor-pointer ${notificationItem.read
                    ? 'bg-gray-100 hover:bg-gray-200'
                    : 'bg-blue-100 hover:bg-blue-200 font-semibold'
                  }`}
                onClick={() => handleNotificationClick()}
              >
                {notificationItem?.content}
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 text-center text-gray-500">No notifications</div>
        )}
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50"
          onClick={closeSidebar}
        ></div>
      )}


      {/* Main Content */}
      <div className="flex-1  bg-gray-100 overflow-auto h-screen"> {/* Ensure the outlet section is scrollable */}
        <Outlet /> {/* This is where the page content will render */}
      </div>
    </div>
  );
}

export default ProviderLayout;
