const express = require("express");
const app = express();
const tasks = require("./routes/tasks");
const cros = require("cors");
const userRout = require("./routes/userRout");

app.use(
	cros({ origin: "*" })
);

//middleware
app.use(express.json());

//routes
app.use("/api/v1/tasks", tasks);
app.use("/user", userRout);

function start() {
	try {
		app.listen(3000, console.log("server is running on port 3000"));
	} catch (e) {
		console.log(e.message);
	}
};
start();
