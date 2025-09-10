require("dotenv").config(); // Load .env variables at the very top

const express = require("express");
const cors = require("cors");
const path = require("path");

const db = require("./models"); // Sequelize models index
const routes = require("./routes"); // API routes aggregated

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Static folder to serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes - all prefixed with /api
app.use("/api", routes);

// Test root endpoint
app.get("/", (req, res) => {
  res.send("CMS Management backend is running.");
});

// Connect to database and sync models then start server
db.sequelize
  .sync()
  .then(() => {
    console.log("Database synced successfully.");
    app.listen(PORT, () => {
      console.log(
        `Server is running on port ${PORT} in ${process.env.NODE_ENV} mode.`
      );
    });
  })
  .catch((err) => {
    console.error("Failed to sync database:", err);
  });
