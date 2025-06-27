const Material = require('../models/materialModel'); // adjust path if needed

// Get all materials
exports.getAllMaterials = (req, res) => {
  Material.getAll((err, materials) => {
    if (err) {
      return res.status(500).send({
        message: err.message || 'Some error occurred while retrieving materials.'
      });
    }
    res.status(200).send({ data: materials });
  });
};

// Add a new material
exports.addMaterial = (req, res) => {
  const newMaterial = req.body;

  Material.create(newMaterial, (err, material) => {
    if (err) {
      if(err.code === 'ER_DUP_ENTRY'){
          return res.status(400).send({
          message: `Duplicate name or code enterd while Creating.`
        });
      }
      return res.status(500).send({
        message: err.message || 'Some error occurred while creating the material.'
      });
    }
    res.status(201).send(material);
  });
};

// Update an existing material by ID
exports.updateMaterial = (req, res) => {
  const materialId = req.params.id;
  const updatedMaterial = req.body;

  Material.update(materialId, updatedMaterial, (err, material) => {
    if (err) {
      if (err.kind === 'not_found') {
        return res.status(404).send({
          message: `Material not found with id ${materialId}.`
        });
      }
      if(err.code === 'ER_DUP_ENTRY'){
          return res.status(400).send({
          message: `Duplicate name or code enterd for id ${materialId}.`
        });
      }
      return res.status(500).send({
        message: `Error updating material with id ${materialId}.`
      });
    }
    res.status(200).send(material);
  });
};

// Delete a material by ID
exports.deleteMaterial = (req, res) => {
  const materialId = req.params.id;

  Material.delete(materialId, (err, result) => {
    if (err) {
      if (err.kind === 'not_found') {
        return res.status(404).send({
          message: `Material not found with id ${materialId}.`
        });
      }
      return res.status(500).send({
        message: `Could not delete material with id ${materialId}.`
      });
    }
    res.status(200).send({ message: `Material was deleted successfully!` });
  });
};
