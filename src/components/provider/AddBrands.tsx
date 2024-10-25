import { useEffect, useState } from "react";
import { addBrand, getAllBrands, removeBrand } from "../../services/provider/providerService";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export interface IBrand{
  brandId:string,
  brandName:string,
  isAdded:boolean
}

function AddBrands() {
  const [BrandData, setBrandData] = useState<IBrand[]>([]); 
  const [searchQuery, setSearchQuery] = useState(""); 
  const providerId = useSelector((state: any) => state.provider.providerInfo.id);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await getAllBrands(providerId);
        if (response.success) {
          setBrandData(response.brandData);
        }
      } catch (error) {
        console.log("Error in fetching Brand");
      }
    };
    fetchBrands();
  }, [providerId]);

  const handleAddBrand = async (brandId: string, brandName: string) => {
    try {
      const data = {
        providerId,
        brandId,
        brandName,
      };

      const response = await addBrand(data);

      if (response.success) {
        const updatedData = BrandData.map((brand) => {
          if (brand.brandId === brandId) {
            return {
              ...brand,
              isAdded: true,
            };
          }
          return brand;
        });
        setBrandData(updatedData);
        toast.success(`${brandName} added Successfully!!`);
      }
    } catch (error) {
      console.log("Error in handleAddBrand:", error);
    }
  };

  const handleRemoveBrand = async (brandId: string, brandName: string) => {
    try {
      const response = await removeBrand(providerId, brandId);
      if (response.success) {
        const updatedData = BrandData.map((brand) => {
          if (brand.brandId === brandId) {
            return {
              ...brand,
              isAdded: false,
            };
          }
          return brand;
        });
        setBrandData(updatedData);
        toast.success(`${brandName} removed successfully!!`);
      }
    } catch (error: any) {
      console.log("Error in handleRemove Brand:", error);
      toast.error(error.response.data.message);
    }
  };

  // Filtered brands based on searchQuery
  const filteredBrands = BrandData.filter((brand) =>
    brand.brandName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="bg-gray-300 h-20 rounded-xl flex justify-center items-center shadow-md">
        <h1 className="text-3xl font-bold text-gray-800">Add Brands</h1>
      </div>

      {/* Search bar section */}
      <div className="bg-gray-100 p-5 flex justify-center items-center">
        <input
          className="p-3 w-full max-w-md text-gray-700 border border-gray-300 
            rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
            focus:border-transparent text-center placeholder-gray-500"
          type="text"
          placeholder="Search Brands.."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
      </div>

      {/* Brands grid section */}
      <div className="m-8 p-6 bg-gray-100 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredBrands.length > 0 ? (
            filteredBrands.map((brand) => (
              <div
                key={brand.brandId}
                className="bg-white shadow-lg flex justify-between items-center rounded-lg p-6 border border-gray-300"
              >
                <h1 className="text-lg font-semibold text-gray-700 flex-grow text-center">
                  {brand.brandName}
                </h1>

                {/* Conditional rendering based on isAdded */}
                {brand.isAdded ? (
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg shadow-md transition-all duration-200"
                    onClick={() => handleRemoveBrand(brand.brandId, brand.brandName)}
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg shadow-md transition-all duration-200"
                    onClick={() => handleAddBrand(brand.brandId, brand.brandName)}
                  >
                    Add
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No brands found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddBrands;
