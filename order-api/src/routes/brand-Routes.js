const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const brandController = require('../controllers/brandController');

router.get('/data', auth.verifyToken, brandController.getAllBrands);

router.post('/addBrand', auth.verifyToken, brandController.addBrand);

router.put('/updateBrand/:id', auth.verifyToken, brandController.updateBrand);

router.delete('/deleteBrand/:id', auth.verifyToken, brandController.deleteBrand);

module.exports = router;
