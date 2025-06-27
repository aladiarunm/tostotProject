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
import { getGenders, deleteGender, addGender, updateGender } from '../../api/genders';

const statusMap = {
  A: { label: 'Active', variant: 'success' },
  I: { label: 'Inactive', variant: 'secondary' },
  D: { label: 'Deleted', variant: 'danger' },
};

// Add and Edit Form
const GenderForm = ({ gender, onCancel, onSave }) => {
  const [name, setName] = useState(gender?.name || '');
  const [code, setCode] = useState(gender?.code || '');
  const [description, setDescription] = useState(gender?.description || '');
  const [status, setStatus] = useState(gender?.status || 'A');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name,code,description, status };
    await onSave(payload, gender?.id);
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <h5>{gender ? 'Edit Gender' : 'Add Gender'}</h5>
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

const GenderManager = () => {
  const [genders, setGenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [viewGender, setViewGender] = useState(null);
  const [editingGender, setEditingGender] = useState(null);
  const [addingGender, setAddingGender] = useState(false);


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
  const filteredGenders = genders.filter((gender) =>
                      gender.id.toString().includes(filterId) &&
                      gender.name.toLowerCase().includes(filterName.toLowerCase()) &&
                      gender.code.toString().includes(filterCode) &&
                      (gender.description || '').toLowerCase().includes(filterDesc.toLowerCase()) &&
                      gender.status.toString().includes(filterStatus));
  //
  const navigate = useNavigate();

  useEffect(() => {
    fetchGenders();
  }, []);

  const fetchGenders = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getGenders();
      if (response.success) {
        setGenders(response.data);
      } else {
        setError('Failed to load genders');
      }
    } catch {
      setError('Error loading genders');
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
      const response = await deleteGender(deleteConfirmId);
      if (response.success) {
        setSuccess('Gender deleted successfully!');
        fetchGenders();
      } else {
        setError(response.error || 'Failed to delete gender');
      }
    } catch {
      setError('Failed to delete gender');
    } finally {
      setSubmitting(false);
      setDeleteConfirmId(null);
    }
  };

  const handleAdd = () => setAddingGender(true);
  const handleEdit = (gender) => setEditingGender(gender);
  const cancelDelete = () => setDeleteConfirmId(null);
  const handleView = (gender) => setViewGender(gender);
  const closeViewModal = () => setViewGender(null);

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
        res = await updateGender(id, data);
        if (!res.success) throw new Error(res.message);
        setSuccess('Gender updated successfully!');
      } else {
        res = await addGender(data);
        if (!res.success) throw new Error(res.message);
        setSuccess('Gender added successfully!');
      }
      setEditingGender(null);
      setAddingGender(false);
      fetchGenders();
    } catch (err) {
      setError(err.message.includes("Bad request")? 'Duplicate Name or code entered!':'Operation failed');
      setEditingGender(null);
      setAddingGender(false);
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
      {addingGender || editingGender ? (
        <GenderForm
          gender={editingGender}
          onCancel={() => {
            setAddingGender(false);
            setEditingGender(null);
          }}
          onSave={handleFormSave}
        />
      ) : (
        <Card>
          <Card.Body>
            <Card.Title className="mb-4 d-flex justify-content-between align-items-center">
              Gender Management
              <div className="d-flex" style={{ gap: '8px' }}>
                <Button variant="primary" onClick={handleAdd}>
                  + Add Gender
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
                {filteredGenders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">No genders found</td>
                  </tr>
                ) : (
                  filteredGenders.map((gender) => (
                    <tr key={gender.id}>
                      <td>{gender.id}</td>
                      <td>{gender.name}</td>
                      <td>{gender.code}</td>
                      <td>{gender.description || '-'}</td>
                      <td>
                        <Badge bg={statusMap[gender.status]?.variant || 'dark'}>
                          {statusMap[gender.status]?.label || gender.status}
                        </Badge>
                      </td>
                      <td>{new Date(gender.created_on).toLocaleString()}</td>
                      <td>{new Date(gender.last_modified_on).toLocaleString()}</td>
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-2" title="View" onClick={() => handleView(gender)}><FaEye /></Button>
                        <Button variant="outline-warning" size="sm" className="me-2" title="Edit" onClick={() => handleEdit(gender)}><FaEdit /></Button>
                        <Button variant="outline-danger" size="sm" title="Delete" onClick={() => handleDeleteClick(gender.id)}><FaTrash /></Button>
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
                Are you sure you want to delete gender ID {deleteConfirmId}?
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={cancelDelete} disabled={submitting}>Cancel</Button>
                <Button variant="danger" onClick={confirmDelete} disabled={submitting}>{submitting ? 'Deleting...' : 'Yes, Delete'}</Button>
              </Modal.Footer>
            </Modal>

            <Modal show={!!viewGender} onHide={closeViewModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>View Gender Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {viewGender && (
                <>
                  <p><strong>ID:</strong> {viewGender.id}</p>
                  <p><strong>Name:</strong> {viewGender.name}</p>
                  <p><strong>Code:</strong> {viewGender.code}</p>
                  <p><strong>Description:</strong> {viewGender.description || '-'}</p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <Badge bg={statusMap[viewGender.status]?.variant || 'dark'}>
                      {statusMap[viewGender.status]?.label || viewGender.status}
                    </Badge>
                  </p>
                  <p><strong>Created On:</strong> {new Date(viewGender.created_on).toLocaleString()}</p>
                  <p><strong>Last Modified On:</strong> {new Date(viewGender.last_modified_on).toLocaleString()}</p>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="warning" onClick={() => handleEditFromView(viewGender)}>Edit</Button>
              <Button variant="danger" onClick={() => handleDeleteFromView(viewGender)}>Delete</Button>
              <Button variant="secondary" onClick={closeViewModal}>Close</Button>
            </Modal.Footer>
          </Modal>

          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default GenderManager;