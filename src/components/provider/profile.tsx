import { useEffect, useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { getProviderDetailsService, updatePoviderProfile, updateProfilePicture } from "../../services/provider/providerService";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { updateProfilePicService } from "../../services/user/user";
import providerImg from '../../images/providerDefaltImg.jpg'
import { useNavigate } from "react-router-dom";

function ProfileComp() {
 

  const [workshopName, setWorkshopName] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [ownerName, setOwnerName] = useState<string>("");
  const [profilePic, setProfilePic] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalWorkshopName, setModalWorkshopName] = useState<string>("");
  const [modalOwnerName, setModalOwnerName] = useState<string>("");
  const [modalPhone, setModalPhone] = useState<string>("");
  const [modalAbout, setModalAbout] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {id} = useSelector((state:any) => state.provider?.providerInfo);
 // const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate()

  useEffect(() => {

    const fetchUserDetails = async() => {
         const response = await getProviderDetailsService(id);

         if(response.success){
            const data = response.providerData;
            const image = data.logoUrl === ""? providerImg: data.logoUrl
            
            setWorkshopName(data.workshopName);
            setAbout(data.about);
            setOwnerName(data.ownerName);
            setProfilePic(data.logoUrl);
            setEmail(data.email);
            setPhone(data.mobile);
            setLocation(data.workshopDetails.address);
            setProfilePic(image)


         }
    }
    fetchUserDetails()
    

  }, []);


  const handleModalOpen = () => {
    setModalWorkshopName(workshopName);
    setModalOwnerName(ownerName);
    setModalPhone(phone);
    setModalAbout(about);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {

    if(!modalWorkshopName.trim()){
      toast.error("Please add workshopName");
      return
    }
    if(!ownerName.trim()){
      toast.error("Please add owner name");
      return
    }
    if (!modalPhone.trim()) {
      toast.error("Please add phone number");
      return;
  }
  
  const phoneRegex = /^[0-9]+$/;
  
  if (!phoneRegex.test(modalPhone)) {
      toast.error("Please add a valid phone number");
      return;
  }
    if(!modalAbout.trim()){
      toast.error("Please add about");
      return
    }
   
    const data = {
      workshopName:modalWorkshopName,
      ownerName:modalOwnerName,
      phone:modalPhone,
      about:modalAbout,
      providerId:id
    }
    const response = await updatePoviderProfile(data);
    if(response.success){
      setWorkshopName(modalWorkshopName);
      setOwnerName(modalOwnerName);
      setPhone(modalPhone);
      setAbout(modalAbout);
      setIsModalOpen(false);
      toast.success('Successfully updated!!')
    }
    
  };


  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      formData.append('providerId', id);

    //  setIsLoading(true);

      try {

        const response = await updateProfilePicture(formData);
        
        if(response.success){
           setProfilePic(response.imageUrl);
           toast.success("Successfully updated")
        }else {
          toast.error("Failed to update profile picture");
        }
        
      } catch (error) {
         console.log("Error in updateImage section: ", error);
         throw error
        
      }
    }
  }

  


  return (
    <div className="bg-gray-100 h-screen flex justify-center items-center animate-fade-down">
      <div className="flex flex-col p-6 gap-y-6 w-full max-w-4xl">
        {/* Title Section */}
        <div className="p-5 flex bg-white rounded-lg shadow-md relative">
          <h1 className="font-atma flex-1 text-4xl text-center text-blue-400">
            Workshop Details
          </h1>
          <div className="flex gap-x-3">
            <button className="p-2  rounded-lg bg-providerBlueSecondary hover:bg-providerBluePrimary"
              onClick={handleModalOpen}>
              Edit
            </button>
            <div className="relative group">
              <button
                className="p-2 rounded-lg bg-providerBlueSecondary hover:bg-providerBluePrimary"
                onClick={() => navigate('/provider/reset-password')}
              >
                🔑
              </button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 shadow-lg">
                Reset Password
              </div>
            </div>

          </div>
        </div>

        {/* Workshop Details Section */}
        <div className="flex items-center bg-blue-400 rounded-lg shadow-md p-4 relative animate-jump-in animate-once">
          {/* Image on the left */}
          <div className="relative">
            <img
              src={profilePic}
              alt="Workshop"
              className="w-32 h-32 rounded-lg border-4 border-white shadow-lg"
            />
            {/* Camera Icon with Tooltip */}
            <div className="group relative">
              <FaCamera className="absolute bottom-0 right-0 text-white bg-violet-500 p-1 rounded-full w-7 h-7 cursor-pointer"
                onClick={handleIconClick} />
              <div className="absolute bottom-1 left-1  transform -translate-x-1/2 bg-gray-700 text-white text-sm rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Update Photo
              </div>
            </div>
            <input type="file"
              ref={fileInputRef}
              className='hidden'
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {/* Workshop name on the right */}
          <h1 className="flex-1 text-center font-mono text-5xl text-white font-semibold">
            {workshopName}
          </h1>
        </div>


        {/* About Section */}
        <div className="flex flex-col bg-green-400 rounded-lg shadow-md p-2 ">
          <h1 className="text-center text-xl text-white font-semibold">
            About
          </h1>
          <p className="text-white text-center mt-2">{about === "" ? <span className="text-red-400">Please provider details about your workshop</span> : about}</p>
        </div>

        {/* Owner and Email Section */}
        <div className="flex flex-row justify-between gap-x-3 w-full">
          <div className="bg-gray-300 w-full text-center p-4 rounded-lg shadow-md animate-fade-right">
            <label className="block text-sm font-semibold text-gray-700">
              Owner Name
            </label>
            <h1 className="text-gray-800 font-medium">{ownerName}</h1>
          </div>
          <div className="bg-gray-300 w-full text-center p-4 rounded-lg shadow-md animate-fade-left">
            <label className="block text-sm font-semibold text-gray-700">
              Email
            </label>
            <h1 className="text-gray-800 font-medium">{email}</h1>
          </div>
        </div>

        {/* Phone and Location Section */}
        <div className="flex flex-row justify-between gap-x-3 w-full">
          <div className="bg-gray-300 w-full text-center p-4 rounded-lg shadow-md animate-fade-right">
            <label className="block text-sm font-semibold text-gray-700">
              Phone
            </label>
            <h1 className="text-gray-800 font-medium">{phone}</h1>
          </div>
          <div className="bg-gray-300 w-full text-center p-4 rounded-lg shadow-md animate-fade-left">
            <label className="block text-sm font-semibold text-gray-700">
              Location
            </label>
            <h1 className="text-gray-800 font-medium">{location}</h1>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl transform scale-105 transition-all duration-300 ease-out p-8 w-full max-w-lg">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
              Edit Workshop Details
            </h2>

            {/* Input Fields */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Workshop Name
                </label>
                <input
                  type="text"
                  value={modalWorkshopName}
                  onChange={(e) => setModalWorkshopName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter workshop name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Owner Name
                </label>
                <input
                  type="text"
                  value={modalOwnerName}
                  onChange={(e) => setModalOwnerName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter owner name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={modalPhone}
                  onChange={(e) => setModalPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  About
                </label>
                <textarea
                  value={modalAbout}
                  onChange={(e) => setModalAbout(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Write a brief description"
                  rows={4}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end mt-8 gap-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-200 px-5 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-600 transition shadow-sm"
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

export default ProfileComp;
