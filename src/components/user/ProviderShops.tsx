import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { vehicleDetailsService } from "../../services/user/user";
import { IworkshopDetails } from "../../interface/user/user";

function ProviderShopsComp() {
  const location = useLocation();
  const VehicleDetails = location.state?.data;
  const [providerDetails, setProviderDetails] = useState<IworkshopDetails[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    fetchWorkshopDetails();
  }, []);

  const fetchWorkshopDetails = async () => {
    try {
      
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await vehicleDetailsService(VehicleDetails);
      setProviderDetails(response.providersData);
    } catch (error) {
      console.log("Error in fetching vehicle Details: ", error);
      throw error;
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="h-screen bg-gray-200 flex justify-center">
    {loading ? (
      <div className="flex items-center p-60 justify-center">
        <p className="text-3xl animate-bounce font-semibold text-madBlack">
          Searching for workshops...
        </p>
      </div>
    ) : providerDetails.length > 0 ? (
      <div className="w-full p-4 mx-5">
        <h1 className="text-2xl text-center font-semibold my-4">Available Workshops</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {providerDetails.map((provider) => (
            <div
              key={provider.id}
              className="rounded-lg bg-madBlack animate-jump-in text-white shadow-md p-4 flex flex-col"
            >
              <h2 className="text-lg text-customBlue text-center font-semibold mb-2">
                {provider.workshopName}
              </h2>
              <p className="text-center">
                <span className="font-semibold">Owner:</span> {provider.ownerName}
              </p>
              <p className="text-center">
                <span className="font-semibold">Email:</span> {provider.email}
              </p>
              <p className="text-center">
                <span className="font-semibold">Phone:</span> {provider.mobile}
              </p>
              <p className="text-center">
                <span className="font-semibold">Address:</span> {provider.address}
              </p>
              <p className="text-center">
                <span className="font-semibold">Distance:</span> {provider.distance} km
              </p>
  
              <div className="mt-4 flex justify-center">
                <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <p className="text-3xl text-red-400 font-semibold text-center">No Available Workshops Found!</p>
    )}
  </div>
  
  );
}

export default ProviderShopsComp;
