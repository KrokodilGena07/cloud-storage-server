class ApiError extends Error {
    status;
    errors;

    constructor(status, message, errors) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static badRequest(message, errors) {
        return new ApiError(400, message, errors);
    }

    static unauthorized() {
        return new ApiError(401, 'unauthorized error');
    }
}

module.exports = ApiError;