import { Timer } from "lucide-react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

function OngoingProjectCard({ project }) {
    const deadline = project.deadline ? dayjs(project.deadline) : null;
    const now = dayjs();
    const isLate = deadline && deadline.isBefore(now);
    return (
        <Link className="rounded-lg p-1 mb-3">
            <h3 className="text-sm font-medium mb-2">{project.title}</h3>
            <div className="flex items-center justify-between">
                <div className="flex flex-col space-x-2 bg-gray-100 rounded-xl w-100 p-4">
                    <h4 className="text-md font-medium">
                        {project.jobPostId.title}
                    </h4>
                    <div className="flex space-x-2 my-3">
                        <span className="bg-primary text-white px-3 py-1 rounded-full font-semibold">
                            $ {project.price}
                        </span>
                        <div className="flex justify-center items-center gap-1">
                            <Timer className="h-5 w-5" />
                            <div className="text-gray-500 mt-1">
                                {project.deadline ? (
                                    <span
                                        className={
                                            isLate
                                                ? "text-red-500"
                                                : "text-gray-500"
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
                    </div>

                    <div className="flex items-center space-x-2">
                        <img
                            src={
                                project.clientId?.user?.profilePicture ||
                                "/images/default-avatar.png"
                            }
                            alt={project.clientId?.user?.name}
                            className="w-6 h-6 rounded-full"
                        />
                        <span className="text-sm text-gray-600">
                            {project.clientId?.user?.name}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default OngoingProjectCard;
