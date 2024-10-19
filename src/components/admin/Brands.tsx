import React, { useLayoutEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { addBrand, deleteBrand, getAllBrands } from '../../services/admin/adminService';
import { toast } from 'sonner';

function Brands() {
  interface IBrand {
    _id: string;
    brand: string;
  }

  const [brand, setBrand] = useState(''); 
  const [vehicleType, setVehicleType] = useState(''); 
  const [brandType, setBrandsType] = useState<IBrand[]>([]); 

  
  useLayoutEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await getAllBrands();
        setBrandsType(response.brand || []); 
      } catch (error) {
        console.error('Failed to fetch brands', error);
        Swal.fire('Error', 'Failed to fetch brands', 'error');
      }
    };
    fetchBrands();
  }, []);

  
  const handleAddBrand = async () => {
    try {
      const response = await addBrand(brand);
      if (response.success) {
        setBrandsType((previousBrand) => [...previousBrand, response.brand]); 
        setBrand(''); 
      }
    } catch (error) {
      console.error('Failed to add brand', error);
      Swal.fire('Error', 'Failed to add brand', 'error');
    }
  };

  const handleAddType = () => {
    console.log('Brand:', brand);
    console.log('Vehicle Type:', vehicleType);
  };

  
  const handleDelete = async (id: string) => {
    try {
      const response = await deleteBrand(id);
      console.log("This is the response from deleteBrand: ", response);
      if (response.success) {
        toast.success("Delete successful");
        const updatedTypes = brandType.filter((brand) => brand._id !== id);
        setBrandsType(updatedTypes);
      }
    } catch (error) {
      console.error("Failed to delete brand", error);
      Swal.fire('Error', 'Failed to delete brand', 'error');
    }
  };

  // Confirm deletion with SweetAlert
  const confirmDelete = (id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to remove the Brand?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Confirm',
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(id); 
      }
    });
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Add a New Vehicle Brand
        </h1>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
  
        <input
          type="text"
          placeholder="Enter Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="p-3 border text-center border-gray-300 rounded-md w-full md:w-64 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleAddBrand}
          className="p-3 bg-blue-500 text-white rounded-md w-full md:w-auto md:px-6 md:py-3 hover:bg-blue-600 transition duration-300"
        >
          Add Brand
        </button>

        <input
          type="text"
          placeholder="Enter type"
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
          className="p-3 border text-center border-gray-300 rounded-md w-full md:w-64 focus:outline-none focus:border-blue-500"
        />

        <button
          onClick={handleAddType}
          className="p-3 bg-blue-500 text-white rounded-md w-full md:w-auto md:px-6 md:py-3 hover:bg-blue-600 transition duration-300"
        >
          Add Type
        </button>
      </div>

      {/* Grid to display the brands */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Brands</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {brandType.map((type) => (
            <div
              key={type._id} // Use only the unique _id as the key
              className="relative p-4 border border-gray-300 text-white rounded-md text-center bg-black shadow-sm group"
            >
              <h3 className="font-semibold">{type.brand}</h3>

              {/* Trash icon - visible on hover */}
              <button
                onClick={() => confirmDelete(type._id)}
                className="absolute top-4 right-2 p-1 bg-red-600 rounded-full hover:bg-red-700 transition duration-300 opacity-0 group-hover:opacity-100"
              >
                <FaTrash className="w-4 h-4 text-white" /> {/* Trash icon */}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Brands;
