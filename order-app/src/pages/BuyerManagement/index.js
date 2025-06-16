import '../../styles/button.css';
import React, { useState, useMemo } from 'react';
//import { Container, Card, Form, Button, Row, Col, Table, Modal } from 'react-bootstrap';
import { Container, Card, Form, Button, Row, Col, Table, Modal, InputGroup } from 'react-bootstrap';

import { orderBy } from 'lodash';

const Buyer = () => {
  const [formData, setFormData] = useState({
    userName: '', email: '', phone: '', role: '', status: ''
  });

  const [companyDetails, setCompanyDetails] = useState({
    name: '', type: '', website: '', status: ''
  });

  const [companyAddress, setCompanyAddress] = useState({
    address: '', phone: '', state: '', zipcode: '', country: '', email: '', status: ''
  });

  const [companyContact, setCompanyContact] = useState({
    firstName: '', lastName: '', location: '', email: '', username: '', password: '', status: '', phone: ''
  });
  
  const [buyers, setBuyers] = useState([
    { id: 1, u_name: 'Alice Johnson', f_name: 'Alice', l_name: 'Johnson', phone: '123-456-7890', email: 'alice@example.com', role: 'user', a_status: 'A', verified: false },
    { id: 2, u_name: 'Bob Smith', f_name: 'Bob', l_name: 'Smith', phone: '987-654-3210', email: 'bob@example.com', role: 'admin', a_status: 'I', verified: true },
    { id: 3, u_name: 'Charlie Brown', f_name: 'Charlie', l_name: 'Brown', phone: '555-555-5555', email: 'charlie@example.com', role: 'user', a_status: 'A', verified: false },
    { id: 4, u_name: 'Diana Prince', f_name: 'Diana', l_name: 'Prince', phone: '222-333-4444', email: 'diana@example.com', role: 'admin', a_status: 'D', verified: true }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('u_name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formStep, setFormStep] = useState(1); // 1: Company Details, 2: Address, 3: Contact

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

  const renderFormSection = (title, state, setState, fields, stepNumber, isEnabled = true) => (
    <Card className={`mb-4 ${!isEnabled ? 'opacity-50' : ''}`}>
      <Card.Body>
        <Card.Title className="text-center mb-4">{title}</Card.Title>
        <Row>
          {fields.map(({ label, name, type }) => (
            <Col md={6} key={name} className="mb-3">
              <Form.Label>{label}</Form.Label>
              {type === 'radio-group' ? (
                <div>
                  {['A', 'I', 'D'].map((val) => (
                    <Form.Check
                      inline
                      key={val}
                      label={val === 'A' ? 'Active' : val === 'I' ? 'Inactive' : 'Deactivated'}
                      name={name}
                      type="radio"
                      value={val}
                      checked={state[name] === val}
                      onChange={handleChange(setState)}
                      disabled={!isEnabled}
                    />
                  ))}
                </div>
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

  const handleSectionCancel = (setState) => {
    // Reset only the current section's state
    switch(setState) {
      case setCompanyDetails:
        setCompanyDetails({ name: '', type: '', website: '', status: '' });
        break;
      case setCompanyAddress:
        setCompanyAddress({ address: '', phone: '', state: '', zipcode: '', country: '', email: '', status: '' });
        break;
      case setCompanyContact:
        setCompanyContact({ firstName: '', lastName: '', location: '', email: '', username: '', password: '', status: '', phone: '' });
        break;
      default:
        break;
    }
  };

  const handleEdit = (item) => {
    setFormData({
      userName: item.u_name,
      email: item.email,
      phone: item.phone,
      role: item.role,
      status: item.a_status
    });
    setCompanyDetails({ name: '', type: '', website: '', status: '' });
    setCompanyAddress({ address: '', phone: '', state: '', zipcode: '', country: '', email: '', status: '' });
    setCompanyContact({ firstName: '', lastName: '', location: '', email: '', username: '', password: '', status: '', phone: '' });
    setEditingId(item.id);
    setFormStep(1);
    setShowForm(true);
    setShowModal(false);
  };

  const handleSave = () => {
  if (editingId) {
    setBuyers(prev => prev.map(b => 
      b.id === editingId 
        ? {
            ...b,
            u_name: `${companyContact.firstName} ${companyContact.lastName}`,
            f_name: companyContact.firstName,
            l_name: companyContact.lastName,
            email: companyContact.email,
            phone: companyContact.phone,
            role: companyContact.username,
            a_status: companyContact.status
          }
        : b
    ));
  } else {
    setBuyers(prev => [
      ...prev,
      {
        id: Math.max(...buyers.map(b => b.id), 0) + 1,
        u_name: `${companyContact.firstName} ${companyContact.lastName}`,
        f_name: companyContact.firstName,
        l_name: companyContact.lastName,
        email: companyContact.email,
        phone: companyContact.phone,
        role: "user",
        a_status: companyContact.status,
        verified: false
      }
    ]);
  }
  handleCancel();
  alert(`Buyer ${editingId ? 'updated' : 'added'} successfully`);
};

  const handleCancel = () => {
    setFormData({ userName: '', email: '', phone: '', role: '', status: '' });
    setCompanyDetails({ name: '', type: '', website: '', status: '' });
    setCompanyAddress({ address: '', phone: '', state: '', zipcode: '', country: '', email: '', status: '' });
    setCompanyContact({ firstName: '', lastName: '', location: '', email: '', username: '', password: '', status: '', phone: '' });
    setFormStep(1);
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = (item) => {
    setBuyers(prev => prev.filter(b => b.id !== item.id));
    if (selectedBuyer?.id === item.id) setShowModal(false);
    if (editingId === item.id) handleCancel();
  };

  const formFields = [
    { label: 'Username', name: 'userName', type: 'text' },
    { label: 'Email', name: 'email', type: 'email' },
    { label: 'Phone', name: 'phone', type: 'tel' },
    { label: 'Role', name: 'role', type: 'text' },
    { label: 'Status', name: 'status', type: 'text' }
  ];

  return (
    <Container className="py-4">
      <Card>
        <Card.Body>
          <Card.Title className="d-flex justify-content-between align-items-center">
            Buyers Management
            {!showForm && (
              <Button onClick={() => { setShowForm(true); setFormStep(1); }}>Add Buyer</Button>
            )}
          </Card.Title>

          {showForm ? (
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
                { label: 'Status', name: 'status', type: 'text' }
              ], 2, formStep >= 2)}
              
              {renderFormSection('Company Contact', companyContact, setCompanyContact, [
                { label: 'First Name', name: 'firstName', type: 'text' },
                { label: 'Last Name', name: 'lastName', type: 'text' },
                { label: 'Location', name: 'location', type: 'text' },
                { label: 'Email', name: 'email', type: 'email' },
                { label: 'Username', name: 'username', type: 'text' },
                { label: 'Password', name: 'password', type: 'password' },
                { label: 'Status', name: 'status', type: 'radio-group' }
,
                { label: 'Phone', name: 'phone', type: 'tel' }
              ], 3, formStep >= 3)}
              
              {formStep >= 3 && (
                <div className="text-center mt-4">
                  <Button variant="success" className="mx-2" onClick={handleSave}>
                    {editingId ? 'Update Buyer' : 'Save Buyer'}
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
                            style={{ minWidth: '65px' }}
                          >
                            Verified
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="warning" 
                            onClick={() => handleVerifyBuyer(item.id)}
                            style={{ minWidth: '65px' }}
                          >
                            Verify
                          </Button>
                        )}
                      </td>
                      <td>
                        <Button size="sm" variant="info" className="me-1" 
                          onClick={() => { setSelectedBuyer(item); setShowModal(true); }}>
                          View
                        </Button>
                        <Button size="sm" variant="warning" className="me-1" 
                          onClick={() => handleEdit(item)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="danger" 
                          onClick={() => handleDelete(item)}>
                          Delete  
                        </Button>
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
