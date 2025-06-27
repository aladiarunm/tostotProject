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
  Row, Col
} from 'react-bootstrap';
import { FaEdit, FaFilter, FaTrash} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getProducts, deleteProduct, addProduct, updateProduct } from '../../api/products';

const statusMap = {
  A: { label: 'Active', variant: 'success' },
  I: { label: 'Inactive', variant: 'secondary' },
  D: { label: 'Deleted', variant: 'danger' },
};

// Add and Edit Form
const ProductForm = ({ product, onCancel, onSave }) => {
  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [status, setStatus] = useState(product?.status || 'A');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name, description, status };
    await onSave(payload, product?.id);
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <h5>{product ? 'Edit Product' : 'Add Product'}</h5>
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
            <label>Short Description</label>
            <textarea
            //  value={description}
              //onChange={(e) => setDescription(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label> long Description</label>
            <textarea
             // value={description}
             // onChange={(e) => setDescription(e.target.value)}
              className="form-control"
            />
          </div>
          <Row>
            <Col md={4}>
                <div className="mb-3">
                  <label>Brand</label>
                  <select
                    className="form-control"
                    value={'category_id'}
                    required
                    //onchange={}
                  >
                    <option value="">Select Brand</option>
                    <option value="">Sample 1</option>
                    <option value="">Sample 2</option>
                    <option value="">Sample 3</option>
                  </select>
                </div>
            </Col>
            <Col md={4}>
                <div className="mb-3">
                  <label>Category</label>
                  <select
                    className="form-control"
                    value={'category_id'}
                    required
                    //onchange={}
                  >
                    <option value="">Select Category</option>
                    <option value="">Sample 1</option>
                    <option value="">Sample 2</option>
                    <option value="">Sample 3</option>
                  </select>
                </div>
            </Col>
            <Col md={4}>
                <div className="mb-3">
                  <label>SubCategory</label>
                  <select
                    className="form-control"
                    value={'category_id'}
                    required
                    //onchange={}
                  >
                    <option value="">Select SubCategory</option>
                    <option value="">Sample 1</option>
                    <option value="">Sample 2</option>
                    <option value="">Sample 3</option>
                  </select>
                </div>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
                <div className="mb-3">
                  <label>Color</label>
                  <select
                    className="form-control"
                    value={'category_id'}
                    required
                    //onchange={}
                  >
                    <option value="">Select Color</option>
                    <option value="">Sample 1</option>
                    <option value="">Sample 2</option>
                    <option value="">Sample 3</option>
                  </select>
                </div>
            </Col>
            <Col md={4}>
                <div className="mb-3">
                  <label>Size</label>
                  <select
                    className="form-control"
                    value={'category_id'}
                    required
                    //onchange={}
                  >
                    <option value="">Select Size</option>
                    <option value="">Sample 1</option>
                    <option value="">Sample 2</option>
                    <option value="">Sample 3</option>
                  </select>
                </div>
            </Col>
            <Col md={4}>
                <div className="mb-3">
                  <label>Style</label>
                  <select
                    className="form-control"
                    value={'category_id'}
                    required
                    //onchange={}
                  >
                    <option value="">Select Style</option>
                    <option value="">Sample 1</option>
                    <option value="">Sample 2</option>
                    <option value="">Sample 3</option>
                  </select>
                </div>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
                <div className="mb-3">
                  <label>Material</label>
                  <select
                    className="form-control"
                    value={'category_id'}
                    required
                    //onchange={}
                  >
                    <option value="">Select Material</option>
                    <option value="">Sample 1</option>
                    <option value="">Sample 2</option>
                    <option value="">Sample 3</option>
                  </select>
                </div>
            </Col>
            <Col md={4}>
                <div className="mb-3">
                  <label>Season</label>
                  <select
                    className="form-control"
                    value={'category_id'}
                    required
                    //onchange={}
                  >
                    <option value="">Select Season</option>
                    <option value="">Sample 1</option>
                    <option value="">Sample 2</option>
                    <option value="">Sample 3</option>
                  </select>
                </div>
            </Col>
            <Col md={4}>
                <div className="mb-3">
                  <label>Gender</label>
                  <select
                    className="form-control"
                    value={'category_id'}
                    required
                    //onchange={}
                  >
                    <option value="">Select Gender</option>
                    <option value="">Sample 1</option>
                    <option value="">Sample 2</option>
                    <option value="">Sample 3</option>
                  </select>
                </div>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
                <div className="mb-3">
                  <label>MRP</label>
                  <input
                   // value={name}
                    //onChange={(e) => setName(e.target.value)}
                    required
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label>Min Order Quantity</label>
                  <input
                  //  value={name}
                   // onChange={(e) => setName(e.target.value)}
                    required
                    className="form-control"
                  />
                </div>
            </Col>
            <Col md={4}>
                <div className="mb-3">
                  <label>SellPrice</label>
                  <input
                    //value={name}
                    //onChange={(e) => setName(e.target.value)}
                    required
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label>Max Order Quantity</label>
                  <input
                    //value={name}
                    //onChange={(e) => setName(e.target.value)}
                    required
                    className="form-control"
                  />
                </div>
            </Col>
            <Col md={4}>
                <div className="mb-3">
            <label >Status</label>
            <br></br>
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
            </Col>
          </Row>
          
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

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [addingProduct, setAddingProduct] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);


  const [filterId, setFilterId] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterMRP , setFilterMRP] = useState('');
  const [filterMinOrder, setFilterMinOrder] = useState('');
  const [filterMaxOrder, setFilterMaxOrder] = useState('');
  const [filterSellPrice, setFilterSellPrice] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Define temporary states above (to capture input before filtering)
  const [tempFilterId, setTempFilterId] = useState('');
  const [tempFilterName, setTempFilterName] = useState('');
  const [tempfilterMRP , setTempFilterMRP] = useState('');
  const [tempfilterMinOrder, setTempFilterMinOrder] = useState('');
  const [tempfilterMaxOrder, setTempFilterMaxOrder] = useState('');
  const [tempfilterSellPrice, setTempFilterSellPrice] = useState('');
  const [tempFilterStatus, setTempFilterStatus] = useState('');

  // Button click handler
  const handleApplyFilters = () => {
    setFilterId(tempFilterId);
    setFilterName(tempFilterName);
    setFilterMRP(tempfilterMRP);
    setFilterMaxOrder(tempfilterMaxOrder);
    setFilterMinOrder(tempfilterMinOrder);
    setFilterSellPrice(tempfilterSellPrice);
    setFilterStatus(tempFilterStatus);
  };

  const handleClearFilter = () => {
    setFilterId('');
    setFilterName('');
    setFilterMRP('');
    setFilterMaxOrder('');
    setFilterMinOrder('');
    setFilterSellPrice('');
    setFilterStatus('');
    setTempFilterId('');
    setTempFilterName('');
    setTempFilterMRP('');
    setTempFilterMaxOrder('');
    setTempFilterMinOrder('');
    setTempFilterSellPrice('');
    setTempFilterStatus('');
  };
