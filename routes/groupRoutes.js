const express = require("express");
const {
  createGroup,
  addUserToGroup,
  findGroups,
  findUserGroups,
} = require("../controllers/groupController");
const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/new").post(isAuthenticated, createGroup);

router.route("/add").put(isAuthenticated, addUserToGroup);

router.route("/find").get(isAuthenticated, findGroups);
router.route("/find/user").get(isAuthenticated, findUserGroups);

module.exports = router;
