import React from "react";
import JobCard from "../Jobs/JobCard";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

function TabContent({ activeTab, jobs }) {
    const loading = useSelector((state) => state.project.loading);
    const error = useSelector((state) => state.project.error);

    if (activeTab === "active") {
        return (
            <>
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-4">Due Today</h2>
                    {loading ? (
                        <div className="flex items-center justify-center py-6">
                            <Loader2 className="w-12 h-12 animate-spin text-gray-500" />
                        </div>
                    ) : error ? (
                        <h5>
                            An error occurred while fetching the projects...
                        </h5>
                    ) : jobs && jobs.length > 0 ? (
                        jobs
                            .filter((job) => job.dueType === "today")
                            .map((job) => (
                                <div key={job.id} className="mb-5">
                                    <JobCard activeTab={activeTab} job={job} />
                                </div>
                            ))
                    ) : (
                        <h5 className="text-gray-400 py-8 my-8 text-center">
                            No projects due in the next 5 days.
                        </h5>
                    )}
                </div>
                <div>
                    <h2 className="text-lg font-semibold mb-4">
                        Due in the next 5 days or more
                    </h2>
                    {loading ? (
                        <div className="flex items-center justify-center py-6">
                            <Loader2 className="w-12 h-12 animate-spin text-gray-500" />
                        </div>
                    ) : error ? (
                        <h5>
                            An error occurred while fetching the projects...
                        </h5>
                    ) : jobs && jobs.length > 0 ? (
                        jobs
                            .filter((job) => job.dueType === "today")
                            .map((job) => (
                                <div key={job.id} className="mb-5">
                                    <JobCard activeTab={activeTab} job={job} />
                                </div>
                            ))
                    ) : (
                        <h5 className="text-gray-400 py-8 my-8 text-center">
                            No projects due.
                        </h5>
                    )}
                </div>
            </>
        );
    } else if (activeTab === "completed") {
        return (
            <>
                <div className="mb-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-6">
                            <Loader2 className="w-12 h-12 animate-spin text-gray-500" />
                        </div>
                    ) : error ? (
                        <h5>
                            An error occurred while fetching the projects...
                        </h5>
                    ) : jobs && jobs.length > 0 ? (
                        jobs
                            .filter(
                                (job) =>
                                    job.status === "completed" ||
                                    job.status === "completed-not-reviewed"
                            )
                            .map((job) => (
                                <div key={job.id} className="mb-5">
                                    <JobCard activeTab={activeTab} job={job} />
                                </div>
                            ))
                    ) : (
                        <h5 className="text-gray-400 py-8 my-8 text-center">
                            No projects to show.
                        </h5>
                    )}
                </div>
            </>
        );
    }
}

export default TabContent;
