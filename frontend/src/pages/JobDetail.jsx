import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Search } from "lucide-react";
import axios from "../api/axios";

import JobCard from "../components/Jobs/JobCard";
import OngoingProjectCard from "../components/Jobs/OngoingProjectCard";
import SendProposalModal from "../components/Jobs/SendProposalModal";
import MessageCard from "../components/Jobs/MessageCard";
import { useParams, Link } from "react-router-dom";

const messages = [
    {
        author: "Lord Magneto",
        message: "It was nice talking to you my nigga. You are not...",
        time: "14-April",
        avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&dpr=2",
    },
];
const ongoingProjects = [
    {
        title: "Creating a database using Postgres and development of a game development system...",
        price: 5.5,
        timeLeft: "2 hours",
        author: {
            name: "Maaz Ahmad",
            avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&dpr=2",
        },
    },
];

function JobDetail() {
    const { id } = useParams();
    const [job, setJob] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [proposals, setProposals] = useState([]);

    useEffect(() => {
        axios
            .get(`jobs/${id}`)
            .then((res) => setJob(res.data.data))
            .catch((err) => console.log(err));

        axios
            .get(`jobs/${id}/proposals`)
            .then((res) => setProposals(res.data.data))
            .catch((err) => console.log(err));
    });

    return (
        <div className="min-h-screen lg:py-5 lg:px-8 md:py-3 md:px-5">
            <main className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Link
                            to="/jobs"
                            className="bg-primary text-white px-5 py-1.5 rounded-full font-semibold"
                        >
                            Back to All Jobs
                        </Link>
                        <div>
                            <h2 className="text-2xl font-semibold my-5">
                                Job Details
                            </h2>
                            <div className="space-y-4 bg-white p-6 rounded-xl">
                                <h1 className="text-2xl font-bold">
                                    {job.title}
                                </h1>

                                <p className="text-sm">{job.description}</p>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="font-semibold">
                                            Category:
                                        </p>
                                        <p>{job.category}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Budget:</p>
                                        <p>${job.budget}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">
                                            Deadline:
                                        </p>
                                        <p>
                                            {new Date(
                                                job.deadline
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Status:</p>
                                        <p className="capitalize">
                                            {job.status}
                                        </p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="font-semibold">
                                            Skills Required:
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-1"></div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold text-white"
                                    >
                                        Send Proposal
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Proposals Section */}
                        {proposals && proposals.length > 0 && (
                            <div className="mt-6 bg-white p-6 rounded-xl space-y-4">
                                <h2 className="text-lg font-semibold">
                                    Your Proposals for this Job
                                </h2>
                                {proposals.map((proposal) => (
                                    <div
                                        key={proposal._id}
                                        className="border rounded-lg p-4 shadow-sm bg-gray-50"
                                    >
                                        <p className="text-sm text-gray-700 mb-1">
                                            <span className="font-semibold">
                                                Freelancer:
                                            </span>{" "}
                                            {proposal.freelancerId?.name ||
                                                "N/A"}
                                        </p>
                                        <p className="text-sm text-gray-700 mb-1">
                                            <span className="font-semibold">
                                                Price:
                                            </span>{" "}
                                            ${proposal.price}
                                        </p>
                                        <p className="text-sm text-gray-700 mb-1">
                                            <span className="font-semibold">
                                                Deadline:
                                            </span>{" "}
                                            {new Date(
                                                proposal.deadline
                                            ).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm text-gray-700 mb-2">
                                            <span className="font-semibold">
                                                Status:
                                            </span>{" "}
                                            <span className="capitalize">
                                                {proposal.status}
                                            </span>
                                        </p>
                                        <p className="text-sm text-gray-600 italic">
                                            {proposal.message}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {showModal && (
                        <SendProposalModal
                            job={job}
                            onClose={() => setShowModal(false)}
                        />
                    )}

                    {/* Sidebar - User info */}
                    <div className="space-y-6">
                        <h6 className="mb-4 text-lg font-bold">
                            Client Information
                        </h6>

                        <div className="bg-white p-4 rounded-lg shadow">
                            <div className="flex items-center space-x-3">
                                <img
                                    src={
                                        job.clientId?.user?.profilePicture ||
                                        "/profile/default-profile.png"
                                    }
                                    alt={job.clientId?.user?.name || "Client"}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {job.clientId?.user?.name ||
                                            "Unnamed Client"}
                                    </p>

                                    {/* Rating */}
                                    <div className="flex items-center text-yellow-500 mt-1">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 fill-current"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.781 1.401 8.17L12 18.896l-7.335 3.865 1.401-8.17L.132 9.21l8.2-1.192z" />
                                        </svg>
                                        <span className="ml-1 text-sm text-gray-700 font-semibold">
                                            4.8
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Send Message Button */}
                            <div className="mt-4">
                                <button className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm transition">
                                    Send Message
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default JobDetail;
