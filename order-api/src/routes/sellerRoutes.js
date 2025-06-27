const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// ✅ POST: Create new seller (company + contact)
router.post('/company-contact', async (req, res) => {
  const connection = await pool.promise().getConnection();
  await connection.beginTransaction();

  try {
    console.log("📥 Received seller data:", req.body);

    let {
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
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields',
        required: ['companyName', 'firstName', 'lastName', 'username']
      });
    }

    // Check if username already exists
    const [existingUser] = await pool.promise().query(
      'SELECT id, username FROM ext_seller_contact WHERE username = ?',
      [username]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Username already exists',
        field: 'username',
        suggestion: `Try: ${username}${Math.floor(Math.random() * 1000)}`
      });
    }

    // Check if email already exists (optional)
    const [existingEmail] = await pool.promise().query(
      'SELECT id, email FROM ext_seller_contact WHERE email = ?',
      [email]
    );

    if (existingEmail.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists',
        field: 'email'
      });
    }

    // ✅ Option 2: Assign a default verifier if not passed
    if (!verified_by_id) {
      verified_by_id = 1; // Default to system/admin user
    }

    // 1. Insert into ext_seller_company
    const [companyResult] = await connection.query(
      `INSERT INTO ext_seller_company (name, type, website, verified_by_id)
       VALUES (?, ?, ?, ?)`,
      [companyName, companyType, website, verified_by_id]
    );

    const companyId = companyResult.insertId;

    // 2. Insert into ext_seller_contact (skip role temporarily)
    const [contactResult] = await connection.query(
      `INSERT INTO ext_seller_contact
        (company_id, username, first_name, last_name, phone, email, password, company_name, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        companyId,
        username,
        firstName,
        lastName,
        phone,
        email,
        password,
        companyName,
        status
      ]
    );

    const contactId = contactResult.insertId;

    await connection.commit();

    // 3. Fetch the created contact with all details
    const [rows] = await pool.promise().query(
      `SELECT 
        c.id,
        c.username AS u_name,
        c.first_name AS f_name,
        c.last_name AS l_name,
        c.phone,
        c.email,
        c.role,
        c.status AS a_status,
        c.company_name,
        c.company_id,
        c.password,
        comp.name as company_full_name,
        comp.type as company_type,
        comp.website as company_website
      FROM ext_seller_contact c
      LEFT JOIN ext_seller_company comp ON c.company_id = comp.id
      WHERE c.id = ?`,
      [contactId]
    );

    console.log("✅ Created seller:", rows[0]);

    // Add cache-busting headers
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    res.status(201).json({ 
      success: true,
      message: 'Seller created successfully', 
      seller: rows[0],
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    await connection.rollback();
    console.error('❌ Error inserting seller with company:', err);
    
    // Handle specific database errors
    if (err.code === 'ER_DUP_ENTRY') {
      const field = err.sqlMessage.includes('username') ? 'username' : 
                   err.sqlMessage.includes('email') ? 'email' : 'unknown field';
      
      return res.status(409).json({
        success: false,
        message: `Duplicate ${field} - ${field} already exists`,
        field: field,
        suggestion: field === 'username' ? `Try: ${username}${Math.floor(Math.random() * 1000)}` : null
      });
    }
    
    if (err.code === 'WARN_DATA_TRUNCATED') {
      return res.status(400).json({
        success: false,
        message: 'Data validation error: One or more fields exceed allowed length',
        details: err.sqlMessage
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Failed to create seller',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  } finally {
    connection.release();
  }
});

// ✅ GET: Fetch all sellers with better data structure (FIXED)
router.get('/', async (req, res) => {
  try {
    console.log("📋 Fetching all sellers...");
    
    const [rows] = await pool.promise().query(`
      SELECT 
        c.id,
        c.username AS u_name,
        c.first_name AS f_name,
        c.last_name AS l_name,
        c.phone,
        c.email,
        c.role,
        c.status AS a_status,
        c.company_name,
        c.company_id,
        c.password,
        comp.name as company_full_name,
        comp.type as company_type,
        comp.website as company_website
      FROM ext_seller_contact c
      LEFT JOIN ext_seller_company comp ON c.company_id = comp.id
      ORDER BY c.id DESC
    `);

    console.log(`✅ Found ${rows.length} sellers`);

    // Add cache-busting headers
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    res.json({
      success: true,
      count: rows.length,
      data: rows,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error('❌ Error fetching sellers:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching sellers',
      error: err.message
    });
  }
});

// ✅ GET: Fetch single seller by ID
router.get('/:id', async (req, res) => {
  const sellerId = req.params.id;
  
  try {
    const [rows] = await pool.promise().query(`
      SELECT 
        c.id,
        c.username AS u_name,
        c.first_name AS f_name,
        c.last_name AS l_name,
        c.phone,
        c.email,
        c.role,
        c.status AS a_status,
        c.company_name,
        c.company_id,
        c.password,
        comp.name as company_full_name,
        comp.type as company_type,
        comp.website as company_website
      FROM ext_seller_contact c
      LEFT JOIN ext_seller_company comp ON c.company_id = comp.id
      WHERE c.id = ?
    `, [sellerId]);

    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Seller not found' 
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });

  } catch (err) {
    console.error('❌ Error fetching seller:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching seller',
      error: err.message
    });
  }
});

// ✅ PUT: Update seller by ID (FIXED)
router.put('/:id', async (req, res) => {
  const sellerId = req.params.id;
  const {
    firstName,
    lastName,
    email,
    phone,
    role,
    status
  } = req.body;

  try {
    // Check if seller exists first
    const [existingRows] = await pool.promise().query(
      'SELECT id FROM ext_seller_contact WHERE id = ?',
      [sellerId]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Seller not found' 
      });
    }

    // Update seller - removed updated_at = NOW() since column doesn't exist
    const [result] = await pool.promise().query(
      `UPDATE ext_seller_contact
       SET first_name = ?, last_name = ?, email = ?, phone = ?, status = ?,
           username = ?, company_name = ?
       WHERE id = ?`,
      [
        firstName,
        lastName,
        email,
        phone,
        status,
        `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
        `${firstName} ${lastName}`,
        sellerId
      ]
    );

    // Fetch updated seller
    const [updatedRows] = await pool.promise().query(`
      SELECT 
        c.id,
        c.username AS u_name,
        c.first_name AS f_name,
        c.last_name AS l_name,
        c.phone,
        c.email,
        c.role,
        c.status AS a_status,
        c.company_name,
        c.company_id,
        c.password,
        comp.name as company_full_name,
        comp.type as company_type,
        comp.website as company_website
      FROM ext_seller_contact c
      LEFT JOIN ext_seller_company comp ON c.company_id = comp.id
      WHERE c.id = ?
    `, [sellerId]);

    console.log("✅ Updated seller:", updatedRows[0]);

    res.json({ 
      success: true,
      message: 'Seller updated successfully', 
      seller: updatedRows[0]
    });

  } catch (err) {
    console.error('❌ Error updating seller:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error updating seller',
      error: err.message
    });
  }
});

