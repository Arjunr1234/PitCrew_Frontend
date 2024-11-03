
import { FaBicycle, FaCar } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';



function AddServiceComp() {

        const navigate = useNavigate()
  return (
    <div className="flex flex-col p-4">
      {/* Header Section */}
      <div className="flex flex-row bg-gray-300 h-20 rounded-xl justify-between items-center p-4">
        <h1 className="flex-1 text-center text-xl font-semibold">Add Services</h1>
        <div>
          <button className="bg-madBlack p-2 rounded-lg hover:bg-blue-600 text-white"
           onClick={() => navigate('/provider/add-service/add-brands')}>
            Add Brands
          </button>
        </div>
      </div>


      {/* Service Options Section */}
      <div className="flex flex-wrap gap-4 justify-center mt-20">
        <div className="animate-fade-right animate-ease-linear bg-providerGreen w-full md:w-1/3 p-4 flex flex-col items-center rounded-lg shadow-lg">
          <FaBicycle className="text-6xl mb-4" /> {/* Bike icon */}
          <h1 className=" text-lg font-bold">Two Wheeler</h1>
          <p className="text-center m-4">Add your two-wheeler services, including maintenance, repairs, tire replacements, and roadside assistance. Let customers know how you can keep their bikes in excellent condition!</p>
          <button className="mt-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 "
          onClick={() => navigate('/provider/add-service/two-wheeler-services')}>
            Add Service
          </button>
        </div>
        <div className="animate-fade-left animate-ease-linear bg-providerGreen w-full md:w-1/3 p-4 flex flex-col items-center rounded-lg shadow-lg">
          <FaCar className="text-6xl mb-2" /> {/* Car icon */}
          <h1 className="text-lg font-bold">Four Wheeler</h1>
          <p className="text-center m-4">Add your four-wheeler services, such as engine diagnostics, routine maintenance, tire alignments, and emergency roadside assistance. Showcase how you can ensure vehicles run smoothly!</p>
          <button className="mt-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
           onClick={() => navigate('/provider/add-service/four-wheeler-services')}>
            Add Service
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddServiceComp;
