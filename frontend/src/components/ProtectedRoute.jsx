import { Navigate } from "react-router-dom";
 import { useSelector } from "react-redux";
import { Navbar } from "./Navbar";
 
 const ProtectedRoute = ({ children }) => {
   const token = useSelector((state) => state.auth.token);
 
   return token ? <div><Navbar/> {children} </div>: <Navigate to="/login" />;
 };
 
 export default ProtectedRoute;
 