// ✅ DELETE: Remove seller by ID
// ✅ DELETE: Remove seller by ID
router.delete('/:id', async (req, res) => {
  const sellerId = req.params.id;

  try {
    // 1. Check if seller exists
    const [existingRows] = await pool.promise().query(
      'SELECT id, company_id FROM ext_seller_contact WHERE id = ?',
      [sellerId]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Seller not found' 
      });
    }

    const companyId = existingRows[0].company_id;

    // 2. Delete seller
    await pool.promise().query(
      'DELETE FROM ext_seller_contact WHERE id = ?',
      [sellerId]
    );

    // 3. Check if any other sellers reference the company
    const [companySellers] = await pool.promise().query(
      'SELECT COUNT(*) as count FROM ext_seller_contact WHERE company_id = ?',
      [companyId]
    );

    // 4. If no other sellers use the company, delete related data and the company
    if (companySellers[0].count === 0) {
      // 🔴 First delete addresses related to the company (to satisfy foreign key constraint)
      await pool.promise().query(
        'DELETE FROM ext_seller_company_address WHERE company_id = ?',
        [companyId]
      );

      // ✅ Then delete the company itself
      await pool.promise().query(
        'DELETE FROM ext_seller_company WHERE id = ?',
        [companyId]
      );

      console.log(`🗑️ Deleted orphaned company and its address for company ID: ${companyId}`);
    }

    console.log(`✅ Deleted seller with ID: ${sellerId}`);

    res.json({ 
      success: true,
      message: 'Seller deleted successfully' 
    });

  } catch (err) {
    console.error('❌ Error deleting seller:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error deleting seller',
      error: err.message
    });
  }
});

// ✅ Additional endpoint to refresh/sync data (FIXED)
router.post('/refresh', async (req, res) => {
  try {
    const [rows] = await pool.promise().query(`
      SELECT 
        c.id,
        c.username AS u_name,
        c.first_name AS f_name,
        c.last_name AS l_name,
        c.phone,
        c.email,
        c.role,
        c.status AS a_status,
        c.company_name,
        c.company_id,
        c.password,
        comp.name as company_full_name,
        comp.type as company_type,
        comp.website as company_website
      FROM ext_seller_contact c
      LEFT JOIN ext_seller_company comp ON c.company_id = comp.id
      ORDER BY c.id DESC
    `);

    res.json({
      success: true,
      message: 'Data refreshed successfully',
      count: rows.length,
      data: rows,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error('❌ Error refreshing data:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error refreshing data',
      error: err.message
    });
  }
});

module.exports = router;