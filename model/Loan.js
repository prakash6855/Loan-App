const { DataTypes } = require("sequelize");
const MySQL = require("../config/db");
const User = require("./User");
const Repayment = require("./Repayment");
const sequelize = MySQL.sequelize;

const Loan = sequelize.define(
  "Loan",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    term: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    status: {
      type: DataTypes.ENUM("PENDING", "APPROVED", "PAID", "REJECTED"),
      defaultValue: "PENDING",
    },
  },
  {
    tableName: "Loan",
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);
Loan.belongsTo(User);
Loan.hasMany(Repayment);

module.exports = Loan;
