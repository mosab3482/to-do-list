require("dotenv").config();
const connectDB = require("./db/connect");
const express = require("express");
const app = express();
const tasks = require("./routes/tasks");
const cors = require("cors");
const userRout = require("./routes/userRout");
const rateLimt = require("express-rate-limit");

const allowedOrigins = (
  process.env.ALLOWED_ORIGINS || "http://localhost:3000"
).split(",");

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

const loginLimiter = rateLimt({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts, please try again later",
  standerHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many register attempts, please try again later",
  standerHeaders: true,
  legacyHeaders: false,
});

app.use(express.json());

app.use("/api/v1/tasks", tasks);
app.use("/user", userRout);

const start = async () => {
  try {
    const mongouri = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_INITDB_DATABASE}`;
    console.log(mongouri);
    await connectDB(mongouri);
    console.log("connected to db");
    const APP_PORT = process.env.APP_PORT;
    app.listen(APP_PORT, console.log("server is running on port " + APP_PORT));
  } catch (e) {
    console.log(e.message);
  }
};
start();
