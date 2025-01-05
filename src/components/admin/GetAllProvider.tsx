import { useLayoutEffect, useState } from "react";
import { axiosInstance } from "../../api/common";
import { URL } from "../../utils/api";
import Swal from "sweetalert2";

function GetAllProvider() {
  const [providers, setProviders] = useState<Array<any>>([]);
  const [filteredProviders, setFilteredProviders] = useState<Array<any>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKey, setSearchKey] = useState("");
  const itemsPerPage = 5;

  useLayoutEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await axiosInstance.get(URL + "/api/admin/providers/get-providers");
      if (response.data.success) {
        setProviders(response.data.provider);
        setFilteredProviders(response.data.provider);
      }
    } catch (error) {
      console.error("Error fetching providers:", error);
    }
  };

  const handleBlockUnblock = async (id: string, status: boolean) => {
    try {
      const response = await axiosInstance.patch(URL + "/api/admin/providers/provider-block-unblock", {
        id,
        state: status,
      });
      if (response.data.success) {
        const updatedProviders = providers.map((provider) => {
          if (provider._id === id) {
            return { ...provider, blocked: status };
          }
          return provider;
        });
        setProviders(updatedProviders);
        setFilteredProviders(updatedProviders);
      }
    } catch (error) {
      console.error("Error updating provider status:", error);
    }
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

  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProviders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProviders.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = () => {
    const filtered = providers.filter((provider) =>
      provider.workshopName.toLowerCase().includes(searchKey.toLowerCase())
    );
    setFilteredProviders(filtered);
    setCurrentPage(1); 
  };

  return (
    <>
      <div className="overflow-x-auto">
        
        <div className="flex flex-row items-center justify-center space-x-4 p-4 bg-gray-200 rounded-lg ">
          <h1 className="text-lg font-semibold text-gray-700">Workshop:</h1>
          <input
            type="text"
            placeholder="Enter workshop name"
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

        
        {filteredProviders.length > 0 ? (
          <table className="min-w-full bg-white mt-4">
            <thead>
              <tr className="w-full bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Workshop Name</th>
                <th className="py-3 px-6 text-center">Owner Name</th>
                <th className="py-3 px-6 text-center">Email</th>
                <th className="py-3 px-6 text-center">Mobile</th>
                <th className="py-3 px-6 text-center">Status</th>
                <th className="py-3 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {currentItems.map((provider) => (
                <tr key={provider._id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left">{provider.workshopName}</td>
                  <td className="py-3 px-6 text-center">{provider.ownerName}</td>
                  <td className="py-3 px-6 text-center">{provider.email}</td>
                  <td className="py-3 px-6 text-center">{provider.mobile}</td>
                  <td className="py-3 px-6 text-center">
                    {provider.blocked ? (
                      <span className="bg-red-200 text-red-600 py-1 px-3 rounded-full text-xs">Blocked</span>
                    ) : (
                      <span className="bg-green-200 text-green-600 py-1 px-3 rounded-full text-xs">Active</span>
                    )}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => confirmBlockAndUnBlockUser(provider._id, !provider.blocked)}
                      className={`w-full sm:w-24 px-4 py-2 rounded text-center ${
                        provider.blocked
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-red-500 hover:bg-red-600 text-white"
                      }`}
                    >
                      {provider.blocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center mt-4 text-gray-500">No providers found.</div>
        )}

       
        <div className="flex justify-center items-center mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg mr-2 ${
              currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageClick(index + 1)}
              className={`px-4 py-2 rounded-lg mx-1 ${
                currentPage === index + 1 ? "bg-blue-600 text-white" : "bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg ml-2 ${
              currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default GetAllProvider;
