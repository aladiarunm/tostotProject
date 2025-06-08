const sql = require('../config/db'); // your configured MySQL connection

// Brand constructor
const Brand = function (brand) {
  this.name = brand.name;
  this.description = brand.description;
  this.status = brand.status;
  this.created_on = brand.created_on || new Date();
  this.last_modified_on = brand.last_modified_on || new Date();
};

// Get all brands
Brand.getAll = (result) => {
  sql.query('SELECT * FROM orders_dev_db.ext_brand', (err, res) => {
    if (err) {
      console.error('Error fetching brands:', err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

// Create new brand
Brand.create = (newBrand, result) => {
  const query = 'INSERT INTO ext_brand (name, description, status) VALUES (?, ?, ?)';
  const params = [newBrand.name, newBrand.description, newBrand.status];

  sql.query(query, params, (err, res) => {
    if (err) {
      console.error('Error creating brand:', err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...newBrand });
  });
};

// Update brand by ID
Brand.update = (id, brand, result) => {
  const query =
    'UPDATE orders_dev_db.ext_brand SET name = ?, description = ?, status = ?, last_modified_on = ? WHERE id = ? ';
  const params = [
    brand.name,
    brand.description,
    brand.status,
    new Date(),
    id,
  ];
  sql.query(query, params, (err, res) => {
    if (err) {
      console.error('Error updating brand:', err);
      result(err, null);
      return;
    }
    if (res.affectedRows === 0) {
      // Not found brand with the id
      result({ kind: 'not_found' }, null);
      return;
    }
    result(null, { id: id, ...brand });
  });
};

// Delete brand by ID
Brand.delete = (id, result) => {
  sql.query('DELETE FROM orders_dev_db.ext_brand WHERE id = ?', id, (err, res) => {
    if (err) {
      console.error('Error deleting brand:', err);
      result(err, null);
      return;
    }
    if (res.affectedRows === 0) {
      // Not found brand with the id
      result({ kind: 'not_found' }, null);
      return;
    }
    result(null, res);
  });
};

module.exports = Brand;
