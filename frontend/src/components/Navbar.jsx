import React, { useState, useEffect } from "react";
import { Mail, Bell, Settings, Menu, X, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import LogoutButton from "./LogoutButton";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const user = useSelector((state) => state.auth.user);

    return (
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
                                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                            >
                                Find Work
                            </Link>
                        )}
                        {user?.role === "client" && (
                            <Link
                                to="/jobs"
                                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                            >
                                Posted Jobs
                            </Link>
                        )}
                        <Link
                            to="/projects"
                            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                        >
                            Projects
                        </Link>

                        {user?.role === "freelancer" && (
                            <Link
                                to="/proposals"
                                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                            >
                                Proposals
                            </Link>
                        )}
                        {user?.role === "client" && (
                            <Link
                                to="/postjob"
                                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                            >
                                Post
                            </Link>
                        )}
                        <Link
                            to="/dashboard"
                            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                        >
                            Dashboard
                        </Link>
                        {user?.role === "freelancer" && (
                            <Link
                                to="/addportfolio"
                                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                            >
                                Portfolio
                            </Link>
                        )}
                    </nav>

                    {/* Right Section */}
                    <div className="hidden md:flex items-center space-x-6">
                        <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                            <Mail className="w-5 h-5" />
                        </button>
                        <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                            <Settings className="w-5 h-5" />
                        </button>
                        <Link className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                            <Bell className="w-5 h-5" />
                        </Link>
                        <Link
                            to="/profile"
                            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-full transition-colors cursor-pointer"
                        >
                            <img
                                src="https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg"
                                alt="Profile"
                                className="w-8 h-8 rounded-full"
                            />
                        </Link>
                        <LogoutButton />
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                            aria-expanded={isOpen}
                        >
                            {isOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t">
                    <div className="px-4 pt-2 pb-3 space-y-1">
                        <Link
                            to="/jobs"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        >
                            Find Work
                        </Link>
                        <Link
                            to="/projects"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        >
                            Ongoing Projects
                        </Link>
                        <Link
                            to="/postjob"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        >
                            Post
                        </Link>
                        <Link
                            to="/dashboard"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        >
                            Dashboard
                        </Link>
                    </div>
                    <div className="px-4 py-4 border-t flex items-center justify-between">
                        <div className="flex space-x-4">
                            <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
                                <Mail className="w-5 h-5" />
                            </button>
                            <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
                                <Settings className="w-5 h-5" />
                            </button>
                            <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
                                <Bell className="w-5 h-5" />
                            </button>
                        </div>
                        <Link
                            to="/profile"
                            className="hover:bg-gray-100 p-2 rounded-full"
                        >
                            <img
                                src="https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg"
                                alt="Profile"
                                className="w-8 h-8 rounded-full"
                            />
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
