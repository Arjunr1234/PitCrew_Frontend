import React, { useEffect, useState } from "react";
import { editUserProfileService, getUserDetailsService } from "../../services/user/user";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useAppDispatch } from "../../interface/hooks";
import { updateUserProfile } from "../../redux/slice/userAuthSlice";

function UserProfileForm() {
  const [useName, setUserName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [modalUserName, setModalUserName] = useState<string>("");
  const [modalPhone, setModalPhone] = useState<string>("");

  const dispatch = useDispatch()

  const userId = useSelector((state: any) => state.user.userInfo.id);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await getUserDetailsService(userId);
        if (response.success) {
          const userData = response.userData;
          setUserName(userData.name || "");
          setPhone(userData.phone || "");
          setEmail(userData.email || "");
        } else {
          toast.error("Failed to fetch user details");
        }
      } catch (error) {
        toast.error("An error occurred while fetching user details");
      }
    };
    fetchUserDetails();
  }, []);

  // Function to open modal and set initial values
  const handleEditClick = () => {
    setModalUserName(useName);
    setModalPhone(phone);
    setIsModalOpen(true);
  };

  
  const handleCancelClick = () => {
    setIsModalOpen(false);
  };


  const handleUpdateClick = async() => {
    try {
      if(!modalUserName.trim()){
         toast.error("Please add name");
         return
      }
      if(!modalPhone.trim()){
        toast.error("Please add phone number");
        return
      }
      const phoneRegex = /^[0-9]+$/;
  
  if (!phoneRegex.test(modalPhone)) {
      toast.error("Please add a valid phone number");
      return;
  }
      const data = {
        name:modalUserName,
        phone:modalPhone,
        userId
      }
      const response = await editUserProfileService(data);
      if(response.success){
        dispatch(updateUserProfile({ name: modalUserName, phone: modalPhone }));
        setUserName(modalUserName);
        setPhone(modalPhone);
        setIsModalOpen(false);
        toast.success("Details updated successfully");

      }
      
    } catch (error) {
       console.log("Error occur in handleUpdateClick: ", error);
       throw error
      
    }
    
  };

  return (
    <div className="flex items-center relative justify-center min-h-[100%] rounded-xl bg-providerBlueSecondary">
      <div className="w-full h-auto max-w-md p-6 bg-white rounded-lg">
        {/* Form Heading */}
        <h1 className="text-center text-3xl font-bold text-gray-800 mb-6">User Details</h1>

        {/* Edit Button */}
        <div className="absolute top-2 right-2 p-2 bg-blue-400 rounded-lg">
          <button onClick={handleEditClick}>Edit</button>
        </div>

        {/* Name Field */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-center text-gray-700 mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={useName}
            readOnly
            className="w-full border text-center border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 bg-gray-200"
          />
        </div>

        {/* Phone Field */}
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-center text-gray-700 mb-1">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            readOnly
            className="w-full border text-center border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 bg-gray-200"
          />
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-center text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            readOnly
            className="w-full border text-center border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 bg-gray-200"
          />
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-customBlue bg-opacity-100 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-center text-2xl font-bold mb-4">Edit User Details</h2>

            {/* UserName Field */}
            <div className="mb-4">
              <label htmlFor="modalName" className="block text-sm font-medium mb-1">
                Name
              </label>
              <input
                id="modalName"
                type="text"
                value={modalUserName}
                onChange={(e) => setModalUserName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Phone Field */}
            <div className="mb-4">
              <label htmlFor="modalPhone" className="block text-sm font-medium mb-1">
                Phone
              </label>
              <input
                id="modalPhone"
                type="tel"
                value={modalPhone}
                onChange={(e) => setModalPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-between">
              <button
                onClick={handleCancelClick}
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateClick}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfileForm;
