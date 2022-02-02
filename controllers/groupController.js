const Group = require("../models/groupModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/asyncErrorMiddleware");

exports.createGroup = catchAsyncErrors(async (req, res, next) => {
  const { name } = req.body;
  let initiator = req.requestor_id;

  console.log(initiator);

  const group = await Group.create({
    name,
    creator: initiator,
    users: initiator,
  });

  res.status(200).json({
    success: true,
    group: group,
  });
});

exports.addUserToGroup = catchAsyncErrors(async (req, res, next) => {
  await Group.findByIdAndUpdate(req.body.group_id, {
    $push: {
      users: req.body.user_id,
    },
  });

  res.status(200).json({
    success: true,
  });
});

exports.findGroups = catchAsyncErrors(async (req, res, next) => {
  if (req.query.group_id == 0) {
    getAllGroups(req, res, next);
  } else {
    getGroup(req, res, next);
  }
});

exports.findUserGroups = catchAsyncErrors(async (req, res, next) => {
  const groups = await Group.find({
    users: req.requestor_id,
  });

  if (groups.length == 0) {
    return res.status(200).json({
      success: true,
      message: "user does not have any groups",
    });
  }

  res.status(200).json({
    success: true,
    groups: groups,
  });
});

getAllGroups = async (req, res, next) => {
  const groups = await Group.find();

  res.status(200).jsom({
    success: true,
    groups: groups,
  });
};

getGroup = async (req, res, next) => {
  const group = await Group.findById(req.query.group_id);

  res.status(200).json({
    success: true,
    group: group,
  });
};
