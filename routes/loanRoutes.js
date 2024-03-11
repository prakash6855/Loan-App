// routes/loanRoutes.js

const express = require("express");
const router = express.Router({ mergeParams: true });
const loanController = require("../controllers/loanController");

router.get("/", loanController.listLoansByUserId);
router.get("/admin", loanController.listLoansAgainstAdmin);

router.post("/", loanController.createLoan);
router.post("/:loanId", loanController.approveLoan);
router.post("/:loanId/repayment", loanController.repayLoan);

module.exports = router;
