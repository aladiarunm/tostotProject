
import '../../styles/button.css';
import React, { useState, useMemo,useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Table, Modal, InputGroup } from 'react-bootstrap';
import { orderBy } from 'lodash';

const Buyer = () => {
  const [formData, setFormData] = useState({
    userName: '', email: '', phone: '', role: '', status: ''
  });

  const [companyDetails, setCompanyDetails] = useState({
    name: '', type: '', website: '', status: 'A'
  });

  const [companyAddress, setCompanyAddress] = useState({
    address: '', phone: '', state: '', zipcode: '', country: '', email: '', status: 'A'
  });

  const [companyContact, setCompanyContact] = useState({
    firstName: '', lastName: '', location: '', email: '', username: '', password: '', status: 'A', phone: '', role: 'user' // Added role field with default value
  });

  // Edit form state - simplified
  const [editFormData, setEditFormData] = useState({
    id: null,
    u_name: '',
    f_name: '',
    l_name: '',
    phone: '',
    email: '',
    role: '',
    a_status: 'A'
  }); 
  const [buyers, setBuyers] = useState([
    
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('u_name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [formStep, setFormStep] = useState(1);
  useEffect(() => {
  const fetchBuyers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/buyers');
      const data = await response.json();
      setBuyers(data); // Assuming backend returns array
    } catch (error) {
      console.error('Failed to fetch buyers', error);
    }
  };

  fetchBuyers();
}, []);

  const filteredData = useMemo(() => {
    const filtered = buyers.filter(item => 
      Object.values(item).some(val => 
        val.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    return orderBy(filtered, [sortField], [sortOrder]);
  }, [buyers, searchQuery, sortField, sortOrder]);

  const handleSort = (field) => {
    setSortOrder(sortField === field ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc');
    setSortField(field);
  };

  const handleChange = (stateSetter) => (e) => {
    stateSetter(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditFormChange = (e) => {
    setEditFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const renderFormSection = (title, state, setState, fields, stepNumber, isEnabled = true) => (
    <Card className={`mb-4 ${!isEnabled ? 'opacity-50' : ''}`}>
      <Card.Body>
        <Card.Title className="text-center mb-4">{title}</Card.Title>
        <Row>
          {fields.map(({ label, name, type, options }) => (
            <Col md={type === 'radio-group' ? 12 : 6} key={name} className="mb-3">
              <Form.Label>{label}</Form.Label>
              {type === 'radio-group' ? (
                <div className="d-flex gap-3">
                  {['A', 'I'].map((val) => (
                    <Form.Check
                      inline
                      key={`${name}-${val}-${stepNumber}`}
                      label={val === 'A' ? 'Active' : 'Inactive'}
                      name={`${name}-${stepNumber}`} // Made name unique per section
                      type="radio"
                      id={`${name}-${val}-${stepNumber}`}
                      value={val}
                      checked={state[name] === val}
                      onChange={(e) => {
                        setState(prev => ({ ...prev, [name]: e.target.value }));
                      }}
                      disabled={!isEnabled}
                    />
                  ))}
                </div>
              ) : type === 'select' ? (
                <Form.Select
                  name={name}
                  value={state[name] || ''}
                  onChange={handleChange(setState)}
                  disabled={!isEnabled}
                >
                  <option value="">Select {label}</option>
                  {options.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              ) : name === 'website' ? (
                <InputGroup>
                  <Form.Control
                    type="text"
                    name={name}
                    value={state[name] || ''}
                    onChange={handleChange(setState)}
                    disabled={!isEnabled}
                  />
                  <Button
                    variant="outline-primary"
                    onClick={() => {
                      const url = state[name];
                      if (url) {
                        const fullUrl = url.startsWith('http') ? url : `https://${url}`;
                        window.open(fullUrl, '_blank');
                      } else {
                        alert('Please enter a website URL first.');
                      }
                    }}
                    disabled={!isEnabled}
                  >
                    Browse
                  </Button>
                </InputGroup>
              ) : (
                <Form.Control
                  type={type}
                  name={name}
                  value={state[name] || ''}
                  onChange={handleChange(setState)}
                  disabled={!isEnabled}
                />
              )}
            </Col>
          ))}
        </Row>
        <div className="text-center mt-3">
          <Button 
            variant="primary" 
            className="mx-2" 
            onClick={() => handleSectionSave(stepNumber)}
            disabled={!isEnabled}
          >
            Save {title}
          </Button>
          
          <Button 
            variant="secondary" 
            className="mx-2" 
            onClick={handleCancel}
            disabled={!isEnabled}
          >
            Cancel
          </Button>
        </div>
      </Card.Body>
    </Card>
  );

  const renderEditForm = () => (
    <Card className="mb-4" style={{backgroundColor: '#f8f9fa'}}>
      <Card.Body>
        <Card.Title className="mb-4">Edit Buyer</Card.Title>
        <Row>
          <Col md={6} className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="u_name"
              value={editFormData.u_name}
              onChange={handleEditFormChange}
            />
          </Col>
          <Col md={6} className="mb-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="f_name"
              value={editFormData.f_name}
              onChange={handleEditFormChange}
            />
          </Col>
          <Col md={6} className="mb-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="l_name"
              value={editFormData.l_name}
              onChange={handleEditFormChange}
            />
          </Col>
          <Col md={6} className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={editFormData.phone}
              onChange={handleEditFormChange}
            />
          </Col>
          <Col md={6} className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={editFormData.email}
              onChange={handleEditFormChange}
            />
          </Col>
          <Col md={6} className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select
              name="role"
              value={editFormData.role}
              onChange={handleEditFormChange}
            >
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
            </Form.Select>
          </Col>
          <Col md={12} className="mb-3">
            <Form.Label>Status</Form.Label>
            <div className="d-flex gap-3 mt-2">
              <Form.Check
                inline
                label="Active"
                name="edit-a-status"
                type="radio"
                id="edit-status-A"
                value="A"
                checked={editFormData.a_status === 'A'}
                onChange={(e) => {
                  setEditFormData(prev => ({ ...prev, a_status: e.target.value }));
                }}
              />
              <Form.Check
                inline
                label="Inactive"
                name="edit-a-status"
                type="radio"
                id="edit-status-I"
                value="I"
                checked={editFormData.a_status === 'I'}
                onChange={(e) => {
                  setEditFormData(prev => ({ ...prev, a_status: e.target.value }));
                }}
              />
            </div>
          </Col>
        </Row>
        <div className="d-flex justify-content-center gap-2 mt-4">
          <Button 
            variant="success"
            onClick={handleEditSave}
          >
            Update Buyer
          </Button>
          <Button 
            variant="secondary"
            onClick={handleEditCancel}
          >
            Cancel
          </Button>
        </div>
      </Card.Body>
    </Card>
  );

  const handleVerifyBuyer = (buyerId) => {
    setBuyers(prev => prev.map(buyer => 
      buyer.id === buyerId 
        ? { ...buyer, verified: true }
        : buyer
    ));
    alert('Buyer verified successfully!');
  };

  const handleSectionSave = (stepNumber) => {
    switch(stepNumber) {
      case 1:
        alert('Company Details saved successfully');
        setFormStep(2);
        break;
      case 2:
        alert('Company Address saved successfully');
        setFormStep(3);
        break;
      case 3:
        alert('Company Contact saved successfully');
        break;
      default:
        break;
    }
  };
  const handleEditSave = async () => {
  const finalBuyer = {
    firstName: editFormData.f_name,
    lastName: editFormData.l_name,
    email: editFormData.email,
    phone: editFormData.phone,
    role: editFormData.role,
    status: editFormData.a_status
  };

  try {
    const response = await fetch(`http://localhost:3001/api/buyers/${editFormData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalBuyer)
    });

    const result = await response.json();

    if (response.ok) {
      setBuyers(prev =>
        prev.map(b => (b.id === editFormData.id ? result.buyer : b))
      );
      setShowEditForm(false);
      setEditFormData({
        id: null, u_name: '', f_name: '', l_name: '', phone: '', email: '', role: '', a_status: 'A'
      });
      alert('Buyer updated successfully');
    } else {
      alert(result.message || 'Failed to update buyer');
    }
  } catch (error) {
    console.error('Error updating buyer:', error);
    alert('Error while updating buyer');
  }
};

 const handleEdit = (item) => {
  setEditFormData({
    id: item.id,
    u_name: item.u_name,
    f_name: item.f_name,
    l_name: item.l_name,
    phone: item.phone,
    email: item.email,
    role: item.role,
    a_status: item.a_status
  });

  setCompanyContact({
    firstName: item.f_name,
    lastName: item.l_name,
    email: item.email,
    phone: item.phone,
    role: item.role,
    status: item.a_status,
    username: '',
    password: '',
    location: ''
  });

  setFormStep(3);
  setShowForm(true);
  setShowEditForm(true);
  setShowModal(false);
};


  const handleEditCancel = () => {
    setShowEditForm(false);
    setEditFormData({
      id: null, u_name: '', f_name: '', l_name: '', phone: '', email: '', role: '', a_status: 'A'
    });
  };

  const handleSave = async () => {
  const finalBuyer = {
    companyName: companyDetails.name,
    companyType: companyDetails.type,
    website: companyDetails.website,
    verified_by_id: 1, // Replace this with actual user ID if dynamic
    firstName: companyContact.firstName,
    lastName: companyContact.lastName,
    username: companyContact.username,
    password: companyContact.password,
    email: companyContact.email,
    phone: companyContact.phone,
    role: companyContact.role,
    status: companyContact.status
  };
    console.log("🧾 Sending finalBuyer to backend:", finalBuyer);
  try {
    const response = await fetch(`http://localhost:3001/api/buyers/company-contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(finalBuyer)
    });

    const result = await response.json();

    if (response.ok) {
      setBuyers(prev => [...prev, result.buyer]);
      alert('Buyer created successfully!');
      handleCancel();
    } else {
      alert(result.message || 'Failed to save buyer');
    }
  } catch (error) {
    console.error('Error saving buyer:', error);
    alert('Network or server error occurred.');
  }
};



  const handleCancel = () => {
  setFormData({ userName: '', email: '', phone: '', role: '', status: '' });
  setCompanyDetails({ name: '', type: '', website: '', status: 'A' });
  setCompanyAddress({ address: '', phone: '', state: '', zipcode: '', country: '', email: '', status: 'A' });
  setCompanyContact({ firstName: '', lastName: '', location: '', email: '', username: '', password: '', status: 'A', phone: '', role: 'user' });
  setFormStep(1);
  setShowForm(false);
  setEditFormData({ id: null, u_name: '', f_name: '', l_name: '', phone: '', email: '', role: '', a_status: 'A' });
};

  const handleDelete = async (buyer) => {
  if (!window.confirm(`Are you sure you want to delete buyer "${buyer.u_name}"?`)) return;

  try {
    const response = await fetch(`http://localhost:3001/api/buyers/${buyer.id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setBuyers(prev => prev.filter(b => b.id !== buyer.id));
    } else {
      console.error('Failed to delete buyer');
    }
  } catch (error) {
    console.error('Error deleting buyer:', error);
  }
};

  return (
    <Container className="py-4">
      <Card>
        <Card.Body>
          <Card.Title className="d-flex justify-content-between align-items-center">
            Buyers Management
            {!showForm && !showEditForm && (
              <Button onClick={() => { setShowForm(true); setFormStep(1); }}>Add Buyer</Button>
            )}
          </Card.Title>

          {showEditForm ? (
            renderEditForm()
          ) : showForm ? (
            <Form>
              {renderFormSection('Company Details', companyDetails, setCompanyDetails, [
                { label: 'Company Name', name: 'name', type: 'text' },
                { label: 'Company Type', name: 'type', type: 'text' },
                { label: 'Website', name: 'website', type: 'text' },
                { label: 'Status', name: 'status', type: 'radio-group' }
              ], 1, true)}
              
              {renderFormSection('Company Address', companyAddress, setCompanyAddress, [
                { label: 'Address', name: 'address', type: 'text' },
                { label: 'Phone', name: 'phone', type: 'tel' },
                { label: 'State', name: 'state', type: 'text' },
                { label: 'Zipcode', name: 'zipcode', type: 'text' },
                { label: 'Country', name: 'country', type: 'text' },
                { label: 'Email', name: 'email', type: 'email' },
                { label: 'Status', name: 'status', type: 'radio-group' }
              ], 2, formStep >= 2)}
              
              {renderFormSection('Company Contact', companyContact, setCompanyContact, [
                { label: 'First Name', name: 'firstName', type: 'text' },
                { label: 'Last Name', name: 'lastName', type: 'text' },
                { label: 'Location', name: 'location', type: 'text' },
                { label: 'Email', name: 'email', type: 'email' },
                { label: 'Username', name: 'username', type: 'text' },
                { label: 'Password', name: 'password', type: 'password' },
                { label: 'Phone', name: 'phone', type: 'tel' },
                { label: 'Role', name: 'role', type: 'select', options: [
                  { value: 'user', label: 'User' },
                  { value: 'admin', label: 'Admin' },
                  { value: 'manager', label: 'Manager' }
                ]},
                { label: 'Status', name: 'status', type: 'radio-group' }
              ], 3, formStep >= 3)}
              
              {formStep >= 3 && (
                <div className="text-center mt-4">
                  <Button variant="success" className="mx-2" onClick={handleSave}>
                    Save Buyer
                  </Button>
                  <Button variant="danger" className="mx-2" onClick={handleCancel}>
                    Cancel All
                  </Button>
                </div>
              )}
            </Form>
          ) : (
            <>
              <Form.Control
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-3"
              />
              <Table striped hover responsive>
                <thead>
                  <tr>
                    {['u_name', 'f_name', 'l_name', 'phone', 'email', 'role', 'status', 'verified'].map(field => (
                      <th key={field} onClick={() => handleSort(field)} style={{cursor: 'pointer'}}>
                        {field === 'verified' ? 'Verification' : field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </th>
                    ))}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map(item => (
                    <tr key={item.id}>
                      <td>{item.u_name}</td>
                      <td>{item.f_name}</td>
                      <td>{item.l_name}</td>
                      <td>{item.phone}</td>
                      <td>{item.email}</td>
                      <td>{item.role}</td>
                      <td>{item.a_status}</td>
                      <td>
                        {item.verified ? (
                          <Button 
                            size="sm" 
                            variant="success" 
                            disabled
                            style={{ minWidth: '80px' }}
                          >
                            Verified
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="warning" 
                            onClick={() => handleVerifyBuyer(item.id)}
                            style={{ minWidth: '80px' }}
                          >
                            Verify
                          </Button>
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-1 flex-wrap">
                          <Button size="sm" variant="info" 
                            onClick={() => { setSelectedBuyer(item); setShowModal(true); }}>
                            View
                          </Button>
                          <Button size="sm" variant="warning" 
                            onClick={() => handleEdit(item)}>
                            Edit
                          </Button>
                          <Button size="sm" variant="danger" 
                            onClick={() => handleDelete(item)}>
                            Delete  
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}

          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Buyer Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedBuyer && (
                <>
                  <p><strong>Username:</strong> {selectedBuyer.u_name}</p>
                  <p><strong>Name:</strong> {selectedBuyer.f_name} {selectedBuyer.l_name}</p>
                  <p><strong>Phone:</strong> {selectedBuyer.phone}</p>
                  <p><strong>Email:</strong> {selectedBuyer.email}</p>
                  <p><strong>Role:</strong> {selectedBuyer.role}</p>
                  <p><strong>Status:</strong> {selectedBuyer.a_status}</p>
                  <p><strong>Verification:</strong> 
                    <span className={`badge ${selectedBuyer.verified ? 'bg-success' : 'bg-warning'} ms-2`}>
                      {selectedBuyer.verified ? 'Verified' : 'Not Verified'}
                    </span>
                  </p>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="warning" onClick={() => handleEdit(selectedBuyer)}>Edit</Button>
              <Button variant="danger" onClick={() => handleDelete(selectedBuyer)}>Delete</Button>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
            </Modal.Footer>
          </Modal>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Buyer;