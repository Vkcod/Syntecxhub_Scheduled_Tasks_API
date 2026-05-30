const express = require("express");
const {
  listScheduledJobs,
  triggerJobManually,
  getJobLogs
} = require("../controllers/jobController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", protect, adminOnly, listScheduledJobs);
router.post("/:jobName/trigger", protect, adminOnly, triggerJobManually);
router.get("/logs", protect, adminOnly, getJobLogs);

module.exports = router;