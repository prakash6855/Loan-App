const Loan = require("../model/Loan");
const User = require("../model/User");

const createLoan = async (req, res) => {
  try {
    const { amount, term } = req.body;
    const { userId } = req.params;

    // Check if the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has an existing loan with a non-paid status
    const existingLoan = await Loan.findOne({
      where: { userId, status: { [Op.ne]: "PAID" } },
    });
    if (existingLoan) {
      return res
        .status(400)
        .json({
          message: "User already has an existing loan with a non-paid status",
        });
    }

    // Validate loan term
    if (term < 1) {
      return res.status(400).json({ message: "Invalid loan term" });
    }

    // Create the loan
    const loan = await Loan.create({ userId, totalAmount: amount, term });
    res.status(201).json(loan);
  } catch (error) {
    console.error("Error creating loan:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createLoan };
