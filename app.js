require("dotenv").config();
const connectDB = require("./db/connect");
const express = require("express");
const app = express();
const tasks = require("./routes/tasks");
const cros = require("cors");
const userRout = require("./routes/userRout");
app.use(
  cros({
    origin: "*",
  }),
);
//middleware
app.use(express.json());
//routes
app.use("/api/v1/tasks", tasks);
app.use("/user", userRout);

const start = async () => {
  try {
	const mongouri = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_INITDB_DATABASE}`;
	console.log(mongouri)
    await connectDB(mongouri);
    console.log("connected to db");
	const APP_PORT = process.env.APP_PORT;
    app.listen(APP_PORT, console.log("server is running on port " + APP_PORT));
  } catch (e) {
    console.log(e.message);
  }
};
start();
