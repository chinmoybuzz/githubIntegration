// require("dotenv").config();
// const express = require("express");
// const axios = require("axios");
// const router = express.Router();
// // let serverToken = null;
// // Step 1: Redirect user to GitHub
// router.get("/login", (req, res) => {
//   const githubAuthURL = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo user`;
//   // console.log("githubAuthURL:", githubAuthURL);
//   res.redirect(githubAuthURL);
// });

// // router.get("/user/repo",)
// // Step 2: GitHub Callback
// router.get("/callback", async (req, res) => {
//   const code = req.query.code;
//   // console.log(code);
//   try {
//     // Exchange code for access token
//     const tokenResponse = await axios.post(
//       "https://github.com/login/oauth/access_token",
//       {
//         client_id: process.env.GITHUB_CLIENT_ID,
//         client_secret: process.env.GITHUB_CLIENT_SECRET,
//         code,
//       },
//       {
//         headers: {
//           Accept: "application/json",
//         },
//       },
//     );

//     const accessToken = tokenResponse.data.access_token;
//     // serverToken = accessToken;
//     // console.log("accessTOken", accessToken);
//     // Fetch user info
//     const userResponse = await axios.get("https://api.github.com/user", {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     // const repoDetails = await axios.get("https://api.github.com/", {
//     //   headers: {
//     //     Authorization: `Bearer ${accessToken}`,
//     //   },
//     // });
//     // console.log("repoDetails", userResponse);
//     // res.json({
//     //   token: "data",
//     //   githubUser: "YOu",
//     // });
//     // const repoDetails = `https://api.github.com/repos/{145897023}/{repo}`;
//     // const repoUrl = `https://api.github.com/users/chinmoybuzz/repos`;
//     const repoUrl = `https://api.github.com/user/repos?per_page=100&visibility=all`;
//     const repoDetails = await axios.get(repoUrl, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     // console.log("repoDetails", userResponse);
//     const githubRepoList = repoDetails.data.map((item) => item.name);
//     console.log("working", githubRepoList.length); // Should now show 40
//     res.json({
//       token: accessToken,
//       githubUser: githubRepoList,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "OAuth failed" });
//   }
// });

// module.exports = router;
//v2 code
// require("dotenv").config();
// const express = require("express");
// const axios = require("axios");
// const crypto = require("crypto");
// const router = express.Router();

// // Step 1: Redirect user to GitHub
// router.get("/login", (req, res) => {
//   // Generate a random state string for security (prevents CSRF)
//   const state = crypto.randomBytes(16).toString("hex");

//   // Scopes: 'repo' gives access to private repos, 'user' gives profile access
//   const params = new URLSearchParams({
//     client_id: process.env.GITHUB_CLIENT_ID,
//     scope: "repo user",
//     state: state,
//   });

//   const githubAuthURL = `https://github.com/login/oauth/authorize?${params.toString()}`;

//   res.redirect(githubAuthURL);
// });

// // Step 2: GitHub Callback
// router.get("/callback", async (req, res) => {
//   const { code, state } = req.query;

//   if (!code) {
//     return res.status(400).json({ error: "No code provided from GitHub" });
//   }

//   try {
//     // 1. Exchange the temporary code for an Access Token
//     const tokenResponse = await axios.post(
//       "https://github.com/login/oauth/access_token",
//       {
//         client_id: process.env.GITHUB_CLIENT_ID,
//         client_secret: process.env.GITHUB_CLIENT_SECRET,
//         code,
//       },
//       { headers: { Accept: "application/json" } },
//     );

//     const accessToken = tokenResponse.data.access_token;

//     if (!accessToken) {
//       return res.status(401).json({ error: "Failed to obtain access token" });
//     }

//     // 2. Fetch all Repositories (Public + Private)
//     // We use /user/repos with 'visibility=all' and 'affiliation'
//     // to ensure we get everything you own or contribute to.
//     const repoUrl = `https://api.github.com/user/repos?per_page=100&visibility=all&affiliation=owner,collaborator`;

//     const repoDetails = await axios.get(repoUrl, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     // 3. Clean up the data for the frontend
//     const githubRepoList = repoDetails.data.map((repo) => ({
//       id: repo.id,
//       name: repo.name,
//       private: repo.private, // true/false
//       description: repo.description,
//       html_url: repo.html_url,
//       language: repo.language,
//     }));

//     // 4. Send the response
//     res.json({
//       success: true,
//       total_repos: githubRepoList.length,
//       repos: githubRepoList,
//       // Note: In a real app, store accessToken in a session/cookie, not just res.json
//       // token: accessToken,
//     });
//   } catch (error) {
//     console.error("GitHub OAuth Error:", error.response?.data || error.message);
//     res.status(500).json({
//       error: "Authentication failed",
//       details: error.response?.data?.error_description || "Internal Server Error",
//     });
//   }
// });

// module.exports = router;
// v3;
// require("dotenv").config();
// const express = require("express");
// const axios = require("axios");
// const router = express.Router();

