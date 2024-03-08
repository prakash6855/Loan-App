// index.js

const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const result = dotenv.config();
if (result.error) {
  throw result.error;
}
const loanRoutes = require("./routes/loanRoutes");
// const repaymentRoutes = require("./routes/repaymentRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const { PORT } = process.env;
const MySQL = require("./config/db");
// const Loan = require("./model/Loan");
// const Repayment = require("./model/Repayment");

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/user/:user_id/loan", loanRoutes);
// app.use("/repayments", repaymentRoutes);
app.use("/user", userRoutes);

// Start server
MySQL.sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`App running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.log("error", err));
