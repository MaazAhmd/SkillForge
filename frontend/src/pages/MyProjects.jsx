import React, { useState, useEffect } from "react";
import { Search, Calendar, Filter } from "lucide-react";
import TabContent from "../components/MyProjects/TabContent";
import Tabs from "../components/MyProjects/Tabs";
import { FilterX, CheckCircle2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAppliedJobs } from "../redux/slices/appliedJobsSlice";
import { fetchActiveProjects } from "../redux/slices/projectSlice";
import { fetchCategories, fetchJobs } from "../redux/slices/jobSlice";

function MyProjects() {
    const [activeTab, setActiveTab] = useState("active");
    const [showFilters, setShowFilters] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchActiveProjects());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchJobs());
        dispatch(fetchCategories());
    }, [dispatch]);

    const projects = useSelector((state) => state.project.activeProjects) || [];

    return (
        <div className="min-h-screenprimary">
            <main className="max-w-7xl mx-auto px-4 py-6">
                <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* Search and Filters */}
                <div className="mb-6">
                    <div className="relative lg:mx-3">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder={
                                activeTab === "active"
                                    ? "Search in Active projects..."
                                    : "Search in Completed projects..."
                            }
                            className="w-full pl-10 pr-20 py-3 bg-darkgrey rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-lg flex items-center space-x-1"
                        >
                            <Filter className="w-4 h-4" />
                            <span>Filters</span>
                        </button>
                    </div>

                    {showFilters && (
                        <div className="bg-white p-4 rounded-lg mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <select className="w-full border rounded-lg p-2">
                                    <option>Select category</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Skills
                                </label>
                                <input
                                    type="text"
                                    placeholder="Add skills or filter"
                                    className="w-full border rounded-lg p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Min Price
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter min price"
                                    className="w-full border rounded-lg p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Max Price
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter max price"
                                    className="w-full border rounded-lg p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Start Date
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        className="w-full border rounded-lg p-2"
                                    />
                                    <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    End Date
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        className="w-full border rounded-lg p-2"
                                    />
                                    <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                            </div>

                            <div className="col-span-2 flex items-end space-x-4">
                                <button className="bg-primary text-white px-6 py-2 rounded-lg flex items-center space-x-2">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span>Apply</span>
                                </button>
                                <button className="flex items-center gap-1 px-6 py-2 border border-red-500 text-red-600 rounded-md text-sm hover:bg-red-50 transition">
                                    <FilterX className="w-5 h-5" />
                                    <span>Clear Filters</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <TabContent activeTab={activeTab} jobs={projects} />
            </main>
        </div>
    );
}

export default MyProjects;
