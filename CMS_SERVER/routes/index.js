const express = require("express");
const router = express.Router();

router.use("/questionBank", require("./questionBank.routes"));
// You can add other module routes here similarly
// router.use("/gallery", require("./gallery.routes"));
// router.use("/result", require("./result.routes"));

module.exports = router;
