import { useEffect, useRef, useState } from "react"
import { BsThreeDots } from "react-icons/bs";
import { FaTrash } from 'react-icons/fa';
import { IService } from "../../interface/admin/iAdmin"
import { addService, deleteService, getAllRoadService } from "../../services/admin/adminService";
import { toast } from "sonner";
import Swal from "sweetalert2";





function RoadServices() {
          const [selectedService, setSelectedService] = useState<IService | null>(null)
          const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
          const [serviceName, setServiceName] = useState<string>('')
          const [selectFile, setSelectedFile]  = useState<File | null>(null)
          const [roadServices, setRoadServices] = useState<IService[] | []>([]);
          const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
          const fileInputRef = useRef<HTMLInputElement>(null);
          const [subServiceName, setSubServiceName] = useState<string>('');
          const [loading, setLoading] = useState<boolean>(false)


          useEffect(() => {
              const fetchRoadService = async() => {
                  try {
                     
                      const fetchedData = await getAllRoadService();
                      if(fetchedData.success){
                        setRoadServices(fetchedData.services)
                      } 
                  } catch (error) {
                      console.log("Error ocuur when fetchRoad service: ", error)
                      toast.error("Failed to fetch the data")
                  }
              }
              fetchRoadService()
          },[])


          const toggleDropdown = (id:string) => {
             setDropdownOpen((prev) => (prev === id? null: id))
          }

          const closeDropdown = () => {
             setDropdownOpen(null)
          }

          const openModal = (service:IService) => {
              setIsModalOpen(true);
              setSelectedService(service)
         }

         const closeModal = () => {
             setIsModalOpen(false);
             setSelectedService(null)
         }

          useEffect(() => {
              const handleOutsideClick = (event:MouseEvent) => {
                const target = event.target as HTMLElement
                if(!target.closest(".dropdown-menu")){
                  closeDropdown()
                }
              }
                   document.addEventListener('mousedown', handleOutsideClick);

                return () => {
                   document.removeEventListener("mousedown", handleOutsideClick)
                }
          },[])

          const handleServiceNameChange = (e:React.ChangeEvent<HTMLInputElement>) => {
                 setServiceName(e.target.value)
          }

          const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>) => {
                 if(e.target.files && e.target.files.length > 0){
                     setSelectedFile(e.target.files[0])
                 }
          }

          const handleAddService = async() => {
            if (!serviceName || serviceName.trim() === '') {
              toast.error("Please provide a valid service name");
              return;
            }
            
            
          
            
            if (!selectFile) {
              toast.error("Please select a file");
              return;
            }
          
            
            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validImageTypes.includes(selectFile.type)) {
              toast.error("Please upload an image (JPEG, PNG, GIF)");
              return;
            }

                const formData = new FormData();
                formData.append("serviceType", serviceName);
                formData.append("image", selectFile);
                formData.append("category", "road");
                setLoading(true)
                try {

                  const response = await addService(formData);
                  if(response.success){
                    toast.success("Service added Successfully!!");
                    setServiceName("");
                    setSelectedService(null);
                    if(fileInputRef.current){
                       fileInputRef.current.value = ""
                    }
                     const udatedService = await getAllRoadService();
                     setRoadServices(udatedService.services)
                  }
                  
                } catch (error) {
                   console.log(error)
                   toast.error("Failed to add service")
                }finally{
                   setLoading(false)
                }

          }

          const handleDeleteService = async(serviceId:string) => {
            try {
                 const response = await deleteService(serviceId);
                 if(response.success){
                  const updatedRoadService = roadServices.filter((service) => service._id !== serviceId);
                  setRoadServices(updatedRoadService);
                  toast.success('Removed successfully!!')
                 }
              
            } catch (error) {
                  console.log("Error  in handleDeleteService: ", error)
                  
            }
        }

        const confirmDelete = (serviceId:string, serviceName:string) => {
          Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to remove the ${serviceName} Service?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Confirm',
          }).then((result) => {
            if (result.isConfirmed) {
              handleDeleteService(serviceId);
            }
          });
        }

  return (
    <div>
    <div className="text-center mb-4">
      <h1 className="text-2xl font-bold">Road Services</h1>
    </div>
    <div className="bg-gray-200 rounded-lg p-4 flex flex-col gap-y-4 shadow-lg">
      <div>
        <h2 className="text-center text-lg font-bold">Add Road-assistance Service</h2>
      </div>



      <div className="flex flex-row gap-x-4 items-center">
      {/* Service Name Input */}
      <input
        type="text"
        value={serviceName}
        onChange={handleServiceNameChange}
        placeholder="Add service"
        className="text-center p-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-1/2"
        disabled={loading} 
      />

      {/* File Input */}
      <input
        type="file"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        disabled={loading} 
      />

      {/* Add Button */}
      <button
        className={`p-2 text-white px-6 rounded-lg ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
        onClick={handleAddService}
        disabled={loading} 
      >
        {loading ? (
          <div className="flex items-center gap-x-2">
            <div className="spinner border-t-transparent border-white border-2 rounded-full w-4 h-4 animate-spin"></div>
            Adding...
          </div>
        ) : (
          "Add"
        )}
      </button>
    </div>


    </div>

    {/* grid system */}

    <div className="mt-8">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {roadServices.map((service) => (
                <div key={service._id} className="bg-white shadow-lg rounded-lg p-4 flex items-center border border-gray-400 relative">
                  <img src={service.imageUrl} alt={service.serviceTypes} className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-grow text-center">
                    <h1 className="text-lg font-semibold">{service.serviceTypes}</h1>
                  </div> 
                  {dropdownOpen === service._id && (
                    <div className="absolute right-0 top-8 bg-white border border-gray-500 shadow-lg rounded-lg p-2 dropdown-menu">
                       <button className="text-red-400 hover:bg-red-50 w-full text-left p-1 rounded-md"
                       onClick={() => confirmDelete(service._id, service.serviceTypes)}>
                          Delete
                       </button>
                    </div>
                  )}
                  <div >
                    <BsThreeDots className="absolute top-0 right-3 text-xl cursor-pointer"
                    onClick={() => toggleDropdown(service._id)}/>
                    {/* <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => openModal(service)}>
                       View
                    </button> */}
                  </div>
                </div>
            ))}

         </div>
    </div>
    {isModalOpen && selectedService && (
  <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center">
    <div className="bg-white w-96 p-6 rounded-lg relative h-[80%]">
      <button
        className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
        onClick={closeModal}
      >
        X
      </button>

      <h2 className="text-xl font-semibold text-center mb-4">{selectedService.serviceTypes}</h2>

      <div className="flex flex-col h-full">
        {/* Add Subservice Input (Fixed Section) */}
        <div className="mt-4 flex flex-row">
          <input
            type="text"
            placeholder="Sub services.."
            value={subServiceName}
            onChange={(e) => setSubServiceName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-center"
          />
          <button className="ml-2 p-2 bg-blue-400 rounded-md hover:bg-blue-300" >
            Add
          </button>
        </div>

        {/* Scrollable Subtypes List */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-2">
          {selectedService.subTypes.map((subtype, index) => (
            <div
              key={subtype._id}
              className="flex justify-between items-center bg-gray-100 p-2 rounded-md border border-gray-300"
            >
              
              <p className="text-black ">{subtype.type}</p>

              <button
                className="   p-1 bg-red-400 rounded-full "
              >
                <FaTrash className="w-4 h-4 text-white" /> {/* Trash icon */}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)}
  </div>
  
  )
}

export default RoadServices
