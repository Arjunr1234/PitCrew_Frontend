import { useEffect, useState } from "react";
import { getAllServices } from "../../services/user/user";
import { useNavigate } from "react-router-dom";
//import { data } from "../../assets/exportData";

function RoadServiceComp() {
  interface Data {
    _id: string;
    category: string;
    serviceType: string;
    imageUrl: string;
    isActive: boolean;
  }

  const [roadService, setRoadServices] = useState<Data[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate()

  const fetchGeneralService = async () => {
    try {
      const response = await getAllServices()
      const filteredData = response.serviceData.filter((service:Data) => service.category === 'road');
      setRoadServices(filteredData);
    } catch (error) {
      console.log("Error in fetchGeneralService: ", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchGeneralService();
  }, []);

  const filteredService = roadService.filter((service) =>
    service.serviceType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="flex flex-col bg-white text-center mt-8">
        <h1 className="text-xl font-semibold m-2">Road Services</h1>

        <div className="m-2">
          <input
            type="text"
            placeholder="Search here.."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-3 border bg-gray-100 text-center border-gray-300 rounded-3xl w-full md:w-96 focus:outline-none focus:border-blue-500"
           />
        </div>

        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {filteredService.length > 0 ? (
              filteredService.map((service) => (
                <div
                  onClick={() => navigate('/add-vehicle-details',{state:{serviceId:service._id}})}
                  key={service._id} 
                  className="transition-transform transform hover:scale-105 cursor-pointer animate-fade-up bg-gray-300 mx-6 border rounded-lg p-4 flex items-center hover:bg-gray-400 relative"
                >
                  <img
                    src={service.imageUrl}
                    alt=""
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-grow text-center">
                    <h2 className="text-lg font-semibold">{service.serviceType}</h2>
                  </div>
                </div>
              ))
            ) : (
              <p>No available service found</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default RoadServiceComp;