// // Step 1: Redirect user to GitHub
// router.get("/login", (req, res) => {
//   const params = new URLSearchParams({
//     client_id: process.env.GITHUB_CLIENT_ID,
//     scope: "repo user", // 'repo' is essential for private repository access
//     // redirect_uri: process.env.GITHUB_REDIRECT_URI,
//   });

//   const githubAuthURL = `https://github.com/login/oauth/authorize?${params.toString()}`;
//   res.redirect(githubAuthURL);
// });

// // Step 2: The Callback Route
// router.get("/callback", async (req, res) => {
//   const { code } = req.query;

//   if (!code) {
//     return res.status(400).json({ error: "Authorization code missing" });
//   }

//   try {
//     // --- 1. Exchange Code for Access Token ---
//     const tokenResponse = await axios.post(
//       "https://github.com/login/oauth/access_token",
//       {
//         client_id: process.env.GITHUB_CLIENT_ID,
//         client_secret: process.env.GITHUB_CLIENT_SECRET,
//         code,
//       },
//       { headers: { Accept: "application/json" } },
//     );

//     const accessToken = tokenResponse.data.access_token;

//     if (!accessToken) {
//       return res.status(401).json({ error: "Failed to retrieve access token" });
//     }

//     // --- 2. Fetch All Repositories (The fix for your 40 repos) ---
//     // visibility=all: Gets Public + Private
//     // affiliation=owner,collaborator: Gets repos you own AND ones you're invited to
//     const repoUrl = `https://api.github.com/user/repos?per_page=100&visibility=all&affiliation=owner,collaborator`;

//     const repoDetails = await axios.get(repoUrl, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "User-Agent": "Node.js-App", // GitHub API prefers a User-Agent header
//       },
//     });

//     // --- 3. Process the Data ---
//     const githubRepoList = repoDetails.data.map((repo) => ({
//       name: repo.name,
//       isPrivate: repo.private, // Helps you verify if those 10 showed up
//       url: repo.html_url,
//       description: repo.description,
//     }));

//     console.log(`Success! Found ${githubRepoList.length} total repositories.`);

//     // --- 4. Send Response ---
//     res.json({
//       success: true,
//       count: githubRepoList.length,
//       repos: githubRepoList,
//       // token: accessToken, // Sending token back to client (be careful in production!)
//     });
//   } catch (error) {
//     console.error("Error in GitHub Callback:", error.response?.data || error.message);
//     res.status(500).json({
//       error: "Authentication or Data Fetching failed",
//       details: error.response?.data || error.message,
//     });
//   }
// });

require("dotenv").config();
const express = require("express");
const axios = require("axios");
const router = express.Router();

// Step 1: Login & Redirect
router.get("/login", (req, res) => {
  const githubAuthURL = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo user`;
  res.redirect(githubAuthURL); //
});

// Step 2: The Callback (The "Brain" of the operation)
//update It for session store in server and redirection
// router.get("/callback", async (req, res) => {
//   const code = req.query.code;

//   try {
//     // 1. Exchange code for Token
//     const tokenResponse = await axios.post(
//       "https://github.com/login/oauth/access_token",
//       {
//         client_id: process.env.GITHUB_CLIENT_ID,
//         client_secret: process.env.GITHUB_CLIENT_SECRET,
//         code,
//       },
//       { headers: { Accept: "application/json" } },
//     );

//     const accessToken = tokenResponse.data.access_token;

//     // 2. SAVE TOKEN TO SESSION (Crucial Step)
//     req.session.githubToken = accessToken;

//     // 3. Fetch ALL Repos (The 40 repos fix)
//     const repoUrl = `https://api.github.com/user/repos?per_page=100&visibility=all&affiliation=owner,collaborator`;

//     const repoDetails = await axios.get(repoUrl, {
//       headers: { Authorization: `Bearer ${accessToken}` },
//     });

//     // 4. Send the list, but NOT the token
//     res.json({
//       message: "Authenticated successfully!",
//       total: repoDetails.data.length,
//       // repos: repoList,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Login failed.");
//   }
// });
router.get("/callback", async (req, res) => {
  const code = req.query.code;

  try {
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } },
    );

    const accessToken = tokenResponse.data.access_token;

    // ✅ Save token in session
    req.session.githubToken = accessToken;

    // IMPORTANT: save session before redirect
    req.session.save(() => {
      // ✅ Redirect back to frontend
      res.redirect("http://localhost:3000/admin/github/login?login=success");
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Login failed.");
  }
});
// Step 3: A Protected Route (Example of how to use the session later)
router.get("/my-repos", async (req, res) => {
  if (!req.session.githubToken) {
    return res.status(401).send("Please login first");
  }

  try {
    const response = await axios.get("https://api.github.com/user/repos", {
      headers: { Authorization: `Bearer ${req.session.githubToken}` },
    });
    const repoList = response.data.map((repo) => ({
      name: repo.name,
      private: repo.private,
      url: repo.html_url,
    }));

    res.json(repoList);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch repos" });
  }
});

module.exports = router;
