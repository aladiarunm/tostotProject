import '../../styles/button.css';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Container, Card, Form, Button, Row, Col, Table, Modal, InputGroup } from 'react-bootstrap';
import { orderBy } from 'lodash';

const Seller = () => {
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
    firstName: '', lastName: '', location: '', email: '', username: '', password: '', status: 'A', phone: '', role: 'seller'
  });

  const [sellers, setSellers] = useState([
    
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('u_name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [formStep, setFormStep] = useState(1);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [editingSellerId, setEditingSellerId] = useState(null);

  const filteredData = useMemo(() => {
    const filtered = sellers.filter(item => 
      Object.values(item).some(val => 
        val.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    return orderBy(filtered, [sortField], [sortOrder]);
  }, [sellers, searchQuery, sortField, sortOrder]);

  const handleSort = (field) => {
    setSortOrder(sortField === field ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc');
    setSortField(field);
  };

  const handleChange = (stateSetter) => (e) => {
    stateSetter(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const renderFormSection = (title, state, setState, fields, stepNumber, isEnabled = true) => (
    <Card className={`mb-4 ${isDeleteMode ? 'border-danger' : ''}`}>
      <Card.Body>
        <Card.Title className="text-center mb-4">
          {isDeleteMode ? `${title} (Review Details)` : title}
        </Card.Title>
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
                      name={`${name}-${stepNumber}`}
                      type="radio"
                      id={`${name}-${val}-${stepNumber}`}
                      value={val}
                      checked={state[name] === val}
                      onChange={(e) => {
                        setState(prev => ({ ...prev, [name]: e.target.value }));
                      }}
                      disabled={isDeleteMode || !isEnabled}
                      readOnly={isDeleteMode}
                    />
                  ))}
                </div>
              ) : type === 'select' ? (
                <Form.Select
                  name={name}
                  value={state[name] || ''}
                  onChange={handleChange(setState)}
                  disabled={isDeleteMode || !isEnabled}
                  style={isDeleteMode ? { backgroundColor: '#f8f9fa' } : {}}
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
                    disabled={isDeleteMode || !isEnabled}
                    readOnly={isDeleteMode}
                    style={isDeleteMode ? { backgroundColor: '#f8f9fa' } : {}}
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
                    disabled={isDeleteMode || !isEnabled}
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
                  disabled={isDeleteMode || !isEnabled}
                  readOnly={isDeleteMode}
                  style={isDeleteMode ? { backgroundColor: '#f8f9fa' } : {}}
                />
              )}
            </Col>
          ))}
        </Row>
        {!isDeleteMode && (
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
        )}
      </Card.Body>
    </Card>
  );

  const handleVerifySeller = async (sellerId) => {
  try {
    const res = await fetch(`http://localhost:3001/api/sellers/${sellerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        verified_by_id: 1  // 🔁 Use your actual user ID or admin ID
      }),
    });

    const result = await res.json();

    if (res.ok) {
      alert('✅ Seller verified successfully!');
      // Update frontend state with new verified status
      setSellers(prev =>
        prev.map(seller =>
          seller.id === sellerId
            ? { ...seller, verified: true }
            : seller
        )
      );
    } else {
      alert(`❌ Failed to verify seller: ${result.message}`);
    }
  } catch (err) {
    console.error('❌ Error verifying seller:', err);
    alert('❌ Network error while verifying seller.');
  }
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

  const handleEdit = (item) => {
    // Pre-fill the form with seller data
    setCompanyDetails({
      name: item.u_name || '', // Using username as company name for demo
      type: 'Technology', // Default value for demo
      website: 'www.example.com',
      status: item.a_status
    });
    
    setCompanyAddress({
      address: '123 Main Street',
      phone: item.phone || '',
      state: 'California',
      zipcode: '12345',
      country: 'USA',
      email: item.email || '',
      status: item.a_status
    });
    
    setCompanyContact({
      firstName: item.f_name || '',
      lastName: item.l_name || '',
      location: 'San Francisco',
      email: item.email || '',
      username: item.u_name || '',
      password: '********',
      status: item.a_status,
      phone: item.phone || '',
      role: item.role || 'seller'
    });

    // Set edit mode and show form
    setIsEditMode(true);
    setIsDeleteMode(false);
    setEditingSellerId(item.id);
    setShowForm(true);
    setFormStep(3);
    setShowModal(false);
  };

  const handleSave = async () => {
  const payload = {
    companyName: companyDetails.name,
    companyType: companyDetails.type,
    website: companyDetails.website,
    verified_by_id: null, // Optional: set your user ID if needed

    firstName: companyContact.firstName,
    lastName: companyContact.lastName,
    username: companyContact.username,
    password: companyContact.password,
    email: companyContact.email,
    phone: companyContact.phone,
    role: companyContact.role,
    status: companyContact.status
  };

  try {
    const res = await fetch('http://localhost:3001/api/sellers/company-contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (res.ok) {
      alert('✅ Seller saved successfully!');
      setSellers(prev => [...prev, result.seller]);
      handleCancel();
    } else {
      console.error('❌ Backend error:', result);
      alert(`Failed to save seller: ${result.message}`);
    }
  } catch (err) {
    console.error('❌ Network error:', err);
    alert('Network error while saving seller');
  }
};


  const handleCancel = () => {
    setFormData({ userName: '', email: '', phone: '', role: '', status: '' });
    setCompanyDetails({ name: '', type: '', website: '', status: 'A' });
    setCompanyAddress({ address: '', phone: '', state: '', zipcode: '', country: '', email: '', status: 'A' });
    setCompanyContact({ firstName: '', lastName: '', location: '', email: '', username: '', password: '', status: 'A', phone: '', role: 'seller' });
    setFormStep(1);
    setShowForm(false);
    setIsEditMode(false);
    setIsDeleteMode(false);
    setEditingSellerId(null);
  };

  const handleDelete = (item) => {
    // Pre-fill all forms with seller data for delete mode
    setCompanyDetails({
      name: item.u_name || '',
      type: 'Technology', // Default value since we don't have this in seller data
      website: 'www.example.com', // Default value
      status: item.a_status
    });
    
    setCompanyAddress({
      address: '123 Main Street', // Default value
      phone: item.phone || '',
      state: 'California', // Default value
      zipcode: '12345', // Default value
      country: 'USA', // Default value
      email: item.email || '',
      status: item.a_status
    });
    
    setCompanyContact({
      firstName: item.f_name || '',
      lastName: item.l_name || '',
      location: 'San Francisco', // Default value
      email: item.email || '',
      username: item.u_name || '',
      password: '********', // Masked password
      status: item.a_status,
      phone: item.phone || '',
      role: item.role || 'seller'
    });

    // Set delete mode and show form - show all steps
    setIsDeleteMode(true);
    setIsEditMode(false);
    setEditingSellerId(item.id);
    setShowForm(true);
    setFormStep(3); // Show all sections
    setShowModal(false);
  };

  const handleConfirmDelete = async () => {
  if (window.confirm('Are you sure you want to delete this seller? This action cannot be undone.')) {
    try {
      const res = await fetch(`http://localhost:3001/api/sellers/${editingSellerId}`, {
        method: 'DELETE'
      });

      const result = await res.json();

      if (res.ok) {
        alert('✅ Seller deleted successfully');
        setSellers(prev => prev.filter(s => s.id !== editingSellerId));
        handleCancel();
      } else {
        console.error('❌ Delete failed:', result);
        alert(`Failed to delete seller: ${result.message}`);
      }
    } catch (err) {
      console.error('❌ Network error on delete:', err);
      alert('Network error while deleting seller');
    }
  }
};


  const handleAddSeller = () => {
    setIsEditMode(false);
    setIsDeleteMode(false);
    setEditingSellerId(null);
    setShowForm(true);
    setFormStep(1);
  };
 const fetchSellers = useCallback(async () => {
  try {
    const res = await fetch('http://localhost:3001/api/sellers');
    const result = await res.json();
    
    console.log('✅ Sellers fetched:', result.data);

    setSellers(result.data.map(seller => ({
  ...seller,
  verified: seller.verified_by_id != null  // Mark as verified if verified_by_id is not null
})));

  } catch (err) {
    console.error('❌ Failed to fetch sellers:', err);
  }
}, []);

