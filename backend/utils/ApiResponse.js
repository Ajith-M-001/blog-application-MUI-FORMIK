class ApiResponse {
  constructor(success, status, message, data = null) {
    this.success = success;
    this.status = status;
    this.message = message;
    this.data = data;
  }

  // Success response factory
  static success(message, data = null, status = 200) {
    return new ApiResponse(true, status, message, data);
  }

  // Error response factory
  static error(message, status = 400, data = null) {
    return new ApiResponse(false, status, message, data);
  }

  // Standard success responses
  static ok(data = null, message = "Success") {
    return this.success(message, data, 200);
  }

  static created(data = null, message = "Resource created successfully") {
    return this.success(message, data, 201);
  }

  // Standard error responses
  static badRequest(message = "Bad request") {
    return this.error(message, 400);
  }

  static unauthorized(message = "Unauthorized access") {
    return this.error(message, 401);
  }

  static forbidden(message = "Forbidden access") {
    return this.error(message, 403);
  }

  static notFound(message = "Resource not found") {
    return this.error(message, 404);
  }

  static internalError(message = "Internal server error") {
    return this.error(message, 500);
  }
}

export { ApiResponse };
