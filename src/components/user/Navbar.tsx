import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaBell, FaTimes } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useAppDispatch } from '../../interface/hooks';
import { toast } from 'sonner'; // Assuming you're using this for toast notifications
import logo from '../../../public/images/logo.jpg';
import { logoutThunk, resetSuccessAndMessage } from '../../redux/slice/userAuthSlice';
import Swal from 'sweetalert2';
import { getNotification, seenNotificationService } from '../../services/user/user';
import { Notification, NotificationItem } from '../../interface/user/user';
import { useSocket } from '../../Context/SocketIO';

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState<number >(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notification, setNotification] = useState<Notification>();
  const [notificationArray, setNotificationArray] = useState<NotificationItem[]>()
  const {socket} = useSocket();


  const { userInfo } = useSelector((state: RootState) => state?.user);


  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    fetchNotification()
  }, [])

  const fetchNotification = async () => {
    try {

      const response = await getNotification(userInfo?.id as string);
      console.log("This is the fech response:::::::::::::::::::: ", response)
      setNotification(response.notification);
      setNotificationArray(response.notification.notifications)
      const readCount = response.notification.notifications.filter((item:any) => !item.read).length;
      setNotificationCount(readCount)


    } catch (error) {
      console.log("Error in fetchNotification: ", error);

    }
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

  const handleNotificationClick = async() => {

   // toast.info('You have unread notifications!');
    try {
        await seenNotificationService(notification?._id as string)
      
    } catch (error) {
      console.log("Error in handleNotificationClicK: ", error)
      
    }
    setNotificationCount(0);
    setIsSidebarOpen(true);
  }


  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    if(notificationArray){
      console.log("This is notifyArray: ", notificationArray);
    }
    
    
  },[notificationArray])

  

  const isProviderServiceView = location.pathname.includes('/provider-service-view');
  const navBarClass = isProviderServiceView ? 'bg-darkBlue' : 'bg-white'
  const navBartextColor = isProviderServiceView ? 'text-white' : 'text-black'

  return (
    <nav className={` p-4 rounded ${navBarClass} `}>
      <div className="container mx-auto flex justify-between items-center ">

        {/* Left Section: Logo and Site Name */}
        <div className="  flex items-center">
          <img src={logo} alt="Site Logo" className="h-8 w-8 mr-2" />
          <span className="text-black text-4xl font-bold">PitCrew</span>
        </div>

        {/* Right Section: Buttons (hidden on mobile) */}
        <div className={`hidden md:flex text-xl space-x-5 ${navBartextColor}`}>
          <button className=" font-medium  px-3 py-2 rounded hover:font-bold"
            onClick={() => navigate('/')}>
            Home
          </button>
          <button className=" font-medium  px-3 py-2 rounded hover:font-bold"
            // onClick={() => navigate('/services')}
            onClick={() => navigate('/services/general-service')}
          >
            Service
          </button>
          {/* <button className=" font-bold hover:bg-gray-700 px-3 py-2 rounded hover:text-white"
          >
            About
          </button> */}
          <button className=" font-medium  px-3 py-2 rounded hover:font-bold"
            onClick={() => navigate('/user-profile')}>
            Profile
          </button>
          <button className=" font-medium px-3 py-2 rounded hover:font-bold" onClick={() => navigate('/provider/register')}>
            Add Workshop
          </button>

          {/* Notification Icon */}
          {userInfo ? (
            <div className="relative bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 transition-all duration-200 ease-in-out">
              <button className="text-xl text-gray-700 hover:text-black focus:outline-none" onClick={handleNotificationClick}>
                <FaBell />
              </button>
              {notificationCount>0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-semibold rounded-full h-6 w-6 flex items-center justify-center shadow">
                  {notificationCount}
                </span>
              )}
            </div>
          ) : ('')}



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
          <button className="text-black font-bold hover:bg-gray-700 px-3 py-2 rounded hover:text-white">
            Notification
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
    </nav>
  );
}

export default Navbar;
