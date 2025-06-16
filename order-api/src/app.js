const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const adminRoutes = require('./routes/admin-Routes');
const brandRoutes = require('./routes/brand-Routes');
const categoryRoutes = require('./routes/category-Routes');
const subCategoryRoutes = require('./routes/subCategory-Routes');
const app = express();

app.options('*', cors());
app.use(cors());

app.use(bodyParser.json());
app.use('/api/admin/', adminRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/category',categoryRoutes);
app.use('/api/subCategory',subCategoryRoutes);

module.exports = app;


// backend code below here added by monoj
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const buyerRoutes = require('./routes/buyerRoutes'); // ✅ Only buyer

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/buyers', buyerRoutes); // ✅ Only buyer route used

module.exports = app;
