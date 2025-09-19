const express = require("express");
const router = express.Router();

// Auth routes
router.use("/auth", require("./auth.routes"));

// Question Bank routes
router.use("/questionBank", require("./questionBank.routes"));

// Answer Key routes
router.use("/answerKey", require("./answerKey.routes"));

router.use("/gallery", require("./gallery.routes"));
router.use("/masterData", require("./masterData.routes"));
router.use("/notification", require("./notification.routes"));
router.use("/result", require("./result.routes"));
// Gallery routes (uncomment when implemented)
// router.use("/gallery", require("./gallery.routes"));

// Result routes (uncomment when implemented)
// router.use("/result", require("./result.routes"));

module.exports = router;
