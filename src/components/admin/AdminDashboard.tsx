import { useSelector } from "react-redux";
import {
LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { fetchAllBookingsService, fetchDashboardDetails } from "../../services/admin/adminService";
import { toast } from "sonner";
import { FaMoneyBillWave, FaStore, FaUsers } from "react-icons/fa";

const COLORS = [
  "#FFBB28", "#0088FE", "#00C49F", "#FF8042", "#A020F0", "#FF6347", "#4682B4", "#32CD32", "#FFD700", "#DC143C", 
];

function AdminDashboard() {

  const [users, setUsers] = useState<number | null>(null);
  const [providers, setProviders] = useState<number | null>(null);
  const [revenue, setRevenue] = useState<number | null>(null);
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([])

   useEffect(() => {

      fetchData()

   },[])

   const fetchData = async() => {
      try {
        const response = await fetchDashboardDetails();
        if(response.success){
          setUsers(response.dashboardData.users);
          setProviders(response.dashboardData.providers);
          setRevenue(response.dashboardData.revenue);
          setPieData(response.dashboardData.statusDetails);
          setLineData(response.dashboardData.lineData)
        }else{
           toast.error("Failed to fetch the data")
        }
        
      } catch (error) {
         console.log("Error in fetchData: ", error);

        
      }
   }
   

  return (
    <div>
     <div className="container mx-auto p-4">
  {/* Statistics Section */}
  <div className="flex flex-col md:flex-row justify-center gap-6 mt-8">
    {/* Total Revenue */}
    <div className="flex items-center p-6 bg-green-500 text-white rounded-xl shadow-lg w-full md:w-1/4">
      <FaMoneyBillWave size={40} className="mr-4" />
      <div>
        <h2 className="text-lg font-semibold">Total Revenue</h2>
        <p className="text-2xl font-bold">${revenue}</p>
      </div>
    </div>

    {/* Total Users */}
    <div className="flex items-center p-6 bg-blue-500 text-white rounded-xl shadow-lg w-full md:w-1/4">
      <FaUsers size={40} className="mr-4" />
      <div>
        <h2 className="text-lg font-semibold">Total Users</h2>
        <p className="text-2xl font-bold">{users}</p>
      </div>
    </div>

    {/* Total Providers */}
    <div className="flex items-center p-6 bg-purple-500 text-white rounded-xl shadow-lg w-full md:w-1/4">
      <FaStore size={40} className="mr-4" />
      <div>
        <h2 className="text-lg font-semibold">Total Providers</h2>
        <p className="text-2xl font-bold">{providers}</p>
      </div>
    </div>
  </div>
</div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-8 mt-12">
      
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-bold text-center mb-4">Revenue  (Line Chart)</h3>
        <LineChart
          width={500}
          height={300}
          data={lineData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name"  />
          <YAxis  />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
          <Line type="monotone" dataKey="users" stroke="#82ca9d" />
        </LineChart>
      </div>
  
      
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-bold text-center mb-4">Status Distribution (Pie Chart)</h3>
        <PieChart width={400} height={400}>
          {pieData && (
            <Pie
              data={pieData}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          )}
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
     
    </div>
  );
}

export default AdminDashboard;
