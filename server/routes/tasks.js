const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const setUser = require("../middleware/setUser");

const Task = require("../models/Task");
const SharedTask = require("../models/SharedTask");

// Middleware to authenticate and set request user to be same as user in DB
// req.user --> user (in DB)
const userMW = [auth, setUser];

// GET all tasks of currently logged in user
router.get("/", userMW, async (req, res) => {
  try {
    // Find all tasks associated with logged in user id
    const tasks = await Task.find({ user: req.user.id }).populate("tags");

    const overdueTasks = [];
    const todayTasks = [];
    const upcomingTasks = [];

    // If there are tasks
    if (tasks) {
      tasks.forEach((task) => {
        const taskType = getTaskType(task);
        if (taskType === "overdue") overdueTasks.push(task);
        else if (taskType === "today") todayTasks.push(task);
        else if (taskType === "upcoming") upcomingTasks.push(task);
      });
    }

    console.log("GETTING TASKS: " + tasks);
    return res.status(200).json({
      allTasks: tasks,
      overdueTasks: overdueTasks,
      todayTasks: todayTasks,
      upcomingTasks: upcomingTasks,
    });
  } catch (err) {
    console.log("GETTING TASKS FAILED: " + err.message);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
});

// GET all shared tasks of currently logged in user
router.get("/shared", userMW, async (req, res) => {
  try {
    // Find all shared tasks associated with logged in user id
    const sharedTasks = await SharedTask.find({
      accepted: { $in: req.user },
      completed: { $nin: req.user },
    }).populate("group", "name");

    const sharedOverdueTasks = [];
    const sharedTodayTasks = [];
    const sharedUpcomingTasks = [];

    // If there are tasks
    if (sharedTasks) {
      sharedTasks.forEach((task) => {
        const taskType = getTaskType(task);
        if (taskType === "overdue") sharedOverdueTasks.push(task);
        else if (taskType === "today") sharedTodayTasks.push(task);
        else if (taskType === "upcoming") sharedUpcomingTasks.push(task);
      });
    }

    // console.log('GETTING TASKS: ' + tasks);
    return res.status(200).json({
      sharedOverdueTasks: sharedOverdueTasks,
      sharedTodayTasks: sharedTodayTasks,
      sharedUpcomingTasks: sharedUpcomingTasks,
    });
  } catch (err) {
    console.log("GETTING TASKS FAILED: " + err.message);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
});

// GET a specific task of currently logged in user
router.get("/:task_id", userMW, async (req, res) => {
  try {
    // Find task with given id
    let task = await Task.findById(req.params.task_id);

    // Task cannot be found
    if (task === null) {
      return res.status(404).json({ message: "Task cannot be found" });
    }

    // If task isn't associated with requesting user, refuse access
    if (task.user._id != req.user.id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    console.log("GETTING TASK: " + task);
    return res.status(200).json(task);
  } catch (err) {
    console.log("GETTING TASK FAILED: " + err.message);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
});

// POST (Create) a new task of currently logged in user
router.post("/", userMW, async (req, res) => {
  try {
    // Get user input from request body
    const { title, description, dueDate, tagId } = req.body;

    // Validate user input
    if (!title) {
      return res
        .status(400)
        .json({ message: "Title is required to create a task" });
    }

    // Create task in database
    const task = await Task.create({
      user: req.user,
      title,
      description,
      dueDate,
      tags: [...tagId],
    });

    console.log(task);

    console.log("CREATED TASK: " + task);
    return res.status(201).json(task);
  } catch (err) {
    console.log("CREATING TASK FAILED: " + err.message);
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
});

// PATCH (Update) a specific task of currently logged in user
router.patch("/:task_id", userMW, async (req, res) => {
  try {
    // Get user input from request body
    const input = Object.entries(req.body);
    console.log("======================");
    console.log(input);
    console.log("======================");

    let task = await Task.findById(req.params.task_id);

    // Task cannot be found
    if (task === null) {
      return res.status(404).json({ message: "Task cannot be found" });
    }

    // If task isn't associated with requesting user, refuse access
    if (task.user._id != req.user.id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    input.forEach(([field, value]) => (task[field] = value));

    const updatedTask = await task.save();

    console.log("UPDATED TASK: " + updatedTask);
    return res.status(201).json(updatedTask);
  } catch (err) {
    console.log("UPDATING TASK FAILED: " + err.message);
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
});

// DELETE a task of currently logged in user
router.delete("/:task_id", userMW, async (req, res) => {
  try {
    let task = await Task.findById(req.params.task_id);

    // Task cannot be found
    if (task === null) {
      return res.status(404).json({ message: "Task cannot be found" });
    }

    // If task isn't associated with requesting user, refuse access
    if (task.user._id != req.user.id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    await task.delete();
    return res.status(200).json({ message: "Task has been deleted" });
  } catch (err) {
    console.log("DELETING TASK FAILED: " + err.message);
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
});

module.exports = router;

function getTaskType(task) {
  const now = new Date();
  const nowD = now.getUTCDate();
  const nowM = now.getUTCMonth();
  const nowY = now.getUTCFullYear();

  if (!task.dueDate) return "upcoming";

  const dueDate = new Date(task.dueDate);
  const dueD = dueDate.getUTCDate();
  const dueM = dueDate.getUTCMonth();
  const dueY = dueDate.getUTCFullYear();

  // Different year
  if (dueY > nowY) return "upcoming";
  if (dueY < nowY) return "overdue";

  // Same year, different month
  if (dueM > nowM) return "upcoming";
  if (dueM < nowM) return "overdue";

  // Same year, month, different date
  if (dueD > nowD) return "upcoming";
  if (dueD < nowD) return "overdue";

  // Same year, month, date
  return "today";
}
