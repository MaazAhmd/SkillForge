import React from "react";
import JobCard from "../Jobs/JobCard";

function TabContent({ activeTab, jobs, appliedJobs }) {
    if (activeTab === "active") {
        return (
            <>
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-4">Due Today</h2>
                    {jobs
                        .filter((job) => job.dueType === "today")
                        .map((job) => (
                            <div className="mb-5">
                                <JobCard
                                    key={job.id}
                                    activeTab={activeTab}
                                    job={job}
                                />
                            </div>
                        ))}
                </div>
                <div>
                    <h2 className="text-lg font-semibold mb-4">
                        Due in the next 5 days or more
                    </h2>
                    {jobs
                        .filter((job) => job.dueType === "next5days")
                        .map((job) => (
                            <div className="mb-5">
                                <JobCard
                                    key={job.id}
                                    activeTab={activeTab}
                                    job={job}
                                />
                            </div>
                        ))}
                </div>
            </>
        );
    }

    if (activeTab === "applied") {
        return (
            <div>
                <h2 className="text-lg font-semibold mb-4">
                    Jobs you have applied to
                </h2>
                {appliedJobs.map((job) => (
                    <div className="mb-5">
                        {job && (
                            <JobCard
                                key={job.id}
                                activeTab={activeTab}
                                job={job}
                            />
                        )}
                    </div>
                ))}
            </div>
        );
    }

    return <div className="text-center text-gray-500 mt-8">No jobs found</div>;
}

export default TabContent;
