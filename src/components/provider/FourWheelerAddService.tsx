import { useEffect , useState} from "react";
import { addGenralServices, getAllServices } from "../../services/provider/providerService";
import { toast } from "sonner";
import { IGeneralService, IRoadService, IServiceData, IServices } from "../../interface/provider/iProvider";
import { useSelector } from "react-redux";

function FourWheelerAddService() {
         const [generalServices, setGeneralServices] = useState<IGeneralService[] | []>([]);
         const [roadServices, setRoadServices] = useState<IRoadService[] | []>([]);
         const providerId = useSelector((state:any) => state.provider.providerInfo.id);

        
         useEffect(() => {
          const fetchData = async () => {
            try {
              const response = await getAllServices(providerId, 4);
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
        

        const handleAddGeneralService = async(serviceId:string, category:string) => {
              try {
                    const serviceData:IServiceData = {
                          serviceId:serviceId,
                          category:category,
                          providerId:providerId,
                          vehicleType:"fourWheeler"
                    }
                    
                  const response = await addGenralServices(serviceData);
                  if(response.success){
                       const updatedGeneralService = generalServices.map((service) => {
                           if(service.typeid === serviceId){
                               return {
                                   ...service,
                                   isAdded : true
                               }
                              
                           }
                           return service
                       })
                       setGeneralServices(updatedGeneralService)
                       toast.success("Successfully added!!")
                  }
                  
                  console.log("Resposne in hadleAddGeneralService: ", response);

                  
                
              } catch (error) {
                  console.log("Error in handleAddservice: ", error)
                
              }
        }
        
        
  return (
    <div>
      <div className="bg-gray-300 h-20 rounded-xl flex flex-row justify-center items-center mb-5">
        <h1 className="text-center items-center text-2xl font-semibold ">Add Two wheeler Services</h1>
      </div>

      {/* service section */}

      <div className="flex flex-col">
        <div className="flex flex-col gap-4">
          <h1 className="text-center text-xl font-semibold my-5">General services</h1>
          <div className="bg-gray-200 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {generalServices.map((service) => (
                <div key={service.typeid} className="bg-white shadow-lg rounded-lg p-4 flex items-center border border-gray-400 relative">
                  <img src={service.image} alt={service.typename} className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-grow text-center">
                    <h2 className="text-lg font-semibold">{service.typename}</h2>
                  </div>

                  <div>
                    {
                      service.isAdded ?
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"

                        >
                          View
                        </button> :
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                         onClick={() => handleAddGeneralService(service.typeid, 'general')}
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
        <div className="flex flex-col gap-4">
          <h1 className="text-center text-xl font-semibold my-5">Road Services</h1>
          <div className="bg-gray-200 rounded-md" >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roadServices.map((service) => (
                <div key={service.typeid} className="bg-white shadow-lg rounded-lg p-4 flex items-center border border-gray-400 relative">
                  <img src={service.image} alt={service.typename} className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-grow text-center">
                    <h2 className="text-lg font-semibold">{service.typename}</h2>
                  </div>

                  <div>
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    // onClick={() => openModal(service)}
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FourWheelerAddService
