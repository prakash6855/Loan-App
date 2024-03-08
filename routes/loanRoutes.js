// routes/loanRoutes.js

const express = require("express");
const router = express.Router();
const loanController = require("../controllers/loanController");

router.post("/", loanController.createLoan);
// router.get("/", loanController.approveLoan);
// router.post("/:loan_id", loanController.getLoanById);

module.exports = router;