useEffect(() => {
  fetchSellers();
}, [fetchSellers]);

  return (
    <Container className="py-4">
      <Card>
        <Card.Body>
          <Card.Title className="d-flex justify-content-between align-items-center">
            Sellers Management
            {!showForm && (
              <Button onClick={handleAddSeller}>Add Seller</Button>
            )}
          </Card.Title>

          {showForm ? (
            <Form>
              <div className="mb-3">
                <h5 className={`${isDeleteMode ? 'text-danger' : 'text-primary'}`}>
                  {isDeleteMode ? 'Delete Seller - Review Details' : isEditMode ? 'Edit Seller' : 'Add New Seller'}
                </h5>
                {isDeleteMode && (
                  <div className="alert alert-danger">
                    <strong>Warning:</strong> You are about to delete this seller. Please review all the details below and click "Delete Seller" to permanently remove this seller from the system.
                  </div>
                )}
              </div>
              
              {/* Always show all sections in delete mode */}
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
              ], 2, isDeleteMode ? true : formStep >= 2)}
              
              {renderFormSection('Company Contact', companyContact, setCompanyContact, [
                { label: 'First Name', name: 'firstName', type: 'text' },
                { label: 'Last Name', name: 'lastName', type: 'text' },
                { label: 'Location', name: 'location', type: 'text' },
                { label: 'Email', name: 'email', type: 'email' },
                { label: 'Username', name: 'username', type: 'text' },
                { label: 'Password', name: 'password', type: 'password' },
                { label: 'Phone', name: 'phone', type: 'tel' },
                { label: 'Role', name: 'role', type: 'select', options: [
                  { value: 'seller', label: 'Seller' },
                  { value: 'premium_seller', label: 'Premium Seller' },
                  { value: 'vendor', label: 'Vendor' }
                ]},
                { label: 'Status', name: 'status', type: 'radio-group' }
              ], 3, isDeleteMode ? true : formStep >= 3)}
              
              {(formStep >= 3 || isDeleteMode) && (
                <div className="text-center mt-4">
                  {isDeleteMode ? (
                    <>
                      <Button variant="danger" className="mx-2" onClick={handleConfirmDelete}>
                        <i className="fas fa-trash"></i> Delete Seller
                      </Button>
                      <Button variant="secondary" className="mx-2" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="success" className="mx-2" onClick={handleSave}>
                        {isEditMode ? 'Update Seller' : 'Save Seller'}
                      </Button>
                      <Button variant="danger" className="mx-2" onClick={handleCancel}>
                        Cancel All
                      </Button>
                    </>
                  )}
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
                            onClick={() => handleVerifySeller(item.id)}
                            style={{ minWidth: '80px' }}
                          >
                            Verify
                          </Button>
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-1 flex-wrap">
                          <Button size="sm" variant="info" 
                            onClick={() => { setSelectedSeller(item); setShowModal(true); }}>
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
              <Modal.Title>Seller Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedSeller && (
                <>
                  <p><strong>Username:</strong> {selectedSeller.u_name}</p>
                  <p><strong>Name:</strong> {selectedSeller.f_name} {selectedSeller.l_name}</p>
                  <p><strong>Phone:</strong> {selectedSeller.phone}</p>
                  <p><strong>Email:</strong> {selectedSeller.email}</p>
                  <p><strong>Role:</strong> {selectedSeller.role}</p>
                  <p><strong>Status:</strong> {selectedSeller.a_status}</p>
                  <p><strong>Verification:</strong> 
                    <span className={`badge ${selectedSeller.verified ? 'bg-success' : 'bg-warning'} ms-2`}>
                      {selectedSeller.verified ? 'Verified' : 'Not Verified'}
                    </span>
                  </p>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="warning" onClick={() => handleEdit(selectedSeller)}>Edit</Button>
              <Button variant="danger" onClick={() => handleDelete(selectedSeller)}>Delete</Button>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
            </Modal.Footer>
          </Modal>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Seller;