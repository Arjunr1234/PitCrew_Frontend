import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addMonths } from "date-fns";
import { useSelector } from "react-redux";
import { addSlotService, getAllSlotService } from "../../services/provider/providerService";
import { toast } from "sonner";

function AddSlot() {

  interface SlotData{
    _id:string,
    date:Date,
    count:number
  }
  
  const providerId = useSelector((state:any) => state.provider.providerInfo.id)

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null >(null);
  const [slotCount, setSlotCount] = useState<string>("");
  const [addedSlot, setAddedSlot] = useState<SlotData[]>([])


  const onChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  useEffect(() => {
     const fetchAllSlot = async() => {
         try {
             
           const response = await getAllSlotService(providerId);
           if(response.success){
              console.log("This is the addes slot: ", response);
              setAddedSlot(response.slotData);
           }
         } catch (error) {
            console.log("Error in fetchAllSlot: ", error)
          
         }
     }
     fetchAllSlot()
  },[])

  
  const openModal = () => setIsModalOpen(true);

  
  const closeModal = () => setIsModalOpen(false);

  
  const handleSlotCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSlotCount(value); 
  };

  const increaseOrDecreaseCount = (id:string, state:number) => {

  }

  
  const handleAddSlot = async() => {
    console.log("This is startingDate: ", startDate, endDate)
    if (!startDate || !endDate) {
      toast.error("Start date and end date must be valid.");
      return;
    }
    
    console.log("Slot Added:", {
      startDate,
      endDate,
      slotCount,
    });
    const response = await addSlotService(providerId, startDate, endDate, slotCount)
    
    closeModal();
  };

  const handleRemoveSlot = (id:string) => {

  }

  useEffect(() => {
    console.log("This is the addesSlot////////////////:", addedSlot )
  },[])

  return (
    <>
      <div className="bg-gray-200 p-2 h-[100%] flex flex-col gap-y-2">
        <div className="h-10 flex flex-row justify-end ">
          {/* Add Slot Button */}
          <button
            onClick={openModal}
            className="p-2 mx-6 bg-blue-500 hover:bg-blue-600 rounded-lg text-white"
          >
            Add Slot
          </button>
        </div>
        {/* table for listing slot */}
        <div className="flex flex-col">
          <h1 className="text-3xl text-black text-center">Available Slots</h1>
          <table className="table w-full justify-between mt-4 bg-white shadow-md rounded-lg">
            <thead >
              <tr className="bg-blue-500 text-white  justify-between">
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Day</th>
                <th className="p-2 text-left">Count</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
  {addedSlot?.length === 0 ? (
    <tr>
      <td colSpan={3} className="text-center p-4 text-gray-500">
        No slots available
      </td>
    </tr>
  ) : (
    addedSlot?.map((slot) => (
      <tr key={slot._id} className="border-b">
        <td className="p-2">{new Date(slot.date).toLocaleDateString("en-GB")}</td>
        <td className="p-2">{new Date(slot.date).toLocaleDateString("en-US", {weekday:"long"})}</td>
        <td className="p-2 flex items-center gap-2">
          {/* Minus Button */}
          <button
            onClick={() => increaseOrDecreaseCount(slot._id, -1)}
            className="px-2 py-1 bg-gray-300 text-black rounded hover:bg-gray-400"
            disabled={slot.count <= 1}
          >
            -
          </button>

          {/* Slot Count */}
          <span className="px-4">{slot.count}</span>

          {/* Plus Button */}
          <button
            onClick={() => increaseOrDecreaseCount(slot._id, 1)}
            className="px-2 py-1 bg-gray-300 text-black rounded hover:bg-gray-400"
          >
            +
          </button>
        </td>
        <td className="">
          <button
            onClick={() => handleRemoveSlot(slot._id)}
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

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-[90%] h-[80%] max-w-md shadow-lg relative">
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
