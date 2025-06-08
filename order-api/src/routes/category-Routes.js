const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const categoryController = require('../controllers/categoryController');


router.get('/data', auth.verifyToken, categoryController.getAllCategory);

router.post('/addCategory', auth.verifyToken, categoryController.addCategory);

router.put('/updateCategory/:id', auth.verifyToken, categoryController.updateCategory);

router.delete('/deleteCategory/:id', auth.verifyToken, categoryController.deleteCategory);

module.exports = router;
