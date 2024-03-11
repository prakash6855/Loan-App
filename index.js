const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const result = dotenv.config();
if (result.error) {
  throw result.error;
}
const loanRoutes = require("./routes/loanRoutes");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");

const app = express();
const { PORT } = process.env;
const MySQL = require("./config/db");

// Middleware
app.use(bodyParser.json());

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    const allowedOrigins = ["http://localhost:5173"];
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

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
