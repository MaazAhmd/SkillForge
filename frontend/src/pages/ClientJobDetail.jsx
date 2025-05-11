import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Loader2 } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import ViewProposalModal from "../components/ClientProposals/ViewProposalModal";
import ProposalCard from "../components/ClientProposals/ProposalCard";

function ClientJobDetail() {
    const { id } = useParams();
    const [job, setJob] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [proposals, setProposals] = useState([]);

    const [selectedProposal, setSelectedProposal] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const toggleReadMore = (id) => {
        setExpandedMessages((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const openModal = (proposal) => {
        setSelectedProposal(proposal);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setSelectedProposal(null);
    };

    const [jobLoading, setJobLoading] = useState(true);
    const [proposalsLoading, setProposalsLoading] = useState(true);

    useEffect(() => {
        axios
            .get(`jobs/${id}`)
            .then((res) => {
                setJob(res.data.data);
                setJobLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setJobLoading(false);
            });

        axios
            .get(`jobs/${id}/proposals`)
            .then((res) => {
                setProposals(res.data.data);
                setProposalsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setProposalsLoading(false);
            });
    }, []);

    const [activeTab, setActiveTab] = useState("active");
    const activeProposals = proposals?.filter((p) => p.status === "submitted" || p.status === "accepted");
    const withdrawnProposals = proposals?.filter(
        (p) => p.status === "rejected" || p.status === "withdrawn"
    );

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

                            {jobLoading ? (
                                <div className="flex items-center justify-center h-64">
                                    <Loader2 className="animate-spin text-primary h-10 w-10" />
                                </div>
                            ) : (
                                <div className="space-y-4 bg-white p-6 rounded-xl">
                                    <h1 className="text-2xl font-bold">
                                        {job.title}
                                    </h1>

                                    <p className="text-sm">{job.description}</p>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="flex gap-2">
                                            <p className="font-semibold">
                                                Category:
                                            </p>
                                            <p>{job.category}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <p className="font-semibold">
                                                Budget:
                                            </p>
                                            <p>${job.budget}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <p className="font-semibold">
                                                Deadline:
                                            </p>
                                            <p>
                                                {new Date(
                                                    job.deadline
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <p className="font-semibold">
                                                Status:
                                            </p>
                                            <p className="capitalize">
                                                {job.status}
                                            </p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="font-semibold mb-2">
                                                Skills Required:
                                            </p>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {job.skills
                                                    ? job.skills.map(
                                                          (skill, idx) => (
                                                              <span
                                                                  key={idx}
                                                                  className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm"
                                                              >
                                                                  {skill}
                                                              </span>
                                                          )
                                                      )
                                                    : "N/A"}
                                            </div>
                                        </div>
                                    </div>

                                    {job.status === "open" && (
                                        <div className="pt-4">
                                            <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold text-white cursor-pointer">
                                                Delete Job Post
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <h1 className="text-xl font-semibold my-7">
                            Proposals received for this Job
                        </h1>
                        {proposals && proposals.length > 0 ? (
                            proposalsLoading ? (
                                <div className="flex items-center justify-center h-64">
                                    <Loader2 className="animate-spin text-primary h-10 w-10" />
                                </div>
                            ) : (
                                <div className="mt-6 bg-white p-6 rounded-xl space-y-4">
                                    {/* Tabs */}
                                    <div className="flex space-x-4 border-b border-gray-200 mb-8">
                                        <button
                                            onClick={() =>
                                                setActiveTab("active")
                                            }
                                            className={`py-2 px-4 text-sm font-medium ${
                                                activeTab === "active"
                                                    ? "border-b-2 border-blue-600 text-blue-600"
                                                    : "text-gray-600 hover:text-blue-600"
                                            }`}
                                        >
                                            Active Proposals
                                        </button>
                                        <button
                                            onClick={() =>
                                                setActiveTab("withdrawn")
                                            }
                                            className={`py-2 px-4 text-sm font-medium ${
                                                activeTab === "withdrawn"
                                                    ? "border-b-2 border-blue-600 text-blue-600"
                                                    : "text-gray-600 hover:text-blue-600"
                                            }`}
                                        >
                                            Withdrawn / Rejected
                                        </button>
                                    </div>

                                    {/* Proposal Cards */}
                                    {(activeTab === "active"
                                        ? activeProposals
                                        : withdrawnProposals
                                    ).map((proposal) => (
                                        <ProposalCard
                                            key={proposal._id}
                                            proposal={proposal}
                                            openModal={openModal}
                                        />
                                    ))}

                                    {(activeTab === "active"
                                        ? activeProposals.length === 0
                                        : withdrawnProposals.length === 0) && (
                                        <p className="text-sm text-gray-500">
                                            No{" "}
                                            {activeTab === "active"
                                                ? "active"
                                                : "withdrawn"}{" "}
                                            proposals found.
                                        </p>
                                    )}
                                </div>
                            )
                        ) : (
                            <p>No Proposals received yet.</p>
                        )}

                        {/* Modal */}
                        {isOpen && selectedProposal && (
                            <ViewProposalModal
                                selectedProposal={selectedProposal}
                                selectedJob={job}
                                isOpen={isOpen}
                                closeModal={closeModal}
                            />
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
                        {/* <h6 className="mb-4 text-lg font-bold">
              Any relevant info worth showing :)
            </h6>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center space-x-3"></div>
            </div> */}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ClientJobDetail;
