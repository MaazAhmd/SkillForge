const getProjects = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const role = req.user.role; // 'client' or 'freelancer'

    let query = {};
    if (role === "client") {
        const client = await Client.findClientByUserId(userId);
        query.jobPostId = { $in: client.jobPosts };
    } else if (role === "freelancer") {
        const freelancer = await Freelancer.findFreelancerByUserId(userId);
        query.freelancerId = freelancer._id;
    }

    const projects = await Project.find(query)
        .populate("freelancerId jobPostId proposalId reviewId");
    res.status(200).json(new ApiResponse(200, projects));
});


const updateDeadline = asyncHandler(async (req, res) => {
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

const updatePrice = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { price } = req.body;
    if (!price) throw new ApiError(400, "New price required");

    const project = await Project.findById(id).populate("jobPostId");
    if (!project) throw new ApiError(404, "Project not found");

    const client = await Client.findClientByUserId(req.user._id);
    if (!project.jobPostId.clientId.equals(client._id)) {
        throw new ApiError(403, "Unauthorized");
    }

    project.price = price;
    await project.save();

    res.status(200).json(new ApiResponse(200, project, "Price updated"));
});

const markDelivered = asyncHandler(async (req, res) => {
    const freelancer = await Freelancer.findFreelancerByUserId(req.user._id);
    const project = await Project.findById(req.params.id);

    if (!project || !project.freelancerId.equals(freelancer._id)) {
        throw new ApiError(403, "Unauthorized");
    }

    project.status = "delivered";
    await project.save();

    res.status(200).json(new ApiResponse(200, project, "Project marked delivered"));
});

const markCompleted = asyncHandler(async (req, res) => {
    const client = await Client.findClientByUserId(req.user._id);
    const project = await Project.findById(req.params.id).populate("jobPostId");

    if (!project || !project.jobPostId.clientId.equals(client._id)) {
        throw new ApiError(403, "Unauthorized");
    }

    project.status = "completed-not-reviewed";
    project.completionDate = new Date();
    await project.save();

    res.status(200).json(new ApiResponse(200, project, "Project marked completed"));
});
