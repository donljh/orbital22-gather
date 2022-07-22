const express = require("express");
const router = express.Router({ mergeParams: true });
const { auth } = require("../middleware/auth");
const setUser = require("../middleware/setUser");

const Group = require("../models/Group");
const SharedEvent = require("../models/SharedEvent");

// Middleware to authenticate and set request user to be same as user in DB
// req.user --> user (in DB)
const userMW = [auth, setUser];

// GET all the shared events of the given group
router.get("/", userMW, async (req, res) => {
  try {
    const groupID = req.params.group_id;

    // Find all shared events associated with logged in user id
    const sharedEvents = await SharedEvent.find({
      group: groupID,
    });

    // console.log('GETTING EVENTS: ' + tasks);
    return res.status(200).json({
      events: sharedEvents,
    });
  } catch (err) {
    console.log("GETTING SHARED EVENTS FAILED: " + err.message);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
});

// POST (Create) a shared event in the given group
router.post("/", userMW, async (req, res) => {
  try {
    const groupID = req.params.group_id;

    // Get user input from request body
    const { title, description, startDate, endDate } = req.body;

    // Validate user input
    if (!title) {
      return res
        .status(400)
        .json({ message: "Title is required to create a event" });
    }

    // Give event to all members in the group
    const group = await Group.findById(groupID).populate({
      path: "members",
      select: "_id",
    });
    let acceptedArr = [];
    group.members.forEach((m) => {
      acceptedArr = [...acceptedArr, m];
    });

    // Create event in database
    const sharedEvent = await SharedEvent.create({
      group: groupID,
      accepted: acceptedArr,
      title,
      description,
      startDate,
      endDate,
    });

    console.log("CREATED SHARED EVENT: " + sharedEvent);
    return res.status(201).json(sharedEvent);
  } catch (err) {
    console.log("CREATING SHARED EVENT FAILED: " + err.message);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
});

// GET a specific shared task of the given id
router.get("/:sharedevent_id", userMW, async (req, res) => {
  try {
    const sharedEvent = await SharedEvent.findOne({
      _id: req.params.sharedevent_id,
      group: req.params.group_id,
    }).populate({
      path: "group",
      populate: { path: "members", select: "_id" },
    });

    if (sharedEvent === null) {
      return res.status(404).json({ message: "Shared event cannot be found" });
    }

    if (!sharedEvent.group.members.some((member) => member.equals(req.user))) {
      return res
        .status(403)
        .json({ message: "User is not allowed to access this event" });
    }

    console.log("GETTING SHARED EVENT: " + sharedEvent);
    res.status(200).json(sharedEvent);
  } catch (err) {
    console.log("UPDATING SHARED EVENT FAILED: " + err.message);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
});

// PATCH a specific shared event of the given id
router.patch("/:sharedevent_id", userMW, async (req, res) => {
  try {
    const input = Object.entries(req.body);

    const sharedEvent = await SharedEvent.findOne({
      _id: req.params.sharedevent_id,
      group: req.params.group_id,
    }).populate({
      path: "group",
      populate: { path: "members", select: "_id" },
    });

    if (sharedEvent === null) {
      return res.status(404).json({ message: "Shared event cannot be found" });
    }

    if (!sharedEvent.group.members.some((member) => member.equals(req.user))) {
      return res
        .status(403)
        .json({ message: "User is not allowed to access this event" });
    }

    input.forEach(([field, value]) => (sharedEvent[field] = value));

    await sharedEvent.save();

    console.log("UPDATED SHARED EVENT" + sharedEvent);
    res.status(200).json(sharedEvent);
  } catch (err) {
    console.log("UPDATING SHARED EVENT FAILED: " + err.message);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
});

// DELETE a specific shared event of the given id
router.delete("/:sharedevent_id", userMW, async (req, res) => {
  try {
    const sharedEvent = await SharedEvent.findOne({
      _id: req.params.sharedevent_id,
      group: req.params.group_id,
    }).populate({
      path: "group",
      populate: { path: "members", select: "_id" },
    });

    if (sharedEvent === null) {
      return res.status(404).json({ message: "Shared event cannot be found" });
    }

    if (!sharedEvent.group.members.some((member) => member.equals(req.user))) {
      return res
        .status(403)
        .json({ message: "User is not allowed to access this event" });
    }

    await sharedEvent.delete();
    console.log("UPDATED SHARED EVENT" + sharedEvent);
    res.status(200).json(sharedEvent);
  } catch (err) {
    console.log("UPDATING SHARED EVENT FAILED: " + err.message);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
});

module.exports = router;
