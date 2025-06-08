const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const adminRoutes = require('./routes/admin-Routes');
const brandRoutes = require('./routes/brand-Routes');
const categoryRoutes = require('./routes/category-Routes');

const app = express();

app.options('*', cors());
app.use(cors());

app.use(bodyParser.json());
app.use('/api/admin/', adminRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/category',categoryRoutes);

module.exports = app;
