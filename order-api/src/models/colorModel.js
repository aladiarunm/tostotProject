const sql = require('../config/db'); // your configured MySQL connection

// Color constructor
const Color = function (color) {
  this.name = color.name;
  this.code = color.code;
  this.description = color.description;
  this.status = color.status;
  this.created_on = color.created_on || new Date();
  this.last_modified_on = color.last_modified_on || new Date();
};

// Get all colors
Color.getAll = (result) => {
  sql.query('SELECT * FROM orders_dev_db.ext_color', (err, res) => {
    if (err) {
      console.error('Error fetching colors:', err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

// Create new color
Color.create = (newColor, result) => {
  const query = 'INSERT INTO ext_color (name, code, description, status) VALUES (?,?,?, ?)';
  const params = [newColor.name,newColor.code, newColor.description, newColor.status];

  sql.query(query, params, (err, res) => {
    if (err) {
      console.error('Error creating color:', err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...newColor });
  });
};

// Update color by ID
Color.update = (id, color, result) => {
  const query =
    'UPDATE orders_dev_db.ext_color SET name = ?,code =?, description = ?, status = ?, last_modified_on = ? WHERE id = ? ';
  const params = [
    color.name,
    color.code,
    color.description,
    color.status,
    new Date(),
    id,
  ];
  sql.query(query, params, (err, res) => {
    if (err) {
      console.error('Error updating color:', err);
      result(err, null);
      return;
    }
    if (res.affectedRows === 0) {
      // Not found color with the id
      result({ kind: 'not_found' }, null);
      return;
    }
    result(null, { id: id, ...color });
  });
};

// Delete color by ID
Color.delete = (id, result) => {
  sql.query("UPDATE orders_dev_db.ext_color SET status = 'D' WHERE id = ?",id, (err, res) => {
    if (err) {
      console.error('Error deleting color:', err);
      result(err, null);
      return;
    }
    if (res.affectedRows === 0) {
      // Not found color with the id
      result({ kind: 'not_found' }, null);
      return;
    }
    result(null, res);
  });
};

module.exports = Color;
