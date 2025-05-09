import { useSelector } from "react-redux";
import JobCard from "../Jobs/JobCard";
import { Loader2 } from "lucide-react";

function ProposalTabContent({ activeTab, proposals }) {
    const loading = useSelector((state) => state.proposals.loading);
    const error = useSelector((state) => state.proposals.error);

    if (activeTab === "submitted") {
        return (
            <>
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-4">
                        Submitted Proposals - Awaiting Response
                    </h2>
                    {loading ? (
                        <div className="flex items-center justify-center py-6">
                            <Loader2 className="w-12 h-12 animate-spin text-gray-500" />
                        </div>
                    ) : error ? (
                        <h5>
                            An error occurred while fetching the proposals...
                        </h5>
                    ) : (
                        proposals
                            .filter(
                                (proposal) => proposal.status === "submitted"
                            )
                            .map((proposal) => (
                                <div key={proposal.id} className="mb-5">
                                    {proposal && proposal.jobPostId && (
                                        <div className="mb-5">
                                            <JobCard
                                                activeTab={activeTab}
                                                job={proposal.jobPostId}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))
                    )}
                </div>
            </>
        );
    }

    if (activeTab === "rejected") {
        return (
            <div>
                <h2 className="text-lg font-semibold mb-4">
                    Rejected Proposals
                </h2>
                {proposals
                    .filter((proposal) => proposal.status === "rejected")
                    .map((proposal) => (
                        <div key={proposal.id} className="mb-5">
                            {proposal && proposal.jobPostId && (
                                <JobCard
                                    activeTab={activeTab}
                                    job={proposal.jobPostId}
                                />
                            )}
                        </div>
                    ))}
            </div>
        );
    }

    return <div className="text-center text-gray-500 mt-8">No jobs found</div>;
}

export default ProposalTabContent;
