const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getMe, updateProfile, deleteAccount } = require('../controllers/settingsController');
const router = express.Router();

router.get('/me', protect, getMe);
router.put('/update', protect, updateProfile);
router.delete('/delete', protect, deleteAccount);

module.exports = router;