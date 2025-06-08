const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
require('dotenv').config();

exports.adminLogin = async (req, res) => {
  User.adminLogin(req.body.username, (err, user) => {
    if (err) {
      if (err.kind === 'not_found') {
        return res.status(404).send({
          message: `User not found with username ${req.body.username}.`
        });
      }
      return res.status(500).send({
        message: 'Error retrieving User with username ' + req.body.username
      });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    // console.log('Input password:', req.body.password);
    // console.log('Stored (hashed) password:', user.password);
    // console.log('Password is valid:', bcrypt.compareSync(req.body.password, user.password));
    
    // const hashedPassword =  bcrypt.hash("admin123", 10);
    // console.log(hashedPassword);


    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: 'Invalid Password!'
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
      expiresIn: 86400 // 24 hours
    });

    delete user.password;
    res.status(200).send({
      accessToken: token, 
      user: user
    });

  });
};

exports.getUser = (req, res) => {
  User.getUser(req.params.id, (err, user) => {
    if (err) {
      if (err.kind === 'not_found') {
        return res.status(404).send({
          message: `Not found User with username ${req.body.username}.`
        });
      }
      return res.status(500).send({
        message: 'Error retrieving User with username ' + req.body.username
      });
    }
    res.status(200).send(user);
  });
};

exports.createUser = (req, res) => {
  User.create(req.body, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the User.'
      });
    else res.status(200).send(data);
  });
};  

exports.updateUser = (req, res) => {
  User.update(req.body, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Some error occurred while updating the User.'
      });
    else res.status(200).send('OK');
  });
};  

exports.updatePassword = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10); // Hash the password with a salt round of 10
  const user = {
    password:hashedPassword,
    id: req.params.id
  };
  User.updatePassword(user, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Some error occurred while updating the User.'
      });
    else res.status(200).send('OK');
  });
};  