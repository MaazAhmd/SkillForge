const { Proposal } = require("../models/ProposalModel");
const { Project } = require("../models/ProjectModel");
const { User, Freelancer, Client } = require("../models/UserModel");
const { JobPost } = require("../models/JobPostModel");
const { ApiError } = require("../utils/apiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { Account } = require("../models/AccountModel");
const { asyncHandler } = require("../utils/asyncHandler");
const { Delivery } = require("../models/DeliveryModel");

const getProjects = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const role = req.user.role; // 'client' or 'freelancer'

    let query = {};
    if (role === "client") {
        const client = await Client.findClientByUserId(userId);
        query.clientId = { $in: client._id };
    } else if (role === "freelancer") {
        const freelancer = await Freelancer.findFreelancerByUserId(userId);
        query.freelancerId = freelancer._id;
    }

    const projects = await Project.find(query).populate([
        { path: "freelancerId" },
        {
            path: "clientId",
            populate: {
                path: "user",
                select: "-email -password -createdAt",
            },
        },
        { path: "jobPostId" },
        { path: "proposalId" },
        { path: "reviewId" },
    ]);

    res.status(200).json(new ApiResponse(200, projects));
});

const getProjectsById = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id).populate(
        "freelancerId clientId jobPostId proposalId reviewId"
    );
    if (!project) {
        throw new ApiError(404, "Project not found");
    }
    const role = req.user.role;

    if (role === "client") {
        const client = await Client.findClientByUserId(req.user._id);
        if (!project.clientId.equals(client._id)) {
            throw new ApiError(403, "Unauthorized");
        }
    } else if (role === "freelancer") {
        const freelancer = await Freelancer.findFreelancerByUserId(
            req.user._id
        );
        if (!project.freelancerId.equals(freelancer._id)) {
            throw new ApiError(403, "Unauthorized");
        }
    }

    res.status(200).json(new ApiResponse(200, project));
});

const updateDeadline = asyncHandler(async (req, res) => {
    if (!req.body) {
        throw new ApiError(400, "Request body is required");
    }
    const { id } = req.params;
    const { deadline } = req.body;
    if (!deadline) throw new ApiError(400, "New deadline required");

    const project = await Project.findById(id).populate("jobPostId");
    if (!project) throw new ApiError(404, "Project not found");

    const client = await Client.findClientByUserId(req.user._id);
    if (!project.jobPostId.clientId.equals(client._id)) {
        throw new ApiError(403, "Unauthorized");
    }

    project.deadline = deadline;
    await project.save();

    res.status(200).json(new ApiResponse(200, project, "Deadline updated"));
});

// const updatePrice = asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     const { price } = req.body;
//     if (!price) throw new ApiError(400, "New price required");

//     const project = await Project.findById(id).populate("jobPostId");
//     if (!project) throw new ApiError(404, "Project not found");

//     const client = await Client.findClientByUserId(req.user._id);
//     if (!project.jobPostId.clientId.equals(client._id)) {
//         throw new ApiError(403, "Unauthorized");
//     }

//     project.price = price;
//     await project.save();

//     res.status(200).json(new ApiResponse(200, project, "Price updated"));
// });

const deliverProject = asyncHandler(async (req, res) => {
    const freelancer = await Freelancer.findFreelancerByUserId(req.user._id);
    const project = await Project.findById(req.params.id);

    if (!project || !project.freelancerId.equals(freelancer._id)) {
        throw new ApiError(403, "Unauthorized");
    }

    if (
        project.status === "completed-not-reviewed" ||
        project.status === "completed-reviewed" ||
        project.status === "cancelled"
    ) {
        throw new ApiError(409, "Project is already completed or cancelled");
    }

    // TODO: Handle File Uploads
    const message = "message";

    const newDelivery = await Delivery.create({
        message,
        files: [],
        projectId: project._id,
    });

    // Add delivery to project
    project.deliveries.push(newDelivery._id);
    project.status = "delivered";
    await project.save();

    res.status(200).json(
        new ApiResponse(
            200,
            { project, delivery: newDelivery },
            "Delivery submitted and project marked as delivered"
        )
    );
});

const requestRevision = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    const client = await Client.findClientByUserId(req.user._id);

    if (!project || !project.clientId.equals(client._id)) {
        throw new ApiError(403, "Unauthorized");
    }

    if (project.status !== "delivered") {
        throw new ApiError(409, "Project is not delivered yet");
    }
    project.status = "in-revision";
    await project.save();

    res.status(200).json(
        new ApiResponse(
            200,
            project,
            "Revision requested, project marked as in-revision"
        )
    );
});
const cancelProject = asyncHandler(async (req, res) => {
    const client = await Client.findClientByUserId(req.user._id);
    const project = await Project.findById(req.params.id);
    const jobPost = await JobPost.findById(project.jobPostId);
    if (!jobPost) {
        throw new ApiError(404, "Job post not found");
    }
    if (!project || !project.clientId.equals(client._id)) {
        throw new ApiError(403, "Unauthorized");
    }

    if (project.status === "completed-not-reviewed" || project.status === "completed-reviewed") {
        throw new ApiError(409, "Project is already completed and cannot be canceled");
    }

    if (project.status === "cancelled") {
        throw new ApiError(409, "Project is already canceled");
    }
    jobPost.status = "cancelled";
    project.status = "cancelled";
    await project.save();
    await jobPost.save();

    res.status(200).json(
        new ApiResponse(200, project, "Project has been canceled successfully")
    );
});
const markCompleted = asyncHandler(async (req, res) => {
    const client = await Client.findClientByUserId(req.user._id);
    const project = await Project.findById(req.params.id)
        .populate("jobPostId")
        .populate("freelancerId");
    const jobPost = await JobPost.findById(project.jobPostId);
    const freelancer = await Freelancer.findById(
        project.freelancerId._id
    ).populate("user", "-email -password");
    const admin = await User.findOne({ role: "admin" });
    const freelancerAccount = await Account.findOne({
        userId: freelancer.user._id,
    });
    const adminAccount = await Account.findOne({
        userId: admin._id,
    });
    if (!project || !project.clientId.equals(client._id)) {
        throw new ApiError(403, "Unauthorized");
    }

    if (project.status !== "delivered") {
        throw new ApiError(
            409,
            "Project is not delivered yet or is already completed"
        );
    }
    jobPost.status = "completed";
    project.status = "completed-not-reviewed";
    project.completionDate = new Date();
    await project.save();
    await jobPost.save();
    adminAccount.balance -= project.price * 0.1;
    freelancerAccount.balance += project.price * 0.9;
    await adminAccount.save();
    await freelancerAccount.save();
    // TODO: Handle payment logic

    res.status(200).json(
        new ApiResponse(200, project, "Project marked completed")
    );
});

module.exports = {
    getProjects,
    getProjectsById,
    updateDeadline,
    // updatePrice,
    deliverProject,
    requestRevision,
    markCompleted,
    cancelProject,
};
