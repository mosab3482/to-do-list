const mongoose = require("mongoose");
const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  refreshToken: {
    require: true,
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 604800,
  },
});
module.exports = mongoose.model("Session", sessionSchema);
