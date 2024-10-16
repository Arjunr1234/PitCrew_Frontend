import { Routes, Route, useNavigate } from "react-router-dom";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminLayout from "../components/admin/AdminLayout";  // Example layout for dashboard and other pages
import AdminDashboard from "../pages/admin/AdminDashboard";  // Example dashboard page
import AdminProfile from "../pages/admin/AdminProfile";
import Users from "../pages/admin/Users";
import Providers from "../pages/admin/Providers";
import GetAllProvider from "../components/admin/GetAllProvider";
import ProviderRequests from "../components/admin/ProviderRequests";
import Logout from "../components/admin/Logout";
import Brands from "../components/admin/Brands";
import GeneralServices from "../components/admin/GeneralServices";
import RoadServices from "../components/admin/RoadServices";
import AdminServices from "../pages/admin/AdminServices";
import { Children, ReactNode, useEffect } from "react";
import { axiosInstance } from "../api/common";
import { URL } from "../utils/api";
import { toast } from "sonner";
import axios from "axios";

  
 interface ProtectedRouteProps{
          children:ReactNode;
 }

  const ProtectedRoute = ({children}: ProtectedRouteProps) => {
         
             const navigate = useNavigate();
             useEffect(() => {
                axiosInstance.get(URL + '/api/admin/auth/verify-token').then((response) => {
                    const adminData = JSON.parse(localStorage.getItem("isAdmin") || '{}');
                    console.log("myr",adminData);
                    
                    if(!adminData.isAdmin){
                      toast.error("Session is expired, please login");
                      navigate("/admin/login", {replace:true})
                    }
                }).catch((error) => {
                     console.log("pri",error);

                     if(axios.isAxiosError(error)){
                        const statusCode = error.response?.status;
                        if(statusCode === 403){
                          localStorage.removeItem("isAdmin");
                          toast.error("Session expired please login!!");
                          navigate('/admin/login', {replace:true})
                        }
                        
                     }else{
                      console.log("Something went wrong: ", error)
                     }
                })
             })
              return<>{children}</>
  }



function AdminRoute() {
  return (
    <>
      <Routes>

        <Route path="login" element={<AdminLogin />} />
        <Route element={<AdminLayout />}>
            <Route path="dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="profile" element={<AdminProfile/>}/>
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
      </Routes>
    </>
  );
}

export default AdminRoute;
