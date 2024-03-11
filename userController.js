const bcrypt = require("bcrypt");
const User = require("../model/User");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  try {
    // Parse the request
    const { name, username, password } = req.body;
    if (!name || !username || !password) {
      return res.status(400).json({
        message: "Invalid name/username/password",
      });
    }

    // Generate a salt
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user with the hashed password
    const user = await User.create({
      name,
      username,
      password: hashedPassword,
      salt,
    });
    if (!user) {
      res.status(500).json({ message: "Internal server error" });
    }
    res.status(201).json({
      message: "User Created Successfully",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        message: "Invalid username/password",
      });
    }

    // Find the user by username
    const user = await User.findOne({ where: { username, is_admin: false } });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const userDetails = user.toJSON();
    const userID = userDetails.id;
    // Verify the password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set token in user session
    user.sessionToken = token;
    await user.save();

    res.status(200).json({
      message: "Login successful",
      token,
      userID,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        message: "Invalid username/password",
      });
    }

    // Find the user by username
    const user = await User.findOne({ where: { username, is_admin: true } });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const userDetails = user.toJSON();
    const userID = userDetails.id;

    // Verify the password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set token in user session
    user.sessionToken = token;
    await user.save();

    res.status(200).json({
      message: "Login successful",
      token,
      userID,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createUser, userLogin, adminLogin };
