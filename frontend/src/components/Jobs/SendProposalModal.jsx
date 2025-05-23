import React, { useState } from "react";
import axios from "../../api/axios";

const SendProposalModal = ({ job, setNotification, onClose }) => {
    // States for inputs:
    const [message, setMessage] = useState("");
    const [deadline, setDeadline] = useState("");
    const [price, setPrice] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const proposalData = {
            message,
            deadline: new Date(deadline),
            price: parseFloat(price),
            jobPostId: job._id,
        };

        axios
            .post("/proposals/create", proposalData)
            .then((res) => {
                if (res.status >= 200 && res.status < 300) {
                    setNotification({ type: "success", message: "Proposal successfully submitted!" });
                    onClose();
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                } else {
                    setNotification({ type: "error", message: "Failed to submit proposal." });
                }
            })
            .catch((err) => {
                setNotification({ type: "error", message: "Failed to submit proposal." });
            });
    };
    return (
        <div className="fixed inset-0 bg-gray-900/40 flex items-center justify-center z-[1000] w-full">
            <div
                className="bg-white text-black rounded-xl p-6 max-w-lg relative max-h-screen overflow-y-auto"
                style={{ width: "90vw" }}
            >
                <button
                    className="absolute font-bold top-5 right-5 text-gray-800 hover:text-gray-600 cursor-pointer"
                    onClick={onClose}
                >
                    ✕
                </button>
                <h2 className="text-xl font-bold mb-4">
                    Submit Proposal for {job.title}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-medium mb-1">
                            Cover Letter
                        </label>
                        <textarea
                            className="w-full bg-gray-200 rounded p-2"
                            rows={15}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">
                            Deadline
                        </label>
                        <input
                            type="date"
                            className="w-full bg-gray-200 rounded p-2"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">
                            Proposed Price
                        </label>
                        <input
                            type="number"
                            className="w-full bg-gray-200 rounded p-2"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold cursor-pointer text-white"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SendProposalModal;
