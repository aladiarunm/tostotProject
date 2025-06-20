const Size = require('../models/sizeModel'); // adjust path if needed

// Get all sizes
exports.getAllSizes = (req, res) => {
  Size.getAll((err, sizes) => {
    if (err) {
      return res.status(500).send({
        message: err.message || 'Some error occurred while retrieving sizes.'
      });
    }
    res.status(200).send({ data: sizes });
  });
};

// Add a new size
exports.addSize = (req, res) => {
  const newSize = req.body;

  Size.create(newSize, (err, size) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).send({
          message: `Duplicate name or code enterd .`
        });
      }
      return res.status(500).send({
        message: err.message || 'Some error occurred while creating the size.'
      });
    }
    res.status(201).send(size);
  });
};

// Update an existing size by ID
exports.updateSize = (req, res) => {
  const sizeId = req.params.id;
  const updatedSize = req.body;

  Size.update(sizeId, updatedSize, (err, size) => {
    if (err) {
      if (err.kind === 'not_found') {
        return res.status(404).send({
          message: `Size not found with id ${sizeId}.`
        });
      }
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).send({
          message: `Duplicate name or code enterd for id ${sizeId}.`
        });
      }
      return res.status(500).send({
        message: `Error updating size with id ${sizeId}.`
      });
    }
    res.status(200).send(size);
  });
};

// Delete a size by ID
exports.deleteSize = (req, res) => {
  const sizeId = req.params.id;

  Size.delete(sizeId, (err, result) => {
    if (err) {
      if (err.kind === 'not_found') {
        return res.status(404).send({
          message: `Size not found with id ${sizeId}.`
        });
      }
      return res.status(500).send({
        message: `Could not delete size with id ${sizeId}.`
      });
    }
    res.status(200).send({ message: `Size was deleted successfully!` });
  });
};
