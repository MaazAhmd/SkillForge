const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.log(err);
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        errors: err.errors || [],
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
};

module.exports = errorHandler;
