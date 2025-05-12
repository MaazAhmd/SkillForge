import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
export default function ProposalCard({ proposal, openModal }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const message = proposal.message || "";
  const showReadMore = message.length > 100;
  const [chatId, setChatId] = useState(null);
  const toggleReadMore = () => {
    setIsExpanded((prev) => !prev);
  };
  const handleStartChat = async () => {
    try {
      const res = await axios.get(`/chat/session`, {
        params: { receiverId: proposal.freelancerId.user._id },
      });

      if (res.data.success) {
        const chatId = res.data.chatId;
        navigate(`/chat/${chatId}`);
      }
    } catch (err) {
      console.error("Failed to start chat", err);
      alert("Could not initiate chat");
    }
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
            <span className="font-semibold">Price:</span> ${proposal.price}
          </p>
          <p className="text-sm text-gray-700 mb-2">
            <span className="font-semibold">Deadline:</span>{" "}
            {new Date(proposal.deadline).toLocaleDateString()}
          </p>
          {proposal.status != "submitted" && (
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-semibold">Status:</span>{" "}
              <span className="capitalize">{proposal.status}</span>
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
                className="text-sm px-3 py-1 bg-primary text-white rounded-md hover:bg-primary/90 transition cursor-pointer"
              >
                View Proposal
              </button>
              <button
                onClick={handleStartChat}
                className="text-sm px-3 py-1 bg-primary text-white rounded-md hover:bg-primary/90 transition cursor-pointer"
              >
                Send Message
              </button>
            </>
          ) : (
            <div className="text-sm px-3 py-1 bg-green-800 text-white rounded-md ">
              Proposal Accepted
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
