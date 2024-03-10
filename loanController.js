const { Op, Sequelize } = require("sequelize");
const Loan = require("../model/Loan");
const User = require("../model/User");
const { sequelize } = require("../config/db");
const Repayment = require("../model/Repayment");

const createLoan = async (req, res) => {
  try {
    const { amount, term } = req.body;
    const { userId } = req.params;
    const { sessiontoken } = req.headers;

    // Check if the user exists
    const user = await User.findOne({
      where: { id: userId, is_admin: false, sessionToken: sessiontoken },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has an existing loan with a non-paid status
    const existingLoan = await Loan.findOne({
      where: { userId, status: { [Op.ne]: "PAID" } },
    });
    if (existingLoan) {
      return res.status(400).json({
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

const approveLoan = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { userId, loanId } = req.params;
    const { sessiontoken } = req.headers;
    const { status } = req.query;

    // Check if the admin exists
    const admin = await User.findOne(
      {
        where: { is_admin: true, sessionToken: sessiontoken },
      },
      { transaction: t }
    );

    if (!admin) {
      await t.rollback();
      return res.status(404).json({ message: "Admin not found" });
    }

    const loan = await Loan.findOne(
      {
        where: { id: loanId, status: "PENDING", userId: userId },
      },
      { transaction: t }
    );

    if (!loan) {
      await t.rollback();
      return res
        .status(404)
        .json({ message: "Loan not found/ not eligible to be approved" });
    }

    if (!status || status != "APPROVE") {
      // Update the loan status to "REJECTED"
      await loan.update({ status: "REJECTED" }, { transaction: t });
      await t.commit();
      res.status(200).json({ message: "Loan rejected successfully" });
    }

    // Calculate weekly repayment amount
    const weeklyRepaymentAmount = loan.totalAmount / loan.term;

    // Generate and create three repayments with weekly intervals
    const today = new Date();

    for (let i = 1; i <= loan.term; i++) {
      const dateToBeRepaid = new Date(
        today.getTime() + i * 7 * 24 * 60 * 60 * 1000
      ); // Add i weeks

      await Repayment.create(
        {
          loanId: loan.id,
          amount: weeklyRepaymentAmount,
          dateToBeRepaid,
        },
        { transaction: t }
      );
    }

    // Update the loan status to "APPROVED"
    await loan.update({ status: "APPROVED" }, { transaction: t });

    await t.commit();
    res.status(200).json({ message: "Loan approved successfully" });
  } catch (error) {
    console.error("Error approving loan:", error);
    await t.rollback();
    res.status(500).json({ message: "Internal server error" });
  }
};

const repayLoan = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    // Calculate the total repayment amount
    let totalAmount = Number(req.body.amount);
    if (totalAmount <= 0) {
      await t.rollback();
      return res
        .status(404)
        .json({ message: "amount should be greater than 0" });
    }

    const { userId, loanId } = req.params;
    const { sessiontoken } = req.headers;
    // Check if the user exists
    const user = await User.findOne({
      where: { id: userId, is_admin: false, sessionToken: sessiontoken },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const loan = await Loan.findOne(
      {
        where: { id: loanId, status: "APPROVED", userId: userId },
      },
      { transaction: t }
    );

    if (!loan) {
      await t.rollback();
      return res
        .status(404)
        .json({ message: "Loan not found/ not eligible to be repaid" });
    }
    // Find all repayments for the loan
    const repayments = await Repayment.findAll({
      where: { loanId: loanId, status: "PENDING" },
      order: [["dateToBeRepaid", "ASC"]],
      transaction: t,
    });

    if (!repayments.length) {
      await t.rollback();
      return res
        .status(404)
        .json({ message: "No repayments found for this loan" });
    }
    let paidAtleastOnce = false;
    let paidAll = true;
    // Settle repayments
    for (const repayment of repayments) {
      const repaymentJSON = repayment.toJSON();
      if (repaymentJSON.amount <= totalAmount) {
        paidAtleastOnce = true;
        repayment.status = "PAID";
        totalAmount -= repaymentJSON.amount;
        await repayment.save();
      } else {
        paidAll = false;
      }
    }
    if (paidAll) {
      loan.status = "PAID";
      await loan.save();
    }
    await t.commit();
    if (paidAtleastOnce) {
      res.status(200).json({ message: "Loan repayment successful" });
    } else {
      res
        .status(200)
        .json({ message: "Loan repayment amount is less than required" });
    }
  } catch (error) {
    console.error("Error approving loan:", error);
    await t.rollback();
    res.status(500).json({ message: "Internal server error" });
  }
};

const listLoansByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { sessiontoken } = req.headers;

    // Check if the user exists
    const user = await User.findOne({
      where: { id: userId, sessionToken: sessiontoken, is_admin: false },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find all loans for the user along with their repayment details
    const loans = await Loan.findAll({
      where: { userId },
      include: [
        {
          model: Repayment,
          attributes: ["id", "amount", "status", "dateToBeRepaid"],
        },
      ],
    });

    res.status(200).json(loans);
  } catch (error) {
    console.error("Error fetching loans:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const listLoansAgainstAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const { sessiontoken } = req.headers;

    // Check if the admin exists
    const admin = await User.findOne({
      where: { id: userId, is_admin: true, sessionToken: sessiontoken },
    });

    if (!admin) {
      await t.rollback();
      return res.status(404).json({ message: "Admin not found" });
    }

    // Find all loans for everyone
    const loans = await Loan.findAll();
    res.status(200).json(loans);
  } catch (error) {
    console.error("Error fetching loans:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createLoan,
  approveLoan,
  repayLoan,
  listLoansByUserId,
  listLoansAgainstAdmin,
};
