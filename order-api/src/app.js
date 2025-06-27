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
const materialRoutes = require('./routes/material-Routes');
const seasonRoutes = require('./routes/season-Routes')
const genderRoutes = require('./routes/gender-Routes')
//pravin team
const buyerRoutes = require('./routes/buyerRoutes');
const sellerRoutes = require('./routes/sellerRoutes.js');

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
app.use('/api/materials',materialRoutes);
app.use('/api/seasons',seasonRoutes);
app.use('/api/genders',genderRoutes);
//pravin team
app.use('/api/buyers', buyerRoutes);
app.use('/api/sellers', sellerRoutes);

module.exports = app;

