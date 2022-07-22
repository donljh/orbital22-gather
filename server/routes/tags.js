const express = require("express");
const router = express.Router({ mergeParams: true });
const { auth } = require("../middleware/auth");
const setUser = require("../middleware/setUser");

const Tag = require("../models/Tag");

// Middleware to authenticate and set request user to be same as user in DB
// req.user --> user (in DB)
const userMW = [auth, setUser];

// GET all the tags of the currently logged in user
router.get("/", userMW, async (req, res) => {
  try {
    const tags = await Tag.find({
      user: req.user.id,
    });

    return res.status(200).json(tags);
  } catch (err) {
    console.log("GETTING TAGS FAILED: " + err.message);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
});

// POST (Create) a new tag for the currently logged in user
router.post("/", userMW, async (req, res) => {
  try {
    const { name, colorHex } = req.body;
    console.log(name, colorHex);

    if (!name || !colorHex)
      return res
        .status(400)
        .json({ message: "Name and color must be provided to create a tag" });

    const tag = await Tag.create({
      user: req.user,
      name,
      colorHex,
    });
    return res.status(200).json(tag);
  } catch (err) {
    console.log("CREATING TAG FAILED: " + err.message);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
});

router.patch("/:tag_id", userMW, async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.tag_id);
    const { name, colorHex } = req.body;

    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    if (tag.user._id != req.user.id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    tag.name = name;
    tag.colorHex = colorHex;

    const updatedTag = await tag.save();

    return res.status(200).json(updatedTag);
  } catch (err) {
    console.log("UPDATING TAG FAILED: " + err.message);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
});

// DELETE a tag from the currently logged in user
router.delete("/:tag_id", userMW, async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.tag_id);

    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    if (tag.user._id != req.user.id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    await tag.delete();
    return res.status(200).json({ message: "Tag has been deleted" });
  } catch (err) {
    console.log("DELETING TAG FAILED: " + err.message);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
});

module.exports = router;
