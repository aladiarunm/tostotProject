const Gender = require('../models/genderModel'); // adjust path if needed

// Get all genders
exports.getAllGenders = (req, res) => {
  Gender.getAll((err, genders) => {
    if (err) {
      return res.status(500).send({
        message: err.message || 'Some error occurred while retrieving genders.'
      });
    }
    res.status(200).send({ data: genders });
  });
};

// Add a new gender
exports.addGender = (req, res) => {
  const newGender = req.body;

  Gender.create(newGender, (err, gender) => {
    if (err) {
      if(err.code === 'ER_DUP_ENTRY'){
          return res.status(400).send({
          message: `Duplicate name or code enterd while Creating.`
        });
      }
      return res.status(500).send({
        message: err.message || 'Some error occurred while creating the gender.'
      });
    }
    res.status(201).send(gender);
  });
};

// Update an existing gender by ID
exports.updateGender = (req, res) => {
  const genderId = req.params.id;
  const updatedGender = req.body;

  Gender.update(genderId, updatedGender, (err, gender) => {
    if (err) {
      if (err.kind === 'not_found') {
        return res.status(404).send({
          message: `Gender not found with id ${genderId}.`
        });
      }
      if(err.code === 'ER_DUP_ENTRY'){
          return res.status(400).send({
          message: `Duplicate name or code enterd for id ${genderId}.`
        });
      }
      return res.status(500).send({
        message: `Error updating gender with id ${genderId}.`
      });
    }
    res.status(200).send(gender);
  });
};

// Delete a gender by ID
exports.deleteGender = (req, res) => {
  const genderId = req.params.id;

  Gender.delete(genderId, (err, result) => {
    if (err) {
      if (err.kind === 'not_found') {
        return res.status(404).send({
          message: `Gender not found with id ${genderId}.`
        });
      }
      return res.status(500).send({
        message: `Could not delete gender with id ${genderId}.`
      });
    }
    res.status(200).send({ message: `Gender was deleted successfully!` });
  });
};
