
function RoadServices() {
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
          placeholder="Add service"
          className="text-center p-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-1/2"
        />
        
        {/* File Input */}
        <input
          type="file"
          className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
  
        {/* Add Button */}
        <button className="p-2 bg-blue-500 text-white px-6 rounded-lg hover:bg-blue-600">
          Add
        </button>
      </div>
    </div>
  </div>
  
  )
}

export default RoadServices
