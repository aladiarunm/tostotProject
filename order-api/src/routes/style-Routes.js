const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const colorController = require('../controllers/styleController.js');

router.get('/data', auth.verifyToken, colorController.getAllStyles);

router.post('/addStyle', auth.verifyToken, colorController.addStyle);

router.put('/updateStyle/:id', auth.verifyToken, colorController.updateStyle);

router.delete('/deleteStyle/:id', auth.verifyToken, colorController.deleteStyle);

module.exports = router;
