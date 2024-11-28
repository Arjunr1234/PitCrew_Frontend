import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addMonths } from "date-fns";
import { useSelector } from "react-redux";
import { addSlotService, getAllSlotService, removeSlotService, updateSlotCountService } from "../../services/provider/providerService";
import { toast } from "sonner";
import Swal from "sweetalert2";

function AddSlot() {

  interface SlotData {
    _id: string,
    date: Date,
    count: number,
    bookedCount: number
  }

  const providerId = useSelector((state: any) => state.provider.providerInfo.id)

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [slotCount, setSlotCount] = useState<string>("");
  const [addedSlot, setAddedSlot] = useState<SlotData[]>([]);
  const [addedDates, setAddedDates] = useState<Date[]>([])
  const [currentPage, setCurrentPage] = useState(1);
  const highlightedDates = [
    new Date("2024-11-13"),
    new Date("2024-11-15"),
    new Date("2024-11-20"),
  ];




  const onChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  useEffect(() => {
    const fetchAllSlot = async () => {
      try {

        const response = await getAllSlotService(providerId);
        if (response.success) {
          console.log("This is the addes slot: ", response);
          setAddedSlot(response.slotData);
          const updateAddedDate = response.slotData.map((slot: any) => new Date(slot.date));
          setAddedDates(updateAddedDate);
        }
      } catch (error) {
        console.log("Error in fetchAllSlot: ", error)

      }
    }
    fetchAllSlot()
  }, [])


  const openModal = () => setIsModalOpen(true);


  const closeModal = () => setIsModalOpen(false);


  const handleSlotCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSlotCount(value);
  };




  const handleAddSlot = async () => {
    console.log("This is startingDate: ", startDate, endDate)
    if (!startDate) {
      toast.error("Start date and end date must be valid.");
      return;
    }
    const slotCountValue = Number(slotCount)
    if (!slotCount || isNaN(slotCountValue) || slotCountValue <= 0) {
      toast.error("Please provide a valid slot count!!");
      return
    }

    console.log("Slot Added:", {
      startDate,
      endDate,
      slotCount,
    });
    try {
      const response = await addSlotService(providerId, startDate, endDate, slotCount);
      if (response.success) {
        const updateSlot = [...addedSlot, ...response.slotData];
        const updateAddedDate = updateSlot.map((slot) => new Date(slot.date));
        setAddedDates(updateAddedDate)
        setAddedSlot(updateSlot)
        toast.success("Successfully added!!");
        setSlotCount('');
        setStartDate(null);
        setEndDate(null)
      }

      closeModal();

    } catch (error: any) {
      console.log("Error occured in handleAddSlot:", error);
      toast.error(error.response.data.message)

    }
  };

  const handleRemoveSlot = async (slotId: string, date: Date) => {
    try {
      const removedDate = new Date(date)
      console.log("removedDate: ", removedDate)
      const response = await removeSlotService(slotId);
      if (response.success) {
        const filterdSlot = addedSlot.filter((slot) => slot._id !== slotId);
        setAddedSlot(filterdSlot);
        const updateAddedDates = addedDates.filter(
          (slot: any) => new Date(slot.date).toISOString() !== new Date(date).toISOString()
        );
        setAddedDates(updateAddedDates);
        toast.success('Removed Successfully!!')
      }

    } catch (error) {
      console.log("Error in handleRemoveSlot: ", error);

    }
  }

  const handleIncrementCount = async (slotId: string, state: number) => {
    try {
      const response = await updateSlotCountService(slotId, state);
      if (response.success) {
        const updateSlot = addedSlot.map((slot) => {
          if (slot._id === slotId) {
            const newCount = slot.count + 1
            return {
              ...slot,
              count: slot.count + 1
            }
          }
          return slot
        })
        setAddedSlot(updateSlot)
      }


    } catch (error) {
      console.log("Error in hadleIncrementCount; ", error)

    }
  }

  const handleDecrementCount = async (slotId: string, state: number, totalCount:number, bookedCount:number) => {
      
     if(totalCount <= bookedCount){
        toast.error("Cannot reduce less than booked count!!")
        return
     }
    try {
      const response = await updateSlotCountService(slotId, state);
      if (response.success) {
        const updateSlot = addedSlot.map((slot) => {
          if (slot._id === slotId) {
            return {
              ...slot,
              count: slot.count - 1
            }
          }
          return slot
        })
        setAddedSlot(updateSlot)
      }

    } catch (error) {
      console.log("Error in handleDecrementCount: ", error);


    }
  }

  

  useEffect(() => {
    console.log("This is the addesSlot////////////////:", addedSlot)
  }, [addedSlot])

  const confimRemoveSlot = (slotId: string, date: Date) => {
    Swal.fire({
      title: `Are you sure ?`,
      text: `Do you want to remove slot ?`,
      showCancelButton: true,
      cancelButtonColor: '#d33',
      icon: 'question',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Remove',
    }).then((result) => {
      if (result.isConfirmed) {

        handleRemoveSlot(slotId, date)
      }
    });
  }

  useEffect(() => {
    console.log("This is added Dates: ", addedDates)
  }, [addedDates])
   
  const rowsPerPage = 5; 
  const totalPages = Math.ceil(addedSlot.length / rowsPerPage);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = addedSlot.slice(indexOfFirstRow, indexOfLastRow);

  
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  

  return (
    <>
      <div className="bg-gray-200 rounded-lg p-2 h-[100%] flex flex-col gap-y-2">
        <div className="h-10 flex flex-row justify-end ">
          
          <button
            onClick={openModal}
            className="p-2 mx-6 bg-blue-500 hover:bg-blue-600 rounded-lg text-white"
          >
            Add Slot
          </button>
        </div>
        
        <div className="flex flex-col  ">
        <h1 className="text-3xl  text-black text-center">Available Slots</h1>
        <table className="table w-full justify-between mt-4 bg-white shadow-md ">
          <thead>
            <tr className="bg-providerBluePrimary text-white justify-between">
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Day</th>
              <th className="p-2 text-left">Count</th>
              <th className="p-2 text-center">Booked count</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">
                  No slots available
                </td>
              </tr>
            ) : (
              currentRows.map((slot) => (
                <tr key={slot._id} className="border-b">
                  <td className="p-2">
                    {new Date(slot.date).toLocaleDateString("en-GB")}
                  </td>
                  <td className="p-2">
                    {new Date(slot.date).toLocaleDateString("en-US", {
                      weekday: "long",
                    })}
                  </td>
                  <td className="p-2 flex items-center">
                    <button
                      onClick={() => handleDecrementCount(slot._id, -1, slot.count, slot.bookedCount)}
                      className="px-2 py-1 bg-gray-300 text-black rounded hover:bg-gray-400"
                      disabled={slot.count <= 1}
                    >
                      -
                    </button>
                    <span className="px-4">{slot.count}</span>
                    <button
                      onClick={() => handleIncrementCount(slot._id, 1)}
                      className="px-2 py-1 bg-gray-300 text-black rounded hover:bg-gray-400"
                    >
                      +
                    </button>
                  </td>
                  <td className="text-center">
                    {slot.count === slot.bookedCount ? (
                      <span className="text-red-600 font-bold">Booked full</span>
                    ) : (
                      slot.bookedCount
                    )}
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => confimRemoveSlot(slot._id, slot.date)}
                      className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    
      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-300 rounded mx-1 hover:bg-gray-400"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 mx-1 ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-300 hover:bg-gray-400"
            } rounded`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-300 rounded mx-1 hover:bg-gray-400"
        >
          Next
        </button>
      </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-[90%] h-auto max-w-md shadow-lg relative">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 bg-red-400 hover:bg-red-600 p-2 rounded-full text-black hover:text-gray-700"
              >
                &#x2715;
              </button>

              {/* Modal Content */}
              <h2 className="text-xl font-semibold text-center mb-4">
                Add New Slot
              </h2>

              {/* Date Range Picker */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-center">
                  Select Date Range
                </label>
                <div className="flex justify-center">
                  <DatePicker
                    selected={startDate}
                    onChange={onChange}
                    minDate={new Date()}
                    maxDate={addMonths(new Date(), 5)}
                    startDate={startDate as Date | undefined}
                    endDate={endDate as Date | undefined}
                    selectsRange
                    inline
                    showDisabledMonthNavigation
                    highlightDates={addedDates}
                    excludeDates={addedDates}
                  />
                </div>
              </div>

              {/* Slot Count Input (As String) */}
              <div className="flex flex-col items-center mb-6">
                <label htmlFor="count" className="block text-sm font-medium mb-2">
                  Enter Slot Count
                </label>
                <input
                  type="text"
                  id="count"
                  value={slotCount}
                  onChange={handleSlotCountChange}
                  placeholder="Enter count"
                  className="w-32 h-12 text-center bg-gray-300 border rounded-md"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSlot}
                  className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AddSlot;
