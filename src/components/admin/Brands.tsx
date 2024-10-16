import React, { useState } from 'react';

function Brands() {
  const [brand, setBrand] = useState(''); // State for the brand name
  const [vehicleType, setVehicleType] = useState(''); // State for the vehicle type
  const sampleType = ["Honda", "TVS", "Bajaj", "Yamaha", "Suzuki", "KTM", "Harley Davidson", "Toyota", "Ford"];

  const handleAddType = () => {
    console.log('Brand:', brand);
    console.log('Vehicle Type:', vehicleType);
    // Add your logic for adding the type
  };

  const handleAddBrand = () => {
    console.log('Brand:', brand);
    // Add your logic for adding the brand
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

        {/* Input for vehicle type */}
        <input
          type="number"
          placeholder="Enter type"
          value={vehicleType} // Updated to use vehicleType state
          onChange={(e) => setVehicleType(e.target.value)} // Updates the vehicleType state
          className="p-3 border text-center border-gray-300 rounded-md w-full md:w-64 focus:outline-none focus:border-blue-500"
        />

        {/* Button to submit */}
        <button
          onClick={handleAddType}
          className="p-3 bg-blue-500 text-white rounded-md w-full md:w-auto md:px-6 md:py-3 hover:bg-blue-600 transition duration-300"
        >
          Add Type
        </button>
      </div>

      {/* Grid to display sample types */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Sample Vehicle Types</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
          {sampleType.map((type, index) => (
            <div
              key={index}
              className="p-4 border border-gray-300  text-white rounded-md text-center bg-black shadow-sm"
            >
              <h3 className="font-semibold">{type}</h3>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Brands;
