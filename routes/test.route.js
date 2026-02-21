const express = require("express");
const router = express.Router();

// Step 1: Redirect user to GitHub
router.get("/", function (req, res) {
  res.json({
    message: "Pong",
  });
});

module.exports = router;
