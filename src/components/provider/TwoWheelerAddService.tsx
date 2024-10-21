import { useEffect, useLayoutEffect, useState } from "react"
import { toast } from "sonner";
import { getAllServices } from "../../services/provider/providerService";
import { IServices } from "../../interface/provider/iProvider";







function TwoWheelerAddService() {

 

         const [generalServices, setGeneralServices] = useState<IServices[] | []>([]);
         const [roadServices, setRoadServices] = useState<IServices[] | []>([])
        
         useEffect(() => {
          const fetchData = async () => {
            try {
              const response = await getAllServices();
              if (response.success) {
                const services = response.services;
                const generalService = services.filter((service: IServices) => service.category === 'general');
                const roadServices = services.filter((service: IServices) => service.category === 'road');
                setGeneralServices(generalService);
                setRoadServices(roadServices);
              }
            } catch (error) {
              toast.error("Failed to fetch the data");
            }
          };
        
          fetchData();  
        }, []); 
        
        
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
                <div key={service.id} className="bg-white shadow-lg rounded-lg p-4 flex items-center border border-gray-400 relative">
                  <img src={service.imageUrl} alt={service.serviceType} className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-grow text-center">
                    <h2 className="text-lg font-semibold">{service.serviceType}</h2>
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
        <div className="flex flex-col gap-4">
          <h1 className="text-center text-xl font-semibold my-5">Road Services</h1>
          <div className="bg-gray-200 rounded-md" >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roadServices.map((service) => (
                <div key={service.id} className="bg-white shadow-lg rounded-lg p-4 flex items-center border border-gray-400 relative">
                  <img src={service.imageUrl} alt={service.serviceType} className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-grow text-center">
                    <h2 className="text-lg font-semibold">{service.serviceType}</h2>
                  </div>

                  <div>
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    // onClick={() => openModal(service)}
                    >
                      View
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

export default TwoWheelerAddService
