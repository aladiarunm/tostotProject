const Style = require('../models/styleModel'); // adjust path if needed

// Get all styles
exports.getAllStyles = (req, res) => {
  Style.getAll((err, styles) => {
    if (err) {
      return res.status(500).send({
        message: err.message || 'Some error occurred while retrieving styles.'
      });
    }
    res.status(200).send({ data: styles });
  });
};

// Add a new style
exports.addStyle = (req, res) => {
  const newStyle = req.body;

  Style.create(newStyle, (err, style) => {
    if (err) {
      return res.status(500).send({
        message: err.message || 'Some error occurred while creating the style.'
      });
    }
    res.status(201).send(style);
  });
};

// Update an existing style by ID
exports.updateStyle = (req, res) => {
  const styleId = req.params.id;
  const updatedStyle = req.body;

  Style.update(styleId, updatedStyle, (err, style) => {
    if (err) {
      if (err.kind === 'not_found') {
        return res.status(404).send({
          message: `Style not found with id ${styleId}.`
        });
      }
      return res.status(500).send({
        message: `Error updating style with id ${styleId}.`
      });
    }
    res.status(200).send(style);
  });
};

// Delete a style by ID
exports.deleteStyle = (req, res) => {
  const styleId = req.params.id;

  Style.delete(styleId, (err, result) => {
    if (err) {
      if (err.kind === 'not_found') {
        return res.status(404).send({
          message: `Style not found with id ${styleId}.`
        });
      }
      return res.status(500).send({
        message: `Could not delete style with id ${styleId}.`
      });
    }
    res.status(200).send({ message: `Style was deleted successfully!` });
  });
};
