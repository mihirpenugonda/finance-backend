const express = require("express");
const {
  createTransaction,
  editTransaction,
  findTransactions,
  recordPayment,
  getUserFriends,
} = require("../controllers/transactionController");
const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/new").post(isAuthenticated, createTransaction);

router.route("/edit").put(isAuthenticated, editTransaction);

router.route("/find").get(isAuthenticated, findTransactions);

router.route("/pay").put(isAuthenticated, recordPayment);

router.route("/friends").get(isAuthenticated, getUserFriends);

module.exports = router;
