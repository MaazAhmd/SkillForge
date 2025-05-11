import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Navbar } from "./Navbar";

const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Navbar />
      <div className="mb-8">{children}</div>
    </>
  );
};

export default ProtectedRoute;
