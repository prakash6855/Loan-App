const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Repayment = db.define(
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
