import ErrorHandler from "../utils/errorHandler.js";

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Wrong Mongodb Id Error
  if (err.name === "CastError") {
    err.message = `Resourse not found. Invalid: ${err.path}`;
    err.statusCode = 400;
    // err = new ErrorHandler(message, statusCode);
  }

  // Duplicate Key Error
  if (err.code === 11000) {
    err.message = `Email Already Exists`;
    err.statusCode = 400;
  }

  // Wrong JWT Error
  if (err.name === "JsonWebTokenError") {
    err.message = `JWT is Invalid. Try again`;
    err.statusCode = 400;
    // err = new ErrorHandler(message, statusCode);
  }
  
  // Token Expire Error
  if (err.name === "TokenExpiredError") {
    err.message = `JWT is Expired. Try again`;
    err.statusCode = 400;
    // err = new ErrorHandler(message, statusCode);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
