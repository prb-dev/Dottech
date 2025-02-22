export const errorMiddleware = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      details: err.details,
      type: err.name,
    });
  }

  const statusCode = err.status || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({ success: false, statusCode, message });
};
