const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = function(user) {};

User.adminLogin = (username, result) => {
  var userAccount = null;
  const query = `SELECT id, password, username, first_name, last_name, phone, email, role FROM int_user WHERE username = ? and status = ? `;
  const values = [ username, 'A' ];
  db.query(query, values, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }
    if (res.length) {
      userAccount = {};
      userAccount['id'] = res[0].id;
      userAccount['password'] = res[0].password;
      userAccount['username'] = res[0].username;
      userAccount['firstName'] = res[0].first_name;
      userAccount['lastName'] = res[0].last_name;
      userAccount['role'] = res[0].role;
      userAccount['email'] = res[0].email;
      userAccount['phone'] = res[0].phone;
      result(null, userAccount);
      return;
    }
    result({ kind: 'not_found' }, null);
  });
};

User.getUser = (id, result) => {
    var userAccount = null;
    const query = 
      `SELECT 
        A.username, A.first_name, A.last_name, A.phone, A.email, A.role, A.status
      FROM int_user A
      WHERE A.id = ? `;
    const values = [ id ];

    db.query(query, values, (err, res) => {
      if (err) {
          console.log('error: ', err);
          result(err, null);
          return;
      }
      if (res.length) {
          userAccount = {};
          userAccount['id'] = id;
          userAccount['username'] = res[0].username;
          userAccount['firstName'] = res[0].first_name;
          userAccount['lastName'] = res[0].last_name;
          userAccount['role'] = res[0].role;
          userAccount['password'] = res[0].password;
          userAccount['email'] = res[0].email;
          userAccount['phone'] = res[0].phone;
          userAccount['status'] = res[0].status;
          result(null, userAccount);
          return;
      }
      result({ kind: 'not_found' }, null);
    });
};

User.create = async (newUser, result) => {
  try {
    const hashedPassword = await bcrypt.hash(newUser.password, 10); // Hash the password with a salt round of 10
    const query = 
        `INSERT INTO user (username, first_name, last_name, phone, email, password, role_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [
        newUser.username, newUser.firstName, newUser.lastName, 
        newUser.phone, newUser.email, hashedPassword, newUser.roleId 
    ];

    db.query(query, values, (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(err, null);
        return;
      }
      result(null, { id: res.insertId, ...newUser });
    });
  } catch (err) {
    result(err, null);
  }
};

User.update = async (user, result) => {
  try {
    const query = `
      UPDATE int_user 
      SET first_name = ?, last_name = ?, phone = ?, email = ?, role = ?
      WHERE id = ?
    `;
    const values = [
        user.firstName, user.lastName, 
        user.phone, user.email, user.role, user.id
    ];

    db.query(query, values, (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(err, null);
        return;
      }
      result(null, null);
    });
  } catch (err) {
    result(err, null);
  }
};

User.updatePassword = async (user, result) => {
  try {
    const query = `UPDATE int_user SET password = ? WHERE id = ?`;
    const values = [
        user.password, user.id
    ];

    db.query(query, values, (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(err, null);
        return;
      }
      result(null, null);
    });
  } catch (err) {
    result(err, null);
  }
};

module.exports = User;
