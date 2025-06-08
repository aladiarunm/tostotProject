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

import {
  getCategories,
  deleteCategory,
  addCategory,
  updateCategory,
} from '../../api/category';

const statusMap = {
  A: { label: 'Active', variant: 'success' },
  I: { label: 'Inactive', variant: 'secondary' },
  D: { label: 'Deleted', variant: 'danger' },
};

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

  const [filterText, setFilterText] = useState(''); //changes for filter

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

  const handleAdd = () => setAddingCategory(true);
  const handleEdit = (category) => setEditingCategory(category);
  const cancelDelete = () => setDeleteConfirmId(null);
  const handleView = (category) => setViewCategory(category);
  const closeViewModal = () => setViewCategory(null);

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
        res = await updateCategory(id, data);
        if (!res.success) throw new Error(res.error);
        setSuccess('Category updated successfully!');
      } else {
        res = await addCategory(data);
        if (!res.success) throw new Error(res.error);
        setSuccess('Category added successfully!');
      }
      setEditingCategory(null);
      setAddingCategory(false);
      fetchCategories();
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
      {addingCategory || editingCategory ? (
        <CategoryForm
          category={editingCategory}
          onCancel={() => {
            setAddingCategory(false);
            setEditingCategory(null);
          }}
          onSave={handleFormSave}
        />
      ) : (
        <Card>
          <Card.Body>
            <Card.Title className="mb-4 d-flex justify-content-between align-items-center">
              Category Management
              <Button variant="primary" onClick={handleAdd}>
                + Add Category
              </Button>
            </Card.Title>

            {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
            {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}


            <div className="mb-3"> 
              <input
                type="text"
                className="form-control"
                placeholder="Filter by Category name..."
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
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">No categories found</td>
                  </tr>
                ) : (
                  categories.filter((categories) => categories.name.toLowerCase().includes(filterText.toLowerCase())).map((category) => (
                    <tr key={category.id}>
                      <td>{category.id}</td>
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
                <Modal.Title>View Brand Details</Modal.Title>
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
