const sql = require('../config/db'); // your configured MySQL connection

// Style constructor
const Style = function (style) {
  this.name = style.name;
  this.code = style.code;
  this.description = style.description;
  this.status = style.status;
  this.created_on = style.created_on || new Date();
  this.last_modified_on = style.last_modified_on || new Date();
};

// Get all styles
Style.getAll = (result) => {
  sql.query('SELECT * FROM orders_dev_db.ext_style', (err, res) => {
    if (err) {
      console.error('Error fetching styles:', err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

// Create new style
Style.create = (newStyle, result) => {
  const query = 'INSERT INTO ext_style (name, code, description, status) VALUES (?,?,?, ?)';
  const params = [newStyle.name,newStyle.code, newStyle.description, newStyle.status];

  sql.query(query, params, (err, res) => {
    if (err) {
      console.error('Error creating style:', err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...newStyle });
  });
};

// Update style by ID
Style.update = (id, style, result) => {
  const query =
    'UPDATE orders_dev_db.ext_style SET name = ?,code =?, description = ?, status = ?, last_modified_on = ? WHERE id = ? ';
  const params = [
    style.name,
    style.code,
    style.description,
    style.status,
    new Date(),
    id,
  ];
  sql.query(query, params, (err, res) => {
    if (err) {
      console.error('Error updating style:', err);
      result(err, null);
      return;
    }
    if (res.affectedRows === 0) {
      // Not found style with the id
      result({ kind: 'not_found' }, null);
      return;
    }
    result(null, { id: id, ...style });
  });
};

// Delete style by ID
Style.delete = (id, result) => {
  sql.query("UPDATE orders_dev_db.ext_style SET status = 'D' WHERE id = ?",id, (err, res) => {
    if (err) {
      console.error('Error deleting style:', err);
      result(err, null);
      return;
    }
    if (res.affectedRows === 0) {
      // Not found style with the id
      result({ kind: 'not_found' }, null);
      return;
    }
    result(null, res);
  });
};

module.exports = Style;
