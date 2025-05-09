const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/apiError");
const { ApiResponse } = require("../utils/ApiResponse");
require("dotenv").config();
const { JobPost } = require("../models/JobPostModel");
const { Client } = require("../models/UserModel");

const dayjs = require("dayjs");
const duration = require("dayjs/plugin/duration");
const relativeTime = require("dayjs/plugin/relativeTime");
const { Category } = require("../models/CategoryModel");

dayjs.extend(duration);
dayjs.extend(relativeTime);

function formatDurationFromNow(deadline) {
    const now = dayjs();
    const end = dayjs(deadline);
    const diff = end.diff(now);

    if (diff <= 0) return "Deadline passed";

    const d = dayjs.duration(diff);

    const parts = [];
    if (d.years()) parts.push(`${d.years()} year${d.years() > 1 ? "s" : ""}`);
    if (d.months()) parts.push(`${d.months()} month${d.months() > 1 ? "s" : ""}`);
    if (d.days()) parts.push(`${d.days()} day${d.days() > 1 ? "s" : ""}`);
    if (d.hours()) parts.push(`${d.hours()} hour${d.hours() > 1 ? "s" : ""}`);
    if (d.minutes()) parts.push(`${d.minutes()} minute${d.minutes() > 1 ? "s" : ""}`);

    return parts.slice(0, 3).join(" "); 
}


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
        .populate({
            path: "clientId",
            populate: { path: "user", model: "User", select: "name profilePicture" },
        });
    
    const jobPostsWithDuration = jobPosts.map(job => ({
        ...job.toObject(),
        deadline: job.deadline?.toISOString().split("T")[0], // ← formatted date only
        author: {
            name: job.clientId.user.name,
            avatar: job.clientId.user.profilePicture,
        }
    }));
    res.status(200).json(
        new ApiResponse(200, jobPostsWithDuration, "Jobs retrieved successfully")
    );
    
});

const getJobPostById = asyncHandler(async (req, res) => {
    const jobPostId = req.params.id;

    const jobPost = await JobPost.findById(jobPostId)?.populate(
        "clientId",
        "-password -createdAt -updatedAt"
    );
    if (!jobPost) {
        throw new ApiError(404, "Job post not found with this ID");
    }

    res.status(200).json(
        new ApiResponse(200, jobPost, "Job retrieved successfully")
    );
});

const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find().sort("name");
    res.status(200).json(categories);
});



const createJobPost = asyncHandler(async (req, res) => {
    const client = await Client.findClientByUserId(req.user._id);
    if (!client) throw new ApiError(404, "Client not found");

    const { title, description, budget, deadline, category, skills = [] } = req.body;

    if (!title || !budget || !deadline || !category) {
        throw new ApiError(400, "Missing required fields");
    }

    const existingCategory = await Category.findOne({ name: category });
    if (!existingCategory) {
        throw new ApiError(400, "Invalid category. Choose from available options.");
    }

    const jobPost = await JobPost.create({
        title,
        description,
        budget,
        deadline,
        clientId: client._id,
        category: existingCategory.name,
        skills: skills.map(s => s.toLowerCase()),
    });

    res.status(201).json(new ApiResponse(201, jobPost, "Job post created successfully"));
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

    const client = await Client.findClientByUserId(req.user._id);

    if (!jobPost.clientId.equals(client._id)) {
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
    if (!jobPost.clientId.equals(clientId._id)) {
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
    getAllCategories
};
