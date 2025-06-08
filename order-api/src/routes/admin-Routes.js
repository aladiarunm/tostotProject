const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuthController = require('../controllers/adminAuthController');

router.post('/auth/login', adminAuthController.adminLogin);
router.get('/auth/user/:id', auth.verifyToken, adminAuthController.getUser);
router.put('/auth/user', auth.verifyToken, adminAuthController.updateUser);
router.put('/auth/user/:id/password', auth.verifyToken, adminAuthController.updatePassword);

// router.post('/auth/register', adminAuthController.createUser);

module.exports = router;