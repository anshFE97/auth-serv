const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getUser, updateUser } = require('../controller/userController.js')
const { protect } = require('../middleware/authMiddleware.js')

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getUser)
router.put('/me/:id', updateUser)

module.exports = router