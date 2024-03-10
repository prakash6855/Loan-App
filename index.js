// index.js

const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const result = dotenv.config();
if (result.error) {
  throw result.error;
}
const loanRoutes = require("./routes/loanRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const { PORT } = process.env;
const MySQL = require("./config/db");

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/user/:userId/loan", loanRoutes);
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
