require("dotenv").config();
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const session = require("express-session");
const githubRoutes = require("./routes/github");
const testRoutes = require("./routes/test.route");
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // frontend origin
    credentials: true,
  })
);
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET, // Use a strong secret in .env
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true, // Prevents frontend JS from stealing the session cookie
      maxAge: 3600000, // 1 hour
    },
  }),
);

app.use("/auth/github", githubRoutes);
app.use("/ping", testRoutes);
app.get("/", (req, res) => {
  res.send({ message: "Home Page" });
});
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
