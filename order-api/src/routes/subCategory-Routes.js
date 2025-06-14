const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const subCategoryController = require('../controllers/subCategoryController');

router.get('/categories', auth.verifyToken, subCategoryController.getCategories);

router.get('/data/:id', auth.verifyToken, subCategoryController.getAllSubCategory);

router.post('/addCategory/:id', auth.verifyToken, subCategoryController.addSubCategory);

router.put('/updateCategory/:id', auth.verifyToken, subCategoryController.updateSubCategory);

router.delete('/deleteCategory/:id', auth.verifyToken, subCategoryController.deleteSubCategory);

module.exports = router;
