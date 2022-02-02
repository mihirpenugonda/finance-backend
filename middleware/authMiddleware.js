const ErrorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");
const catchAsyncErrors = require("./asyncErrorMiddleware");

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  if (process.env.STATUS == "TEST") {
    req.requestor_id = req.body.id;
    return next();
  }

  const token = req.body.token;

  if (!token) {
    return next(new ErrorHandler("please login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_TOKEN_KEY);
  req.requestor_id = decodedData.id;
  next();
});

exports.authorizeRoles = (...roles) => {
  return catchAsyncErrors((req, res, next) => {
    if (!roles.include(req.user.role)) {
      return next(
        new ErrorHandler(
          `role: ${req.user.role} is not allowed to access resource request required permission from admin`,
          403
        )
      );
    }
    next();
  });
};
