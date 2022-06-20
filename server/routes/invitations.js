const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const setUser = require('../middleware/setUser');

const User = require('../models/User');
const Group = require('../models/Group');
const Invitation = require('../models/Invitation');

// Middleware to authenticate and set request user to be same as user in DB
// req.user --> user (in DB)
const userMW = [auth, setUser]

// GET all invitations of currently logged in user
router.get('/', userMW, async (req, res) => {
  try {
    // Find invitations where invitee corresponds to currently logged in user
    const invitations = await Invitation.find({ 
      invitee: req.user
    })
      .populate('group', 'name')
      .populate({
        path: 'invited_by',
        select: 'email',
        populate: { path: 'profile', select: 'name' }});

    // Return found invitiations
    console.log('GETTING INVITATIONS: ' + invitations);
    res.status(200).json(invitations);
  } catch (err) {
    console.log('GETTING INVITATIONS FAILED: ' + err.message);
    res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
  }
})

// GET a specific invitation by id
router.get('/:invitation_id', userMW, async (req, res) => {
  try {
    // Find invitation by id
    const invitation = await Invitation.findById(req.params.invitation_id);

    if (invitation === null) {
      return res.status(404).json({ message: "Cannot find invitation" })
    }

    // Return found invitation
    console.log('GETTING INVITATION: ' + invitation);
    res.status(200).json(invitation);
  } catch (err) {
    console.log('GETTING INVITATION FAILED: ' + err.message);
    res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
  }
})

// GET invitations by group id
router.get('/:group_id', userMW, async (req, res) => {
  try {
    // Find invitations that correspond to the group id
    const invitations = await Invitation.find({ group: groupId });

    console.log('GETTING INVITATIONS: ' + invitations);
    res.status(200).json(invitation);
  } catch (err) {
    console.log('GETTING INVTITATIONS FAILED: ' + err.message);
    res.status(500).json({ message: 'INTERNAL SERVER ERROR' })
  }
})

// POST (Create) an invitation
router.post('/', userMW, async (req, res) => {
  try {
    // Get invitation parameters from req body
    const { groupID, inviteeEmail, message } = req.body;

    // Check for validity of given group's id and invitee email
    const invitee = await User.findOne(
      { email: inviteeEmail }
    );

    if (invitee === null) {
      return res.status(404).json({ message: 'Cannot find requested user' })
    }
    
    const group = await Group.findById(groupID).populate('members')

    if (group === null) {
      return res.status(404).json({ message: 'Cannot find requested group' })
    }

    const isMember = group.members.some( member => member.equals(invitee) )

    if (isMember) {
      return res.status(400).json({ message: 'User is already in this group' })
    }

    const existingInvitation = await Invitation.findOne({
      group: groupID,
      invitee
    })

    if (existingInvitation) {
      return res.status(400).json({ message: 'An invitation has already been sent to this user' })
    }

    const invitation = await Invitation.create({
      group,
      invited_by: req.user,
      invitee,
      message
    })

    // Create and return invitation
    console.log('CREATING INVITATION: ' + invitation);
    res.status(201).json(invitation);
  } catch (err) {
    console.log('CREATING INVITATION FAILED: ' + err.message);
    res.status(500).json({ message: 'INTERNAL SERVER ERROR' })
  }
})

// DELETE invitation by id
router.delete('/:invitation_id', userMW, async (req, res) => {
  try {
    // Find invitation by id
    const invitation = await Invitation.findById(req.params.invitation_id)
      .populate({
        path: 'group',
        populate: { path: 'admins', select: '_id' }
      })
      .populate('invitee', '_id')

    if (invitation === null) {
      return res.status(404).json({ message: "Cannot find invitation" })
    }

    const isAdmin = invitation.group.admins.some(admin => admin.equals(req.user));

    // Check if requesting user is an admin of the group or is the invitee
    if (!isAdmin && !invitation.invitee.equals(req.user)) {
      return res.status(403).json({ 
        message: 'User does not have permission to delete this invitation' 
      });
    }

    await invitation.delete();

    console.log('DELETED INVITATION')
    res.status(200).json({ message: 'Deleted invitation' })
  } catch (err) {
    console.log('DELETING INVITATION FAILED: ' + err.message);
    res.status(500).json({ message: 'INTERNAL SERVER ERROR' })
  }
})

module.exports = router