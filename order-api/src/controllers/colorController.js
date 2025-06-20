const Color = require('../models/colorModel'); // adjust path if needed

// Get all colors
exports.getAllColors = (req, res) => {
  Color.getAll((err, colors) => {
    if (err) {
      return res.status(500).send({
        message: err.message || 'Some error occurred while retrieving colors.'
      });
    }
    res.status(200).send({ data: colors });
  });
};

// Add a new color
exports.addColor = (req, res) => {
  const newColor = req.body;

  Color.create(newColor, (err, color) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).send({
          message: `Duplicate name or code enterd .`
        });
      }
      return res.status(500).send({
        message: err.message || 'Some error occurred while creating the color.'
      });
    }
    res.status(201).send(color);
  });
};

// Update an existing color by ID
exports.updateColor = (req, res) => {
  const colorId = req.params.id;
  const updatedColor = req.body;

  Color.update(colorId, updatedColor, (err, color) => {
    if (err) {
      if (err.kind === 'not_found') {
        return res.status(404).send({
          message: `Color not found with id ${colorId}.`
        });
      }
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).send({
          message: `Duplicate name or code enterd .`
        });
      }
      return res.status(500).send({
        message: `Error updating color with id ${colorId}.`
      });
    }
    res.status(200).send(color);
  });
};

// Delete a color by ID
exports.deleteColor = (req, res) => {
  const colorId = req.params.id;

  Color.delete(colorId, (err, result) => {
    if (err) {
      if (err.kind === 'not_found') {
        return res.status(404).send({
          message: `Color not found with id ${colorId}.`
        });
      }
      return res.status(500).send({
        message: `Could not delete color with id ${colorId}.`
      });
    }
    res.status(200).send({ message: `Color was deleted successfully!` });
  });
};
