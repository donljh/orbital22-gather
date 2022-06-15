const express = require('express');
const router = express.Router({ mergeParams: true });
const { auth } = require('../middleware/auth');
const setUser = require('../middleware/setUser');

const Group = require('../models/Group');
const SharedTask = require('../models/SharedTask');

// Middleware to authenticate and set request user to be same as user in DB
// req.user --> user (in DB)
const userMW = [auth, setUser]


// GET all the shared tasks of the given group
router.get('/', userMW, async(req, res) => {
  try {
    const groupID = req.params.group_id

    // Find all shared tasks associated with logged in user id
    const sharedTasks = await SharedTask.find({ 
      group: groupID 
    });
    
    const sharedOverdueTasks = [];
    const sharedTodayTasks = [];
    const sharedUpcomingTasks = [];

    // If there are tasks
    if (sharedTasks) {
      sharedTasks.forEach(task => {
        const taskType = getTaskType(task);
        if (taskType === 'overdue') sharedOverdueTasks.push(task);
        else if (taskType === 'today') sharedTodayTasks.push(task);
        else if (taskType === 'upcoming') sharedUpcomingTasks.push(task);
      })
    }    
    
    // console.log('GETTING TASKS: ' + tasks);
    return res.status(200).json({ 
      sharedOverdueTasks: sharedOverdueTasks, 
      sharedTodayTasks: sharedTodayTasks,
      sharedUpcomingTasks: sharedUpcomingTasks }); 
  } catch (err) {
    console.log('GETTING SHARED TASKS FAILED: ' + err.message);
    res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
  }
})

// POST (Create) a shared task in the given group
router.post('/', userMW, async(req, res) => {
  try {
    const groupID = req.params.group_id;

    // Get user input from request body
    const { title, description, dueDate } = req.body;

    // Validate user input
    if (!title) {
      return res.status(400).json({ message: 'Title is required to create a task'});
    }

    // Create task in database
    const task = await SharedTask.create({
      group: groupID,
      title,
      description,
      dueDate
    })
    
    console.log('CREATED SHARED TASK: ' + task);
    return res.status(201).json(task);
  } catch (err) {
    console.log('CREATING SHARED TASK FAILED: ' + err.message);
    res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
  }
})

// GET a specific shared task of the given id
router.get('/:sharedtask_id', userMW, async(req, res) => {
  try {
    const sharedTask = await SharedTask.findOne({
      _id: req.params.sharedtask_id,
      group: req.params.group_id  
    }).populate('group', 'members');    

    if (sharedTask === null) {
      return res.status(404).json({ message: 'Shared task cannot be found' })
    }

    if (!sharedTask.group.members.some( member => member.equals(req.user))) {
      return res.status(403).json({ message: 'User is not allowed to access this task' })
    }
    
    console.log('GETTING SHARED TASK: ' + sharedTask);
    res.status(200).json(sharedTask);
  } catch (err) {
    console.log('UPDATING SHARED TASK FAILED: ' + err.message);
    res.status(500).json({ message: 'INTERNAL SERVER ERROR' })
  }
})

// PATCH a specific shared task of the given id
router.patch('/:sharedtask_id', userMW, async(req, res) => {
  try {
    const input = Object.entries(req.body);

    const sharedTask = await SharedTask.findOne({
      _id: req.params.sharedtask_id,
      group: req.params.group_id  
    }).populate('group', 'members');    

    if (sharedTask === null) {
      return res.status(404).json({ message: 'Shared task cannot be found' })
    }

    if (!sharedTask.group.members.some( member => member.equals(req.user))) {
      return res.status(403).json({ message: 'User is not allowed to access this task' })
    }

    input.forEach(([field, value]) => sharedTask[field] = value);

    await sharedTask.save();
    
    console.log('UPDATED SHARED TASK' + sharedTask);
    res.status(200).json(sharedTask);
  } catch (err) {
    console.log('UPDATING SHARED TASK FAILED: ' + err.message);
    res.status(500).json({ message: 'INTERNAL SERVER ERROR' })
  }
})

// DELETE a specific shared task of the given id
router.delete('/:sharedtask_id', userMW, async(req, res) => {
  try {
    const sharedTask = await SharedTask.findOne({
      _id: req.params.sharedtask_id,
      group: req.params.group_id  
    }).populate('group', 'members');    

    if (sharedTask === null) {
      return res.status(404).json({ message: 'Shared task cannot be found' })
    }

    if (!sharedTask.group.members.some( member => member.equals(req.user))) {
      return res.status(403).json({ message: 'User is not allowed to access this task' })
    }

    input.forEach(([field, value]) => sharedTask[field] = value);

    await sharedTask.delete();
    
    console.log('UPDATED SHARED TASK' + sharedTask);
    res.status(200).json(sharedTask);
  } catch (err) {
    console.log('UPDATING SHARED TASK FAILED: ' + err.message);
    res.status(500).json({ message: 'INTERNAL SERVER ERROR' })
  }
})

