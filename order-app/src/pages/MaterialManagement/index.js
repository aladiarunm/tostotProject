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
import { getMaterials, deleteMaterial, addMaterial, updateMaterial } from '../../api/materials';

const statusMap = {
  A: { label: 'Active', variant: 'success' },
  I: { label: 'Inactive', variant: 'secondary' },
  D: { label: 'Deleted', variant: 'danger' },
};

// Add and Edit Form
const MaterialForm = ({ material, onCancel, onSave }) => {
  const [name, setName] = useState(material?.name || '');
  const [code, setCode] = useState(material?.code || '');
  const [description, setDescription] = useState(material?.description || '');
  const [status, setStatus] = useState(material?.status || 'A');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name,code,description, status };
    await onSave(payload, material?.id);
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <h5>{material ? 'Edit Material' : 'Add Material'}</h5>
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
            <label>Code</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
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

const MaterialManager = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [viewMaterial, setViewMaterial] = useState(null);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [addingMaterial, setAddingMaterial] = useState(false);


  const [filterId, setFilterId] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterCode, setFilterCode] = useState('');
  const [filterDesc, setFilterDesc] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Define temporary states above (to capture input before filtering)
  const [tempFilterId, setTempFilterId] = useState('');
  const [tempFilterName, setTempFilterName] = useState('');
  const [tempFilterCode, setTempFilterCode] = useState('');
  const [tempFilterDesc, setTempFilterDesc] = useState('');
  const [tempFilterStatus, setTempFilterStatus] = useState('');

  // Button click handler
  const handleApplyFilters = () => {
    setFilterId(tempFilterId);
    setFilterName(tempFilterName);
    setFilterCode(tempFilterCode);
    setFilterDesc(tempFilterDesc);
    setFilterStatus(tempFilterStatus);
  };

  const handleClearFilter = () => {
    setFilterId('');
    setFilterName('');
    setFilterDesc('');
    setFilterStatus('');
    setFilterStatus('');
    setFilterCode('');
    setTempFilterId('');
    setTempFilterName('');
    setTempFilterCode('');
    setTempFilterDesc('');
    setTempFilterStatus('');
  };
  const filteredMaterials = materials.filter((material) =>
                      material.id.toString().includes(filterId) &&
                      material.name.toLowerCase().includes(filterName.toLowerCase()) &&
                      material.code.toString().includes(filterCode) &&
                      (material.description || '').toLowerCase().includes(filterDesc.toLowerCase()) &&
                      material.status.toString().includes(filterStatus));
  //
  const navigate = useNavigate();

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getMaterials();
      if (response.success) {
        setMaterials(response.data);
      } else {
        setError('Failed to load materials');
      }
    } catch {
      setError('Error loading materials');
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
      const response = await deleteMaterial(deleteConfirmId);
      if (response.success) {
        setSuccess('Material deleted successfully!');
        fetchMaterials();
      } else {
        setError(response.error || 'Failed to delete material');
      }
    } catch {
      setError('Failed to delete material');
    } finally {
      setSubmitting(false);
      setDeleteConfirmId(null);
    }
  };

  const handleAdd = () => setAddingMaterial(true);
  const handleEdit = (material) => setEditingMaterial(material);
  const cancelDelete = () => setDeleteConfirmId(null);
  const handleView = (material) => setViewMaterial(material);
  const closeViewModal = () => setViewMaterial(null);

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
        res = await updateMaterial(id, data);
        if (!res.success) throw new Error(res.message);
        setSuccess('Material updated successfully!');
      } else {
        res = await addMaterial(data);
        if (!res.success) throw new Error(res.message);
        setSuccess('Material added successfully!');
      }
      setEditingMaterial(null);
      setAddingMaterial(false);
      fetchMaterials();
    } catch (err) {
      setError(err.message.includes("Bad request")? 'Duplicate Name or code entered!':'Operation failed');
      setEditingMaterial(null);
      setAddingMaterial(false);
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
      {addingMaterial || editingMaterial ? (
        <MaterialForm
          material={editingMaterial}
          onCancel={() => {
            setAddingMaterial(false);
            setEditingMaterial(null);
          }}
          onSave={handleFormSave}
        />
      ) : (
        <Card>
          <Card.Body>
            <Card.Title className="mb-4 d-flex justify-content-between align-items-center">
              Material Management
              <div className="d-flex" style={{ gap: '8px' }}>
                <Button variant="primary" onClick={handleAdd}>
                  + Add Material
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
                  style={{ width: '14%' }}
                  value={tempFilterName}
                  onChange={(e) => setTempFilterName(e.target.value)}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Filter by Code"
                  style={{ width: '10.5%' }}
                  value={tempFilterCode}
                  onChange={(e) => setTempFilterCode(e.target.value)}
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
                  style={{ width: '9.5%' }}
                  value={tempFilterStatus}
                  onChange={(e) => setTempFilterStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="A">Active</option>
                  <option value="I">Inactive</option>
                  <option value="D">Deleted</option>
                </select>

                <Button variant="primary"  style={{ width: '8%' }} onClick={handleApplyFilters}>
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
                  <th style={{ width: '15%' }}>Name</th>
                  <th style={{ width: '11%' }}>Code</th>
                  <th style={{ width: '25%' }}>Description</th>
                  <th style={{ width: '10%' }}>Status</th>
                  <th>Created On</th>
                  <th>Last Modified On</th>
                  <th style={{width : '11%'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaterials.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">No materials found</td>
                  </tr>
                ) : (
                  filteredMaterials.map((material) => (
                    <tr key={material.id}>
                      <td>{material.id}</td>
                      <td>{material.name}</td>
                      <td>{material.code}</td>
                      <td>{material.description || '-'}</td>
                      <td>
                        <Badge bg={statusMap[material.status]?.variant || 'dark'}>
                          {statusMap[material.status]?.label || material.status}
                        </Badge>
                      </td>
                      <td>{new Date(material.created_on).toLocaleString()}</td>
                      <td>{new Date(material.last_modified_on).toLocaleString()}</td>
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-2" title="View" onClick={() => handleView(material)}><FaEye /></Button>
                        <Button variant="outline-warning" size="sm" className="me-2" title="Edit" onClick={() => handleEdit(material)}><FaEdit /></Button>
                        <Button variant="outline-danger" size="sm" title="Delete" onClick={() => handleDeleteClick(material.id)}><FaTrash /></Button>
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
                Are you sure you want to delete material ID {deleteConfirmId}?
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={cancelDelete} disabled={submitting}>Cancel</Button>
                <Button variant="danger" onClick={confirmDelete} disabled={submitting}>{submitting ? 'Deleting...' : 'Yes, Delete'}</Button>
              </Modal.Footer>
            </Modal>

            <Modal show={!!viewMaterial} onHide={closeViewModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>View Material Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {viewMaterial && (
                <>
                  <p><strong>ID:</strong> {viewMaterial.id}</p>
                  <p><strong>Name:</strong> {viewMaterial.name}</p>
                  <p><strong>Code:</strong> {viewMaterial.code}</p>
                  <p><strong>Description:</strong> {viewMaterial.description || '-'}</p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <Badge bg={statusMap[viewMaterial.status]?.variant || 'dark'}>
                      {statusMap[viewMaterial.status]?.label || viewMaterial.status}
                    </Badge>
                  </p>
                  <p><strong>Created On:</strong> {new Date(viewMaterial.created_on).toLocaleString()}</p>
                  <p><strong>Last Modified On:</strong> {new Date(viewMaterial.last_modified_on).toLocaleString()}</p>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="warning" onClick={() => handleEditFromView(viewMaterial)}>Edit</Button>
              <Button variant="danger" onClick={() => handleDeleteFromView(viewMaterial)}>Delete</Button>
              <Button variant="secondary" onClick={closeViewModal}>Close</Button>
            </Modal.Footer>
          </Modal>

          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default MaterialManager;