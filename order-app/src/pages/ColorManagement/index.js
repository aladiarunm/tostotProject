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
import { getColors, deleteColor, addColor, updateColor } from '../../api/colors';

const statusMap = {
  A: { label: 'Active', variant: 'success' },
  I: { label: 'Inactive', variant: 'secondary' },
  D: { label: 'Deleted', variant: 'danger' },
};

// Add and Edit Form
const ColorForm = ({ color, onCancel, onSave }) => {
  const [name, setName] = useState(color?.name || '');
  const [code, setCode] = useState(color?.code || '#ffffff');
  const [description, setDescription] = useState(color?.description || '');
  const [status, setStatus] = useState(color?.status || 'A');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name,code,description, status };
    await onSave(payload, color?.id);
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <h5>{color ? 'Edit Color' : 'Add Color'}</h5>
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
          <div className="mb-3" >
            <label>color</label>
            <input 
              value={code}
              type='color'
              onChange={(e) => {setCode(e.target.value); console.log(e.target)}}
              required
              style={{width : '55px' ,height : '35px',cursor:'pointer'}}
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

const ColorManager = () => {
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [viewColor, setViewColor] = useState(null);
  const [editingColor, setEditingColor] = useState(null);
  const [addingColor, setAddingColor] = useState(false);


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
    setTempFilterId('');
    setTempFilterName('');
    setTempFilterCode('');
    setTempFilterDesc('');
    setTempFilterStatus('');
  };
  const filteredColors = colors.filter((color) =>
                      color.id.toString().includes(filterId) &&
                      color.name.toLowerCase().includes(filterName.toLowerCase()) &&
                      color.code.toLowerCase().includes(filterCode.toLowerCase()) &&
                      (color.description || '').toLowerCase().includes(filterDesc.toLowerCase()) &&
                      color.status.toString().includes(filterStatus));
  //
  const navigate = useNavigate();

  useEffect(() => {
    fetchColors();
  }, []);

  const fetchColors = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getColors();
      if (response.success) {
        setColors(response.data);
      } else {
        setError('Failed to load colors');
      }
    } catch {
      setError('Error loading colors');
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
      const response = await deleteColor(deleteConfirmId);
      if (response.success) {
        setSuccess('Color deleted successfully!');
        fetchColors();
      } else {
        setError(response.error || 'Failed to delete color');
      }
    } catch {
      setError('Failed to delete color');
    } finally {
      setSubmitting(false);
      setDeleteConfirmId(null);
    }
  };

  const handleAdd = () => setAddingColor(true);
  const handleEdit = (color) => setEditingColor(color);
  const cancelDelete = () => setDeleteConfirmId(null);
  const handleView = (color) => setViewColor(color);
  const closeViewModal = () => setViewColor(null);

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
        res = await updateColor(id, data);
        if (!res.success) throw new Error(res.error);
        setSuccess('Color updated successfully!');
      } else {
        res = await addColor(data);
        if (!res.success) throw new Error(res.error);
        setSuccess('Color added successfully!');
      }
      setEditingColor(null);
      setAddingColor(false);
      fetchColors();
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
      {addingColor || editingColor ? (
        <ColorForm
          color={editingColor}
          onCancel={() => {
            setAddingColor(false);
            setEditingColor(null);
          }}
          onSave={handleFormSave}
        />
      ) : (
        <Card>
          <Card.Body>
            <Card.Title className="mb-4 d-flex justify-content-between align-items-center">
              Color Management
              <div className="d-flex" style={{ gap: '8px' }}>
                <Button variant="primary" onClick={handleAdd}>
                  + Add Color
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
                {filteredColors.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">No colors found</td>
                  </tr>
                ) : (
                  filteredColors.map((color) => (
                    <tr key={color.id}>
                      <td>{color.id}</td>
                      <td>{color.name}</td>
                      <td>{color.code}</td>
                      <td>{color.description || '-'}</td>
                      <td>
                        <Badge bg={statusMap[color.status]?.variant || 'dark'}>
                          {statusMap[color.status]?.label || color.status}
                        </Badge>
                      </td>
                      <td>{new Date(color.created_on).toLocaleString()}</td>
                      <td>{new Date(color.last_modified_on).toLocaleString()}</td>
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-2" title="View" onClick={() => handleView(color)}><FaEye /></Button>
                        <Button variant="outline-warning" size="sm" className="me-2" title="Edit" onClick={() => handleEdit(color)}><FaEdit /></Button>
                        <Button variant="outline-danger" size="sm" title="Delete" onClick={() => handleDeleteClick(color.id)}><FaTrash /></Button>
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
                Are you sure you want to delete color ID {deleteConfirmId}?
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={cancelDelete} disabled={submitting}>Cancel</Button>
                <Button variant="danger" onClick={confirmDelete} disabled={submitting}>{submitting ? 'Deleting...' : 'Yes, Delete'}</Button>
              </Modal.Footer>
            </Modal>

            <Modal show={!!viewColor} onHide={closeViewModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>View Color Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {viewColor && (
                <>
                  <p><strong>ID:</strong> {viewColor.id}</p>
                  <p><strong>Name:</strong> {viewColor.name}</p>
                  <p><strong>Description:</strong> {viewColor.description || '-'}</p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <Badge bg={statusMap[viewColor.status]?.variant || 'dark'}>
                      {statusMap[viewColor.status]?.label || viewColor.status}
                    </Badge>
                  </p>
                  <p><strong>Created On:</strong> {new Date(viewColor.created_on).toLocaleString()}</p>
                  <p><strong>Last Modified On:</strong> {new Date(viewColor.last_modified_on).toLocaleString()}</p>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="warning" onClick={() => handleEditFromView(viewColor)}>Edit</Button>
              <Button variant="danger" onClick={() => handleDeleteFromView(viewColor)}>Delete</Button>
              <Button variant="secondary" onClick={closeViewModal}>Close</Button>
            </Modal.Footer>
          </Modal>

          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default ColorManager;
