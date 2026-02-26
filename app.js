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
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimt({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: "Too many accounts created from this IP, please try again later",
});
const apiLimter = rateLimt({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(express.json({ limit: "3mb" }));

app.use("/api/v1/tasks", apiLimter, tasks);

app.use("/user/register", registerLimiter);
app.use("/user/login", loginLimiter);
app.use("/user", userRout);

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const start = async () => {
  try {
    const mongouri = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_INITDB_DATABASE}`;
    await connectDB(mongouri);
    console.log("connected to db");
    const APP_PORT = process.env.APP_PORT;
    app.listen(APP_PORT, console.log("server is running on port " + APP_PORT));
  } catch (e) {
    console.log(e.message);
  }
};
start();
