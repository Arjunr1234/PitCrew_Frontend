import { FaWrench, FaCar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function ServicesComp() {

   const navigate = useNavigate()
  return (
    <div className="  flex items-center  justify-center min-h-screen bg-gray-100 border-t-4">
      <div className=" animate-fade-up flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-10 ">
        <div className="  cursor-pointer  p-14 bg-customBlue rounded-lg shadow-lg text-center transition-transform transform hover:scale-105 hover:bg-blue-400 duration-300 w-full max-w-xs"
         onClick={() => navigate('/services/general-service')}>
          <div className="flex justify-center mb-4">
            <FaWrench className="text-4xl text-black" />
          </div>
          <h1 className="text-black text-2xl font-semibold">General Service</h1>
          <p className="text-black mt-2">
            Our General Services include routine maintenance, inspections, and repairs to keep your vehicle in top condition.
          </p>
        </div>
        <div className="  cursor-pointer p-14 bg-customBlue rounded-lg shadow-lg text-center transition-transform transform hover:scale-105 hover:bg-blue-400 duration-300 w-full max-w-xs"
          onClick={() => navigate('/services/road-service')}>
          <div className="flex justify-center mb-4">
            <FaCar className="text-4xl text-black" />
          </div>
          <h1 className="text-black text-2xl font-semibold">Road Assistance</h1>
          <p className="text-black mt-2">
            We offer 24/7 Road Assistance for emergencies, including towing, flat tire changes, and jump-starts.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ServicesComp;
