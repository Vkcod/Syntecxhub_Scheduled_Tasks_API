const JobLog = require("../models/JobLog");

const logJobResult = async ({
  jobName,
  status,
  message,
  startedAt,
  finishedAt,
  error = null
}) => {
  const durationMs = finishedAt.getTime() - startedAt.getTime();

  await JobLog.create({
    jobName,
    status,
    message,
    startedAt,
    finishedAt,
    durationMs,
    error
  });
};

module.exports = logJobResult;