const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const colorController = require('../controllers/colorController');

router.get('/data', auth.verifyToken, colorController.getAllColors);

router.post('/addColor', auth.verifyToken, colorController.addColor);

router.put('/updateColor/:id', auth.verifyToken, colorController.updateColor);

router.delete('/deleteColor/:id', auth.verifyToken, colorController.deleteColor);

module.exports = router;
