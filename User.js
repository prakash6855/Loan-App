const { DataTypes } = require("sequelize");
const MySQL = require("../config/db");
const sequelize = MySQL.sequelize;

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: DataTypes.NONE,
    },
    salt: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: DataTypes.NONE,
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    sessionToken: {
      type: DataTypes.STRING(200),
      allowNull: true,
      unique: true,
    },
  },
  {
    tableName: "User",
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

module.exports = User;
