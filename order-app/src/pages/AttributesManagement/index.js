import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaSitemap, FaCertificate, FaPalette, FaRulerCombined } from 'react-icons/fa';
//import {FiTag, FiGrid} from 'react-icons/fi'
import { TbLayoutGridAdd } from "react-icons/tb";

const Attributes = () => {
  const navigate = useNavigate();

  const attributes = [
    {
      name: 'Category',
      icon: <TbLayoutGridAdd size={50} />,
      route: '/categories',
    },
    {
      name: 'Sub Category',
      icon: <FaSitemap size={50} />,
      route: '/subcategories',
    },
    {
      name: 'Brand',
      icon: <FaCertificate size={50} />,
      route: '/brands',
    },
    {
      name: 'Color',
      icon: <FaPalette size={50} />,
      route: '/color',
    },
    {
      name: 'Size',
      icon: <FaRulerCombined size={50} />,
      route: '/size',
    },
  ];

  return (
    <Container className="py-4">
      <h3 className="mb-4">Admin Panel</h3>
      <Row className="text-center">
        {attributes.map((attr, idx) => (
          <Col key={idx} md={2} sm={4} xs={6} className="mb-4">
            <Card
              onClick={() => navigate(attr.route)}
              style={{ cursor: 'pointer', padding: '20px' }}
              className="h-100 shadow-sm"
            >
              <div className="mb-2 ">{attr.icon}</div>
              <strong>{attr.name}</strong>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Attributes;


// import {FiTag, FiGrid} from 'react-icons/fi'



// function AttributesManager(){
//     const menuItems = [
//         {
//         name: 'Brands',
//         icon: <FiTag/>,
//         path: '/brands'
//         },
//         {
//         name: 'Categories',
//         icon: <FiGrid />,
//         path: '/categories'
//         },
//     ]

//     return (
//         <>
        
//         </>
//     )
// }
// export default AttributesManager