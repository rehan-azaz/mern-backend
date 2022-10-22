class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.stausCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;
