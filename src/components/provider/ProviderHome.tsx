import React from "react";
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
const COLORS = ["#FFBB28", "#0088FE", "#00C49F", "#FF8042"];

function ProviderHome() {
  return (
    <div>
      <h1 className="text-center text-lg">Welcome to ProviderHome</h1>
      
      {/* Line Chart */}
      <div className="flex md:flex-row flex-col justify-center mt-8">
        <LineChart
          width={500}
          height={300}
          data={lineData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
          <Line type="monotone" dataKey="users" stroke="#82ca9d" />
        </LineChart>

        <PieChart width={400} height={400}>
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
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
      
      {/* Pie Chart */}
      <div className="flex  flex-row justify-center mt-8">
        
      </div>
    </div>
  );
}

export default ProviderHome;
