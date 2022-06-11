const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const setUser = require('../middleware/setUser');

const Group = require('../models/Group');

// Middleware to authenticate and set request user to be same as user in DB
// req.user --> user (in DB)
const userMW = [auth, setUser]

// GET all groups of currently logged in user
router.get('/', userMW, async (req, res) => {
  try {
    // Find groups where members array contains id of currently logged in user
    const groups = await Group.find({ 
      members: { $in: req.user } 
    }).select('name _id')

    // Return array of groups that this user is a member in
    console.log('GETTING GROUPS: ' + groups);
    res.status(200).json(groups);
  } catch (err) {
    console.log('GETTING GROUPS FAILED: ' + err.message);
    res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
  }
})

// POST (create) a group  
router.post('/', userMW, async (req, res) => {
  try {
    const { groupName } = req.body;

    if (!groupName) {
      return res.status(400).json({ message: 'Group name required' })
    }

    const group = await Group.create({
      name: groupName,
      admins: [req.user],
      members: [req.user]
    })

    console.log('CREATING GROUP: ' + group);
    res.status(201).json({ message: 'Group created', groupId: group._id });
  } catch (err) {
    console.log('CREATING GROUP FAILED: ' + err.message);
    res.status(500).json({ message: err.message });
  }
})

// DELETE a specific group, if user has admin privileges
router.delete('/:group_id', userMW, async(req, res) => {
  try {
    // Find group based on given group id
    const group = await Group.findById(req.params.group_id)
      .populate({ 
        path: 'members', 
        select: '_id', 
        populate: { path: 'profile', select: 'name' }})
      .populate({ 
        path: 'admins', 
        select: '_id', 
        populate: { path: 'profile', select: 'name' }});

    if (group === null) {
      return res.status(404).json({ message: 'Group cannot be found' });
    }

    const adminIDs = group.admins.map(admin => admin.id);

    // Check if user is an admin of the group
    if (!adminIDs.includes(req.user.id)) {
      return res.status(403).json({ 
        message: 'User is not an admin of requested group'
      })
    }    

    return res.status(200).json({ message: 'Group has been deleted' })
  } catch (err) {
    console.log('LEAVING GROUP FAILED: ' + err.message);
    res.status(500).json({ message: 'INTERNAL SERVER ERROR' })
  }
})

// GET a specific group of currently logged in user
router.get('/:group_id', userMW, async(req, res) => {
  try {
    // Find group based on given group id
    const group = await Group.findById(req.params.group_id)
      .populate({ 
        path: 'members', 
        select: '_id', 
        populate: { path: 'profile', select: 'name' }})
      .populate({ 
        path: 'admins', 
        select: '_id', 
        populate: { path: 'profile', select: 'name' }});

    if (group === null) {
      return res.status(404).json({ message: 'Group cannot be found' });
    }

    const memberIDs = group.members.map(member => member.id);

    // Check if user is a member of the group
    if (!memberIDs.includes(req.user.id)) {
      return res.status(403).json({ 
        message: 'User is not a member of requested group'
      })
    }    

    console.log('GETTING GROUP: ' + group);
    return res.status(200).json(group);
  } catch (err) {
    console.log('GETTING GROUP FAILED: ' + err.message);
    res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
  }
})

// PATCH a specific group, allow currently logged in user to join requested group
router.patch('/:group_id/join', userMW, async(req, res) => {
  try {
    // Find group based on given group id
    const group = await Group.findById(req.params.group_id)
      .populate({ 
        path: 'members', 
        select: '_id', 
        populate: { path: 'profile', select: 'name' }})
      .populate({ 
        path: 'admins', 
        select: '_id', 
        populate: { path: 'profile', select: 'name' }});

    if (group === null) {
      return res.status(404).json({ message: 'Group cannot be found' });
    }

    const memberIDs = group.members.map(member => member.id);

    // Check if user is a member of the group
    if (memberIDs.includes(req.user.id)) {
      return res.status(400).json({ 
        message: 'User is already a member of requested group'
      })
    }
    
    // User is not a member of the group yet, add user to the group
    group.members = [...group.members, req.user];
    await group.save();

    return res.status(200).json({ message: 'User joined group', groupId: group._id })
  } catch (err) {
    console.log('JOINING GROUP FAILED: ' + err.message);
    res.status(500).json({ message: 'INTERNAL SERVER ERROR' })
  }
})

// PATCH a specific group, allow currently logged in user to leave requested group
router.patch('/:group_id/leave', userMW, async(req, res) => {
  try {
     // Find group based on given group id
    const group = await Group.findById(req.params.group_id)
      .populate({ 
        path: 'members', 
        select: '_id', 
        populate: { path: 'profile', select: 'name' }})
      .populate({ 
        path: 'admins', 
        select: '_id', 
        populate: { path: 'profile', select: 'name' }});

    if (group === null) {
      return res.status(404).json({ message: 'Group cannot be found' });
    }

    const memberIDs = group.members.map(member => member.id);

    // Check if user is a member of the group
    if (!memberIDs.includes(req.user.id)) {
      return res.status(403).json({ 
        message: 'User is not a member of requested group'
      })
    }    

    // If user is the only member, disband and delete the group
    if (memberIDs.length === 1) {
      await Group.findByIdAndDelete(req.params.group_id);
      return res.status(200).json({ message: 'Group has been disbanded' })
    }

    const adminIDs = group.admins.map(admin => admin.id);

    // Check if user is the only admin of the group
    if (adminIDs.includes(req.user.id) && adminIDs.length === 1) {

      // Remove user from the array of users
      group.members = group.members.filter( member => member.id !== req.user.id );

      // If there are other members left, make one of them an admin
      group.admins.push(group.members[0]);
    }

    // Remove user from the array of users
    group.members = group.members.filter( member => member.id !== req.user.id );
    await group.save();

    return res.status(200).json({ message: 'User left group' })
  } catch (err) {
    console.log('LEAVING GROUP FAILED: ' + err.message);
    res.status(500).json({ message: 'INTERNAL SERVER ERROR' })
  }
})

module.exports = router;