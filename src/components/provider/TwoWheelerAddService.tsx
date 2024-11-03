import { useEffect, useLayoutEffect, useState  } from "react"
import { toast } from "sonner";
import { addGenralRoadServices, addSubService, getAllServices, removeService, removeSubService } from "../../services/provider/providerService";
import { IAddSubServiceData, IGeneralService, IRoadService, IServiceData, IServices } from "../../interface/provider/iProvider";
import { useSelector } from "react-redux";
import { FiEdit } from "react-icons/fi";
import { FaTrashAlt } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
import Swal from "sweetalert2";
import { BsThreeDots } from "react-icons/bs";







function TwoWheelerAddService() {

 

         const [generalServices, setGeneralServices] = useState<IGeneralService[] | []>([]);
         const [roadServices, setRoadServices] = useState<IRoadService[] | []>([]);
         const providerId = useSelector((state:any) => state.provider.providerInfo?.id);
         const [showModal, setShowModal] = useState<boolean>(false);
         const [selectedService, setSelectedService] = useState<IGeneralService | null>(null);
         const [startingPrice, setStartingPrice] = useState<{[key:string]:number}>({});
         const [dropdownOpen, setDropdownOpen] = useState<string>("")
        
         useEffect(() => {
          const fetchData = async () => {
             try {
                  
                  const response = await getAllServices(providerId, 2);
              
              if (response.success) {
                  const generalServices = response.providerGeneralServiceData
                  const roadServices = response.providerRoadServiceData
                setGeneralServices(generalServices);
                setRoadServices(roadServices);
              }
             } catch (error) {
               toast.error("Failed to fetch the data");
             }
          };
        
          fetchData();  
        }, []); 

        const handleAddGeneralService = async(serviceId: string, category:string) => {
                    try {

                        const serviceData :IServiceData = {
                             serviceId,
                             category,
                             providerId,
                             vehicleType:"twoWheeler"
                        }
                        const response = await addGenralRoadServices(serviceData);
                        if(response.success){
                          const updateGeneralService = generalServices.map((service) => {
                               if(service.typeid === serviceId){
                                   return {
                                      ...service,
                                      isAdded:true,
                                   }
                               }
                               return service
                          })
                          setGeneralServices(updateGeneralService);
                          toast.success("Successfully added!!")
                        }
                      
                    } catch (error) {
                        console.log("Error in handleAddGeneral service: ",error);
                        throw error
                      
                    }
        }

        const handleAddRoadService = async (serviceId:string) => {

                  const serviceData :IServiceData ={
                    providerId,
                    category:"road",
                    serviceId,
                    vehicleType:"twoWheeler"
                  }
                 const response = await addGenralRoadServices(serviceData);
                 if(response.success){
                    const updatedRoadService = await roadServices.map((service) => {
                         if(service.typeid === serviceId){
                             return {
                                ...service,
                                isAdded:true
                             }
                         }
                         return service
                    })
                    setRoadServices(updatedRoadService);
                    toast.success("Added Successfully!!")
                 }
        }

        const handleAddStartingPrice = async (subServiceId:string, selectedServiceId:string) => {
          const newSubTypeData = { type: subServiceId, startingPrice: startingPrice[subServiceId], vehicleType: "2" };
          const data: IAddSubServiceData = {
            providerId: providerId,
            serviceId: selectedServiceId,
            newSubType: newSubTypeData,
          };
           const response  = await addSubService(data);
           if(response.success){
              const updatedGeneralService = generalServices.map((service) => {
                    if(service?.typeid === selectedServiceId){
                         return {
                             ...service,
                             subType:service.subType.map((subService) => {
                                  if(subService._id === subServiceId){
                                      return {
                                          ...subService,
                                          isAdded:true,
                                          priceRange:startingPrice[subServiceId].toString()
                                      }
                                  }
                                  return subService
                             })
                         }
                    }
                    return service
              });
              const updatedSelectedService: IGeneralService = {
                category: selectedService?.category ?? "general", 
                image: selectedService?.image ?? "",               
                isAdded: selectedService?.isAdded ?? false,       
                typeid: selectedService?.typeid ?? "",            
                typename: selectedService?.typename ?? "Unknown", 
                subType: selectedService?.subType?.map((subService) => {
                  if (subService._id === subServiceId) {
                    return {
                      ...subService,
                      isAdded: true,
                      priceRange: startingPrice[subServiceId].toString(), 
                    };
                  }
                  return subService;
                }) ?? [], 
              };
              setSelectedService(updatedSelectedService)
              setGeneralServices(updatedGeneralService)
             toast.success("Successfully added!!")
           }else{
            toast.error("Something went wrong!!")
           }
             
            
        }

        const handleViewService = (service:IGeneralService) => {
            setShowModal(true);
            setSelectedService(service);
        }

        const closeModal = () => {
            setShowModal(false);
            setSelectedService(null)
        }

        const handleStartingPriceChange = (subServiceId:string, newPrice:number) => {
                setStartingPrice((prevPrices) => ({
                     ...prevPrices,
                     [subServiceId]:newPrice
                }))
                console.log("This is stargingPrice: ",startingPrice)
        }
        
        const confimAddService = (serviceId:string, category:string, serviceName:string) => {
          Swal.fire({
            title: `${serviceName}`,
            text: `Do you want to add ${category} Service ?`,
            showCancelButton: true,
            cancelButtonColor: '#d33',
            icon: 'question',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Add',
          }).then((result) => {
            if (result.isConfirmed) {
              if(category === 'road'){
                handleAddRoadService(serviceId,)
              }
              else if(category === 'general'){
                handleAddGeneralService(serviceId,category )              }
             
            }
          });
        };

        const toggleDropdown = (serviceId:string) => {
                setDropdownOpen((prev) => (prev === serviceId?"":serviceId))
        }

        useEffect(() => {
          const handleOutsideClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest(".dropdown-menu")) {
              closeDropdown();
            }
          };
            document.addEventListener("mousedown", handleOutsideClick);
          return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
          };
        }, []);

        const closeDropdown = () => {
           setDropdownOpen("")
        }

        const handleRemoveSubService = async(subServiceId:string, serviceId:string) => {
          try {
                const data = {
                  providerId,
                  subServiceId,
                  serviceId,
                  vehicleType:"2"
                
                }
                const response = await removeSubService(data);

                if(response.success){
                  const updateGeneralService = generalServices.map((service) => {
                         if(service.typeid === serviceId){
                              return {
                                  ...service,
                                  subType:service.subType.map((subService) => {
                                        if(subService._id === subServiceId){
                                          const { priceRange, ...updatedSubService} = subService
                                            return {
                                              ...updatedSubService,
                                              isAdded:false,
                                            }
                                        }
                                        return subService
                                  })
                              }
                         }
                         return service
                  })
                  const updatedSelectedService: IGeneralService = {
                    category: selectedService?.category ?? "general", 
                    image: selectedService?.image ?? "",               
                    isAdded: selectedService?.isAdded ?? false,       
                    typeid: selectedService?.typeid ?? "",            
                    typename: selectedService?.typename ?? "Unknown", 
                    subType: selectedService?.subType?.map((subService) => {
                      if (subService._id === subServiceId) {
                        const {priceRange, ...updatedSubService} = subService
                        console.log("kkkk",subService,subServiceId);
                        
                        return {
                          ...updatedSubService,
                          isAdded: false,
                          priceRange:undefined
                           
                        };
                      }
                      return subService;
                    }) ?? [], 
                  };
                  setStartingPrice((prevStartingPrice) => {
                    const newStarting = {...prevStartingPrice};
                    delete newStarting[subServiceId]
                    return newStarting;
                  });
                  setGeneralServices(updateGeneralService);
                  setSelectedService(updatedSelectedService)
                  toast.success("Successfully Removed")
                }
                
            
          } catch (error) {
               console.log("Error in handleRemoveSubService: ",error);
               throw error
            
          }
        }

        const handleRemoveService = async (serviceId:string,category:string) => {
                     try {
                          const response = await removeService(providerId, serviceId, "2")

                           if(response.success){
                                if(category=== 'road'){

                                   const updatedRoadService = roadServices.map((service) => {
                                            if(service.typeid === serviceId){
                                                return {
                                                   ...service,
                                                   isAdded:false
                                                }
                                            }
                                            return service
                                   })
                                   setRoadServices(updatedRoadService)

                                }else if(category === 'general'){

                                     const updatedGeneralService = generalServices.map((service) => {
                                            if(service.typeid === serviceId){
                                                return {
                                                   ...service,
                                                   isAdded:false,
                                                }
                                            }
                                            return service
                                     })
                                     setGeneralServices(updatedGeneralService)
  
                                }
                                toast.success("Successfully removed!!")
                           }
                      
                     } catch (error) {
                         console.log("Error in  handleRemoveService: ",error);
                         throw error
                      
                     }
              
            
        }

        const confimDeleteService = (serviceId:string, category:string, serviceName:string) => {
                               
          Swal.fire({
            title: `${serviceName}`,
            text: `Do you want to remove service ?`,
            showCancelButton: true,
            cancelButtonColor: '#d33',
            icon: 'question',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Remove',
          }).then((result) => {
            if (result.isConfirmed) {
                handleRemoveService(serviceId,category)
             
            }
          });          

        }

        const confirmRemoveSubService = (subServiceId:string, serviceId:string,subServiceName:string) => {

          Swal.fire({
            title: `${subServiceName}`,
            text: `Do you want to remove Sub-service ?`,
            showCancelButton: true,
            cancelButtonColor: '#d33',
            icon: 'question',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Remove',
          }).then((result) => {
            if (result.isConfirmed) {
              
              handleRemoveSubService(subServiceId, serviceId)
            }
          });     

        }

       useEffect(() => {
        console.log("selectedService: ",selectedService )
       },[selectedService]) 
        
  return (
    <div>
      <div className="bg-gray-300 h-20 rounded-xl flex flex-row justify-center items-center mb-5">
        <h1 className="text-center items-center text-2xl font-semibold ">Add Two wheeler Services</h1>
      </div>

      {/* service section */}

      <div className="flex flex-col">
        <div className="flex flex-col gap-4">
          <h1 className="text-center text-xl font-semibold my-5">General services</h1>
          <div className="bg-gray-100 rounded-md">
            <div className="animate-fade animate-ease-out grid grid-cols-1 md:grid-cols-3 gap-4">
              {generalServices.map((service) => (
                <div key={service.typeid} className="bg-white shadow-lg rounded-lg p-4 flex items-center border border-gray-400 relative">
                  <img src={service.image} alt={service.typename} className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-grow text-center">
                    <h2 className="text-lg font-semibold">{service.typename}</h2>
                  </div>

                  <div>
                  {dropdownOpen === service.typeid && (
                <div className="absolute right-0 top-8 bg-white border border-gray-500 shadow-lg rounded-lg p-2 dropdown-menu">
                  <button
                    className="text-red-500 hover:bg-red-50 w-full text-left p-1 rounded-md"
                    onClick={() => confimDeleteService(service.typeid, service.category, service.typename)}
                  >
                    Remove
                  </button>
                </div>
              )}
                    {service.isAdded? (
                       <BsThreeDots
                       className="text-xl cursor-pointer absolute right-3 top-0"
                       onClick={() => toggleDropdown(service.typeid)}
                     />
                    ):""}
                    {service.isAdded ? (
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={() => handleViewService(service)}
                      >
                        View
                      </button>
                    ) : (
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={() => confimAddService(service.typeid, "general", service.typename)}
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-center text-xl font-semibold my-5">Road Services</h1>
          <div className="bg-gray-100 rounded-md" >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roadServices.map((service) => (
                <div key={service.typeid} className="animate-fade animate-ease-out bg-white shadow-lg rounded-lg p-4 flex items-center border border-gray-400 relative">
                  <img src={service.image} alt={service.typename} className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-grow text-center">
                    <h2 className="text-lg font-semibold">{service.typename}</h2>
                  </div>

                  <div>
                    {
                      service.isAdded ?
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        onClick={() => confimDeleteService(service.typeid, service.category, service.typename)}
                        >
                          Remove
                        </button> :
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={() => confimAddService(service.typeid, "road", service.typename)}
                        >
                          Add
                        </button>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {showModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg h-[80%] w-2/5 max-w-3xl relative overflow-y-auto">
            <button
              className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 absolute top-4 right-4"
              onClick={closeModal}
            >
              X
            </button>

            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
              {selectedService.typename}
            </h2>

            <div className="space-y-4 mb-4">
              {selectedService.subType.map((subItem) => {
                  console.log("Price",subItem, startingPrice._id);
               return (
                <div key={subItem._id} className="flex items-center justify-between border-b border-gray-300 py-3">
                <span className="flex-shrink-0 text-lg font-semibold text-gray-700 w-1/3">
                  {subItem.type}
                </span>
                <input
                  type="number"
                  value={startingPrice[subItem._id] || subItem.priceRange || ""} 
                  onChange={(e) => handleStartingPriceChange(subItem._id, Number(e.target.value))}
                  placeholder="Starting Price.."
                  className="w-52 p-2 border border-gray-300 rounded text-center focus:outline-none focus:border-blue-500"
                />

                <div className="flex items-center space-x-3">
                  {subItem.isAdded ? (
                    <>
                      {/* <FiEdit className="text-blue-500 text-xl cursor-pointer hover:scale-110 transition transform" /> */}
                      <FaTrashAlt className="text-red-500 text-xl cursor-pointer hover:scale-110 transition transform" 
                      onClick={() => confirmRemoveSubService(subItem._id, selectedService.typeid, subItem.type)}/>
                    </>
                  ) : (
                    <IoMdAddCircleOutline
                      className="text-green-500 text-2xl cursor-pointer hover:scale-110 transition transform"
                      onClick={() => handleAddStartingPrice(subItem._id, selectedService.typeid)}
                    />
                  )}
                </div>
              </div>
               )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TwoWheelerAddService
