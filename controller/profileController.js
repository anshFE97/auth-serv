const asyncHandler = require("express-async-handler");

const Profile = require("../models/profileModel");
const User = require("../models/userModel");

// @DESC Get profile
// @route GET /api/profile
// @access Private
const getProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.find({ user: req.user });

  res.status(200).json(profile);
});

// @DESC set profile
// @route POST /api/profile
// @access Private
const setProfile = asyncHandler(async (req, res) => {
  if (!req.body.name) {
    res.status(400);
    throw new Error("Please add your name");
  }

  const profile = await Profile.create({
    name: req.body.name,
    bio: req.body.bio,
    phone: req.body.phone,
    url: req.body.url,
    user: req.user.id,
  });

  res.status(200).json(profile);
});

// @DESC update profile
// @route PUT api/profile/:id
const updateProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findById(req.params.id);

  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error("UserNot found not authorized");
  }

  // Make sure the info is of logged in user
  if (profile.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User Not Authorized");
  }

  const update = {};
  if (req.body.name && req.body.name !== '') {
    update.name = req.body.name;
  }
  if (req.body.bio && req.body.bio !== '') {
    update.bio = req.body.bio;
  }
  if (req.body.phone && req.body.phone !== '') {
    update.phone = req.body.phone;
  }

  if (req.body.url && req.body.url !== '') {
    update.url = req.body.url;
  }

  const updatedProfile = await Profile.findByIdAndUpdate(
    req.params.id,
    { $set: update },
    { new: true }
  );
  res.status(200).json(updatedProfile)
});

// @desc Delete Goals 
// @route DELETE /api/goals/:id
// @access Private
const deleteProfile = asyncHandler(async (req, res) => {
    const profile = await Profile.findById(req.params.id)

    if(!profile) {
        res.status(400)
        throw new Error('Goal not found')
    }

    // check for user
    if(!req.user){
        res.status(401)
        throw new Error('User not found. Not Authorized')
    }

    // Make Sure the logged in user matched the goal user
    if(profile.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('User Not Authorized')
    }

    // const deletedGoal = await Goal.findByIdAndDelete(req.params.id)

    await profile.remove()

    res.status(200).json({id: req.params.id});
})

module.exports = {
    getProfile,
    setProfile,
    updateProfile,
    deleteProfile
}
