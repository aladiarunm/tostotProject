const Season = require('../models/seasonModel'); // adjust path if needed

// Get all seasons
exports.getAllSeasons = (req, res) => {
  Season.getAll((err, seasons) => {
    if (err) {
      return res.status(500).send({
        message: err.message || 'Some error occurred while retrieving seasons.'
      });
    }
    res.status(200).send({ data: seasons });
  });
};

// Add a new season
exports.addSeason = (req, res) => {
  const newSeason = req.body;

  Season.create(newSeason, (err, season) => {
    if (err) {
      if(err.code === 'ER_DUP_ENTRY'){
          return res.status(400).send({
          message: `Duplicate name or code enterd while Creating.`
        });
      }
      return res.status(500).send({
        message: err.message || 'Some error occurred while creating the season.'
      });
    }
    res.status(201).send(season);
  });
};

// Update an existing season by ID
exports.updateSeason = (req, res) => {
  const seasonId = req.params.id;
  const updatedSeason = req.body;

  Season.update(seasonId, updatedSeason, (err, season) => {
    if (err) {
      if (err.kind === 'not_found') {
        return res.status(404).send({
          message: `Season not found with id ${seasonId}.`
        });
      }
      if(err.code === 'ER_DUP_ENTRY'){
          return res.status(400).send({
          message: `Duplicate name or code enterd for id ${seasonId}.`
        });
      }
      return res.status(500).send({
        message: `Error updating season with id ${seasonId}.`
      });
    }
    res.status(200).send(season);
  });
};

// Delete a season by ID
exports.deleteSeason = (req, res) => {
  const seasonId = req.params.id;

  Season.delete(seasonId, (err, result) => {
    if (err) {
      if (err.kind === 'not_found') {
        return res.status(404).send({
          message: `Season not found with id ${seasonId}.`
        });
      }
      return res.status(500).send({
        message: `Could not delete season with id ${seasonId}.`
      });
    }
    res.status(200).send({ message: `Season was deleted successfully!` });
  });
};
