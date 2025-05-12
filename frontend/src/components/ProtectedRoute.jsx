import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Navbar } from "./Navbar";
import { MessageCircle } from "lucide-react";

const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);

  if (!token) {
    return <Navigate to="/login" />;
  }
  return (
    <>
      <Navbar />
      <div className="mb-8">{children}</div>
      <Link to={"/chats"} className="fixed bottom-16 right-2 sm:bottom-4 sm:right-4 bg-primary rounded-lg p-2 sm:p-4"><MessageCircle size={25} color="white"/></Link>
    </>
  );
};

export default ProtectedRoute;
