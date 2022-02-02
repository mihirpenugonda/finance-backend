exports.sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  res.status(200).json({
    success: true,
    token: token,
    id: user._id,
  });
};
