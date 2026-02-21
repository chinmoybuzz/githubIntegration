require("dotenv").config();
const express = require("express");
const cors = require("cors");
const githubRoutes = require("./routes/github");
const testRoutes = require("./routes/test.route");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth/github", githubRoutes);
app.use("/ping", testRoutes);
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
