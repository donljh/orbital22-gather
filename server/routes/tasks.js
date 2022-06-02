const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const setUser = require('../middleware/setUser');

const Task = require('../models/Task');

// Middleware to authenticate and set request user to be same as user in DB
// req.user --> user (in DB)
const userMW = [auth, setUser];

// GET all tasks of currently logged in user
router.get('/', userMW, async(req, res) => {
  try {
    // Find all tasks associated with logged in user id
    let tasks = await Task.find({ user: req.user.id });
    
    if (tasks === null) {
      tasks = [];
    }

    console.log('GETTING TASKS: ' + tasks);
    return res.status(200).json(tasks); 
  } catch (err) {
    console.log('GETTING TASKS FAILED: ' + err.message);
    res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
  }
})

// GET a specific task of currently logged in user
router.get('/:task_id', userMW, async(req, res) => {
  try {
    // Find task with given id
    let task = await Task.findById(req.params.task_id);

    // Task cannot be found
    if (task === null) {
      return res.status(404).json({ message: 'Task cannot be found' });
    }

    // If task isn't associated with requesting user, refuse access
    if (task.user._id != req.user.id ) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    console.log('GETTING TASK: ' + task);
    return res.status(200).json(task);
  } catch (err) {
    console.log('GETTING TASK FAILED: ' + err.message);
    res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
  }
})

// POST (Create) a new task of currently logged in user
router.post('/', userMW, async (req, res) => {
  try {
    console.log(req.user.id);

    // Get user input from request body
    const { title, description, dueDate } = req.body;

    // Validate user input
    if (!title) {
      return res.status(400).json({ message: 'Title is required to create a task'});
    }

    // Create task in database
    const task = await Task.create({
      user: req.user,
      title,
      description,
      dueDate
    })
    
    console.log('CREATED TASK: ' + task);
    return res.status(201).json(task);
  } catch (err) {
    console.log('CREATING TASK FAILED: ' + err.message);
    return res.status(500).json({ message: 'INTERNAL SERVER ERROR'});
  }
})

// PATCH (Update) a specific task of currently logged in user
router.patch('/:task_id', userMW, async (req, res) => {
  try {
    // Get user input from request body
    const input = Object.entries(req.body);

    let task = await Task.findById(req.params.task_id);

    // Task cannot be found
    if (task === null) {
      return res.status(404).json({ message: 'Task cannot be found' });
    }

    // If task isn't associated with requesting user, refuse access
    if (task.user._id != req.user.id ) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    input.forEach(([field, value]) => task[field] = value);

    const updatedTask = await task.save();
    
    console.log('UPDATED TASK: ' + updatedTask);
    return res.status(201).json(updatedTask);
  } catch (err) {
    console.log('UPDATING TASK FAILED: ' + err.message );
    return res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
  }
})

// DELETE a task of currently logged in user
router.delete('/:task_id', userMW, async (req, res) => {
  try {
    let task = await Task.findById(req.params.task_id);

    // Task cannot be found
    if (task === null) {
      return res.status(404).json({ message: 'Task cannot be found' });
    }

    // If task isn't associated with requesting user, refuse access
    if (task.user._id != req.user.id ) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    await task.delete();
    return res.status(200).json({ message: 'Task has been deleted' });
  } catch (err) {
    console.log('DELETING TASK FAILED: ' + err.message );
    return res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
  }
})

module.exports = router;