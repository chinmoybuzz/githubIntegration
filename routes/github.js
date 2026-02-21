const express = require("express");
const axios = require("axios");
const router = express.Router();

// Step 1: Redirect user to GitHub
router.get("/login", (req, res) => {
  const githubAuthURL = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo user`;

  res.redirect(githubAuthURL);
});

// Step 2: GitHub Callback
router.get("/callback", async (req, res) => {
  const code = req.query.code;

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    const accessToken = tokenResponse.data.access_token;

    // Fetch user info
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    res.json({
      token: accessToken,
      githubUser: userResponse.data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OAuth failed" });
  }
});

module.exports = router;
