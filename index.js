require("dotenv").config();
const express = require("express");
const cors = require("cors");
const githubRoutes = require("./routes/github");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth/github", githubRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
