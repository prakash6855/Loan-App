const { DataTypes } = require("sequelize");
const MySQL = require("../config/db");
const Loan = require("./Loan");
const sequelize = MySQL.sequelize;

const Repayment = sequelize.define(
  "Repayment",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    loanId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "Loan",
        key: "id",
      },
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    status: {
      type: DataTypes.ENUM("PENDING", "PAID"),
      defaultValue: "PENDING",
    },
    dateToBeRepaid: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "Repayment",
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

module.exports = Repayment;
