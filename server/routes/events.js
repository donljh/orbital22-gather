const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const setUser = require('../middleware/setUser');

const Event = require('../models/Event');

// Middleware to authenticate and set request user to be same as user in DB
// req.user --> user (in DB)
const userMW = [auth, setUser];

// GET all events of currently logged in user
router.get('/', userMW, async (req, res) => {
  try {
    // Find all events associated with logged in user id
    const events = await Event.find({ user: req.user.id });

    console.log('GETTING EVENTS: ' + events);
    return res.status(200).json({
      events: events
    });
  } catch (err) {
    console.log('GETTING EVENTS FAILED: ' + err.message);
    res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
  }
})

// GET a specific event of currently logged in user
router.get('/:event_id', userMW, async (req, res) => {
  try {
    // Find event with given id
    let event = await Event.findById(req.params.event_id);

    // Event cannot be found
    if (event === null) {
      return res.status(404).json({ message: 'Event cannot be found' });
    }

    // If event isn't associated with requesting user, refuse access
    if (event.user._id != req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    console.log('GETTING EVENT: ' + event);
    return res.status(200).json(event);
  } catch (err) {
    console.log('GETTING EVENT FAILED: ' + err.message);
    res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
  }
})

// POST (Create) a new event of currently logged in user
router.post('/', userMW, async (req, res) => {
  try {
    console.log(req.user.id);

    // Get user input from request body
    const { title, description, startDate, endDate } = req.body;

    // Validate user input
    if (!title) {
      return res.status(400).json({ message: 'Title is required to create an event' });
    }

    // Create event in database
    const event = await Event.create({
      user: req.user,
      title,
      description,
      startDate,
      endDate
    })

    console.log('CREATED EVENT: ' + event);
    return res.status(201).json(event);
  } catch (err) {
    console.log('CREATING EVENT FAILED: ' + err.message);
    return res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
  }
})

// PATCH (Update) a specific event of currently logged in user
router.patch('/:event_id', userMW, async (req, res) => {
  try {
    // Get user input from request body
    const input = Object.entries(req.body);

    let event = await Event.findById(req.params.event_id);

    // Event cannot be found
    if (event === null) {
      return res.status(404).json({ message: 'Event cannot be found' });
    }

    // If event isn't associated with requesting user, refuse access
    if (event.user._id != req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    input.forEach(([field, value]) => event[field] = value);

    const updatedEvent = await event.save();

    console.log('UPDATED EVENT: ' + updatedEvent);
    return res.status(201).json(updatedEvent);
  } catch (err) {
    console.log('UPDATING EVENT FAILED: ' + err.message);
    return res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
  }
})

// DELETE an event of currently logged in user
router.delete('/:event_id', userMW, async (req, res) => {
  try {
    let event = await Event.findById(req.params.event_id);

    // Event cannot be found
    if (event === null) {
      return res.status(404).json({ message: 'Event cannot be found' });
    }

    // If event isn't associated with requesting user, refuse access
    if (event.user._id != req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    await event.delete();
    return res.status(200).json({ message: 'Event has been deleted' });
  } catch (err) {
    console.log('DELETING EVENT FAILED: ' + err.message);
    return res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
  }
})

module.exports = router;