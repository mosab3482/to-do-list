require("dotenv").config();
const connectDB = require("./db/connect");
const express = require("express");
const app = express();
const tasks = require("./routes/tasks");
const cros = require("cors");

app.use(
  cros({
    origin: "*",
  }),
);

//middleware
app.use(express.json());

//routes
app.use("/api/v1/tasks", tasks);

const start = async () => {
  try {
  //  await connectDB(process.env.MONGO_URL);
    app.listen(3000, console.log("server is running on port 3000"));
  } catch (e) {
    console.log(e.message);
  }
};
start();