// PATCH a specific shared task of the given id
router.patch('/:sharedtask_id/accepted', userMW, async(req, res) => {
  try {
    const sharedTask = await SharedTask.findOne({
      _id: req.params.sharedtask_id,
      group: req.params.group_id  
    })    

    if (sharedTask === null) {
      return res.status(404).json({ message: 'Shared task cannot be found' })
    }

    if (!sharedTask.group.members.some( member => member.equals(req.user))) {
      return res.status(403).json({ message: 'User is not allowed to access this task' })
    }

    if (sharedTask.accepted.some(acceptedUser => acceptedUser.equals(req.user))) {
      return res.status(400).json({ message: 'User has already accepted this task' })
    }

    sharedTask.accepted = [...sharedTask.accepted, req.user]

    await sharedTask.save();
    
    console.log('ACCEPTED SHARED TASK' + sharedTask);
    res.status(200).json(sharedTask);
  } catch (err) {
    console.log('UPDATING SHARED TASK FAILED: ' + err.message);
    res.status(500).json({ message: 'INTERNAL SERVER ERROR' })
  }
})

// PATCH a specific shared task of the given id
router.patch('/:sharedtask_id/accepted', userMW, async(req, res) => {
  try {
    const sharedTask = await SharedTask.findOne({
      _id: req.params.sharedtask_id,
      group: req.params.group_id  
    })    

    if (sharedTask === null) {
      return res.status(404).json({ message: 'Shared task cannot be found' })
    }

    if (!sharedTask.group.members.some( member => member.equals(req.user))) {
      return res.status(403).json({ message: 'User is not allowed to access this task' })
    }

    if (sharedTask.accepted.some(acceptedUser => acceptedUser.equals(req.user))) {
      return res.status(400).json({ message: 'User has already accepted this task' })
    }

    sharedTask.accepted = [...sharedTask.accepted, req.user]

    await sharedTask.save();
    
    console.log('ACCEPTED SHARED TASK' + sharedTask);
    res.status(200).json(sharedTask);
  } catch (err) {
    console.log('UPDATING SHARED TASK FAILED: ' + err.message);
    res.status(500).json({ message: 'INTERNAL SERVER ERROR' })
  }
})

// PATCH a specific shared task of the given id
router.patch('/:sharedtask_id/completed', userMW, async(req, res) => {
  try {
    const sharedTask = await SharedTask.findOne({
      _id: req.params.sharedtask_id,
      group: req.params.group_id  
    })    

    if (sharedTask === null) {
      return res.status(404).json({ message: 'Shared task cannot be found' })
    }

    if (!sharedTask.group.members.some(member => member.equals(req.user))) {
      return res.status(403).json({ message: 'User is not allowed to access this task' })
    }

    if (!sharedTask.accepted.some(acceptedUser => acceptedUser.equals(req.user))) {
      return res.status(400).json({ message: 'User has not accepted this task' })
    }

    if (sharedTask.completed.some(completedUser => completedUser.equals(req.user))) {
      return res.status(400).json({ message: 'User has already completed this task' })
    }

    sharedTask.completed = [...sharedTask.accepted, req.user]

    await sharedTask.save();
    
    console.log('COMPLETED SHARED TASK' + sharedTask);
    res.status(200).json(sharedTask);
  } catch (err) {
    console.log('UPDATING SHARED TASK FAILED: ' + err.message);
    res.status(500).json({ message: 'INTERNAL SERVER ERROR' })
  }
})

module.exports = router

function getTaskType(task) {
  const now = new Date();
  const nowD = now.getUTCDate();
  const nowM = now.getUTCMonth();
  const nowY = now.getUTCFullYear();

  if (!task.dueDate) return 'upcoming';

  const dueDate = new Date(task.dueDate);
  const dueD = dueDate.getUTCDate();
  const dueM = dueDate.getUTCMonth();
  const dueY = dueDate.getUTCFullYear();

  // Different year
  if (dueY > nowY) return 'upcoming';
  if (dueY < nowY) return 'overdue';

  // Same year, different month
  if (dueM > nowM) return 'upcoming';
  if (dueM < nowM) return 'overdue';
  
  // Same year, month, different date
  if (dueD > nowD) return 'upcoming';
  if (dueD < nowD) return 'overdue';

  // Same year, month, date
  return 'today';
}