const Proposal = require("../models/ProposalModel");
const { Freelancer, Client, User } = require("../models/UserModel");
const { ApiError } = require("../utils/apiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { Account } = require("../models/AccountModel");
const { asyncHandler } = require("../utils/asyncHandler");
const { Project } = require("../models/ProjectModel");
const { JobPost } = require("../models/JobPostModel");

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

    let filter = {};

    if (req.user.role === "freelancer") {
        // Get proposals submitted by this freelancer
        const freelancer = await Freelancer.findFreelancerByUserId(
            req.user._id
        );
        filter.freelancerId = freelancer._id;
    } else if (req.user.role === "client") {
        // Get proposals for jobs posted by this client
        const client = await Client.findClientByUserId(req.user._id);
        const jobPosts = await JobPost.find({ clientId: client._id }, "_id");
        const jobPostIds = jobPosts.map((job) => job._id);
        filter.jobPostId = { $in: jobPostIds };
    }

    const proposals = await Proposal.find(filter)
        .limit(limit)
        .sort(sortOption)
        .populate("freelancerId", "-password -createdAt -updatedAt")
        .populate({
            path: "jobPostId",
            populate: {
                path: "clientId",
                populate: {
                    path: "user",
                    select: "name email profilePicture", // optional: fields from User
                },
            },
        });

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
const getProposalsByJobId = asyncHandler(async (req, res) => {
    const { jobPostId } = req.params;

    const user = req.user;

    let proposals;
    // Check if user is a freelancer
    const freelancer = await Freelancer.findFreelancerByUserId(user._id);
    if (freelancer) {
        // Return only their proposals for the job
        proposals = await Proposal.findOne({
            jobPostId,
            freelancerId: freelancer._id,
        })
            .populate("freelancerId", "-password -__v -createdAt -updatedAt")
            .populate("jobPostId");
    } else {
        // Assume user is a client and return all proposals
        proposals = await Proposal.find({ jobPostId })
            .populate({
                path: "freelancerId",
                select: "-password -__v -createdAt -updatedAt",
                populate: {
                    path: "user",
                    model: "User",
                    select: "name email profilePicture", // Add other fields as needed
                },
            })
            .populate({
                path: "jobPostId",
            });
    }

    if (!proposals || proposals.length === 0) {
        throw new ApiError(200, "No proposals found for this job");
    }

    res.status(200).json(
        new ApiResponse(200, proposals, "Proposals retrieved successfully")
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
    const existingProposal = await Proposal.findOne({
        freelancerId: freelancer._id,
        jobPostId,
        status: "submitted",
    });
    
    if (existingProposal) {
        throw new ApiError(
            409,
            "You have already submitted a proposal for this job"
        );
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
    const { id } = req.params;
    const userId = req.user._id;

    const proposal = await Proposal.findById(id)
        .populate("jobPostId")
        .populate("freelancerId");
    if (!proposal) throw new ApiError(404, "Proposal not found");

    const client = await Client.findClientByUserId(userId);
    if (!client || !proposal.jobPostId.clientId.equals(client._id)) {
        throw new ApiError(403, "Unauthorized to accept this proposal");
    }

    if (proposal.status === "accepted") {
        throw new ApiError(400, "Proposal already accepted");
    }

    const jobPostId = proposal.jobPostId._id;
    const jobPost = await JobPost.findById(jobPostId);
    if (!jobPost) {
        throw new ApiError(404, "Job post not found");
    }
    if (jobPost.status !== "open") {
        throw new ApiError(400, "Job post is not open for proposals");
    }

    // Getting user's account
    const account = await Account.getAccountByUserId(userId);
    const admin = await User.findOne({ role: "admin" });
    if (!admin) {
        throw new ApiError(500, "Admin account not found");
    }
    const adminAccount = await Account.getAccountByUserId(admin._id);
    if (!adminAccount) {
        throw new ApiError(500, "Admin account not found");
    }
    if (!account) {
        account = await Account.create({ userId: userId, balance: 0 });
    }
    if (account.balance < proposal.price) {
        throw new ApiError(400, "Not enough balance to pay for the proposal");
    }

    // Deducting the amount from the client's account
    account.balance -= proposal.price;
    adminAccount.balance += proposal.price;
    await adminAccount.save();
    await account.save();

    proposal.status = "accepted";
    await proposal.save();

    // Updating the status of the job post and other proposals:
    jobPost.status = "assigned";
    await jobPost.save();
    const otherProposals = await Proposal.find({
        jobPostId: jobPostId,
        _id: { $ne: proposal._id },
    });
    otherProposals.forEach(async (otherProposal) => {
        otherProposal.status = "rejected";
        await otherProposal.save();
    });

    // Creating project as proposal is now accepted
    const project = await Project.create({
        freelancerId: proposal.freelancerId._id,
        clientId: proposal.jobPostId.clientId,
        jobPostId: proposal.jobPostId._id,
        proposalId: proposal._id,
        deadline: proposal.deadline,
        price: proposal.price,
    });

    res.status(201).json(
        new ApiResponse(201, project, "Proposal accepted and project started")
    );
});

const getAppliedJobs = asyncHandler(async (req, res) => {
    const freelancer = await Freelancer.findFreelancerByUserId(req.user._id);
    if (!freelancer) {
        throw new ApiError(403, "You are not authorized as a freelancer");
    }

    const proposals = await Proposal.find({
        freelancerId: freelancer._id,
        status: { $in: ["submitted", "accepted", "rejected"] },
    }).populate({
        path: "jobPostId",
        populate: {
            path: "clientId",
            populate: {
                path: "user",
                select: "name email profilePicture", // optional: fields from User
            },
        },
    });

    const appliedJobs = proposals.map((proposal) => proposal.jobPostId);

    res.status(200).json(
        new ApiResponse(200, appliedJobs, "Applied jobs fetched successfully")
    );
});
// TODO: Proposal withdraw and reject option

module.exports = {
    getProposals,
    getProposalById,
    createProposal,
    updateProposal,
    deleteProposal,
    acceptProposal,
    getProposalsByJobId,
    getAppliedJobs,
};
