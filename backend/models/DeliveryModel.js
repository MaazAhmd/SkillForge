const mongoose = require("mongoose");

const DeliverySchema = new mongoose.Schema(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        message: { type: String, required: true },
        files: [{ type: String }], // Array of file URLs
    },
    { timestamps: true }
);
const Delivery = mongoose.model("Delivery", DeliverySchema);

module.exports = { Delivery };
