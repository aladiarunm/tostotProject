import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Table,
  Button,
  Alert,
  Spinner,
  Modal,
  Badge,
} from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

import { getBrands, deleteBrand, addBrand, updateBrand } from '../../api/brands';

const statusMap = {
  A: { label: 'Active', variant: 'success' },
  I: { label: 'Inactive', variant: 'secondary' },
  D: { label: 'Deleted', variant: 'danger' },
};


const BrandForm = ({ brand, onCancel, onSave }) => {
  const [name, setName] = useState(brand?.name || '');
  const [description, setDescription] = useState(brand?.description || '');
  const [status, setStatus] = useState(brand?.status || 'A');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name, description, status };
    await onSave(payload, brand?.id);
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <h5>{brand ? 'Edit Brand' : 'Add Brand'}</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="form-control"
            >
              <option value="A">Active</option>
              <option value="I">Inactive</option>
              <option value="D">Deleted</option>
            </select>
          </div>
          <Button type="submit" variant="success" className="me-2">
            Save
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </form>
      </Card.Body>
    </Card>
  );
};

const BrandManager = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [viewBrand, setViewBrand] = useState(null);
  const [editingBrand, setEditingBrand] = useState(null);
  const [addingBrand, setAddingBrand] = useState(false);


  const [filterText, setFilterText] = useState(''); //--changes


  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getBrands();
      if (response.success) {
        setBrands(response.data);
      } else {
        setError('Failed to load brands');
      }
    } catch {
      setError('Error loading brands');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => setDeleteConfirmId(id);

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const response = await deleteBrand(deleteConfirmId);
      if (response.success) {
        setSuccess('Brand deleted successfully!');
        fetchBrands();
      } else {
        setError(response.error || 'Failed to delete brand');
      }
    } catch {
      setError('Failed to delete brand');
    } finally {
      setSubmitting(false);
      setDeleteConfirmId(null);
    }
  };

  const handleAdd = () => setAddingBrand(true);
  const handleEdit = (brand) => setEditingBrand(brand);
  const cancelDelete = () => setDeleteConfirmId(null);
  const handleView = (brand) => setViewBrand(brand);
  const closeViewModal = () => setViewBrand(null);

  const handleEditFromView = (category) => {
    closeViewModal(); // step 1: close view
    setTimeout(() => {
      handleEdit(category); // step 2: wait and then go to edit
    }, 300); // wait for modal animation to complete
  };


  const handleFormSave = async (data, id) => {
    try {
      let res;
      if (id) {
        res = await updateBrand(id, data);
        if (!res.success) throw new Error(res.error);
        setSuccess('Brand updated successfully!');
      } else {
        res = await addBrand(data);
        if (!res.success) throw new Error(res.error);
        setSuccess('Brand added successfully!');
      }
      setEditingBrand(null);
      setAddingBrand(false);
      fetchBrands();
    } catch (err) {
      setError(err.message || 'Operation failed');
    }
  };

  if (loading)
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );

  return (
    <Container className="py-4">
      {addingBrand || editingBrand ? (
        <BrandForm
          brand={editingBrand}
          onCancel={() => {
            setAddingBrand(false);
            setEditingBrand(null);
          }}
          onSave={handleFormSave}
        />
      ) : (
        <Card>
          <Card.Body>
            <Card.Title className="mb-4 d-flex justify-content-between align-items-center">
              Brand Management
              <Button variant="primary" onClick={handleAdd}>
                + Add Brand
              </Button>
            </Card.Title>

            {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
            {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

        
            <div className="mb-3"> 
              <input
                type="text"
                className="form-control"
                placeholder="Filter by brand name..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
            </div>


            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Created On</th>
                  <th>Last Modified On</th>
                  <th style={{ minWidth: '130px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {brands.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">No brands found</td>
                  </tr>
                ) : (
                  brands.filter((brand) => brand.name.toLowerCase().includes(filterText.toLowerCase())).map((brand) => (
                    <tr key={brand.id}>
                      <td>{brand.id}</td>
                      <td>{brand.name}</td>
                      <td>{brand.description || '-'}</td>
                      <td>
                        <Badge bg={statusMap[brand.status]?.variant || 'dark'}>
                          {statusMap[brand.status]?.label || brand.status}
                        </Badge>
                      </td>
                      <td>{new Date(brand.created_on).toLocaleString()}</td>
                      <td>{new Date(brand.last_modified_on).toLocaleString()}</td>
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-2" title="View" onClick={() => handleView(brand)}><FaEye /></Button>
                        <Button variant="outline-warning" size="sm" className="me-2" title="Edit" onClick={() => handleEdit(brand)}><FaEdit /></Button>
                        <Button variant="outline-danger" size="sm" title="Delete" onClick={() => handleDeleteClick(brand.id)}><FaTrash /></Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>

            <Modal show={!!deleteConfirmId} onHide={cancelDelete} centered>
              <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Are you sure you want to delete brand ID {deleteConfirmId}?
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={cancelDelete} disabled={submitting}>Cancel</Button>
                <Button variant="danger" onClick={confirmDelete} disabled={submitting}>{submitting ? 'Deleting...' : 'Yes, Delete'}</Button>
              </Modal.Footer>
            </Modal>

            <Modal show={!!viewBrand} onHide={closeViewModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>View Brand Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {viewBrand && (
                <>
                  <p><strong>ID:</strong> {viewBrand.id}</p>
                  <p><strong>Name:</strong> {viewBrand.name}</p>
                  <p><strong>Description:</strong> {viewBrand.description || '-'}</p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <Badge bg={statusMap[viewBrand.status]?.variant || 'dark'}>
                      {statusMap[viewBrand.status]?.label || viewBrand.status}
                    </Badge>
                  </p>
                  <p><strong>Created On:</strong> {new Date(viewBrand.created_on).toLocaleString()}</p>
                  <p><strong>Last Modified On:</strong> {new Date(viewBrand.last_modified_on).toLocaleString()}</p>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="warning" onClick={() => handleEditFromView(viewBrand)}>Edit</Button>
              <Button variant="secondary" onClick={closeViewModal}>Close</Button>
            </Modal.Footer>
          </Modal>

          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default BrandManager;
