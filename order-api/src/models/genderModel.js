const sql = require('../config/db'); // your configured MySQL connection

// Gender constructor
const Gender = function (gender) {
  this.name = gender.name;
  this.code = gender.code;
  this.description = gender.description;
  this.status = gender.status;
  this.created_on = gender.created_on || new Date();
  this.last_modified_on = gender.last_modified_on || new Date();
};

// Get all genders
Gender.getAll = (result) => {
  sql.query('SELECT * FROM orders_dev_db.ext_gender', (err, res) => {
    if (err) {
      console.error('Error fetching genders:', err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

// Create new gender
Gender.create = (newGender, result) => {
  const query = 'INSERT INTO ext_gender (name, code, description, status) VALUES (?,?,?, ?)';
  const params = [newGender.name,newGender.code, newGender.description, newGender.status];

  sql.query(query, params, (err, res) => {
    if (err) {
      console.error('Error creating gender:', err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...newGender });
  });
};

// Update gender by ID
Gender.update = (id, gender, result) => {
  const query =
    'UPDATE orders_dev_db.ext_gender SET name = ?,code =?, description = ?, status = ?, last_modified_on = ? WHERE id = ? ';
  const params = [
    gender.name,
    gender.code,
    gender.description,
    gender.status,
    new Date(),
    id,
  ];
  sql.query(query, params, (err, res) => {
    if (err) {
      console.error('Error updating gender:', err);
      result(err, null);
      return;
    }
    if (res.affectedRows === 0) {
      // Not found gender with the id
      result({ kind: 'not_found' }, null);
      return;
    }
    result(null, { id: id, ...gender });
  });
};

// Delete gender by ID
Gender.delete = (id, result) => {
  sql.query("UPDATE orders_dev_db.ext_gender SET status = 'D' WHERE id = ?",id, (err, res) => {
    if (err) {
      console.error('Error deleting gender:', err);
      result(err, null);
      return;
    }
    if (res.affectedRows === 0) {
      // Not found gender with the id
      result({ kind: 'not_found' }, null);
      return;
    }
    result(null, res);
  });
};

module.exports = Gender;
