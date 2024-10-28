import { useEffect, useState } from "react";
import { addGenralRoadServices, addSubService, getAllServices } from "../../services/provider/providerService";
import { toast } from "sonner";
import { IAddSubServiceData, IGeneralService, IRoadService, IServiceData, IServices } from "../../interface/provider/iProvider";
import { useSelector } from "react-redux";
import { FiEdit } from "react-icons/fi"
import { FaTrashAlt } from 'react-icons/fa';
import { IoMdAddCircleOutline } from 'react-icons/io';

function FourWheelerAddService() {
  const [generalServices, setGeneralServices] = useState<IGeneralService[] | []>([]);
  const [roadServices, setRoadServices] = useState<IRoadService[] | []>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState<IGeneralService | null>(null);
  const [startingPrice, setStartingPrice] = useState<number | undefined>(undefined)

  const providerId = useSelector((state: any) => state.provider.providerInfo.id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllServices(providerId, 4);
        console.log("response",response);
        
        if (response.success) {
          const generalServices = response.providerGeneralServiceData;
          const roadServices = response.providerRoadServiceData;
          setGeneralServices(generalServices);
          setRoadServices(roadServices);
        }
      } catch (error) {
        toast.error("Failed to fetch the data");
      }
    };

    fetchData();
  }, []);

  const handleAddGeneralService = async (serviceId: string, category: string) => {
    try {
      const serviceData: IServiceData = {
        serviceId: serviceId,
        category: category,
        providerId: providerId,
        vehicleType: "fourWheeler",
      };

      const response = await addGenralRoadServices(serviceData);
      if (response.success) {
        const updatedGeneralService = generalServices.map((service) => {
          if (service.typeid === serviceId) {
            return {
              ...service,
              isAdded: true,
            };
          }
          return service;
        });
        setGeneralServices(updatedGeneralService);
        toast.success("Successfully added!!");
      }
    } catch (error) {
      console.log("Error in handleAddservice: ", error);
    }
  };

  const handleAddStartingPrice = async (subServiceId: string, selectedSerciceId: string) => {
    if (!startingPrice) {
      toast.error("Please add starting Price");
      return;
    }
  
    const newSubTypeData = { type: subServiceId, startingPrice: startingPrice, vehicleType: "4" };
    const data: IAddSubServiceData = {
      providerId: providerId,
      serviceId: selectedSerciceId,
      newSubType: newSubTypeData,
    };
  
    const response = await addSubService(data);
  
    if (response.success) {
      const updatedGeneralService = generalServices.map((service) => {
        if (service.typeid === selectedSerciceId) {
          return {
            ...service,
            subType: service.subType.map((subService) => {
              if (subService._id === subServiceId) {
                return {
                  ...subService,
                  isAdded: true,
                  priceRange: startingPrice.toString(), 
                };
              }
              return subService;
            }),
          };
        }
        return service;
      });
      
      console.log("This is selectd service berfor updating: ", selectedService)
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
              priceRange: startingPrice.toString(), 
            };
          }
          return subService;
        }) ?? [], // Ensure subType is always an array
      };
      
  
      // Toast for successful update
      toast.success("Added successfully!!");
  
      // Apply the updated data to the state
      setGeneralServices(updatedGeneralService);
      setSelectedService(updatedSelectedService);
    }
  };
  

  const handleAddRoadService = async (serviceId: string) => {
    try {
      const serviceData: IServiceData = {
        serviceId: serviceId,
        category: "road",
        providerId: providerId,
        vehicleType: "fourWheeler",
      };
      const response = await addGenralRoadServices(serviceData);
      if (response.success) {
        const updatedRoadService = roadServices.map((service) => {
          if (service.typeid === serviceId) {
            return {
              ...service,
              isAdded: true,
            };
          }
          return service;
        });
        setRoadServices(updatedRoadService);
        toast.success("Successfully Added");
      }
    } catch (error) {
      console.log("Error in handleAddRoadService: ", error);
    }
  };

  const handleViewService = (service: IGeneralService) => {
    
    setSelectedService(service);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedService(null);
  };

  return (
    <div>
      <div className="bg-gray-300 h-20 rounded-xl flex flex-row justify-center items-center mb-5">
        <h1 className="text-center items-center text-2xl font-semibold">Add Four wheeler Services</h1>
      </div>

      {/* service section */}

      <div className="flex flex-col">
        <div className="flex flex-col gap-4">
          <h1 className="text-center text-xl font-semibold my-5">General services</h1>
          <div className="bg-gray-100 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {generalServices.map((service) => (
                <div key={service.typeid} className="bg-white shadow-lg rounded-lg p-4 flex items-center border border-gray-400 relative">
                  <img src={service.image} alt={service.typename} className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-grow text-center">
                    <h2 className="text-lg font-semibold">{service.typename}</h2>
                  </div>

                  <div>
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
                        onClick={() => handleAddGeneralService(service.typeid, "general")}
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
          <div className="bg-gray-100 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roadServices.map((service) => (
                <div key={service.typeid} className="bg-white shadow-lg rounded-lg p-4 flex items-center border border-gray-400 relative">
                  <img src={service.image} alt={service.typename} className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-grow text-center">
                    <h2 className="text-lg font-semibold">{service.typename}</h2>
                  </div>

                  <div>
                    {!service.isAdded ? (
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={() => handleAddRoadService(service.typeid)}
                      >
                        Add
                      </button>
                    ) : (
                      <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Remove</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
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
            {selectedService.subType.map((subItem) => (
  <div key={subItem._id} className="flex items-center justify-between border-b border-gray-300 py-3">
    <span className="flex-shrink-0 text-lg font-semibold text-gray-700 w-1/3">
      {subItem.type}
    </span>

    <input
      type="number"
      value={subItem.priceRange || startingPrice} // Use startingPrice when priceRange is empty
      onChange={(e) => setStartingPrice(Number(e.target.value))} 
      placeholder="Starting Price.."
      className="w-52 p-2 border border-gray-300 rounded text-center focus:outline-none focus:border-blue-500"
    />

    <div className="flex items-center space-x-3">
      {subItem.isAdded ? (
        <>
          <FiEdit className="text-blue-500 text-xl cursor-pointer hover:scale-110 transition transform" />
          <FaTrashAlt className="text-red-500 text-xl cursor-pointer hover:scale-110 transition transform" />
        </>
      ) : (
        <IoMdAddCircleOutline
          className="text-green-500 text-2xl cursor-pointer hover:scale-110 transition transform"
          onClick={() => handleAddStartingPrice(subItem._id, selectedService.typeid)} 
        />
      )}
    </div>
  </div>
))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FourWheelerAddService;