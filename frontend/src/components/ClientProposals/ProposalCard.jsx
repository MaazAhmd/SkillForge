import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ProposalCard({ proposal, openModal }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const message = proposal.message || "";
    const showReadMore = message.length > 100;

    const toggleReadMore = () => {
        setIsExpanded((prev) => !prev);
    };

    return (
        <div className="border rounded-lg p-4 shadow-sm bg-gray-50 relative">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-gray-700  mb-2">
                        <span className="font-semibold">Freelancer:</span>{" "}
                        {proposal.freelancerId?.user?.name || "N/A"}
                    </p>
                    <p className="text-sm text-gray-700  mb-2">
                        <span className="font-semibold">Price:</span> $
                        {proposal.price}
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                        <span className="font-semibold">Deadline:</span>{" "}
                        {new Date(proposal.deadline).toLocaleDateString()}
                    </p>
                    {proposal.status != "submitted" && (
                        <p className="text-sm text-gray-700 mb-2">
                            <span className="font-semibold">Status:</span>{" "}
                            <span className="capitalize">
                                {proposal.status}
                            </span>
                        </p>
                    )}
                    <p className="text-sm text-gray-600 italic">
                        {isExpanded ? message : `${message.slice(0, 100)}...`}
                        {showReadMore && (
                            <button
                                className="ml-1 text-blue-500 hover:underline text-xs"
                                onClick={toggleReadMore}
                            >
                                {isExpanded ? "Read less" : "Read more"}
                            </button>
                        )}
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    {proposal.status === "submitted" ? (
                        <>
                            <button
                                onClick={() => openModal(proposal)}
                                className="text-sm px-3 py-1 bg-primary text-white rounded-md hover:bg-primary/90 transition"
                            >
                                View Proposal
                            </button>
                            <Link
                                to={`/chat/${proposal.freelancerId._id}`}
                                className="text-sm px-3 py-1 bg-primary text-white rounded-md hover:bg-primary/90 transition"
                            >
                                Send Message
                            </Link>
                        </>
                    ) : (
                        <div className="text-sm px-3 py-1 bg-green-800 text-white rounded-md ">Proposal Accepted</div>
                    )}
                </div>
            </div>
        </div>
    );
}
