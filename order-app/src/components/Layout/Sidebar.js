import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, FiUsers, FiShoppingBag, /*FiPackage, 
  FiShoppingCart, FiTruck,*/ FiSettings,FiUser,
  FiChevronLeft, FiChevronRight,/*FiTag, FiGrid,*/FiList 
} from 'react-icons/fi';
import { Accordion, Nav } from 'react-bootstrap';
//import { FaSitemap, FaCertificate, FaPalette, FaRulerCombined } from 'react-icons/fa';
//import { TbLayoutGridAdd } from "react-icons/tb";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    {
      name: 'Dashboard',
      icon: <FiHome />,
      path: '/'
    },
    {
      name: 'Buyers',
      icon: <FiUsers />,
      path: '/buyers'
    },
    {
      name: 'Sellers',
      icon: <FiUsers />,
      path: '/sellers'
    },
    // {
    //   name: 'Brands',
    //   icon: <FiTag/>,
    //   path: '/brands'
    // },
    // {
    //   name: 'Categories',
    //   icon: <FiGrid />,
    //   path: '/categories'
    // },
    {
      name: 'Attributes',
      icon: <FiList />,
      path: '/attributes',
    },
    {
      name: 'Products',
      icon: <FiShoppingBag />,
      path: '/products'
    },
    /*{
      name: 'Types',
      icon: <FiShoppingBag />,
      path: '/products/type'
    },
    {
      name: 'Categories',
      icon: <FiShoppingBag />,
      path: '/products/category'
    },*
    // {
    //   name: 'Product Management',
    //   icon: <FiShoppingBag />,
    //   path: '/products',
    //   subItems: [
    //     { name: 'Products', path: '/products' },
    //     { name: 'Categories', path: '/products/category' },
    //     { name: 'Types', path: '/products/type' },
    //     { name: 'Stock', path: '/products/stock' }
    //   ]
    // },
    // {
    //   name: 'Orders',
    //   icon: <FiPackage />,
    //   path: '/orders',
    //   subItems: [
    //     { name: 'Received', path: '/orders/received' },
    //     { name: 'Given', path: '/orders/given' }
    //   ]
    // },
    /*{
      name: 'Orders - Received',
      icon: <FiPackage />,
      path: '/orders/received'
    },
    {
      name: 'Orders - Placed',
      icon: <FiPackage />,
      path: '/orders/placed'
    },*/
    // {
    //   name: 'Settings',
    //   icon: <FiSettings />,
    //   path: '/settings',
    //   subItems: [
    //     { name: 'Profile', path: '/profile' }
    //   ]
    // }
    {
      name: 'Settings',
      icon: <FiSettings />,
      path: '/settings'
    },
    {
      name: 'Profile',
      icon: <FiUser />,
      path: '/profile'
    },
    
  ];

  return (
    <div 
      className={`d-flex flex-column bg-dark text-white ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}
      style={{
        width: collapsed ? '70px' : '250px',
        minHeight: '100vh',
        transition: 'width 0.3s ease'
      }}
    >
      <div className="p-3 bg-primary d-flex justify-content-between align-items-center">
        {!collapsed && <h4 className="m-0 text-white">Orders App</h4>}
        <button 
          onClick={toggleSidebar}
          className="btn btn-link p-0 text-white"
        >
          {collapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
        </button>
      </div>
      
      <div className="flex-grow-1 overflow-auto">
        <Nav variant="pills" className="flex-column">
          {menuItems.map((item, index) => (
            item.subItems ? (
              <Accordion key={index} flush className="bg-dark">
                <Accordion.Item eventKey={index.toString()} className="border-0">
                  <Accordion.Header className={`p-2 ps-3 text-white bg-dark ${collapsed ? 'justify-content-center' : ''}`}>
                    <span className={`d-flex align-items-center ${collapsed ? '' : 'me-2'}`}>
                      {item.icon}
                    </span>
                    {!collapsed && <span className="me-auto">{item.name}</span>}
                  </Accordion.Header>
                  <Accordion.Body className="p-0 bg-secondary">
                    <Nav className="flex-column">
                      {item.subItems.map((subItem, subIndex) => (
                        <Nav.Link 
                          key={subIndex}
                          as={Link}
                          to={subItem.path}
                          className={`text-white ${collapsed ? 'ps-3' : 'ps-5'} ${
                            location.pathname === subItem.path ? 'active bg-primary' : ''
                          }`}
                          title={collapsed ? subItem.name : ''} // Show tooltip when collapsed
                        >
                          {!collapsed && subItem.name}
                        </Nav.Link>
                      ))}
                    </Nav>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            ) : (
              <Nav.Link
                key={index}
                as={Link}
                to={item.path}
                className={`text-white ${location.pathname === item.path ? 'active bg-secondary' : ''}`}
                title={collapsed ? item.name : ''} // Show tooltip when collapsed
              >
                <div className={`d-flex align-items-center ${collapsed ? 'justify-content-center' : ''}`}>
                  <span className={collapsed ? '' : 'me-2'}>
                    {item.icon}
                  </span>
                  {!collapsed && item.name}
                </div>
              </Nav.Link>
            )
          ))}
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;