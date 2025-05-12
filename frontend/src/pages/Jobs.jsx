import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import {
    fetchCategories,
    fetchJobs,
    setCategory,
    setSearchQuery,
} from "../redux/slices/jobSlice";
import CategoryTabs from "../components/Jobs/CategoryTabs";
import JobCard from "../components/Jobs/JobCard";
import OngoingProjectCard from "../components/Jobs/OngoingProjectCard";
import MessageCard from "../components/Jobs/MessageCard";
import { fetchActiveProjects } from "../redux/slices/projectSlice";

const messages = [
    {
        author: "Husnain Raza",
        message: "I have a question about the project",
        time: "11-May",
        avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&dpr=2",
    },
];

function Jobs() {
    const dispatch = useDispatch();
    const {
        filteredJobs,
        activeCategory,
        searchQuery,
        loading,
        error,
        categories,
    } = useSelector((state) => state.job);

    const openJobs = filteredJobs.filter((job) => job.status === "open");

    useEffect(() => {
        dispatch(fetchActiveProjects());
    }, [dispatch]);

    const ongoingProjects = useSelector((state) =>
        state.project.activeProjects?.filter(
            (project) =>
                project.status != "completed-not-reviewed" &&
                project.status != "completed-reviewed" &&
                project.status != "cancelled"
        )
    );

    useEffect(() => {
        dispatch(fetchJobs());
        dispatch(fetchCategories());
    }, [dispatch]);

    return (
        <div className="min-h-screen lg:py-5 lg:px-8 md:py-3 md:px-5">
            <CategoryTabs
                categories={categories}
                activeCategory={activeCategory}
                onSelect={(cat) => dispatch(setCategory(cat))}
            />

            <main className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="relative mb-6">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search for Jobs..."
                                value={searchQuery}
                                onChange={(e) =>
                                    dispatch(setSearchQuery(e.target.value))
                                }
                                className="w-full pl-10 pr-4 py-2 bg-darkgrey rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <h2 className="text-lg font-semibold mb-4">
                            New jobs you might like
                        </h2>
                        <div className="space-y-4 bg-darkgrey p-4 rounded-xl">
                            {loading && <p>Loading...</p>}
                            {error && <p className="text-red-500">{error}</p>}
                            {!loading && openJobs.length === 0 && (
                                <p className="text-gray-400">No jobs found.</p>
                            )}
                            {openJobs ? (
                                openJobs.map((job) => (
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
                        {/* Ongoing Projects */}
                        <div className="bg-white p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">
                                    Ongoing Projects
                                </h2>
                            </div>
                            {ongoingProjects && ongoingProjects.length > 0 ? (
                                ongoingProjects.map((project, index) => (
                                    <OngoingProjectCard
                                        key={index}
                                        project={project}
                                    />
                                ))
                            ) : (
                                <h5 className="text-gray-400 my-8 text-center">
                                    No ongoing projects
                                </h5>
                            )}
                        </div>

                        {/* Recent Messages */}
                        {/* <div className="bg-white p-4 rounded-lg">
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
                        </div> */}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Jobs;
