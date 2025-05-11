import React from "react";
import { Timer, FileText, XCircle, Scale } from "lucide-react";
import dayjs from "dayjs";

function ProjectCard({ project }) {
    const deadline = project.deadline ? dayjs(project.deadline) : null;
    const now = dayjs();

    const isLate = deadline && deadline.isBefore(now);
    return (
        <div
            className="bg-white p-6 rounded-lg shadow-sm mb-2"
            style={{ hover: { Scale: "1.02" } }}
        >
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                    {project.jobPostId?.title}
                </h3>
            </div>

            <p className="text-gray-600 mb-4 text-sm"></p>

            <div className="flex items-center space-x-2 mb-4">
                <img
                    src={
                        project.clientId?.user?.profilePicture ||
                        "../../public/profile/default-profile.png"
                    }
                    alt={project.clientId?.user?.name}
                    className="w-6 h-6 rounded-full"
                />
                <span className="text-sm text-gray-600">
                    {project.clientId?.user?.name}
                </span>
            </div>

            <div className="flex items-center mt-3 justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-3">
                    <span className="bg-primary text-white px-3 py-1 rounded-full font-semibold text-sm">
                        ${project.budget}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                        <Timer className="h-4 w-4 mr-1" />
                        {deadline ? (
                            <span
                                className={
                                    isLate ? "text-red-500" : "text-gray-500"
                                }
                            >
                                {deadline.format("MMM D, YYYY")}{" "}
                                {isLate && "(Late)"}
                            </span>
                        ) : (
                            <span className="text-gray-500">N/A</span>
                        )}
                    </div>
                </div>

                <div className="flex gap-2">
                    <button className="flex items-center gap-1 bg-primary text-white px-3 py-1 rounded-md text-sm hover:bg-primary/90 transition">
                        <FileText className="w-4 h-4" />
                        Deliver
                    </button>
                    <button className="flex items-center gap-1 border border-primary text-primary px-3 py-1 rounded-md text-sm hover:bg-primary hover:text-white transition">
                        <FileText className="w-4 h-4" />
                        View Proposal
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProjectCard;
