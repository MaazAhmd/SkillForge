import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/slices/authSlice";
import { Link } from "react-router-dom";
import '../index.css';
import RoleToggle from "../components/RoleToggle";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const { status, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("freelancer");
  const [name, setName] = useState(""); 
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(registerUser({ name, email, password, role }));
  
    if (registerUser.fulfilled.match(resultAction)) {
      navigate('/'); 
    }
  };  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="py-8 px-4">
        <div
          className="text-white py-20 px-4 text-center rounded-xl bg-no-repeat bg-cover bg-center"
          style={{ backgroundImage: "url('/images/login_img.png')" }}
        >
          <h1 className="text-4xl font-bold mb-2">Welcome back.</h1>
          <p className="text-lg">Login to regain access to the World of Freelancers!</p>
        </div>
      </div>

      <div className="flex justify-center mt-[-60px] px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
        >
          <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Your email address"
              className="w-full px-4 py-3 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
          <label className="block text-gray-700 mb-1">Name</label>
          <input
            type="text"
            placeholder="Your full name"
            className="w-full px-4 py-3 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>


          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Your password"
              className="w-full px-4 py-2 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <label className="block mb-2 font-medium">Select Role</label>
          <RoleToggle selected={role} onChange={setRole} />

          <button
            type="submit"
            className="w-full bg-primary text-white hover:brightness-90 py-2 rounded-xl hover:bg-opacity-90 transition mt-4"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Signing up..." : "SIGN UP"}
          </button>

          {error && (
            <p className="text-sm text-red-500 text-center mt-2">{error}</p>
          )}

          <p className="text-sm text-center mt-4">
            <span className="font-bold text-gray-400">Already have an account?</span>{" "}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
