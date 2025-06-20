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
import { getSizes, deleteSize, addSize, updateSize } from '../../api/sizes';

const statusMap = {
  A: { label: 'Active', variant: 'success' },
  I: { label: 'Inactive', variant: 'secondary' },
  D: { label: 'Deleted', variant: 'danger' },
};

// Add and Edit Form
const SizeForm = ({ size, onCancel, onSave }) => {
  const [name, setName] = useState(size?.name || '');
  const [code, setCode] = useState(size?.code || '');
  const [description, setDescription] = useState(size?.description || '');
  const [status, setStatus] = useState(size?.status || 'A');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name,code,description, status };
    await onSave(payload, size?.id);
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <h5>{size ? 'Edit Size' : 'Add Size'}</h5>
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

const SizeManager = () => {
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [viewSize, setViewSize] = useState(null);
  const [editingSize, setEditingSize] = useState(null);
  const [addingSize, setAddingSize] = useState(false);


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
  const filteredSizes = sizes.filter((size) =>
                      size.id.toString().includes(filterId) &&
                      size.name.toLowerCase().includes(filterName.toLowerCase()) &&
                      size.code.toString().includes(filterCode) &&
                      (size.description || '').toLowerCase().includes(filterDesc.toLowerCase()) &&
                      size.status.toString().includes(filterStatus));
  //
  const navigate = useNavigate();

  useEffect(() => {
    fetchSizes();
  }, []);

  const fetchSizes = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getSizes();
      if (response.success) {
        setSizes(response.data);
      } else {
        setError('Failed to load sizes');
      }
    } catch {
      setError('Error loading sizes');
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
      const response = await deleteSize(deleteConfirmId);
      if (response.success) {
        setSuccess('Size deleted successfully!');
        fetchSizes();
      } else {
        setError(response.error || 'Failed to delete size');
      }
    } catch {
      setError('Failed to delete size');
    } finally {
      setSubmitting(false);
      setDeleteConfirmId(null);
    }
  };

  const handleAdd = () => setAddingSize(true);
  const handleEdit = (size) => setEditingSize(size);
  const cancelDelete = () => setDeleteConfirmId(null);
  const handleView = (size) => setViewSize(size);
  const closeViewModal = () => setViewSize(null);

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
        res = await updateSize(id, data);
        if (!res.success) throw new Error(res.message);
        setSuccess('Size updated successfully!');
      } else {
        res = await addSize(data);
        if (!res.success) throw new Error(res.message);
        setSuccess('Size added successfully!');
      }
      setEditingSize(null);
      setAddingSize(false);
      fetchSizes();
    } catch (err) {
      setError(err.message.includes("Bad request")? 'Duplicate Name or code entered!':'Operation failed');
      setEditingSize(null);
      setAddingSize(false);
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
      {addingSize || editingSize ? (
        <SizeForm
          size={editingSize}
          onCancel={() => {
            setAddingSize(false);
            setEditingSize(null);
          }}
          onSave={handleFormSave}
        />
      ) : (
        <Card>
          <Card.Body>
            <Card.Title className="mb-4 d-flex justify-content-between align-items-center">
              Size Management
              <div className="d-flex" style={{ gap: '8px' }}>
                <Button variant="primary" onClick={handleAdd}>
                  + Add Size
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
                {filteredSizes.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">No sizes found</td>
                  </tr>
                ) : (
                  filteredSizes.map((size) => (
                    <tr key={size.id}>
                      <td>{size.id}</td>
                      <td>{size.name}</td>
                      <td>{size.code}</td>
                      <td>{size.description || '-'}</td>
                      <td>
                        <Badge bg={statusMap[size.status]?.variant || 'dark'}>
                          {statusMap[size.status]?.label || size.status}
                        </Badge>
                      </td>
                      <td>{new Date(size.created_on).toLocaleString()}</td>
                      <td>{new Date(size.last_modified_on).toLocaleString()}</td>
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-2" title="View" onClick={() => handleView(size)}><FaEye /></Button>
                        <Button variant="outline-warning" size="sm" className="me-2" title="Edit" onClick={() => handleEdit(size)}><FaEdit /></Button>
                        <Button variant="outline-danger" size="sm" title="Delete" onClick={() => handleDeleteClick(size.id)}><FaTrash /></Button>
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
                Are you sure you want to delete size ID {deleteConfirmId}?
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={cancelDelete} disabled={submitting}>Cancel</Button>
                <Button variant="danger" onClick={confirmDelete} disabled={submitting}>{submitting ? 'Deleting...' : 'Yes, Delete'}</Button>
              </Modal.Footer>
            </Modal>

            <Modal show={!!viewSize} onHide={closeViewModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>View Size Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {viewSize && (
                <>
                  <p><strong>ID:</strong> {viewSize.id}</p>
                  <p><strong>Name:</strong> {viewSize.name}</p>
                  <p><strong>Code:</strong> {viewSize.code}</p>
                  <p><strong>Description:</strong> {viewSize.description || '-'}</p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <Badge bg={statusMap[viewSize.status]?.variant || 'dark'}>
                      {statusMap[viewSize.status]?.label || viewSize.status}
                    </Badge>
                  </p>
                  <p><strong>Created On:</strong> {new Date(viewSize.created_on).toLocaleString()}</p>
                  <p><strong>Last Modified On:</strong> {new Date(viewSize.last_modified_on).toLocaleString()}</p>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="warning" onClick={() => handleEditFromView(viewSize)}>Edit</Button>
              <Button variant="danger" onClick={() => handleDeleteFromView(viewSize)}>Delete</Button>
              <Button variant="secondary" onClick={closeViewModal}>Close</Button>
            </Modal.Footer>
          </Modal>

          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default SizeManager;



// import NotFoundPage from "../NotFound";

// function Buyers(){
//     return (
//         <>
//          <h1>size page</h1>
//         <NotFoundPage/>
       
//         </>
//     )
// }
// export default Buyers