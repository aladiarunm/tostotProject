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
import { getSeasons, deleteSeason, addSeason, updateSeason } from '../../api/seasons';

const statusMap = {
  A: { label: 'Active', variant: 'success' },
  I: { label: 'Inactive', variant: 'secondary' },
  D: { label: 'Deleted', variant: 'danger' },
};

// Add and Edit Form
const SeasonForm = ({ season, onCancel, onSave }) => {
  const [name, setName] = useState(season?.name || '');
  const [code, setCode] = useState(season?.code || '');
  const [description, setDescription] = useState(season?.description || '');
  const [status, setStatus] = useState(season?.status || 'A');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name,code,description, status };
    await onSave(payload, season?.id);
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <h5>{season ? 'Edit Season' : 'Add Season'}</h5>
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

const SeasonManager = () => {
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [viewSeason, setViewSeason] = useState(null);
  const [editingSeason, setEditingSeason] = useState(null);
  const [addingSeason, setAddingSeason] = useState(false);


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
  const filteredSeasons = seasons.filter((season) =>
                      season.id.toString().includes(filterId) &&
                      season.name.toLowerCase().includes(filterName.toLowerCase()) &&
                      season.code.toString().includes(filterCode) &&
                      (season.description || '').toLowerCase().includes(filterDesc.toLowerCase()) &&
                      season.status.toString().includes(filterStatus));
  //
  const navigate = useNavigate();

  useEffect(() => {
    fetchSeasons();
  }, []);

  const fetchSeasons = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getSeasons();
      if (response.success) {
        setSeasons(response.data);
      } else {
        setError('Failed to load seasons');
      }
    } catch {
      setError('Error loading seasons');
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
      const response = await deleteSeason(deleteConfirmId);
      if (response.success) {
        setSuccess('Season deleted successfully!');
        fetchSeasons();
      } else {
        setError(response.error || 'Failed to delete season');
      }
    } catch {
      setError('Failed to delete season');
    } finally {
      setSubmitting(false);
      setDeleteConfirmId(null);
    }
  };

  const handleAdd = () => setAddingSeason(true);
  const handleEdit = (season) => setEditingSeason(season);
  const cancelDelete = () => setDeleteConfirmId(null);
  const handleView = (season) => setViewSeason(season);
  const closeViewModal = () => setViewSeason(null);

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
        res = await updateSeason(id, data);
        if (!res.success) throw new Error(res.message);
        setSuccess('Season updated successfully!');
      } else {
        res = await addSeason(data);
        if (!res.success) throw new Error(res.message);
        setSuccess('Season added successfully!');
      }
      setEditingSeason(null);
      setAddingSeason(false);
      fetchSeasons();
    } catch (err) {
      setError(err.message.includes("Bad request")? 'Duplicate Name or code entered!':'Operation failed');
      setEditingSeason(null);
      setAddingSeason(false);
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
      {addingSeason || editingSeason ? (
        <SeasonForm
          season={editingSeason}
          onCancel={() => {
            setAddingSeason(false);
            setEditingSeason(null);
          }}
          onSave={handleFormSave}
        />
      ) : (
        <Card>
          <Card.Body>
            <Card.Title className="mb-4 d-flex justify-content-between align-items-center">
              Season Management
              <div className="d-flex" style={{ gap: '8px' }}>
                <Button variant="primary" onClick={handleAdd}>
                  + Add Season
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
                {filteredSeasons.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">No seasons found</td>
                  </tr>
                ) : (
                  filteredSeasons.map((season) => (
                    <tr key={season.id}>
                      <td>{season.id}</td>
                      <td>{season.name}</td>
                      <td>{season.code}</td>
                      <td>{season.description || '-'}</td>
                      <td>
                        <Badge bg={statusMap[season.status]?.variant || 'dark'}>
                          {statusMap[season.status]?.label || season.status}
                        </Badge>
                      </td>
                      <td>{new Date(season.created_on).toLocaleString()}</td>
                      <td>{new Date(season.last_modified_on).toLocaleString()}</td>
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-2" title="View" onClick={() => handleView(season)}><FaEye /></Button>
                        <Button variant="outline-warning" size="sm" className="me-2" title="Edit" onClick={() => handleEdit(season)}><FaEdit /></Button>
                        <Button variant="outline-danger" size="sm" title="Delete" onClick={() => handleDeleteClick(season.id)}><FaTrash /></Button>
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
                Are you sure you want to delete season ID {deleteConfirmId}?
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={cancelDelete} disabled={submitting}>Cancel</Button>
                <Button variant="danger" onClick={confirmDelete} disabled={submitting}>{submitting ? 'Deleting...' : 'Yes, Delete'}</Button>
              </Modal.Footer>
            </Modal>

            <Modal show={!!viewSeason} onHide={closeViewModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>View Season Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {viewSeason && (
                <>
                  <p><strong>ID:</strong> {viewSeason.id}</p>
                  <p><strong>Name:</strong> {viewSeason.name}</p>
                  <p><strong>Code:</strong> {viewSeason.code}</p>
                  <p><strong>Description:</strong> {viewSeason.description || '-'}</p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <Badge bg={statusMap[viewSeason.status]?.variant || 'dark'}>
                      {statusMap[viewSeason.status]?.label || viewSeason.status}
                    </Badge>
                  </p>
                  <p><strong>Created On:</strong> {new Date(viewSeason.created_on).toLocaleString()}</p>
                  <p><strong>Last Modified On:</strong> {new Date(viewSeason.last_modified_on).toLocaleString()}</p>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="warning" onClick={() => handleEditFromView(viewSeason)}>Edit</Button>
              <Button variant="danger" onClick={() => handleDeleteFromView(viewSeason)}>Delete</Button>
              <Button variant="secondary" onClick={closeViewModal}>Close</Button>
            </Modal.Footer>
          </Modal>

          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default SeasonManager;