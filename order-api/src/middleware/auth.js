const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  if(req.headers.authorization && 
    req.headers.authorization.startsWith('Bearer')){
      let token = req.headers.authorization.split(' ')[1]
      jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
          return res.status(401).send({
            message: 'Unauthorized!'
          });
        }
        let userId = decoded.id;

        User.getUser(userId, (err, user) => {
          if (err) {
            res.status(500).send({"message": "Not authorized, security token issue"});
          } else {
            req.user = user;
            next();
          }
        });
      });
  } else {
      res.status(401).send({"message": "Not authorized, no security token provided"});
  }
};

const verifyOptionalPublicToken = (req, res, next) => {
  if(req.headers.authorization && 
    req.headers.authorization.startsWith('Bearer')){
      let token = req.headers.authorization.split(' ')[1]
      jwt.verify(token, process.env.PUBLIC_SECRET_KEY, (err, decoded) => {
        if (err) {
          return res.status(401).send({
            message: 'Unauthorized!'
          });
        }
        let customerId = decoded.id;

        Customer.getCustomer(customerId, (err, customer) => {
          if (err) {
            res.status(500).send({"message": "Not authorized, security token issue"});
          } else {
            req.customer = customer;
            next();
          }
        });
      });
  } else {
    next();
  }
};

const verifyRequiredPublicToken = (req, res, next) => {
  if(req.headers.authorization && 
    req.headers.authorization.startsWith('Bearer')){
      let token = req.headers.authorization.split(' ')[1]
      jwt.verify(token, process.env.PUBLIC_SECRET_KEY, (err, decoded) => {
        if (err) {
          return res.status(401).send({
            message: 'Unauthorized!'
          });
        }
        let customerId = decoded.id;

        Customer.getCustomer(customerId, (err, customer) => {
          if (err) {
            res.status(500).send({"message": "Not authorized, security token issue"});
          } else {
            req.customer = customer;
            next();
          }
        });
      });
  } else {
      res.status(401).send({"message": "Not authorized, no security token provided"});
  }
};

module.exports = {
  verifyToken, verifyOptionalPublicToken, verifyRequiredPublicToken
}