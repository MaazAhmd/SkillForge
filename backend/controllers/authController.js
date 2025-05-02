const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/apiError");
require("dotenv").config();
const { User, Freelancer, Client } = require("../models/UserModel");
const { ApiResponse } = require("../utils/ApiResponse");

const signup = asyncHandler(async (req, res) => {
    if (!req.body) {
        throw new ApiError(400, "Request body is required");
    }

    const { name, email, password, role } = req.body;

    if (
        [name, email, password, role].some(
            (field) => field === undefined || field.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    if (password.length < 8) {
        throw new ApiError(400, "Password must be at least 8 characters long");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, "User already exists with this email");
    }

    const newUser = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role,
    });

    if (role === "freelancer") {
        const freelancer = new Freelancer({ user: newUser._id });
        await freelancer.save();
    } else if (role === "client") {
        const client = new Client({ user: newUser._id });
        await client.save();
    }

    const createdUser = await User.findById(newUser._id).select(
        "-password -createdAt -updatedAt"
    );

    const token = createdUser.generateAccessToken();

    res.status(201).json(
        new ApiResponse(
            201,
            { createdUser, token },
            "User created successfully"
        )
    );
});

const login = asyncHandler(async (req, res) => {
    if (!req.body) {
        throw new ApiError(400, "Request body is required");
    }
    console.log(req.body);
    const { email, password } = req.body;

    if (
        [email, password].some(
            (field) => field === undefined || field.trim() === ""
        )
    ) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(401, "Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ApiError(401, "Invalid credentials");
    }

    const token = user.generateAccessToken();
    user.password = undefined; // Remove password from the user object

    res.status(200).json(
        new ApiResponse(200, { user, token }, "Login successful")
    );
});

module.exports = { signup, login };
