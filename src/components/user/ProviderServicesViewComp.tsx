import { useLocation } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getProviderDetailsWithSubService } from "../../services/user/user";
import { IProviderData, IServiceSubType } from "../../interface/user/user";
import { toast } from "sonner";



function ProviderServicesViewComp() {
  const location = useLocation();
  const vehicleDetails = location.state?.vehicleDetails;
  const providerId = location.state?.providerId

  useEffect(() => {
     fetchProviderSubServiceDetails()
  },[])

 
  
  const [providerDetails, setProviderDetails] = useState<IProviderData | null>(null); 
  const [selectedSubService, setSelectedSubService] = useState<IServiceSubType[] | null>(null)


  const fetchProviderSubServiceDetails = async() => {
      try {

          const vehicleType = vehicleDetails.vehicleType;
          const serviceId = vehicleDetails.serviceId
          const response = await getProviderDetailsWithSubService(providerId, vehicleType, serviceId );
          setProviderDetails(response.providerData)
        
      } catch (error) {
            console.log("Error in fetchProviderSubServiceDetails: ", error)
            throw error
      }
  }

  const handleAddSubService = (id:string) => {
         setProviderDetails((prevData) => 
         prevData? 
         {...prevData, services:{...prevData.services, 
         subType:prevData.services.subType.map((service) => {
            if(service._id === id){
            return{
              ...service, isAdded:true
            }
            }
            return service
            })}}:
         null)
         const addedService = providerDetails?.services.subType.find((service) => service._id === id);
         
    
        
        setSelectedSubService((prevService) => {
           if(!addedService) return prevService
           return prevService?[...prevService, addedService]:[addedService]
        })
 
     
  }

  const handleRemoveSubService = (id:string) => {
       setProviderDetails((prevDetails) => {
          return  prevDetails?
            {...prevDetails, services:{...prevDetails.services, 
              subType:prevDetails.services.subType.map((service) => {
                 if(service._id === id){
                    return{
                      ...service,
                      isAdded:false
                    }
                 }
                 return service
              } )}}:null
       })
 
       setSelectedSubService((prevService) => {
           return prevService? prevService.filter((service) => service._id !== id):null
       })
  }


  const handleBookService = () => {
    if(!selectedSubService || selectedSubService?.length === 0){
      toast.error("Please select service!!");
      return 
    }
    toast.success("success fully booked")
    
}

  return (
    <div className="h-screen bg-gray-200">
      <div className="flex flex-col  md:flex-row bg-darkBlue h-full md:h-4/5 p-4 md:p-2 gap-4 md:gap-2">
        {/* Left section */}
        <div className="flex flex-col w-full md:w-1/2 h-64 md:h-full animate-flip-up">
          <div className="flex flex-col font-montserrat m-6 py-5 ml-10 mt-16 text-white space-y-4">
            <h1 className="text-5xl font-bold">{vehicleDetails.serviceName}</h1>
            <h1 className="text-5xl my-10">Services</h1>
    
            <div className="flex items-center gap-2">
              <FaUser className="text-xl text-customYellow" />
              <h1 className="text-lg">{providerDetails?.providerDetails.ownerName || "Owner Name"}</h1>
            </div>

            <div className="flex items-center gap-2">
              <FaEnvelope className="text-xl text-customYellow" />
              <h1 className="text-lg">{providerDetails?.providerDetails.email || "email@example.com"}</h1>
            </div>

            <div className="flex items-center gap-2">
              <FaPhone className="text-xl text-customYellow" />
              <h2 className="text-lg">{providerDetails?.providerDetails.mobile || "9393939353"}</h2>
            </div>

            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-xl text-customYellow" />
              <h1 className="text-lg">{providerDetails?.providerDetails.workshopDetails.address || "Location"}</h1>
            </div>

            {/* Button aligned to the left */}
            <div className="py-5 animate-pulse" >
              <button className="p-3 px-5 font-semibold mt-4 bg-customYellow text-darkBlue rounded self-start shadow-dark-yellow hover:shadow-dark-yellow-lg transition-shadow duration-200"
              onClick={handleBookService} >
                Book Service
              </button>
            </div>

          </div>
        </div>

        {/* Right section */}
        <div className="flex text-white flex-col justify-center items-center gap-10 w-full md:w-1/2 h-full animate-flip-up">
          <h1 className="text-4xl md:text-6xl font-semibold font-atma text-center">
            {providerDetails?.providerDetails.workshopName || "Workshop Name"}
          </h1>
          <div className="p-4 md:p-10 h-40 md:h-80 w-40 md:w-80 rounded-full bg-black overflow-hidden">
            <img
              src={vehicleDetails?.workshopImage || ""}
              alt="Workshop"
              className="h-full w-full object-cover"
              
            />
          </div>
        </div>
      </div>

      {/* Service section */}
      <div className="p-10 flex flex-col">
        <div className="text-center">
          <h1 className="text-5xl font-semibold">Services</h1>
          {providerDetails && providerDetails.services.subType.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {providerDetails.services.subType.map((service) => (
                <div
                  key={service._id}
                  className="bg-darkBlue p-6 rounded-lg shadow-dark-yellow  text-white transition-transform duration-200 transform hover:scale-105 hover:shadow-xl"
                >
                  {/* Service Type */}
                  <h1 className="text-xl font-bold">{service.type}</h1>

                  {/* Starting Price */}
                  <h2 className="text-lg mt-2">₹{service.startingPrice}</h2>

                  <div className="flex justify-end mt-4">
                    {service.isAdded ? (
                      <button className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      onClick={() => handleRemoveSubService(service._id)}>
                        Remove
                      </button>
                    ) : (
                      <button className="p-2 bg-customYellow text-darkBlue rounded-lg hover:bg-yellow-500"
                      onClick={() => handleAddSubService(service._id)}
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-20">
              <h1 className="text-3xl font-semibold text-red-400">No Service Found!!</h1>
            </div>
          )}
        </div>
      </div>



    </div>
  );
}

export default ProviderServicesViewComp;