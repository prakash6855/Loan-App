// routes/repaymentRoutes.js

const express = require("express");
const router = express.Router();
const repaymentController = require("../controllers/repaymentController");

router.post("/", repaymentController.createRepayment);
router.get("/:id", repaymentController.getRepaymentById);

module.exports = router;
