import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Search, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import JobCard from "../components/Jobs/JobCard";
import MessageCard from "../components/Jobs/MessageCard";
import { fetchClientJobs } from "../redux/slices/clientJobsSlice";

const messages = [
    {
        author: "Husnain Raza",
        message: "I have a question about the project",
        time: "11-May",
        avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&dpr=2",
    },
];

function ClientJobs() {
    const [search, setSearch] = useState("");
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchClientJobs());
    }, [dispatch]);

    const clientJobs = useSelector((state) => state.clientJobs.jobs);
    const loading = useSelector((state) => state.clientJobs.loading);
    const error = useSelector((state) => state.clientJobs.error);

    return (
        <div className="min-h-screen lg:py-5 lg:px-8 md:py-3 md:px-5">
            <main className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="relative mb-6">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search for Jobs..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-darkgrey rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <h2 className="text-lg font-semibold mb-4">
                            Jobs Posted by You
                        </h2>
                        <p className="mb-4">
                            Activily recieving proposals for these jobs
                        </p>

                        <div className="space-y-4 bg-darkgrey p-4 rounded-xl">
                            {loading && (
                                <div className="flex items-center justify-center py-6">
                                    <Loader2 className="w-12 h-12 animate-spin text-gray-500" />
                                </div>
                            )}
                            {error && <p className="text-red-500">{error}</p>}
                            {!loading && clientJobs.length === 0 && (
                                <p className="text-gray-400">
                                    No jobs posted by you.
                                </p>
                            )}
                            {clientJobs ? (
                                clientJobs
                                    .filter((job) => job.status === "open")
                                    .map((job) => (
                                        <div
                                            key={job._id}
                                            className="transition-transform transform hover:scale-102 duration-300"
                                        >
                                            <Link to={`/jobs/${job._id}`}>
                                                <JobCard job={job} />
                                            </Link>
                                        </div>
                                    ))
                            ) : (
                                <h5 className="text-gray-400 py-8 my-8 text-center">
                                    No jobs found.
                                </h5>
                            )}
                        </div>

                        <h2 className="text-lg font-semibold mt-8 mb-4">
                            Past Job Posts
                        </h2>
                        <p className="mb-4">
                            Jobs that are in-progress, completed or closed
                        </p>

                        <div className="space-y-4 bg-darkgrey p-4 rounded-xl">
                            {loading && (
                                <div className="flex items-center justify-center py-6">
                                    <Loader2 className="w-12 h-12 animate-spin text-gray-500" />
                                </div>
                            )}
                            {error && <p className="text-red-500">{error}</p>}
                            {!loading && clientJobs.length === 0 && (
                                <p className="text-gray-400">
                                    No jobs posted by you.
                                </p>
                            )}
                            {clientJobs ? (
                                clientJobs
                                    .filter((job) => job.status !== "open")
                                    .map((job) => (
                                        <div
                                            key={job._id}
                                            className="transition-transform transform hover:scale-102 duration-300"
                                        >
                                            <Link to={`/jobs/${job._id}`}>
                                                <JobCard job={job} />
                                            </Link>
                                        </div>
                                    ))
                            ) : (
                                <h5 className="text-gray-400 py-8 my-8 text-center">
                                    No jobs found.
                                </h5>
                            )}
                        </div>
                    </div>
                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Recent Messages */}
                        <div className="bg-white p-4 rounded-lg">
                            <h2 className="text-lg font-semibold mb-4">
                                Recent Messages
                            </h2>
                            {messages ? (
                                messages.map((message, index) => (
                                    <MessageCard
                                        key={index}
                                        message={message}
                                    />
                                ))
                            ) : (
                                <h5 className="text-gray-400 my-8 text-center">
                                    No messages
                                </h5>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ClientJobs;
