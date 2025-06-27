//mock api

let products = [
  {
    id: 1,
    name: 'Cotton Classics',
    short_description: 'Premium cotton apparel and fabrics',
    long_description: null,
    brand_id: 1,
    category_id: 1,
    sub_category_id: 1,
    color_id: 2,
    size_id: 3,
    style_id: 1,
    material_id: 1,
    season_id: 2,
    gender_id: 1,
    mrp: 999.00,
    sell_price: 749.00,
    minimum_order_quantity: 1,
    maximum_order_quantity: 5000,
    status: 'A', // 'A' for active, 'I' for inactive, 'D' for deleted
    created_on: new Date().toISOString(),
    last_modified_on: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Silk & Satin',
    short_description: 'Luxury silk and satin textile products',
    long_description: null,
    brand_id: 2,
    category_id: 2,
    sub_category_id: 2,
    color_id: 3,
    size_id: 2,
    style_id: 2,
    material_id: 2,
    season_id: 1,
    gender_id: 2,
    mrp: 1999.00,
    sell_price: 1599.00,
    minimum_order_quantity: 1,
    maximum_order_quantity: 5000,
    status: 'A',
    created_on: new Date().toISOString(),
    last_modified_on: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Denim Dynasty',
    short_description: 'Quality denim wear and accessories',
    long_description: null,
    brand_id: 3,
    category_id: 3,
    sub_category_id: 3,
    color_id: 1,
    size_id: 4,
    style_id: 3,
    material_id: 3,
    season_id: 4,
    gender_id: 1,
    mrp: 1499.00,
    sell_price: 1199.00,
    minimum_order_quantity: 1,
    maximum_order_quantity: 5000,
    status: 'I',
    created_on: new Date().toISOString(),
    last_modified_on: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'Wool Wonders',
    short_description: 'Cozy wool textiles and knitwear',
    long_description: 'Example long description ...',
    brand_id: 4,
    category_id: 1,
    sub_category_id: 4,
    color_id: 4,
    size_id: 1,
    style_id: 2,
    material_id: 4,
    season_id: 3,
    gender_id: 2,
    mrp: 1799.00,
    sell_price: 1349.00,
    minimum_order_quantity: 1,
    maximum_order_quantity: 5000,
    status: 'A',
    created_on: new Date().toISOString(),
    last_modified_on: new Date().toISOString(),
  },
  {
    id: 5,
    name: 'Linen Legacy',
    short_description: 'Breathable linen fabrics and apparel',
    long_description: null,
    brand_id: 5,
    category_id: 2,
    sub_category_id: 1,
    color_id: 5,
    size_id: 5,
    style_id: 1,
    material_id: 5,
    season_id: 2,
    gender_id: 1,
    mrp: 1299.00,
    sell_price: 999.00,
    minimum_order_quantity: 1,
    maximum_order_quantity: 5000,
    status: 'A',
    created_on: new Date().toISOString(),
    last_modified_on: new Date().toISOString(),
  }
];



const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getProducts = async () => {
  await delay(700);
  return { success: true, data: products };
};

export const addProduct = async (newProduct) => {
  await delay(500);
  const id = products.length ? Math.max(...products.map((b) => b.id)) + 1 : 1;
  const now = new Date().toISOString();
  // By default, if status is not provided, we'll use 'A' (active)
  const product = { id, ...newProduct, status: newProduct.status || 'A', created_on: now, last_modified_on: now };
  products.push(product);
  return { success: true, data: product };
};

export const updateProduct = async (id, updatedData) => {
  await delay(500);
  const index = products.findIndex((b) => b.id === id);
  if (index === -1) return { success: false, error: 'Product not found' };

  // Update the product and modify its last_modified_on timestamp
  const now = new Date().toISOString();
  products[index] = {
    ...products[index],
    ...updatedData,
    last_modified_on: now,
  };
  return { success: true, data: products[index] };
};

export const deleteProduct = async (id) => {
  await delay(500);
  const index = products.findIndex((b) => b.id === id);
  if (index === -1) return { success: false, error: 'Product not found' };

  // Remove the product from the array (or you could update its status to 'D' for deleted)
  const now = new Date().toISOString();
  products[index] = {
    ...products[index],
    status:'D',
    last_modified_on: now,
  };
  return { success: true };
};
