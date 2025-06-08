const sql = require('../config/db'); // your configured MySQL connection

// Category constructor
const Category = function (category) {
  this.name = category.name;
  this.description = category.description;
  this.status = category.status;
  this.created_on = category.created_on || new Date();
  this.last_modified_on = category.last_modified_on || new Date();
};

// Get all brands
Category.getAll = (result) => {
  sql.query('SELECT * FROM orders_dev_db.ext_category', (err, res) => {
    if (err) {
      console.error('Error fetching category:', err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

// Create new category
Category.create = (newCategory, result) => {
  const query = 'INSERT INTO ext_category (name, description, status) VALUES (?, ?, ?)';
  const params = [newCategory.name, newCategory.description, newCategory.status];

  sql.query(query, params, (err, res) => {
    if (err) {
      console.error('Error creating category:', err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...newCategory });
  });
};

// Update category by ID
Category.update = (id, category, result) => {
  const query =
    'UPDATE orders_dev_db.ext_category SET name = ?, description = ?, status = ?, last_modified_on = ? WHERE id = ? ';
  const params = [
    category.name,
    category.description,
    category.status,
    new Date(),
    id,
  ];
  sql.query(query, params, (err, res) => {
    if (err) {
      console.error('Error updating category:', err);
      result(err, null);
      return;
    }
    if (res.affectedRows === 0) {
      // Not found category with the id
      result({ kind: 'not_found' }, null);
      return;
    }
    result(null, { id: id, ...category });
  });
};

// Delete category by ID
Category.delete = (id, result) => {
  sql.query('DELETE FROM orders_dev_db.ext_category WHERE id = ?', id, (err, res) => {
    if (err) {
      console.error('Error deleting category:', err);
      result(err, null);
      return;
    }
    if (res.affectedRows === 0) {
      // Not found category with the id
      result({ kind: 'not_found' }, null);
      return;
    }
    result(null, res);
  });
};

module.exports = Category;
