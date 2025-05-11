import React from "react";
import ProjectCard from "./ProjectCard";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

function TabContent({ activeTab, projects }) {
    const loading = useSelector((state) => state.project.loading);
    const error = useSelector((state) => state.project.error);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today

    const isDueTodayOrPast = (date) => {
        return new Date(date) <= today;
    };
    const projectsDueToday = projects
        .filter(
            (project) =>
                project.status === "in-process" ||
                project.status === "delivered" ||
                project.status === "in-revision"
        )
        .filter((project) => isDueTodayOrPast(project.deadline));
    const projectsDueInFuture = projects
        .filter(
            (project) =>
                project.status === "in-process" ||
                project.status === "delivered" ||
                project.status === "in-revision"
        )
        .filter((project) => !isDueTodayOrPast(project.deadline));
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
                    ) : projects && projectsDueToday.length > 0 ? (
                        projectsDueToday.map((project) => (
                            <div key={project._id} className="mb-5">
                                <ProjectCard project={project} />
                            </div>
                        ))
                    ) : (
                        <h5 className="text-gray-400 py-8 my-8 text-center">
                            No projects due today.
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
                    ) : projects && projectsDueInFuture.length > 0 ? (
                        projectsDueInFuture.map((project) => (
                            <div key={project._id} className="mb-5">
                                <ProjectCard
                                    activeTab={activeTab}
                                    project={project}
                                />
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
                    ) : projects && projects.length > 0 ? (
                        projects
                            .filter(
                                (project) =>
                                    project.status === "completed-reviewed" ||
                                    project.status === "completed-not-reviewed"
                            )
                            .map((project) => (
                                <div key={project._id} className="mb-5">
                                    <ProjectCard
                                        activeTab={activeTab}
                                        project={project}
                                    />
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
