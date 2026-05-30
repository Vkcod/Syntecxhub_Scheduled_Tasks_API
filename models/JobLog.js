const mongoose = require("mongoose");

const jobLogSchema = new mongoose.Schema(
  {
    jobName: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["success", "failure"],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    startedAt: {
      type: Date,
      required: true
    },
    finishedAt: {
      type: Date,
      required: true
    },
    durationMs: {
      type: Number,
      required: true
    },
    error: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("JobLog", jobLogSchema);