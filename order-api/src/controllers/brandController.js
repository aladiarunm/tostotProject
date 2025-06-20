const Brand = require('../models/brandModel'); // adjust path if needed

// Get all brands
exports.getAllBrands = (req, res) => {
  Brand.getAll((err, brands) => {
    if (err) {
      return res.status(500).send({
        message: err.message || 'Some error occurred while retrieving brands.'
      });
    }
    res.status(200).send({ data: brands });
  });
};

// Add a new brand
exports.addBrand = (req, res) => {
  const newBrand = req.body;

  Brand.create(newBrand, (err, brand) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).send({
          message: `Duplicate name or code enterd .`
        });
      }
      return res.status(500).send({
        message: err.message || 'Some error occurred while creating the brand.'
      });
    }
    res.status(201).send(brand);
  });
};

// Update an existing brand by ID
exports.updateBrand = (req, res) => {
  const brandId = req.params.id;
  const updatedBrand = req.body;

  Brand.update(brandId, updatedBrand, (err, brand) => {
    if (err) {
      if (err.kind === 'not_found') {
        return res.status(404).send({
          message: `Brand not found with id ${brandId}.`
        });
      }
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).send({
          message: `Duplicate name or code enterd .`
        });
      }
      return res.status(500).send({
        message: `Error updating brand with id ${brandId}.`
      });
    }
    res.status(200).send(brand);
  });
};

// Delete a brand by ID
exports.deleteBrand = (req, res) => {
  const brandId = req.params.id;

  Brand.delete(brandId, (err, result) => {
    if (err) {
      if (err.kind === 'not_found') {
        return res.status(404).send({
          message: `Brand not found with id ${brandId}.`
        });
      }
      return res.status(500).send({
        message: `Could not delete brand with id ${brandId}.`
      });
    }
    res.status(200).send({ message: `Brand was deleted successfully!` });
  });
};