//   const filteredProducts = products.filter((product) =>
//                       product.id.toString().includes(filterId) &&
//                       product.name.toLowerCase().includes(filterName.toLowerCase()) &&
//                       product.mrp.toString().includes(filterMRP) &&
//                       product.sell_price.toString().includes(filterSellPrice) &&
//                       product.minimum_order_quantity.toString().includes(filterMinOrder) &&
//                       product.maximum_order_quantity.toString().includes(filterMaxOrder) &&
//                       product.status.toString().includes(filterStatus));

const filteredProducts = products.filter((product) =>
  (filterId === '' || product.id.toString().includes(filterId)) &&
  (filterName === '' || product.name.toLowerCase().includes(filterName.toLowerCase())) &&
  (filterMRP === '' || product.mrp >= parseFloat(filterMRP)) &&
  (filterSellPrice === '' || product.sell_price >= parseFloat(filterSellPrice)) &&
  (filterMinOrder === '' || product.minimum_order_quantity >= parseInt(filterMinOrder)) &&
  (filterMaxOrder === '' || product.maximum_order_quantity <= parseInt(filterMaxOrder)) &&
  (filterStatus === '' || product.status.toString().includes(filterStatus))
);

  //
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getProducts();
      if (response.success) {
        setProducts(response.data);
      } else {
        setError('Failed to load products');
      }
    } catch {
      setError('Error loading products');
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
      const response = await deleteProduct(deleteConfirmId);
      if (response.success) {
        setSuccess('Product deleted successfully!');
        fetchProducts();
      } else {
        setError(response.error || 'Failed to delete product');
      }
    } catch {
      setError('Failed to delete product');
    } finally {
      setSubmitting(false);
      setDeleteConfirmId(null);
    }
  };

  const handleAdd = () => setAddingProduct(true);
  const handleEdit = (product) => setEditingProduct(product);
  const cancelDelete = () => setDeleteConfirmId(null);
 // const handleView = (product) => setViewProduct(product);
  const closeViewModal = () => setViewProduct(null);

  const handleEditFromView = (product) => {
    closeViewModal();
    setTimeout(() => {
      handleEdit(product);
    }, 300);
  };

  const handleDeleteFromView = (product) => {
    closeViewModal();
    setTimeout(() => {
      handleDeleteClick(product.id);
    }, 300);
  };


  const handleFormSave = async (data, id) => {
    try {
      let res;
      if (id) {
        res = await updateProduct(id, data);
        if (!res.success) throw new Error(res.message);
        setSuccess('Product updated successfully!');
      } else {
        res = await addProduct(data);
        if (!res.success) throw new Error(res.message);
        setSuccess('Product added successfully!');
      }
      setEditingProduct(null);
      setAddingProduct(false);
      fetchProducts();
    } catch (err) {
      setError(err.message.includes("Bad request")? 'Duplicate Name entered!':'Operation failed');
      setEditingProduct(null);
      setAddingProduct(false);
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
      {addingProduct || editingProduct ? (
        <ProductForm
          product={editingProduct}
          onCancel={() => {
            setAddingProduct(false);
            setEditingProduct(null);
          }}
          onSave={handleFormSave}
        />
      ) : (
        <Card>
          <Card.Body>
            <Card.Title className="mb-4 d-flex justify-content-between align-items-center">
              Product Management
              <div className="d-flex" style={{ gap: '8px' }}>
                <Button variant="primary" onClick={handleAdd}>
                  + Add Product
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
                  style={{ width: '8.5%' }}
                  value={tempFilterId}
                  onChange={(e) => setTempFilterId(e.target.value)}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Filter by Name"
                  style={{ width: '11.5%' }}
                  value={tempFilterName}
                  onChange={(e) => setTempFilterName(e.target.value)}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="by MRP"
                  style={{ width: '8.2%' }}
                  value={tempfilterMRP}
                  onChange={(e) => setTempFilterMRP(e.target.value)}
                /> <input
                  type="text"
                  className="form-control"
                  placeholder="by SellPrice"
                  style={{ width: '9%' }}
                  value={tempfilterSellPrice}
                  onChange={(e) => setTempFilterSellPrice(e.target.value)}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="by Min"
                  style={{ width: '7.5%' }}
                  value={tempfilterMinOrder}
                  onChange={(e) => setTempFilterMinOrder(e.target.value)}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="by Max"
                  style={{ width: '7.5%' }}
                  value={tempfilterMaxOrder}
                  onChange={(e) => setTempFilterMaxOrder(e.target.value)}
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

                <Button variant="primary"  style={{ width: '9%' }} onClick={handleApplyFilters}>
                  <FaFilter/>
                    Filter
                </Button>
                <Button variant="secondary"  style={{ width: '9%' }} onClick={handleClearFilter}>
                    Clear Filter
                </Button>
              </div>
            </div>
            <Row>
                <Col md={8}>
                    <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                        <th style={{ width: '9%' }}>ID</th>
                        <th style={{ width: '15%' }}>Name</th>
                        <th style={{ width: '10%' }}>MRP</th>
                        <th style={{ width: '10.5%' }}>Sell Price</th>
                        <th style={{ width: '10%' }}>Min Orders</th>
                        <th style={{ width: '10%' }}>Max Orders</th>
                        <th style={{ width: '12%' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.length === 0 ? (
                        <tr>
                            <td colSpan="8" className="text-center">No products found</td>
                        </tr>
                        ) : (
                        filteredProducts.map((product) => (
                            <tr
                            key={product.id}
                            onClick={() => setSelectedProduct(product)}
                            style={{ cursor: 'pointer', backgroundColor: selectedProduct?.id === product.id ? '#e9f5ff' : '' }}
                            >
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.mrp}</td>
                            <td>{product.sell_price}</td>
                            <td>{product.minimum_order_quantity}</td>
                            <td>{product.maximum_order_quantity}</td>
                            <td>
                                <Badge bg={statusMap[product.status]?.variant || 'dark'}>
                                {statusMap[product.status]?.label || product.status}
                                </Badge>
                            </td>
                            </tr>
                        ))
                        )}
                    </tbody>
                    </Table>
                </Col>

                <Col md={4}>
                    <Card>
                    <Card.Body>
                        <Card.Title>Product Details</Card.Title>
                        {selectedProduct ? (
                            <>
                            <p><strong>Name:</strong> {selectedProduct.name}</p>
                            <p><strong>Sort Description:</strong>{selectedProduct.short_description}</p>
                            <p><strong>Long Description:</strong> {selectedProduct.long_description || 'N/A'}</p>
                            <hr />
                            <p className="d-flex justify-content-between align-items-center">
                                <span><strong>Brand ID:</strong> {selectedProduct.brand_id}</span>
                                <Button size='sm' variant="primary">Details</Button>
                            </p>
                            <p className="d-flex justify-content-between align-items-center">
                                <span><strong>Category ID:</strong> {selectedProduct.category_id}</span>
                                <Button size='sm' variant="primary">Details</Button>
                            </p>
                            <p className="d-flex justify-content-between align-items-center">
                                <span><strong>Sub-Category ID:</strong> {selectedProduct.sub_category_id}</span>
                                <Button size='sm' variant="primary">Details</Button>
                            </p>
                            <p className="d-flex justify-content-between align-items-center">
                                <span><strong>Color ID:</strong> {selectedProduct.color_id}</span>
                                <Button size='sm' variant="primary">Details</Button>
                            </p>
                            <p className="d-flex justify-content-between align-items-center">
                                <span><strong>Size ID:</strong> {selectedProduct.size_id}</span>
                                <Button size='sm' variant="primary">Details</Button>
                            </p>
                            <p className="d-flex justify-content-between align-items-center">
                                <span><strong>Style ID:</strong> {selectedProduct.style_id}</span>
                                <Button size='sm' variant="primary">Details</Button>
                            </p>
                            <p className="d-flex justify-content-between align-items-center">
                                <span><strong>Material ID:</strong> {selectedProduct.material_id}</span>
                                <Button size='sm' variant="primary">Details</Button>
                            </p>
                            <p className="d-flex justify-content-between align-items-center">
                                <span><strong>Season ID:</strong> {selectedProduct.season_id}</span>
                                <Button size='sm' variant="primary">Details</Button>
                            </p>
                            <p className="d-flex justify-content-between align-items-center">
                                <span><strong>Gender ID:</strong> {selectedProduct.gender_id}</span>
                                <Button size='sm' variant="primary">Details</Button>
                            </p>
                            <hr />
                            <p><strong>Created On:</strong> {new Date(selectedProduct.created_on).toLocaleString()}</p>
                            <p><strong>Last Modified:</strong> {new Date(selectedProduct.last_modified_on).toLocaleString()}</p>

                            <div className="d-flex justify-content-end" style={{ gap: '10px' }}>
                                <Button variant="warning" onClick={() => handleEdit(selectedProduct)}><FaEdit /> Edit</Button>
                                <Button variant="danger" onClick={() => handleDeleteClick(selectedProduct.id)}><FaTrash /> Delete</Button>
                            </div>
                            </>
                        ) : (
                            <p className="text-muted">Select a product to view details</p>
                        )}
                    </Card.Body>
                    </Card>
                </Col>
                </Row>



            <Modal show={!!deleteConfirmId} onHide={cancelDelete} centered>
              <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Are you sure you want to delete product ID {deleteConfirmId}?
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={cancelDelete} disabled={submitting}>Cancel</Button>
                <Button variant="danger" onClick={confirmDelete} disabled={submitting}>{submitting ? 'Deleting...' : 'Yes, Delete'}</Button>
              </Modal.Footer>
            </Modal>

            <Modal show={!!viewProduct} onHide={closeViewModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>View Product Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {viewProduct && (
                <>
                  <p><strong>ID:</strong> {viewProduct.id}</p>
                  <p><strong>Name:</strong> {viewProduct.name}</p>
                  <p><strong>Description:</strong> {viewProduct.description || '-'}</p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <Badge bg={statusMap[viewProduct.status]?.variant || 'dark'}>
                      {statusMap[viewProduct.status]?.label || viewProduct.status}
                    </Badge>
                  </p>
                  <p><strong>Created On:</strong> {new Date(viewProduct.created_on).toLocaleString()}</p>
                  <p><strong>Last Modified On:</strong> {new Date(viewProduct.last_modified_on).toLocaleString()}</p>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="warning" onClick={() => handleEditFromView(viewProduct)}>Edit</Button>
              <Button variant="danger" onClick={() => handleDeleteFromView(viewProduct)}>Delete</Button>
              <Button variant="secondary" onClick={closeViewModal}>Close</Button>
            </Modal.Footer>
          </Modal>

          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default ProductManager;
