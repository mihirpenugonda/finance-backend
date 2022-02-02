module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const statusMessage = err.message || "Internal Server Error";

  console.log(err);

  if (err.name == "ValidationError") {
    res.status(400).json({
      success: false,
      error: "Validation Failed",
    });
  }

  res.status(statusCode).json({
    success: false,
    error: statusMessage,
  });
};
