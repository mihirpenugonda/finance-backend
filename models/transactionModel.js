const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  initiator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    speed: mongoose.SchemaTypes.Double,
  },
  splits: {
    type: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        amount: {
          type: Number,
        },
        paid: {
          type: Boolean,
          default: false,
        },
      },
    ],
    default: [],
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    default: null,
  },
  category: {
    type: String,
    default: "uncategorized",
  },
  date: {
    type: Number,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

transactionSchema.pre("save", function (next) {
  const splits = this.splits;

  let isCompleted = true;

  splits.forEach((split) => {
    if (split.paid == false) {
      isCompleted = false;
    }
  });

  if (isCompleted) {
    this.completed = true;
    next();
  } else next();
});

module.exports = mongoose.model("Transaction", transactionSchema);
