const sql = require('../config/db'); // your configured MySQL connection

// Material constructor
const Material = function (material) {
  this.name = material.name;
  this.code = material.code;
  this.description = material.description;
  this.status = material.status;
  this.created_on = material.created_on || new Date();
  this.last_modified_on = material.last_modified_on || new Date();
};

// Get all materials
Material.getAll = (result) => {
  sql.query('SELECT * FROM orders_dev_db.ext_material', (err, res) => {
    if (err) {
      console.error('Error fetching materials:', err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

// Create new material
Material.create = (newMaterial, result) => {
  const query = 'INSERT INTO ext_material (name, code, description, status) VALUES (?,?,?, ?)';
  const params = [newMaterial.name,newMaterial.code, newMaterial.description, newMaterial.status];

  sql.query(query, params, (err, res) => {
    if (err) {
      console.error('Error creating material:', err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...newMaterial });
  });
};

// Update material by ID
Material.update = (id, material, result) => {
  const query =
    'UPDATE orders_dev_db.ext_material SET name = ?,code =?, description = ?, status = ?, last_modified_on = ? WHERE id = ? ';
  const params = [
    material.name,
    material.code,
    material.description,
    material.status,
    new Date(),
    id,
  ];
  sql.query(query, params, (err, res) => {
    if (err) {
      console.error('Error updating material:', err);
      result(err, null);
      return;
    }
    if (res.affectedRows === 0) {
      // Not found material with the id
      result({ kind: 'not_found' }, null);
      return;
    }
    result(null, { id: id, ...material });
  });
};

// Delete material by ID
Material.delete = (id, result) => {
  sql.query("UPDATE orders_dev_db.ext_material SET status = 'D' WHERE id = ?",id, (err, res) => {
    if (err) {
      console.error('Error deleting material:', err);
      result(err, null);
      return;
    }
    if (res.affectedRows === 0) {
      // Not found material with the id
      result({ kind: 'not_found' }, null);
      return;
    }
    result(null, res);
  });
};

module.exports = Material;
