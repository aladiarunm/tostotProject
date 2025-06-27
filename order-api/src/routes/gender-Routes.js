const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const genderController = require('../controllers/genderController.js');

router.get('/data', auth.verifyToken, genderController.getAllGenders);

router.post('/addGender', auth.verifyToken, genderController.addGender);

router.put('/updateGender/:id', auth.verifyToken, genderController.updateGender);

router.delete('/deleteGender/:id', auth.verifyToken, genderController.deleteGender);

module.exports = router;
