const sql = require('../config/db'); // your configured MySQL connection

// Size constructor
const Size = function (size) {
  this.name = size.name;
  this.code = size.code;
  this.description = size.description;
  this.status = size.status;
  this.created_on = size.created_on || new Date();
  this.last_modified_on = size.last_modified_on || new Date();
};

// Get all sizes
Size.getAll = (result) => {
  sql.query('SELECT * FROM orders_dev_db.ext_size', (err, res) => {
    if (err) {
      console.error('Error fetching sizes:', err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

// Create new size
Size.create = (newSize, result) => {
  const query = 'INSERT INTO ext_size (name, code, description, status) VALUES (?,?,?, ?)';
  const params = [newSize.name,newSize.code, newSize.description, newSize.status];

  sql.query(query, params, (err, res) => {
    if (err) {
      console.error('Error creating size:', err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...newSize });
  });
};

// Update size by ID
Size.update = (id, size, result) => {
  const query =
    'UPDATE orders_dev_db.ext_size SET name = ?,code =?, description = ?, status = ?, last_modified_on = ? WHERE id = ? ';
  const params = [
    size.name,
    size.code,
    size.description,
    size.status,
    new Date(),
    id,
  ];
  sql.query(query, params, (err, res) => {
    if (err) {
      console.error('Error updating size:', err);
      result(err, null);
      return;
    }
    if (res.affectedRows === 0) {
      // Not found size with the id
      result({ kind: 'not_found' }, null);
      return;
    }
    result(null, { id: id, ...size });
  });
};

// Delete size by ID
Size.delete = (id, result) => {
  sql.query("UPDATE orders_dev_db.ext_size SET status = 'D' WHERE id = ?",id, (err, res) => {
    if (err) {
      console.error('Error deleting size:', err);
      result(err, null);
      return;
    }
    if (res.affectedRows === 0) {
      // Not found size with the id
      result({ kind: 'not_found' }, null);
      return;
    }
    result(null, res);
  });
};

module.exports = Size;
