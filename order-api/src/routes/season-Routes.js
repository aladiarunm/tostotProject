const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const seasonController = require('../controllers/seasonController.js');

router.get('/data', auth.verifyToken, seasonController.getAllSeasons);

router.post('/addSeason', auth.verifyToken, seasonController.addSeason);

router.put('/updateSeason/:id', auth.verifyToken, seasonController.updateSeason);

router.delete('/deleteSeason/:id', auth.verifyToken, seasonController.deleteSeason);

module.exports = router;
