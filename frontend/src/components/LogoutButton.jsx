import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { LogOut } from "lucide-react";

const LogoutButton = () => {
  const dispatch = useDispatch();
  return (
    <button onClick={() => dispatch(logout())} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
      <LogOut className="w-5 h-5" />
    </button>
  );
};
export default LogoutButton