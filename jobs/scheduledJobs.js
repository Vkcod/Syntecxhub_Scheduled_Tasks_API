const cron = require("node-cron");
const availableJobs = require("./jobRegistry");

const startScheduledJobs = () => {
  Object.values(availableJobs).forEach((job) => {
    cron.schedule(job.schedule, async () => {
      console.log(`Running scheduled job: ${job.name}`);
      await job.run();
    });

    console.log(`Scheduled job registered: ${job.name} - ${job.interval}`);
  });
};

module.exports = startScheduledJobs;