import React from "react";
import JobCard from "../Jobs/JobCard";

function TabContent({ activeTab, jobs }) {
    if (activeTab === "active") {
        return (
            <>
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-4">Due Today</h2>
                    {jobs
                        .filter((job) => job.dueType === "today")
                        .map((job) => (
                            <div key={job.id} className="mb-5">
                                <JobCard activeTab={activeTab} job={job} />
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
                            <div key={job.id} className="mb-5">
                                <JobCard activeTab={activeTab} job={job} />
                            </div>
                        ))}
                </div>
            </>
        );
    } else if (activeTab === "completed") {
        return (
            <>
                <div className="mb-6">
                    {jobs
                        .filter((job) => job.dueType === "today")
                        .map((job) => (
                            <div key={job.id} className="mb-5">
                                <JobCard activeTab={activeTab} job={job} />
                            </div>
                        ))}
                </div>
                <div>
                    {jobs
                        .filter((job) => job.dueType === "next5days")
                        .map((job) => (
                            <div className="mb-5">
                                <JobCard activeTab={activeTab} job={job} />
                            </div>
                        ))}
                </div>
            </>
        );
    }
}

export default TabContent;
