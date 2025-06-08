const Category = require('../models/categoryModel'); // adjust path if needed

// Get all category
exports.getAllCategory = (req, res) => {
  Category.getAll((err, category) => {
    if (err) {
      return res.status(500).send({
        message: err.message || 'Some error occurred while retrieving category.'
      });
    }
    res.status(200).send({ data: category });
  });
};

// Add a new category
exports.addCategory  = (req, res) => {
  const newCategory  = req.body;

  Category.create(newCategory, (err, brand) => {
    if (err) {
      return res.status(500).send({
        message: err.message || 'Some error occurred while creating the category .'
      });
    }
    res.status(201).send(brand);
  });
};

// Update an existing brand by ID
exports.updateCategory = (req, res) => {
  const CategoryId = req.params.id;
  const updatedCategory = req.body;

  Category.update(CategoryId, updatedCategory, (err, category) => {
    if (err) {
      if (err.kind === 'not_found') {
        return res.status(404).send({
          message: `Category not found with id ${CategoryId}.`
        });
      }
      return res.status(500).send({
        message: `Error updating category with id ${CategoryId}.`
      });
    }
    res.status(200).send(category);
  });
};

// Delete a category by ID
exports.deleteCategory = (req, res) => {
  const CategoryId = req.params.id;

  Category.delete(CategoryId, (err, result) => {
    if (err) {
      if (err.kind === 'not_found') {
        return res.status(404).send({
          message: `Category not found with id ${CategoryId}.`
        });
      }
      return res.status(500).send({
        message: `Could not delete category with id ${CategoryId}.`
      });
    }
    res.status(200).send({ message: `Category was deleted successfully!` });
  });
};
