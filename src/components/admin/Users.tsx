import { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../api/common";
import { URL } from "../../utils/api";
import axios from "axios";
import { toast } from "sonner";
import Swal from "sweetalert2";

function Users() {
  const [users, setUsers] = useState<Array<any>>([]);
  const [active, setActive] = useState<number>(0);
  const [blocked, setBlocked] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredUsers, setFilteredUsers] = useState<Array<any>>([]);
  const usersPerPage = 5;
  const [searchKey, setSearchKey] = useState("");
  const navigate = useNavigate();

  useLayoutEffect(() => {
    axiosInstance
      .get(URL + "/api/admin/user/get-user")
      .then((response) => {
        if (response.data) {
          setUsers(response.data.users);
          setFilteredUsers(response.data.users);
          setActive(response.data.active);
          setBlocked(response.data.blocked);
        }
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          const statusCode = error.response?.status;
          if (statusCode === 403) {
            toast.error("Session is expired, please login");
            navigate("/admin/login", { replace: true });
          }
        } else {
          console.error("An error occurred");
        }
      });
  }, []);

  const handleBlockUnblock = (id: string, status: boolean) => {
    axiosInstance
      .patch(URL + "/api/admin/user/user-block-unblock", { id, state: status })
      .then((response) => {
        if (response.data.success) {
          if (status) {
            setBlocked(blocked + 1);
            setActive(active - 1);
          } else {
            setBlocked(blocked - 1);
            setActive(active + 1);
          }
          const updatedUsers = users.map((user) => {
            if (user.id === id) {
              return { ...user, blocked: status };
            }
            return user;
          });
          setUsers(updatedUsers);
          setFilteredUsers(updatedUsers);
        }
      });
  };

  const confirmBlockAndUnBlockUser = (id: string, status: boolean) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${status ? "Block" : "Unblock"}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Confirm",
    }).then((result) => {
      if (result.isConfirmed) {
        handleBlockUnblock(id, status);
      }
    });
  };

  
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSearch = () => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchKey.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Users Details</h1>
      <div className="flex flex-row justify-between items-center p-4 gap-4 px-8">
        <div className="p-6 bg-white shadow-md rounded-lg">
          Active Users: {active}
        </div>

        <div className="flex flex-row items-center justify-center space-x-4 p-4 bg-gray-100 rounded-lg">
          <h1 className="text-lg font-semibold text-gray-700">User:</h1>
          <input
            type="text"
            placeholder="Enter user name"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        <div className="p-6 bg-white shadow-md rounded-lg">
          Blocked Users: {blocked}
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto rounded-3xl">
        <table className="min-w-full bg-gray-200 shadow-md">
          <thead>
            <tr>
              <th className="py-2 px-4 text-center bg-gray-100">Name</th>
              <th className="py-2 px-4 text-center bg-gray-100">Email</th>
              <th className="py-2 px-4 text-center bg-gray-100">Phone</th>
              <th className="py-2 px-4 text-center bg-gray-100">Status</th>
              <th className="py-2 px-4 text-center bg-gray-100">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="py-2 text-center px-4">{user.name}</td>
                <td className="py-2 text-center px-4">{user.email}</td>
                <td className="py-2 text-center px-4">{user.phone}</td>
                <td className="py-2 text-center px-4">
                  {user.blocked ? (
                    <span className="text-red-500 font-semibold">Blocked</span>
                  ) : (
                    <span className="text-green-500 font-semibold">Active</span>
                  )}
                </td>
                <td className="py-2 text-center px-4">
                  <button
                    onClick={() => confirmBlockAndUnBlockUser(user.id, !user.blocked)}
                    className={`w-full sm:w-24 px-4 py-2 rounded text-center ${
                      user.blocked
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                  >
                    {user.blocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 bg-gray-300 rounded hover:bg-gray-400 disabled:bg-gray-200"
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 mx-1 ${
              currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-300"
            } rounded hover:bg-gray-400`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-1 bg-gray-300 rounded hover:bg-gray-400 disabled:bg-gray-200"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Users;
