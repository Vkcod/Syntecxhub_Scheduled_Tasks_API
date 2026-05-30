const mongoose = require("mongoose");

const staleRecordSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["active", "stale"],
      default: "active"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("StaleRecord", staleRecordSchema);