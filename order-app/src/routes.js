import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import BuyerManagement from './pages/BuyerManagement';
import SellerManagement from './pages/SellerManagement';
//---
import BrandManagement from './pages/BrandManagement';
import CategoryManagement from './pages/CategoryManagement';
import AttributesManagement from './pages/AttributesManagement'
import SubCategoryManagement from './pages/SubCategoryManagement';
import ColorManagement from './pages/ColorManagement';
import SizeManagement from './pages/SizeManagement';
import StyleManagement from './pages/StyleManagement';
import MaterialManagement from './pages/MaterialManagement';
import GenderManagement from './pages/GenderManagement';
import SeasonManagement from './pages/SeasonManagement';
//---
import ProductManagement from './pages/ProductManagement';
import ProductCategory from './pages/ProductManagement/Category';
import ProductType from './pages/ProductManagement/Type';
import ProductStock from './pages/ProductManagement/Stock';
import OrdersReceived from './pages/Orders/Received';
import OrdersGiven from './pages/Orders/Given';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';


const AppRoutes = ({ onLogin }) => {
  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={onLogin} />} />
      <Route path="/" element={<ProtectedRoute />}>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="buyers" element={<BuyerManagement />} />
        <Route path="sellers" element={<SellerManagement />} />

        <Route path="brands" element={<BrandManagement />} />
        <Route path="categories" element={<CategoryManagement />} />

        <Route path="attributes" element={<AttributesManagement />} />
        <Route path="subCategories" element={<SubCategoryManagement />} />
        <Route path="color" element={<ColorManagement />} />
        <Route path="size" element={<SizeManagement />} />
        <Route path="style" element={<StyleManagement />} />
        <Route path="material" element={<MaterialManagement />} />
        <Route path="season" element={<SeasonManagement />} />
        <Route path="gender" element={<GenderManagement />} />

        <Route path="products" element={<ProductManagement />}>
          <Route path="category" element={<ProductCategory />} />
          <Route path="type" element={<ProductType />} />
          <Route path="stock" element={<ProductStock />} />
        </Route>

        <Route path="orders">
          <Route path="received" element={<OrdersReceived />} />
          <Route path="given" element={<OrdersGiven />} />
        </Route>
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;