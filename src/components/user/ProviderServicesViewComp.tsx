import { useLocation } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { checkAvalibeSlotService, getProviderDetailsWithSubService, paymentService } from "../../services/user/user";
import { IProviderData, IServiceSubType } from "../../interface/user/user";
import DatePicker from "react-datepicker";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import {loadStripe} from '@stripe/stripe-js'
import DefaultImg from '../../images/providerDefaltImg.jpg'



function ProviderServicesViewComp() {
  const location = useLocation();
  const vehicleDetails = location.state?.vehicleDetails;
  const providerId = location.state?.providerId

  useEffect(() => {
     fetchProviderSubServiceDetails()
  },[])

  
  const [providerDetails, setProviderDetails] = useState<IProviderData | null>(null); 
  const [selectedSubService, setSelectedSubService] = useState<IServiceSubType[] | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  //const [platformFee, setPlatformFee] = useState<number>(50);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null)
  const {id, mobile} = useSelector((state:any) => state.user?.userInfo);
  const stripeKey = import.meta.env.VITE_STRIPE_KEY
  const platformFee = 50;



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

  const closeModal = () => setIsModalOpen(false)

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


  const handleBookService = async() => {
  
    if(!selectedSubService || selectedSubService?.length === 0){
      toast.error("Please select service!!");
      return 
    }
    if(!selectedDate){
      toast.error("Please select a date!!");
      return
    }
    console.log("This is date: ", selectedDate)


     const checkAvalibleSlot = await checkAvalibeSlotService(selectedDate, providerDetails?.providerDetails._id as string);
     if(checkAvalibleSlot.success){
      setSelectedSlotId(checkAvalibleSlot.slotId)
      setIsModalOpen(true)
     }
    
    
    
}

const calculateTotalPrice = (subServices:any) => {
  return subServices.reduce((total:number, service:any) => total + Number(service.startingPrice), 0);
};

const handlePayment = async() => {
  const stripe = await loadStripe(stripeKey)
    const data = {
       vehicleDetails,
       providerId,
       userId:id,
       selectedServices:selectedSubService,
       userPhone:mobile,
       platformFee:platformFee,
       slotId:selectedSlotId,
       totalPrice:calculateTotalPrice(selectedSubService),      
    }
    console.log("This is the data: ", data)
    try {
        const response = await paymentService(data);

        const session = response.session
        // if(session.success){
        //    window.location.href = session.url
        // }

         stripe?.redirectToCheckout({
          sessionId:session.id
        })

        
      
    } catch (error) {
        
      
    }
}


useEffect(() => {
  console.log("This is the selectedService; ", selectedSubService);
  console.log("This is the vehicleDetails; ", vehicleDetails)

},[selectedSubService])

  return (
    <div className="h-screen ">
      <div className="flex flex-col md:flex-row bg-darkBlue h-full md:h-4/5 p-4 md:p-6 gap-6 md:gap-8">
  {/* Right section (on top in mobile view) */}
  <div className="order-1 md:order-2 flex flex-col text-white justify-center items-center gap-6 md:gap-10 w-full md:w-1/2 h-full animate-flip-up">
    <h1 className="text-2xl md:text-4xl font-semibold font-atma text-center">
      {providerDetails?.providerDetails.workshopName || "Workshop Name"}
    </h1>
    <img
      src={providerDetails?.providerDetails.logoUrl || DefaultImg}
      alt="Profile Picture"
      className="w-24 h-24 md:w-40 md:h-40 lg:w-80 lg:h-80 rounded-full border-4 border-white shadow-lg object-cover"
    />
  </div>

  {/* Left section (below in mobile view) */}
  <div className="order-2 md:order-1 flex flex-col w-full md:w-1/2 h-64 md:h-full animate-flip-up items-center justify-center">
    <div className="flex flex-col font-montserrat py-5 text-white space-y-4 relative items-center">
      <h1 className="text-3xl md:text-5xl font-bold text-center">{vehicleDetails.serviceName}</h1>
      <h1 className="text-3xl md:text-5xl my-6 md:my-10 text-center">Services</h1>

      <div className="flex items-center gap-2">
        <FaUser className="text-lg md:text-xl text-customYellow" />
        <h1 className="text-base md:text-lg text-center">{providerDetails?.providerDetails.ownerName || "Owner Name"}</h1>
      </div>

      <div className="flex items-center gap-2">
        <FaEnvelope className="text-lg md:text-xl text-customYellow" />
        <h1 className="text-base md:text-lg text-center">{providerDetails?.providerDetails.email || "email@example.com"}</h1>
      </div>

      <div className="flex items-center gap-2">
        <FaPhone className="text-lg md:text-xl text-customYellow" />
        <h2 className="text-base md:text-lg text-center">{providerDetails?.providerDetails.mobile || "9393939353"}</h2>
      </div>

      <div className="flex items-center gap-2">
        <FaMapMarkerAlt className="text-lg md:text-xl text-customYellow" />
        <h1 className="text-base md:text-lg text-center">{providerDetails?.providerDetails.workshopDetails.address || "Location"}</h1>
      </div>

      {/* Button aligned to the center */}
      <div className="py-4 md:py-5 animate-pulse">
        <button
          className="p-2 md:p-3 px-4 md:px-5 font-semibold mt-4 bg-customYellow text-darkBlue rounded shadow-dark-yellow hover:shadow-dark-yellow-lg transition-shadow duration-200"
          onClick={handleBookService}
        >
          Book Service
        </button>
      </div>
    </div>
  </div>
</div>


      {/* Service section */}
      <div className="p-10 flex flex-col ">
        <div className="text-center">
        <div className="flex items-center flex-col gap-y-3 md:flex-row bg-gray-200 rounded-lg  justify-between w-full mb-6">
  {/* Centered H1 */}
  <h1 className="text-5xl font-semibold mx-auto">Services</h1>

  {/* Right Aligned Input Box */}
  <div className="relative max-w-sm m-3">
  
  <DatePicker
    selected={selectedDate}
    onChange={(date: Date | null) => setSelectedDate(date)}
    inline
    minDate={new Date()}
    dateFormat="yyyy/MM/dd"
    className="bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  />
</div>

</div>

          
        

          

              
<div id="datepicker-inline" inline-datepicker data-date="02/25/2024"></div>



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

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
          <div className="bg-white flex flex-col p-6 rounded-lg h-auto w-11/12 md:w-2/5 gap-y-2">
            <div className="">
              <h1 className="text-2xl text-center font-montserrat font-semibold">Confim Booking</h1>
            </div>
            <div className=" rounded-lg  p-5 flex flex-col gap-y-3">
              <div className="flex flex-row font-montserrat p-2 rounded-lg text-white bg-darkBlue text-center text-2xl font-semibold justify-around">

                <h1>{providerDetails?.providerDetails.workshopName}</h1>
              </div>

              <div className="table w-full bg-blue-100 p-2 rounded-lg">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className=" text-center">
                      <th className="p-2 border-b">Service Type</th>
                      <th className="p-2 border-b">Starting Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSubService?.map((service) => (
                      < tr className="text-center" key={service._id} >
                        <td className="p-2 border-b">{service.type}</td>
                        <td className="p-2 border-b">₹ {service.startingPrice}</td>
                      </tr>
                    ))}
                    {/* Total row */}

                  </tbody>
                </table>
              </div>
              <div className="p-2 justify-around flex flex-row bg-blue-100 rounded-lg text-center">
                  <h1 className="text-md text-orange-400">Platform fee</h1>
                  <h1>₹ {platformFee}</h1>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg text-center">

                <h1 className="text-2xl font-montserrat ">Total Price</h1>
                <h1 className=" text-3xl font-montserrat">₹ {calculateTotalPrice(selectedSubService) + platformFee}</h1>


              </div>
              <div className="flex flex-row mt-2 rounded-lg gap-x-2">
                <button className="p-2 bg-red-500 hover:bg-red-600 w-full rounded-lg" onClick={closeModal}>Cancell</button>
                <button className="p-2 bg-customYellow hover:bg-yellow-500 w-full rounded-lg" onClick={handlePayment}>Proceed Payment</button>
              </div>



            </div>
          </div>
        </div>
      )}

      



    </div>
  );
}

export default ProviderServicesViewComp;
