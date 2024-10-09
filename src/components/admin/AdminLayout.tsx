import { Link, Outlet } from 'react-router-dom';
import { FaTachometerAlt, FaUser, FaUsers, FaStore, FaSignOutAlt } from 'react-icons/fa'; // Importing icons from React Icons

function AdminLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-violet-400 text-white">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
          <ul className="space-y-7">
            <li>
              <Link to="/admin/dashboard" className=" text-black py-2 px-4 rounded hover:bg-gray-700 hover:text-white flex items-center">
                <FaTachometerAlt className="mr-3" /> {/* Dashboard Icon */}
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/profile" className=" text-black py-2 px-4 rounded hover:bg-gray-700 hover:text-white flex items-center">
                <FaUser className="mr-3" /> {/* Profile Icon */}
                Profile
              </Link>
            </li>
            <li>
              <Link to="/admin/users" className=" text-black py-2 px-4 rounded hover:bg-gray-700 hover:text-white flex items-center">
                <FaUsers className="mr-3" /> {/* Users Icon */}
                Users
              </Link>
            </li>
            <li>
              <Link to="/admin/providers" className=" text-black py-2 px-4 rounded hover:bg-gray-700 hover:text-white flex items-center">
                <FaStore className="mr-3" /> {/* Providers Icon */}
                Providers
              </Link>
            </li>
            <li>
              <Link to="/admin/logout" className=" text-black py-2 px-4 rounded hover:bg-red-700 hover:text-white flex items-center">
                <FaSignOutAlt className="mr-3" /> {/* Logout Icon */}
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
