const StaleRecord = require("../models/StaleRecord");
const User = require("../models/User");
const JobLog = require("../models/JobLog");
const logJobResult = require("../utils/logJobResult");

const runJobSafely = async (jobName, jobFunction) => {
  const startedAt = new Date();

  try {
    const resultMessage = await jobFunction();

    const finishedAt = new Date();

    await logJobResult({
      jobName,
      status: "success",
      message: resultMessage,
      startedAt,
      finishedAt
    });

    console.log(`${jobName} completed successfully`);

    return {
      success: true,
      message: resultMessage
    };
  } catch (error) {
    const finishedAt = new Date();

    await logJobResult({
      jobName,
      status: "failure",
      message: `${jobName} failed`,
      startedAt,
      finishedAt,
      error: error.message
    });

    console.error(`${jobName} failed:`, error.message);

    return {
      success: false,
      message: `${jobName} failed`,
      error: error.message
    };
  }
};

const deleteStaleRecordsJob = async () => {
  return runJobSafely("deleteStaleRecords", async () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const result = await StaleRecord.deleteMany({
      status: "stale",
      createdAt: {
        $lt: sevenDaysAgo
      }
    });

    return `${result.deletedCount} stale records deleted`;
  });
};

const sendEmailSummaryJob = async () => {
  return runJobSafely("sendEmailSummary", async () => {
    const totalUsers = await User.countDocuments();
    const totalJobLogs = await JobLog.countDocuments();

    /*
      In a real project, you can connect Nodemailer here.
      For this internship project, we are only simulating email summary.
    */

    const summary = `Email summary generated. Total users: ${totalUsers}, total job logs: ${totalJobLogs}`;

    console.log(summary);

    return summary;
  });
};

const availableJobs = {
  deleteStaleRecords: {
    name: "deleteStaleRecords",
    description: "Deletes stale records older than 7 days",
    schedule: "0 0 * * *",
    interval: "Every day at midnight",
    run: deleteStaleRecordsJob
  },

  sendEmailSummary: {
    name: "sendEmailSummary",
    description: "Generates daily email summary",
    schedule: "0 9 * * *",
    interval: "Every day at 9 AM",
    run: sendEmailSummaryJob
  }
};

module.exports = availableJobs;