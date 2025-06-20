const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const app = express();
const adminRoutes = require('./routes/admin-Routes');
const brandRoutes = require('./routes/brand-Routes');
const categoryRoutes = require('./routes/category-Routes');
const subCategoryRoutes = require('./routes/subCategory-Routes');
const colorRoutes = require('./routes/color-Routes');
const sizeRoutes = require('./routes/size-Routes');
const styleRoutes = require('./routes/style-Routes');
//pravin team
const buyerRoutes = require('./routes/buyerRoutes');

app.options('*', cors());
app.use(cors());
app.use(bodyParser.json());

app.use('/api/admin/', adminRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/category',categoryRoutes);
app.use('/api/subCategory',subCategoryRoutes);
app.use('/api/colors',colorRoutes);
app.use('/api/sizes',sizeRoutes);
app.use('/api/styles',styleRoutes);
//pravin team
app.use('/api/buyers', buyerRoutes);

module.exports = app;

