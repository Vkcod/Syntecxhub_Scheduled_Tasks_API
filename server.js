const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const startScheduledJobs = require("./jobs/scheduledJobs");

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Scheduled Tasks API is running");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));

startScheduledJobs();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});