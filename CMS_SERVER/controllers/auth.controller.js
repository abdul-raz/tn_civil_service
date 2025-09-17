const { body, validationResult } = require("express-validator");
const db = require("../models");
const User = db.User;

//Reset Password
exports.resetPassword = [
  body("email").isEmail().withMessage("Valid email required").normalizeEmail(),
  body("oldPassword").notEmpty().withMessage("Old password required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, oldPassword, newPassword } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const isValid = await user.validPassword(oldPassword);
      if (!isValid) {
        return res.status(401).json({ message: "Old password is incorrect" });
      }

      // update password (hook will hash it)
      user.password = newPassword;
      await user.save();

      res.json({ message: "Password reset successful" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
];

// Create Admin User (Registration)
exports.createAdmin = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),

  async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.warn("Validation errors:", errors.array());
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    try {
      const { email, password } = req.body;

      console.log(`Creating admin with email: ${email}`);

      // Check if email already exists
      const existingAdmin = await User.findOne({ where: { email } });
      if (existingAdmin) {
        console.warn(`Email ${email} already exists`);
        return res.status(400).send({
          message: "Email already exists. Please use a different email.",
        });
      }

      // Create new admin
      const newAdmin = await User.create({
        email,
        password,
        role: "admin",
      });

      console.log(`Admin created successfully with ID: ${newAdmin.id}`);

      res.status(201).send({
        message: "Admin created successfully.",
        admin: {
          id: newAdmin.id,
          email: newAdmin.email,
          role: newAdmin.role,
        },
      });
    } catch (error) {
      console.error("Error during admin creation:", error);
      res.status(500).send({ message: "Server error during admin creation." });
    }
  },
];

// Login Admin
exports.login = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required."),

  async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.warn("Login validation errors:", errors.array());
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    try {
      const { email, password } = req.body;

      console.log(`Admin login attempt for email: ${email}`);

      // Find admin by email
      const admin = await User.findOne({ where: { email, role: "admin" } });
      if (!admin) {
        console.warn(`Login failed: Admin with email ${email} not found`);
        return res.status(401).send({
          message: "Invalid email or password.",
        });
      }

      // Verify password
      const isPasswordValid = await admin.validPassword(password);
      if (!isPasswordValid) {
        console.warn(`Login failed: Invalid password for email ${email}`);
        return res.status(401).send({
          message: "Invalid email or password.",
        });
      }

      // Create session
      req.session.admin = {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      };

      console.log(`Admin login successful for: ${email}`);

      res.status(200).send({
        message: "Admin login successful.",
        admin: req.session.admin,
      });
    } catch (error) {
      console.error("Error during admin login:", error);
      res.status(500).send({ message: "Server error during login." });
    }
  },
];

// Logout Admin
exports.logout = (req, res) => {
  console.log("Admin logout request received");

  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send({ message: "Server error during logout." });
    }

    res.clearCookie("connect.sid"); // clear session cookie
    console.log("Admin logged out successfully");
    res.status(200).send({ message: "Admin logged out successfully." });
  });
};

// Get current admin (check session)
exports.getCurrentAdmin = (req, res) => {
  if (req.session && req.session.admin) {
    res.status(200).send({
      message: "Admin session active",
      admin: req.session.admin,
    });
  } else {
    res.status(401).send({ message: "No active admin session." });
  }
};

// Middleware to check admin authentication
exports.isAdmin = (req, res, next) => {
  console.log("Checking admin authentication...");

  if (req.session && req.session.admin && req.session.admin.role === "admin") {
    console.log(`Admin authenticated: ${req.session.admin.email}`);
    next();
  } else {
    console.warn("Unauthorized access attempt - admin authentication required");
    res.status(401).send({ message: "Unauthorized: Admin login required." });
  }
};
