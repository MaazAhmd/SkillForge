const Proposal = require("../models/Proposal");
const Freelancer = require("../models/Freelancer");
const JobPost = require("../models/JobPost");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const getProposals = asyncHandler(async (req, res) => {
    let limit = 50;

    if (req.query?.limit) {
        const parsedLimit = parseInt(req.query.limit, 10);
        if (!isNaN(parsedLimit) && parsedLimit > 0) {
            limit = parsedLimit;
        }
    }

    const sortOption =
        req.query?.sort === "desc"
            ? { createdAt: -1 }
            : req.query?.sort === "asc"
            ? { createdAt: 1 }
            : {};

    const proposals = await Proposal.find()
        .limit(limit)
        .sort(sortOption)
        .populate("freelancerId", "-password -createdAt -updatedAt")
        .populate("jobPostId");

    res.status(200).json(
        new ApiResponse(200, proposals, "Proposals retrieved successfully")
    );
});

const getProposalById = asyncHandler(async (req, res) => {
    const proposal = await Proposal.findById(req.params.id)
        .populate("freelancerId", "-password -__v -createdAt -updatedAt")
        .populate("jobPostId");

    if (!proposal) {
        throw new ApiError(404, "Proposal not found");
    }

    res.status(200).json(
        new ApiResponse(200, proposal, "Proposal retrieved successfully")
    );
});

const createProposal = asyncHandler(async (req, res) => {
    if (!req.body) {
        throw new ApiError(400, "Request body is required");
    }

    const freelancer = await Freelancer.findFreelancerByUserId(req.user._id);
    if (!freelancer) {
        throw new ApiError(403, "You are not authorized to create a proposal");
    }

    const { jobPostId, message, deadline, price } = req.body;

    if (!jobPostId || !message || !deadline || !price) {
        throw new ApiError(400, "Missing required fields");
    }

    const proposal = await Proposal.create({
        freelancerId: freelancer._id,
        jobPostId,
        message,
        deadline,
        price,
    });

    res.status(201).json(
        new ApiResponse(201, proposal, "Proposal created successfully")
    );
});

const updateProposal = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const freelancer = await Freelancer.findFreelancerByUserId(req.user._id);

    const proposal = await Proposal.findById(id);
    if (!proposal) {
        throw new ApiError(404, "Proposal not found");
    }

    if (!proposal.freelancerId.equals(freelancer._id)) {
        throw new ApiError(
            403,
            "You are not authorized to update this proposal"
        );
    }

    const updatedProposal = await Proposal.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json(
        new ApiResponse(200, updatedProposal, "Proposal updated successfully")
    );
});

const deleteProposal = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const freelancer = await Freelancer.findFreelancerByUserId(req.user._id);

    const proposal = await Proposal.findById(id);
    if (!proposal) {
        throw new ApiError(404, "Proposal not found");
    }

    if (!proposal.freelancerId.equals(freelancer._id)) {
        throw new ApiError(
            403,
            "You are not authorized to delete this proposal"
        );
    }

    await proposal.deleteOne();

    res.status(200).json(
        new ApiResponse(200, null, "Proposal deleted successfully")
    );
});

const acceptProposal = asyncHandler(async (req, res) => {
    const { id } = req.params; // proposalId
    const userId = req.user._id;

    const proposal = await Proposal.findById(id)
        .populate("jobPostId")
        .populate("freelancerId");
    if (!proposal) throw new ApiError(404, "Proposal not found");

    const client = await Client.findClientByUserId(userId);
    if (!client || !proposal.jobPostId.clientId.equals(client._id)) {
        throw new ApiError(403, "Unauthorized to accept this proposal");
    }

    // Validate proposal not already accepted
    if (proposal.status === "accepted") {
        throw new ApiError(400, "Proposal already accepted");
    }

    // Simulate client balance
    const clientBalance = 5000; // Example
    if (clientBalance < proposal.price) {
        throw new ApiError(400, "Not enough balance to pay for the proposal");
    }

    // Mark proposal as accepted
    proposal.status = "accepted";
    await proposal.save();

    // Create project
    const project = await Project.create({
        freelancerId: proposal.freelancerId._id,
        jobPostId: proposal.jobPostId._id,
        proposalId: proposal._id,
        deadline: proposal.deadline,
        price: proposal.price,
    });

    res.status(201).json(
        new ApiResponse(201, project, "Proposal accepted, project started")
    );
});

module.exports = {
    getProposals,
    getProposalById,
    createProposal,
    updateProposal,
    deleteProposal,
};
