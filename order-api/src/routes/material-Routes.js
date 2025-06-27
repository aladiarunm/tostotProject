const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const materialController = require('../controllers/materialController.js');

router.get('/data', auth.verifyToken, materialController.getAllMaterials);

router.post('/addMaterial', auth.verifyToken, materialController.addMaterial);

router.put('/updateMaterial/:id', auth.verifyToken, materialController.updateMaterial);

router.delete('/deleteMaterial/:id', auth.verifyToken, materialController.deleteMaterial);

module.exports = router;
