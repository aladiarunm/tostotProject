const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const subCategoryController = require('../controllers/subCategoryController');


router.get('/data/:id', auth.verifyToken, subCategoryController.getAllCategory);

router.get('/alldata',auth.verifyToken, subCategoryController.getAlllCategory);

router.post('/addCategory/:id', auth.verifyToken, subCategoryController.addCategory);

router.put('/updateCategory/:id', auth.verifyToken, subCategoryController.updateCategory);

router.delete('/deleteCategory/:id', auth.verifyToken, subCategoryController.deleteCategory);

module.exports = router;
