import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";

const LogoutButton = () => {
  const dispatch = useDispatch();
  return (
    <button onClick={() => dispatch(logout())} className="text-red-500">
      Logout
    </button>
  );
};
export default LogoutButton