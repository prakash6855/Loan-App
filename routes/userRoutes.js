// routes/loanRoutes.js

const express = require("express");
const {
  createUser,
  adminLogin,
  userLogin,
  userLogout,
  adminLogout,
} = require("../controllers/userController");
const router = express.Router();
// const loanController = require("../controllers/loanController");

router.post("/sign_up", createUser);
router.post("/login", userLogin);
router.post("/admin/login", adminLogin);
router.post("/logout", userLogout);
router.post("/admin/logout", adminLogout);


module.exports = router;
