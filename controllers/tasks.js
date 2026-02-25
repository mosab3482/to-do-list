const Task = require("../models/task");

const getAllTasks = async (req, res) => {
  try {
    const userId = req.userId;
    const tasks = (await Task.find({ userId })).sort({ createAt: -1 });
    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

const createTask = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.userId;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Task name is require",
      });
    }

    const task = await Task.create({ name, userId });
    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

const getTask = async (req, res) => {
  const taskID = req.params.id;
  const userId = req.userId;
  try {
    task = await Task.findOne({ _id: taskID, userId });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: `no task with id : ${taskID}`,
      });
    }
    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const taskID = req.params.id;
    const userId = req.userId;
    const updateData = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: taskID, userId },
      updateData,
      { new: true },
    );
    if (!task) {
      res.status(404).json({
        succss: false,
        message: "Task not found",
      });
    }
    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

const deleteTask = async (req, res) => {
  const taskID = req.params.id;
  const userId = req.userId;
  try {
    const task = await Task.findOneAndDelete({ _id: taskID, userId });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

module.exports = {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
};
