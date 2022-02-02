const express = require("express");
const {
  registerUser,
  getUser,
  loginUser,
  editUser,
  updatePassword,
  updateUserRole,
  deleteUser,
  findUsers,
} = require("../controllers/userController");
const {
  authorizeRoles,
  isAuthenticated,
} = require("../middleware/authMiddleware");

const router = express.Router();

// GET - get all users along with search, filter and pagination functionality and get particular user
router.route("/find").get(isAuthenticated, findUsers);

// POST - register a new user
router.route("/register").post(registerUser);

// GET - login user
router.route("/login").get(loginUser);

// GET - get user details
// PUT - edit user details
router
  .route("/me")
  .get(isAuthenticated, getUser)
  .put(isAuthenticated, editUser);

// PUT - update user details
router.route("/me/password/update").put(isAuthenticated, updatePassword);

// PUT - update user role
// DELETE - delete user
router
  .route("/admin/:id")
  .put(isAuthenticated, authorizeRoles("admin"), updateUserRole)
  .delete(isAuthenticated, authorizeRoles("admin"), deleteUser);

module.exports = router;
