class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.status = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode >= 200 && statusCode < 400;
    }
}

module.exports = { ApiResponse };
