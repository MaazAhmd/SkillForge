import { useState } from "react";
import { Link } from "react-router-dom";
import '../index.css';
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header Section */}
      <div className="py-8 px-4 ">
      <div
  className="text-white py-20 px-4 text-center rounded-xl bg-no-repeat bg-cover bg-center"
  style={{ backgroundImage: "url('/images/login_img.png')" }}
>
  <h1 className="text-4xl font-bold mb-2">Welcome back.</h1>
  <p className="text-lg">Login to regain access to the World of Freelancers!</p>
</div>

</div>
      {/* Form Section */}
      <div className="flex justify-center mt-[-60px] px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
        >
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

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

          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="rememberMe"
              className="mr-2 accent-primary"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label htmlFor="rememberMe" className="text-sm text-gray-700">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-xl hover:bg-opacity-90 transition"
          >
            SIGN UP
          </button>

          <p className="text-sm text-center mt-4">
         <span className="font-bold text-gray-400">   Want to Join?</span>{" "}
            <Link to="/signup" className="text-primary font-bold hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
