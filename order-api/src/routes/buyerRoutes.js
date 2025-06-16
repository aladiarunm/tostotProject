const express = require('express');
const router = express.Router();

let buyerData = {
  companyDetails: null,
  companyAddress: null,
  companyContact: null
};

// ✅ POST /api/buyers/company-details
router.post('/company-details', (req, res) => {
  buyerData.companyDetails = req.body;
  res.status(201).json({ message: 'Company details saved successfully', data: buyerData.companyDetails });
});

// ✅ POST /api/buyers/company-address
router.post('/company-address', (req, res) => {
  buyerData.companyAddress = req.body;
  res.status(201).json({ message: 'Company address saved successfully', data: buyerData.companyAddress });
});

// ✅ POST /api/buyers/company-contact
router.post('/company-contact', (req, res) => {
  buyerData.companyContact = req.body;
  res.status(201).json({ message: 'Company contact saved successfully', data: buyerData.companyContact });
});

// ✅ Optional: GET full data (to see what's stored)
router.get('/', (req, res) => {
  res.json(buyerData);
});

module.exports = router;
