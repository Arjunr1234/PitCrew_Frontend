import React, { useEffect, useState } from "react";
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
import { fetchDashboardData } from "../../services/provider/providerService";
import { toast } from "sonner";
import { FaMoneyBillWave, FaUsers } from "react-icons/fa";

// Data for LineChart
const lineData = [
  { name: "Jan", users: 400, revenue: 2400 },
  { name: "Feb", users: 300, revenue: 1398 },
  { name: "Mar", users: 200, revenue: 9800 },
  { name: "Apr", users: 278, revenue: 3908 },
  { name: "May", users: 189, revenue: 4800 },
  { name: "Jun", users: 239, revenue: 3800 },
  { name: "Jul", users: 349, revenue: 4300 },
];

// Data for PieChart
const pieData = [
  { name: "Pending", count: 10 },
  { name: "In Progress", count: 15 },
  { name: "Delivered", count: 25 },
  { name: "Cancelled", count: 5 },
];

// Colors for PieChart
const COLORS = [
  "#FFBB28", "#0088FE", "#00C49F", "#FF8042", "#A020F0", "#FF6347", "#4682B4", "#32CD32", "#FFD700", "#DC143C", 
];


function ProviderHome() {

  const {providerInfo}  = useSelector((state:RootState) => state.provider)
  const [users, setUsers] = useState<number | null>(null);
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);

  useEffect(() => {
       fetchData()
  },[]);

  const fetchData = async() => {
      try {
         const response = await fetchDashboardData(providerInfo?.id as string);
         if(response.success){
           setUsers(response.dashboardData.users);
           setTotalRevenue(response.dashboardData.totalRevenue);
           setPieData(response.dashboardData.pieData);
           setLineData(response.dashboardData.lineData);
         }
        
      } catch (error) {
         console.log("Error in fetchData: ", error);
         
        
      }
  }

  


  return (
    <div className="container mx-auto p-4">
   
    <div className="flex flex-col md:flex-row justify-center gap-6 mt-8">
      
      <div className="flex items-center p-6 bg-green-500 text-white rounded-xl shadow-lg w-full md:w-1/3">
        <FaMoneyBillWave size={40} className="mr-4" />
        <div>
          <h2 className="text-xl font-semibold">Total Revenue</h2>
          <p className="text-3xl font-bold">${totalRevenue}</p>
        </div>
      </div>
  
      {/* Total Users */}
      <div className="flex items-center p-6 bg-blue-500 text-white rounded-xl shadow-lg w-full md:w-1/3">
        <FaUsers size={40} className="mr-4" />
        <div>
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-3xl font-bold">{users}</p>
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
              nameKey="name"
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

export default ProviderHome;
