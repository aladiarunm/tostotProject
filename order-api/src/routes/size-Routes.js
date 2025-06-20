const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const colorController = require('../controllers/sizeController');

router.get('/data', auth.verifyToken, colorController.getAllSizes);

router.post('/addSize', auth.verifyToken, colorController.addSize);

router.put('/updateSize/:id', auth.verifyToken, colorController.updateSize);

router.delete('/deleteSize/:id', auth.verifyToken, colorController.deleteSize);

module.exports = router;
