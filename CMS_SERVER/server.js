require("dotenv").config(); // Load .env variables at the very top

const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");

const db = require("./models"); // Sequelize models index
const routes = require("./routes"); // API routes aggregated

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Allow frontend origin
    credentials: true, // Allow cookies to be sent
  })
);
// app.use(cors());

app.use(express.json()); // Parse JSON request body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Session configuration - MUST be before routes
app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      "aicscc-super-secret-key-2025-change-this-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // true only in production with HTTPS
      httpOnly: true, // prevent XSS attacks
      maxAge: 1000 * 60 * 60 * 24, // 1 day session expiry
    },
    name: "aicscc.sid", // custom session name
  })
);

// Static folder to serve uploaded files (pdfs etc.)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes - all prefixed with /api
app.use("/api", routes);

// Test root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "AICSCC CMS Management backend is running with authentication.",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      questionBank: "/api/questionBank",
      answerKey: "/api/answerKey",
      gallery: "/api/gallery",
      masterData: "/api/masterData",
      notification: "/api/notification",
    },
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 404 handler for undefined routes - FIXED, no path argument
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    availableRoutes: [
      "/api/auth/register",
      "/api/auth/login",
      "/api/auth/logout",
      "/api/auth/me",
      "/api/questionBank",
      "/api/answerKey",
      "/api/masterData",
      
    ],
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);

  // Multer errors
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "File too large" });
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({ message: "Unexpected field" });
  }

  // Default error response
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Connect to database and sync models then start server
db.sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection established successfully.");
    return db.sequelize.sync({alter: false}); // <-- add alter:true here
  }) 
  .then(() => {
    console.log("Database synced successfully.");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });


// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  db.sequelize.close().then(() => {
    console.log("Database connection closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  db.sequelize.close().then(() => {
    console.log("Database connection closed");
    process.exit(0);
  });
});
