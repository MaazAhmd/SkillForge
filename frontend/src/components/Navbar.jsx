import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  Briefcase,
  Grid,
  User,
  LogOut,
  Mail,
  Bell,
  Settings,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import LogoutButton from "./LogoutButton";

export function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  return (
    <>
    <header className="bg-white drop-shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/svgs/logo.svg"
                className="h-8 w-9"
                alt="SkillForge Logo"
              />
              <span className="text-primary text-xl font-semibold tracking-tight">
                SkillForge
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 ml-8">
            {user?.role === "freelancer" && (
              <Link
                to="/jobs"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Find Work
              </Link>
            )}
            {user?.role === "client" && (
              <Link
                to="/jobs"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Posted Jobs
              </Link>
            )}
            <Link
              to="/projects"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Projects
            </Link>
            {user?.role === "freelancer" && (
              <Link
                to="/proposals"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Proposals
              </Link>
            )}
            {user?.role === "client" && (
              <Link
                to="/postjob"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Post Job
              </Link>
            )}
            {user?.role === "freelancer" && (
              <Link
                to="/addportfolio"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Portfolio
              </Link>
            )}
          </nav>

          {/* Desktop Right Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/profile"
              className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-full transition-colors"
            >
              <img
                src={user?.profilePicture || "/svgs/default_user.svg"}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
            </Link>
            <LogoutButton />
          </div>
        </div>
      </div>

    </header>
      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 pt-2 left-0 bg-[#5a5ea1] right-0  md:hidden z-50">
        <ul className="flex justify-around py-2">
          <li>
            <Link to="/" className="flex flex-col items-center">
              <Home className="w-6 h-6 text-white" />
            </Link>
          </li>
          <li>
            <Link to="/jobs" className="flex flex-col items-center">
              <Briefcase className="w-6 h-6 text-white" />
            </Link>
          </li>
          <li>
            <Link to="/projects" className="flex flex-col items-center">
              <Grid className="w-6 h-6 text-white" />
            </Link>
          </li>
          <li>
            <Link to="/profile" className="flex flex-col items-center">
              <User className="w-6 h-6 text-white" />
            </Link>
          </li>
          <li>
            <button onClick={() => dispatch({ type: 'auth/logout' })}>
              <LogOut className="w-6 h-6 text-white" />
            </button>
          </li>
        </ul>
      </nav>
      </>
  );
}
