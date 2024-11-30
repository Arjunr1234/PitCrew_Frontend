import { Routes, Route, useNavigate } from "react-router-dom";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminLayout from "../components/admin/AdminLayout";  // Example layout for dashboard and other pages
import AdminDashboard from "../pages/admin/AdminDashboard";  // Example dashboard page
import AdminBookings from "../pages/admin/AdminBookings";
import Users from "../pages/admin/Users";
import Providers from "../pages/admin/Providers";
import GetAllProvider from "../components/admin/GetAllProvider";
import ProviderRequests from "../components/admin/ProviderRequests";
import Logout from "../components/admin/Logout";
import Brands from "../components/admin/Brands";
import GeneralServices from "../components/admin/GeneralServices";
import RoadServices from "../components/admin/RoadServices";
import AdminServices from "../pages/admin/AdminServices";
import ProtectedRoute from "../utils/protecteRoutes/admin";
import BookingView from "../components/admin/BookingView";

  


  



function AdminRoute() {
  return (
    <>
      <Routes>

        <Route path="login" element={<AdminLogin />} />
     <Route element={<ProtectedRoute/>}>
        <Route element={<AdminLayout />}>
   
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="bookings" element={<AdminBookings/>}/>
            <Route path="booking-view" element={<BookingView/>}/>
            <Route path="users" element={<Users/>}/>
            <Route path="providers" element={<Providers/>}>
                   <Route path="provider-request" element={<ProviderRequests/>}/>
                   <Route path="get-providers" element={<GetAllProvider/>}/>
            </Route>
            <Route path="services" element={<AdminServices/>}>
                   <Route path="brands" element={<Brands/>}/>
                   <Route path="general-services" element={<GeneralServices/>} />
                   <Route path="road-assistance" element={<RoadServices/>}  />
            </Route>
            <Route path="logout" element={<Logout/>} />
         </Route>
      </Route> 
      </Routes>
    </>
  );
}

export default AdminRoute;
