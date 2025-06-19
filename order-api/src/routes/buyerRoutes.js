const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// ✅ POST: Create new buyer (company + contact)
router.post('/company-contact', async (req, res) => {
  const connection = await pool.promise().getConnection();
  await connection.beginTransaction();

  try {
    console.log("📥 Received buyer data:", req.body);

    const {
      companyName,
      companyType,
      website,
      verified_by_id,
      firstName,
      lastName,
      username,
      password,
      email,
      phone,
      role,
      status
    } = req.body;

    if (!companyName || !firstName || !lastName || !username) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // 1. Insert into ext_buyer_company
    const [companyResult] = await connection.query(
      `INSERT INTO ext_buyer_company (name, type, website, verified_by_id)
       VALUES (?, ?, ?, ?)`,
      [companyName, companyType, website, verified_by_id]
    );

    const companyId = companyResult.insertId;

    // 2. Insert into ext_buyer_contact
    const [contactResult] = await connection.query(
      `INSERT INTO ext_buyer_contact
        (company_id, username, first_name, last_name, phone, email, password, company_name, role, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        companyId,
        username,
        firstName,
        lastName,
        phone,
        email,
        password,
        companyName,
        role,
        status
      ]
    );

    const contactId = contactResult.insertId;

    await connection.commit();

    // 3. Fetch and return contact
    const [rows] = await pool.promise().query(
      `SELECT 
        id,
        username AS u_name,
        first_name AS f_name,
        last_name AS l_name,
        phone,
        email,
        role,
        status AS a_status,
        company_name,
        company_id,
        password
      FROM ext_buyer_contact WHERE id = ?`,
      [contactId]
    );

    res.status(201).json({ message: 'Buyer created successfully', buyer: rows[0] });

  } catch (err) {
    await connection.rollback();
    console.error('❌ Error inserting buyer with company:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    connection.release();
  }
});

// ✅ GET: Fetch all buyers
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.promise().query(`
      SELECT 
        id,
        username AS u_name,
        first_name AS f_name,
        last_name AS l_name,
        phone,
        email,
        role,
        status AS a_status,
        company_name,
        company_id,
        password
      FROM ext_buyer_contact
      ORDER BY id DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error('❌ Error fetching buyers:', err);
    res.status(500).json({ message: 'Error fetching buyers' });
  }
});

// ✅ PUT: Update buyer by ID
router.put('/:id', async (req, res) => {
  const buyerId = req.params.id;
  const {
    firstName,
    lastName,
    email,
    phone,
    role,
    status
  } = req.body;

  try {
    const [result] = await pool.promise().query(
      `UPDATE ext_buyer_contact
       SET first_name = ?, last_name = ?, email = ?, phone = ?, role = ?, status = ?,
           username = ?, company_name = ?
       WHERE id = ?`,
      [
        firstName,
        lastName,
        email,
        phone,
        role,
        status,
        `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
        `${firstName} ${lastName}`,
        buyerId
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Buyer not found' });
    }

    const [updatedRows] = await pool.promise().query(
      `SELECT 
        id,
        username AS u_name,
        first_name AS f_name,
        last_name AS l_name,
        phone,
        email,
        role,
        status AS a_status,
        company_name,
        company_id,
        password
      FROM ext_buyer_contact WHERE id = ?`,
      [buyerId]
    );

    res.json({ message: 'Buyer updated successfully', buyer: updatedRows[0] });

  } catch (err) {
    console.error('❌ Error updating buyer:', err);
    res.status(500).json({ message: 'Error updating buyer' });
  }
});

// ✅ DELETE: Remove buyer by ID
router.delete('/:id', async (req, res) => {
  const buyerId = req.params.id;

  try {
    const [result] = await pool.promise().query(
      'DELETE FROM ext_buyer_contact WHERE id = ?',
      [buyerId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Buyer not found' });
    }

    res.json({ message: 'Buyer deleted successfully' });

  } catch (err) {
    console.error('❌ Error deleting buyer:', err);
    res.status(500).json({ message: 'Error deleting buyer' });
  }
});

module.exports = router;