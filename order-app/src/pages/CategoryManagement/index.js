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
import { FaEdit, FaSitemap ,FaFilter ,FaTrash, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {
  getCategories,
  deleteCategory,
  addCategory,
  updateCategory,
} from '../../api/category';

//importing SubCategory
import SubCategoryManager from './SubCategoryManager';

const statusMap = {
  A: { label: 'Active', variant: 'success' },
  I: { label: 'Inactive', variant: 'secondary' },
  D: { label: 'Deleted', variant: 'danger' },
};

// Add and Edit Form
const CategoryForm = ({ category, onCancel, onSave }) => {
  const [name, setName] = useState(category?.name || '');
  const [description, setDescription] = useState(category?.description || '');
  const [status, setStatus] = useState(category?.status || 'A');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name, description, status };
    await onSave(payload, category?.id);
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <h5>{category ? 'Edit Category' : 'Add Category'}</h5>
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


const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [viewCategory, setViewCategory] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [addingCategory, setAddingCategory] = useState(false);

  //for sub category
  const [subCategoryId,setSubCategoryID] = useState('');
  const [subCategoryName,setSubCategoryName] = useState('');
  const [showSubCategory, setShowSubCategory] = useState(false);

  //states for filter
  const [filterId, setFilterId] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterDesc, setFilterDesc] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Define temporary states above (to capture input before filtering)
  const [tempFilterId, setTempFilterId] = useState('');
  const [tempFilterName, setTempFilterName] = useState('');
  const [tempFilterDesc, setTempFilterDesc] = useState('');
  const [tempFilterStatus, setTempFilterStatus] = useState('');

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

