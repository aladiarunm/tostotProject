const sql = require('../config/db'); // your configured MySQL connection

// Season constructor
const Season = function (season) {
  this.name = season.name;
  this.code = season.code;
  this.description = season.description;
  this.status = season.status;
  this.created_on = season.created_on || new Date();
  this.last_modified_on = season.last_modified_on || new Date();
};

// Get all seasons
Season.getAll = (result) => {
  sql.query('SELECT * FROM orders_dev_db.ext_season', (err, res) => {
    if (err) {
      console.error('Error fetching seasons:', err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

// Create new season
Season.create = (newSeason, result) => {
  const query = 'INSERT INTO ext_season (name, code, description, status) VALUES (?,?,?, ?)';
  const params = [newSeason.name,newSeason.code, newSeason.description, newSeason.status];

  sql.query(query, params, (err, res) => {
    if (err) {
      console.error('Error creating season:', err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...newSeason });
  });
};

// Update season by ID
Season.update = (id, season, result) => {
  const query =
    'UPDATE orders_dev_db.ext_season SET name = ?,code =?, description = ?, status = ?, last_modified_on = ? WHERE id = ? ';
  const params = [
    season.name,
    season.code,
    season.description,
    season.status,
    new Date(),
    id,
  ];
  sql.query(query, params, (err, res) => {
    if (err) {
      console.error('Error updating season:', err);
      result(err, null);
      return;
    }
    if (res.affectedRows === 0) {
      // Not found season with the id
      result({ kind: 'not_found' }, null);
      return;
    }
    result(null, { id: id, ...season });
  });
};

// Delete season by ID
Season.delete = (id, result) => {
  sql.query("UPDATE orders_dev_db.ext_season SET status = 'D' WHERE id = ?",id, (err, res) => {
    if (err) {
      console.error('Error deleting season:', err);
      result(err, null);
      return;
    }
    if (res.affectedRows === 0) {
      // Not found season with the id
      result({ kind: 'not_found' }, null);
      return;
    }
    result(null, res);
  });
};

module.exports = Season;
