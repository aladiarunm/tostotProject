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
import { FaEdit, FaFilter, FaTrash, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getBrands, deleteBrand, addBrand, updateBrand } from '../../api/brands';

const statusMap = {
  A: { label: 'Active', variant: 'success' },
  I: { label: 'Inactive', variant: 'secondary' },
  D: { label: 'Deleted', variant: 'danger' },
};

// Add and Edit Form
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
            <label >Status</label>

            <div className="form-check form-check-inline" style={{ marginLeft: '10px' }}>
              <input
                type="radio"
                name="status"
                value="A"
                checked={status === 'A'}
                onChange={(e) => setStatus(e.target.value)}
                className="form-check-input"
                id="statusActive"
              />
              <label htmlFor="statusActive" className="form-check-label">
                Active
              </label>
            </div>

            <div className="form-check form-check-inline">
              <input
                type="radio"
                name="status"
                value="I"
                checked={status === 'I'}
                onChange={(e) => setStatus(e.target.value)}
                className="form-check-input"
                id="statusInactive"
              />
              <label htmlFor="statusInactive" className="form-check-label">
                Inactive
              </label>
            </div>
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


  const [filterId, setFilterId] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterDesc, setFilterDesc] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Define temporary states above (to capture input before filtering)
  const [tempFilterId, setTempFilterId] = useState('');
  const [tempFilterName, setTempFilterName] = useState('');
  const [tempFilterDesc, setTempFilterDesc] = useState('');
  const [tempFilterStatus, setTempFilterStatus] = useState('');

  // Button click handler
  const handleApplyFilters = () => {
    setFilterId(tempFilterId);
    setFilterName(tempFilterName);
    setFilterDesc(tempFilterDesc);
    setFilterStatus(tempFilterStatus);
  };

  const handleClearFilter = () => {
    setFilterId('');
    setFilterName('');
    setFilterDesc('');
    setFilterStatus('');
    setTempFilterId('');
    setTempFilterName('');
    setTempFilterDesc('');
    setTempFilterStatus('');
  };
  const filteredBrands = brands.filter((brand) =>
                      brand.id.toString().includes(filterId) &&
                      brand.name.toLowerCase().includes(filterName.toLowerCase()) &&
                      (brand.description || '').toLowerCase().includes(filterDesc.toLowerCase()) &&
                      brand.status.toString().includes(filterStatus));
  //
  const navigate = useNavigate();

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
    closeViewModal();
    setTimeout(() => {
      handleEdit(category);
    }, 300);
  };

  const handleDeleteFromView = (category) => {
    closeViewModal();
    setTimeout(() => {
      handleDeleteClick(category.id);
    }, 300);
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
              <div className="d-flex" style={{ gap: '8px' }}>
                <Button variant="primary" onClick={handleAdd}>
                  + Add Category
                </Button>
                <Button variant="secondary" onClick={() => navigate('/attributes')}>
                  Back
                </Button>
              </div>
            </Card.Title>

            {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
            {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

            <div className="d-none d-md-block mb-3">
              <div className="d-flex align-items-center" style={{ gap: '8px' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Filter by ID"
                  style={{ width: '10%' }}
                  value={tempFilterId}
                  onChange={(e) => setTempFilterId(e.target.value)}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Filter by Name"
                  style={{ width: '19%' }}
                  value={tempFilterName}
                  onChange={(e) => setTempFilterName(e.target.value)}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Filter by Description"
                  style={{ width: '24%' }}
                  value={tempFilterDesc}
                  onChange={(e) => setTempFilterDesc(e.target.value)}
                />
                <select
                  className="form-control"
                  style={{ width: '15%' }}
                  value={tempFilterStatus}
                  onChange={(e) => setTempFilterStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="A">Active</option>
                  <option value="I">Inactive</option>
                  <option value="D">Deleted</option>
                </select>

                <Button variant="primary"  style={{ width: '9%' }} onClick={handleApplyFilters}>
                  <FaFilter/>
                    Filter
                </Button>
                <Button variant="secondary"  style={{ width: '9%' }} onClick={handleClearFilter}>
                    Clear Filter
                </Button>
              </div>
            </div>

            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th style={{ width: '10%' }}>ID</th>
                  <th style={{ width: '20%' }}>Name</th>
                  <th style={{ width: '25%' }}>Description</th>
                  <th style={{ width: '15%' }}>Status</th>
                  <th>Created On</th>
                  <th>Last Modified On</th>
                  <th style={{ minWidth: '130px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBrands.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">No subCategories found</td>
                  </tr>
                ) : (
                  filteredBrands.map((brand) => (
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
              <Button variant="danger" onClick={() => handleDeleteFromView(viewBrand)}>Delete</Button>
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
