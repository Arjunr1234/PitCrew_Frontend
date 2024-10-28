import { useLayoutEffect, useState } from "react"
import { axiosInstance } from "../../api/common";
import { URL } from "../../utils/api";
import Swal from "sweetalert2";
import { toast } from "sonner";


function ProviderRequests() {


     const [pendingProviders, setPendingProviders] = useState<Array<any>>([]);
    // const providerEmail = useSelector((state:any) => state.provider.providerInfo.email)

     useLayoutEffect(() => {
        axiosInstance.get(URL + '/api/admin/providers/get-pending-providers').then((response) => {
              if(response.data.success){
                 setPendingProviders(response.data.provider)
              }
        })
     },[])

     const handleAccept = (id: string) => {
      axiosInstance
        .patch(URL + '/api/admin/providers/provider-accept-reject', { id, state: true })
        .then((response) => {
          if (response.data.success) {
            console.log("Entered into success: ", id);
    
           
            const updatedPendingProviders = pendingProviders.filter((provider) => provider._id !== id);
    
            setPendingProviders(updatedPendingProviders);
            return true
          }
        })
        .catch((error) => {
          console.error('Error accepting provider:', error);  
        });
    };

    const confirmReasonRejection = async(id:string, providerEmail:string) => {
      const { value: text } = await Swal.fire({
        input: "textarea",
        inputLabel: "Reason for Rejection",
        inputPlaceholder: "Type here...",
        inputAttributes: {
          "aria-label": "Type your message here"
        },
        showCancelButton: true
      });
      if (text) {
          console.log("Entered into text: ", text)
          handleReject(id, text, providerEmail)
      }else{
        toast.error("Please enter the reason for rejection!!")
      }
    }
     
     const confirmAccept = (id:string) => {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Accept it!"
      }).then((result) => {
        if (result.isConfirmed) {
          
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Request is Accepted",
            showConfirmButton: false,
            timer: 1500
          });
          handleAccept(id);
        }
      });
     }
    

     const handleReject = (id:string, reason:string, providerEmail:string) => {
       axiosInstance.patch(URL + '/api/admin/providers/provider-accept-reject', { id, state: null,reason,providerEmail })
       .then((response) => {
           if(response.data.success){
              const updatedPendingProviders = pendingProviders.filter((provider) => provider._id !== id)
              setPendingProviders(updatedPendingProviders);
              toast.success("Rejected Successfully!!");
           }
       }).catch((error) => {
         console.error("Errorn in Rejecting Provider: ", error)
       })

     }
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

         {pendingProviders.map((provider) => (
             <tr key={provider._id} className="border-b border-gray-200 hover:bg-gray-100">
             <td className="py-3 text-left px-6 ">
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
             <td className="py-2 text-center px-4">
               <button
                 onClick={() => confirmAccept(provider._id)}
                 className="w-full sm:w-24 px-4 py-2 rounded text-center bg-green-500 hover:bg-green-600 text-white">
                 Accept
               </button>
             </td>
             <td className="py-2 text-center px-4">
               <button
                 onClick={() => confirmReasonRejection(provider._id, provider.email)}
                 className="w-full sm:w-24 px-4 py-2 rounded text-center bg-red-500 hover:bg-red-600 text-white" >
                 Reject
               </button>
             </td>

             </tr>
         ))}
        
       
      </tbody>
    </table>
  </div>
  )
}

export default ProviderRequests