const filteredCategories = categories.filter((category) =>
                      category.id.toString().includes(filterId) &&
                      category.name.toLowerCase().includes(filterName.toLowerCase()) &&
                      (category.description || '').toLowerCase().includes(filterDesc.toLowerCase()) &&
                      category.status.toString().includes(filterStatus));

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getCategories();
      if (response.success) {
        setCategories(response.data);
      } else {
        setError('Failed to load categories');
      }
    } catch {
      setError('Error loading categories');
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
      const response = await deleteCategory(deleteConfirmId);
      if (response.success) {
        setSuccess('Category deleted successfully!');
        fetchCategories();
      } else {
        setError(response.error || 'Failed to delete category');
      }
    } catch {
      setError('Failed to delete category');
    } finally {
      setSubmitting(false);
      setDeleteConfirmId(null);
    }
  };

  //
  const navigate = useNavigate();

  const handleAdd = () => setAddingCategory(true);
  const handleEdit = (category) => setEditingCategory(category);
  const cancelDelete = () => setDeleteConfirmId(null);
  const handleView = (category) => setViewCategory(category);
  const closeViewModal = () => setViewCategory(null);

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
        res = await updateCategory(id, data);
        if (!res.success) throw new Error(res.message);
        setSuccess('Category updated successfully!');
      } else {
        res = await addCategory(data);
        if (!res.success) throw new Error(res.message);
        setSuccess('Category added successfully!');
      }
      setEditingCategory(null);
      setAddingCategory(false);
      fetchCategories();
    } catch (err) { 
      setError(err.message.includes("Bad request")? 'Duplicate Name entered!':'Operation failed');
      setEditingCategory(null);
      setAddingCategory(false);
    }
  };

  //Sub Category handling
  const handleSubCategory = (category) => {
    setSubCategoryID(category.id);
    setSubCategoryName(category.name);
    setShowSubCategory(true);
  }

  if (loading)
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );

  return (
    <Container className="py-4">
      {addingCategory || editingCategory ? (
        <CategoryForm
          category={editingCategory}
          onCancel={() => {
            setAddingCategory(false);
            setEditingCategory(null);
          }}
          onSave={handleFormSave}
        />
        ) : showSubCategory ? (
                <SubCategoryManager
                    subCategoryId={subCategoryId}
                    subCategoryName={subCategoryName}
                    onClose={() => setShowSubCategory(false)}
                />) : (
        <Card>
          <Card.Body>
            <Card.Title className="mb-4 d-flex justify-content-between align-items-center">
              Category Management
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
                  style={{ width: '10.5%' }}
                  value={tempFilterId}
                  onChange={(e) => setTempFilterId(e.target.value)}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Filter by Name"
                  style={{ width: '19.5%' }}
                  value={tempFilterName}
                  onChange={(e) => setTempFilterName(e.target.value)}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Filter by Description"
                  style={{ width: '25%' }}
                  value={tempFilterDesc}
                  onChange={(e) => setTempFilterDesc(e.target.value)}
                />
                <select
                  className="form-control"
                  style={{ width: '10%' }}
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
                  <th style={{ width: '19%' }}>Name</th>
                  <th style={{ width: '24%' }}>Description</th>
                  <th style={{ width: '10%' }}>Status</th>
                  <th style={{ width: '9%' }}>Created On</th>
                  <th style={{ width: '9%' }}>Last Modified On</th>
                  <th style={{ width: '13.5%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">No Categories found</td>
                  </tr>
                ) : (
                  filteredCategories.map((category) => (

                    <tr title='Double click to view subCategory' key={category.id} onDoubleClick={()=>{handleSubCategory(category)}}>
                      <td>{category.id}
                        
                      </td>
                      <td>{category.name}</td>
                      <td>{category.description || '-'}</td>
                      <td>
                        <Badge bg={statusMap[category.status]?.variant || 'dark'}>
                          {statusMap[category.status]?.label || category.status}
                        </Badge>
                      </td>
                      <td>{new Date(category.created_on).toLocaleString()}</td>
                      <td>{new Date(category.last_modified_on).toLocaleString()}</td>
                      <td>
                        <Button
                          variant="outline-info"
                          size="sm"
                          className="me-2"
                          title="SubCategory"
                          onClick={()=>{handleSubCategory(category)}}
                        >
                          <FaSitemap />
                        </Button>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          title="View"
                          onClick={() => handleView(category)}
                        >
                          <FaEye />
                        </Button>
                        <Button
                          variant="outline-warning"
                          size="sm"
                          className="me-2"
                          title="Edit"
                          onClick={() => handleEdit(category)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          title="Delete"
                          onClick={() => handleDeleteClick(category.id)}
                        >
                          <FaTrash />
                        </Button>
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
                Are you sure you want to delete category ID {deleteConfirmId}?
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={cancelDelete} disabled={submitting}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={confirmDelete} disabled={submitting}>
                  {submitting ? 'Deleting...' : 'Yes, Delete'}
                </Button>
              </Modal.Footer>
            </Modal>

            <Modal show={!!viewCategory} onHide={closeViewModal} centered>
              <Modal.Header closeButton>
                <Modal.Title>View Category Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {viewCategory && (
                  <>
                    <p><strong>ID:</strong> {viewCategory.id}</p>
                    <p><strong>Name:</strong> {viewCategory.name}</p>
                    <p><strong>Description:</strong> {viewCategory.description || '-'}</p>
                    <p>
                      <strong>Status:</strong>{' '}
                      <Badge bg={statusMap[viewCategory.status]?.variant || 'dark'}>
                        {statusMap[viewCategory.status]?.label || viewCategory.status}
                      </Badge>
                    </p>
                    <p><strong>Created On:</strong> {new Date(viewCategory.created_on).toLocaleString()}</p>
                    <p><strong>Last Modified On:</strong> {new Date(viewCategory.last_modified_on).toLocaleString()}</p>
                  </>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="warning" onClick={() => handleEditFromView(viewCategory)}>Edit</Button>
                <Button variant="danger" onClick={() => handleDeleteFromView(viewCategory)}>Delete</Button>
                <Button variant="secondary" onClick={closeViewModal}>Close</Button>
              </Modal.Footer>
            </Modal>
            
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default CategoryManager;
