class ServiceError extends Error {
  constructor(httpStatus, message) {
    super();
    this.name = 'Error';
    this.httpStatus = httpStatus;
    this.message = message;
  }
}

module.exports = ServiceError;
