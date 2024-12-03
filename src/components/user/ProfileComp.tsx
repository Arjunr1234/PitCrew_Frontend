import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Image from "../../images/userProfileDefaltImg.png"
import Swal from 'sweetalert2';
import { toast } from 'sonner';
import { logoutThunk, resetSuccessAndMessage } from '../../redux/slice/userAuthSlice';
import { useAppDispatch } from '../../interface/hooks';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUserDetailsService, updateProfilePicService } from '../../services/user/user';
import { AiOutlineLoading } from 'react-icons/ai';

function ProfileComp() {

  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { name, id } = useSelector((state: any) => state.user.userInfo);
  const [profilePic, setProfilePic] = useState<string>(Image)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (location.pathname === '/user-profile') {
      navigate('/user-profile/profile-details')
    }
  })

  useEffect(() => {
    const fetchUserDetails = async () => {
      const response = await getUserDetailsService(id as string);
      if (response.success) {
        setProfilePic(response.userData.imageUrl)
        console.log("This is the repsonse: ", response)
      }
    }
    fetchUserDetails()
  }, [])

  const handleLogout = async () => {
    try {
      await dispatch(logoutThunk());
      toast.success('Logged out successfully!');
      dispatch(resetSuccessAndMessage())

    } catch (error) {
      toast.error('Failed to logout');
      console.error(error);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];


      if (!file) {
        toast.error("Please select a file");
        return;
      }


      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validImageTypes.includes(file.type)) {
        toast.error("Please upload an image (JPEG, PNG, GIF)");
        return;
      }

      const formData = new FormData();
      formData.append('image', file);
      formData.append('userId', id);

      setIsLoading(true);

      try {

        const response = await updateProfilePicService(formData);

        if (response.success) {

          setProfilePic(response.imageUrl);
          toast.success("Successfully updated!!");
        } else {
          toast.error("Failed to update profile picture");
        }
      } catch (error) {
        console.error("Error in handleImageChange: ", error);
        toast.error("Error while updating the image");
      } finally {
        setIsLoading(false);
      }
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
  return (
    <div className="grid h-[calc(100vh-100px)] w-full p-8 lg:grid-cols-[280px_1fr]">
      {/* Left Sidebar Section */}
      <div className="hidden lg:flex flex-col bg-customBlue border-r rounded-lg border-gray-200 text-primary-foreground animate-fade">
        <div className="flex flex-col items-center gap-6 py-6 px-4 border-b border-gray-300">
          {/* Profile Picture Section */}
          <div className="relative h-36 w-36">
            <img
              alt="Profile picture"
              className=" h-40 w-40 rounded-full border-4 border-white object-cover shadow-lg"
              src={profilePic}
            />

            {/* Button to trigger file input */}
            <label
              htmlFor="fileInput"
              className={`absolute bottom-0 left-1/2 w-28 -translate-x-1/2 transform  bg-white text-black text-sm text-primary font-semibold py-1 rounded-lg shadow hover:bg-gray-100 transition duration-200 cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <AiOutlineLoading className="animate-spin text-primary mr-2" />
                  <span>Loading...</span>
                </div>
              ) : (
                <h1 className="text-center">Update Photo</h1>
              )}
            </label>

            {/* Hidden file input */}
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {/* User Information */}
          <h3 className="text-lg font-semibold text-black">Welcome, {name}</h3>
          <p className="text-sm text-black">Manage your account</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col mt-4 space-y-2 px-4">
          <Link
            to={"/user-profile/profile-details"}
            className="flex items-center gap-3 rounded-lg px-4 py-2 text-black font-medium transition-all hover:bg-gray-700 hover:text-white"
          >
            🧑 Profile
          </Link>
          <Link
            to={"/user-profile/booking-details"}
            className="flex items-center gap-3 rounded-lg px-4 py-2 text-black font-medium transition-all hover:bg-gray-700 hover:text-white"
          >
            🛒 Bookings
          </Link>
          <Link
            to={"/user-profile/reset-password"}
            className="flex items-center gap-3 rounded-lg px-4 py-2 text-black font-medium transition-all hover:bg-gray-700 hover:text-white"
          >
            🔑 Reset Password
          </Link>

          <button
            className="flex items-center gap-3 rounded-lg px-4 py-2 text-black font-medium transition-all hover:bg-red-600 hover:text-white"
            onClick={confirmLogout}
          >
            🚪 Logout
          </button>
        </nav>
      </div>

      {/* Right Section for Nested Routes */}
      <div className="flex flex-col scroll-m-1 ml-6 rounded-lg bg-gray-200 animate-flip-down">
        {/* Scrollable Wrapper for the Outlet */}
        <div
          className="scrollable-outlet overflow-y-auto h-full max-h-[calc(100vh-110px)] p-1 rounded-lg bg-white  shadow-md"
        >
          <Outlet />
        </div>
      </div>

    </div>
  );
}

export default ProfileComp;
