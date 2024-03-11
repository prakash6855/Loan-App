// controllers/repaymentController.js

const Repayment = require("../models/Repayment");

const createRepayment = async (req, res) => {
  try {
    const { amount, dueDate } = req.body;
    const repayment = await Repayment.create({ amount, dueDate });
    res.status(201).json(repayment);
  } catch (error) {
    console.error("Error creating repayment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getRepaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const repayment = await Repayment.findByPk(id);
    if (!repayment) {
      return res.status(404).json({ message: "Repayment not found" });
    }
    res.status(200).json(repayment);
  } catch (error) {
    console.error("Error getting repayment by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = { createRepayment, getRepaymentById };
