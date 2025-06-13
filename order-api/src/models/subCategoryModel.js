const sql = require('../config/db'); // your configured MySQL connection

// Category constructor
const subCategory = function (subCategory) {
  this.category_id = subCategory.id;
  this.category_name = subCategory.category_name;
  this.name = subCategory.name;
  this.description = subCategory.description;
  this.status = subCategory.status;
  this.created_on = subCategory.created_on || new Date();
  this.last_modified_on = subCategory.last_modified_on || new Date();
};

// Get all brands
subCategory.getAll = (id, result) => {
  let query;
  let params = [];

  if (id == '0') {
    query = 'SELECT sc.id, c.name AS category_name,sc.name AS name,sc.description,sc.status,sc.created_on,sc.last_modified_on FROM orders_dev_db.ext_sub_category sc JOIN orders_dev_db.ext_category c ON sc.category_id = c.id';
  } else {
    query = "SELECT * FROM orders_dev_db.ext_sub_category WHERE category_id = ?";
    params = [id];
  }

  sql.query(query, params, (err, res) => {
    if (err) {
      console.error('Error fetching subcategories:', err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

// Create new category
subCategory.create = (id,newCategory, result) => {
  const query = 'INSERT INTO orders_dev_db.ext_sub_category (category_id,name,description,status) VALUES (? ,?, ?, ?)';
  const params = [id,newCategory.name, newCategory.description, newCategory.status];

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
subCategory.update = (id, category, result) => {
  const query =
    'UPDATE orders_dev_db.ext_sub_category SET name = ?, description = ?, status = ?, last_modified_on = ? WHERE id = ? ';
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
subCategory.delete = (id, result) => {
  sql.query("UPDATE orders_dev_db.ext_sub_category SET status = 'D' WHERE id = ?", id, (err, res) => {
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

module.exports = subCategory;
