const availableJobs = require("../jobs/jobRegistry");
const JobLog = require("../models/JobLog");

const listScheduledJobs = async (req, res) => {
  try {
    const jobs = Object.values(availableJobs).map((job) => {
      return {
        name: job.name,
        description: job.description,
        schedule: job.schedule,
        interval: job.interval
      };
    });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

const triggerJobManually = async (req, res) => {
  try {
    const { jobName } = req.params;

    const job = availableJobs[jobName];

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    const result = await job.run();

    res.status(200).json({
      success: true,
      message: "Job triggered manually",
      jobName,
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

const getJobLogs = async (req, res) => {
  try {
    const { jobName, status, startDate, endDate } = req.query;

    const filter = {};

    if (jobName) {
      filter.jobName = jobName;
    }

    if (status) {
      filter.status = status;
    }

    if (startDate || endDate) {
      filter.createdAt = {};

      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }

      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }

    const logs = await JobLog.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = {
  listScheduledJobs,
  triggerJobManually,
  getJobLogs
};