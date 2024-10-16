import { Link, Outlet, Navigate, useLocation } from "react-router-dom"

function Providers() {
  const location = useLocation();

  // Conditionally navigate to "Get All Providers" if the current path is exactly "/admin/providers"
  if (location.pathname === '/admin/providers') {
    return <Navigate to="/admin/providers/get-providers" replace />;
  }

  return (
    <div className="flex flex-col h-screen">
      {/* First section with 20% height */}
      <div className="flex flex-col md:flex-row h-1/5 bg-gray-100 p-4 justify-center">
        {/* Get All Providers */}
        <Link to={'/admin/providers/get-providers'}>
           <div className="flex-1 p-4 bg-white shadow-md rounded-lg m-2 hover:ring-4 hover:ring-violet-400 transition-shadow duration-300">
            <h2 className="text-xl text-center font-bold">Get All Providers</h2>
            <p className="text-gray-600 text-center">View the list of all available providers.</p>
           </div>
        </Link>
        {/* Provider Request */}
        <Link to={'/admin/providers/provider-request'}>
          <div className="flex-1 p-4 bg-white shadow-md rounded-lg m-2 hover:ring-4 hover:ring-violet-400 transition-shadow duration-300">
            <h2 className="text-xl text-center font-bold">Provider Requests</h2>
            <p className="text-gray-600 text-center">Submit a request for new providers.</p>
          </div>
        </Link>
      </div>  

      {/* Second section */}
      <div className="flex-1 bg-gray-200 p-4">
        <Outlet/>
      </div>
    </div>
  );
}

export default Providers;
