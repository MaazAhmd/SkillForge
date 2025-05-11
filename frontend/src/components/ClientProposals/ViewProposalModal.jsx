import { useEffect, useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccount } from "../../redux/slices/accountSlice";
import axios from "../../api/axios";
import { Loader2 } from "lucide-react";

export default function ViewProposalModal({
    selectedProposal,
    selectedJob,
    isOpen,
    closeModal,
}) {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAccount());
    }, [dispatch]);

    const userAccount = useSelector((state) => state.account?.account);

    const [step, setStep] = useState("view");
    const proposalAmount = selectedProposal.price || inf;
    const userBalance = userAccount?.balance || 0;
    const hasEnoughBalance = userBalance >= proposalAmount;

    const handleAcceptClick = () => {
        setStep("confirm");
    };

    const [paymentLoading, setPaymentLoading] = useState(false);
    const handleConfirmPayment = () => {
        setPaymentLoading(true);
        axios
            .put(`/proposals/${selectedProposal._id}/accept`)
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    alert("Proposal accepted successfully!");
                }
                selectedProposal.status = "accepted";
                selectedJob.status = "assigned";
                setPaymentLoading(false);
                closeModal();
            })
            .catch((error) => {
                console.error(error);
                alert(
                    "Failed to accept proposal." + error.response?.data?.message
                );
                setPaymentLoading(false);
            });
    };

    const handleClose = () => {
        setStep("view");
        closeModal();
    };

    return (
        <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="bg-white rounded-xl px-10 py-9 max-w-md w-full shadow-lg">
                    <DialogTitle className="text-xl font-bold mb-2 pb-3">
                        {step === "view"
                            ? `Proposal by ${selectedProposal.freelancerId?.user?.name}`
                            : "Confirm Payment"}
                    </DialogTitle>

                    {step === "view" ? (
                        <>
                            <div className="space-y-2 text-sm text-gray-700 py-2">
                                <p>
                                    <strong>Price:</strong> $
                                    {selectedProposal.price}
                                </p>
                                <p>
                                    <strong>Deadline:</strong>{" "}
                                    {new Date(
                                        selectedProposal.deadline
                                    ).toLocaleDateString()}
                                </p>
                                <p className="py-3">
                                    <strong>Message:</strong>
                                    <br />
                                    <span className="italic">
                                        {selectedProposal.message}
                                    </span>
                                </p>
                            </div>

                            <div className="bg-gray-100 rounded-lg p-4 flex flex-col space-y-3">
                                <div className="flex items-center justify-between space-x-4">
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={
                                                selectedProposal.freelancerId
                                                    ?.user?.profilePicture ||
                                                "/profile/default-profile.png"
                                            }
                                            alt={
                                                selectedProposal.freelancerId
                                                    ?.user?.name || "Freelancer"
                                            }
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-900 text-base">
                                                {
                                                    selectedProposal
                                                        .freelancerId?.user
                                                        ?.name
                                                }
                                            </p>
                                            <div className="flex items-center text-sm text-yellow-500">
                                                <svg
                                                    className="w-4 h-4 fill-current mr-1"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.564-.955L10 0l2.948 5.955 6.564.955-4.756 4.635 1.122 6.545z" />
                                                </svg>
                                                <span className="text-gray-700">
                                                    4.8
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-primary/90 transition">
                                        Message
                                    </button>
                                </div>

                                <p className="text-sm text-gray-600 italic">
                                    {selectedProposal.freelancerId?.user?.bio ||
                                        "No bio provided"}
                                </p>
                            </div>
                            <p className="text-sm text-gray-600 italic my-6">
                                <strong>Note: </strong>
                                The order will start once you have accepted the
                                proposal and paid. The job will be closed for
                                further proposals.
                            </p>
                            <div className="mt-4 flex justify-between">
                                <button
                                    className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                                    onClick={handleClose}
                                >
                                    Close
                                </button>
                                <button
                                    className="px-4 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                                    onClick={handleAcceptClick}
                                >
                                    Accept Proposal
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="text-sm text-gray-700 space-y-2">
                                <p>
                                    <strong>Your Wallet Balance:</strong>{" "}
                                    <span
                                        className={
                                            hasEnoughBalance
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }
                                    >
                                        ${userBalance.toFixed(2)}
                                    </span>
                                </p>
                                <p>
                                    <strong>Proposal Amount:</strong> $
                                    {proposalAmount.toFixed(2)}
                                </p>
                                {!hasEnoughBalance && (
                                    <p className="text-red-600">
                                        ⚠️ Your balance is insufficient to
                                        accept this proposal.
                                    </p>
                                )}
                            </div>
                            <div className="mt-6 flex justify-between">
                                <button
                                    className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                                    onClick={() => setStep("view")}
                                >
                                    Back
                                </button>
                                {hasEnoughBalance ? (
                                    <button
                                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                        onClick={handleConfirmPayment}
                                    >
                                        {paymentLoading ? (
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="w-5 h-5 animate-spin text-white" />
                                                Confirm Payment
                                            </div>
                                        ) : (
                                            "Confirm Payment"
                                        )}
                                    </button>
                                ) : (
                                    <a
                                        href="/deposit-funds"
                                        className="px-4 py-2 text-sm bg-orange-500 text-white rounded hover:bg-orange-600"
                                    >
                                        Recharge Balance
                                    </a>
                                )}
                            </div>
                        </>
                    )}
                </DialogPanel>
            </div>
        </Dialog>
    );
}
