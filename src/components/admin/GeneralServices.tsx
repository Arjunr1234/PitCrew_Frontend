import React, { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { BsThreeDots } from "react-icons/bs";
import { FaTrash } from 'react-icons/fa';
import {  addService, addSubService, deleteService, getAllGeneralServices } from "../../services/admin/adminService";
import Swal from "sweetalert2";
import { IService } from "../../interface/admin/iAdmin";


function GeneralServices() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<IService | null>(null);
  const [serviceName, setServiceName] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null); 
  const [generalServices, setGeneralServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState<boolean>(false) 

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [subServiceName, setSubServiceName] = useState<string>("");

  
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getAllGeneralServices();
        if (response.success) {
          console.log("This is the fetched generalservices: ", response.services);
          setGeneralServices(response.services);
        } else {
          toast.error("Failed to fetch services.");
        }
      } catch (error) {
        console.log(error);
        toast.error("Error fetching services.");
      }
    };
    fetchServices();
  }, []);

  
  const handleServiceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setServiceName(e.target.value);
  };

  const handleSelectedFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Add new service logic
  const handleAddService = async () => {
    if (!serviceName) {
      toast.error("Please provide a service name");
      return;
    }
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("serviceType", serviceName);
    formData.append("image", selectedFile);
    formData.append("category", "general");
    setLoading(true);
    try {
      const response = await addService(formData);
      if (response.success) {
        toast.success("Service added successfully!!");
        setServiceName("");
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        const updatedServices = await getAllGeneralServices();
        setGeneralServices(updatedServices.services);
      }
    } catch (error) {
      toast.error("Error in adding service");
    }finally{
       setLoading(false)
    }
  };

  // Modal open and close
  const openModal = (service: IService) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  // Dropdown toggle logic
  const toggleDropdown = (id: string) => {
    setDropdownOpen((prev) => (prev === id ? null : id));
  };

  const closeDropdown = () => {
    setDropdownOpen(null);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".dropdown-menu")) {
        closeDropdown();
      }
    };
      document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleDeleteService = async (serviceId: string, serviceName: string) => {
    try {
      const response = await deleteService(serviceId);
      if (response.success) {
        const updatedService = generalServices.filter((service) => service._id !== serviceId);
        setGeneralServices(updatedService);
        toast.success(`${serviceName} deleted successfully`);
      }
    } catch (error) {
      console.log("Error in hadldingDelete: ", error);
      throw error;
    }

    closeDropdown();
  };

  const confirmDelete = (id: string, serviceType: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to remove the Service?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Confirm',
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteService(id, serviceType);
      }
    });
  };

 
  const handleAddSubservice = async (serviceId: string) => {
    if (!subServiceName) {
      toast.error("Subservice name cannot be empty.");
      return;
    }
  
    try {
      const response = await addSubService(serviceId, subServiceName);
      if (response.success) {
        const newSubService = response.subService; 
        toast.success(response.message);
  
        
        setSelectedService((prevSelectedService) => {
          if (!prevSelectedService) return null;
  
          const updatedSubTypes = [...prevSelectedService.subTypes, newSubService];
          return { ...prevSelectedService, subTypes: updatedSubTypes };
        });
  
       
        setGeneralServices((prevServices) => {
          return prevServices.map((service) =>
            service._id === serviceId
              ? { ...service, subTypes: [...service.subTypes, newSubService] }
              : service
          );
        });
  
       
        setSubServiceName('');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
    }
  };
  
  

  return (
    <div>
      <div className="text-center">
        <h1 className="text-2xl mb-2 font-bold">General Services</h1>
      </div>

      <div className="bg-gray-200 p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-bold text-center mb-4">Add General Services</h2>
        <div className="flex flex-row items-center space-x-4">
          <input
            type="text"
            value={serviceName}
            onChange={handleServiceNameChange}
            className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-1/2 text-center"
            placeholder="Add service"
            disabled={loading}
          />
          <input
            onChange={handleSelectedFileChange}
            type="file"
            ref={fileInputRef}
            className="p-2 border border-gray-300 rounded-lg w-1/3 text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-blue-50 file:text-blue-500 hover:file:bg-blue-100"
            disabled={loading}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" disabled={loading} onClick={handleAddService}>
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

      <div className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {generalServices.map((service) => (
            <div key={service._id} className="bg-white shadow-lg rounded-lg p-4 flex items-center border border-gray-400 relative">
              <img src={service.imageUrl} alt={service.serviceTypes} className="w-16 h-16 object-cover rounded-lg" />
              <div className="flex-grow text-center">
                <h2 className="text-lg font-semibold">{service.serviceTypes}</h2>
              </div>
              {dropdownOpen === service._id && (
                <div className="absolute right-0 top-8 bg-white border border-gray-500 shadow-lg rounded-lg p-2 dropdown-menu">
                  <button
                    className="text-red-500 hover:bg-red-50 w-full text-left p-1 rounded-md"
                    onClick={() => confirmDelete(service._id, service.serviceTypes)}
                  >
                    Delete
                  </button>
                </div>
              )}
              <BsThreeDots
                className="text-xl cursor-pointer absolute right-3 top-0"
                onClick={() => toggleDropdown(service._id)}
              />
              <div>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => openModal(service)}
                >
                  View
                </button>
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
          <button className="ml-2 p-2 bg-blue-400 rounded-md hover:bg-blue-300" onClick={() => handleAddSubservice(selectedService._id)}>
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
  );
}

export default GeneralServices;
