const router = require("express").Router()
const db = require("../db/connect.js")


const getAllTasks = async (req, res) => {
  try {
    const tasks = await db.getAllTasks();
    res.status(200).json(tasks);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const createTask = async (req, res) => {
  try {
    const task = await db.addTask("new");
    res.status(201).json(task);
  } catch (e) {
    console.log(e.message);
  }
};

const getTask = async (req, res) => {
  const taskID = req.params.id;
  try {
    taskdata = await db.getOneTask(taskID);
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

router.route("/")
	.get(getAllTasks)
	.post(createTask);

router.route("/:id")
	.get(getTask)
	.patch(updateTask)
	.delete(deleteTask);

module.exports = router;
