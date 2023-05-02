const express = require('express')
const router = express.Router()
const { getProfile, setProfile, updateProfile, deleteProfile } = require('../controller/profileController.js')
const { protect } = require('../middleware/authMiddleware.js')

router.get('/', protect, getProfile)

router.post("/", protect, setProfile);

router.put("/:id", protect, updateProfile);

router.delete("/:id",protect, deleteProfile);

module.exports = router;
