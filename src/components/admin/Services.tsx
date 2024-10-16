import { useEffect, useState } from "react";
import { Outlet, Link, useLocation, Navigate, useNavigate } from "react-router-dom";

function Services() {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState('');
  const navigate = useNavigate()

  
  

  useEffect(() => {
    if(location.pathname === '/admin/services'){
        navigate('/admin/services/brands')
    }
    if (location.pathname.includes('brands')) {
      setActiveLink('brands');
    }
    if (location.pathname.includes('general-services')) {
      setActiveLink('general-services');
    }
    if (location.pathname.includes('road-assistance')) {
      setActiveLink('road-assistance');
    }
  }, [location.pathname, navigate]); 

  return (
    <div className="flex flex-col">
      <div className="flex flex-col md:flex-row h-1/5 bg-gray-100 p-4 justify-center border-b-2">
        <Link to={'/admin/services/general-services'} onClick={() => setActiveLink('general-services')}>
          <div className={`flex-1 p-4 bg-white shadow-md rounded-lg m-2 transition-shadow duration-300
            ${activeLink === 'general-services' ? 'ring-4 ring-violet-400' : 'hover:ring-4 hover:ring-violet-400'}`}>
            <h2 className="text-xl text-center font-bold">General Services</h2>
            <p className="text-gray-600 text-center">View and list of all General services</p>
          </div>
        </Link>
        <Link to={'/admin/services/brands'} onClick={() => setActiveLink('brands')}>
          <div className={`flex-1 p-4 bg-white shadow-md rounded-lg m-2 transition-shadow duration-300
            ${activeLink === 'brands' ? 'ring-4 ring-violet-400' : 'hover:ring-4 hover:ring-violet-400'}`}>
            <h2 className="text-xl text-center font-bold">Brands</h2>
            <p className="text-gray-600 text-center">View and list all Brands</p>
          </div>
        </Link>
        <Link to={'/admin/services/road-assistance'} onClick={() => setActiveLink('road-assistance')}>
          <div className={`flex-1 p-4 bg-white shadow-md rounded-lg m-2 transition-shadow duration-300
            ${activeLink === 'road-assistance' ? 'ring-4 ring-violet-400' : 'hover:ring-4 hover:ring-violet-400'}`}>
            <h2 className="text-xl text-center font-bold">Road Services</h2>
            <p className="text-gray-600 text-center">View and list of all Road services</p>
          </div>
        </Link>
      </div>

      <div className="flex-1 bg-grey-200 p-4">
        <Outlet />
      </div>
    </div>
  );
}

export default Services;
