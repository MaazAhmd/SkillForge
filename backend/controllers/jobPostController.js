const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/apiError");
const { ApiResponse } = require("../utils/ApiResponse");
require("dotenv").config();
const { JobPost } = require("../models/JobPostModel");
const { Client } = require("../models/UserModel");

const getJobPosts = asyncHandler(async (req, res) => {
    let limit = 50; // Default limit

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

    const jobPosts = await JobPost.find()
        .limit(limit)
        .sort(sortOption)
        .populate("client", "-password -createdAt -updatedAt");

    res.status(200).json(
        new ApiResponse(200, jobPosts, "Jobs retrieved successfully")
    );
});

const getJobPostById = asyncHandler(async (req, res) => {
    const jobPostId = req.params.id;

    const jobPost = await JobPost.findById(jobPostId)?.populate("client");
    if (!jobPost) {
        throw new ApiError(404, "Job post not found with this ID");
    }

    res.status(200).json(
        new ApiResponse(200, jobPost, "Job retrieved successfully")
    );
});

const createJobPost = asyncHandler(async (req, res) => {
    if (!req.body) {
        throw new ApiError(400, "Request body is required");
    }
    // We have the logged in user by the Token, so we dont need ClientID in body:
    const client = await Client.findClientByUserId(req.user._id);

    const { title, description, budget, deadline, status, category, payment } =
        req.body;

    if (!title) {
        throw new ApiError(400, "Title is required");
    }

    const jobPost = await JobPost.create({
        title,
        description,
        budget,
        deadline,
        status,
        clientId: client._id,
        category: category?.toLowerCase(),
        payment,
    });

    res.status(201).json(
        new ApiResponse(201, jobPost, "Job post created successfully")
    );
});

const updateJobPost = asyncHandler(async (req, res) => {
    if (!req.body) {
        throw new ApiError(400, "Request body is required");
    }

    const { id } = req.params;

    const jobPost = await JobPost.findById(id);
    if (!jobPost) {
        throw new ApiError(404, "Job post not found");
    }

    const clientId = await Client.findClientByUserId(req.user._id);

    if (!jobPost.clientId.equals(clientId)) {
        throw new ApiError(
            403,
            "You are not authorized to update this job post"
        );
    }

    // If authorized, proceed to update
    const updatedJobPost = await JobPost.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json(
        new ApiResponse(200, updatedJobPost, "Job post updated successfully")
    );
});

const deleteJobPost = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const clientId = await Client.findClientByUserId(req.user._id);
    if (!clientId) {
        throw new ApiError(403, "Client not found. Not authorized");
    }

    const jobPost = await JobPost.findById(id);
    if (!jobPost) {
        throw new ApiError(404, "Job post not found");
    }

    // Checking if the logged-in user owns this job post
    if (!jobPost.clientId.equals(clientId)) {
        throw new ApiError(
            403,
            "You are not authorized to delete this job post"
        );
    }

    await jobPost.deleteOne();

    res.status(200).json(
        new ApiResponse(200, null, "Job post deleted successfully")
    );
});

module.exports = {
    getJobPosts,
    getJobPostById,
    createJobPost,
    updateJobPost,
    deleteJobPost,
};
