const mongoose = require("mongoose");
const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  accessToken: {
    require: true,
    type: String,
  },
});
module.exports = mongoose.model("Session", sessionSchema);
