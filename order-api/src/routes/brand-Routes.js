const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const brandController = require('../controllers/brandController');

// Get all brands (protected)
router.get('/data', auth.verifyToken, brandController.getAllBrands);

// //Add a new brand (protected)
router.post('/addBrand', auth.verifyToken, brandController.addBrand);

// //Update an existing brand by ID (protected)
router.put('/updateBrand/:id', auth.verifyToken, brandController.updateBrand);

// //Delete a brand by ID (protected)
router.delete('/deleteBrand/:id', auth.verifyToken, brandController.deleteBrand);

module.exports = router;
