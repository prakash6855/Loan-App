// routes/loanRoutes.js

const express = require("express");
const {
  createUser,
  adminLogin,
  userLogin,
} = require("../controllers/userController");
const router = express.Router();
// const loanController = require("../controllers/loanController");

router.post("/sign_up", createUser);
router.post("/login", userLogin);
router.post("/admin/login", adminLogin);

module.exports = router;
