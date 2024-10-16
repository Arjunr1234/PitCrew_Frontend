import { useLayoutEffect, useState } from "react";
import { axiosInstance } from "../../api/common";
import { URL } from "../../utils/api";

function GetAllProvider() {
  const [providers, setProviders] = useState<Array<any>>([]);

  useLayoutEffect(() => {
    axiosInstance.get(URL + '/api/admin/providers/get-providers').then((response) => {
      if (response.data.success) {
        setProviders(response.data.provider);
      }
    });
  }, []);

  const handleBlockUnblock = (id: string, status: boolean) => {
    axiosInstance
      .patch(URL + '/api/admin/providers/provider-block-unblock', { id, state: status })
      .then((response) => {
        if (response.data.success) {
          const updatedProviders = providers.map((provider) => {
            if (provider._id === id) {
              return { ...provider, blocked: status };
            }
            return provider;
          });
          setProviders(updatedProviders);
        }
      })
      .catch((error) => {
        console.error('Error updating provider status:', error);
      });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
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
          {providers.map((provider) => (
            <tr key={provider._id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 text-left px-6">
                <span>{provider.workshopName}</span>
              </td>
              <td className="py-3 px-6 text-center">
                <span>{provider.ownerName}</span>
              </td>
              <td className="py-3 px-6 text-center">
                <span>{provider.email}</span>
              </td>
              <td className="py-3 px-6 text-center">
                <span>{provider.mobile}</span>
              </td>
              <td className="py-3 px-6 text-center">
                {provider.blocked ? (
                  <span className="bg-red-200 text-red-600 py-1 px-3 rounded-full text-xs">Blocked</span>
                ) : (
                  <span className="bg-green-200 text-green-600 py-1 px-3 rounded-full text-xs">Active</span>
                )}
              </td>
              <td className="py-2 text-center px-4">
                <button
                  onClick={() => handleBlockUnblock(provider._id, !provider.blocked)}
                  className={`w-full sm:w-24 px-4 py-2 rounded text-center ${
                    provider.blocked ? "bg-green-500 hover:bg-green-600 text-white" : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                >
                  {provider.blocked ? "Unblock" : "Block"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GetAllProvider;
