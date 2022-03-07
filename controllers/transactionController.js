const Transaction = require("../models/transactionModel");
const catchAsyncErrors = require("../middleware/asyncErrorMiddleware");
const ErrorHandler = require("../utils/errorHandler");

exports.createTransaction = catchAsyncErrors(async (req, res, next) => {
  const { title, description, isSplit, amount, category, date, group } =
    req.body;

  const { splits } = req.body;

  const transaction = await Transaction.create({
    title,
    description,
    initiator: req.requestor_id,
    amount,
    isSplit,
    splits,
    category,
    date,
  });

  return res.status(200).json({
    success: true,
    transaction: transaction,
  });

  // return next(
  //   new ErrorHandler("Split Amount is not Equal to Total Amount", 400)
  // );
});

exports.editTransaction = catchAsyncErrors(async (req, res, next) => {
  const { title, description, initiator, isSplit, amount, category, date, id } =
    req.body;

  if (!isSplit) {
    const transaction = await Transaction.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          title,
          description,
          initiator,
          amount,
          category,
          date,
        },
      }
    );

    return res.status(200).json({
      success: true,
    });
  } else {
    const { splits } = req.body;

    const isCorrect = checkTotals(splits, amount);

    if (isCorrect) {
      const transaction = await Transaction.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $set: {
            title,
            description,
            initiator,
            amount,
            isSplit,
            splits,
            category,
            date,
          },
        }
      );

      return res.status(200).json({
        success: true,
      });
    }

    return next(
      new ErrorHandler("Split Amount is not Equal to Total Amount", 400)
    );
  }
});

exports.findTransactions = catchAsyncErrors(async (req, res, next) => {
  if (req.query.group_id == undefined || req.query.friend_id == undefined) {
    return next(new ErrorHandler("invalid api call", 401));
  } else if (req.query.group_id == 0 && req.query.friend_id != 0) {
    // get user-user transactions
    getUserFriendTransactions(req, res, next);
  } else if (req.query.group_id != 0 && req.query.friend_id == 0) {
    // get particular group transactions
    getGroupTransactions(req, res, next);
  } else if (req.query.group_id == 0 && req.query.friend_id == 0) {
    // get user transactions
    getUserTransactions(req, res, next);
  }
});

exports.recordPayment = catchAsyncErrors(async (req, res, next) => {
  const transaction = await Transaction.findById(req.query.transaction_id);

  transaction.splits.forEach((split) => {
    if (split.user == req.requestor_id) {
      split.paid = true;
    }
  });

  await transaction.save();

  res.status(200).json({
    success: true,
  });
});

exports.getUserFriends = catchAsyncErrors(async (req, res, next) => {
  const transactions = await Transaction.find(
    {
      "splits.user": req.requestor_id,
    },
    "splits"
  );

  let friends = [];

  transactions.forEach((transaction) => {
    transaction.splits.forEach((split) => {
      if (req.requestor_id != split.user) {
        friends.push(split.user.toString());
      }
    });
  });

  friends = [...new Set(friends)];

  res.status(200).json({
    success: true,
    friends: friends,
  });
});

getUserTransactions = async (req, res, next) => {
  const transactions = await Transaction.find({
    "splits.user": req.requestor_id,
    completed: false,
  })
    .populate("splits.user", "username")
    .sort("date");

  if (transactions.length == 0)
    return res.status(200).json({
      success: true,
      transactions: [],
    });

  res.status(200).json({
    success: true,
    transactions: transactions,
  });
};

getGroupTransactions = async (req, res, next) => {
  const transactions = await Transaction.find({
    group: req.query.group_id,
    completed: false,
  })
    .populate("splits.user", "username")
    .sort("date");

  if (transactions.length == 0)
    return res.status(200).json({
      success: true,
      message: "group does not have any transactions",
    });

  res.status(200).json({
    success: true,
    transactions: transactions,
  });
};

getUserFriendTransactions = async (req, res, next) => {
  let first = await Transaction.find({
    initiator: req.requestor_id,
    "splits.user": req.query.friend_id,
    completed: false,
  }).populate("splits.user", "username");
  let second = await Transaction.find({
    initiator: req.query.friend_id,
    "splits.user": req.requestor_id,
    completed: false,
  }).populate("splits.user", "username");

  const transactions = [...first, ...second];

  if (transactions.length == 0)
    return res.status(200).json({
      success: true,
      transactions: [],
    });

  res.status(200).json({
    success: true,
    transactions: transactions,
  });
};

checkTotals = (splits, amount) => {
  let totalAmount = 0;

  splits.forEach((split) => {
    totalAmount += split.amount;
  });

  // if (totalAmount > amount - 1 && totalAmount < amount + 1) {
  //   console.log("HERE");
  //   return true;
  // }

  return true;
};
