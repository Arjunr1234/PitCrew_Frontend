import { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../api/common";
import { URL } from "../../utils/api";
import axios from "axios";
import { toast } from "sonner";

function Users() {
  const [users, setUsers] = useState<Array<any>>([]);
  const [active, setActive] = useState<number>(0);
  const [blocked, setBlocked] = useState<number>(0);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    axiosInstance
      .get(URL + "/api/admin/user/get-user")
      .then((response) => {
        if (response.data) {
          console.log("yes there is response.data.users: ", response.data.users);
          setUsers(response.data.users);
          setActive(response.data.active);
          setBlocked(response.data.blocked);
        }
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          const statusCode = error.response?.status;
          if (statusCode === 403) {
            toast.error("Sesssion is Expired please login");
            navigate("/admin/login", { replace: true });
          }
        } else {
          console.log("An error is Occured");
        }
      });
  }, []);

  const handleBlockUnblock = (id: string, status: boolean) => {
     axiosInstance.patch(URL + '/api/admin/user/user-block-unblock', {id:id, state:status}).then((response) => {
        
         if(response.data.success){
              if(status){
                 setBlocked(blocked+1)
                 setActive(active-1)
              }else{
                 setBlocked(blocked-1)
                 setActive(active+1)
              }

             const updateUsers =  users.map((user) => {
                  if(user.id === id){
                    return {...user, blocked:status}
                  }
                  return user
              })

              setUsers(updateUsers)
              
         }
         
     })

     
        

  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Users Details</h1>
      <div className="flex flex-row justify-between items-center gap-4 px-8">
  <div className="p-5 bg-green-300">
    Active Users: {active}
  </div>
  <div className="p-5 bg-green-300">
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
            {users.map((user) => (
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
                    onClick={() => handleBlockUnblock(user.id, !user.blocked)}
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
    </div>
  );
}

export default Users;
