import React from 'react';
import { FiLogOut, FiUser, FiBell, FiSettings } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Dropdown, Container, Badge } from 'react-bootstrap';

const Topbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <Navbar bg="info" expand="lg" className="shadow-sm">
      <Container fluid>
        <Navbar.Brand href="#">Admin Panel</Navbar.Brand>
        <Navbar.Toggle aria-controls="topbar-nav" />
        <Navbar.Collapse id="topbar-nav" className="justify-content-end">
          <Nav className="align-items-center">
            {/* <Nav.Link className="position-relative">
              <FiBell size={20} />
              <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">
                3
              </Badge>
            </Nav.Link> */}
            
            <Dropdown align="end">
              <Dropdown.Toggle variant="light" id="dropdown-user" className="d-flex align-items-center">
                <div className="me-2 text-end">
                  <div className="fw-bold">{user?.firstName + ' ' + user?.lastName}</div>
                  {/* <div className="small text-muted">{user?.role}</div> */}
                </div>
                <div className="bg-primary text-white rounded-circle p-2" style={{ width: '40px', height: '40px' }}>
                  <FiUser />
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => navigate('/profile')}>
                  <FiUser className="me-2" /> Profile
                </Dropdown.Item>
                <Dropdown.Item onClick={() => navigate('/settings')}>
                  <FiSettings className="me-2" /> Settings
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>
                  <FiLogOut className="me-2" /> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Topbar;