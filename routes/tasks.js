const router = require("express").Router()
const db = require("../db/connect.js")


const getAllTasks = async (req, res) => {
	try {
		const tasks = db.getAllTasks();
		res.status(200).json(tasks);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
};

const createTask = async (req, res) => {
	try {
		newtask = req.body
		const task = await db.addTask(newtask.name);
		res.status(201).json(task);
	} catch (e) {
		console.log(e.message);
	}
};

const getTask = async (req, res) => {
	const taskID = req.params.id;
	try {
		taskdata = await db.getOneTask(taskID);
		console.log(taskID, taskdata)
		if (!taskdata) {
			return res.status(404).json({ msg: `no task with id : ${taskID}` });
		}
		res.status(200).json(taskdata);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
};

const updateTask = async (req, res) => {
	try {
		const taskID = req.params.id;
		const updata = req.body;
		const task = await db.updateTask( taskID , updata);

		res.status(200).json({ id: taskID, data: updata });
	} catch (e) {
		res.status(500).json({ message: e.message });
	}
};

const deleteTask = async (req, res) => {
	const taskID = req.params.id;
	try {
		const taskData = await db.deleteTask(taskID);
		if (!taskData) {
			return res.status(404).json({ msg: `no task with id : ${taskID}` });
		}
		res.status(200).json({ meg: "task is deleted" });
	} catch (e) {
		res.status(500).json({ mes: e.message });
	}
};
// /api/v1/tasks
router.route("/")
	.get(getAllTasks)
	.post(createTask);

router.route("/:id")
	.get(getTask)
	.patch(updateTask)
	.delete(deleteTask);

module.exports = router;
